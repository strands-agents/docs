import { Agent, tool } from '@strands-agents/sdk'
import { z } from 'zod'

// --8<-- [start:cancel_timeout]
const agent = new Agent()

// Cancel after 30 seconds
setTimeout(() => agent.cancel(), 30_000)

const result = await agent.invoke('Analyze this large dataset')

if (result.stopReason === 'cancelled') {
  console.log('Agent was cancelled due to timeout')
}
// --8<-- [end:cancel_timeout]

// --8<-- [start:cancel_signal]
const myTool = tool({
  name: 'long_running_task',
  description: 'A task that respects cancellation',
  inputSchema: z.object({ url: z.string() }),
  callback: async (input, context) => {
    const response = await fetch(input.url, {
      signal: context?.agent.cancelSignal,
    })
    return response.text()
  },
})
// --8<-- [end:cancel_signal]
