Defined in: [src/models/model.ts:68](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/model.ts#L68)

Base configuration interface for all model providers.

This interface defines the common configuration properties that all model providers should support. Provider-specific configurations should extend this interface.

## Extended by

-   [`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md)

## Properties

### modelId?

```ts
optional modelId?: string;
```

Defined in: [src/models/model.ts:73](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/model.ts#L73)

The model identifier. This typically specifies which model to use from the provider’s catalog.

---

### maxTokens?

```ts
optional maxTokens?: number;
```

Defined in: [src/models/model.ts:80](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/model.ts#L80)

Maximum number of tokens to generate in the response.

#### See

Provider-specific documentation for exact behavior

---

### temperature?

```ts
optional temperature?: number;
```

Defined in: [src/models/model.ts:87](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/model.ts#L87)

Controls randomness in generation.

#### See

Provider-specific documentation for valid range

---

### topP?

```ts
optional topP?: number;
```

Defined in: [src/models/model.ts:94](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/model.ts#L94)

Controls diversity via nucleus sampling.

#### See

Provider-specific documentation for details