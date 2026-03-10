Defined in: [src/types/messages.ts:184](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L184)

Data for a tool use block.

## Properties

### name

```ts
name: string;
```

Defined in: [src/types/messages.ts:188](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L188)

The name of the tool to execute.

---

### toolUseId

```ts
toolUseId: string;
```

Defined in: [src/types/messages.ts:193](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L193)

Unique identifier for this tool use instance.

---

### input

```ts
input: JSONValue;
```

Defined in: [src/types/messages.ts:199](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L199)

The input parameters for the tool. This can be any JSON-serializable value.

---

### reasoningSignature?

```ts
optional reasoningSignature: string;
```

Defined in: [src/types/messages.ts:205](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L205)

Reasoning signature from thinking models (e.g., Gemini). Must be preserved and sent back to the model for multi-turn tool use.