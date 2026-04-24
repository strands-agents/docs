/**
 * Stub Gmail MCP Server
 *
 * Exposes the same tool interface a real Gmail MCP server would:
 *   - send_email(to, subject, body) — simulates SMTP delivery with a 3-5s delay
 *
 * Runs over stdio transport. To the agent, this is indistinguishable from
 * a real Gmail MCP server — same tool name, same input schema, same response shape.
 * The only difference is it logs to stderr instead of actually sending.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import * as z from 'zod'

const server = new McpServer(
  { name: 'gmail-mcp-server', version: '1.0.0' },
  { capabilities: { tools: {} } },
)

server.registerTool(
  'send_email',
  {
    title: 'Send Email',
    description: 'Sends an email via Gmail. Takes a recipient address, subject line, and body text.',
    inputSchema: {
      to: z.string().describe('Recipient email address'),
      subject: z.string().describe('Email subject line'),
      body: z.string().describe('Email body text'),
    },
  },
  async ({ to, subject, body }) => {
    // Simulate SMTP round-trip (3-5s)
    const delay = 3000 + Math.random() * 2000
    await new Promise((r) => setTimeout(r, delay))

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    // Log to stderr so it doesn't interfere with stdio MCP transport
    process.stderr.write(
      `[Gmail MCP] Sent email to=${to} subject="${subject}" body=${body.length} chars messageId=${messageId} (${(delay / 1000).toFixed(1)}s)\n`
    )

    return {
      content: [{
        type: 'text' as const,
        text: `Email sent successfully. Message ID: ${messageId}`,
      }],
    }
  },
)

const transport = new StdioServerTransport()
await server.connect(transport)
