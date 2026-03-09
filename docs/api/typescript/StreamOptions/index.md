Defined in: [src/models/model.ts:83](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/models/model.ts#L83)

Options interface for configuring streaming model invocation.

## Properties

### systemPrompt?

```ts
optional systemPrompt: SystemPrompt;
```

Defined in: [src/models/model.ts:88](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/models/model.ts#L88)

System prompt to guide the model’s behavior. Can be a simple string or an array of content blocks for advanced caching.

---

### toolSpecs?

```ts
optional toolSpecs: ToolSpec[];
```

Defined in: [src/models/model.ts:93](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/models/model.ts#L93)

Array of tool specifications that the model can use.

---

### toolChoice?

```ts
optional toolChoice: ToolChoice;
```

Defined in: [src/models/model.ts:98](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/models/model.ts#L98)

Controls how the model selects tools to use.