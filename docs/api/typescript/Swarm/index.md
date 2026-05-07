Defined in: [src/multiagent/swarm.ts:119](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/multiagent/swarm.ts#L119)

Swarm multi-agent orchestration pattern.

Agents execute sequentially, each deciding whether to hand off to another agent or produce a final response. Routing is driven by structured output: each agent receives a Zod schema with `agentId`, `message`, and optional `context` fields. When `agentId` is present, the swarm hands off to that agent with `message` as input. When omitted, `message` becomes the final response.

Key design choices vs the Python SDK:

-   Handoffs use structured output rather than an injected `handoff_to_agent` tool. Routing logic stays in the orchestrator, not inside tool callbacks.
-   Context is passed as serialized JSON text blocks rather than a mutable SharedContext.
-   A single `maxSteps` limit replaces Python’s separate `max_handoffs`/`max_iterations`.
-   Agent descriptions are embedded in the structured output schema for routing decisions.
-   Exceeding `maxSteps` throws an exception. Python returns a FAILED result.

## Example

```typescript
const swarm = new Swarm({
  nodes: [researcher, writer],
  start: 'researcher',
  maxSteps: 10,
})

const result = await swarm.invoke('Explain quantum computing')
```

## Implements

-   `MultiAgent`

## Constructors

### Constructor

```ts
new Swarm(options): Swarm;
```

Defined in: [src/multiagent/swarm.ts:130](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/multiagent/swarm.ts#L130)

#### Parameters

| Parameter | Type |
| --- | --- |
| `options` | `SwarmOptions` |

#### Returns

`Swarm`

## Properties

### id

```ts
readonly id: string;
```

Defined in: [src/multiagent/swarm.ts:120](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/multiagent/swarm.ts#L120)

Unique identifier for this orchestrator.

#### Implementation of

```ts
MultiAgent.id
```

---

### nodes

```ts
readonly nodes: ReadonlyMap<string, AgentNode>;
```

Defined in: [src/multiagent/swarm.ts:121](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/multiagent/swarm.ts#L121)

---

### config

```ts
readonly config: Required<SwarmConfig>;
```

Defined in: [src/multiagent/swarm.ts:122](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/multiagent/swarm.ts#L122)

---

### start

```ts
readonly start: AgentNode;
```

Defined in: [src/multiagent/swarm.ts:126](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/multiagent/swarm.ts#L126)

---

### sessionManager?

```ts
readonly optional sessionManager?: SessionManager;
```

Defined in: [src/multiagent/swarm.ts:127](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/multiagent/swarm.ts#L127)

## Methods

### initialize()

```ts
initialize(): Promise<void>;
```

Defined in: [src/multiagent/swarm.ts:168](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/multiagent/swarm.ts#L168)

Initialize the swarm. Invokes the MultiAgentInitializedEvent callback. Called automatically on first invocation.

#### Returns

`Promise`<`void`\>

---

### addHook()

```ts
addHook<T>(eventType, callback): HookCleanup;
```

Defined in: [src/multiagent/swarm.ts:182](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/multiagent/swarm.ts#L182)

Register a hook callback for a specific swarm event type.

#### Type Parameters

| Type Parameter |
| --- |
| `T` *extends* [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md) |

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `eventType` | [`HookableEventConstructor`](/docs/api/typescript/HookableEventConstructor/index.md)<`T`\> | The event class constructor to register the callback for |
| `callback` | [`HookCallback`](/docs/api/typescript/HookCallback/index.md)<`T`\> | The callback function to invoke when the event occurs |

#### Returns

`HookCleanup`

Cleanup function that removes the callback when invoked

#### Implementation of

```ts
MultiAgent.addHook
```

---

### invoke()

```ts
invoke(input, options?): Promise<MultiAgentResult>;
```

Defined in: [src/multiagent/swarm.ts:193](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/multiagent/swarm.ts#L193)

Invoke swarm and return final result (consumes stream).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `input` | `MultiAgentInput` | The input to pass to the start agent |
| `options?` | `MultiAgentInvokeOptions` | Optional per-invocation options (e.g., [InvocationState](/docs/api/typescript/InvocationState/index.md)) |

#### Returns

`Promise`<`MultiAgentResult`\>

Promise resolving to the final MultiAgentResult

#### Implementation of

```ts
MultiAgent.invoke
```

---

### stream()

```ts
stream(input, options?): AsyncGenerator<MultiAgentStreamEvent, MultiAgentResult, undefined>;
```

Defined in: [src/multiagent/swarm.ts:210](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/multiagent/swarm.ts#L210)

Stream swarm execution, yielding events as agents execute. Invokes hook callbacks for each event before yielding.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `input` | `MultiAgentInput` | The input to pass to the start agent |
| `options?` | `MultiAgentInvokeOptions` | Optional per-invocation options (e.g., [InvocationState](/docs/api/typescript/InvocationState/index.md)) |

#### Returns

`AsyncGenerator`<`MultiAgentStreamEvent`, `MultiAgentResult`, `undefined`\>

Async generator yielding streaming events and returning a MultiAgentResult

#### Implementation of

```ts
MultiAgent.stream
```