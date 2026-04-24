/**
 * Fire-and-Forget MCP Demo — Standard vs Background
 *
 * Demonstrates background tasks with MCP tools in a fire-and-forget pattern.
 * A project manager agent reviews a sprint and composes status update emails
 * for 4 team members. The send_email tool (provided by a stub Gmail MCP server
 * over stdio) takes 3-5s per email to simulate SMTP delivery.
 *
 * Standard:  Agent composes each email, waits for send_email to complete before
 *            moving to the next team member. Emails block the main flow.
 * Background: send_email is a backgroundTool — the agent fires off each email
 *             as it's composed and immediately moves to the next. All 4 emails
 *             send concurrently while the agent continues working.
 */

import {
  Agent,
  BedrockModel,
  McpClient,
  BeforeToolCallEvent,
  AfterToolCallEvent,
  BackgroundTaskDispatchEvent,
  BackgroundTaskResultEvent,
} from '@strands-agents/sdk'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── MCP client factory ──────────────────────────────────────────────────────

function createGmailMcpClient(): McpClient {
  return new McpClient({
    transport: new StdioClientTransport({
      command: 'node',
      args: [join(__dirname, 'gmail-mcp-server.js')],
    }),
  })
}

// ── Common config ───────────────────────────────────────────────────────────

const modelId = process.argv.find((_, i) => process.argv[i - 1] === '--model')
const model = new BedrockModel({ ...(modelId && { modelId }), region: 'us-east-1' })

const systemPrompt =
  'You are a project manager sending sprint status update emails to your team.\n\n' +
  'You have a send_email tool that sends emails via Gmail.\n\n' +
  'For EACH team member below, compose a personalized 2-3 sentence status update email ' +
  'and send it using send_email. The email should reference their specific work.\n\n' +
  'Team members:\n' +
  '1. alice@acme.com — Worked on the authentication service refactor\n' +
  '2. bob@acme.com — Shipped the new dashboard analytics feature\n' +
  '3. carol@acme.com — Fixed 3 critical production bugs in the payment pipeline\n' +
  '4. dave@acme.com — Completed the API rate limiting implementation\n\n' +
  'After sending all emails, produce a brief confirmation summary listing who was emailed.\n' +
  'Keep each email body under 100 words. Use subject line "Sprint 42 Status Update".'

const userPrompt = 'Send sprint status update emails to all 4 team members now.'

// ── Standard run ────────────────────────────────────────────────────────────

console.log('\n' + '='.repeat(70))
console.log('  FIRE-AND-FORGET MCP DEMO — Standard vs Background')
console.log('='.repeat(70))
console.log('  Tool: send_email via Gmail MCP Server (stdio, 3-5s per email)')
console.log('  Scenario: Send personalized sprint update emails to 4 team members')
console.log('='.repeat(70))

console.log('\n--- STANDARD MODE (sequential — each email blocks) ---\n')

const stdMcpClient = createGmailMcpClient()
const standardAgent = new Agent({
  model,
  systemPrompt,
  tools: [stdMcpClient],
  printer: false,
})

const stdStart = Date.now()

standardAgent.addHook(BeforeToolCallEvent, (e) => {
  if (e.toolUse.name === 'send_email') {
    const input = e.toolUse.input as { to?: string }
    console.log(`  [+${((Date.now() - stdStart) / 1000).toFixed(1)}s] send_email to ${input.to ?? '?'} — started`)
  }
})
standardAgent.addHook(AfterToolCallEvent, (e) => {
  if (e.toolUse.name === 'send_email') {
    const input = e.toolUse.input as { to?: string }
    console.log(`  [+${((Date.now() - stdStart) / 1000).toFixed(1)}s] send_email to ${input.to ?? '?'} — delivered`)
  }
})

const standardResult = await standardAgent.invoke(userPrompt)
const standardMs = Date.now() - stdStart

console.log(`\n  Standard: ${(standardMs / 1000).toFixed(1)}s`)

await stdMcpClient.disconnect()

// ── Background run ──────────────────────────────────────────────────────────

console.log('\n--- BACKGROUND MODE (fire-and-forget — emails send concurrently) ---\n')

const bgMcpClient = createGmailMcpClient()
const backgroundAgent = new Agent({
  model,
  systemPrompt,
  backgroundTools: [bgMcpClient],
  printer: false,
})

const bgStart = Date.now()

backgroundAgent.addHook(BackgroundTaskDispatchEvent, (e) => {
  const input = e.toolUse.input as { to?: string }
  console.log(`  [+${((Date.now() - bgStart) / 1000).toFixed(1)}s] send_email to ${input.to ?? '?'} — dispatched (bg)`)
})
backgroundAgent.addHook(BackgroundTaskResultEvent, (e) => {
  console.log(`  [+${((Date.now() - bgStart) / 1000).toFixed(1)}s] ${e.taskName} — delivered (bg)`)
})

const backgroundResult = await backgroundAgent.invoke(userPrompt)
const backgroundMs = Date.now() - bgStart

console.log(`\n  Background: ${(backgroundMs / 1000).toFixed(1)}s`)

await bgMcpClient.disconnect()

// ── Results ─────────────────────────────────────────────────────────────────

console.log('\n--- STANDARD OUTPUT ---\n')
console.log(standardResult.toString())
console.log('\n--- BACKGROUND OUTPUT ---\n')
console.log(backgroundResult.toString())

const speedup = standardMs / backgroundMs

const stdUsage = standardResult.metrics?.accumulatedUsage
const bgUsage = backgroundResult.metrics?.accumulatedUsage

const pad = (s: string, n: number) => s.padEnd(n)

console.log('\n' + '='.repeat(70))
console.log('  RESULTS')
console.log('='.repeat(70))
console.log()
console.log(`  ${pad('Metric', 24)} ${pad('Standard', 16)} Background`)
console.log(`  ${'-'.repeat(24)} ${'-'.repeat(16)} ${'-'.repeat(16)}`)
console.log(`  ${pad('Wall clock', 24)} ${pad((standardMs / 1000).toFixed(1) + 's', 16)} ${(backgroundMs / 1000).toFixed(1)}s`)
console.log(`  ${pad('Speedup', 24)} ${pad('baseline', 16)} ${speedup.toFixed(2)}x`)
console.log(`  ${pad('Input tokens', 24)} ${pad(String(stdUsage?.inputTokens ?? 'N/A'), 16)} ${bgUsage?.inputTokens ?? 'N/A'}`)
console.log(`  ${pad('Output tokens', 24)} ${pad(String(stdUsage?.outputTokens ?? 'N/A'), 16)} ${bgUsage?.outputTokens ?? 'N/A'}`)
console.log(`  ${pad('Total tokens', 24)} ${pad(String(stdUsage?.totalTokens ?? 'N/A'), 16)} ${bgUsage?.totalTokens ?? 'N/A'}`)
console.log(`  ${pad('Agent cycles', 24)} ${pad(String(standardResult.metrics?.cycleCount ?? 'N/A'), 16)} ${backgroundResult.metrics?.cycleCount ?? 'N/A'}`)
console.log(`  ${pad('Output length (chars)', 24)} ${pad(String(standardResult.toString().length), 16)} ${backgroundResult.toString().length}`)
console.log()
console.log('='.repeat(70))
