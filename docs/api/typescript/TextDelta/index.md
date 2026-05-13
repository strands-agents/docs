Defined in: [src/models/streaming.ts:414](https://github.com/strands-agents/sdk-typescript/blob/f72cbc85fd52a15f9ee0400e717de2ab11731169/strands-ts/src/models/streaming.ts#L414)

Text delta within a content block. Represents incremental text content from the model.

## Properties

### type

```ts
type: "textDelta";
```

Defined in: [src/models/streaming.ts:418](https://github.com/strands-agents/sdk-typescript/blob/f72cbc85fd52a15f9ee0400e717de2ab11731169/strands-ts/src/models/streaming.ts#L418)

Discriminator for text delta.

---

### text

```ts
text: string;
```

Defined in: [src/models/streaming.ts:423](https://github.com/strands-agents/sdk-typescript/blob/f72cbc85fd52a15f9ee0400e717de2ab11731169/strands-ts/src/models/streaming.ts#L423)

Incremental text content.