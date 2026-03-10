Defined in: [src/models/streaming.ts:333](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L333)

Text delta within a content block. Represents incremental text content from the model.

## Properties

### type

```ts
type: "textDelta";
```

Defined in: [src/models/streaming.ts:337](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L337)

Discriminator for text delta.

---

### text

```ts
text: string;
```

Defined in: [src/models/streaming.ts:342](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L342)

Incremental text content.