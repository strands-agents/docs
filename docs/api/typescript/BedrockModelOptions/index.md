Defined in: [src/models/bedrock.ts:254](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/bedrock.ts#L254)

Options for creating a BedrockModel instance.

## Extends

-   [`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md)

## Properties

### maxTokens?

```ts
optional maxTokens: number;
```

Defined in: [src/models/bedrock.ts:177](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/bedrock.ts#L177)

Maximum number of tokens to generate in the response.

#### See

[https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_InferenceConfiguration.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InferenceConfiguration.html)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`maxTokens`](/docs/api/typescript/BedrockModelConfig/index.md#maxtokens)

---

### temperature?

```ts
optional temperature: number;
```

Defined in: [src/models/bedrock.ts:184](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/bedrock.ts#L184)

Controls randomness in generation.

#### See

[https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_InferenceConfiguration.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InferenceConfiguration.html)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`temperature`](/docs/api/typescript/BedrockModelConfig/index.md#temperature)

---

### topP?

```ts
optional topP: number;
```

Defined in: [src/models/bedrock.ts:191](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/bedrock.ts#L191)

Controls diversity via nucleus sampling.

#### See

[https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_InferenceConfiguration.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InferenceConfiguration.html)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`topP`](/docs/api/typescript/BedrockModelConfig/index.md#topp)

---

### stopSequences?

```ts
optional stopSequences: string[];
```

Defined in: [src/models/bedrock.ts:196](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/bedrock.ts#L196)

Array of sequences that will stop generation when encountered.

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`stopSequences`](/docs/api/typescript/BedrockModelConfig/index.md#stopsequences)

---

### cachePrompt?

```ts
optional cachePrompt: string;
```

Defined in: [src/models/bedrock.ts:202](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/bedrock.ts#L202)

Cache point type for the system prompt.

#### See

[https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`cachePrompt`](/docs/api/typescript/BedrockModelConfig/index.md#cacheprompt)

---

### cacheTools?

```ts
optional cacheTools: string;
```

Defined in: [src/models/bedrock.ts:208](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/bedrock.ts#L208)

Cache point type for tools.

#### See

[https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`cacheTools`](/docs/api/typescript/BedrockModelConfig/index.md#cachetools)

---

### additionalRequestFields?

```ts
optional additionalRequestFields: JSONValue;
```

Defined in: [src/models/bedrock.ts:213](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/bedrock.ts#L213)

Additional fields to include in the Bedrock request.

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`additionalRequestFields`](/docs/api/typescript/BedrockModelConfig/index.md#additionalrequestfields)

---

### additionalResponseFieldPaths?

```ts
optional additionalResponseFieldPaths: string[];
```

Defined in: [src/models/bedrock.ts:218](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/bedrock.ts#L218)

Additional response field paths to extract from the Bedrock response.

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`additionalResponseFieldPaths`](/docs/api/typescript/BedrockModelConfig/index.md#additionalresponsefieldpaths)

---

### additionalArgs?

```ts
optional additionalArgs: JSONValue;
```

Defined in: [src/models/bedrock.ts:224](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/bedrock.ts#L224)

Additional arguments to pass through to the Bedrock Converse API.

#### See

[https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/command/ConverseStreamCommand/](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/command/ConverseStreamCommand/)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`additionalArgs`](/docs/api/typescript/BedrockModelConfig/index.md#additionalargs)

---

### stream?

```ts
optional stream: boolean;
```

Defined in: [src/models/bedrock.ts:234](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/bedrock.ts#L234)

Whether or not to stream responses from the model.

This will use the ConverseStream API instead of the Converse API.

#### See

-   [https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_Converse.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html)
-   [https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_ConverseStream.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ConverseStream.html)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`stream`](/docs/api/typescript/BedrockModelConfig/index.md#stream)

---

### includeToolResultStatus?

```ts
optional includeToolResultStatus: boolean | "auto";
```

Defined in: [src/models/bedrock.ts:242](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/bedrock.ts#L242)

Flag to include status field in tool results.

-   `true`: Always include status field
-   `false`: Never include status field
-   `'auto'`: Automatically determine based on model ID (default)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`includeToolResultStatus`](/docs/api/typescript/BedrockModelConfig/index.md#includetoolresultstatus)

---

### guardrailConfig?

```ts
optional guardrailConfig: BedrockGuardrailConfig;
```

Defined in: [src/models/bedrock.ts:248](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/bedrock.ts#L248)

Guardrail configuration for content filtering and safety controls.

#### See

[https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`guardrailConfig`](/docs/api/typescript/BedrockModelConfig/index.md#guardrailconfig)

---

### region?

```ts
optional region: string;
```

Defined in: [src/models/bedrock.ts:258](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/bedrock.ts#L258)

AWS region to use for the Bedrock service.

---

### clientConfig?

```ts
optional clientConfig: BedrockRuntimeClientConfig;
```

Defined in: [src/models/bedrock.ts:263](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/bedrock.ts#L263)

Configuration for the Bedrock Runtime client.

---

### apiKey?

```ts
optional apiKey: string;
```

Defined in: [src/models/bedrock.ts:270](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/bedrock.ts#L270)

Amazon Bedrock API key for bearer token authentication. When provided, requests use the API key instead of SigV4 signing.

#### See

[https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html)

---

### modelId?

```ts
optional modelId: string;
```

Defined in: [src/models/model.ts:58](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/models/model.ts#L58)

The model identifier. This typically specifies which model to use from the provider’s catalog.

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`modelId`](/docs/api/typescript/BedrockModelConfig/index.md#modelid)