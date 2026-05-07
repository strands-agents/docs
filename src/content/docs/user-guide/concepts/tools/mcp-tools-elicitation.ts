// @ts-nocheck

// --8<-- [start:elicitation_server]
// server.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const server = new McpServer({
  name: 'File Tools',
  version: '1.0.0',
})

server.tool(
  'delete_files',
  'Delete the given files after getting user approval.',
  {
    paths: z.array(z.string()),
  },
  async ({ paths }) => {
    const result = await server.server.elicitInput({
      message: `Do you want to delete ${paths.join(', ')}?`,
      requestedSchema: {
        type: 'object',
        properties: {
          username: { type: 'string', description: 'Who is approving?' },
        },
        required: ['username'],
      },
    })

    if (result.action !== 'accept') {
      return { content: [{ type: 'text', text: `User ${result.action}ed deletion` }] }
    }

    // Perform deletion...
    const username = (result.content as { username: string }).username
    return { content: [{ type: 'text', text: `User ${username} approved deletion` }] }
  }
)

await server.connect(new StdioServerTransport())
// --8<-- [end:elicitation_server]

// --8<-- [start:elicitation_client]
// client.ts
import { Agent, McpClient } from '@strands-agents/sdk'
import type { ElicitationCallback } from '@strands-agents/sdk'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const elicitationCallback: ElicitationCallback = async (_context, params) => {
  console.log(`ELICITATION: ${params.message}`)
  // Get user confirmation...
  return {
    action: 'accept',
    content: { username: 'myname' },
  }
}

const elicitClient = new McpClient({
  transport: new StdioClientTransport({
    command: 'npx',
    args: ['tsx', '/path/to/server.ts'],
  }),
  elicitationCallback,
})

const agentElicit = new Agent({
  tools: [elicitClient],
})

await agentElicit.invoke("Delete 'a/b/c.txt' and share the name of the approver")

await elicitClient.disconnect()
// --8<-- [end:elicitation_client]
