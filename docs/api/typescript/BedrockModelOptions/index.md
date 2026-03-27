Defined in: [src/models/bedrock.ts:271](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/bedrock.ts#L271)

Options for creating a BedrockModel instance.

## Extends

-   [<code dir="auto">BedrockModelConfig</code>](/docs/api/typescript/BedrockModelConfig/index.md)

## Properties

### maxTokens?

```ts
optional maxTokens?: number;
```

Defined in: [src/models/bedrock.ts:199](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/bedrock.ts#L199)

Maximum number of tokens to generate in the response.

#### See

[https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_InferenceConfiguration.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InferenceConfiguration.html)

#### Inherited from

[<code dir="auto">BedrockModelConfig</code>](/docs/api/typescript/BedrockModelConfig/index.md).[<code dir="auto">maxTokens</code>](/docs/api/typescript/BedrockModelConfig/index.md#maxtokens)

---

### temperature?

```ts
optional temperature?: number;
```

Defined in: [src/models/bedrock.ts:206](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/bedrock.ts#L206)

Controls randomness in generation.

#### See

[https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_InferenceConfiguration.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InferenceConfiguration.html)

#### Inherited from

[<code dir="auto">BedrockModelConfig</code>](/docs/api/typescript/BedrockModelConfig/index.md).[<code dir="auto">temperature</code>](/docs/api/typescript/BedrockModelConfig/index.md#temperature)

---

### topP?

```ts
optional topP?: number;
```

Defined in: [src/models/bedrock.ts:213](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/bedrock.ts#L213)

Controls diversity via nucleus sampling.

#### See

[https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_InferenceConfiguration.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InferenceConfiguration.html)

#### Inherited from

[<code dir="auto">BedrockModelConfig</code>](/docs/api/typescript/BedrockModelConfig/index.md).[<code dir="auto">topP</code>](/docs/api/typescript/BedrockModelConfig/index.md#topp)

---

### stopSequences?

```ts
optional stopSequences?: string[];
```

Defined in: [src/models/bedrock.ts:218](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/bedrock.ts#L218)

Array of sequences that will stop generation when encountered.

#### Inherited from

[<code dir="auto">BedrockModelConfig</code>](/docs/api/typescript/BedrockModelConfig/index.md).[<code dir="auto">stopSequences</code>](/docs/api/typescript/BedrockModelConfig/index.md#stopsequences)

---

### cacheConfig?

```ts
optional cacheConfig?: CacheConfig;
```

Defined in: [src/models/bedrock.ts:225](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/bedrock.ts#L225)

Configuration for prompt caching.

#### See

[https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)

#### Inherited from

[<code dir="auto">BedrockModelConfig</code>](/docs/api/typescript/BedrockModelConfig/index.md).[<code dir="auto">cacheConfig</code>](/docs/api/typescript/BedrockModelConfig/index.md#cacheconfig)

---

### additionalRequestFields?

```ts
optional additionalRequestFields?: JSONValue;
```

Defined in: [src/models/bedrock.ts:230](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/bedrock.ts#L230)

Additional fields to include in the Bedrock request.

#### Inherited from

[<code dir="auto">BedrockModelConfig</code>](/docs/api/typescript/BedrockModelConfig/index.md).[<code dir="auto">additionalRequestFields</code>](/docs/api/typescript/BedrockModelConfig/index.md#additionalrequestfields)

---

### additionalResponseFieldPaths?

```ts
optional additionalResponseFieldPaths?: string[];
```

Defined in: [src/models/bedrock.ts:235](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/bedrock.ts#L235)

Additional response field paths to extract from the Bedrock response.

#### Inherited from

[<code dir="auto">BedrockModelConfig</code>](/docs/api/typescript/BedrockModelConfig/index.md).[<code dir="auto">additionalResponseFieldPaths</code>](/docs/api/typescript/BedrockModelConfig/index.md#additionalresponsefieldpaths)

---

### additionalArgs?

```ts
optional additionalArgs?: JSONValue;
```

Defined in: [src/models/bedrock.ts:241](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/bedrock.ts#L241)

Additional arguments to pass through to the Bedrock Converse API.

#### See

[https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/command/ConverseStreamCommand/](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/bedrock-runtime/command/ConverseStreamCommand/)

#### Inherited from

[<code dir="auto">BedrockModelConfig</code>](/docs/api/typescript/BedrockModelConfig/index.md).[<code dir="auto">additionalArgs</code>](/docs/api/typescript/BedrockModelConfig/index.md#additionalargs)

---

### stream?

```ts
optional stream?: boolean;
```

Defined in: [src/models/bedrock.ts:251](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/bedrock.ts#L251)

Whether or not to stream responses from the model.

This will use the ConverseStream API instead of the Converse API.

#### See

-   [https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_Converse.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html)
-   [https://docs.aws.amazon.com/bedrock/latest/APIReference/API\_runtime\_ConverseStream.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ConverseStream.html)

#### Inherited from

[<code dir="auto">BedrockModelConfig</code>](/docs/api/typescript/BedrockModelConfig/index.md).[<code dir="auto">stream</code>](/docs/api/typescript/BedrockModelConfig/index.md#stream)

---

### includeToolResultStatus?

```ts
optional includeToolResultStatus?: boolean | "auto";
```

Defined in: [src/models/bedrock.ts:259](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/bedrock.ts#L259)

Flag to include status field in tool results.

-   `true`: Always include status field
-   `false`: Never include status field
-   `'auto'`: Automatically determine based on model ID (default)

#### Inherited from

[<code dir="auto">BedrockModelConfig</code>](/docs/api/typescript/BedrockModelConfig/index.md).[<code dir="auto">includeToolResultStatus</code>](/docs/api/typescript/BedrockModelConfig/index.md#includetoolresultstatus)

---

### guardrailConfig?

```ts
optional guardrailConfig?: BedrockGuardrailConfig;
```

Defined in: [src/models/bedrock.ts:265](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/bedrock.ts#L265)

Guardrail configuration for content filtering and safety controls.

#### See

[https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html)

#### Inherited from

[<code dir="auto">BedrockModelConfig</code>](/docs/api/typescript/BedrockModelConfig/index.md).[<code dir="auto">guardrailConfig</code>](/docs/api/typescript/BedrockModelConfig/index.md#guardrailconfig)

---

### region?

```ts
optional region?: string;
```

Defined in: [src/models/bedrock.ts:275](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/bedrock.ts#L275)

AWS region to use for the Bedrock service.

---

### clientConfig?

```ts
optional clientConfig?: BedrockRuntimeClientConfig;
```

Defined in: [src/models/bedrock.ts:280](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/bedrock.ts#L280)

Configuration for the Bedrock Runtime client.

---

### apiKey?

```ts
optional apiKey?: string;
```

Defined in: [src/models/bedrock.ts:287](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/bedrock.ts#L287)

Amazon Bedrock API key for bearer token authentication. When provided, requests use the API key instead of SigV4 signing.

#### See

[https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html)

---

### modelId?

```ts
optional modelId?: string;
```

Defined in: [src/models/model.ts:72](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/model.ts#L72)

The model identifier. This typically specifies which model to use from the provider’s catalog.

#### Inherited from

[<code dir="auto">BedrockModelConfig</code>](/docs/api/typescript/BedrockModelConfig/index.md).[<code dir="auto">modelId</code>](/docs/api/typescript/BedrockModelConfig/index.md#modelid)