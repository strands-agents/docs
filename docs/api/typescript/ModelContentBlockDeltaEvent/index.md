Defined in: [src/models/streaming.ts:138](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/streaming.ts#L138)

Event emitted when there is new content in a content block.

## Implements

-   [<code dir="auto">ModelContentBlockDeltaEventData</code>](/docs/api/typescript/ModelContentBlockDeltaEventData/index.md)

## Constructors

### Constructor

```ts
new ModelContentBlockDeltaEvent(data): ModelContentBlockDeltaEvent;
```

Defined in: [src/models/streaming.ts:154](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/streaming.ts#L154)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [<code dir="auto">ModelContentBlockDeltaEventData</code>](/docs/api/typescript/ModelContentBlockDeltaEventData/index.md) |

#### Returns

`ModelContentBlockDeltaEvent`

## Properties

### type

```ts
readonly type: "modelContentBlockDeltaEvent";
```

Defined in: [src/models/streaming.ts:142](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/streaming.ts#L142)

Discriminator for content block delta events.

#### Implementation of

[<code dir="auto">ModelContentBlockDeltaEventData</code>](/docs/api/typescript/ModelContentBlockDeltaEventData/index.md).[<code dir="auto">type</code>](/docs/api/typescript/ModelContentBlockDeltaEventData/index.md#type)

---

### contentBlockIndex?

```ts
readonly optional contentBlockIndex?: number;
```

Defined in: [src/models/streaming.ts:147](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/streaming.ts#L147)

Index of the content block being updated.

---

### delta

```ts
readonly delta: ContentBlockDelta;
```

Defined in: [src/models/streaming.ts:152](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/streaming.ts#L152)

The incremental content update.

#### Implementation of

[<code dir="auto">ModelContentBlockDeltaEventData</code>](/docs/api/typescript/ModelContentBlockDeltaEventData/index.md).[<code dir="auto">delta</code>](/docs/api/typescript/ModelContentBlockDeltaEventData/index.md#delta)