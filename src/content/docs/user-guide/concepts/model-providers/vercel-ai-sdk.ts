/**
 * TypeScript examples for Vercel AI SDK model provider documentation.
 */
// @ts-nocheck

import { Agent } from '@strands-agents/sdk'
import { VercelModel } from '@strands-agents/sdk/vercel-model'
import { bedrock } from '@ai-sdk/amazon-bedrock'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'

// Basic usage with OpenAI
async function basicUsageOpenAI() {
  // --8<-- [start:basic_usage_openai]
  import { Agent } from '@strands-agents/sdk'
  import { VercelModel } from '@strands-agents/sdk/vercel-model'
  import { openai } from '@ai-sdk/openai'

  const agent = new Agent({
    model: new VercelModel(openai('gpt-4o')),
  })

  const result = await agent.invoke('Hello!')
  console.log(result)
  // --8<-- [end:basic_usage_openai]
}

// Basic usage with Bedrock
async function basicUsageBedrock() {
  // --8<-- [start:basic_usage_bedrock]
  import { Agent } from '@strands-agents/sdk'
  import { VercelModel } from '@strands-agents/sdk/vercel-model'
  import { bedrock } from '@ai-sdk/amazon-bedrock'

  const agent = new Agent({
    model: new VercelModel(bedrock('us.anthropic.claude-sonnet-4-20250514-v1:0')),
  })

  const result = await agent.invoke('Hello!')
  console.log(result)
  // --8<-- [end:basic_usage_bedrock]
}

// Basic usage with Anthropic
async function basicUsageAnthropic() {
  // --8<-- [start:basic_usage_anthropic]
  import { Agent } from '@strands-agents/sdk'
  import { VercelModel } from '@strands-agents/sdk/vercel-model'
  import { anthropic } from '@ai-sdk/anthropic'

  const agent = new Agent({
    model: new VercelModel(anthropic('claude-sonnet-4-20250514')),
  })

  const result = await agent.invoke('Hello!')
  console.log(result)
  // --8<-- [end:basic_usage_anthropic]
}

// Basic usage with Google
async function basicUsageGoogle() {
  // --8<-- [start:basic_usage_google]
  import { Agent } from '@strands-agents/sdk'
  import { VercelModel } from '@strands-agents/sdk/vercel-model'
  import { google } from '@ai-sdk/google'

  const agent = new Agent({
    model: new VercelModel(google('gemini-2.5-flash')),
  })

  const result = await agent.invoke('Hello!')
  console.log(result)
  // --8<-- [end:basic_usage_google]
}

// Configuration example
async function configExample() {
  // --8<-- [start:config_example]
  const model = new VercelModel(openai('gpt-4o'), {
    maxTokens: 1000,
    temperature: 0.7,
    topP: 0.9,
  })

  const agent = new Agent({ model })
  const result = await agent.invoke('Write a short poem')
  console.log(result)
  // --8<-- [end:config_example]
}

// Streaming example
async function streamingExample() {
  // --8<-- [start:streaming]
  const agent = new Agent({
    model: new VercelModel(openai('gpt-4o')),
  })

  for await (const event of agent.stream('Tell me a story')) {
    if (event.type === 'modelContentBlockDeltaEvent' && event.delta.type === 'textDelta') {
      process.stdout.write(event.delta.text)
    }
  }
  // --8<-- [end:streaming]
}
