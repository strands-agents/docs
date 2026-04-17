Defined in: [src/models/model.ts:100](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/model.ts#L100)

Options interface for configuring streaming model invocation.

## Properties

### systemPrompt?

```ts
optional systemPrompt?: SystemPrompt;
```

Defined in: [src/models/model.ts:105](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/model.ts#L105)

System prompt to guide the model’s behavior. Can be a simple string or an array of content blocks for advanced caching.

---

### toolSpecs?

```ts
optional toolSpecs?: ToolSpec[];
```

Defined in: [src/models/model.ts:110](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/model.ts#L110)

Array of tool specifications that the model can use.

---

### toolChoice?

```ts
optional toolChoice?: ToolChoice;
```

Defined in: [src/models/model.ts:115](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/model.ts#L115)

Controls how the model selects tools to use.