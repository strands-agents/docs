Defined in: [src/models/model.ts:98](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/model.ts#L98)

Options interface for configuring streaming model invocation.

## Properties

### systemPrompt?

```ts
optional systemPrompt: SystemPrompt;
```

Defined in: [src/models/model.ts:103](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/model.ts#L103)

System prompt to guide the model’s behavior. Can be a simple string or an array of content blocks for advanced caching.

---

### toolSpecs?

```ts
optional toolSpecs: ToolSpec[];
```

Defined in: [src/models/model.ts:108](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/model.ts#L108)

Array of tool specifications that the model can use.

---

### toolChoice?

```ts
optional toolChoice: ToolChoice;
```

Defined in: [src/models/model.ts:113](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/model.ts#L113)

Controls how the model selects tools to use.