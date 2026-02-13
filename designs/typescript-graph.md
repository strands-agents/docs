# TypeScript SDK - Graph - Design

## Overview

This document covers the design of the Graph multi-agent orchestration pattern for the TypeScript SDK. It walks through the core interfaces (Status, Node, Graph, Events), shows usage examples, and discusses future considerations around state isolation and remote execution.

Not covered in this document:

- Swarm builds on the same core interfaces introduced here (Status, Node, streaming events) and should not require a separate design discussion
- Telemetry, hooks, and interrupts are planned for multi-agent patterns but follow closely from existing SDK patterns and should not require a separate design discussion
- Session management will be reviewed separately

## Interfaces

The Graph pattern introduces a new `src/multiagent/` module containing shared multi-agent abstractions and the Graph-specific implementation.

```
src/
└── multiagent/
    ├── index.ts   # Public exports
    ├── base.ts    # MultiAgentBase, MultiAgentState
    ├── status.ts  # Status enum
    ├── nodes.ts   # Node, NodeConfig, NodeInput, NodeResult, NodeState, AgentNode, MultiAgentNode, FunctionNode
    ├── graph.ts   # Graph, GraphBuilder, GraphEdge, GraphInput, GraphResult, GraphState, GraphConfig
    └── events.ts  # Streaming events
```

> [!NOTE]
> Modules can be split into subdirectories later if they become unwieldy.

### Base

```typescript
class MultiAgentState {
  readonly user: z.infer<typeof schema>
  ...
}
```

- Base state class shared across multi-agent patterns (Graph, Swarm, etc.)
- `user`: mutable section for customer-defined state. Typed via Zod schema inference (`z.infer<typeof schema>`) so customers get compile-time type safety and runtime validation without writing generics manually. Customers update it directly (e.g., `state.user.counter += 1`).

### Status

```typescript
enum Status {
  PENDING = 'PENDING',
  EXECUTING = 'EXECUTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}
```

- Shared across nodes and graphs to track execution lifecycle
- `PENDING`: not yet started
- `EXECUTING`: currently running
- `COMPLETED`: finished successfully
- `FAILED`: encountered an error, captured in the result rather than throwing
  - Downstream dependent nodes are not executed and left in `PENDING`
  - The graph is marked `FAILED` if at least one node fails
  - Concurrently running nodes are allowed to finish by default (graceful exit)
  - Customers can override this for fail-fast behavior
- `CANCELLED`: explicitly cancelled by the caller (e.g., via a hook that sets `cancelNode`)
  - Downstream dependent nodes are not executed and left in `PENDING`
  - The graph is marked `CANCELLED` if at least one node is cancelled and none failed
  - Concurrently running nodes are allowed to finish (graceful exit)

### Node

```typescript
type NodeInput = string | ContentBlock[]
```

- Input passed to a node at execution time
- Entry point nodes receive the original task provided to the graph
- Downstream nodes receive content blocks built from upstream dependency outputs

```typescript
class NodeResult {
  readonly nodeId: string
  readonly status: Status
  readonly duration: number
  readonly error?: Error
  readonly output: ContentBlock[]
  ...
}
```

- Returned by `node.stream()` after execution completes
- `output` is always `ContentBlock[]`, the uniform output type across all node types
- Errors are captured in the result rather than thrown, letting the graph engine decide how to proceed

```typescript
class NodeState {
  multiAgentState?: MultiAgentState
  executionCount: number
  ...
}
```

- Per-node execution context created by the orchestration engine before each node runs
- `multiAgentState`: reference to the current `MultiAgentState` (e.g., `GraphState`, `SwarmState`) for reading execution metadata and updating user state

```typescript
interface NodeConfig {
  timeout?: number
  ...
}
```

- Optional configuration passed to node constructors
- `timeout`: per-node time limit in seconds

```typescript
abstract class Node {
  readonly id: string
  readonly nodeType: 'agent' | 'multiAgent' | 'function'
  readonly config?: NodeConfig

  async *stream(input: NodeInput, state?: NodeState): AsyncGenerator<MultiAgentStreamEvent, NodeResult, undefined>
  protected abstract async *_stream(input: NodeInput, state: NodeState): AsyncGenerator<MultiAgentStreamEvent, ContentBlock[], undefined>
}
```

