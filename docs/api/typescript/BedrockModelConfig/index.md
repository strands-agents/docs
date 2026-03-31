Defined in: [src/models/bedrock.ts:194](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L194)

Configuration interface for AWS Bedrock model provider.

Extends BaseModelConfig with Bedrock-specific configuration options for model parameters, caching, and additional request/response fields.

## Example

```typescript
const config: BedrockModelConfig = {
  modelId: 'global.anthropic.claude-sonnet-4-6',
  maxTokens: 1024,
  temperature: 0.7,
  cacheConfig: { strategy: 'auto' }
}
```

## Extends

-   [<code dir="auto">BaseModelConfig</code>](/docs/api/typescript/BaseModelConfig/index.md)

## Extended by

-   [<code dir="auto">BedrockModelOptions</code>](/docs/api/typescript/BedrockModelOptions/index.md)

## Properties

### maxTokens?

```ts
optional maxTokens?: number;
```

Defined in: [src/models/bedrock.ts:200](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L200)

Maximum number of tokens to generate in the response.

#### See

[https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_InferenceConfiguration.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InferenceConfiguration.html)

#### Overrides

[<code dir="auto">BaseModelConfig</code>](/docs/api/typescript/BaseModelConfig/index.md).[<code dir="auto">maxTokens</code>](/docs/api/typescript/BaseModelConfig/index.md#maxtokens)

---

### temperature?

```ts
optional temperature?: number;
```

Defined in: [src/models/bedrock.ts:207](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L207)

Controls randomness in generation.

#### See

[https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_InferenceConfiguration.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InferenceConfiguration.html)

#### Overrides

[<code dir="auto">BaseModelConfig</code>](/docs/api/typescript/BaseModelConfig/index.md).[<code dir="auto">temperature</code>](/docs/api/typescript/BaseModelConfig/index.md#temperature)

---

### topP?

```ts
optional topP?: number;
```

Defined in: [src/models/bedrock.ts:214](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L214)

Controls diversity via nucleus sampling.

#### See

[https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_InferenceConfiguration.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InferenceConfiguration.html)

#### Overrides

[<code dir="auto">BaseModelConfig</code>](/docs/api/typescript/BaseModelConfig/index.md).[<code dir="auto">topP</code>](/docs/api/typescript/BaseModelConfig/index.md#topp)

---

### stopSequences?

```ts
optional stopSequences?: string[];
```

Defined in: [src/models/bedrock.ts:219](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L219)

Array of sequences that will stop generation when encountered.

---

### cacheConfig?

```ts
optional cacheConfig?: CacheConfig;
```

Defined in: [src/models/bedrock.ts:226](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L226)

Configuration for prompt caching.

#### See

[https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)

---

### additionalRequestFields?

```ts
optional additionalRequestFields?: JSONValue;
```

Defined in: [src/models/bedrock.ts:231](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L231)

Additional fields to include in the Bedrock request.

---

### additionalResponseFieldPaths?

```ts
optional additionalResponseFieldPaths?: string[];
```

Defined in: [src/models/bedrock.ts:236](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L236)

Additional response field paths to extract from the Bedrock response.

---

### additionalArgs?

```ts
optional additionalArgs?: JSONValue;
```

Defined in: [src/models/bedrock.ts:242](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L242)

Additional arguments to pass through to the Bedrock Converse API.

#### See

[https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/command/ConverseStreamCommand/](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/command/ConverseStreamCommand/)

---

### stream?

```ts
optional stream?: boolean;
```

Defined in: [src/models/bedrock.ts:252](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L252)

Whether or not to stream responses from the model.

This will use the ConverseStream API instead of the Converse API.

#### See

-   [https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_Converse.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html)
-   [https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_ConverseStream.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ConverseStream.html)

---

### includeToolResultStatus?

```ts
optional includeToolResultStatus?: boolean | "auto";
```

Defined in: [src/models/bedrock.ts:260](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L260)

Flag to include status field in tool results.

-   `true`: Always include status field
-   `false`: Never include status field
-   `'auto'`: Automatically determine based on model ID (default)

---

### guardrailConfig?

```ts
optional guardrailConfig?: BedrockGuardrailConfig;
```

Defined in: [src/models/bedrock.ts:266](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L266)

Guardrail configuration for content filtering and safety controls.

#### See

[https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html)

---

### modelId?

```ts
optional modelId?: string;
```

Defined in: [src/models/model.ts:72](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/model.ts#L72)

The model identifier. This typically specifies which model to use from the provider’s catalog.

#### Inherited from

[<code dir="auto">BaseModelConfig</code>](/docs/api/typescript/BaseModelConfig/index.md).[<code dir="auto">modelId</code>](/docs/api/typescript/BaseModelConfig/index.md#modelid)