Defined in: [src/hooks/events.ts:649](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L649)

Event triggered for each streaming progress event from a tool during execution. Wraps a [ToolStreamEvent](/docs/api/typescript/ToolStreamEvent/index.md) with agent context, keeping the tool authoring interface unchanged — tools construct `ToolStreamEvent` without knowledge of agents or hooks, and the agent layer wraps them at the boundary.

Consistent with [ModelStreamUpdateEvent](/docs/api/typescript/ModelStreamUpdateEvent/index.md) which wraps model streaming events the same way.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ToolStreamUpdateEvent(data): ToolStreamUpdateEvent;
```

Defined in: [src/hooks/events.ts:655](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L655)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `event`: [`ToolStreamEvent`](/docs/api/typescript/ToolStreamEvent/index.md); `invocationState`: [`InvocationState`](/docs/api/typescript/InvocationState/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.event` | [`ToolStreamEvent`](/docs/api/typescript/ToolStreamEvent/index.md) |
| `data.invocationState` | [`InvocationState`](/docs/api/typescript/InvocationState/index.md) |

#### Returns

`ToolStreamUpdateEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "toolStreamUpdateEvent";
```

Defined in: [src/hooks/events.ts:650](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L650)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:651](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L651)

---

### event

```ts
readonly event: ToolStreamEvent;
```

Defined in: [src/hooks/events.ts:652](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L652)

---

### invocationState

```ts
readonly invocationState: InvocationState;
```

Defined in: [src/hooks/events.ts:653](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L653)

## Methods

### toJSON()

```ts
toJSON(): Pick<ToolStreamUpdateEvent, "type" | "event">;
```

Defined in: [src/hooks/events.ts:666](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L666)

Serializes for wire transport, excluding the agent reference and invocationState. Called automatically by JSON.stringify().

#### Returns

`Pick`<`ToolStreamUpdateEvent`, `"type"` | `"event"`\>