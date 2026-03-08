Defined in: [src/models/streaming.ts:349](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/streaming.ts#L349)

Tool use input delta within a content block. Represents incremental tool input being generated.

## Properties

### type

```ts
type: "toolUseInputDelta";
```

Defined in: [src/models/streaming.ts:353](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/streaming.ts#L353)

Discriminator for tool use input delta.

---

### input

```ts
input: string;
```

Defined in: [src/models/streaming.ts:358](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/streaming.ts#L358)

Partial JSON string representing the tool input.