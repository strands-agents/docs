Swarm Multi-Agent Pattern Implementation.

This module provides a collaborative agent orchestration system where agents work together as a team to solve complex tasks, with shared context and autonomous coordination.

Key Features:

-   Self-organizing agent teams with shared working memory
-   Tool-based coordination
-   Autonomous agent collaboration without central control
-   Dynamic task distribution based on agent capabilities
-   Collective intelligence through shared context
-   Human input via user interrupts raised in BeforeNodeCallEvent hooks and agent nodes

## SwarmNode

```python
@dataclass
class SwarmNode()
```

Defined in: [src/strands/multiagent/swarm.py:63](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L63)

Represents a node (e.g. Agent) in the swarm.

#### \_\_post\_init\_\_

```python
def __post_init__() -> None
```

Defined in: [src/strands/multiagent/swarm.py:72](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L72)

Capture initial executor state after initialization.

#### \_\_hash\_\_

```python
def __hash__() -> int
```

Defined in: [src/strands/multiagent/swarm.py:78](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L78)

Return hash for SwarmNode based on node\_id.

#### \_\_eq\_\_

```python
def __eq__(other: Any) -> bool
```

Defined in: [src/strands/multiagent/swarm.py:82](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L82)

Return equality for SwarmNode based on node\_id.

#### \_\_str\_\_

```python
def __str__() -> str
```

Defined in: [src/strands/multiagent/swarm.py:88](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L88)

Return string representation of SwarmNode.

#### \_\_repr\_\_

```python
def __repr__() -> str
```

Defined in: [src/strands/multiagent/swarm.py:92](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L92)

Return detailed representation of SwarmNode.

#### reset\_executor\_state

```python
def reset_executor_state() -> None
```

Defined in: [src/strands/multiagent/swarm.py:96](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L96)

Reset SwarmNode executor state to initial state when swarm was created.

If Swarm is resuming from an interrupt, we reset the executor state from the interrupt context.

## SharedContext

```python
@dataclass
class SharedContext()
```

Defined in: [src/strands/multiagent/swarm.py:113](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L113)

Shared context between swarm nodes.

#### add\_context

```python
def add_context(node: SwarmNode, key: str, value: Any) -> None
```

Defined in: [src/strands/multiagent/swarm.py:118](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L118)

Add context.

## SwarmState

```python
@dataclass
class SwarmState()
```

Defined in: [src/strands/multiagent/swarm.py:162](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L162)

Current state of swarm execution.

#### current\_node

The agent currently executing

#### task

The original task from the user that is being executed

#### completion\_status

Current swarm execution status

#### shared\_context

Context shared between agents

#### node\_history

Complete history of agents that have executed

#### start\_time

When swarm execution began

#### results

Results from each agent execution

#### execution\_time

Total execution time in milliseconds

#### handoff\_node

The agent to execute next

#### handoff\_message

Message passed during agent handoff

#### should\_continue

```python
def should_continue(
        *, max_handoffs: int, max_iterations: int, execution_timeout: float,
        repetitive_handoff_detection_window: int,
        repetitive_handoff_min_unique_agents: int) -> tuple[bool, str]
```

Defined in: [src/strands/multiagent/swarm.py:180](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L180)

Check if the swarm should continue.

Returns: (should\_continue, reason)

## SwarmResult

```python
@dataclass
class SwarmResult(MultiAgentResult)
```

Defined in: [src/strands/multiagent/swarm.py:223](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L223)

Result from swarm execution - extends MultiAgentResult with swarm-specific details.

## Swarm

```python
class Swarm(MultiAgentBase)
```

Defined in: [src/strands/multiagent/swarm.py:229](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L229)

Self-organizing collaborative agent teams with shared working memory.

#### \_\_init\_\_

```python
def __init__(
        nodes: list[Agent],
        *,
        entry_point: Agent | None = None,
        max_handoffs: int = 20,
        max_iterations: int = 20,
        execution_timeout: float = 900.0,
        node_timeout: float = 300.0,
        repetitive_handoff_detection_window: int = 0,
        repetitive_handoff_min_unique_agents: int = 0,
        session_manager: SessionManager | None = None,
        hooks: list[HookProvider] | None = None,
        id: str = _DEFAULT_SWARM_ID,
        trace_attributes: Mapping[str, AttributeValue] | None = None) -> None
```

