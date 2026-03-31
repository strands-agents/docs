Defined in: [src/hooks/events.ts:419](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L419)

Event triggered when a content block completes during model inference. Wraps completed content blocks (TextBlock, ToolUseBlock, ReasoningBlock) from model streaming. This is intentionally separate from [ModelStreamUpdateEvent](/docs/api/typescript/ModelStreamUpdateEvent/index.md). The model’s `streamAggregated()` yields two kinds of output: [ModelStreamEvent](/docs/api/typescript/ModelStreamEvent/index.md) (transient streaming deltas — partial data arriving while the model generates) and [ContentBlock](/docs/api/typescript/ContentBlock/index.md) (fully assembled results after all deltas accumulate). These represent different granularities with different semantics, so they are wrapped in distinct event classes rather than combined into a single event.

## Extends

-   [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ContentBlockEvent(data): ContentBlockEvent;
```

Defined in: [src/hooks/events.ts:424](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L424)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `contentBlock`: [<code dir="auto">ContentBlock</code>](/docs/api/typescript/ContentBlock/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.contentBlock` | [<code dir="auto">ContentBlock</code>](/docs/api/typescript/ContentBlock/index.md) |

#### Returns

`ContentBlockEvent`

#### Overrides

[<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "contentBlockEvent";
```

Defined in: [src/hooks/events.ts:420](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L420)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:421](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L421)

---

### contentBlock

```ts
readonly contentBlock: ContentBlock;
```

Defined in: [src/hooks/events.ts:422](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L422)

## Methods

### toJSON()

```ts
toJSON(): Pick<ContentBlockEvent, "type" | "contentBlock">;
```

Defined in: [src/hooks/events.ts:434](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L434)

Serializes for wire transport, excluding the agent reference. Called automatically by JSON.stringify().

#### Returns

`Pick`<`ContentBlockEvent`, `"type"` | `"contentBlock"`\>