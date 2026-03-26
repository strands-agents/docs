This guide provides best practices for deploying Strands agents in production environments, focusing on security, stability, and performance optimization.

## Production Configuration

When transitioning from development to production, it’s essential to configure your agents for optimal performance, security, and reliability. The following sections outline key considerations and recommended settings.

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

-   [Bedrock Model Usage](/docs/user-guide/concepts/model-providers/amazon-bedrock/index.md#basic-usage)
-   [Ollama Model Usage](/docs/user-guide/concepts/model-providers/ollama/index.md#basic-usage)

### Tool Management

In production environments, it’s critical to control which tools are available to your agent. You should:

-   **Explicitly Specify Tools**: Always provide an explicit list of tools rather than loading all available tools
-   **Keep Automatic Tool Loading Disabled**: For stability in production, keep automatic loading and reloading of tools disabled (the default behavior)
-   **Audit Tool Usage**: Regularly review which tools are being used and remove any that aren’t necessary for your use case

```python
agent = Agent(
    ...,
    # Explicitly specify tools
    tools=[weather_research, weather_analysis, summarizer],
    # Automatic tool loading is disabled by default (recommended for production)
    # load_tools_from_directory=False,  # This is the default
)
```

See [Adding Tools to Agents](/docs/user-guide/concepts/tools/index.md#adding-tools-to-agents) and [Auto reloading tools](/docs/user-guide/concepts/tools/index.md#auto-loading-and-reloading-tools) for more information.

### Security Considerations

For production environments:

1.  **Tool Permissions**: Review and restrict the permissions of each tool to follow the principle of least privilege
2.  **Input Validation**: Always validate user inputs before passing to Strands Agents
3.  **Output Sanitization**: Sanitize outputs for sensitive information. Consider leveraging [guardrails](/docs/user-guide/safety-security/guardrails/index.md) as an automated mechanism.

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

The [<code dir="auto">SlidingWindowConversationManager</code>](/docs/user-guide/concepts/agents/conversation-management/index.md#slidingwindowconversationmanager) helps prevent context window overflow exceptions by maintaining a reasonable conversation history size.

### Streaming for Responsiveness

For improved user experience in production applications, leverage streaming via `stream_async()` to deliver content to the caller as it’s received, resulting in a lower-latency experience:

```python
# For web applications
async def stream_agent_response(prompt):
    agent = Agent(...)

    ...

    async for event in agent.stream_async(prompt):
        if "data" in event:
            yield event["data"]
```

See [Async Iterators](/docs/user-guide/concepts/streaming/async-iterators/index.md) for more information.

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

## Deployment Patterns

Strands agents can be deployed using various options from serverless to dedicated server machines.

Built-in guides are available for several AWS services:

-   **Bedrock AgentCore** - A secure, serverless runtime purpose-built for deploying and scaling dynamic AI agents and tools. [Learn more](/docs/user-guide/deploy/deploy_to_bedrock_agentcore/index.md)
    
-   **AWS Lambda** - Serverless option for short-lived agent interactions and batch processing with minimal infrastructure management. [Learn more](/docs/user-guide/deploy/deploy_to_aws_lambda/index.md)
    
-   **AWS Fargate** - Containerized deployment with streaming support, ideal for interactive applications requiring real-time responses or high concurrency. [Learn more](/docs/user-guide/deploy/deploy_to_aws_fargate/index.md)
    
-   **AWS App Runner** - Containerized deployment with streaming support, automated deployment, scaling, and load balancing, ideal for interactive applications requiring real-time responses or high concurrency. [Learn more](/docs/user-guide/deploy/deploy_to_aws_apprunner/index.md)
    
-   **Amazon EKS** - Containerized deployment with streaming support, ideal for interactive applications requiring real-time responses or high concurrency. [Learn more](/docs/user-guide/deploy/deploy_to_amazon_eks/index.md)
    
-   **Amazon EC2** - Maximum control and flexibility for high-volume applications or specialized infrastructure requirements. [Learn more](/docs/user-guide/deploy/deploy_to_amazon_ec2/index.md)
    

## Monitoring and Observability

For production deployments, implement comprehensive monitoring:

1.  **Tool Execution Metrics**: Monitor execution time and error rates for each tool.
2.  **Token Usage**: Track token consumption for cost optimization.
3.  **Response Times**: Monitor end-to-end response times.
4.  **Error Rates**: Track and alert on agent errors.

Consider integrating with AWS CloudWatch for metrics collection and alerting.

See [Observability](/docs/user-guide/observability-evaluation/observability/index.md) for more information.

## Summary

Operating Strands agents in production requires careful consideration of configuration, security, and performance optimization. By following the best practices outlined in this guide you can ensure your agents operate reliably and efficiently at scale. Choose the deployment pattern that best suits your application requirements, and implement appropriate error handling and observability measures to maintain operational excellence in your production environment.

## Related Topics

-   [Conversation Management](/docs/user-guide/concepts/agents/conversation-management/index.md)
-   [Streaming - Async Iterator](/docs/user-guide/concepts/streaming/async-iterators/index.md)
-   [Tool Development](/docs/user-guide/concepts/tools/index.md)
-   [Guardrails](/docs/user-guide/safety-security/guardrails/index.md)
-   [Responsible AI](/docs/user-guide/safety-security/responsible-ai/index.md)