Defined in: [src/strands/multiagent/swarm.py:232](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L232)

Initialize Swarm with agents and configuration.

**Arguments**:

-   `id` - Unique swarm id (default: “default\_swarm”)
-   `nodes` - List of nodes (e.g. Agent) to include in the swarm
-   `entry_point` - Agent to start with. If None, uses the first agent (default: None)
-   `max_handoffs` - Maximum handoffs to agents and users (default: 20)
-   `max_iterations` - Maximum node executions within the swarm (default: 20)
-   `execution_timeout` - Total execution timeout in seconds (default: 900.0)
-   `node_timeout` - Individual node timeout in seconds (default: 300.0)
-   `repetitive_handoff_detection_window` - Number of recent nodes to check for repetitive handoffs Disabled by default (default: 0)
-   `repetitive_handoff_min_unique_agents` - Minimum unique agents required in recent sequence Disabled by default (default: 0)
-   `session_manager` - Session manager for persisting graph state and execution history (default: None)
-   `hooks` - List of hook providers for monitoring and extending graph execution behavior (default: None)
-   `trace_attributes` - Custom trace attributes to apply to the agent’s trace span (default: None)

#### \_\_call\_\_

```python
def __call__(task: MultiAgentInput,
             invocation_state: dict[str, Any] | None = None,
             **kwargs: Any) -> SwarmResult
```

Defined in: [src/strands/multiagent/swarm.py:303](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L303)

Invoke the swarm synchronously.

**Arguments**:

-   `task` - The task to execute
-   `invocation_state` - Additional state/context passed to underlying agents. Defaults to None to avoid mutable default argument issues.
-   `**kwargs` - Keyword arguments allowing backward compatible future changes.

#### invoke\_async

```python
async def invoke_async(task: MultiAgentInput,
                       invocation_state: dict[str, Any] | None = None,
                       **kwargs: Any) -> SwarmResult
```

Defined in: [src/strands/multiagent/swarm.py:318](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L318)

Invoke the swarm asynchronously.

This method uses stream\_async internally and consumes all events until completion, following the same pattern as the Agent class.

**Arguments**:

-   `task` - The task to execute
-   `invocation_state` - Additional state/context passed to underlying agents. Defaults to None to avoid mutable default argument issues.
-   `**kwargs` - Keyword arguments allowing backward compatible future changes.

#### stream\_async

```python
async def stream_async(task: MultiAgentInput,
                       invocation_state: dict[str, Any] | None = None,
                       **kwargs: Any) -> AsyncIterator[dict[str, Any]]
```

Defined in: [src/strands/multiagent/swarm.py:342](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L342)

Stream events during swarm execution.

**Arguments**:

-   `task` - The task to execute
-   `invocation_state` - Additional state/context passed to underlying agents. Defaults to None to avoid mutable default argument issues.
-   `**kwargs` - Keyword arguments allowing backward compatible future changes.

**Yields**:

Dictionary events during swarm execution, such as:

-   multi\_agent\_node\_start: When a node begins execution
-   multi\_agent\_node\_stream: Forwarded agent events with node context
-   multi\_agent\_handoff: When control is handed off between agents
-   multi\_agent\_node\_stop: When a node stops execution
-   result: Final swarm result

#### serialize\_state

```python
def serialize_state() -> dict[str, Any]
```

Defined in: [src/strands/multiagent/swarm.py:949](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L949)

Serialize the current swarm state to a dictionary.

#### deserialize\_state

```python
def deserialize_state(payload: dict[str, Any]) -> None
```

Defined in: [src/strands/multiagent/swarm.py:979](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/swarm.py#L979)

Restore swarm state from a session dict and prepare for execution.

This method handles two scenarios:

1.  If the persisted status is COMPLETED, FAILED resets all nodes and graph state to allow re-execution from the beginning.
2.  Otherwise, restores the persisted state and prepares to resume execution from the next ready nodes.

**Arguments**:

-   `payload` - Dictionary containing persisted state data including status, completed nodes, results, and next nodes to execute.