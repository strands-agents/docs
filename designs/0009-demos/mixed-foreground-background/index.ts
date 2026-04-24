/**
 * Mixed Foreground + Background Demo
 *
 * Demonstrates the most common production pattern: an agent with both foreground
 * tools (results needed immediately) and background tools (side-effects that
 * don't block the response).
 *
 * Scenario: A customer support agent handles a refund request.
 *   - Foreground: look up order details (model needs this to respond)
 *   - Foreground: process the refund (model needs confirmation)
 *   - Background: send confirmation email (fire-and-forget)
 *   - Background: log the interaction for analytics (fire-and-forget)
 *   - Background: update CRM record (fire-and-forget)
 *
 * The agent responds to the user immediately after the refund is processed,
 * while the email, logging, and CRM update happen in the background.
 */

import {
  Agent,
  BedrockModel,
  tool,
  BeforeToolCallEvent,
  AfterToolCallEvent,
  BackgroundTaskDispatchEvent,
  BackgroundTaskResultEvent,
  BackgroundTaskPendingEvent,
} from '@strands-agents/sdk'
import { z } from 'zod'

const modelId = process.argv.find((_, i) => process.argv[i - 1] === '--model')
const model = new BedrockModel({ ...(modelId && { modelId }), region: 'us-east-1' })

// ── Foreground tools (model needs results immediately) ──────────────────────

const lookupOrder = tool({
  name: 'lookup_order',
  description: 'Look up order details by order ID. Returns order status, items, and total.',
  inputSchema: z.object({ orderId: z.string().describe('The order ID to look up') }),
  callback: async (input) => {
    await new Promise((r) => setTimeout(r, 1000))
    return `Order ${input.orderId}: 2x Widget Pro ($49.99 each), 1x Widget Case ($12.99). Total: $112.97. Status: delivered 2026-04-15. Payment: Visa ending 4242.`
  },
})

const processRefund = tool({
  name: 'process_refund',
  description: 'Process a refund for an order. Returns refund confirmation with reference number.',
  inputSchema: z.object({
    orderId: z.string().describe('The order ID to refund'),
    amount: z.string().describe('The refund amount'),
    reason: z.string().describe('Reason for the refund'),
  }),
  callback: async (input) => {
    await new Promise((r) => setTimeout(r, 2000))
    return `Refund processed: $${input.amount} for order ${input.orderId}. Reference: REF-2026-04-21-7829. Reason: ${input.reason}. Funds will appear in 3-5 business days on Visa ending 4242.`
  },
})

// ── Background tools (fire-and-forget side effects) ─────────────────────────

const sendEmail = tool({
  name: 'send_confirmation_email',
  description: 'Send a refund confirmation email to the customer. Fire-and-forget — no need to wait for delivery.',
  inputSchema: z.object({
    to: z.string().describe('Customer email address'),
    orderId: z.string().describe('Order ID for the refund'),
    refundRef: z.string().describe('Refund reference number'),
    amount: z.string().describe('Refund amount'),
  }),
  callback: async (input) => {
    await new Promise((r) => setTimeout(r, 8000))
    return `Email sent to ${input.to}: "Your refund of $${input.amount} for order ${input.orderId} has been processed. Reference: ${input.refundRef}. Expect funds in 3-5 business days."`
  },
})

const logInteraction = tool({
  name: 'log_interaction',
  description: 'Log this support interaction for analytics and quality review. Fire-and-forget.',
  inputSchema: z.object({
    orderId: z.string().describe('Order ID'),
    action: z.string().describe('Action taken'),
    resolution: z.string().describe('Resolution summary'),
  }),
  callback: async (input) => {
    await new Promise((r) => setTimeout(r, 5000))
    return `Logged: order=${input.orderId}, action=${input.action}, resolution=${input.resolution}. Ticket #SUP-48291 created.`
  },
})

const updateCrm = tool({
  name: 'update_crm',
  description: 'Update the customer CRM record with this interaction. Fire-and-forget.',
  inputSchema: z.object({
    orderId: z.string().describe('Order ID'),
    note: z.string().describe('Note to add to CRM record'),
  }),
  callback: async (input) => {
    await new Promise((r) => setTimeout(r, 6000))
    return `CRM updated for order ${input.orderId}: "${input.note}". Customer satisfaction score recalculated.`
  },
})

// ── Run ─────────────────────────────────────────────────────────────────────

console.log('\n' + '='.repeat(70))
console.log('  MIXED FOREGROUND + BACKGROUND DEMO')
console.log('='.repeat(70))
console.log('  Foreground (blocking):  lookup_order, process_refund')
console.log('  Background (fire-and-forget): send_email, log_interaction, update_crm')
console.log('  The agent responds after the refund, while side-effects run in parallel')
console.log('='.repeat(70))

const agent = new Agent({
  model,
  systemPrompt:
    'You are a customer support agent. When a customer requests a refund:\n' +
    '1. Look up the order details using lookup_order.\n' +
    '2. Once you have the order details, call ALL of the following tools IN THE SAME TURN:\n' +
    '   - process_refund (foreground — you need the refund confirmation)\n' +
    '   - send_confirmation_email (background — fire and forget)\n' +
    '   - log_interaction (background — fire and forget)\n' +
    '   - update_crm (background — fire and forget)\n' +
    '3. Respond to the customer with the refund confirmation. Do NOT wait for the background tools.\n\n' +
    'IMPORTANT: In step 2, call process_refund together with the background tools in one batch.\n' +
    'The customer email is customer@example.com.',
  tools: [lookupOrder, processRefund],
  backgroundTools: [sendEmail, logInteraction, updateCrm],
  backgroundToolHeartbeatMs: 1000,
  printer: false,
})

const start = Date.now()
const elapsed = () => `+${((Date.now() - start) / 1000).toFixed(1)}s`

agent.addHook(BeforeToolCallEvent, (e) => {
  console.log(`  [${elapsed()}] ${e.toolUse.name} started (foreground)`)
}, { propagate: false })
agent.addHook(AfterToolCallEvent, (e) => {
  console.log(`  [${elapsed()}] ${e.toolUse.name} finished (foreground)`)
}, { propagate: false })
agent.addHook(BackgroundTaskDispatchEvent, (e) => {
  console.log(`  [${elapsed()}] ${e.toolUse.name} dispatched (background)`)
})
agent.addHook(BackgroundTaskResultEvent, (e) => {
  console.log(`  [${elapsed()}] ${e.taskName} completed (background)`)
})
agent.addHook(BackgroundTaskPendingEvent, (e) => {
  const names = e.pendingTasks.map((t) => t.name).join(', ')
  console.log(`  [${elapsed()}] ⏳ Waiting for: ${names} — ${e.completedCount} completed, ${(e.elapsedMs / 1000).toFixed(1)}s elapsed`)
})

console.log('\n--- Customer request ---\n')
console.log('  Customer: "I need a refund for order ORD-99421. The widgets arrived damaged."\n')

const result = await agent.invoke(
  'I need a refund for order ORD-99421. The widgets arrived damaged.'
)

const wallClock = Date.now() - start

console.log('\n--- AGENT RESPONSE ---\n')
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
console.log('  Tool Breakdown:')
console.log(`  ${pad('Foreground (blocking)', 28)} lookup_order (1s) + process_refund (2s)`)
console.log(`  ${pad('Background (parallel)', 28)} send_email (8s) + log (5s) + CRM (6s)`)
console.log(`  ${pad('Without backgroundTools', 28)} would add ~19s of sequential blocking`)
console.log()
console.log('='.repeat(70))
