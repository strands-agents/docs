/**
 * Graph vs Background Tools — Side-by-side comparison
 *
 * Same 3-layer content pipeline executed two different ways:
 *
 *   Layer 1 (parallel):  market_analyst, tech_researcher, competitor_scout
 *   Layer 2 (parallel):  marketing_writer (needs market + competitors),
 *                        technical_writer (needs tech + competitors)
 *   Layer 3:             editor (combines both drafts into final announcement)
 *
 * Approach A — Graph: Explicit DAG with 6 nodes. Graph orchestrates parallelism
 *             and dependencies. No model decides what runs when.
 *
 * Approach B — Single Agent + backgroundTools: One coordinator agent with 5
 *             sub-agents as background tools. The model discovers the pipeline
 *             and dispatches accordingly.
 *
 * Both produce the same artifact: a product launch announcement.
 */

import {
  Agent,
  BedrockModel,
  Graph,
  BeforeToolCallEvent,
  AfterToolCallEvent,
  BackgroundTaskDispatchEvent,
  BackgroundTaskResultEvent,
} from '@strands-agents/sdk'
import { BeforeNodeCallEvent, AfterNodeCallEvent } from '@strands-agents/sdk/multiagent'

const modelId = process.argv.find((_, i) => process.argv[i - 1] === '--model')
const model = new BedrockModel({ ...(modelId && { modelId }), region: 'us-east-1' })

const product = 'QuantumDB — a distributed database that uses quantum-inspired algorithms for sub-millisecond queries at petabyte scale'

// ── Shared agent factories (used by both approaches) ────────────────────────

function createMarketAnalyst() {
  return new Agent({
    model,
    printer: false,
    id: 'market_analyst',
    name: 'market_analyst',
    description: 'Analyzes market landscape, target audience, and market sizing for a product launch.',
    systemPrompt:
      'You are a market analyst. Given a product description, produce a concise market analysis (under 200 words) covering: ' +
      'target market, market size estimate, key buyer personas, and go-to-market positioning. Be specific and data-oriented.',
  })
}

function createTechResearcher() {
  return new Agent({
    model,
    printer: false,
    id: 'tech_researcher',
    name: 'tech_researcher',
    description: 'Researches and summarizes the technical architecture and key differentiators of a product.',
    systemPrompt:
      'You are a technical researcher. Given a product description, produce a concise technical summary (under 200 words) covering: ' +
      'architecture highlights, key technical differentiators, performance characteristics, and how it compares to existing approaches.',
  })
}

function createCompetitorScout() {
  return new Agent({
    model,
    printer: false,
    id: 'competitor_scout',
    name: 'competitor_scout',
    description: 'Identifies and analyzes key competitors and their positioning relative to the product.',
    systemPrompt:
      'You are a competitive intelligence analyst. Given a product description, produce a concise competitor analysis (under 200 words) covering: ' +
      '3-4 key competitors, their strengths/weaknesses, and how this product differentiates.',
  })
}

function createMarketingWriter() {
  return new Agent({
    model,
    printer: false,
    id: 'marketing_writer',
    name: 'marketing_writer',
    description: 'Writes marketing copy for a product launch using market analysis and competitor intelligence.',
    systemPrompt:
      'You are a marketing copywriter. Given market analysis and competitor intelligence, write a compelling ' +
      'marketing section (under 250 words) for a product launch announcement. Include: value proposition, ' +
      'key benefits, and competitive positioning. Write for a technical decision-maker audience.',
  })
}

function createTechnicalWriter() {
  return new Agent({
    model,
    printer: false,
    id: 'technical_writer',
    name: 'technical_writer',
    description: 'Writes the technical section of a product launch announcement using research and competitor data.',
    systemPrompt:
      'You are a technical writer. Given technical research and competitor analysis, write a clear ' +
      'technical section (under 250 words) for a product launch announcement. Cover: architecture, ' +
      'performance benchmarks, and technical advantages over competitors.',
  })
}

function createEditor() {
  return new Agent({
    model,
    printer: false,
    id: 'editor',
    name: 'editor',
    description: 'Combines marketing and technical drafts into a polished final product launch announcement.',
    systemPrompt:
      'You are a senior editor. Given a marketing draft and a technical draft, combine them into a single ' +
      'polished product launch announcement (under 600 words). Structure: headline, executive summary, ' +
      'market opportunity, technical innovation, competitive advantage, and call to action. ' +
      'Make it professional, compelling, and cohesive.',
  })
}

