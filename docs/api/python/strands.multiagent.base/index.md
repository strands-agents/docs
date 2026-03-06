Multi-Agent Base Class.

Provides minimal foundation for multi-agent patterns (Swarm, Graph).

## Status

```python
class Status(Enum)
```

Defined in: [src/strands/multiagent/base.py:24](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L24)

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

Defined in: [src/strands/multiagent/base.py:43](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L43)

Unified result from node execution - handles both Agent and nested MultiAgentBase results.

#### get\_agent\_results

```python
def get_agent_results() -> list[AgentResult]
```

Defined in: [src/strands/multiagent/base.py:59](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L59)

Get all AgentResult objects from this node, flattened if nested.

#### to\_dict

```python
def to_dict() -> dict[str, Any]
```

Defined in: [src/strands/multiagent/base.py:72](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L72)

Convert NodeResult to JSON-serializable dict, ignoring state field.

#### from\_dict

```python
@classmethod
def from_dict(cls, data: dict[str, Any]) -> "NodeResult"
```

Defined in: [src/strands/multiagent/base.py:93](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L93)

Rehydrate a NodeResult from persisted JSON.

## MultiAgentResult

```python
@dataclass
class MultiAgentResult()
```

Defined in: [src/strands/multiagent/base.py:128](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L128)

Result from multi-agent execution with accumulated metrics.

#### from\_dict

```python
@classmethod
def from_dict(cls, data: dict[str, Any]) -> "MultiAgentResult"
```

Defined in: [src/strands/multiagent/base.py:140](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L140)

Rehydrate a MultiAgentResult from persisted JSON.

#### to\_dict

```python
def to_dict() -> dict[str, Any]
```

Defined in: [src/strands/multiagent/base.py:164](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L164)

Convert MultiAgentResult to JSON-serializable dict.

## MultiAgentBase

```python
class MultiAgentBase(ABC)
```

Defined in: [src/strands/multiagent/base.py:178](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L178)

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

Defined in: [src/strands/multiagent/base.py:191](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L191)

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

Defined in: [src/strands/multiagent/base.py:204](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L204)

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

Defined in: [src/strands/multiagent/base.py:229](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L229)

Invoke synchronously.

**Arguments**:

-   `task` - The task to execute
-   `invocation_state` - Additional state/context passed to underlying agents. Defaults to None to avoid mutable default argument issues.
-   `**kwargs` - Additional keyword arguments passed to underlying agents.

#### serialize\_state

```python
def serialize_state() -> dict[str, Any]
```

Defined in: [src/strands/multiagent/base.py:249](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L249)

Return a JSON-serializable snapshot of the orchestrator state.

#### deserialize\_state

```python
def deserialize_state(payload: dict[str, Any]) -> None
```

Defined in: [src/strands/multiagent/base.py:253](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/base.py#L253)

Restore orchestrator state from a session dict.