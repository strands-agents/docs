Defined in: [src/models/bedrock.ts:276](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/bedrock.ts#L276)

Options for creating a BedrockModel instance.

## Extends

-   [`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md)

## Properties

### maxTokens?

```ts
optional maxTokens?: number;
```

Defined in: [src/models/bedrock.ts:204](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/bedrock.ts#L204)

Maximum number of tokens to generate in the response.

#### See

[https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_InferenceConfiguration.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InferenceConfiguration.html)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`maxTokens`](/docs/api/typescript/BedrockModelConfig/index.md#maxtokens)

---

### temperature?

```ts
optional temperature?: number;
```

Defined in: [src/models/bedrock.ts:211](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/bedrock.ts#L211)

Controls randomness in generation.

#### See

[https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_InferenceConfiguration.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InferenceConfiguration.html)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`temperature`](/docs/api/typescript/BedrockModelConfig/index.md#temperature)

---

### topP?

```ts
optional topP?: number;
```

Defined in: [src/models/bedrock.ts:218](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/bedrock.ts#L218)

Controls diversity via nucleus sampling.

#### See

[https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_InferenceConfiguration.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InferenceConfiguration.html)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`topP`](/docs/api/typescript/BedrockModelConfig/index.md#topp)

---

### stopSequences?

```ts
optional stopSequences?: string[];
```

Defined in: [src/models/bedrock.ts:223](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/bedrock.ts#L223)

Array of sequences that will stop generation when encountered.

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`stopSequences`](/docs/api/typescript/BedrockModelConfig/index.md#stopsequences)

---

### cacheConfig?

```ts
optional cacheConfig?: CacheConfig;
```

Defined in: [src/models/bedrock.ts:230](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/bedrock.ts#L230)

Configuration for prompt caching.

#### See

[https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`cacheConfig`](/docs/api/typescript/BedrockModelConfig/index.md#cacheconfig)

---

### additionalRequestFields?

```ts
optional additionalRequestFields?: JSONValue;
```

Defined in: [src/models/bedrock.ts:235](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/bedrock.ts#L235)

Additional fields to include in the Bedrock request.

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`additionalRequestFields`](/docs/api/typescript/BedrockModelConfig/index.md#additionalrequestfields)

---

### additionalResponseFieldPaths?

```ts
optional additionalResponseFieldPaths?: string[];
```

Defined in: [src/models/bedrock.ts:240](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/bedrock.ts#L240)

Additional response field paths to extract from the Bedrock response.

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`additionalResponseFieldPaths`](/docs/api/typescript/BedrockModelConfig/index.md#additionalresponsefieldpaths)

---

### additionalArgs?

```ts
optional additionalArgs?: JSONValue;
```

Defined in: [src/models/bedrock.ts:246](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/bedrock.ts#L246)

Additional arguments to pass through to the Bedrock Converse API.

#### See

[https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/command/ConverseStreamCommand/](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/command/ConverseStreamCommand/)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`additionalArgs`](/docs/api/typescript/BedrockModelConfig/index.md#additionalargs)

---

### stream?

```ts
optional stream?: boolean;
```

Defined in: [src/models/bedrock.ts:256](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/bedrock.ts#L256)

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
optional includeToolResultStatus?: boolean | "auto";
```

Defined in: [src/models/bedrock.ts:264](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/bedrock.ts#L264)

Flag to include status field in tool results.

-   `true`: Always include status field
-   `false`: Never include status field
-   `'auto'`: Automatically determine based on model ID (default)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`includeToolResultStatus`](/docs/api/typescript/BedrockModelConfig/index.md#includetoolresultstatus)

---

### guardrailConfig?

```ts
optional guardrailConfig?: BedrockGuardrailConfig;
```

Defined in: [src/models/bedrock.ts:270](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/bedrock.ts#L270)

Guardrail configuration for content filtering and safety controls.

#### See

[https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`guardrailConfig`](/docs/api/typescript/BedrockModelConfig/index.md#guardrailconfig)

---

### region?

```ts
optional region?: string;
```

Defined in: [src/models/bedrock.ts:280](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/bedrock.ts#L280)

AWS region to use for the Bedrock service.

---

### clientConfig?

```ts
optional clientConfig?: BedrockRuntimeClientConfig;
```

Defined in: [src/models/bedrock.ts:285](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/bedrock.ts#L285)

Configuration for the Bedrock Runtime client.

---

### apiKey?

```ts
optional apiKey?: string;
```

Defined in: [src/models/bedrock.ts:292](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/bedrock.ts#L292)

Amazon Bedrock API key for bearer token authentication. When provided, requests use the API key instead of SigV4 signing.

#### See

[https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html)

---

### modelId?

```ts
optional modelId?: string;
```

Defined in: [src/models/model.ts:91](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/model.ts#L91)

The model identifier. This typically specifies which model to use from the provider’s catalog.

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`modelId`](/docs/api/typescript/BedrockModelConfig/index.md#modelid)

---

### contextWindowLimit?

```ts
optional contextWindowLimit?: number;
```

Defined in: [src/models/model.ts:124](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/models/model.ts#L124)

Maximum context window size in tokens for the model.

This value represents the total token capacity shared between input and output. When not provided, it is automatically resolved from a built-in lookup table based on the configured model ID. An explicit value always takes precedence.

When `modelId` is changed via `updateConfig()`, this value is automatically re-resolved if it was initially auto-populated. Explicitly set values are preserved.

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`contextWindowLimit`](/docs/api/typescript/BedrockModelConfig/index.md#contextwindowlimit)