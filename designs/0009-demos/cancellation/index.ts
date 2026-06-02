/**
 * Cancellation Demo
 *
 * Proves that background task cancellation works: dispatch multiple tasks,
 * get the first result, cancel the rest immediately.
 *
 * Scenario: Find when the Strands Agents project was founded.
 * Three search agents with different speeds are dispatched in parallel via
 * invokeBackground(). The fast one returns the answer in ~10s (model + tool).
 * The slow ones would take 60-90s. After the fast result, the developer
 * cancels the slow ones — they stop immediately.
 */

import { Agent, BedrockModel, tool } from '@strands-agents/sdk'
import { z } from 'zod'

const modelId = process.argv.find((_, i) => process.argv[i - 1] === '--model')
const model = new BedrockModel({ ...(modelId && { modelId }), region: 'us-east-1' })

// ── Search agents with very different tool delays ───────────────────────────

function createSearchAgent(name: string, delayMs: number, result: string) {
  const searchTool = tool({
    name: 'search',
    description: 'Execute the search.',
    inputSchema: z.object({ query: z.string() }),
    callback: async () => {
      await new Promise((r) => setTimeout(r, delayMs))
      return result
    },
  })

  return new Agent({
    model,
    name,
    tools: [searchTool],
    systemPrompt: 'Call the search tool with the user query. Return ONLY the tool result, nothing else.',
    printer: false,
  })
}

// Fast: 5s tool delay (~10-15s total with model overhead)
const quickAgent = createSearchAgent('quick_search', 5000,
  'FOUND: The Strands Agents project was founded in October 2024 by the AWS AI team. Open-sourced March 2025.')

// Slow: 60s tool delay (~65-70s total)
const docsAgent = createSearchAgent('docs_search', 60000,
  'DOCS: Strands Agents documentation confirms the project started in late 2024.')

// Slowest: 90s tool delay (~95-100s total)
const archiveAgent = createSearchAgent('archive_search', 90000,
  'ARCHIVE: Historical records show early commits dating to October 2024.')

// ── Run ─────────────────────────────────────────────────────────────────────

console.log('\n' + '='.repeat(70))
console.log('  CANCELLATION DEMO')
console.log('='.repeat(70))
console.log('  Question: "When was the Strands Agents project founded?"')
console.log('  3 search agents dispatched via invokeBackground():')
console.log('    quick_search   — fast tool (~5s + model overhead)')
console.log('    docs_search    — slow tool (~60s + model overhead)')
console.log('    archive_search — slowest tool (~90s + model overhead)')
console.log('  After the fast result arrives, cancel the other two.')
console.log('='.repeat(70))

const start = Date.now()
const elapsed = () => `+${((Date.now() - start) / 1000).toFixed(1)}s`

const query = 'When was the Strands Agents project founded?'

// Dispatch all three search agents in parallel
const taskQuick = quickAgent.invokeBackground(query, { name: 'quick_search' })
const taskDocs = docsAgent.invokeBackground(query, { name: 'docs_search' })
const taskArchive = archiveAgent.invokeBackground(query, { name: 'archive_search' })

console.log(`\n  [${elapsed()}] Dispatched 3 search agents`)
console.log(`    quick_search:   ${taskQuick.status}`)
console.log(`    docs_search:    ${taskDocs.status}`)
console.log(`    archive_search: ${taskArchive.status}`)

// Wait for just the fast one
const quickResult = await taskQuick
console.log(`\n  [${elapsed()}] quick_search completed!`)
console.log(`    Result: "${String(quickResult).slice(0, 80)}..."`)

// The other two should still be running
console.log(`\n  [${elapsed()}] Status check before cancel:`)
console.log(`    quick_search:   ${taskQuick.status}`)
console.log(`    docs_search:    ${taskDocs.status}`)
console.log(`    archive_search: ${taskArchive.status}`)

// Cancel the slow ones
taskDocs.cancel()
taskArchive.cancel()

console.log(`\n  [${elapsed()}] Cancelled docs_search and archive_search`)
console.log(`    quick_search:   ${taskQuick.status}`)
console.log(`    docs_search:    ${taskDocs.status}`)
console.log(`    archive_search: ${taskArchive.status}`)

const wallClock = Date.now() - start

const pad = (s: string, n: number) => s.padEnd(n)

console.log('\n' + '='.repeat(70))
console.log('  RESULTS')
console.log('='.repeat(70))
console.log()
console.log(`  ${pad('Metric', 28)} Value`)
console.log(`  ${'-'.repeat(28)} ${'-'.repeat(30)}`)
console.log(`  ${pad('Wall clock', 28)} ${(wallClock / 1000).toFixed(1)}s`)
console.log(`  ${pad('Without cancel', 28)} ~90s+ (waiting for archive_search)`)
console.log(`  ${pad('Time saved', 28)} ~${Math.max(0, 90 - wallClock / 1000).toFixed(0)}s`)
console.log(`  ${pad('quick_search status', 28)} ${taskQuick.status}`)
console.log(`  ${pad('docs_search status', 28)} ${taskDocs.status}`)
console.log(`  ${pad('archive_search status', 28)} ${taskArchive.status}`)
console.log()
console.log('='.repeat(70))

process.exit(0)
