Defined in: [src/hooks/events.ts:498](https://github.com/strands-agents/sdk-typescript/blob/714aa5fa654cfa8ea39cf6fea0813dd27b2f39e9/strands-ts/src/hooks/events.ts#L498)

Event triggered when a content block completes during model inference. Wraps completed content blocks (TextBlock, ToolUseBlock, ReasoningBlock) from model streaming. This is intentionally separate from [ModelStreamUpdateEvent](/docs/api/typescript/ModelStreamUpdateEvent/index.md). The model’s `streamAggregated()` yields two kinds of output: [ModelStreamEvent](/docs/api/typescript/ModelStreamEvent/index.md) (transient streaming deltas — partial data arriving while the model generates) and [ContentBlock](/docs/api/typescript/ContentBlock/index.md) (fully assembled results after all deltas accumulate). These represent different granularities with different semantics, so they are wrapped in distinct event classes rather than combined into a single event.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ContentBlockEvent(data): ContentBlockEvent;
```

Defined in: [src/hooks/events.ts:504](https://github.com/strands-agents/sdk-typescript/blob/714aa5fa654cfa8ea39cf6fea0813dd27b2f39e9/strands-ts/src/hooks/events.ts#L504)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `contentBlock`: [`ContentBlock`](/docs/api/typescript/ContentBlock/index.md); `invocationState`: [`InvocationState`](/docs/api/typescript/InvocationState/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.contentBlock` | [`ContentBlock`](/docs/api/typescript/ContentBlock/index.md) |
| `data.invocationState` | [`InvocationState`](/docs/api/typescript/InvocationState/index.md) |

#### Returns

`ContentBlockEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "contentBlockEvent";
```

Defined in: [src/hooks/events.ts:499](https://github.com/strands-agents/sdk-typescript/blob/714aa5fa654cfa8ea39cf6fea0813dd27b2f39e9/strands-ts/src/hooks/events.ts#L499)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:500](https://github.com/strands-agents/sdk-typescript/blob/714aa5fa654cfa8ea39cf6fea0813dd27b2f39e9/strands-ts/src/hooks/events.ts#L500)

---

### contentBlock

```ts
readonly contentBlock: ContentBlock;
```

Defined in: [src/hooks/events.ts:501](https://github.com/strands-agents/sdk-typescript/blob/714aa5fa654cfa8ea39cf6fea0813dd27b2f39e9/strands-ts/src/hooks/events.ts#L501)

---

### invocationState

```ts
readonly invocationState: InvocationState;
```

Defined in: [src/hooks/events.ts:502](https://github.com/strands-agents/sdk-typescript/blob/714aa5fa654cfa8ea39cf6fea0813dd27b2f39e9/strands-ts/src/hooks/events.ts#L502)

## Methods

### toJSON()

```ts
toJSON(): Pick<ContentBlockEvent, "type" | "contentBlock">;
```

Defined in: [src/hooks/events.ts:515](https://github.com/strands-agents/sdk-typescript/blob/714aa5fa654cfa8ea39cf6fea0813dd27b2f39e9/strands-ts/src/hooks/events.ts#L515)

Serializes for wire transport, excluding the agent reference and invocationState. Called automatically by JSON.stringify().

#### Returns

`Pick`<`ContentBlockEvent`, `"type"` | `"contentBlock"`\>