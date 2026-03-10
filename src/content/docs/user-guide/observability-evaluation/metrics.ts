import { Agent } from '@strands-agents/sdk'
import { notebook } from '@strands-agents/sdk/vended_tools/notebook'

// Basic metrics example
async function basicMetricsExample() {
  // --8<-- [start:basic_metrics]
  const agent = new Agent({
    tools: [notebook],
  })

  // Metrics are only available via streaming
  for await (const event of agent.stream('Calculate 2+2')) {
    if (event.type === 'modelStreamUpdateEvent' && event.event.type === 'modelMetadataEvent') {
      console.log('Token usage:', event.event.usage)
      console.log('Latency:', event.event.metrics?.latencyMs)
    }
  }
  // --8<-- [end:basic_metrics]
}

// Detailed metrics tracking
async function detailedMetricsTracking() {
  // --8<-- [start:detailed_tracking]
  const agent = new Agent({
    tools: [notebook],
  })

  let totalInputTokens = 0
  let totalOutputTokens = 0
  let totalLatency = 0

  for await (const event of agent.stream('What is the square root of 144?')) {
    if (event.type === 'modelStreamUpdateEvent' && event.event.type === 'modelMetadataEvent') {
      const metadata = event.event
      if (metadata.usage) {
        totalInputTokens += metadata.usage.inputTokens
        totalOutputTokens += metadata.usage.outputTokens
        console.log(`Input tokens: ${metadata.usage.inputTokens}`)
        console.log(`Output tokens: ${metadata.usage.outputTokens}`)
        console.log(`Total tokens: ${metadata.usage.totalTokens}`)

        // Cache metrics (when available)
        if (metadata.usage.cacheReadInputTokens) {
          console.log(`Cache read tokens: ${metadata.usage.cacheReadInputTokens}`)
        }
        if (metadata.usage.cacheWriteInputTokens) {
          console.log(`Cache write tokens: ${metadata.usage.cacheWriteInputTokens}`)
        }
      }

      if (metadata.metrics) {
        totalLatency += metadata.metrics.latencyMs
        console.log(`Latency: ${metadata.metrics.latencyMs}ms`)
      }
    }
  }

  console.log(`\nTotal input tokens: ${totalInputTokens}`)
  console.log(`Total output tokens: ${totalOutputTokens}`)
  console.log(`Total latency: ${totalLatency}ms`)
  // --8<-- [end:detailed_tracking]
}
