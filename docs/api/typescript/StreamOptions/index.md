Defined in: [src/models/model.ts:85](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/model.ts#L85)

Options interface for configuring streaming model invocation.

## Properties

### systemPrompt?

```ts
optional systemPrompt: SystemPrompt;
```

Defined in: [src/models/model.ts:90](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/model.ts#L90)

System prompt to guide the model’s behavior. Can be a simple string or an array of content blocks for advanced caching.

---

### toolSpecs?

```ts
optional toolSpecs: ToolSpec[];
```

Defined in: [src/models/model.ts:95](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/model.ts#L95)

Array of tool specifications that the model can use.

---

### toolChoice?

```ts
optional toolChoice: ToolChoice;
```

Defined in: [src/models/model.ts:100](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/model.ts#L100)

Controls how the model selects tools to use.