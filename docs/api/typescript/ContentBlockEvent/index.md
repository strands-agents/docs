Defined in: [src/hooks/events.ts:414](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L414)

Event triggered when a content block completes during model inference. Wraps completed content blocks (TextBlock, ToolUseBlock, ReasoningBlock) from model streaming. This is intentionally separate from [ModelStreamUpdateEvent](/docs/api/typescript/ModelStreamUpdateEvent/index.md). The model’s `streamAggregated()` yields two kinds of output: [ModelStreamEvent](/docs/api/typescript/ModelStreamEvent/index.md) (transient streaming deltas — partial data arriving while the model generates) and [ContentBlock](/docs/api/typescript/ContentBlock/index.md) (fully assembled results after all deltas accumulate). These represent different granularities with different semantics, so they are wrapped in distinct event classes rather than combined into a single event.

## Extends

-   [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ContentBlockEvent(data): ContentBlockEvent;
```

Defined in: [src/hooks/events.ts:419](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L419)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md); `contentBlock`: [<code dir="auto">ContentBlock</code>](/docs/api/typescript/ContentBlock/index.md); } |
| `data.agent` | [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md) |
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

Defined in: [src/hooks/events.ts:415](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L415)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:416](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L416)

---

### contentBlock

```ts
readonly contentBlock: ContentBlock;
```

Defined in: [src/hooks/events.ts:417](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L417)

## Methods

### toJSON()

```ts
toJSON(): Pick<ContentBlockEvent, "type" | "contentBlock">;
```

Defined in: [src/hooks/events.ts:429](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L429)

Serializes for wire transport, excluding the agent reference. Called automatically by JSON.stringify().

#### Returns

`Pick`<`ContentBlockEvent`, `"type"` | `"contentBlock"`\>