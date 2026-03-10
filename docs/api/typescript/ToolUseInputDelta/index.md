Defined in: [src/models/streaming.ts:349](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L349)

Tool use input delta within a content block. Represents incremental tool input being generated.

## Properties

### type

```ts
type: "toolUseInputDelta";
```

Defined in: [src/models/streaming.ts:353](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L353)

Discriminator for tool use input delta.

---

### input

```ts
input: string;
```

Defined in: [src/models/streaming.ts:358](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L358)

Partial JSON string representing the tool input.