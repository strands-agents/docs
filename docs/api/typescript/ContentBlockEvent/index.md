Defined in: [src/hooks/events.ts:323](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L323)

Event triggered when a content block completes during model inference. Wraps completed content blocks (TextBlock, ToolUseBlock, ReasoningBlock) from model streaming. This is intentionally separate from [ModelStreamUpdateEvent](/docs/api/typescript/ModelStreamUpdateEvent/index.md). The model’s `streamAggregated()` yields two kinds of output: [ModelStreamEvent](/docs/api/typescript/ModelStreamEvent/index.md) (transient streaming deltas — partial data arriving while the model generates) and [ContentBlock](/docs/api/typescript/ContentBlock/index.md) (fully assembled results after all deltas accumulate). These represent different granularities with different semantics, so they are wrapped in distinct event classes rather than combined into a single event.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ContentBlockEvent(data): ContentBlockEvent;
```

Defined in: [src/hooks/events.ts:328](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L328)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [`LocalAgent`](/docs/api/typescript/LocalAgent/index.md); `contentBlock`: [`ContentBlock`](/docs/api/typescript/ContentBlock/index.md); } |
| `data.agent` | [`LocalAgent`](/docs/api/typescript/LocalAgent/index.md) |
| `data.contentBlock` | [`ContentBlock`](/docs/api/typescript/ContentBlock/index.md) |

#### Returns

`ContentBlockEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "contentBlockEvent";
```

Defined in: [src/hooks/events.ts:324](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L324)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:325](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L325)

---

### contentBlock

```ts
readonly contentBlock: ContentBlock;
```

Defined in: [src/hooks/events.ts:326](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L326)