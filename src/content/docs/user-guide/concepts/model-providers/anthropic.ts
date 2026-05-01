/**
 * TypeScript examples for Anthropic model provider documentation.
 * These examples demonstrate common usage patterns for the AnthropicModel.
 */
// @ts-nocheck

import { Agent } from '@strands-agents/sdk'
import { AnthropicModel } from '@strands-agents/sdk/models/anthropic'

// Basic usage
async function basicUsage() {
  // --8<-- [start:basic_usage]
  const model = new AnthropicModel({
    apiKey: process.env.ANTHROPIC_API_KEY || '<KEY>',
    modelId: 'claude-sonnet-4-6',
    maxTokens: 1028,
    params: {
      temperature: 0.7,
    },
  })

  const agent = new Agent({ model })
  const response = await agent.invoke('What is 2+2')
  console.log(response)
  // --8<-- [end:basic_usage]
}

// Custom client
async function customClient() {
  // --8<-- [start:custom_client]
  import Anthropic from '@anthropic-ai/sdk'
  import { Agent } from '@strands-agents/sdk'
  import { AnthropicModel } from '@strands-agents/sdk/models/anthropic'

  const client = new Anthropic({ apiKey: '<KEY>' })

  const model = new AnthropicModel({
    client,
    modelId: 'claude-sonnet-4-6',
    maxTokens: 1028,
  })

  const agent = new Agent({ model })
  const response = await agent.invoke('What is 2+2')
  console.log(response)
  // --8<-- [end:custom_client]
}
