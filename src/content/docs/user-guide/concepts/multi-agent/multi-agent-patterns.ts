import { Agent } from '@strands-agents/sdk'
import { BeforeModelCallEvent } from '@strands-agents/sdk'
import { tool } from '@strands-agents/sdk'
import { Graph } from '@strands-agents/sdk/multiagent'
import { z } from 'zod'

async function invocationStateGraphExample() {
  // --8<-- [start:invocation_state_graph]
  const researcher = new Agent({
    id: 'researcher',
    systemPrompt: 'You are a research specialist.',
  })
  const writer = new Agent({
    id: 'writer',
    systemPrompt: 'You are a writing specialist.',
  })

  const graph = new Graph({
    nodes: [researcher, writer],
    edges: [['researcher', 'writer']],
  })

  // Pass invocation state to the orchestrator
  await graph.invoke('Analyze customer data', {
    invocationState: {
      userId: 'user123',
      sessionId: 'sess456',
      debugMode: true,
    },
  })
  // --8<-- [end:invocation_state_graph]
}

async function invocationStateToolExample() {
  // --8<-- [start:invocation_state_tool]
  const queryDataTool = tool({
    name: 'query_data',
    description: 'Query data with user context',
    inputSchema: z.object({
      query: z.string(),
    }),
    callback: (input, context) => {
      const userId = context?.invocationState.userId
      const debugMode = context?.invocationState.debugMode
      // Use context for personalized queries...
      return `Results for ${userId}`
    },
  })
  // --8<-- [end:invocation_state_tool]
}

void invocationStateGraphExample
void invocationStateToolExample
