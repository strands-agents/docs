Defined in: [src/models/streaming.ts:138](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/streaming.ts#L138)

Event emitted when there is new content in a content block.

## Implements

-   [`ModelContentBlockDeltaEventData`](/docs/api/typescript/ModelContentBlockDeltaEventData/index.md)

## Properties

### type

```ts
readonly type: "modelContentBlockDeltaEvent";
```

Defined in: [src/models/streaming.ts:142](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/streaming.ts#L142)

Discriminator for content block delta events.

#### Implementation of

```ts
ModelContentBlockDeltaEventData.type
```

---

### contentBlockIndex?

```ts
readonly optional contentBlockIndex: number;
```

Defined in: [src/models/streaming.ts:147](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/streaming.ts#L147)

Index of the content block being updated.

---

### delta

```ts
readonly delta: ContentBlockDelta;
```

Defined in: [src/models/streaming.ts:152](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/streaming.ts#L152)

The incremental content update.

#### Implementation of

```ts
ModelContentBlockDeltaEventData.delta
```