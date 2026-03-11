LLM-based steering handler that uses an LLM to provide contextual guidance.

## LLMSteeringHandler

```python
class LLMSteeringHandler(SteeringHandler)
```

Defined in: [src/strands/vended\_plugins/steering/handlers/llm/llm\_handler.py:33](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/handlers/llm/llm_handler.py#L33)

Steering handler that uses an LLM to provide contextual guidance.

Uses natural language prompts to evaluate tool calls and provide contextual steering guidance to help agents navigate complex workflows.

#### \_\_init\_\_

```python
def __init__(system_prompt: str,
             prompt_mapper: LLMPromptMapper | None = None,
             model: Model | None = None,
             context_providers: list[SteeringContextProvider] | None = None)
```

Defined in: [src/strands/vended\_plugins/steering/handlers/llm/llm\_handler.py:40](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/handlers/llm/llm_handler.py#L40)

Initialize the LLMSteeringHandler.

**Arguments**:

-   `system_prompt` - System prompt defining steering guidance rules
-   `prompt_mapper` - Custom prompt mapper for evaluation prompts
-   `model` - Optional model override for steering evaluation
-   `context_providers` - List of context providers for populating steering context. Defaults to \[LedgerProvider()\] if None. Pass an empty list to disable context providers.

#### steer\_before\_tool

```python
async def steer_before_tool(*, agent: Agent, tool_use: ToolUse,
                            **kwargs: Any) -> ToolSteeringAction
```

Defined in: [src/strands/vended\_plugins/steering/handlers/llm/llm\_handler.py:65](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/handlers/llm/llm_handler.py#L65)

Provide contextual guidance for tool usage.

**Arguments**:

-   `agent` - The agent instance
-   `tool_use` - The tool use object with name and arguments
-   `**kwargs` - Additional keyword arguments for steering evaluation

**Returns**:

SteeringAction indicating how to guide the tool execution