// ── Approach A: Graph ───────────────────────────────────────────────────────

interface RunResult {
  ms: number
  output: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
}

async function runGraph(): Promise<RunResult> {
  const graph = new Graph({
    id: 'launch-pipeline',
    nodes: [
      createMarketAnalyst(),
      createTechResearcher(),
      createCompetitorScout(),
      createMarketingWriter(),
      createTechnicalWriter(),
      createEditor(),
    ],
    edges: [
      // Layer 1 → Layer 2
      ['market_analyst', 'marketing_writer'],
      ['competitor_scout', 'marketing_writer'],
      ['tech_researcher', 'technical_writer'],
      ['competitor_scout', 'technical_writer'],
      // Layer 2 → Layer 3
      ['marketing_writer', 'editor'],
      ['technical_writer', 'editor'],
    ],
  })

  const start = Date.now()

  graph.addHook(BeforeNodeCallEvent, (e) => {
    console.log(`  [+${((Date.now() - start) / 1000).toFixed(1)}s] ${e.nodeId} started`)
  })
  graph.addHook(AfterNodeCallEvent, (e) => {
    console.log(`  [+${((Date.now() - start) / 1000).toFixed(1)}s] ${e.nodeId} finished${e.error ? ` (error: ${e.error.message})` : ''}`)
  })

  const result = await graph.invoke(`Product: ${product}`)
  const ms = Date.now() - start

  const output = result.content
    .filter((b) => b.type === 'textBlock')
    .map((b) => 'text' in b ? (b as { text: string }).text : '')
    .join('\n')

  return {
    ms,
    output,
    inputTokens: result.usage?.inputTokens ?? 0,
    outputTokens: result.usage?.outputTokens ?? 0,
    totalTokens: result.usage?.totalTokens ?? 0,
  }
}

// ── Shared coordinator prompt ────────────────────────────────────────────────

const coordinatorPrompt =
  'You are a silent orchestrator. You NEVER produce text — only tool calls.\n\n' +
  'PIPELINE:\n' +
  '1. Call market_analyst, tech_researcher, competitor_scout simultaneously.\n' +
  '2. When results arrive, call marketing_writer (pass it market + competitor data) and technical_writer (pass it tech + competitor data) simultaneously.\n' +
  '3. When drafts arrive, call editor (pass it both drafts).\n' +
  '4. Return the editor\'s output verbatim.\n\n' +
  'RULES:\n' +
  '- NEVER write prose, commentary, or narration between tool calls.\n' +
  '- ONLY emit tool_use blocks. Nothing else.\n' +
  '- Pass the FULL text from earlier results into later tool inputs — do not summarize.'

// ── Approach B: Single Agent + standard tools (sequential) ──────────────────

async function runStandard(): Promise<RunResult> {
  const coordinator = new Agent({
    model,
    systemPrompt: coordinatorPrompt,
    tools: [
      createMarketAnalyst(),
      createTechResearcher(),
      createCompetitorScout(),
      createMarketingWriter(),
      createTechnicalWriter(),
      createEditor(),
    ],
    printer: false,
  })

  const start = Date.now()

  coordinator.addHook(BeforeToolCallEvent, (e) => {
    if (e.toolUse.name !== 'strands_structured_output')
      console.log(`  [+${((Date.now() - start) / 1000).toFixed(1)}s] ${e.toolUse.name} started`)
  })
  coordinator.addHook(AfterToolCallEvent, (e) => {
    if (e.toolUse.name !== 'strands_structured_output')
      console.log(`  [+${((Date.now() - start) / 1000).toFixed(1)}s] ${e.toolUse.name} finished`)
  })

  const result = await coordinator.invoke(`Product: ${product}`)
  const ms = Date.now() - start
  const output = result.toString()
  const usage = result.metrics?.accumulatedUsage

  return {
    ms,
    output,
    inputTokens: usage?.inputTokens ?? 0,
    outputTokens: usage?.outputTokens ?? 0,
    totalTokens: usage?.totalTokens ?? 0,
  }
}

// ── Approach C: Single Agent + backgroundTools (parallel) ───────────────────

