# `strands.multiagent`

Multiagent capabilities for Strands Agents.

This module provides support for multiagent systems, including agent-to-agent (A2A) communication protocols and coordination mechanisms.

Submodules

a2a: Implementation of the Agent-to-Agent (A2A) protocol, which enables standardized communication between agents.

## `strands.multiagent.base`

Multi-Agent Base Class.

Provides minimal foundation for multi-agent patterns (Swarm, Graph).

### `MultiAgentBase`

Bases: `ABC`

Base class for multi-agent helpers.

This class integrates with existing Strands Agent instances and provides multi-agent orchestration capabilities.

Source code in `strands/multiagent/base.py`

```
class MultiAgentBase(ABC):
    """Base class for multi-agent helpers.

    This class integrates with existing Strands Agent instances and provides
    multi-agent orchestration capabilities.
    """

    @abstractmethod
    async def invoke_async(self, task: str | list[ContentBlock], **kwargs: Any) -> MultiAgentResult:
        """Invoke asynchronously."""
        raise NotImplementedError("invoke_async not implemented")

    @abstractmethod
    def __call__(self, task: str | list[ContentBlock], **kwargs: Any) -> MultiAgentResult:
        """Invoke synchronously."""
        raise NotImplementedError("__call__ not implemented")

```

#### `__call__(task, **kwargs)`

Invoke synchronously.

Source code in `strands/multiagent/base.py`

```
@abstractmethod
def __call__(self, task: str | list[ContentBlock], **kwargs: Any) -> MultiAgentResult:
    """Invoke synchronously."""
    raise NotImplementedError("__call__ not implemented")

```

#### `invoke_async(task, **kwargs)`

Invoke asynchronously.

Source code in `strands/multiagent/base.py`

```
@abstractmethod
async def invoke_async(self, task: str | list[ContentBlock], **kwargs: Any) -> MultiAgentResult:
    """Invoke asynchronously."""
    raise NotImplementedError("invoke_async not implemented")

```

### `MultiAgentResult`

Result from multi-agent execution with accumulated metrics.

The status field represents the outcome of the MultiAgentBase execution:

- COMPLETED: The execution was successfully accomplished
- FAILED: The execution failed or produced an error

Source code in `strands/multiagent/base.py`

```
@dataclass
class MultiAgentResult:
    """Result from multi-agent execution with accumulated metrics.

    The status field represents the outcome of the MultiAgentBase execution:
    - COMPLETED: The execution was successfully accomplished
    - FAILED: The execution failed or produced an error
    """

    status: Status = Status.PENDING
    results: dict[str, NodeResult] = field(default_factory=lambda: {})
    accumulated_usage: Usage = field(default_factory=lambda: Usage(inputTokens=0, outputTokens=0, totalTokens=0))
    accumulated_metrics: Metrics = field(default_factory=lambda: Metrics(latencyMs=0))
    execution_count: int = 0
    execution_time: int = 0

```

### `NodeResult`

Unified result from node execution - handles both Agent and nested MultiAgentBase results.

The status field represents the semantic outcome of the node's work:

- COMPLETED: The node's task was successfully accomplished
- FAILED: The node's task failed or produced an error

Source code in `strands/multiagent/base.py`

```
@dataclass
class NodeResult:
    """Unified result from node execution - handles both Agent and nested MultiAgentBase results.

    The status field represents the semantic outcome of the node's work:
    - COMPLETED: The node's task was successfully accomplished
    - FAILED: The node's task failed or produced an error
    """

    # Core result data - single AgentResult, nested MultiAgentResult, or Exception
    result: Union[AgentResult, "MultiAgentResult", Exception]

    # Execution metadata
    execution_time: int = 0
    status: Status = Status.PENDING

    # Accumulated metrics from this node and all children
    accumulated_usage: Usage = field(default_factory=lambda: Usage(inputTokens=0, outputTokens=0, totalTokens=0))
    accumulated_metrics: Metrics = field(default_factory=lambda: Metrics(latencyMs=0))
    execution_count: int = 0

    def get_agent_results(self) -> list[AgentResult]:
        """Get all AgentResult objects from this node, flattened if nested."""
        if isinstance(self.result, Exception):
            return []  # No agent results for exceptions
        elif isinstance(self.result, AgentResult):
            return [self.result]
        else:
            # Flatten nested results from MultiAgentResult
            flattened = []
            for nested_node_result in self.result.results.values():
                flattened.extend(nested_node_result.get_agent_results())
            return flattened

```

#### `get_agent_results()`

Get all AgentResult objects from this node, flattened if nested.

Source code in `strands/multiagent/base.py`

```
def get_agent_results(self) -> list[AgentResult]:
    """Get all AgentResult objects from this node, flattened if nested."""
    if isinstance(self.result, Exception):
        return []  # No agent results for exceptions
    elif isinstance(self.result, AgentResult):
        return [self.result]
    else:
        # Flatten nested results from MultiAgentResult
        flattened = []
        for nested_node_result in self.result.results.values():
            flattened.extend(nested_node_result.get_agent_results())
        return flattened

```

### `Status`

Bases: `Enum`

Execution status for both graphs and nodes.

Source code in `strands/multiagent/base.py`

```
class Status(Enum):
    """Execution status for both graphs and nodes."""

    PENDING = "pending"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"

```

## `strands.multiagent.graph`

Directed Acyclic Graph (DAG) Multi-Agent Pattern Implementation.

This module provides a deterministic DAG-based agent orchestration system where agents or MultiAgentBase instances (like Swarm or Graph) are nodes in a graph, executed according to edge dependencies, with output from one node passed as input to connected nodes.

Key Features:

- Agents and MultiAgentBase instances (Swarm, Graph, etc.) as graph nodes
- Deterministic execution order based on DAG structure
- Output propagation along edges
- Topological sort for execution ordering
- Clear dependency management
- Supports nested graphs (Graph as a node in another Graph)

### `Graph`

Bases: `MultiAgentBase`

Directed Acyclic Graph multi-agent orchestration.

Source code in `strands/multiagent/graph.py`

