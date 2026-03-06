Tool provider interface.

## ToolProvider

```python
class ToolProvider(ABC)
```

Defined in: [src/strands/tools/tool\_provider.py:11](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/tool_provider.py#L11)

Interface for providing tools with lifecycle management.

Provides a way to load a collection of tools and clean them up when done, with lifecycle managed by the agent.

#### load\_tools

```python
@abstractmethod
async def load_tools(**kwargs: Any) -> Sequence["AgentTool"]
```

Defined in: [src/strands/tools/tool\_provider.py:19](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/tool_provider.py#L19)

Load and return the tools in this provider.

**Arguments**:

-   `**kwargs` - Additional arguments for future compatibility.

**Returns**:

List of tools that are ready to use.

#### add\_consumer

```python
@abstractmethod
def add_consumer(consumer_id: Any, **kwargs: Any) -> None
```

Defined in: [src/strands/tools/tool\_provider.py:31](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/tool_provider.py#L31)

Add a consumer to this tool provider.

**Arguments**:

-   `consumer_id` - Unique identifier for the consumer.
-   `**kwargs` - Additional arguments for future compatibility.

#### remove\_consumer

```python
@abstractmethod
def remove_consumer(consumer_id: Any, **kwargs: Any) -> None
```

Defined in: [src/strands/tools/tool\_provider.py:41](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/tool_provider.py#L41)

Remove a consumer from this tool provider.

This method must be idempotent - calling it multiple times with the same ID should have no additional effect after the first call.

Provider may clean up resources when no consumers remain.

**Arguments**:

-   `consumer_id` - Unique identifier for the consumer.
-   `**kwargs` - Additional arguments for future compatibility.