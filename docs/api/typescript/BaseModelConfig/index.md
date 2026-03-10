Defined in: [src/models/model.ts:51](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/model.ts#L51)

Base configuration interface for all model providers.

This interface defines the common configuration properties that all model providers should support. Provider-specific configurations should extend this interface.

## Extended by

-   [`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md)

## Properties

### modelId?

```ts
optional modelId: string;
```

Defined in: [src/models/model.ts:56](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/model.ts#L56)

The model identifier. This typically specifies which model to use from the provider’s catalog.

---

### maxTokens?

```ts
optional maxTokens: number;
```

Defined in: [src/models/model.ts:63](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/model.ts#L63)

Maximum number of tokens to generate in the response.

#### See

Provider-specific documentation for exact behavior

---

### temperature?

```ts
optional temperature: number;
```

Defined in: [src/models/model.ts:70](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/model.ts#L70)

Controls randomness in generation.

#### See

Provider-specific documentation for valid range

---

### topP?

```ts
optional topP: number;
```

Defined in: [src/models/model.ts:77](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/model.ts#L77)

Controls diversity via nucleus sampling.

#### See

Provider-specific documentation for details