````
class Graph(MultiAgentBase):
    """Directed Acyclic Graph multi-agent orchestration."""

    def __init__(self, nodes: dict[str, GraphNode], edges: set[GraphEdge], entry_points: set[GraphNode]) -> None:
        """Initialize Graph."""
        super().__init__()

        # Validate nodes for duplicate instances
        self._validate_graph(nodes)

        self.nodes = nodes
        self.edges = edges
        self.entry_points = entry_points
        self.state = GraphState()
        self.tracer = get_tracer()

    def __call__(self, task: str | list[ContentBlock], **kwargs: Any) -> GraphResult:
        """Invoke the graph synchronously."""

        def execute() -> GraphResult:
            return asyncio.run(self.invoke_async(task))

        with ThreadPoolExecutor() as executor:
            future = executor.submit(execute)
            return future.result()

    async def invoke_async(self, task: str | list[ContentBlock], **kwargs: Any) -> GraphResult:
        """Invoke the graph asynchronously."""
        logger.debug("task=<%s> | starting graph execution", task)

        # Initialize state
        self.state = GraphState(
            status=Status.EXECUTING,
            task=task,
            total_nodes=len(self.nodes),
            edges=[(edge.from_node, edge.to_node) for edge in self.edges],
            entry_points=list(self.entry_points),
        )

        start_time = time.time()
        span = self.tracer.start_multiagent_span(task, "graph")
        with trace_api.use_span(span, end_on_exit=True):
            try:
                await self._execute_graph()
                self.state.status = Status.COMPLETED
                logger.debug("status=<%s> | graph execution completed", self.state.status)

            except Exception:
                logger.exception("graph execution failed")
                self.state.status = Status.FAILED
                raise
            finally:
                self.state.execution_time = round((time.time() - start_time) * 1000)
            return self._build_result()

    def _validate_graph(self, nodes: dict[str, GraphNode]) -> None:
        """Validate graph nodes for duplicate instances."""
        # Check for duplicate node instances
        seen_instances = set()
        for node in nodes.values():
            if id(node.executor) in seen_instances:
                raise ValueError("Duplicate node instance detected. Each node must have a unique object instance.")
            seen_instances.add(id(node.executor))

            # Validate Agent-specific constraints for each node
            _validate_node_executor(node.executor)

    async def _execute_graph(self) -> None:
        """Unified execution flow with conditional routing."""
        ready_nodes = list(self.entry_points)

        while ready_nodes:
            current_batch = ready_nodes.copy()
            ready_nodes.clear()

            # Execute current batch of ready nodes concurrently
            tasks = [
                asyncio.create_task(self._execute_node(node))
                for node in current_batch
                if node not in self.state.completed_nodes
            ]

            for task in tasks:
                await task

            # Find newly ready nodes after batch execution
            ready_nodes.extend(self._find_newly_ready_nodes())

    def _find_newly_ready_nodes(self) -> list["GraphNode"]:
        """Find nodes that became ready after the last execution."""
        newly_ready = []
        for _node_id, node in self.nodes.items():
            if (
                node not in self.state.completed_nodes
                and node not in self.state.failed_nodes
                and self._is_node_ready_with_conditions(node)
            ):
                newly_ready.append(node)
        return newly_ready

    def _is_node_ready_with_conditions(self, node: GraphNode) -> bool:
        """Check if a node is ready considering conditional edges."""
        # Get incoming edges to this node
        incoming_edges = [edge for edge in self.edges if edge.to_node == node]

        if not incoming_edges:
            return node in self.entry_points

        # Check if at least one incoming edge condition is satisfied
        for edge in incoming_edges:
            if edge.from_node in self.state.completed_nodes:
                if edge.should_traverse(self.state):
                    logger.debug(
                        "from=<%s>, to=<%s> | edge ready via satisfied condition", edge.from_node.node_id, node.node_id
                    )
                    return True
                else:
                    logger.debug(
                        "from=<%s>, to=<%s> | edge condition not satisfied", edge.from_node.node_id, node.node_id
                    )
        return False

    async def _execute_node(self, node: GraphNode) -> None:
        """Execute a single node with error handling."""
        node.execution_status = Status.EXECUTING
        logger.debug("node_id=<%s> | executing node", node.node_id)

        start_time = time.time()
        try:
            # Build node input from satisfied dependencies
            node_input = self._build_node_input(node)

            # Execute based on node type and create unified NodeResult
            if isinstance(node.executor, MultiAgentBase):
                multi_agent_result = await node.executor.invoke_async(node_input)

                # Create NodeResult with MultiAgentResult directly
                node_result = NodeResult(
                    result=multi_agent_result,  # type is MultiAgentResult
                    execution_time=multi_agent_result.execution_time,
                    status=Status.COMPLETED,
                    accumulated_usage=multi_agent_result.accumulated_usage,
                    accumulated_metrics=multi_agent_result.accumulated_metrics,
                    execution_count=multi_agent_result.execution_count,
                )

            elif isinstance(node.executor, Agent):
                agent_response = await node.executor.invoke_async(node_input)

                # Extract metrics from agent response
                usage = Usage(inputTokens=0, outputTokens=0, totalTokens=0)
                metrics = Metrics(latencyMs=0)
                if hasattr(agent_response, "metrics") and agent_response.metrics:
                    if hasattr(agent_response.metrics, "accumulated_usage"):
                        usage = agent_response.metrics.accumulated_usage
                    if hasattr(agent_response.metrics, "accumulated_metrics"):
                        metrics = agent_response.metrics.accumulated_metrics

                node_result = NodeResult(
                    result=agent_response,  # type is AgentResult
                    execution_time=round((time.time() - start_time) * 1000),
                    status=Status.COMPLETED,
                    accumulated_usage=usage,
                    accumulated_metrics=metrics,
                    execution_count=1,
                )
            else:
                raise ValueError(f"Node '{node.node_id}' of type '{type(node.executor)}' is not supported")

            # Mark as completed
            node.execution_status = Status.COMPLETED
            node.result = node_result
            node.execution_time = node_result.execution_time
            self.state.completed_nodes.add(node)
            self.state.results[node.node_id] = node_result
            self.state.execution_order.append(node)

            # Accumulate metrics
            self._accumulate_metrics(node_result)

            logger.debug(
                "node_id=<%s>, execution_time=<%dms> | node completed successfully", node.node_id, node.execution_time
            )

        except Exception as e:
            logger.error("node_id=<%s>, error=<%s> | node failed", node.node_id, e)
            execution_time = round((time.time() - start_time) * 1000)

            # Create a NodeResult for the failed node
            node_result = NodeResult(
                result=e,  # Store exception as result
                execution_time=execution_time,
                status=Status.FAILED,
                accumulated_usage=Usage(inputTokens=0, outputTokens=0, totalTokens=0),
                accumulated_metrics=Metrics(latencyMs=execution_time),
                execution_count=1,
            )

            node.execution_status = Status.FAILED
            node.result = node_result
            node.execution_time = execution_time
            self.state.failed_nodes.add(node)
            self.state.results[node.node_id] = node_result  # Store in results for consistency

            raise

    def _accumulate_metrics(self, node_result: NodeResult) -> None:
        """Accumulate metrics from a node result."""
        self.state.accumulated_usage["inputTokens"] += node_result.accumulated_usage.get("inputTokens", 0)
        self.state.accumulated_usage["outputTokens"] += node_result.accumulated_usage.get("outputTokens", 0)
        self.state.accumulated_usage["totalTokens"] += node_result.accumulated_usage.get("totalTokens", 0)
        self.state.accumulated_metrics["latencyMs"] += node_result.accumulated_metrics.get("latencyMs", 0)
        self.state.execution_count += node_result.execution_count

    def _build_node_input(self, node: GraphNode) -> list[ContentBlock]:
        """Build input text for a node based on dependency outputs.

        Example formatted output:
        ```
        Original Task: Analyze the quarterly sales data and create a summary report

        Inputs from previous nodes:

        From data_processor:
          - Agent: Sales data processed successfully. Found 1,247 transactions totaling $89,432.
          - Agent: Key trends: 15% increase in Q3, top product category is Electronics.

        From validator:
          - Agent: Data validation complete. All records verified, no anomalies detected.
        ```
        """
        # Get satisfied dependencies
        dependency_results = {}
        for edge in self.edges:
            if (
                edge.to_node == node
                and edge.from_node in self.state.completed_nodes
                and edge.from_node.node_id in self.state.results
            ):
                if edge.should_traverse(self.state):
                    dependency_results[edge.from_node.node_id] = self.state.results[edge.from_node.node_id]

        if not dependency_results:
            # No dependencies - return task as ContentBlocks
            if isinstance(self.state.task, str):
                return [ContentBlock(text=self.state.task)]
            else:
                return self.state.task

        # Combine task with dependency outputs
        node_input = []

        # Add original task
        if isinstance(self.state.task, str):
            node_input.append(ContentBlock(text=f"Original Task: {self.state.task}"))
        else:
            # Add task content blocks with a prefix
            node_input.append(ContentBlock(text="Original Task:"))
            node_input.extend(self.state.task)

        # Add dependency outputs
        node_input.append(ContentBlock(text="\nInputs from previous nodes:"))

        for dep_id, node_result in dependency_results.items():
            node_input.append(ContentBlock(text=f"\nFrom {dep_id}:"))
            # Get all agent results from this node (flattened if nested)
            agent_results = node_result.get_agent_results()
            for result in agent_results:
                agent_name = getattr(result, "agent_name", "Agent")
                result_text = str(result)
                node_input.append(ContentBlock(text=f"  - {agent_name}: {result_text}"))

        return node_input

    def _build_result(self) -> GraphResult:
        """Build graph result from current state."""
        return GraphResult(
            status=self.state.status,
            results=self.state.results,
            accumulated_usage=self.state.accumulated_usage,
            accumulated_metrics=self.state.accumulated_metrics,
            execution_count=self.state.execution_count,
            execution_time=self.state.execution_time,
            total_nodes=self.state.total_nodes,
            completed_nodes=len(self.state.completed_nodes),
            failed_nodes=len(self.state.failed_nodes),
            execution_order=self.state.execution_order,
            edges=self.state.edges,
            entry_points=self.state.entry_points,
        )

````

#### `__call__(task, **kwargs)`

Invoke the graph synchronously.

Source code in `strands/multiagent/graph.py`

```
def __call__(self, task: str | list[ContentBlock], **kwargs: Any) -> GraphResult:
    """Invoke the graph synchronously."""

    def execute() -> GraphResult:
        return asyncio.run(self.invoke_async(task))

    with ThreadPoolExecutor() as executor:
        future = executor.submit(execute)
        return future.result()

```

#### `__init__(nodes, edges, entry_points)`

Initialize Graph.

Source code in `strands/multiagent/graph.py`

```
def __init__(self, nodes: dict[str, GraphNode], edges: set[GraphEdge], entry_points: set[GraphNode]) -> None:
    """Initialize Graph."""
    super().__init__()

    # Validate nodes for duplicate instances
    self._validate_graph(nodes)

    self.nodes = nodes
    self.edges = edges
    self.entry_points = entry_points
    self.state = GraphState()
    self.tracer = get_tracer()

```

#### `invoke_async(task, **kwargs)`

Invoke the graph asynchronously.

Source code in `strands/multiagent/graph.py`

```
async def invoke_async(self, task: str | list[ContentBlock], **kwargs: Any) -> GraphResult:
    """Invoke the graph asynchronously."""
    logger.debug("task=<%s> | starting graph execution", task)

    # Initialize state
    self.state = GraphState(
        status=Status.EXECUTING,
        task=task,
        total_nodes=len(self.nodes),
        edges=[(edge.from_node, edge.to_node) for edge in self.edges],
        entry_points=list(self.entry_points),
    )

    start_time = time.time()
    span = self.tracer.start_multiagent_span(task, "graph")
    with trace_api.use_span(span, end_on_exit=True):
        try:
            await self._execute_graph()
            self.state.status = Status.COMPLETED
            logger.debug("status=<%s> | graph execution completed", self.state.status)

        except Exception:
            logger.exception("graph execution failed")
            self.state.status = Status.FAILED
            raise
        finally:
            self.state.execution_time = round((time.time() - start_time) * 1000)
        return self._build_result()

```

### `GraphBuilder`

Builder pattern for constructing graphs.

Source code in `strands/multiagent/graph.py`

```
class GraphBuilder:
    """Builder pattern for constructing graphs."""

    def __init__(self) -> None:
        """Initialize GraphBuilder with empty collections."""
        self.nodes: dict[str, GraphNode] = {}
        self.edges: set[GraphEdge] = set()
        self.entry_points: set[GraphNode] = set()

    def add_node(self, executor: Agent | MultiAgentBase, node_id: str | None = None) -> GraphNode:
        """Add an Agent or MultiAgentBase instance as a node to the graph."""
        _validate_node_executor(executor, self.nodes)

        # Auto-generate node_id if not provided
        if node_id is None:
            node_id = getattr(executor, "id", None) or getattr(executor, "name", None) or f"node_{len(self.nodes)}"

        if node_id in self.nodes:
            raise ValueError(f"Node '{node_id}' already exists")

        node = GraphNode(node_id=node_id, executor=executor)
        self.nodes[node_id] = node
        return node

    def add_edge(
        self,
        from_node: str | GraphNode,
        to_node: str | GraphNode,
        condition: Callable[[GraphState], bool] | None = None,
    ) -> GraphEdge:
        """Add an edge between two nodes with optional condition function that receives full GraphState."""

        def resolve_node(node: str | GraphNode, node_type: str) -> GraphNode:
            if isinstance(node, str):
                if node not in self.nodes:
                    raise ValueError(f"{node_type} node '{node}' not found")
                return self.nodes[node]
            else:
                if node not in self.nodes.values():
                    raise ValueError(f"{node_type} node object has not been added to the graph, use graph.add_node")
                return node

        from_node_obj = resolve_node(from_node, "Source")
        to_node_obj = resolve_node(to_node, "Target")

        # Add edge and update dependencies
        edge = GraphEdge(from_node=from_node_obj, to_node=to_node_obj, condition=condition)
        self.edges.add(edge)
        to_node_obj.dependencies.add(from_node_obj)
        return edge

    def set_entry_point(self, node_id: str) -> "GraphBuilder":
        """Set a node as an entry point for graph execution."""
        if node_id not in self.nodes:
            raise ValueError(f"Node '{node_id}' not found")
        self.entry_points.add(self.nodes[node_id])
        return self

    def build(self) -> "Graph":
        """Build and validate the graph."""
        if not self.nodes:
            raise ValueError("Graph must contain at least one node")

        # Auto-detect entry points if none specified
        if not self.entry_points:
            self.entry_points = {node for node_id, node in self.nodes.items() if not node.dependencies}
            logger.debug(
                "entry_points=<%s> | auto-detected entrypoints", ", ".join(node.node_id for node in self.entry_points)
            )
            if not self.entry_points:
                raise ValueError("No entry points found - all nodes have dependencies")

        # Validate entry points and check for cycles
        self._validate_graph()

        return Graph(nodes=self.nodes.copy(), edges=self.edges.copy(), entry_points=self.entry_points.copy())

    def _validate_graph(self) -> None:
        """Validate graph structure and detect cycles."""
        # Validate entry points exist
        entry_point_ids = {node.node_id for node in self.entry_points}
        invalid_entries = entry_point_ids - set(self.nodes.keys())
        if invalid_entries:
            raise ValueError(f"Entry points not found in nodes: {invalid_entries}")

        # Check for cycles using DFS with color coding
        WHITE, GRAY, BLACK = 0, 1, 2
        colors = {node_id: WHITE for node_id in self.nodes}

        def has_cycle_from(node_id: str) -> bool:
            if colors[node_id] == GRAY:
                return True  # Back edge found - cycle detected
            if colors[node_id] == BLACK:
                return False

            colors[node_id] = GRAY
            # Check all outgoing edges for cycles
            for edge in self.edges:
                if edge.from_node.node_id == node_id and has_cycle_from(edge.to_node.node_id):
                    return True
            colors[node_id] = BLACK
            return False

        # Check for cycles from each unvisited node
        if any(colors[node_id] == WHITE and has_cycle_from(node_id) for node_id in self.nodes):
            raise ValueError("Graph contains cycles - must be a directed acyclic graph")

```

