Sliding window conversation history management.

## SlidingWindowConversationManager

```python
class SlidingWindowConversationManager(ConversationManager)
```

Defined in: [src/strands/agent/conversation\_manager/sliding\_window\_conversation\_manager.py:20](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/sliding_window_conversation_manager.py#L20)

Implements a sliding window strategy for managing conversation history.

This class handles the logic of maintaining a conversation window that preserves tool usage pairs and avoids invalid window states.

When truncation is enabled (the default), large tool results are partially truncated, preserving the first and last 200 characters, and image blocks inside tool results are replaced with descriptive text placeholders. Truncation targets the oldest tool results first so the most relevant recent context is preserved as long as possible.

Supports proactive management during agent loop execution via the per\_turn parameter.

#### \_\_init\_\_

```python
def __init__(window_size: int = 40,
             should_truncate_results: bool = True,
             *,
             per_turn: bool | int = False)
```

Defined in: [src/strands/agent/conversation\_manager/sliding\_window\_conversation\_manager.py:34](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/sliding_window_conversation_manager.py#L34)

Initialize the sliding window conversation manager.

**Arguments**:

-   `window_size` - Maximum number of messages to keep in the agent’s history. Defaults to 40 messages.
    
-   `should_truncate_results` - Truncate tool results when a message is too large for the model’s context window
    
-   `per_turn` - Controls when to apply message management during agent execution.
    
    -   False (default): Only apply management at the end (default behavior)
    -   True: Apply management before every model call
    -   int (e.g., 3): Apply management before every N model calls
    
    When to use per\_turn: If your agent performs many tool operations in loops (e.g., web browsing with frequent screenshots), enable per\_turn to proactively manage message history and prevent the agent loop from slowing down. Start with per\_turn=True and adjust to a specific frequency (e.g., per\_turn=5) if needed for performance tuning.
    

**Raises**:

-   `ValueError` - If per\_turn is 0 or a negative integer.

#### register\_hooks

```python
def register_hooks(registry: "HookRegistry", **kwargs: Any) -> None
```

Defined in: [src/strands/agent/conversation\_manager/sliding\_window\_conversation\_manager.py:71](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/sliding_window_conversation_manager.py#L71)

Register hook callbacks for per-turn conversation management.

**Arguments**:

-   `registry` - The hook registry to register callbacks with.
-   `**kwargs` - Additional keyword arguments for future extensibility.

#### get\_state

```python
def get_state() -> dict[str, Any]
```

Defined in: [src/strands/agent/conversation\_manager/sliding\_window\_conversation\_manager.py:113](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/sliding_window_conversation_manager.py#L113)

Get the current state of the conversation manager.

**Returns**:

Dictionary containing the manager’s state, including model call count for per-turn tracking.

#### restore\_from\_session

```python
def restore_from_session(state: dict[str, Any]) -> list | None
```

Defined in: [src/strands/agent/conversation\_manager/sliding\_window\_conversation\_manager.py:123](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/sliding_window_conversation_manager.py#L123)

Restore the conversation manager’s state from a session.

**Arguments**:

-   `state` - Previous state of the conversation manager

**Returns**:

Optional list of messages to prepend to the agent’s messages.

#### apply\_management

```python
def apply_management(agent: "Agent", **kwargs: Any) -> None
```

Defined in: [src/strands/agent/conversation\_manager/sliding\_window\_conversation\_manager.py:136](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/sliding_window_conversation_manager.py#L136)

Apply the sliding window to the agent’s messages array to maintain a manageable history size.

This method is called after every event loop cycle to apply a sliding window if the message count exceeds the window size.

**Arguments**:

-   `agent` - The agent whose messages will be managed. This list is modified in-place.
-   `**kwargs` - Additional keyword arguments for future extensibility.

#### reduce\_context

```python
def reduce_context(agent: "Agent",
                   e: Exception | None = None,
                   **kwargs: Any) -> None
```

Defined in: [src/strands/agent/conversation\_manager/sliding\_window\_conversation\_manager.py:156](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/sliding_window_conversation_manager.py#L156)

Trim the oldest messages to reduce the conversation context size.

The method handles special cases where trimming the messages leads to:

-   toolResult with no corresponding toolUse
-   toolUse with no corresponding toolResult

**Arguments**:

-   `agent` - The agent whose messages will be reduce. This list is modified in-place.
-   `e` - The exception that triggered the context reduction, if any.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Raises**:

-   `ContextWindowOverflowException` - If the context cannot be reduced further and a context overflow error was provided (e is not None). When called during routine window management (e is None), logs a warning and returns without modification.