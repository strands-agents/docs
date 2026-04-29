Defined in: [src/models/model.ts:137](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/models/model.ts#L137)

Options for counting tokens in a set of messages.

## Properties

### systemPrompt?

```ts
optional systemPrompt?: SystemPrompt;
```

Defined in: [src/models/model.ts:142](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/models/model.ts#L142)

System prompt to guide the model’s behavior. Can be a simple string or an array of content blocks for advanced caching.

---

### toolSpecs?

```ts
optional toolSpecs?: ToolSpec[];
```

Defined in: [src/models/model.ts:147](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/models/model.ts#L147)

Array of tool specifications to include in the count.