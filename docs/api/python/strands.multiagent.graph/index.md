Directed Graph Multi-Agent Pattern Implementation.

This module provides a deterministic graph-based agent orchestration system where agents or MultiAgentBase instances (like Swarm or Graph) are nodes in a graph, executed according to edge dependencies, with output from one node passed as input to connected nodes.

Key Features:

-   Agents and MultiAgentBase instances (Swarm, Graph, etc.) as graph nodes
-   Deterministic execution based on dependency resolution
-   Output propagation along edges
-   Support for cyclic graphs (feedback loops)
-   Clear dependency management
-   Supports nested graphs (Graph as a node in another Graph)

## GraphState

```python
@dataclass
class GraphState()
```

Defined in: [src/strands/multiagent/graph.py:63](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L63)

Graph execution state.

**Attributes**:

-   `status` - Current execution status of the graph.
-   `completed_nodes` - Set of nodes that have completed execution.
-   `failed_nodes` - Set of nodes that failed during execution.
-   `interrupted_nodes` - Set of nodes that user interrupted during execution.
-   `execution_order` - List of nodes in the order they were executed.
-   `task` - The original input prompt/query provided to the graph execution. This represents the actual work to be performed by the graph as a whole. Entry point nodes receive this task as their input if they have no dependencies.
-   `start_time` - Timestamp when the current invocation started. Resets on each invocation, even when resuming from interrupt.
-   `execution_time` - Execution time of current invocation in milliseconds. Excludes time spent waiting for interrupt responses.

#### should\_continue

```python
def should_continue(max_node_executions: int | None,
                    execution_timeout: float | None) -> tuple[bool, str]
```

Defined in: [src/strands/multiagent/graph.py:106](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L106)

Check if the graph should continue execution.

Returns: (should\_continue, reason)

## GraphResult

```python
@dataclass
class GraphResult(MultiAgentResult)
```

Defined in: [src/strands/multiagent/graph.py:129](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L129)

Result from graph execution - extends MultiAgentResult with graph-specific details.

## GraphEdge

```python
@dataclass
class GraphEdge()
```

Defined in: [src/strands/multiagent/graph.py:142](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L142)

Represents an edge in the graph with an optional condition.

#### \_\_hash\_\_

```python
def __hash__() -> int
```

Defined in: [src/strands/multiagent/graph.py:149](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L149)

Return hash for GraphEdge based on from\_node and to\_node.

#### should\_traverse

```python
def should_traverse(state: GraphState) -> bool
```

Defined in: [src/strands/multiagent/graph.py:153](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L153)

Check if this edge should be traversed based on condition.

## GraphNode

```python
@dataclass
class GraphNode()
```

Defined in: [src/strands/multiagent/graph.py:161](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L161)

Represents a node in the graph.

#### \_\_post\_init\_\_

```python
def __post_init__() -> None
```

Defined in: [src/strands/multiagent/graph.py:173](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L173)

Capture initial executor state after initialization.

#### reset\_executor\_state

```python
def reset_executor_state() -> None
```

Defined in: [src/strands/multiagent/graph.py:182](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L182)

Reset GraphNode executor state to initial state when graph was created.

This is useful when nodes are executed multiple times and need to start fresh on each execution, providing stateless behavior.

#### \_\_hash\_\_

```python
def __hash__() -> int
```

Defined in: [src/strands/multiagent/graph.py:198](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L198)

Return hash for GraphNode based on node\_id.

#### \_\_eq\_\_

```python
def __eq__(other: Any) -> bool
```

Defined in: [src/strands/multiagent/graph.py:202](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L202)

Return equality for GraphNode based on node\_id.

## GraphBuilder

```python
class GraphBuilder()
```

Defined in: [src/strands/multiagent/graph.py:231](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L231)

Builder pattern for constructing graphs.

#### \_\_init\_\_

```python
def __init__() -> None
```

Defined in: [src/strands/multiagent/graph.py:234](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L234)

Initialize GraphBuilder with empty collections.

#### add\_node

```python
def add_node(executor: AgentBase | MultiAgentBase,
             node_id: str | None = None) -> GraphNode
```

Defined in: [src/strands/multiagent/graph.py:249](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L249)

Add an AgentBase or MultiAgentBase instance as a node to the graph.

#### add\_edge

```python
def add_edge(
        from_node: str | GraphNode,
        to_node: str | GraphNode,
        condition: Callable[[GraphState], bool] | None = None) -> GraphEdge
```

Defined in: [src/strands/multiagent/graph.py:264](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L264)

Add an edge between two nodes with optional condition function that receives full GraphState.

#### set\_entry\_point

```python
def set_entry_point(node_id: str) -> "GraphBuilder"
```

Defined in: [src/strands/multiagent/graph.py:291](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L291)

Set a node as an entry point for graph execution.

#### reset\_on\_revisit

```python
def reset_on_revisit(enabled: bool = True) -> "GraphBuilder"
```

Defined in: [src/strands/multiagent/graph.py:298](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L298)

Control whether nodes reset their state when revisited.

When enabled, nodes will reset their messages and state to initial values each time they are revisited (re-executed). This is useful for stateless behavior where nodes should start fresh on each revisit.

**Arguments**:

-   `enabled` - Whether to reset node state when revisited (default: True)

#### set\_max\_node\_executions

```python
def set_max_node_executions(max_executions: int) -> "GraphBuilder"
```

Defined in: [src/strands/multiagent/graph.py:311](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L311)

Set maximum number of node executions allowed.

**Arguments**:

-   `max_executions` - Maximum total node executions (None for no limit)

#### set\_execution\_timeout

