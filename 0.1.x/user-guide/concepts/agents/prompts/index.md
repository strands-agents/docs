# Prompts

In the Strands Agents SDK, system prompts and user messages are the primary way to communicate with AI models. The SDK provides a flexible system for managing prompts, including both system prompts and user messages.

## System Prompts

System prompts provide high-level instructions to the model about its role, capabilities, and constraints. They set the foundation for how the model should behave throughout the conversation. You can specify the system prompt when initializing an Agent:

```
from strands import Agent

agent = Agent(
    system_prompt=(
        "You are a financial advisor specialized in retirement planning. "
        "Use tools to gather information and provide personalized advice. "
        "Always explain your reasoning and cite sources when possible."
    )
)

```

If you do not specify a system prompt, the model will behave according to its default settings.

## User Messages

These are your queries or requests to the agent. The SDK supports multiple techniques for prompting.

### Direct Prompting

The simplest way to interact with an agent is through direct prompting:

```
response = agent("What is the time in Seattle")

```

### Direct Tool Calls

For programmatic control, you can call tools directly:

```
result = agent.tool.current_time(timezone="US/Pacific")

```

This bypasses the natural language interface and directly executes the tool with the specified parameters. By default, direct tool calls are added to the [session state](../sessions-state/) but can be optionally not included by specifying `record_direct_tool_call=False`.

## Prompt Engineering

For guidance on how to write safe and responsible prompts, please refer to our [Safety & Security - Prompt Engineering](../../../safety-security/prompt-engineering/) documentation.

Further resources:

- [Prompt Engineering Guide](https://www.promptingguide.ai)
- [Amazon Bedrock - Prompt engineering concepts](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-engineering-guidelines.html)
- [Llama - Prompting](https://www.llama.com/docs/how-to-guides/prompting/)
- [Anthropic - Prompt engineering overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [OpenAI - Prompt engineering](https://platform.openai.com/docs/guides/prompt-engineering/six-strategies-for-getting-better-results)
