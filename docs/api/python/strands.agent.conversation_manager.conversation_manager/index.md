Abstract interface for conversation history management.

## ConversationManager

```python
class ConversationManager(ABC, HookProvider)
```

Defined in: [src/strands/agent/conversation\_manager/conversation\_manager.py:13](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/conversation_manager.py#L13)

Abstract base class for managing conversation history.

This class provides an interface for implementing conversation management strategies to control the size of message arrays/conversation histories, helping to:

-   Manage memory usage
-   Control context length
-   Maintain relevant conversation state

ConversationManager implements the HookProvider protocol, allowing derived classes to register hooks for agent lifecycle events. Derived classes that override register\_hooks must call the base implementation to ensure proper hook registration.

**Example**:

```python
class MyConversationManager(ConversationManager):
    def register_hooks(self, registry: HookRegistry, **kwargs: Any) -> None:
        super().register_hooks(registry, **kwargs)
        # Register additional hooks here
```

#### \_\_init\_\_

```python
def __init__() -> None
```

Defined in: [src/strands/agent/conversation\_manager/conversation\_manager.py:36](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/conversation_manager.py#L36)

Initialize the ConversationManager.

**Attributes**:

-   `removed_message_count` - The messages that have been removed from the agents messages array. These represent messages provided by the user or LLM that have been removed, not messages included by the conversation manager through something like summarization.

#### register\_hooks

```python
def register_hooks(registry: HookRegistry, **kwargs: Any) -> None
```

Defined in: [src/strands/agent/conversation\_manager/conversation\_manager.py:46](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/conversation_manager.py#L46)

Register hooks for agent lifecycle events.

Derived classes that override this method must call the base implementation to ensure proper hook registration chain.

**Arguments**:

-   `registry` - The hook registry to register callbacks with.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Example**:

```python
def register_hooks(self, registry: HookRegistry, **kwargs: Any) -> None:
    super().register_hooks(registry, **kwargs)
    registry.add_callback(SomeEvent, self.on_some_event)
```

#### restore\_from\_session

```python
def restore_from_session(state: dict[str, Any]) -> list[Message] | None
```

Defined in: [src/strands/agent/conversation\_manager/conversation\_manager.py:65](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/conversation_manager.py#L65)

Restore the Conversation Manager’s state from a session.

**Arguments**:

-   `state` - Previous state of the conversation manager

**Returns**:

Optional list of messages to prepend to the agents messages. By default returns None.

#### get\_state

```python
def get_state() -> dict[str, Any]
```

Defined in: [src/strands/agent/conversation\_manager/conversation\_manager.py:78](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/conversation_manager.py#L78)

Get the current state of a Conversation Manager as a Json serializable dictionary.

#### apply\_management

```python
@abstractmethod
def apply_management(agent: "Agent", **kwargs: Any) -> None
```

Defined in: [src/strands/agent/conversation\_manager/conversation\_manager.py:86](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/conversation_manager.py#L86)

Applies management strategy to the provided agent.

Processes the conversation history to maintain appropriate size by modifying the messages list in-place. Implementations should handle message pruning, summarization, or other size management techniques to keep the conversation context within desired bounds.

**Arguments**:

-   `agent` - The agent whose conversation history will be manage. This list is modified in-place.
-   `**kwargs` - Additional keyword arguments for future extensibility.

#### reduce\_context

```python
@abstractmethod
def reduce_context(agent: "Agent",
                   e: Exception | None = None,
                   **kwargs: Any) -> None
```

Defined in: [src/strands/agent/conversation\_manager/conversation\_manager.py:101](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/conversation_manager/conversation_manager.py#L101)

Called when the model’s context window is exceeded.

This method should implement the specific strategy for reducing the window size when a context overflow occurs. It is typically called after a ContextWindowOverflowException is caught.

Implementations might use strategies such as:

-   Removing the N oldest messages
-   Summarizing older context
-   Applying importance-based filtering
-   Maintaining critical conversation markers

**Arguments**:

-   `agent` - The agent whose conversation history will be reduced. This list is modified in-place.
-   `e` - The exception that triggered the context reduction, if any.
-   `**kwargs` - Additional keyword arguments for future extensibility.