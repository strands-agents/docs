Defined in: [src/types/messages.ts:215](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/messages.ts#L215)

Data for a tool use block.

## Properties

### name

```ts
name: string;
```

Defined in: [src/types/messages.ts:219](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/messages.ts#L219)

The name of the tool to execute.

---

### toolUseId

```ts
toolUseId: string;
```

Defined in: [src/types/messages.ts:224](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/messages.ts#L224)

Unique identifier for this tool use instance.

---

### input

```ts
input: JSONValue;
```

Defined in: [src/types/messages.ts:230](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/messages.ts#L230)

The input parameters for the tool. This can be any JSON-serializable value.

---

### reasoningSignature?

```ts
optional reasoningSignature?: string;
```

Defined in: [src/types/messages.ts:236](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/messages.ts#L236)

Reasoning signature from thinking models (e.g., Gemini). Must be preserved and sent back to the model for multi-turn tool use.