- Abstract base class for all multi-agent nodes
- Uses the template method pattern: `stream()` handles orchestration boilerplate (duration measurement, status tracking, error handling) and delegates to `_stream()` for node-specific logic
- `_stream()` returns `ContentBlock[]` as the node's output; `stream()` wraps it into a `NodeResult`
- The graph engine calls `node.stream()` uniformly regardless of node type. Specialized subclasses (`AgentNode`, `MultiAgentNode`, `FunctionNode`) each encapsulate their own execution semantics, eliminating the type-checking and branching logic that exists in the Python SDK's `_execute_node`.
- `state` is optional on `stream()`; if not provided, the node creates a default `NodeState` internally. Callers pass it to override node-scoped context (e.g., `executionCount` when a node is retried within the same invocation).

```typescript
class AgentNode extends Node {
  constructor(id: string, agent: Agent, config?: NodeConfig)
}
```

- Wraps an `Agent` instance. Each execution is isolated — the node captures the agent's messages and state beforehand, then restores them once the execution completes. This lets the same agent instance run multiple times without carrying over conversation history or state.

```typescript
class MultiAgentNode extends Node {
  constructor(id: string, multiAgent: MultiAgentBase, config?: NodeConfig)
}
```

- Wraps a `MultiAgentBase` instance, enabling nested orchestration (e.g., a `Graph` as a node in another `Graph`)
- Forwards input to the nested pattern and wraps its streaming events with the node's ID

```typescript
type NodeHandler = (input: NodeInput, state: MultiAgentState) => NodeHandlerResult | Promise<NodeHandlerResult> | AsyncGenerator<MultiAgentStreamEvent, NodeHandlerResult, undefined>
```

- Function signature accepted by `FunctionNode`
- Supports plain functions, async functions, and async generators
- `NodeHandlerResult` is `string | ContentBlock[] | void`

```typescript
class FunctionNode extends Node {
  constructor(id: string, handler: NodeHandler, config?: NodeConfig)
}
```

- Wraps a plain function, async function, or async generator
- A general-purpose node for custom logic — transformations, routing, API calls, side effects, or wrapping an agent with custom pre/post-processing

### Graph

```typescript
type GraphInput = string | ContentBlock[]
```

- Input passed to the graph at invocation time
- Forwarded to entry point nodes as their `NodeInput`

```typescript
class GraphResult {
  readonly status: Status
  readonly results: Record<string, NodeResult>
  readonly error?: Error
  ...
}
```

- Aggregate result from a graph execution

```typescript
class GraphState extends MultiAgentState {
  readonly completedNodes: ReadonlySet<string>
  readonly failedNodes: ReadonlySet<string>
  ...
}
```

- Graph-specific state extending `MultiAgentState`

```typescript
interface GraphConfig {
  maxNodeExecutions?: number
  executionTimeout?: number
  maxConcurrency?: number
  hookProviders?: HookProvider[]
  userSchema?: z.ZodObject<z.ZodRawShape>
  ...
}
```

- Configuration object passed to `GraphBuilder.build()`
- `maxNodeExecutions`: limits total node executions across the invocation (prevents infinite loops in cyclic graphs)
- `executionTimeout`: total time limit for the entire graph invocation (in seconds)
- `maxConcurrency`: limits how many nodes can run in parallel
- `userSchema`: Zod schema that types `MultiAgentState.user` and enables runtime validation

```typescript
class GraphEdge {
  readonly source: string
  readonly target: string
  readonly handler?: EdgeHandler
}
```

- Directed edge between two nodes
- `handler`: optional function evaluated at runtime to determine whether the edge should be traversed
- Unconditional edges are always traversed when the source node completes

```typescript
class Graph implements MultiAgentBase {
  async *stream(input: GraphInput, state?: GraphState): AsyncGenerator<MultiAgentStreamEvent, GraphResult, undefined>
  async invoke(input: GraphInput, state?: GraphState): Promise<GraphResult>
  cancel(): void
}
```

- Implements `MultiAgentBase` for uniform orchestration
- `state` is optional; if not provided, the graph creates a fresh `GraphState` internally
- Uses eager execution — as soon as a node completes, newly-ready downstream nodes start immediately (no batch waves)
- A node is "ready" when all of its incoming edge sources have completed and all edge conditions evaluate to true
- Supports cyclic graphs when `maxNodeExecutions` or `executionTimeout` is set
- Each `stream()`/`invoke()` call creates fresh per-invocation state for isolation
- `cancel()` signals the current invocation to stop — currently running nodes are allowed to finish (graceful exit), pending nodes are not started, and the graph result is marked `CANCELLED`
- Multi-turn graph invocations are not supported initially (same as Python). This could be enabled later by maintaining conversation history on `GraphState` and using the isolated state pattern described in Future Considerations

```typescript
class GraphBuilder {
  addNode(agent: Agent | MultiAgentBase | NodeHandler, config?: NodeConfig): GraphBuilder
  addEdge(source: string, target: string, handler?: EdgeHandler): GraphBuilder
  build(config?: GraphConfig): Graph
}
```

