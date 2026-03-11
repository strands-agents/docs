Defined in: [src/models/bedrock.ts:171](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/bedrock.ts#L171)

Configuration interface for AWS Bedrock model provider.

Extends BaseModelConfig with Bedrock-specific configuration options for model parameters, caching, and additional request/response fields.

## Example

```typescript
const config: BedrockModelConfig = {
  modelId: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
  maxTokens: 1024,
  temperature: 0.7,
  cachePrompt: 'ephemeral'
}
```

## Extends

-   [`BaseModelConfig`](/docs/api/typescript/BaseModelConfig/index.md)

## Extended by

-   [`BedrockModelOptions`](/docs/api/typescript/BedrockModelOptions/index.md)

## Properties

### maxTokens?

```ts
optional maxTokens: number;
```

Defined in: [src/models/bedrock.ts:177](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/bedrock.ts#L177)

Maximum number of tokens to generate in the response.

#### See

[https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_InferenceConfiguration.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InferenceConfiguration.html)

#### Overrides

[`BaseModelConfig`](/docs/api/typescript/BaseModelConfig/index.md).[`maxTokens`](/docs/api/typescript/BaseModelConfig/index.md#maxtokens)

---

### temperature?

```ts
optional temperature: number;
```

Defined in: [src/models/bedrock.ts:184](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/bedrock.ts#L184)

Controls randomness in generation.

#### See

[https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_InferenceConfiguration.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InferenceConfiguration.html)

#### Overrides

[`BaseModelConfig`](/docs/api/typescript/BaseModelConfig/index.md).[`temperature`](/docs/api/typescript/BaseModelConfig/index.md#temperature)

---

### topP?

```ts
optional topP: number;
```

Defined in: [src/models/bedrock.ts:191](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/bedrock.ts#L191)

Controls diversity via nucleus sampling.

#### See

[https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_InferenceConfiguration.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InferenceConfiguration.html)

#### Overrides

[`BaseModelConfig`](/docs/api/typescript/BaseModelConfig/index.md).[`topP`](/docs/api/typescript/BaseModelConfig/index.md#topp)

---

### stopSequences?

```ts
optional stopSequences: string[];
```

Defined in: [src/models/bedrock.ts:196](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/bedrock.ts#L196)

Array of sequences that will stop generation when encountered.

---

### cachePrompt?

```ts
optional cachePrompt: string;
```

Defined in: [src/models/bedrock.ts:202](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/bedrock.ts#L202)

Cache point type for the system prompt.

#### See

[https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)

---

### cacheTools?

```ts
optional cacheTools: string;
```

Defined in: [src/models/bedrock.ts:208](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/bedrock.ts#L208)

Cache point type for tools.

#### See

[https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)

---

### additionalRequestFields?

```ts
optional additionalRequestFields: JSONValue;
```

Defined in: [src/models/bedrock.ts:213](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/bedrock.ts#L213)

Additional fields to include in the Bedrock request.

---

### additionalResponseFieldPaths?

```ts
optional additionalResponseFieldPaths: string[];
```

Defined in: [src/models/bedrock.ts:218](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/bedrock.ts#L218)

Additional response field paths to extract from the Bedrock response.

---

### additionalArgs?

```ts
optional additionalArgs: JSONValue;
```

Defined in: [src/models/bedrock.ts:224](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/bedrock.ts#L224)

Additional arguments to pass through to the Bedrock Converse API.

#### See

[https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/command/ConverseStreamCommand/](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/command/ConverseStreamCommand/)

---

### stream?

```ts
optional stream: boolean;
```

Defined in: [src/models/bedrock.ts:234](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/bedrock.ts#L234)

Whether or not to stream responses from the model.

This will use the ConverseStream API instead of the Converse API.

#### See

-   [https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_Converse.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html)
-   [https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_ConverseStream.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ConverseStream.html)

---

### includeToolResultStatus?

```ts
optional includeToolResultStatus: boolean | "auto";
```

Defined in: [src/models/bedrock.ts:242](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/bedrock.ts#L242)

Flag to include status field in tool results.

-   `true`: Always include status field
-   `false`: Never include status field
-   `'auto'`: Automatically determine based on model ID (default)

---

### guardrailConfig?

```ts
optional guardrailConfig: BedrockGuardrailConfig;
```

Defined in: [src/models/bedrock.ts:248](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/bedrock.ts#L248)

Guardrail configuration for content filtering and safety controls.

#### See

[https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html)

---

### modelId?

```ts
optional modelId: string;
```

Defined in: [src/models/model.ts:58](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/model.ts#L58)

The model identifier. This typically specifies which model to use from the provider’s catalog.

#### Inherited from

[`BaseModelConfig`](/docs/api/typescript/BaseModelConfig/index.md).[`modelId`](/docs/api/typescript/BaseModelConfig/index.md#modelid)