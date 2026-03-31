Defined in: [src/models/streaming.ts:430](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/streaming.ts#L430)

Tool use input delta within a content block. Represents incremental tool input being generated.

## Properties

### type

```ts
type: "toolUseInputDelta";
```

Defined in: [src/models/streaming.ts:434](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/streaming.ts#L434)

Discriminator for tool use input delta.

---

### input

```ts
input: string;
```

Defined in: [src/models/streaming.ts:439](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/streaming.ts#L439)

Partial JSON string representing the tool input.