async function runBackground(): Promise<RunResult> {
  const coordinator = new Agent({
    model,
    systemPrompt: coordinatorPrompt,
    backgroundTools: [
      createMarketAnalyst(),
      createTechResearcher(),
      createCompetitorScout(),
      createMarketingWriter(),
      createTechnicalWriter(),
      createEditor(),
    ],
    printer: false,
  })

  const start = Date.now()

  coordinator.addHook(BackgroundTaskDispatchEvent, (e) => {
    console.log(`  [+${((Date.now() - start) / 1000).toFixed(1)}s] ${e.toolUse.name} dispatched (bg)`)
  })
  coordinator.addHook(BackgroundTaskResultEvent, (e) => {
    console.log(`  [+${((Date.now() - start) / 1000).toFixed(1)}s] ${e.taskName} result arrived (bg)`)
  })

  const result = await coordinator.invoke(`Product: ${product}`)
  const ms = Date.now() - start
  const output = result.toString()
  const usage = result.metrics?.accumulatedUsage

  return {
    ms,
    output,
    inputTokens: usage?.inputTokens ?? 0,
    outputTokens: usage?.outputTokens ?? 0,
    totalTokens: usage?.totalTokens ?? 0,
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

console.log('\n' + '='.repeat(70))
console.log('  STANDARD vs BACKGROUND vs GRAPH — Product Launch Pipeline')
console.log('='.repeat(70))
console.log(`  Product: ${product}`)
console.log(`  Pipeline: 3 researchers → 2 writers → 1 editor (6 agents)`)
console.log('='.repeat(70))

console.log('\n--- APPROACH A: Standard tools (sequential) ---\n')
const stdResult = await runStandard()
console.log(`\n  Standard: ${(stdResult.ms / 1000).toFixed(1)}s`)

console.log('\n--- APPROACH B: Background tools (parallel dispatch) ---\n')
const bgResult = await runBackground()
console.log(`\n  Background: ${(bgResult.ms / 1000).toFixed(1)}s`)

console.log('\n--- APPROACH C: Graph (explicit DAG) ---\n')
const graphResult = await runGraph()
console.log(`\n  Graph: ${(graphResult.ms / 1000).toFixed(1)}s`)

// ── Outputs ─────────────────────────────────────────────────────────────────

console.log('\n--- STANDARD OUTPUT ---\n')
console.log(stdResult.output)
console.log('\n--- BACKGROUND OUTPUT ---\n')
console.log(bgResult.output)
console.log('\n--- GRAPH OUTPUT ---\n')
console.log(graphResult.output)

// ── Results (printed last for easy reading) ─────────────────────────────────

const bgVsStd = stdResult.ms / bgResult.ms
const graphVsStd = stdResult.ms / graphResult.ms

const pad = (s: string, n: number) => s.padEnd(n)

console.log('\n' + '='.repeat(70))
console.log('  RESULTS')
console.log('='.repeat(70))
console.log()
console.log(`  ${pad('Metric', 24)} ${pad('Standard', 14)} ${pad('Background', 14)} Graph`)
console.log(`  ${'-'.repeat(24)} ${'-'.repeat(14)} ${'-'.repeat(14)} ${'-'.repeat(14)}`)
console.log(`  ${pad('Wall clock', 24)} ${pad((stdResult.ms / 1000).toFixed(1) + 's', 14)} ${pad((bgResult.ms / 1000).toFixed(1) + 's', 14)} ${(graphResult.ms / 1000).toFixed(1)}s`)
console.log(`  ${pad('Speedup', 24)} ${pad('baseline', 14)} ${pad(bgVsStd.toFixed(2) + 'x', 14)} ${graphVsStd.toFixed(2)}x`)
console.log(`  ${pad('Input tokens', 24)} ${pad(String(stdResult.inputTokens), 14)} ${pad(String(bgResult.inputTokens), 14)} ${graphResult.inputTokens}`)
console.log(`  ${pad('Output tokens', 24)} ${pad(String(stdResult.outputTokens), 14)} ${pad(String(bgResult.outputTokens), 14)} ${graphResult.outputTokens}`)
console.log(`  ${pad('Total tokens', 24)} ${pad(String(stdResult.totalTokens), 14)} ${pad(String(bgResult.totalTokens), 14)} ${graphResult.totalTokens}`)
console.log(`  ${pad('Output length (chars)', 24)} ${pad(String(stdResult.output.length), 14)} ${pad(String(bgResult.output.length), 14)} ${graphResult.output.length}`)
console.log()
console.log('  Tradeoffs:')
console.log('    Standard:    Simplest code. No parallelism. Slowest.')
console.log('    Background:  One agent + prompt. Model discovers parallelism. Middle ground.')
console.log('    Graph:       Explicit DAG. Maximum parallelism. Fastest. Requires upfront design.')
console.log()
console.log('='.repeat(70))
