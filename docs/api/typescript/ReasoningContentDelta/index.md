Defined in: [src/models/streaming.ts:365](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L365)

Reasoning content delta within a content block. Represents incremental reasoning or thinking content.

## Properties

### type

```ts
type: "reasoningContentDelta";
```

Defined in: [src/models/streaming.ts:369](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L369)

Discriminator for reasoning delta.

---

### text?

```ts
optional text: string;
```

Defined in: [src/models/streaming.ts:374](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L374)

Incremental reasoning text.

---

### signature?

```ts
optional signature: string;
```

Defined in: [src/models/streaming.ts:379](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L379)

Incremental signature data.

---

### redactedContent?

```ts
optional redactedContent: Uint8Array;
```

Defined in: [src/models/streaming.ts:384](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L384)

Incremental redacted content data.