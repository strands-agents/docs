# Metrics

Metrics are essential for understanding agent performance, optimizing behavior, and monitoring resource usage. The Strands Agents SDK provides comprehensive metrics tracking capabilities that give you visibility into how your agents operate.

## Overview

=== "Python"

    The Strands Agents SDK automatically tracks key metrics during agent execution:

    - **Token usage**: Input tokens, output tokens, total tokens consumed, and cache metrics
    - **Performance metrics**: Latency and execution time measurements
    - **Tool usage**: Call counts, success rates, and execution times for each tool
    - **Event loop cycles**: Number of reasoning cycles and their durations

    All these metrics are accessible through the [`AgentResult`](../../api-reference/agent.md#strands.agent.agent_result.AgentResult) object that's returned whenever you invoke an agent:

    ```python
    from strands import Agent
    from strands_tools import calculator

    # Create an agent with tools
    agent = Agent(tools=[calculator])

    # Invoke the agent with a prompt and get an AgentResult
    result = agent("What is the square root of 144?")

    # Access metrics through the AgentResult
    print(f"Total tokens: {result.metrics.accumulated_usage['totalTokens']}")
    print(f"Execution time: {sum(result.metrics.cycle_durations):.2f} seconds")
    print(f"Tools used: {list(result.metrics.tool_metrics.keys())}")
    
    # Cache metrics (when available)
    if 'cacheReadInputTokens' in result.metrics.accumulated_usage:
        print(f"Cache read tokens: {result.metrics.accumulated_usage['cacheReadInputTokens']}")
    if 'cacheWriteInputTokens' in result.metrics.accumulated_usage:
        print(f"Cache write tokens: {result.metrics.accumulated_usage['cacheWriteInputTokens']}")
    ```

    The `metrics` attribute of `AgentResult` (an instance of [`EventLoopMetrics`](../../api-reference/telemetry.md#strands.telemetry.metrics)) provides comprehensive performance metric data about the agent's execution, while other attributes like `stop_reason`, `message`, and `state` provide context about the agent's response. This document explains the metrics available in the agent's response and how to interpret them.

=== "TypeScript"

    The TypeScript SDK provides basic metrics tracking through streaming events. Metrics are available via the `ModelMetadataEvent` that is emitted during agent execution:

    - **Token usage**: Input tokens, output tokens, and total tokens consumed
    - **Performance metrics**: Latency measurements

    ```typescript
    --8<-- "user-guide/observability-evaluation/metrics.ts:basic_metrics"
    ```

    The `ModelMetadataEvent` contains two optional properties:

    - `usage`: Token usage statistics including input, output, and cache metrics
    - `metrics`: Performance metrics including latency

    ### Available Metrics

    **Usage**:

    - `inputTokens: number` - Tokens in the input
    - `outputTokens: number` - Tokens in the output  
    - `totalTokens: number` - Total tokens used
    - `cacheReadInputTokens?: number` - Tokens read from cache
    - `cacheWriteInputTokens?: number` - Tokens written to cache

    **Metrics**:

    - `latencyMs: number` - Request latency in milliseconds

    ### Detailed Tracking Example

    ```typescript
    --8<-- "user-guide/observability-evaluation/metrics.ts:detailed_tracking"
    ```

## Agent Loop Metrics

=== "Python"

    The [`EventLoopMetrics`](../../api-reference/telemetry.md#strands.telemetry.metrics.EventLoopMetrics) class aggregates metrics across the entire event loop execution cycle, providing a complete picture of your agent's performance. It tracks cycle counts, tool usage, execution durations, and token consumption across all model invocations.

    Key metrics include:

    - **Cycle tracking**: Number of event loop cycles and their individual durations
    - **Tool metrics**: Detailed performance data for each tool used during execution
    - **Accumulated usage**: Input tokens, output tokens, total tokens consumed, and cache metrics across all model calls
    - **Accumulated metrics**: Latency measurements in milliseconds for all model requests
    - **Execution traces**: Detailed trace information for performance analysis


    For a complete list of attributes and their types, see the [`EventLoopMetrics` API reference](../../api-reference/telemetry.md#strands.telemetry.metrics.EventLoopMetrics).

{{ ts_not_supported_code() }}

## Tool Metrics

=== "Python"

    For each tool used by the agent, detailed metrics are collected in the `tool_metrics` dictionary. Each entry is an instance of [`ToolMetrics`](../../api-reference/telemetry.md#strands.telemetry.metrics.ToolMetrics) that tracks the tool's performance throughout the agent's execution.

    Tool metrics provide insights into:

    - **Call statistics**: Total number of calls, successful executions, and errors
    - **Execution time**: Total and average time spent executing the tool
    - **Success rate**: Percentage of successful tool invocations
    - **Tool reference**: Information about the specific tool being tracked

    These metrics help you identify performance bottlenecks, tools with high error rates, and opportunities for optimization. For complete details on all available properties, see the [`ToolMetrics` API reference](../../api-reference/telemetry.md#strands.telemetry.metrics.ToolMetrics).

{{ ts_not_supported_code() }}

## Example Metrics Summary Output

=== "Python"

    The Strands Agents SDK provides a convenient `get_summary()` method on the `EventLoopMetrics` class that gives you a comprehensive overview of your agent's performance in a single call. This method aggregates all the metrics data into a structured dictionary that's easy to analyze or export.

    Let's look at the output from calling `get_summary()` on the metrics from our calculator example from the beginning of this document:

    ```python
    result = agent("What is the square root of 144?")
    print(result.metrics.get_summary())
    ```
    ```python
    {
      "accumulated_metrics": {
        "latencyMs": 6253
      },
      "accumulated_usage": {
        "inputTokens": 3921,
        "outputTokens": 83,
        "totalTokens": 4004,
        "cacheReadInputTokens": 150,
        "cacheWriteInputTokens": 75
      },
      "average_cycle_time": 0.9406174421310425,
      "tool_usage": {
        "calculator": {
          "execution_stats": {
            "average_time": 0.008260965347290039,
            "call_count": 1,
            "error_count": 0,
            "success_count": 1,
            "success_rate": 1.0,
            "total_time": 0.008260965347290039
          },
          "tool_info": {
            "input_params": {
              "expression": "sqrt(144)",
              "mode": "evaluate"
            },
            "name": "calculator",
            "tool_use_id": "tooluse_jR3LAfuASrGil31Ix9V7qQ"
          }
        }
      },
      "total_cycles": 2,
      "total_duration": 1.881234884262085,
      "traces": [
        {
          "children": [
            {
              "children": [],
              "duration": 4.476144790649414,
              "end_time": 1747227039.938964,
              "id": "c7e86c24-c9d4-4a79-a3a2-f0eaf42b0d19",
              "message": {
                "content": [
                  {
                    "text": "I'll calculate the square root of 144 for you."
                  },
                  {
                    "toolUse": {
                      "input": {
                        "expression": "sqrt(144)",
                        "mode": "evaluate"
                      },
                      "name": "calculator",
                      "toolUseId": "tooluse_jR3LAfuASrGil31Ix9V7qQ"
                    }
                  }
                ],
                "role": "assistant"
              },
              "metadata": {},
              "name": "stream_messages",
              "parent_id": "78595347-43b1-4652-b215-39da3c719ec1",
              "raw_name": null,
              "start_time": 1747227035.462819
            },
            {
              "children": [],
              "duration": 0.008296012878417969,
              "end_time": 1747227039.948415,
              "id": "4f64ce3d-a21c-4696-aa71-2dd446f71488",
              "message": {
                "content": [
                  {
                    "toolResult": {
                      "content": [
                        {
                          "text": "Result: 12"
                        }
                      ],
                      "status": "success",
                      "toolUseId": "tooluse_jR3LAfuASrGil31Ix9V7qQ"
                    }
                  }
                ],
                "role": "user"
              },
              "metadata": {
                "toolUseId": "tooluse_jR3LAfuASrGil31Ix9V7qQ",
                "tool_name": "calculator"
              },
              "name": "Tool: calculator",
              "parent_id": "78595347-43b1-4652-b215-39da3c719ec1",
              "raw_name": "calculator - tooluse_jR3LAfuASrGil31Ix9V7qQ",
              "start_time": 1747227039.940119
            },
            {
              "children": [],
              "duration": 1.881267786026001,
              "end_time": 1747227041.8299048,
              "id": "0261b3a5-89f2-46b2-9b37-13cccb0d7d39",
              "message": null,
              "metadata": {},
              "name": "Recursive call",
              "parent_id": "78595347-43b1-4652-b215-39da3c719ec1",
              "raw_name": null,
              "start_time": 1747227039.948637
            }
          ],
          "duration": null,
          "end_time": null,
          "id": "78595347-43b1-4652-b215-39da3c719ec1",
          "message": null,
          "metadata": {},
          "name": "Cycle 1",
          "parent_id": null,
          "raw_name": null,
          "start_time": 1747227035.46276
        },
        {
          "children": [
            {
              "children": [],
              "duration": 1.8811860084533691,
              "end_time": 1747227041.829879,
              "id": "1317cfcb-0e87-432e-8665-da5ddfe099cd",
              "message": {
                "content": [
                  {
                    "text": "\n\nThe square root of 144 is 12."
                  }
                ],
                "role": "assistant"
              },
              "metadata": {},
              "name": "stream_messages",
              "parent_id": "f482cee9-946c-471a-9bd3-fae23650f317",
              "raw_name": null,
              "start_time": 1747227039.948693
            }
          ],
          "duration": 1.881234884262085,
          "end_time": 1747227041.829896,
          "id": "f482cee9-946c-471a-9bd3-fae23650f317",
          "message": null,
          "metadata": {},
          "name": "Cycle 2",
          "parent_id": null,
          "raw_name": null,
          "start_time": 1747227039.948661
        }
      ]
    }
    ```

    This summary provides a complete picture of the agent's execution, including cycle information, token usage, tool performance, and detailed execution traces.

{{ ts_not_supported_code() }}

## Best Practices

1. **Monitor Token Usage**: Keep track of token usage to ensure you stay within limits and optimize costs. Set up alerts for when token usage approaches predefined thresholds to avoid unexpected costs.

2. **Analyze Tool Performance**: Review tool metrics to identify tools with high error rates or long execution times. Consider refactoring tools with success rates below 95% or average execution times that exceed your latency requirements.

3. **Track Cycle Efficiency**: Monitor how many iterations the agent needed and how long each took. Agents that require many cycles may benefit from improved prompting or tool design.

4. **Benchmark Latency Metrics**: Monitor latency values to establish performance baselines. Compare these metrics across different agent configurations to identify optimal setups.

5. **Regular Metrics Reviews**: Schedule periodic reviews of agent metrics to identify trends and opportunities for optimization. Look for gradual changes in performance that might indicate drift in tool behavior or model responses.



