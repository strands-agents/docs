# Operating Agents in Production

This guide provides best practices for deploying Strands agents in production environments, focusing on security, stability, and performance optimization.

## Production Configuration

When transitioning from development to production, it's essential to configure your agents for optimal performance, security, and reliability. The following sections outline key considerations and recommended settings.

### Agent Initialization

For production deployments, initialize your agents with explicit configurations tailored to your production requirements rather than relying on defaults.

#### Model configuration

For example, passing in models with specific configuration properties:

```python
agent_model = BedrockModel(
    model_id="us.amazon.nova-premier-v1:0",
    temperature=0.3,
    max_tokens=2000,
    top_p=0.8,
)

agent = Agent(model=agent_model)
```

See:

 - [Bedrock Model Usage](../../user-guide/concepts/model-providers/amazon-bedrock.md/#basic-usage)
 - [Ollama Model Usage](../../user-guide/concepts/model-providers/ollama.md/#basic-usage)

### Tool Management

In production environments, it's critical to control which tools are available to your agent. You should:

 - **Explicitly Specify Tools**: Always provide an explicit list of tools rather than loading all available tools
 - **Keep Automatic Tool Loading Disabled**: For stability in production, keep automatic loading and reloading of tools disabled (the default behavior)
 - **Audit Tool Usage**: Regularly review which tools are being used and remove any that aren't necessary for your use case

```python
agent = Agent(
    ...,
    # Explicitly specify tools
    tools=[weather_research, weather_analysis, summarizer],
    # Automatic tool loading is disabled by default (recommended for production)
    # load_tools_from_directory=False,  # This is the default
)
```

See [Adding Tools to Agents](../concepts/tools/index.md/#adding-tools-to-agents) and [Auto reloading tools](../concepts/tools/index.md#auto-loading-and-reloading-tools) for more information.

### Security Considerations

For production environments:

1. **Tool Permissions**: Review and restrict the permissions of each tool to follow the principle of least privilege
2. **Input Validation**: Always validate user inputs before passing to Strands Agents
3. **Output Sanitization**: Sanitize outputs for sensitive information. Consider leveraging [guardrails](../../user-guide/safety-security/guardrails.md) as an automated mechanism.

## Performance Optimization

### Conversation Management

Optimize memory usage and context window management in production:

```python
from strands import Agent
from strands.agent.conversation_manager import SlidingWindowConversationManager

# Configure conversation management for production
conversation_manager = SlidingWindowConversationManager(
    window_size=10,  # Limit history size
)

agent = Agent(
    ...,
    conversation_manager=conversation_manager
)
```

The [`SlidingWindowConversationManager`](../../user-guide/concepts/agents/conversation-management.md/#slidingwindowconversationmanager) helps prevent context window overflow exceptions by maintaining a reasonable conversation history size.

### Streaming for Responsiveness

For improved user experience in production applications, leverage streaming via `stream_async()` to deliver content to the caller as it's received, resulting in a lower-latency experience:

```python
# For web applications
async def stream_agent_response(prompt):
    agent = Agent(...)

    ...

    async for event in agent.stream_async(prompt):
        if "data" in event:
            yield event["data"]
```

See [Async Iterators](../../user-guide/concepts/streaming/async-iterators.md) for more information.

### Error Handling

Implement robust error handling in production:

```python
try:
    result = agent("Execute this task")
except Exception as e:
    # Log the error
    logger.error(f"Agent error: {str(e)}")
    # Implement appropriate fallback
    handle_agent_error(e)
```

### Execution Limits

Production agents should have clear execution boundaries to prevent runaway operations, control costs, and ensure predictable resource consumption. Without proper limits, agents can enter infinite loops, consume excessive tokens, or run indefinitely—all of which impact reliability and cost in production environments.

#### Agent Loop Iteration Limits

Limit the number of model calls per agent invocation using hooks. This prevents agents from getting stuck in reasoning loops or making excessive API calls:

=== "Python"

    ```python
    from strands import Agent
    from strands.hooks import HookProvider, HookRegistry, BeforeModelCallEvent

    class LimitModelCalls(HookProvider):
        """Limit the number of model calls per invocation."""

        def __init__(self, max_calls: int = 10):
            self.max_calls = max_calls
            self.call_count = 0

        def register_hooks(self, registry: HookRegistry) -> None:
            registry.add_callback(BeforeModelCallEvent, self.check_limit)

        def check_limit(self, event: BeforeModelCallEvent) -> None:
            self.call_count += 1
            if self.call_count > self.max_calls:
                raise RuntimeError(f"Maximum model calls ({self.max_calls}) exceeded")

    agent = Agent(hooks=[LimitModelCalls(max_calls=15)])
    ```

{{ ts_not_supported_code("Hook-based model call limiting is not yet available in TypeScript SDK") }}

See [Hooks](../../user-guide/concepts/agents/hooks.md) for more information on implementing custom hooks.

#### Tool Invocation Limits

Limit how many times specific tools can be called to prevent excessive external API usage, rate limiting issues, or runaway tool execution:

=== "Python"

    ```python
    from strands.hooks import HookProvider, HookRegistry, BeforeToolCallEvent, BeforeInvocationEvent

    class LimitToolCounts(HookProvider):
        """Limit tool invocations per agent request."""

        def __init__(self, max_tool_counts: dict[str, int]):
            self.max_tool_counts = max_tool_counts
            self.tool_counts = {}

        def register_hooks(self, registry: HookRegistry) -> None:
            registry.add_callback(BeforeInvocationEvent, self.reset_counts)
            registry.add_callback(BeforeToolCallEvent, self.check_tool_limit)

        def reset_counts(self, event: BeforeInvocationEvent) -> None:
            self.tool_counts = {}

        def check_tool_limit(self, event: BeforeToolCallEvent) -> None:
            tool_name = event.tool_use["name"]
            count = self.tool_counts.get(tool_name, 0) + 1
            self.tool_counts[tool_name] = count

            if max_count := self.max_tool_counts.get(tool_name):
                if count > max_count:
                    event.cancel_tool = f"Tool '{tool_name}' limit exceeded"

    # Limit expensive API calls
    agent = Agent(
        tools=[search_api, database_query],
        hooks=[LimitToolCounts({"search_api": 5, "database_query": 10})]
    )
    ```

{{ ts_not_supported_code("Hook-based tool limiting is not yet available in TypeScript SDK") }}

See the [Limit Tool Counts](../../user-guide/concepts/agents/hooks.md#limit-tool-counts) cookbook example for a complete implementation.

#### Token Consumption Budgets

Control token usage at the model level by configuring `max_tokens` to limit response lengths. This helps manage costs and ensures the model doesn't generate excessively long responses:

=== "Python"

    ```python
    from strands import Agent
    from strands.models import BedrockModel

    # Configure model with token limits
    model = BedrockModel(
        model_id="us.amazon.nova-premier-v1:0",
        max_tokens=2000  # Limit response tokens
    )

    agent = Agent(model=model)
    ```

{{ ts_not_supported_code() }}

When the model's response exceeds the configured token limit, the agent loop terminates with a `max_tokens` stop reason. See [Agent Loop - Stop Reasons](../../user-guide/concepts/agents/agent-loop.md#stop-reasons) for details on handling this condition.

#### Execution Timeouts

Implement wall-clock time limits to ensure agent invocations complete within acceptable timeframes. This can be achieved through hook-based approaches or external timeout wrappers:

=== "Python"

    ```python
    import asyncio
    from strands import Agent

    async def invoke_with_timeout(agent: Agent, prompt: str, timeout_seconds: float):
        """Execute agent with a timeout."""
        try:
            return await asyncio.wait_for(
                asyncio.to_thread(agent, prompt),
                timeout=timeout_seconds
            )
        except asyncio.TimeoutError:
            raise RuntimeError(f"Agent execution exceeded {timeout_seconds}s timeout")

    agent = Agent()

    # 60 second timeout
    result = await invoke_with_timeout(agent, "Analyze this data", timeout_seconds=60.0)
    ```

{{ ts_not_supported_code() }}

#### Multi-Agent Safety Mechanisms

When using multi-agent patterns, leverage the built-in safety mechanisms to prevent runaway orchestration:

**Swarm Pattern**

Swarms include configurable limits for handoffs, iterations, and timeouts:

=== "Python"

    ```python
    from strands.multiagent import Swarm

    swarm = Swarm(
        [agent1, agent2, agent3],
        max_handoffs=20,           # Limit agent-to-agent transfers
        max_iterations=20,         # Cap total execution iterations
        execution_timeout=900.0,   # 15 minute total timeout
        node_timeout=300.0         # 5 minute per-agent timeout
    )
    ```

{{ ts_not_supported_code("Swarm pattern is not yet available in TypeScript SDK") }}

See [Swarm - Safety Mechanisms](../../user-guide/concepts/multi-agent/swarm.md#safety-mechanisms) for details.

**Graph Pattern**

Graphs support execution limits especially important for cyclic workflows:

=== "Python"

    ```python
    from strands.multiagent import GraphBuilder

    builder = GraphBuilder()
    # ... add nodes and edges ...

    # Set execution limits for production
    builder.set_max_node_executions(10)  # Limit total node executions
    builder.set_execution_timeout(300)   # 5 minute total timeout
    builder.set_node_timeout(60)         # 1 minute per-node timeout

    graph = builder.build()
    ```

{{ ts_not_supported_code("Graph pattern is not yet available in TypeScript SDK") }}

See [Graph - GraphBuilder](../../user-guide/concepts/multi-agent/graph.md#3-graphbuilder) for configuration options.

## Deployment Patterns

Strands agents can be deployed using various options from serverless to dedicated server machines.

Built-in guides are available for several AWS services:

* **Bedrock AgentCore** - A secure, serverless runtime purpose-built for deploying and scaling dynamic AI agents and tools. [Learn more](deploy_to_bedrock_agentcore/index.md)

* **AWS Lambda** - Serverless option for short-lived agent interactions and batch processing with minimal infrastructure management. [Learn more](deploy_to_aws_lambda.md)

* **AWS Fargate** - Containerized deployment with streaming support, ideal for interactive applications requiring real-time responses or high concurrency. [Learn more](deploy_to_aws_fargate.md)

* **AWS App Runner** - Containerized deployment with streaming support, automated deployment, scaling, and load balancing, ideal for interactive applications requiring real-time responses or high concurrency. [Learn more](deploy_to_aws_apprunner.md)

* **Amazon EKS** - Containerized deployment with streaming support, ideal for interactive applications requiring real-time responses or high concurrency. [Learn more](deploy_to_amazon_eks.md)

* **Amazon EC2** - Maximum control and flexibility for high-volume applications or specialized infrastructure requirements. [Learn more](deploy_to_amazon_ec2.md)

## Monitoring and Observability

For production deployments, implement comprehensive monitoring:

1. **Tool Execution Metrics**: Monitor execution time and error rates for each tool.
2. **Token Usage**: Track token consumption for cost optimization.
3. **Response Times**: Monitor end-to-end response times.
4. **Error Rates**: Track and alert on agent errors.

Consider integrating with AWS CloudWatch for metrics collection and alerting.

See [Observability](../../user-guide/observability-evaluation/observability.md) for more information.

## Summary

Operating Strands agents in production requires careful consideration of configuration, security, and performance optimization. By following the best practices outlined in this guide you can ensure your agents operate reliably and efficiently at scale. Choose the deployment pattern that best suits your application requirements, and implement appropriate error handling and observability measures to maintain operational excellence in your production environment.

## Related Topics

- [Conversation Management](../../user-guide/concepts/agents/conversation-management.md)
- [Streaming - Async Iterator](../../user-guide/concepts/streaming/async-iterators.md)
- [Tool Development](../../user-guide/concepts/tools/index.md)
- [Guardrails](../../user-guide/safety-security/guardrails.md)
- [Responsible AI](../../user-guide/safety-security/responsible-ai.md)
