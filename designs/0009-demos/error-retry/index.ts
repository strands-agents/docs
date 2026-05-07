/**
 * Error Handling & Retry Demo
 *
 * Demonstrates the three-layer retry mechanism for background tasks:
 *
 *   Layer 1: Tool-level retry (inside the fork) — via AfterToolCallEvent hook
 *   Layer 2: Task-level retry (developer-controlled) — via BackgroundTaskResultEvent hook
 *   Layer 3: Model-driven retry — model sees the error and re-calls the tool
 *
 * Scenario: A research coordinator dispatches 3 background researchers.
 * One researcher (market_researcher) has a flaky API that fails on the first call.
 * A Layer 2 retry hook catches the failure and re-dispatches automatically.
 * The model never sees the error — it gets the successful result transparently.
 */

import {
  Agent,
  BedrockModel,
  tool,
  BackgroundTaskDispatchEvent,
  BackgroundTaskResultEvent,
} from '@strands-agents/sdk'
import { z } from 'zod'

const modelId = process.argv.find((_, i) => process.argv[i - 1] === '--model')
const model = new BedrockModel({ ...(modelId && { modelId }), region: 'us-east-1' })

// ── Tool stubs ──────────────────────────────────────────────────────────────

const techResearcher = tool({
  name: 'research_tech',
  description: 'Research technical landscape for a given topic. Always succeeds.',
  inputSchema: z.object({ topic: z.string() }),
  callback: async (input) => {
    await new Promise((r) => setTimeout(r, 5000))
    return `Tech research for "${input.topic}": Found 12 relevant open-source projects, 3 major frameworks (Strands, LangGraph, CrewAI), and growing adoption of async tool patterns. Key trend: model-driven concurrency is emerging as a differentiator.`
  },
})

const policyResearcher = tool({
  name: 'research_policy',
  description: 'Research governance and policy implications. Always succeeds.',
  inputSchema: z.object({ topic: z.string() }),
  callback: async (input) => {
    await new Promise((r) => setTimeout(r, 4000))
    return `Policy research for "${input.topic}": Enterprise adoption requires audit trails for concurrent operations. Key concerns: task isolation (preventing data leakage between forks), cancellation guarantees (no orphaned processes), and observability (tracking background task lifecycle for compliance).`
  },
})

// Flaky tool: fails on first call, succeeds on second
let marketCallCount = 0

const marketResearcher = tool({
  name: 'research_market',
  description: 'Research market landscape. Note: this API is flaky and may fail intermittently.',
  inputSchema: z.object({ topic: z.string() }),
  callback: async (input) => {
    marketCallCount++
    await new Promise((r) => setTimeout(r, 3000))
    if (marketCallCount === 1) {
      throw new Error('Market API timeout: upstream provider returned 503 after 3000ms')
    }
    return `Market research for "${input.topic}": $2.4B TAM for AI agent tooling (2026). Background task scheduling identified as top-3 requested feature by enterprise users. Competitors: LangGraph (checkpoint-based), CrewAI (thread-based), Mastra (background flag). None offer model-driven dispatch.`
  },
})

// ── Run ─────────────────────────────────────────────────────────────────────

console.log('\n' + '='.repeat(70))
console.log('  ERROR HANDLING & RETRY DEMO')
console.log('='.repeat(70))
console.log('  Scenario: 3 background researchers, one with a flaky API')
console.log('  research_market will fail on first call, succeed on retry')
console.log('  Layer 2 retry hook re-dispatches automatically')
console.log('='.repeat(70))

const coordinator = new Agent({
  model,
  systemPrompt:
    'You are a research coordinator. Dispatch all three researchers in parallel, ' +
    'then synthesize their findings into a brief summary. ' +
    'Include specific data points from each researcher.',
  backgroundTools: [techResearcher, policyResearcher, marketResearcher],
  printer: false,
})

const start = Date.now()
const elapsed = () => `+${((Date.now() - start) / 1000).toFixed(1)}s`

// Track dispatches
coordinator.addHook(BackgroundTaskDispatchEvent, (e) => {
  console.log(`  [${elapsed()}] ${e.toolUse.name} dispatched`)
})

// Layer 2 retry: catch errors, retry once
let retryCount = 0
let errorReachedModel = false
const maxRetries = 1

coordinator.addHook(BackgroundTaskResultEvent, (e) => {
  if (e.result.status === 'error') {
    if (retryCount < maxRetries) {
      retryCount++
      e.retry = true
      console.log(`  [${elapsed()}] ${e.taskName} FAILED: ${e.error?.message ?? 'unknown error'}`)
      console.log(`  [${elapsed()}] ${e.taskName} RETRYING (attempt ${retryCount + 1})...`)
    } else {
      errorReachedModel = true
      console.log(`  [${elapsed()}] ${e.taskName} FAILED: retries exhausted, error will reach model`)
    }
  } else {
    console.log(`  [${elapsed()}] ${e.taskName} result arrived`)
  }
})

console.log('\n--- Running with background tools + retry hook ---\n')

const result = await coordinator.invoke(
  'Research the landscape of background task scheduling in AI agent frameworks. ' +
  'Cover technical, market, and policy dimensions.'
)

const wallClock = Date.now() - start

console.log('\n--- COORDINATOR OUTPUT ---\n')
console.log(result.toString())

const usage = result.metrics?.accumulatedUsage
const pad = (s: string, n: number) => s.padEnd(n)

console.log('\n' + '='.repeat(70))
console.log('  RESULTS')
console.log('='.repeat(70))
console.log()
console.log(`  ${pad('Metric', 28)} Value`)
console.log(`  ${'-'.repeat(28)} ${'-'.repeat(30)}`)
console.log(`  ${pad('Wall clock', 28)} ${(wallClock / 1000).toFixed(1)}s`)
console.log(`  ${pad('Input tokens', 28)} ${usage?.inputTokens ?? 'N/A'}`)
console.log(`  ${pad('Output tokens', 28)} ${usage?.outputTokens ?? 'N/A'}`)
console.log(`  ${pad('Total tokens', 28)} ${usage?.totalTokens ?? 'N/A'}`)
console.log(`  ${pad('Agent cycles', 28)} ${result.metrics?.cycleCount ?? 'N/A'}`)
console.log(`  ${pad('Output length (chars)', 28)} ${result.toString().length}`)
console.log()
console.log('  Retry Mechanics:')
console.log(`  ${pad('research_market calls', 28)} ${marketCallCount}`)
console.log(`  ${pad('Layer 2 retries fired', 28)} ${retryCount}`)
console.log(`  ${pad('Error reached model', 28)} ${errorReachedModel ? 'YES (retries exhausted)' : 'NO (handled transparently)'}`)
console.log()
console.log('='.repeat(70))
