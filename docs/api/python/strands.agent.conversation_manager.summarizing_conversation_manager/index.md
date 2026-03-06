Summarizing conversation history management with configurable options.

## SummarizingConversationManager

```python
class SummarizingConversationManager(ConversationManager)
```

Defined in: [src/strands/agent/conversation\_manager/summarizing\_conversation\_manager.py:54](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/summarizing_conversation_manager.py#L54)

Implements a summarizing window manager.

This manager provides a configurable option to summarize older context instead of simply trimming it, helping preserve important information while staying within context limits.

#### \_\_init\_\_

```python
def __init__(summary_ratio: float = 0.3,
             preserve_recent_messages: int = 10,
             summarization_agent: Optional["Agent"] = None,
             summarization_system_prompt: str | None = None)
```

Defined in: [src/strands/agent/conversation\_manager/summarizing\_conversation\_manager.py:62](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/summarizing_conversation_manager.py#L62)

Initialize the summarizing conversation manager.

**Arguments**:

-   `summary_ratio` - Ratio of messages to summarize vs keep when context overflow occurs. Value between 0.1 and 0.8. Defaults to 0.3 (summarize 30% of oldest messages).
-   `preserve_recent_messages` - Minimum number of recent messages to always keep. Defaults to 10 messages.
-   `summarization_agent` - Optional agent to use for summarization instead of the parent agent. If provided, this agent can use tools as part of the summarization process.
-   `summarization_system_prompt` - Optional system prompt override for summarization. If None, uses the default summarization prompt.

#### restore\_from\_session

```python
@override
def restore_from_session(state: dict[str, Any]) -> list[Message] | None
```

Defined in: [src/strands/agent/conversation\_manager/summarizing\_conversation\_manager.py:95](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/summarizing_conversation_manager.py#L95)

Restores the Summarizing Conversation manager from its previous state in a session.

**Arguments**:

-   `state` - The previous state of the Summarizing Conversation Manager.

**Returns**:

Optionally returns the previous conversation summary if it exists.

#### get\_state

```python
def get_state() -> dict[str, Any]
```

Defined in: [src/strands/agent/conversation\_manager/summarizing\_conversation\_manager.py:108](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/summarizing_conversation_manager.py#L108)

Returns a dictionary representation of the state for the Summarizing Conversation Manager.

#### apply\_management

```python
def apply_management(agent: "Agent", **kwargs: Any) -> None
```

Defined in: [src/strands/agent/conversation\_manager/summarizing\_conversation\_manager.py:112](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/summarizing_conversation_manager.py#L112)

Apply management strategy to conversation history.

For the summarizing conversation manager, no proactive management is performed. Summarization only occurs when there’s a context overflow that triggers reduce\_context.

**Arguments**:

-   `agent` - The agent whose conversation history will be managed. The agent’s messages list is modified in-place.
-   `**kwargs` - Additional keyword arguments for future extensibility.

#### reduce\_context

```python
def reduce_context(agent: "Agent",
                   e: Exception | None = None,
                   **kwargs: Any) -> None
```

Defined in: [src/strands/agent/conversation\_manager/summarizing\_conversation\_manager.py:126](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/summarizing_conversation_manager.py#L126)

Reduce context using summarization.

**Arguments**:

-   `agent` - The agent whose conversation history will be reduced. The agent’s messages list is modified in-place.
-   `e` - The exception that triggered the context reduction, if any.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Raises**:

-   `ContextWindowOverflowException` - If the context cannot be summarized.