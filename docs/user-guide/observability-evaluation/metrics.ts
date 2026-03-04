import { Agent, AgentLoopMetrics } from '@strands-agents/sdk'
import { notebook } from '@strands-agents/sdk/vended_tools/notebook'

// Basic metrics example
async function basicMetricsExample() {
  // --8<-- [start:basic_metrics]
  // Create an agent with tools
  const agent = new Agent({
    tools: [notebook],
  })

  // Invoke the agent with a prompt and get an AgentResult
  const result = await agent.invoke('What is the square root of 144?')

  // Access metrics through the AgentResult
  console.log(`Total tokens: ${result.metrics.accumulatedUsage.totalTokens}`)
  console.log(`Execution time: ${result.metrics.getSummary().totalDuration.toFixed(2)} seconds`)
  console.log(`Tools used: ${Object.keys(result.metrics.toolMetrics)}`)

  // Cache metrics (when available)
  if (result.metrics.accumulatedUsage.cacheReadInputTokens) {
    console.log(`Cache read tokens: ${result.metrics.accumulatedUsage.cacheReadInputTokens}`)
  }
  if (result.metrics.accumulatedUsage.cacheWriteInputTokens) {
    console.log(`Cache write tokens: ${result.metrics.accumulatedUsage.cacheWriteInputTokens}`)
  }
  // --8<-- [end:basic_metrics]
}

// Detailed metrics tracking via streaming
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

// Agent loop metrics overview
async function agentLoopMetricsOverview() {
  // --8<-- [start:agent_loop_metrics]
  const agent = new Agent({
    tools: [notebook],
  })

  const result = await agent.invoke('Summarize this document')

  // Token usage across all cycles
  console.log(result.metrics.accumulatedUsage)
  // { inputTokens: 1200, outputTokens: 350, totalTokens: 1550 }

  // Cycle and tool stats
  console.log(result.metrics.cycleCount) // 3
  console.log(result.metrics.toolMetrics)
  // { notebook: { callCount: 2, successCount: 2, errorCount: 0, totalTime: 1.23 } }

  // Model latency
  console.log(result.metrics.accumulatedMetrics)
  // { latencyMs: 3800 }

  // Full summary with traces and per-invocation breakdown
  console.log(result.metrics.getSummary())
  // --8<-- [end:agent_loop_metrics]
}

// Agent invocations tracking
async function agentInvocationsExample() {
  // --8<-- [start:agent_invocations]
  const agent = new Agent({
    tools: [notebook],
  })

  // First invocation
  const result1 = await agent.invoke('What is 5 + 3?')

  // Second invocation (metrics accumulate across invocations)
  const result2 = await agent.invoke('What is the square root of 144?')

  // Access metrics for the latest invocation
  const latestInvocation = result2.metrics.latestAgentInvocation
  if (latestInvocation) {
    console.log('Latest invocation usage:', latestInvocation.usage)
    console.log('Cycles in latest invocation:', latestInvocation.cycles.length)
  }

  // Access all invocations
  for (const invocation of result2.metrics.agentInvocations) {
    console.log('Invocation usage:', invocation.usage)
    for (const cycle of invocation.cycles) {
      console.log(`  Cycle ${cycle.agentLoopCycleId}:`, cycle.usage)
    }
  }

  // Full summary (includes all invocations)
  console.log(result2.metrics.getSummary())
  // --8<-- [end:agent_invocations]
}

// Tool metrics example
async function toolMetricsExample() {
  // --8<-- [start:tool_metrics]
  const agent = new Agent({
    tools: [notebook],
  })

  const result = await agent.invoke('Create a note and then read it back')

  // Per-tool metrics
  for (const [toolName, metrics] of Object.entries(result.metrics.toolMetrics)) {
    console.log(`Tool: ${toolName}`)
    console.log(`  Calls: ${metrics.callCount}`)
    console.log(`  Successes: ${metrics.successCount}`)
    console.log(`  Errors: ${metrics.errorCount}`)
    console.log(`  Total time: ${metrics.totalTime.toFixed(2)}s`)
  }

  // Or use getSummary() for computed stats like averageTime and successRate
  const summary = result.metrics.getSummary()
  for (const [toolName, usage] of Object.entries(summary.toolUsage)) {
    console.log(`Tool: ${toolName}`)
    console.log(`  Average time: ${usage.averageTime.toFixed(2)}s`)
    console.log(`  Success rate: ${(usage.successRate * 100).toFixed(0)}%`)
  }
  // --8<-- [end:tool_metrics]
}

// Metrics summary example
async function metricsSummaryExample() {
  // --8<-- [start:metrics_summary]
  const agent = new Agent({
    tools: [notebook],
  })

  const result = await agent.invoke('What is the square root of 144?')
  const summary = result.metrics.getSummary()

  console.log(`Total cycles: ${summary.totalCycles}`)
  console.log(`Total duration: ${summary.totalDuration.toFixed(2)}s`)
  console.log(`Average cycle time: ${summary.averageCycleTime.toFixed(2)}s`)
  console.log('Token usage:', summary.accumulatedUsage)
  console.log('Latency:', summary.accumulatedMetrics)
  console.log('Tool usage:', summary.toolUsage)
  console.log('Traces:', summary.traces.length)
  console.log('Invocations:', summary.agentInvocations.length)
  // --8<-- [end:metrics_summary]
}
