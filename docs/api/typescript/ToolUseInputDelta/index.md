Defined in: [src/models/streaming.ts:349](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/models/streaming.ts#L349)

Tool use input delta within a content block. Represents incremental tool input being generated.

## Properties

### type

```ts
type: "toolUseInputDelta";
```

Defined in: [src/models/streaming.ts:353](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/models/streaming.ts#L353)

Discriminator for tool use input delta.

---

### input

```ts
input: string;
```

Defined in: [src/models/streaming.ts:358](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/models/streaming.ts#L358)

Partial JSON string representing the tool input.