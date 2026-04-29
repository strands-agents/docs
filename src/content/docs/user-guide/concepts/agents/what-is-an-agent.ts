import { Agent, tool } from '@strands-agents/sdk'
import { z } from 'zod'

// Placeholder tools referenced in the anti-pattern examples, so the
// configuration snippet below type-checks on its own.
const search = tool({
  name: 'search',
  description: 'Search the web for information',
  inputSchema: z.object({
    query: z.string().describe('The search query'),
  }),
  callback: (input) => `Results for ${input.query}`,
})

const calculator = tool({
  name: 'calculator',
  description: 'Evaluate a simple arithmetic expression',
  inputSchema: z.object({
    expression: z.string().describe('Arithmetic expression to evaluate'),
  }),
  callback: (input) => `Result of ${input.expression}`,
})

// Minimal agent using all four parts (model, system prompt, tools, context).
async function minimalAgentExample() {
  // --8<-- [start:minimal_agent]
  const weatherTool = tool({
    name: 'weather',
    description: 'Get current weather for a city',
    inputSchema: z.object({
      city: z.string().describe('City name'),
    }),
    callback: (input) => `Weather for ${input.city}: Sunny, 72°F`,
  })

  const agent = new Agent({
    systemPrompt: 'You are a helpful weather assistant.',
    tools: [weatherTool],
  })

  await agent.invoke("What's the weather in Seattle?")
  // --8<-- [end:minimal_agent]
}

// Correct scope: create a fresh agent per request.
async function perRequestAgentExample() {
  // --8<-- [start:per_request_agent]
  async function handleRequest(userMessage: string): Promise<string> {
    const agent = new Agent({
      systemPrompt: 'You are a helpful assistant.',
      tools: [search, calculator],
    })
    const result = await agent.invoke(userMessage)
    return String(result)
  }
  // --8<-- [end:per_request_agent]

  await handleRequest('Hello')
}

// Share configuration, not instances.
async function sharedConfigExample() {
  // --8<-- [start:shared_config]
  const AGENT_CONFIG = {
    systemPrompt: 'You are a helpful assistant.',
    tools: [search, calculator],
  }

  async function handleRequest(userMessage: string): Promise<string> {
    const agent = new Agent(AGENT_CONFIG)
    const result = await agent.invoke(userMessage)
    return String(result)
  }
  // --8<-- [end:shared_config]

  await handleRequest('Hello')
}

// Keep references so the compiler does not flag them as unused.
void minimalAgentExample
void perRequestAgentExample
void sharedConfigExample
