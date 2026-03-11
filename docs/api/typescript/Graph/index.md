Defined in: [src/multiagent/graph.ts:87](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/multiagent/graph.ts#L87)

Directed graph orchestration pattern.

Agents execute as nodes in a dependency graph, with edges defining execution order and optional conditions controlling routing. Source nodes (those with no incoming edges) run first, and downstream nodes execute once all their dependencies complete. Parallel execution is supported up to a configurable concurrency limit.

Key design choices vs the Python SDK:

-   Construction uses a declarative options object rather than a mutable GraphBuilder. Nodes and edges are passed directly to the constructor.
-   Dependency resolution uses AND semantics: a node runs only when all incoming edges are satisfied. Python uses OR semantics, firing a node when any single incoming edge from the completed batch is satisfied.
-   Nodes are launched individually as they become ready (up to maxConcurrency). Python executes in discrete batches, waiting for the entire batch to complete before scheduling the next set of nodes.
-   Agent nodes are stateless by default (snapshot/restore on each execution). Python accumulates agent state across executions unless `reset_on_revisit` is enabled.
-   Node failures produce a FAILED result, allowing parallel paths to continue. Orchestrator-level limits (maxSteps) throw exceptions. Python does the inverse: node failures throw exceptions (fail-fast), while limit violations return a FAILED result.

## Example

```typescript
const graph = new Graph({
  nodes: [researcher, writer],
  edges: [['researcher', 'writer']],
})

const result = await graph.invoke('Explain quantum computing')
```

## Implements

-   `MultiAgentBase`

## Constructors

### Constructor

```ts
new Graph(options): Graph;
```

Defined in: [src/multiagent/graph.ts:96](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/multiagent/graph.ts#L96)

#### Parameters

| Parameter | Type |
| --- | --- |
| `options` | `GraphOptions` |

#### Returns

`Graph`

## Properties

### id

```ts
readonly id: string;
```

Defined in: [src/multiagent/graph.ts:88](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/multiagent/graph.ts#L88)

Unique identifier for this orchestrator.

#### Implementation of

```ts
MultiAgentBase.id
```

---

### nodes

```ts
readonly nodes: ReadonlyMap<string, Node>;
```

Defined in: [src/multiagent/graph.ts:89](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/multiagent/graph.ts#L89)

---

### edges

```ts
readonly edges: readonly Edge[];
```

Defined in: [src/multiagent/graph.ts:90](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/multiagent/graph.ts#L90)

---

### config

```ts
readonly config: Required<GraphConfig>;
```

Defined in: [src/multiagent/graph.ts:91](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/multiagent/graph.ts#L91)

---

### hooks

```ts
readonly hooks: HookRegistry;
```

Defined in: [src/multiagent/graph.ts:92](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/multiagent/graph.ts#L92)

## Methods

### initialize()

```ts
initialize(): Promise<void>;
```

Defined in: [src/multiagent/graph.ts:121](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/multiagent/graph.ts#L121)

Initialize the graph. Invokes the MultiAgentInitializedEvent callback. Called automatically on first invocation.

#### Returns

`Promise`<`void`\>

---

### invoke()

```ts
invoke(input): Promise<MultiAgentResult>;
```

Defined in: [src/multiagent/graph.ts:133](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/multiagent/graph.ts#L133)

Invoke graph and return final result (consumes stream).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `input` | `InvokeArgs` | The input to pass to entry point nodes |

#### Returns

`Promise`<`MultiAgentResult`\>

Promise resolving to the final MultiAgentResult

#### Implementation of

```ts
MultiAgentBase.invoke
```

---

### stream()

```ts
stream(input): AsyncGenerator<MultiAgentStreamEvent, MultiAgentResult, undefined>;
```

Defined in: [src/multiagent/graph.ts:149](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/multiagent/graph.ts#L149)

Stream graph execution, yielding events as nodes execute. Invokes hook callbacks for each event before yielding.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `input` | `InvokeArgs` | The input to pass to entry nodes |

#### Returns

`AsyncGenerator`<`MultiAgentStreamEvent`, `MultiAgentResult`, `undefined`\>

Async generator yielding streaming events and returning a MultiAgentResult

#### Implementation of

```ts
MultiAgentBase.stream
```