#### `__init__()`

Initialize GraphBuilder with empty collections.

Source code in `strands/multiagent/graph.py`

```
def __init__(self) -> None:
    """Initialize GraphBuilder with empty collections."""
    self.nodes: dict[str, GraphNode] = {}
    self.edges: set[GraphEdge] = set()
    self.entry_points: set[GraphNode] = set()

```

#### `add_edge(from_node, to_node, condition=None)`

Add an edge between two nodes with optional condition function that receives full GraphState.

Source code in `strands/multiagent/graph.py`

```
def add_edge(
    self,
    from_node: str | GraphNode,
    to_node: str | GraphNode,
    condition: Callable[[GraphState], bool] | None = None,
) -> GraphEdge:
    """Add an edge between two nodes with optional condition function that receives full GraphState."""

    def resolve_node(node: str | GraphNode, node_type: str) -> GraphNode:
        if isinstance(node, str):
            if node not in self.nodes:
                raise ValueError(f"{node_type} node '{node}' not found")
            return self.nodes[node]
        else:
            if node not in self.nodes.values():
                raise ValueError(f"{node_type} node object has not been added to the graph, use graph.add_node")
            return node

    from_node_obj = resolve_node(from_node, "Source")
    to_node_obj = resolve_node(to_node, "Target")

    # Add edge and update dependencies
    edge = GraphEdge(from_node=from_node_obj, to_node=to_node_obj, condition=condition)
    self.edges.add(edge)
    to_node_obj.dependencies.add(from_node_obj)
    return edge

```

#### `add_node(executor, node_id=None)`

Add an Agent or MultiAgentBase instance as a node to the graph.

Source code in `strands/multiagent/graph.py`

```
def add_node(self, executor: Agent | MultiAgentBase, node_id: str | None = None) -> GraphNode:
    """Add an Agent or MultiAgentBase instance as a node to the graph."""
    _validate_node_executor(executor, self.nodes)

    # Auto-generate node_id if not provided
    if node_id is None:
        node_id = getattr(executor, "id", None) or getattr(executor, "name", None) or f"node_{len(self.nodes)}"

    if node_id in self.nodes:
        raise ValueError(f"Node '{node_id}' already exists")

    node = GraphNode(node_id=node_id, executor=executor)
    self.nodes[node_id] = node
    return node

```

#### `build()`

Build and validate the graph.

Source code in `strands/multiagent/graph.py`

```
def build(self) -> "Graph":
    """Build and validate the graph."""
    if not self.nodes:
        raise ValueError("Graph must contain at least one node")

    # Auto-detect entry points if none specified
    if not self.entry_points:
        self.entry_points = {node for node_id, node in self.nodes.items() if not node.dependencies}
        logger.debug(
            "entry_points=<%s> | auto-detected entrypoints", ", ".join(node.node_id for node in self.entry_points)
        )
        if not self.entry_points:
            raise ValueError("No entry points found - all nodes have dependencies")

    # Validate entry points and check for cycles
    self._validate_graph()

    return Graph(nodes=self.nodes.copy(), edges=self.edges.copy(), entry_points=self.entry_points.copy())

```

#### `set_entry_point(node_id)`

Set a node as an entry point for graph execution.

Source code in `strands/multiagent/graph.py`

```
def set_entry_point(self, node_id: str) -> "GraphBuilder":
    """Set a node as an entry point for graph execution."""
    if node_id not in self.nodes:
        raise ValueError(f"Node '{node_id}' not found")
    self.entry_points.add(self.nodes[node_id])
    return self

```

### `GraphEdge`

Represents an edge in the graph with an optional condition.

Source code in `strands/multiagent/graph.py`

```
@dataclass
class GraphEdge:
    """Represents an edge in the graph with an optional condition."""

    from_node: "GraphNode"
    to_node: "GraphNode"
    condition: Callable[[GraphState], bool] | None = None

    def __hash__(self) -> int:
        """Return hash for GraphEdge based on from_node and to_node."""
        return hash((self.from_node.node_id, self.to_node.node_id))

    def should_traverse(self, state: GraphState) -> bool:
        """Check if this edge should be traversed based on condition."""
        if self.condition is None:
            return True
        return self.condition(state)

```

#### `__hash__()`

Return hash for GraphEdge based on from_node and to_node.

Source code in `strands/multiagent/graph.py`

```
def __hash__(self) -> int:
    """Return hash for GraphEdge based on from_node and to_node."""
    return hash((self.from_node.node_id, self.to_node.node_id))

```

#### `should_traverse(state)`

Check if this edge should be traversed based on condition.

Source code in `strands/multiagent/graph.py`

```
def should_traverse(self, state: GraphState) -> bool:
    """Check if this edge should be traversed based on condition."""
    if self.condition is None:
        return True
    return self.condition(state)

```

### `GraphNode`

Represents a node in the graph.

The execution_status tracks the node's lifecycle within graph orchestration:

- PENDING: Node hasn't started executing yet
- EXECUTING: Node is currently running
- COMPLETED/FAILED: Node finished executing (regardless of result quality)

Source code in `strands/multiagent/graph.py`

```
@dataclass
class GraphNode:
    """Represents a node in the graph.

    The execution_status tracks the node's lifecycle within graph orchestration:
    - PENDING: Node hasn't started executing yet
    - EXECUTING: Node is currently running
    - COMPLETED/FAILED: Node finished executing (regardless of result quality)
    """

    node_id: str
    executor: Agent | MultiAgentBase
    dependencies: set["GraphNode"] = field(default_factory=set)
    execution_status: Status = Status.PENDING
    result: NodeResult | None = None
    execution_time: int = 0

    def __hash__(self) -> int:
        """Return hash for GraphNode based on node_id."""
        return hash(self.node_id)

    def __eq__(self, other: Any) -> bool:
        """Return equality for GraphNode based on node_id."""
        if not isinstance(other, GraphNode):
            return False
        return self.node_id == other.node_id

```

#### `__eq__(other)`

Return equality for GraphNode based on node_id.

Source code in `strands/multiagent/graph.py`

```
def __eq__(self, other: Any) -> bool:
    """Return equality for GraphNode based on node_id."""
    if not isinstance(other, GraphNode):
        return False
    return self.node_id == other.node_id

```

#### `__hash__()`

Return hash for GraphNode based on node_id.

Source code in `strands/multiagent/graph.py`

```
def __hash__(self) -> int:
    """Return hash for GraphNode based on node_id."""
    return hash(self.node_id)

```

### `GraphResult`

Bases: `MultiAgentResult`

Result from graph execution - extends MultiAgentResult with graph-specific details.

Source code in `strands/multiagent/graph.py`

```
@dataclass
class GraphResult(MultiAgentResult):
    """Result from graph execution - extends MultiAgentResult with graph-specific details."""

    total_nodes: int = 0
    completed_nodes: int = 0
    failed_nodes: int = 0
    execution_order: list["GraphNode"] = field(default_factory=list)
    edges: list[Tuple["GraphNode", "GraphNode"]] = field(default_factory=list)
    entry_points: list["GraphNode"] = field(default_factory=list)

```

### `GraphState`

Graph execution state.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `status` | `Status` | Current execution status of the graph. | | `completed_nodes` | `set[GraphNode]` | Set of nodes that have completed execution. | | `failed_nodes` | `set[GraphNode]` | Set of nodes that failed during execution. | | `execution_order` | `list[GraphNode]` | List of nodes in the order they were executed. | | `task` | `str | list[ContentBlock]` | The original input prompt/query provided to the graph execution. This represents the actual work to be performed by the graph as a whole. Entry point nodes receive this task as their input if they have no dependencies. |

Source code in `strands/multiagent/graph.py`

```
@dataclass
class GraphState:
    """Graph execution state.

    Attributes:
        status: Current execution status of the graph.
        completed_nodes: Set of nodes that have completed execution.
        failed_nodes: Set of nodes that failed during execution.
        execution_order: List of nodes in the order they were executed.
        task: The original input prompt/query provided to the graph execution.
              This represents the actual work to be performed by the graph as a whole.
              Entry point nodes receive this task as their input if they have no dependencies.
    """

    # Task (with default empty string)
    task: str | list[ContentBlock] = ""

    # Execution state
    status: Status = Status.PENDING
    completed_nodes: set["GraphNode"] = field(default_factory=set)
    failed_nodes: set["GraphNode"] = field(default_factory=set)
    execution_order: list["GraphNode"] = field(default_factory=list)

    # Results
    results: dict[str, NodeResult] = field(default_factory=dict)

    # Accumulated metrics
    accumulated_usage: Usage = field(default_factory=lambda: Usage(inputTokens=0, outputTokens=0, totalTokens=0))
    accumulated_metrics: Metrics = field(default_factory=lambda: Metrics(latencyMs=0))
    execution_count: int = 0
    execution_time: int = 0

    # Graph structure info
    total_nodes: int = 0
    edges: list[Tuple["GraphNode", "GraphNode"]] = field(default_factory=list)
    entry_points: list["GraphNode"] = field(default_factory=list)

```

## `strands.multiagent.swarm`

Swarm Multi-Agent Pattern Implementation.

This module provides a collaborative agent orchestration system where agents work together as a team to solve complex tasks, with shared context and autonomous coordination.

Key Features:

- Self-organizing agent teams with shared working memory
- Tool-based coordination
- Autonomous agent collaboration without central control
- Dynamic task distribution based on agent capabilities
- Collective intelligence through shared context

### `SharedContext`

Shared context between swarm nodes.

