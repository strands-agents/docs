Defined in: [src/models/model.ts:67](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/models/model.ts#L67)

Base configuration interface for all model providers.

This interface defines the common configuration properties that all model providers should support. Provider-specific configurations should extend this interface.

## Extended by

-   [`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md)

## Properties

### modelId?

```ts
optional modelId?: string;
```

Defined in: [src/models/model.ts:72](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/models/model.ts#L72)

The model identifier. This typically specifies which model to use from the provider’s catalog.

---

### maxTokens?

```ts
optional maxTokens?: number;
```

Defined in: [src/models/model.ts:79](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/models/model.ts#L79)

Maximum number of tokens to generate in the response.

#### See

Provider-specific documentation for exact behavior

---

### temperature?

```ts
optional temperature?: number;
```

Defined in: [src/models/model.ts:86](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/models/model.ts#L86)

Controls randomness in generation.

#### See

Provider-specific documentation for valid range

---

### topP?

```ts
optional topP?: number;
```

Defined in: [src/models/model.ts:93](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/models/model.ts#L93)

Controls diversity via nucleus sampling.

#### See

Provider-specific documentation for details