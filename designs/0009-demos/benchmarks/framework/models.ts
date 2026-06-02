/**
 * Model factory for benchmark runs.
 *
 * Maps CLI model names to Bedrock Model instances.
 */

import { BedrockModel } from '@strands-agents/sdk'
import type { Model } from '@strands-agents/sdk'

export function createModel(name: string): Model {
  switch (name) {
    case 'sonnet-4.6':
      return new BedrockModel({ modelId: 'us.anthropic.claude-sonnet-4-6', region: 'us-east-1' })
    case 'haiku-4.5':
      return new BedrockModel({ modelId: 'us.anthropic.claude-haiku-4-5-20251001-v1:0', region: 'us-east-1' })
    case 'nova-pro':
      return new BedrockModel({ modelId: 'us.amazon.nova-pro-v1:0', region: 'us-east-1' })
    default:
      console.error(`Unknown model: "${name}". Available: sonnet-4.6, haiku-4.5, nova-pro`)
      process.exit(1)
  }
}
