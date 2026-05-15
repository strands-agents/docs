Multi-Agent Base Class.

Provides minimal foundation for multi-agent patterns (Swarm, Graph).

## Status

```python
class Status(Enum)
```

Defined in: [src/strands/multiagent/base.py:25](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L25)

Execution status for both graphs and nodes.

**Attributes**:

-   `PENDING` - Task has not started execution yet.
-   `EXECUTING` - Task is currently running.
-   `COMPLETED` - Task finished successfully.
-   `FAILED` - Task encountered an error and could not complete.
-   `INTERRUPTED` - Task was interrupted by user.

## NodeResult

```python
@dataclass
class NodeResult()
```

Defined in: [src/strands/multiagent/base.py:44](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L44)

Unified result from node execution - handles both Agent and nested MultiAgentBase results.

#### get\_agent\_results

```python
def get_agent_results() -> list[AgentResult]
```

Defined in: [src/strands/multiagent/base.py:60](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L60)

Get all AgentResult objects from this node, flattened if nested.

#### to\_dict

```python
def to_dict() -> dict[str, Any]
```

Defined in: [src/strands/multiagent/base.py:73](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L73)

Convert NodeResult to JSON-serializable dict, ignoring state field.

#### from\_dict

```python
@classmethod
def from_dict(cls, data: dict[str, Any]) -> "NodeResult"
```

Defined in: [src/strands/multiagent/base.py:94](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L94)

Rehydrate a NodeResult from persisted JSON.

## MultiAgentResult

```python
@dataclass
class MultiAgentResult()
```

Defined in: [src/strands/multiagent/base.py:129](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L129)

Result from multi-agent execution with accumulated metrics.

#### from\_dict

```python
@classmethod
def from_dict(cls, data: dict[str, Any]) -> "MultiAgentResult"
```

Defined in: [src/strands/multiagent/base.py:141](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L141)

Rehydrate a MultiAgentResult from persisted JSON.

#### to\_dict

```python
def to_dict() -> dict[str, Any]
```

Defined in: [src/strands/multiagent/base.py:165](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L165)

Convert MultiAgentResult to JSON-serializable dict.

## MultiAgentBase

```python
class MultiAgentBase(ABC)
```

Defined in: [src/strands/multiagent/base.py:179](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L179)

Base class for multi-agent helpers.

This class integrates with existing Strands Agent instances and provides multi-agent orchestration capabilities.

**Attributes**:

-   `id` - Unique MultiAgent id for session management,etc.

#### invoke\_async

```python
@abstractmethod
async def invoke_async(task: MultiAgentInput,
                       invocation_state: dict[str, Any] | None = None,
                       **kwargs: Any) -> MultiAgentResult
```

Defined in: [src/strands/multiagent/base.py:192](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L192)

Invoke asynchronously.

**Arguments**:

-   `task` - The task to execute
-   `invocation_state` - Additional state/context passed to underlying agents. Defaults to None to avoid mutable default argument issues.
-   `**kwargs` - Additional keyword arguments passed to underlying agents.

#### stream\_async

```python
async def stream_async(task: MultiAgentInput,
                       invocation_state: dict[str, Any] | None = None,
                       **kwargs: Any) -> AsyncIterator[dict[str, Any]]
```

Defined in: [src/strands/multiagent/base.py:205](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L205)

Stream events during multi-agent execution.

Default implementation executes invoke\_async and yields the result as a single event. Subclasses can override this method to provide true streaming capabilities.

**Arguments**:

-   `task` - The task to execute
-   `invocation_state` - Additional state/context passed to underlying agents. Defaults to None to avoid mutable default argument issues.
-   `**kwargs` - Additional keyword arguments passed to underlying agents.

**Yields**:

Dictionary events containing multi-agent execution information including:

-   Multi-agent coordination events (node start/complete, handoffs)
-   Forwarded single-agent events with node context
-   Final result event

#### \_\_call\_\_

```python
def __call__(task: MultiAgentInput,
             invocation_state: dict[str, Any] | None = None,
             **kwargs: Any) -> MultiAgentResult
```

Defined in: [src/strands/multiagent/base.py:230](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L230)

Invoke synchronously.

**Arguments**:

-   `task` - The task to execute
-   `invocation_state` - Additional state/context passed to underlying agents. Defaults to None to avoid mutable default argument issues.
-   `**kwargs` - Additional keyword arguments passed to underlying agents.

#### serialize\_state

```python
def serialize_state() -> dict[str, Any]
```

Defined in: [src/strands/multiagent/base.py:250](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L250)

Return a JSON-serializable snapshot of the orchestrator state.

#### deserialize\_state

```python
def deserialize_state(payload: dict[str, Any]) -> None
```

Defined in: [src/strands/multiagent/base.py:254](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L254)

Restore orchestrator state from a session dict.

#### add\_hook

```python
def add_hook(callback: HookCallback,
             event_type: type | list[type] | None = None) -> None
```

Defined in: [src/strands/multiagent/base.py:258](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L258)

Register a hook callback with the orchestrator.

Subclasses that support hooks should override this method to register the callback with their hook registry.

**Arguments**:

-   `callback` - The callback function to invoke when events of this type occur.
-   `event_type` - The class type(s) of events this callback should handle. Can be a single type, a list of types, or None to infer from the callback’s first parameter type hint.