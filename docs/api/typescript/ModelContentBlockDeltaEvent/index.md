Defined in: [src/models/streaming.ts:136](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/models/streaming.ts#L136)

Event emitted when there is new content in a content block.

## Implements

-   [`ModelContentBlockDeltaEventData`](/docs/api/typescript/ModelContentBlockDeltaEventData/index.md)

## Properties

### type

```ts
readonly type: "modelContentBlockDeltaEvent";
```

Defined in: [src/models/streaming.ts:140](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/models/streaming.ts#L140)

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

Defined in: [src/models/streaming.ts:145](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/models/streaming.ts#L145)

Index of the content block being updated.

---

### delta

```ts
readonly delta: ContentBlockDelta;
```

Defined in: [src/models/streaming.ts:150](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/models/streaming.ts#L150)

The incremental content update.

#### Implementation of

```ts
ModelContentBlockDeltaEventData.delta
```