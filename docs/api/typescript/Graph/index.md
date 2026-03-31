Defined in: [src/multiagent/graph.ts:96](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/multiagent/graph.ts#L96)

Directed graph orchestration pattern.

Agents execute as nodes in a dependency graph, with edges defining execution order and optional conditions controlling routing. Source nodes (those with no incoming edges) run first, and downstream nodes execute once all their dependencies complete. Parallel execution is supported up to a configurable concurrency limit.

Key design choices vs the Python SDK:

-   Construction uses a declarative options object rather than a mutable GraphBuilder. Nodes and edges are passed directly to the constructor.
-   Dependency resolution uses AND semantics: a node runs only when all incoming edges are satisfied. Python uses OR semantics, firing a node when any single incoming edge from the completed batch is satisfied.
-   Nodes are launched individually as they become ready (up to maxConcurrency). Python executes in discrete batches, waiting for the entire batch to complete before scheduling the next set of nodes.
-   Agent nodes are stateless by default (snapshot/restore on each execution). Python accumulates agent state across executions unless `reset_on_revisit` is enabled.
-   Node failures produce a FAILED result, allowing parallel paths to continue. MultiAgent-level limits (maxSteps) throw exceptions. Python does the inverse: node failures throw exceptions (fail-fast), while limit violations return a FAILED result.

## Example

```typescript
const graph = new Graph({
  nodes: [researcher, writer],
  edges: [['researcher', 'writer']],
})

const result = await graph.invoke('Explain quantum computing')
```

## Implements

-   `MultiAgent`

## Constructors

### Constructor

```ts
new Graph(options): Graph;
```

Defined in: [src/multiagent/graph.ts:107](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/multiagent/graph.ts#L107)

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

Defined in: [src/multiagent/graph.ts:97](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/multiagent/graph.ts#L97)

Unique identifier for this orchestrator.

#### Implementation of

```ts
MultiAgent.id
```

---

### nodes

```ts
readonly nodes: ReadonlyMap<string, Node>;
```

Defined in: [src/multiagent/graph.ts:98](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/multiagent/graph.ts#L98)

---

### edges

```ts
readonly edges: readonly Edge[];
```

Defined in: [src/multiagent/graph.ts:99](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/multiagent/graph.ts#L99)

---

### config

```ts
readonly config: Required<GraphConfig>;
```

Defined in: [src/multiagent/graph.ts:100](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/multiagent/graph.ts#L100)

## Methods

### initialize()

```ts
initialize(): Promise<void>;
```

Defined in: [src/multiagent/graph.ts:133](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/multiagent/graph.ts#L133)

Initialize the graph. Invokes the MultiAgentInitializedEvent callback. Called automatically on first invocation.

#### Returns

`Promise`<`void`\>

---

### invoke()

```ts
invoke(input): Promise<MultiAgentResult>;
```

Defined in: [src/multiagent/graph.ts:146](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/multiagent/graph.ts#L146)

Invoke graph and return final result (consumes stream).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `input` | `MultiAgentInput` | The input to pass to entry point nodes |

#### Returns

`Promise`<`MultiAgentResult`\>

Promise resolving to the final MultiAgentResult

#### Implementation of

```ts
MultiAgent.invoke
```

---

### addHook()

```ts
addHook<T>(eventType, callback): HookCleanup;
```

Defined in: [src/multiagent/graph.ts:162](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/multiagent/graph.ts#L162)

Register a hook callback for a specific graph event type.

#### Type Parameters

| Type Parameter |
| --- |
| `T` *extends* [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md) |

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `eventType` | [<code dir="auto">HookableEventConstructor</code>](/docs/api/typescript/HookableEventConstructor/index.md)<`T`\> | The event class constructor to register the callback for |
| `callback` | [<code dir="auto">HookCallback</code>](/docs/api/typescript/HookCallback/index.md)<`T`\> | The callback function to invoke when the event occurs |

#### Returns

`HookCleanup`

Cleanup function that removes the callback when invoked

#### Implementation of

```ts
MultiAgent.addHook
```

---

### stream()

```ts
stream(input): AsyncGenerator<MultiAgentStreamEvent, MultiAgentResult, undefined>;
```

Defined in: [src/multiagent/graph.ts:173](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/multiagent/graph.ts#L173)

Stream graph execution, yielding events as nodes execute. Invokes hook callbacks for each event before yielding.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `input` | `MultiAgentInput` | The input to pass to entry nodes |

#### Returns

`AsyncGenerator`<`MultiAgentStreamEvent`, `MultiAgentResult`, `undefined`\>

Async generator yielding streaming events and returning a MultiAgentResult

#### Implementation of

```ts
MultiAgent.stream
```