- Builder pattern for constructing and validating graphs
- `addNode()` auto-detects the node type: `Agent` → `AgentNode`, `MultiAgentBase` → `MultiAgentNode`, function → `FunctionNode`
- `build()` accepts an optional `GraphConfig` for configuration (timeouts, concurrency, schema, etc.) and validates the graph structure: checks for missing edge references, duplicate node IDs, and ensures at least one entry point exists (nodes with no incoming edges)

### Events

```typescript
class MultiAgentNodeStartEvent {
  readonly type = 'multiAgentNodeStartEvent' as const
  readonly nodeId: string
  readonly nodeType: 'agent' | 'multiAgent' | 'function'
}
```

- Streaming events are yielded during `graph.stream()` to provide real-time visibility into execution progress
- All Graph streaming events are prefixed with `MultiAgent` (e.g., `MultiAgentNodeStartEvent`, `MultiAgentNodeStopEvent`, `MultiAgentHandoffEvent`) since they are shared across multi-agent patterns
- Events use discriminated unions via the `type` field for easy filtering and pattern matching

## Usage

```typescript
import { Agent } from '@strands-agents/sdk'
import { GraphBuilder, NodeHandler } from '@strands-agents/sdk/multiagent'
import { z } from 'zod'

// Define agents
const researcher = new Agent({
  systemPrompt: 'You are a research assistant. Gather information on the given topic.',
})

const writer = new Agent({
  systemPrompt: 'You are a technical writer. Write a report based on the research provided.',
})

const reviewer = new Agent({
  systemPrompt: 'You are an editor. Review the report and set approved to true if it meets quality standards.',
})

// Define a function node for post-processing
const formatOutput: NodeHandler = (input, state) => {
  state.user.drafts += 1
  return input
}

// Build the graph
//
//   researcher → writer → reviewer
//                  ↑          |
//                  └──────────┘  (condition: not approved)
//                             |
//                       formatOutput  (condition: approved)
//
const graph = new GraphBuilder()
  .addNode(researcher)
  .addNode(writer)
  .addNode(reviewer)
  .addNode(formatOutput)
  .addEdge('researcher', 'writer')
  .addEdge('writer', 'reviewer')
  .addEdge('reviewer', 'writer', (state) => !state.user.approved)
  .addEdge('reviewer', 'formatOutput', (state) => state.user.approved)
  .build({
    maxNodeExecutions: 10,
    executionTimeout: 60,
    userSchema: z.object({
      drafts: z.number().default(0),
      approved: z.boolean().default(false),
    }),
  })

// Stream execution
let result: GraphResult | undefined
for await (const event of graph.stream('Write a report on AI agents')) {
  if (event.type === 'multiAgentNodeStartEvent') {
    console.log(`Starting node: ${event.nodeId}`)
  }
  if (event.type === 'multiAgentNodeStopEvent') {
    console.log(`Finished node: ${event.nodeId} — ${event.result.status}`)
  }
  if (event.type === 'multiAgentResultEvent') {
    result = event.result
  }
}

console.log(`Graph status: ${result.status}`)
```

## Future Considerations

These sections cover capabilities that are not part of the initial implementation but are worth designing toward. They influence how we structure state, nodes, and execution today so we don't paint ourselves into a corner.

### Isolated State

Each graph invocation could be assigned a unique state ID. The graph engine would store and retrieve state through a session manager keyed by this ID, rather than holding state directly as fields on graph and node instances. When invoking a graph, customers could specify a state ID to resume from a previous invocation's state.

This matters for concurrent isolation — if state lives as instance members on the graph or node objects, every invocation overwrites the same fields and concurrent calls interfere with each other. An in-memory session manager that stores state in a table (keyed by state ID) solves this without requiring external storage. It gives each invocation its own isolated state while keeping the same graph instance reusable across concurrent calls.

This idea has implications beyond the graph — the `Agent` class itself stores state fields like `messages` directly as instance members. That means two concurrent `agent.invoke()` calls on the same agent instance would clobber each other's conversation history. The same session-manager-keyed-by-ID pattern could apply at the agent level to make individual agents concurrency-safe, not just graphs.

### Remote Node

A remote node would execute on a different process or machine — wrapping an agent behind an API, an MCP server, or an A2A endpoint. It would serialize input, send it over the wire, and deserialize the response back into `ContentBlock[]`. The `Node` abstraction already supports this — a `RemoteNode` subclass would implement `_stream()` with network calls instead of local execution, and the graph engine wouldn't need to change since it calls `node.stream()` uniformly.
