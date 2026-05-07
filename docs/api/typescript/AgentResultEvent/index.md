Defined in: [src/hooks/events.ts:675](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L675)

Event triggered as the final event in the agent stream. Wraps the agent result containing the stop reason and last message.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AgentResultEvent(data): AgentResultEvent;
```

Defined in: [src/hooks/events.ts:681](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L681)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `result`: [`AgentResult`](/docs/api/typescript/AgentResult/index.md); `invocationState`: [`InvocationState`](/docs/api/typescript/InvocationState/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.result` | [`AgentResult`](/docs/api/typescript/AgentResult/index.md) |
| `data.invocationState` | [`InvocationState`](/docs/api/typescript/InvocationState/index.md) |

#### Returns

`AgentResultEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "agentResultEvent";
```

Defined in: [src/hooks/events.ts:676](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L676)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:677](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L677)

---

### result

```ts
readonly result: AgentResult;
```

Defined in: [src/hooks/events.ts:678](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L678)

---

### invocationState

```ts
readonly invocationState: InvocationState;
```

Defined in: [src/hooks/events.ts:679](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L679)

## Methods

### toJSON()

```ts
toJSON(): Pick<AgentResultEvent, "type" | "result">;
```

Defined in: [src/hooks/events.ts:692](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L692)

Serializes for wire transport, excluding the agent reference and invocationState. Called automatically by JSON.stringify().

#### Returns

`Pick`<`AgentResultEvent`, `"type"` | `"result"`\>