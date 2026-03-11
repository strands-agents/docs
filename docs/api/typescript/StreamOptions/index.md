Defined in: [src/models/model.ts:85](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/model.ts#L85)

Options interface for configuring streaming model invocation.

## Properties

### systemPrompt?

```ts
optional systemPrompt: SystemPrompt;
```

Defined in: [src/models/model.ts:90](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/model.ts#L90)

System prompt to guide the model’s behavior. Can be a simple string or an array of content blocks for advanced caching.

---

### toolSpecs?

```ts
optional toolSpecs: ToolSpec[];
```

Defined in: [src/models/model.ts:95](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/model.ts#L95)

Array of tool specifications that the model can use.

---

### toolChoice?

```ts
optional toolChoice: ToolChoice;
```

Defined in: [src/models/model.ts:100](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/model.ts#L100)

Controls how the model selects tools to use.