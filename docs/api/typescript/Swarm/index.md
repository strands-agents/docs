Defined in: [src/multiagent/swarm.ts:97](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/multiagent/swarm.ts#L97)

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

-   `MultiAgentBase`

## Constructors

### Constructor

```ts
new Swarm(options): Swarm;
```

Defined in: [src/multiagent/swarm.ts:106](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/multiagent/swarm.ts#L106)

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

Defined in: [src/multiagent/swarm.ts:98](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/multiagent/swarm.ts#L98)

Unique identifier for this orchestrator.

#### Implementation of

```ts
MultiAgentBase.id
```

---

### config

```ts
readonly config: Required<SwarmConfig>;
```

Defined in: [src/multiagent/swarm.ts:99](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/multiagent/swarm.ts#L99)

---

### hooks

```ts
readonly hooks: HookRegistry;
```

Defined in: [src/multiagent/swarm.ts:100](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/multiagent/swarm.ts#L100)

## Methods

### initialize()

```ts
initialize(): Promise<void>;
```

Defined in: [src/multiagent/swarm.ts:131](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/multiagent/swarm.ts#L131)

Initialize the swarm. Invokes the MultiAgentInitializedEvent callback. Called automatically on first invocation.

#### Returns

`Promise`<`void`\>

---

### invoke()

```ts
invoke(input): Promise<MultiAgentResult>;
```

Defined in: [src/multiagent/swarm.ts:143](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/multiagent/swarm.ts#L143)

Invoke swarm and return final result (consumes stream).

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `input` | `InvokeArgs` | The input to pass to the start agent |

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

Defined in: [src/multiagent/swarm.ts:159](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/multiagent/swarm.ts#L159)

Stream swarm execution, yielding events as agents execute. Invokes hook callbacks for each event before yielding.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `input` | `InvokeArgs` | The input to pass to the start agent |

#### Returns

`AsyncGenerator`<`MultiAgentStreamEvent`, `MultiAgentResult`, `undefined`\>

Async generator yielding streaming events and returning a MultiAgentResult

#### Implementation of

```ts
MultiAgentBase.stream
```