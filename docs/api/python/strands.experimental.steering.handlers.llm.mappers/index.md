LLM steering prompt mappers for generating evaluation prompts.

## LLMPromptMapper

```python
class LLMPromptMapper(Protocol)
```

Defined in: [src/strands/experimental/steering/handlers/llm/mappers.py:82](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/steering/handlers/llm/mappers.py#L82)

Protocol for mapping context and events to LLM evaluation prompts.

#### create\_steering\_prompt

```python
def create_steering_prompt(steering_context: SteeringContext,
                           tool_use: ToolUse | None = None,
                           **kwargs: Any) -> str
```

Defined in: [src/strands/experimental/steering/handlers/llm/mappers.py:85](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/steering/handlers/llm/mappers.py#L85)

Create steering prompt for LLM evaluation.

**Arguments**:

-   `steering_context` - Steering context with populated data
-   `tool_use` - Tool use object for tool call events (None for other events)
-   `**kwargs` - Additional event data for other steering events

**Returns**:

Formatted prompt string for LLM evaluation

## DefaultPromptMapper

```python
class DefaultPromptMapper(LLMPromptMapper)
```

Defined in: [src/strands/experimental/steering/handlers/llm/mappers.py:101](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/steering/handlers/llm/mappers.py#L101)

Default prompt mapper for steering evaluation.

#### create\_steering\_prompt

```python
def create_steering_prompt(steering_context: SteeringContext,
                           tool_use: ToolUse | None = None,
                           **kwargs: Any) -> str
```

Defined in: [src/strands/experimental/steering/handlers/llm/mappers.py:104](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/steering/handlers/llm/mappers.py#L104)

Create default steering prompt using Agent SOP structure.

Uses Agent SOP format for structured, constraint-based prompts. See: [https://github.com/strands-agents/agent-sop](https://github.com/strands-agents/agent-sop)