Source code in `strands/multiagent/swarm.py`

```
@dataclass
class SharedContext:
    """Shared context between swarm nodes."""

    context: dict[str, dict[str, Any]] = field(default_factory=dict)

    def add_context(self, node: SwarmNode, key: str, value: Any) -> None:
        """Add context."""
        self._validate_key(key)
        self._validate_json_serializable(value)

        if node.node_id not in self.context:
            self.context[node.node_id] = {}
        self.context[node.node_id][key] = value

    def _validate_key(self, key: str) -> None:
        """Validate that a key is valid.

        Args:
            key: The key to validate

        Raises:
            ValueError: If key is invalid
        """
        if key is None:
            raise ValueError("Key cannot be None")
        if not isinstance(key, str):
            raise ValueError("Key must be a string")
        if not key.strip():
            raise ValueError("Key cannot be empty")

    def _validate_json_serializable(self, value: Any) -> None:
        """Validate that a value is JSON serializable.

        Args:
            value: The value to validate

        Raises:
            ValueError: If value is not JSON serializable
        """
        try:
            json.dumps(value)
        except (TypeError, ValueError) as e:
            raise ValueError(
                f"Value is not JSON serializable: {type(value).__name__}. "
                f"Only JSON-compatible types (str, int, float, bool, list, dict, None) are allowed."
            ) from e

```

#### `add_context(node, key, value)`

Add context.

Source code in `strands/multiagent/swarm.py`

```
def add_context(self, node: SwarmNode, key: str, value: Any) -> None:
    """Add context."""
    self._validate_key(key)
    self._validate_json_serializable(value)

    if node.node_id not in self.context:
        self.context[node.node_id] = {}
    self.context[node.node_id][key] = value

```

### `Swarm`

Bases: `MultiAgentBase`

Self-organizing collaborative agent teams with shared working memory.

Source code in `strands/multiagent/swarm.py`

