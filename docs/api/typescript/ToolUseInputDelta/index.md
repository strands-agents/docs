Defined in: [src/models/streaming.ts:430](https://github.com/strands-agents/sdk-typescript/blob/6a95bb5c4ffe0bb4e9969eefa8ccc38ba19193b6/strands-ts/src/models/streaming.ts#L430)

Tool use input delta within a content block. Represents incremental tool input being generated.

## Properties

### type

```ts
type: "toolUseInputDelta";
```

Defined in: [src/models/streaming.ts:434](https://github.com/strands-agents/sdk-typescript/blob/6a95bb5c4ffe0bb4e9969eefa8ccc38ba19193b6/strands-ts/src/models/streaming.ts#L434)

Discriminator for tool use input delta.

---

### input

```ts
input: string;
```

Defined in: [src/models/streaming.ts:439](https://github.com/strands-agents/sdk-typescript/blob/6a95bb5c4ffe0bb4e9969eefa8ccc38ba19193b6/strands-ts/src/models/streaming.ts#L439)

Partial JSON string representing the tool input.