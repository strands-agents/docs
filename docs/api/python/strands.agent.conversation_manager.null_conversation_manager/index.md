Null implementation of conversation management.

## NullConversationManager

```python
class NullConversationManager(ConversationManager)
```

Defined in: [src/strands/agent/conversation\_manager/null\_conversation\_manager.py:11](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/null_conversation_manager.py#L11)

A no-op conversation manager that does not modify the conversation history.

Useful for:

-   Testing scenarios where conversation management should be disabled
-   Cases where conversation history is managed externally
-   Situations where the full conversation history should be preserved

#### apply\_management

```python
def apply_management(agent: "Agent", **kwargs: Any) -> None
```

Defined in: [src/strands/agent/conversation\_manager/null\_conversation\_manager.py:21](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/null_conversation_manager.py#L21)

Does nothing to the conversation history.

**Arguments**:

-   `agent` - The agent whose conversation history will remain unmodified.
-   `**kwargs` - Additional keyword arguments for future extensibility.

#### reduce\_context

```python
def reduce_context(agent: "Agent",
                   e: Exception | None = None,
                   **kwargs: Any) -> None
```

Defined in: [src/strands/agent/conversation\_manager/null\_conversation\_manager.py:30](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/null_conversation_manager.py#L30)

Does not reduce context.

When called reactively (e is not None), re-raises the overflow exception since this manager cannot reduce context. When called proactively (e is None), returns silently.

**Arguments**:

-   `agent` - The agent whose conversation history will remain unmodified.
-   `e` - The exception that triggered the context reduction, if any.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Raises**:

-   `e` - If provided (reactive overflow).