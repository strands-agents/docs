/**
 * Getting Started — backgroundTools
 *
 * The simplest demo of background task scheduling. A research assistant searches
 * 3 sources (web, docs, news). Each search takes 5 seconds.
 *
 * Standard:  3 searches run sequentially  → ~15s of tool time
 * Background: 3 searches run concurrently → ~5s of tool time
 */

import { Agent, BedrockModel, tool } from '@strands-agents/sdk'
import { z } from 'zod'

const modelId = process.argv.find((_, i) => process.argv[i - 1] === '--model')
const model = new BedrockModel({ ...(modelId && { modelId }), region: 'us-east-1' })

const searchWeb = tool({
  name: 'search_web',
  description: 'Search the web for recent information on a topic.',
  inputSchema: z.object({ query: z.string() }),
  callback: async (input) => {
    await new Promise((r) => setTimeout(r, 5000))
    return `Web results for "${input.query}": Found 3 relevant articles on recent developments in this area, including industry analysis and expert commentary.`
  },
})

const searchDocs = tool({
  name: 'search_docs',
  description: 'Search technical documentation and reference materials.',
  inputSchema: z.object({ query: z.string() }),
  callback: async (input) => {
    await new Promise((r) => setTimeout(r, 5000))
    return `Documentation results for "${input.query}": Found official guides, API references, and best-practice recommendations from authoritative sources.`
  },
})

const searchNews = tool({
  name: 'search_news',
  description: 'Search recent news articles and press releases.',
  inputSchema: z.object({ query: z.string() }),
  callback: async (input) => {
    await new Promise((r) => setTimeout(r, 5000))
    return `News results for "${input.query}": Found 5 recent articles covering market trends, product launches, and analyst perspectives.`
  },
})

const systemPrompt =
  'You are a research assistant. When asked a question, search all 3 sources ' +
  '(web, docs, news) and write a brief summary of your findings.'

const prompt = 'What are the latest trends in AI agent frameworks?'

// ── Standard ────────────────────────────────────────────────────────────────

console.log('--- STANDARD (sequential) ---\n')
const standardAgent = new Agent({ model, systemPrompt, tools: [searchWeb, searchDocs, searchNews] })
const standardStart = Date.now()
const standardResult = await standardAgent.invoke(prompt)
const standardMs = Date.now() - standardStart

// ── Background ──────────────────────────────────────────────────────────────

console.log('\n--- BACKGROUND (concurrent) ---\n')
const backgroundAgent = new Agent({ model, systemPrompt, backgroundTools: [searchWeb, searchDocs, searchNews] })
const backgroundStart = Date.now()
const backgroundResult = await backgroundAgent.invoke(prompt)
const backgroundMs = Date.now() - backgroundStart

// ── Results ─────────────────────────────────────────────────────────────────

const stdUsage = standardResult.metrics?.accumulatedUsage
const bgUsage = backgroundResult.metrics?.accumulatedUsage

const pad = (s: string, n: number) => s.padEnd(n)

console.log('\n' + '='.repeat(60))
console.log('  RESULTS')
console.log('='.repeat(60))
console.log()
console.log(`  ${pad('Metric', 24)} ${pad('Standard', 16)} Background`)
console.log(`  ${'-'.repeat(24)} ${'-'.repeat(16)} ${'-'.repeat(16)}`)
console.log(`  ${pad('Wall clock', 24)} ${pad((standardMs / 1000).toFixed(1) + 's', 16)} ${(backgroundMs / 1000).toFixed(1)}s`)
console.log(`  ${pad('Speedup', 24)} ${pad('baseline', 16)} ${(standardMs / backgroundMs).toFixed(2)}x`)
console.log(`  ${pad('Input tokens', 24)} ${pad(String(stdUsage?.inputTokens ?? 'N/A'), 16)} ${bgUsage?.inputTokens ?? 'N/A'}`)
console.log(`  ${pad('Output tokens', 24)} ${pad(String(stdUsage?.outputTokens ?? 'N/A'), 16)} ${bgUsage?.outputTokens ?? 'N/A'}`)
console.log(`  ${pad('Total tokens', 24)} ${pad(String(stdUsage?.totalTokens ?? 'N/A'), 16)} ${bgUsage?.totalTokens ?? 'N/A'}`)
console.log(`  ${pad('Agent cycles', 24)} ${pad(String(standardResult.metrics?.cycleCount ?? 'N/A'), 16)} ${backgroundResult.metrics?.cycleCount ?? 'N/A'}`)
console.log(`  ${pad('Output length (chars)', 24)} ${pad(String(standardResult.toString().length), 16)} ${backgroundResult.toString().length}`)
console.log()
console.log('='.repeat(60))
