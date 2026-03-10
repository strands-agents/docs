Defined in: [src/models/streaming.ts:298](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L298)

Information about a tool use that is starting.

## Properties

### type

```ts
type: "toolUseStart";
```

Defined in: [src/models/streaming.ts:302](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L302)

Discriminator for tool use start.

---

### name

```ts
name: string;
```

Defined in: [src/models/streaming.ts:307](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L307)

The name of the tool being used.

---

### toolUseId

```ts
toolUseId: string;
```

Defined in: [src/models/streaming.ts:312](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L312)

Unique identifier for this tool use.

---

### reasoningSignature?

```ts
optional reasoningSignature: string;
```

Defined in: [src/models/streaming.ts:318](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L318)

Reasoning signature from thinking models (e.g., Gemini). Must be preserved and sent back to the model for multi-turn tool use.