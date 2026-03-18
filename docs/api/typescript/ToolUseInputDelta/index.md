Defined in: [src/models/streaming.ts:430](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/models/streaming.ts#L430)

Tool use input delta within a content block. Represents incremental tool input being generated.

## Properties

### type

```ts
type: "toolUseInputDelta";
```

Defined in: [src/models/streaming.ts:434](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/models/streaming.ts#L434)

Discriminator for tool use input delta.

---

### input

```ts
input: string;
```

Defined in: [src/models/streaming.ts:439](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/models/streaming.ts#L439)

Partial JSON string representing the tool input.