Defined in: [src/hooks/events.ts:532](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L532)

Event triggered for each streaming event from the model. Wraps a [ModelStreamEvent](/docs/api/typescript/ModelStreamEvent/index.md) (transient streaming delta) during model inference. Completed content blocks are handled separately by [ContentBlockEvent](/docs/api/typescript/ContentBlockEvent/index.md) because they represent different granularities: partial deltas vs fully assembled results.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ModelStreamUpdateEvent(data): ModelStreamUpdateEvent;
```

Defined in: [src/hooks/events.ts:538](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L538)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `event`: [`ModelStreamEvent`](/docs/api/typescript/ModelStreamEvent/index.md); `invocationState`: [`InvocationState`](/docs/api/typescript/InvocationState/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.event` | [`ModelStreamEvent`](/docs/api/typescript/ModelStreamEvent/index.md) |
| `data.invocationState` | [`InvocationState`](/docs/api/typescript/InvocationState/index.md) |

#### Returns

`ModelStreamUpdateEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "modelStreamUpdateEvent";
```

Defined in: [src/hooks/events.ts:533](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L533)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:534](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L534)

---

### event

```ts
readonly event: ModelStreamEvent;
```

Defined in: [src/hooks/events.ts:535](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L535)

---

### invocationState

```ts
readonly invocationState: InvocationState;
```

Defined in: [src/hooks/events.ts:536](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L536)

## Methods

### toJSON()

```ts
toJSON(): Pick<ModelStreamUpdateEvent, "type" | "event">;
```

Defined in: [src/hooks/events.ts:549](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L549)

Serializes for wire transport, excluding the agent reference and invocationState. Called automatically by JSON.stringify().

#### Returns

`Pick`<`ModelStreamUpdateEvent`, `"type"` | `"event"`\>