Agent Interface.

Defines the minimal interface that all agent types must implement.

## AgentBase

```python
@runtime_checkable
class AgentBase(Protocol)
```

Defined in: [src/strands/agent/base.py:14](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/base.py#L14)

Protocol defining the interface for all agent types in Strands.

This protocol defines the minimal contract that all agent implementations must satisfy.

#### invoke\_async

```python
async def invoke_async(prompt: AgentInput = None,
                       **kwargs: Any) -> AgentResult
```

Defined in: [src/strands/agent/base.py:21](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/base.py#L21)

Asynchronously invoke the agent with the given prompt.

**Arguments**:

-   `prompt` - Input to the agent.
-   `**kwargs` - Additional arguments.

**Returns**:

AgentResult containing the agent’s response.

#### \_\_call\_\_

```python
def __call__(prompt: AgentInput = None, **kwargs: Any) -> AgentResult
```

Defined in: [src/strands/agent/base.py:37](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/base.py#L37)

Synchronously invoke the agent with the given prompt.

**Arguments**:

-   `prompt` - Input to the agent.
-   `**kwargs` - Additional arguments.

**Returns**:

AgentResult containing the agent’s response.

#### stream\_async

```python
def stream_async(prompt: AgentInput = None,
                 **kwargs: Any) -> AsyncIterator[Any]
```

Defined in: [src/strands/agent/base.py:53](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/base.py#L53)

Stream agent execution asynchronously.

**Arguments**:

-   `prompt` - Input to the agent.
-   `**kwargs` - Additional arguments.

**Yields**:

Events representing the streaming execution.