```python
def set_execution_timeout(timeout: float) -> "GraphBuilder"
```

Defined in: [src/strands/multiagent/graph.py:320](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L320)

Set total execution timeout.

**Arguments**:

-   `timeout` - Total execution timeout in seconds (None for no limit)

#### set\_node\_timeout

```python
def set_node_timeout(timeout: float) -> "GraphBuilder"
```

Defined in: [src/strands/multiagent/graph.py:329](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L329)

Set individual node execution timeout.

**Arguments**:

-   `timeout` - Individual node timeout in seconds (None for no limit)

#### set\_graph\_id

```python
def set_graph_id(graph_id: str) -> "GraphBuilder"
```

Defined in: [src/strands/multiagent/graph.py:338](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L338)

Set graph id.

**Arguments**:

-   `graph_id` - Unique graph id

#### set\_session\_manager

```python
def set_session_manager(session_manager: SessionManager) -> "GraphBuilder"
```

Defined in: [src/strands/multiagent/graph.py:347](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L347)

Set session manager for the graph.

**Arguments**:

-   `session_manager` - SessionManager instance

#### set\_hook\_providers

```python
def set_hook_providers(hooks: list[HookProvider]) -> "GraphBuilder"
```

Defined in: [src/strands/multiagent/graph.py:356](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L356)

Set hook providers for the graph.

**Arguments**:

-   `hooks` - Customer hooks user passes in

#### build

```python
def build() -> "Graph"
```

Defined in: [src/strands/multiagent/graph.py:365](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L365)

Build and validate the graph with configured settings.

## Graph

```python
class Graph(MultiAgentBase)
```

Defined in: [src/strands/multiagent/graph.py:408](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L408)

Directed Graph multi-agent orchestration with configurable revisit behavior.

#### \_\_init\_\_

```python
def __init__(
        nodes: dict[str, GraphNode],
        edges: set[GraphEdge],
        entry_points: set[GraphNode],
        max_node_executions: int | None = None,
        execution_timeout: float | None = None,
        node_timeout: float | None = None,
        reset_on_revisit: bool = False,
        session_manager: SessionManager | None = None,
        hooks: list[HookProvider] | None = None,
        id: str = _DEFAULT_GRAPH_ID,
        trace_attributes: Mapping[str, AttributeValue] | None = None) -> None
```

Defined in: [src/strands/multiagent/graph.py:411](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L411)

Initialize Graph with execution limits and reset behavior.

**Arguments**:

-   `nodes` - Dictionary of node\_id to GraphNode
-   `edges` - Set of GraphEdge objects
-   `entry_points` - Set of GraphNode objects that are entry points
-   `max_node_executions` - Maximum total node executions (default: None - no limit)
-   `execution_timeout` - Total execution timeout in seconds (default: None - no limit)
-   `node_timeout` - Individual node timeout in seconds (default: None - no limit)
-   `reset_on_revisit` - Whether to reset node state when revisited (default: False)
-   `session_manager` - Session manager for persisting graph state and execution history (default: None)
-   `hooks` - List of hook providers for monitoring and extending graph execution behavior (default: None)
-   `id` - Unique graph id (default: None)
-   `trace_attributes` - Custom trace attributes to apply to the agent’s trace span (default: None)

#### \_\_call\_\_

```python
def __call__(task: MultiAgentInput,
             invocation_state: dict[str, Any] | None = None,
             **kwargs: Any) -> GraphResult
```

Defined in: [src/strands/multiagent/graph.py:470](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L470)

Invoke the graph synchronously.

**Arguments**:

-   `task` - The task to execute
-   `invocation_state` - Additional state/context passed to underlying agents. Defaults to None to avoid mutable default argument issues.
-   `**kwargs` - Keyword arguments allowing backward compatible future changes.

#### invoke\_async

```python
async def invoke_async(task: MultiAgentInput,
                       invocation_state: dict[str, Any] | None = None,
                       **kwargs: Any) -> GraphResult
```

Defined in: [src/strands/multiagent/graph.py:486](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L486)

Invoke the graph asynchronously.

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

Defined in: [src/strands/multiagent/graph.py:510](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L510)

Stream events during graph execution.

**Arguments**:

-   `task` - The task to execute
-   `invocation_state` - Additional state/context passed to underlying agents. Defaults to None to avoid mutable default argument issues.
-   `**kwargs` - Keyword arguments allowing backward compatible future changes.

**Yields**:

Dictionary events during graph execution, such as:

-   multi\_agent\_node\_start: When a node begins execution
-   multi\_agent\_node\_stream: Forwarded agent/multi-agent events with node context
-   multi\_agent\_node\_stop: When a node stops execution
-   result: Final graph result

#### serialize\_state

```python
def serialize_state() -> dict[str, Any]
```

Defined in: [src/strands/multiagent/graph.py:1141](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L1141)

Serialize the current graph state to a dictionary.

#### deserialize\_state

```python
def deserialize_state(payload: dict[str, Any]) -> None
```

Defined in: [src/strands/multiagent/graph.py:1161](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/graph.py#L1161)

Restore graph state from a session dict and prepare for execution.

This method handles two scenarios:

1.  If the graph execution ended (no next\_nodes\_to\_execute, eg: Completed, or Failed with dead end nodes), resets all nodes and graph state to allow re-execution from the beginning.
2.  If the graph execution was interrupted mid-execution (has next\_nodes\_to\_execute), restores the persisted state and prepares to resume execution from the next ready nodes.

**Arguments**:

-   `payload` - Dictionary containing persisted state data including status, completed nodes, results, and next nodes to execute.