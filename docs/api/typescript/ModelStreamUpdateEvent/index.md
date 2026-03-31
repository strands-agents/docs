Defined in: [src/hooks/events.ts:389](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L389)

Event triggered for each streaming event from the model. Wraps a [ModelStreamEvent](/docs/api/typescript/ModelStreamEvent/index.md) (transient streaming delta) during model inference. Completed content blocks are handled separately by [ContentBlockEvent](/docs/api/typescript/ContentBlockEvent/index.md) because they represent different granularities: partial deltas vs fully assembled results.

## Extends

-   [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ModelStreamUpdateEvent(data): ModelStreamUpdateEvent;
```

Defined in: [src/hooks/events.ts:394](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L394)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `event`: [<code dir="auto">ModelStreamEvent</code>](/docs/api/typescript/ModelStreamEvent/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.event` | [<code dir="auto">ModelStreamEvent</code>](/docs/api/typescript/ModelStreamEvent/index.md) |

#### Returns

`ModelStreamUpdateEvent`

#### Overrides

[<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "modelStreamUpdateEvent";
```

Defined in: [src/hooks/events.ts:390](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L390)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:391](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L391)

---

### event

```ts
readonly event: ModelStreamEvent;
```

Defined in: [src/hooks/events.ts:392](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L392)

## Methods

### toJSON()

```ts
toJSON(): Pick<ModelStreamUpdateEvent, "type" | "event">;
```

Defined in: [src/hooks/events.ts:404](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L404)

Serializes for wire transport, excluding the agent reference. Called automatically by JSON.stringify().

#### Returns

`Pick`<`ModelStreamUpdateEvent`, `"type"` | `"event"`\>