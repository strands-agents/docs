Defined in: [src/models/streaming.ts:430](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/streaming.ts#L430)

Tool use input delta within a content block. Represents incremental tool input being generated.

## Properties

### type

```ts
type: "toolUseInputDelta";
```

Defined in: [src/models/streaming.ts:434](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/streaming.ts#L434)

Discriminator for tool use input delta.

---

### input

```ts
input: string;
```

Defined in: [src/models/streaming.ts:439](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/streaming.ts#L439)

Partial JSON string representing the tool input.