````
class Swarm(MultiAgentBase):
    """Self-organizing collaborative agent teams with shared working memory."""

    def __init__(
        self,
        nodes: list[Agent],
        *,
        max_handoffs: int = 20,
        max_iterations: int = 20,
        execution_timeout: float = 900.0,
        node_timeout: float = 300.0,
        repetitive_handoff_detection_window: int = 0,
        repetitive_handoff_min_unique_agents: int = 0,
    ) -> None:
        """Initialize Swarm with agents and configuration.

        Args:
            nodes: List of nodes (e.g. Agent) to include in the swarm
            max_handoffs: Maximum handoffs to agents and users (default: 20)
            max_iterations: Maximum node executions within the swarm (default: 20)
            execution_timeout: Total execution timeout in seconds (default: 900.0)
            node_timeout: Individual node timeout in seconds (default: 300.0)
            repetitive_handoff_detection_window: Number of recent nodes to check for repetitive handoffs
                Disabled by default (default: 0)
            repetitive_handoff_min_unique_agents: Minimum unique agents required in recent sequence
                Disabled by default (default: 0)
        """
        super().__init__()

        self.max_handoffs = max_handoffs
        self.max_iterations = max_iterations
        self.execution_timeout = execution_timeout
        self.node_timeout = node_timeout
        self.repetitive_handoff_detection_window = repetitive_handoff_detection_window
        self.repetitive_handoff_min_unique_agents = repetitive_handoff_min_unique_agents

        self.shared_context = SharedContext()
        self.nodes: dict[str, SwarmNode] = {}
        self.state = SwarmState(
            current_node=SwarmNode("", Agent()),  # Placeholder, will be set properly
            task="",
            completion_status=Status.PENDING,
        )
        self.tracer = get_tracer()

        self._setup_swarm(nodes)
        self._inject_swarm_tools()

    def __call__(self, task: str | list[ContentBlock], **kwargs: Any) -> SwarmResult:
        """Invoke the swarm synchronously."""

        def execute() -> SwarmResult:
            return asyncio.run(self.invoke_async(task))

        with ThreadPoolExecutor() as executor:
            future = executor.submit(execute)
            return future.result()

    async def invoke_async(self, task: str | list[ContentBlock], **kwargs: Any) -> SwarmResult:
        """Invoke the swarm asynchronously."""
        logger.debug("starting swarm execution")

        # Initialize swarm state with configuration
        initial_node = next(iter(self.nodes.values()))  # First SwarmNode
        self.state = SwarmState(
            current_node=initial_node,
            task=task,
            completion_status=Status.EXECUTING,
            shared_context=self.shared_context,
        )

        start_time = time.time()
        span = self.tracer.start_multiagent_span(task, "swarm")
        with trace_api.use_span(span, end_on_exit=True):
            try:
                logger.debug("current_node=<%s> | starting swarm execution with node", self.state.current_node.node_id)
                logger.debug(
                    "max_handoffs=<%d>, max_iterations=<%d>, timeout=<%s>s | swarm execution config",
                    self.max_handoffs,
                    self.max_iterations,
                    self.execution_timeout,
                )

                await self._execute_swarm()
            except Exception:
                logger.exception("swarm execution failed")
                self.state.completion_status = Status.FAILED
                raise
            finally:
                self.state.execution_time = round((time.time() - start_time) * 1000)

            return self._build_result()

    def _setup_swarm(self, nodes: list[Agent]) -> None:
        """Initialize swarm configuration."""
        # Validate nodes before setup
        self._validate_swarm(nodes)

        # Validate agents have names and create SwarmNode objects
        for i, node in enumerate(nodes):
            if not node.name:
                node_id = f"node_{i}"
                node.name = node_id
                logger.debug("node_id=<%s> | agent has no name, dynamically generating one", node_id)

            node_id = str(node.name)

            # Ensure node IDs are unique
            if node_id in self.nodes:
                raise ValueError(f"Node ID '{node_id}' is not unique. Each agent must have a unique name.")

            self.nodes[node_id] = SwarmNode(node_id=node_id, executor=node)

        swarm_nodes = list(self.nodes.values())
        logger.debug("nodes=<%s> | initialized swarm with nodes", [node.node_id for node in swarm_nodes])

    def _validate_swarm(self, nodes: list[Agent]) -> None:
        """Validate swarm structure and nodes."""
        # Check for duplicate object instances
        seen_instances = set()
        for node in nodes:
            if id(node) in seen_instances:
                raise ValueError("Duplicate node instance detected. Each node must have a unique object instance.")
            seen_instances.add(id(node))

            # Check for session persistence
            if node._session_manager is not None:
                raise ValueError("Session persistence is not supported for Swarm agents yet.")

            # Check for callbacks
            if node.hooks.has_callbacks():
                raise ValueError("Agent callbacks are not supported for Swarm agents yet.")

    def _inject_swarm_tools(self) -> None:
        """Add swarm coordination tools to each agent."""
        # Create tool functions with proper closures
        swarm_tools = [
            self._create_handoff_tool(),
        ]

        for node in self.nodes.values():
            # Check for existing tools with conflicting names
            existing_tools = node.executor.tool_registry.registry
            conflicting_tools = []

            if "handoff_to_agent" in existing_tools:
                conflicting_tools.append("handoff_to_agent")

            if conflicting_tools:
                raise ValueError(
                    f"Agent '{node.node_id}' already has tools with names that conflict with swarm coordination tools: "
                    f"{', '.join(conflicting_tools)}. Please rename these tools to avoid conflicts."
                )

            # Use the agent's tool registry to process and register the tools
            node.executor.tool_registry.process_tools(swarm_tools)

        logger.debug(
            "tool_count=<%d>, node_count=<%d> | injected coordination tools into agents",
            len(swarm_tools),
            len(self.nodes),
        )

    def _create_handoff_tool(self) -> Callable[..., Any]:
        """Create handoff tool for agent coordination."""
        swarm_ref = self  # Capture swarm reference

        @tool
        def handoff_to_agent(agent_name: str, message: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
            """Transfer control to another agent in the swarm for specialized help.

            Args:
                agent_name: Name of the agent to hand off to
                message: Message explaining what needs to be done and why you're handing off
                context: Additional context to share with the next agent

            Returns:
                Confirmation of handoff initiation
            """
            try:
                context = context or {}

                # Validate target agent exists
                target_node = swarm_ref.nodes.get(agent_name)
                if not target_node:
                    return {"status": "error", "content": [{"text": f"Error: Agent '{agent_name}' not found in swarm"}]}

                # Execute handoff
                swarm_ref._handle_handoff(target_node, message, context)

                return {"status": "success", "content": [{"text": f"Handed off to {agent_name}: {message}"}]}
            except Exception as e:
                return {"status": "error", "content": [{"text": f"Error in handoff: {str(e)}"}]}

        return handoff_to_agent

    def _handle_handoff(self, target_node: SwarmNode, message: str, context: dict[str, Any]) -> None:
        """Handle handoff to another agent."""
        # If task is already completed, don't allow further handoffs
        if self.state.completion_status != Status.EXECUTING:
            logger.debug(
                "task_status=<%s> | ignoring handoff request - task already completed",
                self.state.completion_status,
            )
            return

        # Update swarm state
        previous_agent = self.state.current_node
        self.state.current_node = target_node

        # Store handoff message for the target agent
        self.state.handoff_message = message

        # Store handoff context as shared context
        if context:
            for key, value in context.items():
                self.shared_context.add_context(previous_agent, key, value)

        logger.debug(
            "from_node=<%s>, to_node=<%s> | handed off from agent to agent",
            previous_agent.node_id,
            target_node.node_id,
        )

    def _build_node_input(self, target_node: SwarmNode) -> str:
        """Build input text for a node based on shared context and handoffs.

        Example formatted output:
        ```
        Handoff Message: The user needs help with Python debugging - I've identified the issue but need someone with more expertise to fix it.

        User Request: My Python script is throwing a KeyError when processing JSON data from an API

        Previous agents who worked on this: data_analyst → code_reviewer

        Shared knowledge from previous agents:
        • data_analyst: {"issue_location": "line 42", "error_type": "missing key validation", "suggested_fix": "add key existence check"}
        • code_reviewer: {"code_quality": "good overall structure", "security_notes": "API key should be in environment variable"}

        Other agents available for collaboration:
        Agent name: data_analyst. Agent description: Analyzes data and provides deeper insights
        Agent name: code_reviewer.
        Agent name: security_specialist. Agent description: Focuses on secure coding practices and vulnerability assessment

        You have access to swarm coordination tools if you need help from other agents. If you don't hand off to another agent, the swarm will consider the task complete.
        ```
        """  # noqa: E501
        context_info: dict[str, Any] = {
            "task": self.state.task,
            "node_history": [node.node_id for node in self.state.node_history],
            "shared_context": {k: v for k, v in self.shared_context.context.items()},
        }
        context_text = ""

        # Include handoff message prominently at the top if present
        if self.state.handoff_message:
            context_text += f"Handoff Message: {self.state.handoff_message}\n\n"

        # Include task information if available
        if "task" in context_info:
            task = context_info.get("task")
            if isinstance(task, str):
                context_text += f"User Request: {task}\n\n"
            elif isinstance(task, list):
                context_text += "User Request: Multi-modal task\n\n"

        # Include detailed node history
        if context_info.get("node_history"):
            context_text += f"Previous agents who worked on this: {' → '.join(context_info['node_history'])}\n\n"

        # Include actual shared context, not just a mention
        shared_context = context_info.get("shared_context", {})
        if shared_context:
            context_text += "Shared knowledge from previous agents:\n"
            for node_name, context in shared_context.items():
                if context:  # Only include if node has contributed context
                    context_text += f"• {node_name}: {context}\n"
            context_text += "\n"

        # Include available nodes with descriptions if available
        other_nodes = [node_id for node_id in self.nodes.keys() if node_id != target_node.node_id]
        if other_nodes:
            context_text += "Other agents available for collaboration:\n"
            for node_id in other_nodes:
                node = self.nodes.get(node_id)
                context_text += f"Agent name: {node_id}."
                if node and hasattr(node.executor, "description") and node.executor.description:
                    context_text += f" Agent description: {node.executor.description}"
                context_text += "\n"
            context_text += "\n"

        context_text += (
            "You have access to swarm coordination tools if you need help from other agents. "
            "If you don't hand off to another agent, the swarm will consider the task complete."
        )

        return context_text

    async def _execute_swarm(self) -> None:
        """Shared execution logic used by execute_async."""
        try:
            # Main execution loop
            while True:
                if self.state.completion_status != Status.EXECUTING:
                    reason = f"Completion status is: {self.state.completion_status}"
                    logger.debug("reason=<%s> | stopping execution", reason)
                    break

                should_continue, reason = self.state.should_continue(
                    max_handoffs=self.max_handoffs,
                    max_iterations=self.max_iterations,
                    execution_timeout=self.execution_timeout,
                    repetitive_handoff_detection_window=self.repetitive_handoff_detection_window,
                    repetitive_handoff_min_unique_agents=self.repetitive_handoff_min_unique_agents,
                )
                if not should_continue:
                    self.state.completion_status = Status.FAILED
                    logger.debug("reason=<%s> | stopping execution", reason)
                    break

                # Get current node
                current_node = self.state.current_node
                if not current_node or current_node.node_id not in self.nodes:
                    logger.error("node=<%s> | node not found", current_node.node_id if current_node else "None")
                    self.state.completion_status = Status.FAILED
                    break

                logger.debug(
                    "current_node=<%s>, iteration=<%d> | executing node",
                    current_node.node_id,
                    len(self.state.node_history) + 1,
                )

                # Execute node with timeout protection
                # TODO: Implement cancellation token to stop _execute_node from continuing
                try:
                    await asyncio.wait_for(
                        self._execute_node(current_node, self.state.task),
                        timeout=self.node_timeout,
                    )

                    self.state.node_history.append(current_node)

                    logger.debug("node=<%s> | node execution completed", current_node.node_id)

                    # Check if the current node is still the same after execution
                    # If it is, then no handoff occurred and we consider the swarm complete
                    if self.state.current_node == current_node:
                        logger.debug("node=<%s> | no handoff occurred, marking swarm as complete", current_node.node_id)
                        self.state.completion_status = Status.COMPLETED
                        break

                except asyncio.TimeoutError:
                    logger.exception(
                        "node=<%s>, timeout=<%s>s | node execution timed out after timeout",
                        current_node.node_id,
                        self.node_timeout,
                    )
                    self.state.completion_status = Status.FAILED
                    break

                except Exception:
                    logger.exception("node=<%s> | node execution failed", current_node.node_id)
                    self.state.completion_status = Status.FAILED
                    break

        except Exception:
            logger.exception("swarm execution failed")
            self.state.completion_status = Status.FAILED

        elapsed_time = time.time() - self.state.start_time
        logger.debug("status=<%s> | swarm execution completed", self.state.completion_status)
        logger.debug(
            "node_history_length=<%d>, time=<%s>s | metrics",
            len(self.state.node_history),
            f"{elapsed_time:.2f}",
        )

    async def _execute_node(self, node: SwarmNode, task: str | list[ContentBlock]) -> AgentResult:
        """Execute swarm node."""
        start_time = time.time()
        node_name = node.node_id

        try:
            # Prepare context for node
            context_text = self._build_node_input(node)
            node_input = [ContentBlock(text=f"Context:\n{context_text}\n\n")]

            # Clear handoff message after it's been included in context
            self.state.handoff_message = None

            if not isinstance(task, str):
                # Include additional ContentBlocks in node input
                node_input = node_input + task

            # Execute node
            result = None
            node.reset_executor_state()
            result = await node.executor.invoke_async(node_input)

            execution_time = round((time.time() - start_time) * 1000)

            # Create NodeResult
            usage = Usage(inputTokens=0, outputTokens=0, totalTokens=0)
            metrics = Metrics(latencyMs=execution_time)
            if hasattr(result, "metrics") and result.metrics:
                if hasattr(result.metrics, "accumulated_usage"):
                    usage = result.metrics.accumulated_usage
                if hasattr(result.metrics, "accumulated_metrics"):
                    metrics = result.metrics.accumulated_metrics

            node_result = NodeResult(
                result=result,
                execution_time=execution_time,
                status=Status.COMPLETED,
                accumulated_usage=usage,
                accumulated_metrics=metrics,
                execution_count=1,
            )

            # Store result in state
            self.state.results[node_name] = node_result

            # Accumulate metrics
            self._accumulate_metrics(node_result)

            return result

        except Exception as e:
            execution_time = round((time.time() - start_time) * 1000)
            logger.exception("node=<%s> | node execution failed", node_name)

            # Create a NodeResult for the failed node
            node_result = NodeResult(
                result=e,  # Store exception as result
                execution_time=execution_time,
                status=Status.FAILED,
                accumulated_usage=Usage(inputTokens=0, outputTokens=0, totalTokens=0),
                accumulated_metrics=Metrics(latencyMs=execution_time),
                execution_count=1,
            )

            # Store result in state
            self.state.results[node_name] = node_result

            raise

    def _accumulate_metrics(self, node_result: NodeResult) -> None:
        """Accumulate metrics from a node result."""
        self.state.accumulated_usage["inputTokens"] += node_result.accumulated_usage.get("inputTokens", 0)
        self.state.accumulated_usage["outputTokens"] += node_result.accumulated_usage.get("outputTokens", 0)
        self.state.accumulated_usage["totalTokens"] += node_result.accumulated_usage.get("totalTokens", 0)
        self.state.accumulated_metrics["latencyMs"] += node_result.accumulated_metrics.get("latencyMs", 0)

    def _build_result(self) -> SwarmResult:
        """Build swarm result from current state."""
        return SwarmResult(
            status=self.state.completion_status,
            results=self.state.results,
            accumulated_usage=self.state.accumulated_usage,
            accumulated_metrics=self.state.accumulated_metrics,
            execution_count=len(self.state.node_history),
            execution_time=self.state.execution_time,
            node_history=self.state.node_history,
        )

````

#### `__call__(task, **kwargs)`

Invoke the swarm synchronously.

Source code in `strands/multiagent/swarm.py`

```
def __call__(self, task: str | list[ContentBlock], **kwargs: Any) -> SwarmResult:
    """Invoke the swarm synchronously."""

    def execute() -> SwarmResult:
        return asyncio.run(self.invoke_async(task))

    with ThreadPoolExecutor() as executor:
        future = executor.submit(execute)
        return future.result()

```

#### `__init__(nodes, *, max_handoffs=20, max_iterations=20, execution_timeout=900.0, node_timeout=300.0, repetitive_handoff_detection_window=0, repetitive_handoff_min_unique_agents=0)`

Initialize Swarm with agents and configuration.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `nodes` | `list[Agent]` | List of nodes (e.g. Agent) to include in the swarm | *required* | | `max_handoffs` | `int` | Maximum handoffs to agents and users (default: 20) | `20` | | `max_iterations` | `int` | Maximum node executions within the swarm (default: 20) | `20` | | `execution_timeout` | `float` | Total execution timeout in seconds (default: 900.0) | `900.0` | | `node_timeout` | `float` | Individual node timeout in seconds (default: 300.0) | `300.0` | | `repetitive_handoff_detection_window` | `int` | Number of recent nodes to check for repetitive handoffs Disabled by default (default: 0) | `0` | | `repetitive_handoff_min_unique_agents` | `int` | Minimum unique agents required in recent sequence Disabled by default (default: 0) | `0` |

Source code in `strands/multiagent/swarm.py`

```
def __init__(
    self,
    nodes: list[Agent],
    *,
    max_handoffs: int = 20,
    max_iterations: int = 20,
    execution_timeout: float = 900.0,
    node_timeout: float = 300.0,
    repetitive_handoff_detection_window: int = 0,
    repetitive_handoff_min_unique_agents: int = 0,
) -> None:
    """Initialize Swarm with agents and configuration.

    Args:
        nodes: List of nodes (e.g. Agent) to include in the swarm
        max_handoffs: Maximum handoffs to agents and users (default: 20)
        max_iterations: Maximum node executions within the swarm (default: 20)
        execution_timeout: Total execution timeout in seconds (default: 900.0)
        node_timeout: Individual node timeout in seconds (default: 300.0)
        repetitive_handoff_detection_window: Number of recent nodes to check for repetitive handoffs
            Disabled by default (default: 0)
        repetitive_handoff_min_unique_agents: Minimum unique agents required in recent sequence
            Disabled by default (default: 0)
    """
    super().__init__()

    self.max_handoffs = max_handoffs
    self.max_iterations = max_iterations
    self.execution_timeout = execution_timeout
    self.node_timeout = node_timeout
    self.repetitive_handoff_detection_window = repetitive_handoff_detection_window
    self.repetitive_handoff_min_unique_agents = repetitive_handoff_min_unique_agents

    self.shared_context = SharedContext()
    self.nodes: dict[str, SwarmNode] = {}
    self.state = SwarmState(
        current_node=SwarmNode("", Agent()),  # Placeholder, will be set properly
        task="",
        completion_status=Status.PENDING,
    )
    self.tracer = get_tracer()

    self._setup_swarm(nodes)
    self._inject_swarm_tools()

```

#### `invoke_async(task, **kwargs)`

Invoke the swarm asynchronously.

Source code in `strands/multiagent/swarm.py`

```
async def invoke_async(self, task: str | list[ContentBlock], **kwargs: Any) -> SwarmResult:
    """Invoke the swarm asynchronously."""
    logger.debug("starting swarm execution")

    # Initialize swarm state with configuration
    initial_node = next(iter(self.nodes.values()))  # First SwarmNode
    self.state = SwarmState(
        current_node=initial_node,
        task=task,
        completion_status=Status.EXECUTING,
        shared_context=self.shared_context,
    )

    start_time = time.time()
    span = self.tracer.start_multiagent_span(task, "swarm")
    with trace_api.use_span(span, end_on_exit=True):
        try:
            logger.debug("current_node=<%s> | starting swarm execution with node", self.state.current_node.node_id)
            logger.debug(
                "max_handoffs=<%d>, max_iterations=<%d>, timeout=<%s>s | swarm execution config",
                self.max_handoffs,
                self.max_iterations,
                self.execution_timeout,
            )

            await self._execute_swarm()
        except Exception:
            logger.exception("swarm execution failed")
            self.state.completion_status = Status.FAILED
            raise
        finally:
            self.state.execution_time = round((time.time() - start_time) * 1000)

        return self._build_result()

```

### `SwarmNode`

Represents a node (e.g. Agent) in the swarm.

Source code in `strands/multiagent/swarm.py`

```
@dataclass
class SwarmNode:
    """Represents a node (e.g. Agent) in the swarm."""

    node_id: str
    executor: Agent
    _initial_messages: Messages = field(default_factory=list, init=False)
    _initial_state: AgentState = field(default_factory=AgentState, init=False)

    def __post_init__(self) -> None:
        """Capture initial executor state after initialization."""
        # Deep copy the initial messages and state to preserve them
        self._initial_messages = copy.deepcopy(self.executor.messages)
        self._initial_state = AgentState(self.executor.state.get())

    def __hash__(self) -> int:
        """Return hash for SwarmNode based on node_id."""
        return hash(self.node_id)

    def __eq__(self, other: Any) -> bool:
        """Return equality for SwarmNode based on node_id."""
        if not isinstance(other, SwarmNode):
            return False
        return self.node_id == other.node_id

    def __str__(self) -> str:
        """Return string representation of SwarmNode."""
        return self.node_id

    def __repr__(self) -> str:
        """Return detailed representation of SwarmNode."""
        return f"SwarmNode(node_id='{self.node_id}')"

    def reset_executor_state(self) -> None:
        """Reset SwarmNode executor state to initial state when swarm was created."""
        self.executor.messages = copy.deepcopy(self._initial_messages)
        self.executor.state = AgentState(self._initial_state.get())

```

#### `__eq__(other)`

Return equality for SwarmNode based on node_id.

Source code in `strands/multiagent/swarm.py`

```
def __eq__(self, other: Any) -> bool:
    """Return equality for SwarmNode based on node_id."""
    if not isinstance(other, SwarmNode):
        return False
    return self.node_id == other.node_id

```

#### `__hash__()`

Return hash for SwarmNode based on node_id.

Source code in `strands/multiagent/swarm.py`

```
def __hash__(self) -> int:
    """Return hash for SwarmNode based on node_id."""
    return hash(self.node_id)

```

#### `__post_init__()`

Capture initial executor state after initialization.

Source code in `strands/multiagent/swarm.py`

```
def __post_init__(self) -> None:
    """Capture initial executor state after initialization."""
    # Deep copy the initial messages and state to preserve them
    self._initial_messages = copy.deepcopy(self.executor.messages)
    self._initial_state = AgentState(self.executor.state.get())

```

#### `__repr__()`

Return detailed representation of SwarmNode.

Source code in `strands/multiagent/swarm.py`

```
def __repr__(self) -> str:
    """Return detailed representation of SwarmNode."""
    return f"SwarmNode(node_id='{self.node_id}')"

```

#### `__str__()`

Return string representation of SwarmNode.

Source code in `strands/multiagent/swarm.py`

```
def __str__(self) -> str:
    """Return string representation of SwarmNode."""
    return self.node_id

```

#### `reset_executor_state()`

Reset SwarmNode executor state to initial state when swarm was created.

Source code in `strands/multiagent/swarm.py`

```
def reset_executor_state(self) -> None:
    """Reset SwarmNode executor state to initial state when swarm was created."""
    self.executor.messages = copy.deepcopy(self._initial_messages)
    self.executor.state = AgentState(self._initial_state.get())

```

### `SwarmResult`

Bases: `MultiAgentResult`

Result from swarm execution - extends MultiAgentResult with swarm-specific details.

Source code in `strands/multiagent/swarm.py`

```
@dataclass
class SwarmResult(MultiAgentResult):
    """Result from swarm execution - extends MultiAgentResult with swarm-specific details."""

    node_history: list[SwarmNode] = field(default_factory=list)

```

### `SwarmState`

Current state of swarm execution.

Source code in `strands/multiagent/swarm.py`

```
@dataclass
class SwarmState:
    """Current state of swarm execution."""

    current_node: SwarmNode  # The agent currently executing
    task: str | list[ContentBlock]  # The original task from the user that is being executed
    completion_status: Status = Status.PENDING  # Current swarm execution status
    shared_context: SharedContext = field(default_factory=SharedContext)  # Context shared between agents
    node_history: list[SwarmNode] = field(default_factory=list)  # Complete history of agents that have executed
    start_time: float = field(default_factory=time.time)  # When swarm execution began
    results: dict[str, NodeResult] = field(default_factory=dict)  # Results from each agent execution
    # Total token usage across all agents
    accumulated_usage: Usage = field(default_factory=lambda: Usage(inputTokens=0, outputTokens=0, totalTokens=0))
    # Total metrics across all agents
    accumulated_metrics: Metrics = field(default_factory=lambda: Metrics(latencyMs=0))
    execution_time: int = 0  # Total execution time in milliseconds
    handoff_message: str | None = None  # Message passed during agent handoff

    def should_continue(
        self,
        *,
        max_handoffs: int,
        max_iterations: int,
        execution_timeout: float,
        repetitive_handoff_detection_window: int,
        repetitive_handoff_min_unique_agents: int,
    ) -> Tuple[bool, str]:
        """Check if the swarm should continue.

        Returns: (should_continue, reason)
        """
        # Check handoff limit
        if len(self.node_history) >= max_handoffs:
            return False, f"Max handoffs reached: {max_handoffs}"

        # Check iteration limit
        if len(self.node_history) >= max_iterations:
            return False, f"Max iterations reached: {max_iterations}"

        # Check timeout
        elapsed = time.time() - self.start_time
        if elapsed > execution_timeout:
            return False, f"Execution timed out: {execution_timeout}s"

        # Check for repetitive handoffs (agents passing back and forth)
        if repetitive_handoff_detection_window > 0 and len(self.node_history) >= repetitive_handoff_detection_window:
            recent = self.node_history[-repetitive_handoff_detection_window:]
            unique_nodes = len(set(recent))
            if unique_nodes < repetitive_handoff_min_unique_agents:
                return (
                    False,
                    (
                        f"Repetitive handoff: {unique_nodes} unique nodes "
                        f"out of {repetitive_handoff_detection_window} recent iterations"
                    ),
                )

        return True, "Continuing"

```

#### `should_continue(*, max_handoffs, max_iterations, execution_timeout, repetitive_handoff_detection_window, repetitive_handoff_min_unique_agents)`

Check if the swarm should continue.

Returns: (should_continue, reason)

Source code in `strands/multiagent/swarm.py`

```
def should_continue(
    self,
    *,
    max_handoffs: int,
    max_iterations: int,
    execution_timeout: float,
    repetitive_handoff_detection_window: int,
    repetitive_handoff_min_unique_agents: int,
) -> Tuple[bool, str]:
    """Check if the swarm should continue.

    Returns: (should_continue, reason)
    """
    # Check handoff limit
    if len(self.node_history) >= max_handoffs:
        return False, f"Max handoffs reached: {max_handoffs}"

    # Check iteration limit
    if len(self.node_history) >= max_iterations:
        return False, f"Max iterations reached: {max_iterations}"

    # Check timeout
    elapsed = time.time() - self.start_time
    if elapsed > execution_timeout:
        return False, f"Execution timed out: {execution_timeout}s"

    # Check for repetitive handoffs (agents passing back and forth)
    if repetitive_handoff_detection_window > 0 and len(self.node_history) >= repetitive_handoff_detection_window:
        recent = self.node_history[-repetitive_handoff_detection_window:]
        unique_nodes = len(set(recent))
        if unique_nodes < repetitive_handoff_min_unique_agents:
            return (
                False,
                (
                    f"Repetitive handoff: {unique_nodes} unique nodes "
                    f"out of {repetitive_handoff_detection_window} recent iterations"
                ),
            )

    return True, "Continuing"

```

## `strands.multiagent.a2a`

Agent-to-Agent (A2A) communication protocol implementation for Strands Agents.

This module provides classes and utilities for enabling Strands Agents to communicate with other agents using the Agent-to-Agent (A2A) protocol.

Docs: https://google-a2a.github.io/A2A/latest/

Classes:

| Name | Description | | --- | --- | | `A2AAgent` | A wrapper that adapts a Strands Agent to be A2A-compatible. |

### `strands.multiagent.a2a.executor`

Strands Agent executor for the A2A protocol.

This module provides the StrandsA2AExecutor class, which adapts a Strands Agent to be used as an executor in the A2A protocol. It handles the execution of agent requests and the conversion of Strands Agent streamed responses to A2A events.

The A2A AgentExecutor ensures clients receive responses for synchronous and streamed requests to the A2AServer.

#### `StrandsA2AExecutor`

Bases: `AgentExecutor`

Executor that adapts a Strands Agent to the A2A protocol.

This executor uses streaming mode to handle the execution of agent requests and converts Strands Agent responses to A2A protocol events.

Source code in `strands/multiagent/a2a/executor.py`

```
class StrandsA2AExecutor(AgentExecutor):
    """Executor that adapts a Strands Agent to the A2A protocol.

    This executor uses streaming mode to handle the execution of agent requests
    and converts Strands Agent responses to A2A protocol events.
    """

    def __init__(self, agent: SAAgent):
        """Initialize a StrandsA2AExecutor.

        Args:
            agent: The Strands Agent instance to adapt to the A2A protocol.
        """
        self.agent = agent

    async def execute(
        self,
        context: RequestContext,
        event_queue: EventQueue,
    ) -> None:
        """Execute a request using the Strands Agent and send the response as A2A events.

        This method executes the user's input using the Strands Agent in streaming mode
        and converts the agent's response to A2A events.

        Args:
            context: The A2A request context, containing the user's input and task metadata.
            event_queue: The A2A event queue used to send response events back to the client.

        Raises:
            ServerError: If an error occurs during agent execution
        """
        task = context.current_task
        if not task:
            task = new_task(context.message)  # type: ignore
            await event_queue.enqueue_event(task)

        updater = TaskUpdater(event_queue, task.id, task.contextId)

        try:
            await self._execute_streaming(context, updater)
        except Exception as e:
            raise ServerError(error=InternalError()) from e

    async def _execute_streaming(self, context: RequestContext, updater: TaskUpdater) -> None:
        """Execute request in streaming mode.

        Streams the agent's response in real-time, sending incremental updates
        as they become available from the agent.

        Args:
            context: The A2A request context, containing the user's input and other metadata.
            updater: The task updater for managing task state and sending updates.
        """
        logger.info("Executing request in streaming mode")
        user_input = context.get_user_input()
        try:
            async for event in self.agent.stream_async(user_input):
                await self._handle_streaming_event(event, updater)
        except Exception:
            logger.exception("Error in streaming execution")
            raise

    async def _handle_streaming_event(self, event: dict[str, Any], updater: TaskUpdater) -> None:
        """Handle a single streaming event from the Strands Agent.

        Processes streaming events from the agent, converting data chunks to A2A
        task updates and handling the final result when streaming is complete.

        Args:
            event: The streaming event from the agent, containing either 'data' for
                incremental content or 'result' for the final response.
            updater: The task updater for managing task state and sending updates.
        """
        logger.debug("Streaming event: %s", event)
        if "data" in event:
            if text_content := event["data"]:
                await updater.update_status(
                    TaskState.working,
                    new_agent_text_message(
                        text_content,
                        updater.context_id,
                        updater.task_id,
                    ),
                )
        elif "result" in event:
            await self._handle_agent_result(event["result"], updater)

    async def _handle_agent_result(self, result: SAAgentResult | None, updater: TaskUpdater) -> None:
        """Handle the final result from the Strands Agent.

        Processes the agent's final result, extracts text content from the response,
        and adds it as an artifact to the task before marking the task as complete.

        Args:
            result: The agent result object containing the final response, or None if no result.
            updater: The task updater for managing task state and adding the final artifact.
        """
        if final_content := str(result):
            await updater.add_artifact(
                [Part(root=TextPart(text=final_content))],
                name="agent_response",
            )
        await updater.complete()

    async def cancel(self, context: RequestContext, event_queue: EventQueue) -> None:
        """Cancel an ongoing execution.

        This method is called when a request cancellation is requested. Currently,
        cancellation is not supported by the Strands Agent executor, so this method
        always raises an UnsupportedOperationError.

        Args:
            context: The A2A request context.
            event_queue: The A2A event queue.

        Raises:
            ServerError: Always raised with an UnsupportedOperationError, as cancellation
                is not currently supported.
        """
        logger.warning("Cancellation requested but not supported")
        raise ServerError(error=UnsupportedOperationError())

```

##### `__init__(agent)`

Initialize a StrandsA2AExecutor.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | The Strands Agent instance to adapt to the A2A protocol. | *required* |

Source code in `strands/multiagent/a2a/executor.py`

```
def __init__(self, agent: SAAgent):
    """Initialize a StrandsA2AExecutor.

    Args:
        agent: The Strands Agent instance to adapt to the A2A protocol.
    """
    self.agent = agent

```

##### `cancel(context, event_queue)`

Cancel an ongoing execution.

This method is called when a request cancellation is requested. Currently, cancellation is not supported by the Strands Agent executor, so this method always raises an UnsupportedOperationError.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `context` | `RequestContext` | The A2A request context. | *required* | | `event_queue` | `EventQueue` | The A2A event queue. | *required* |

Raises:

| Type | Description | | --- | --- | | `ServerError` | Always raised with an UnsupportedOperationError, as cancellation is not currently supported. |

Source code in `strands/multiagent/a2a/executor.py`

```
async def cancel(self, context: RequestContext, event_queue: EventQueue) -> None:
    """Cancel an ongoing execution.

    This method is called when a request cancellation is requested. Currently,
    cancellation is not supported by the Strands Agent executor, so this method
    always raises an UnsupportedOperationError.

    Args:
        context: The A2A request context.
        event_queue: The A2A event queue.

    Raises:
        ServerError: Always raised with an UnsupportedOperationError, as cancellation
            is not currently supported.
    """
    logger.warning("Cancellation requested but not supported")
    raise ServerError(error=UnsupportedOperationError())

```

##### `execute(context, event_queue)`

Execute a request using the Strands Agent and send the response as A2A events.

This method executes the user's input using the Strands Agent in streaming mode and converts the agent's response to A2A events.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `context` | `RequestContext` | The A2A request context, containing the user's input and task metadata. | *required* | | `event_queue` | `EventQueue` | The A2A event queue used to send response events back to the client. | *required* |

Raises:

| Type | Description | | --- | --- | | `ServerError` | If an error occurs during agent execution |

Source code in `strands/multiagent/a2a/executor.py`

```
async def execute(
    self,
    context: RequestContext,
    event_queue: EventQueue,
) -> None:
    """Execute a request using the Strands Agent and send the response as A2A events.

    This method executes the user's input using the Strands Agent in streaming mode
    and converts the agent's response to A2A events.

    Args:
        context: The A2A request context, containing the user's input and task metadata.
        event_queue: The A2A event queue used to send response events back to the client.

    Raises:
        ServerError: If an error occurs during agent execution
    """
    task = context.current_task
    if not task:
        task = new_task(context.message)  # type: ignore
        await event_queue.enqueue_event(task)

    updater = TaskUpdater(event_queue, task.id, task.contextId)

    try:
        await self._execute_streaming(context, updater)
    except Exception as e:
        raise ServerError(error=InternalError()) from e

```

### `strands.multiagent.a2a.server`

A2A-compatible wrapper for Strands Agent.

This module provides the A2AAgent class, which adapts a Strands Agent to the A2A protocol, allowing it to be used in A2A-compatible systems.

#### `A2AServer`

A2A-compatible wrapper for Strands Agent.

Source code in `strands/multiagent/a2a/server.py`

```
class A2AServer:
    """A2A-compatible wrapper for Strands Agent."""

    def __init__(
        self,
        agent: SAAgent,
        *,
        # AgentCard
        host: str = "0.0.0.0",
        port: int = 9000,
        http_url: str | None = None,
        serve_at_root: bool = False,
        version: str = "0.0.1",
        skills: list[AgentSkill] | None = None,
    ):
        """Initialize an A2A-compatible server from a Strands agent.

        Args:
            agent: The Strands Agent to wrap with A2A compatibility.
            host: The hostname or IP address to bind the A2A server to. Defaults to "0.0.0.0".
            port: The port to bind the A2A server to. Defaults to 9000.
            http_url: The public HTTP URL where this agent will be accessible. If provided,
                this overrides the generated URL from host/port and enables automatic
                path-based mounting for load balancer scenarios.
                Example: "http://my-alb.amazonaws.com/agent1"
            serve_at_root: If True, forces the server to serve at root path regardless of
                http_url path component. Use this when your load balancer strips path prefixes.
                Defaults to False.
            version: The version of the agent. Defaults to "0.0.1".
            skills: The list of capabilities or functions the agent can perform.
        """
        self.host = host
        self.port = port
        self.version = version

        if http_url:
            # Parse the provided URL to extract components for mounting
            self.public_base_url, self.mount_path = self._parse_public_url(http_url)
            self.http_url = http_url.rstrip("/") + "/"

            # Override mount path if serve_at_root is requested
            if serve_at_root:
                self.mount_path = ""
        else:
            # Fall back to constructing the URL from host and port
            self.public_base_url = f"http://{host}:{port}"
            self.http_url = f"{self.public_base_url}/"
            self.mount_path = ""

        self.strands_agent = agent
        self.name = self.strands_agent.name
        self.description = self.strands_agent.description
        self.capabilities = AgentCapabilities(streaming=True)
        self.request_handler = DefaultRequestHandler(
            agent_executor=StrandsA2AExecutor(self.strands_agent),
            task_store=InMemoryTaskStore(),
        )
        self._agent_skills = skills
        logger.info("Strands' integration with A2A is experimental. Be aware of frequent breaking changes.")

    def _parse_public_url(self, url: str) -> tuple[str, str]:
        """Parse the public URL into base URL and mount path components.

        Args:
            url: The full public URL (e.g., "http://my-alb.amazonaws.com/agent1")

        Returns:
            tuple: (base_url, mount_path) where base_url is the scheme+netloc
                  and mount_path is the path component

        Example:
            _parse_public_url("http://my-alb.amazonaws.com/agent1")
            Returns: ("http://my-alb.amazonaws.com", "/agent1")
        """
        parsed = urlparse(url.rstrip("/"))
        base_url = f"{parsed.scheme}://{parsed.netloc}"
        mount_path = parsed.path if parsed.path != "/" else ""
        return base_url, mount_path

    @property
    def public_agent_card(self) -> AgentCard:
        """Get the public AgentCard for this agent.

        The AgentCard contains metadata about the agent, including its name,
        description, URL, version, skills, and capabilities. This information
        is used by other agents and systems to discover and interact with this agent.

        Returns:
            AgentCard: The public agent card containing metadata about this agent.

        Raises:
            ValueError: If name or description is None or empty.
        """
        if not self.name:
            raise ValueError("A2A agent name cannot be None or empty")
        if not self.description:
            raise ValueError("A2A agent description cannot be None or empty")

        return AgentCard(
            name=self.name,
            description=self.description,
            url=self.http_url,
            version=self.version,
            skills=self.agent_skills,
            default_input_modes=["text"],
            default_output_modes=["text"],
            capabilities=self.capabilities,
        )

    def _get_skills_from_tools(self) -> list[AgentSkill]:
        """Get the list of skills from Strands agent tools.

        Skills represent specific capabilities that the agent can perform.
        Strands agent tools are adapted to A2A skills.

        Returns:
            list[AgentSkill]: A list of skills this agent provides.
        """
        return [
            AgentSkill(name=config["name"], id=config["name"], description=config["description"], tags=[])
            for config in self.strands_agent.tool_registry.get_all_tools_config().values()
        ]

    @property
    def agent_skills(self) -> list[AgentSkill]:
        """Get the list of skills this agent provides."""
        return self._agent_skills if self._agent_skills is not None else self._get_skills_from_tools()

    @agent_skills.setter
    def agent_skills(self, skills: list[AgentSkill]) -> None:
        """Set the list of skills this agent provides.

        Args:
            skills: A list of AgentSkill objects to set for this agent.
        """
        self._agent_skills = skills

    def to_starlette_app(self) -> Starlette:
        """Create a Starlette application for serving this agent via HTTP.

        Automatically handles path-based mounting if a mount path was derived
        from the http_url parameter.

        Returns:
            Starlette: A Starlette application configured to serve this agent.
        """
        a2a_app = A2AStarletteApplication(agent_card=self.public_agent_card, http_handler=self.request_handler).build()

        if self.mount_path:
            # Create parent app and mount the A2A app at the specified path
            parent_app = Starlette()
            parent_app.mount(self.mount_path, a2a_app)
            logger.info("Mounting A2A server at path: %s", self.mount_path)
            return parent_app

        return a2a_app

    def to_fastapi_app(self) -> FastAPI:
        """Create a FastAPI application for serving this agent via HTTP.

        Automatically handles path-based mounting if a mount path was derived
        from the http_url parameter.

        Returns:
            FastAPI: A FastAPI application configured to serve this agent.
        """
        a2a_app = A2AFastAPIApplication(agent_card=self.public_agent_card, http_handler=self.request_handler).build()

        if self.mount_path:
            # Create parent app and mount the A2A app at the specified path
            parent_app = FastAPI()
            parent_app.mount(self.mount_path, a2a_app)
            logger.info("Mounting A2A server at path: %s", self.mount_path)
            return parent_app

        return a2a_app

    def serve(
        self,
        app_type: Literal["fastapi", "starlette"] = "starlette",
        *,
        host: str | None = None,
        port: int | None = None,
        **kwargs: Any,
    ) -> None:
        """Start the A2A server with the specified application type.

        This method starts an HTTP server that exposes the agent via the A2A protocol.
        The server can be implemented using either FastAPI or Starlette, depending on
        the specified app_type.

        Args:
            app_type: The type of application to serve, either "fastapi" or "starlette".
                Defaults to "starlette".
            host: The host address to bind the server to. Defaults to "0.0.0.0".
            port: The port number to bind the server to. Defaults to 9000.
            **kwargs: Additional keyword arguments to pass to uvicorn.run.
        """
        try:
            logger.info("Starting Strands A2A server...")
            if app_type == "fastapi":
                uvicorn.run(self.to_fastapi_app(), host=host or self.host, port=port or self.port, **kwargs)
            else:
                uvicorn.run(self.to_starlette_app(), host=host or self.host, port=port or self.port, **kwargs)
        except KeyboardInterrupt:
            logger.warning("Strands A2A server shutdown requested (KeyboardInterrupt).")
        except Exception:
            logger.exception("Strands A2A server encountered exception.")
        finally:
            logger.info("Strands A2A server has shutdown.")

```

##### `agent_skills`

Get the list of skills this agent provides.

##### `public_agent_card`

Get the public AgentCard for this agent.

The AgentCard contains metadata about the agent, including its name, description, URL, version, skills, and capabilities. This information is used by other agents and systems to discover and interact with this agent.

Returns:

| Name | Type | Description | | --- | --- | --- | | `AgentCard` | `AgentCard` | The public agent card containing metadata about this agent. |

Raises:

| Type | Description | | --- | --- | | `ValueError` | If name or description is None or empty. |

##### `__init__(agent, *, host='0.0.0.0', port=9000, http_url=None, serve_at_root=False, version='0.0.1', skills=None)`

Initialize an A2A-compatible server from a Strands agent.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | The Strands Agent to wrap with A2A compatibility. | *required* | | `host` | `str` | The hostname or IP address to bind the A2A server to. Defaults to "0.0.0.0". | `'0.0.0.0'` | | `port` | `int` | The port to bind the A2A server to. Defaults to 9000. | `9000` | | `http_url` | `str | None` | The public HTTP URL where this agent will be accessible. If provided, this overrides the generated URL from host/port and enables automatic path-based mounting for load balancer scenarios. Example: "http://my-alb.amazonaws.com/agent1" | `None` | | `serve_at_root` | `bool` | If True, forces the server to serve at root path regardless of http_url path component. Use this when your load balancer strips path prefixes. Defaults to False. | `False` | | `version` | `str` | The version of the agent. Defaults to "0.0.1". | `'0.0.1'` | | `skills` | `list[AgentSkill] | None` | The list of capabilities or functions the agent can perform. | `None` |

Source code in `strands/multiagent/a2a/server.py`

```
def __init__(
    self,
    agent: SAAgent,
    *,
    # AgentCard
    host: str = "0.0.0.0",
    port: int = 9000,
    http_url: str | None = None,
    serve_at_root: bool = False,
    version: str = "0.0.1",
    skills: list[AgentSkill] | None = None,
):
    """Initialize an A2A-compatible server from a Strands agent.

    Args:
        agent: The Strands Agent to wrap with A2A compatibility.
        host: The hostname or IP address to bind the A2A server to. Defaults to "0.0.0.0".
        port: The port to bind the A2A server to. Defaults to 9000.
        http_url: The public HTTP URL where this agent will be accessible. If provided,
            this overrides the generated URL from host/port and enables automatic
            path-based mounting for load balancer scenarios.
            Example: "http://my-alb.amazonaws.com/agent1"
        serve_at_root: If True, forces the server to serve at root path regardless of
            http_url path component. Use this when your load balancer strips path prefixes.
            Defaults to False.
        version: The version of the agent. Defaults to "0.0.1".
        skills: The list of capabilities or functions the agent can perform.
    """
    self.host = host
    self.port = port
    self.version = version

    if http_url:
        # Parse the provided URL to extract components for mounting
        self.public_base_url, self.mount_path = self._parse_public_url(http_url)
        self.http_url = http_url.rstrip("/") + "/"

        # Override mount path if serve_at_root is requested
        if serve_at_root:
            self.mount_path = ""
    else:
        # Fall back to constructing the URL from host and port
        self.public_base_url = f"http://{host}:{port}"
        self.http_url = f"{self.public_base_url}/"
        self.mount_path = ""

    self.strands_agent = agent
    self.name = self.strands_agent.name
    self.description = self.strands_agent.description
    self.capabilities = AgentCapabilities(streaming=True)
    self.request_handler = DefaultRequestHandler(
        agent_executor=StrandsA2AExecutor(self.strands_agent),
        task_store=InMemoryTaskStore(),
    )
    self._agent_skills = skills
    logger.info("Strands' integration with A2A is experimental. Be aware of frequent breaking changes.")

```

##### `serve(app_type='starlette', *, host=None, port=None, **kwargs)`

Start the A2A server with the specified application type.

This method starts an HTTP server that exposes the agent via the A2A protocol. The server can be implemented using either FastAPI or Starlette, depending on the specified app_type.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `app_type` | `Literal['fastapi', 'starlette']` | The type of application to serve, either "fastapi" or "starlette". Defaults to "starlette". | `'starlette'` | | `host` | `str | None` | The host address to bind the server to. Defaults to "0.0.0.0". | `None` | | `port` | `int | None` | The port number to bind the server to. Defaults to 9000. | `None` | | `**kwargs` | `Any` | Additional keyword arguments to pass to uvicorn.run. | `{}` |

Source code in `strands/multiagent/a2a/server.py`

```
def serve(
    self,
    app_type: Literal["fastapi", "starlette"] = "starlette",
    *,
    host: str | None = None,
    port: int | None = None,
    **kwargs: Any,
) -> None:
    """Start the A2A server with the specified application type.

    This method starts an HTTP server that exposes the agent via the A2A protocol.
    The server can be implemented using either FastAPI or Starlette, depending on
    the specified app_type.

    Args:
        app_type: The type of application to serve, either "fastapi" or "starlette".
            Defaults to "starlette".
        host: The host address to bind the server to. Defaults to "0.0.0.0".
        port: The port number to bind the server to. Defaults to 9000.
        **kwargs: Additional keyword arguments to pass to uvicorn.run.
    """
    try:
        logger.info("Starting Strands A2A server...")
        if app_type == "fastapi":
            uvicorn.run(self.to_fastapi_app(), host=host or self.host, port=port or self.port, **kwargs)
        else:
            uvicorn.run(self.to_starlette_app(), host=host or self.host, port=port or self.port, **kwargs)
    except KeyboardInterrupt:
        logger.warning("Strands A2A server shutdown requested (KeyboardInterrupt).")
    except Exception:
        logger.exception("Strands A2A server encountered exception.")
    finally:
        logger.info("Strands A2A server has shutdown.")

```

##### `to_fastapi_app()`

Create a FastAPI application for serving this agent via HTTP.

Automatically handles path-based mounting if a mount path was derived from the http_url parameter.

Returns:

| Name | Type | Description | | --- | --- | --- | | `FastAPI` | `FastAPI` | A FastAPI application configured to serve this agent. |

Source code in `strands/multiagent/a2a/server.py`

```
def to_fastapi_app(self) -> FastAPI:
    """Create a FastAPI application for serving this agent via HTTP.

    Automatically handles path-based mounting if a mount path was derived
    from the http_url parameter.

    Returns:
        FastAPI: A FastAPI application configured to serve this agent.
    """
    a2a_app = A2AFastAPIApplication(agent_card=self.public_agent_card, http_handler=self.request_handler).build()

    if self.mount_path:
        # Create parent app and mount the A2A app at the specified path
        parent_app = FastAPI()
        parent_app.mount(self.mount_path, a2a_app)
        logger.info("Mounting A2A server at path: %s", self.mount_path)
        return parent_app

    return a2a_app

```

##### `to_starlette_app()`

Create a Starlette application for serving this agent via HTTP.

Automatically handles path-based mounting if a mount path was derived from the http_url parameter.

Returns:

| Name | Type | Description | | --- | --- | --- | | `Starlette` | `Starlette` | A Starlette application configured to serve this agent. |

Source code in `strands/multiagent/a2a/server.py`

```
def to_starlette_app(self) -> Starlette:
    """Create a Starlette application for serving this agent via HTTP.

    Automatically handles path-based mounting if a mount path was derived
    from the http_url parameter.

    Returns:
        Starlette: A Starlette application configured to serve this agent.
    """
    a2a_app = A2AStarletteApplication(agent_card=self.public_agent_card, http_handler=self.request_handler).build()

    if self.mount_path:
        # Create parent app and mount the A2A app at the specified path
        parent_app = Starlette()
        parent_app.mount(self.mount_path, a2a_app)
        logger.info("Mounting A2A server at path: %s", self.mount_path)
        return parent_app

    return a2a_app

```
