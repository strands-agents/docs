Defined in: [src/models/bedrock.ts:194](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/bedrock.ts#L194)

Options for creating a BedrockModel instance.

## Extends

-   [`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md)

## Properties

### maxTokens?

```ts
optional maxTokens: number;
```

Defined in: [src/models/bedrock.ts:123](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/bedrock.ts#L123)

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

Defined in: [src/models/bedrock.ts:130](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/bedrock.ts#L130)

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

Defined in: [src/models/bedrock.ts:137](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/bedrock.ts#L137)

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

Defined in: [src/models/bedrock.ts:142](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/bedrock.ts#L142)

Array of sequences that will stop generation when encountered.

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`stopSequences`](/docs/api/typescript/BedrockModelConfig/index.md#stopsequences)

---

### cachePrompt?

```ts
optional cachePrompt: string;
```

Defined in: [src/models/bedrock.ts:148](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/bedrock.ts#L148)

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

Defined in: [src/models/bedrock.ts:154](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/bedrock.ts#L154)

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

Defined in: [src/models/bedrock.ts:159](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/bedrock.ts#L159)

Additional fields to include in the Bedrock request.

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`additionalRequestFields`](/docs/api/typescript/BedrockModelConfig/index.md#additionalrequestfields)

---

### additionalResponseFieldPaths?

```ts
optional additionalResponseFieldPaths: string[];
```

Defined in: [src/models/bedrock.ts:164](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/bedrock.ts#L164)

Additional response field paths to extract from the Bedrock response.

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`additionalResponseFieldPaths`](/docs/api/typescript/BedrockModelConfig/index.md#additionalresponsefieldpaths)

---

### additionalArgs?

```ts
optional additionalArgs: JSONValue;
```

Defined in: [src/models/bedrock.ts:170](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/bedrock.ts#L170)

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

Defined in: [src/models/bedrock.ts:180](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/bedrock.ts#L180)

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

Defined in: [src/models/bedrock.ts:188](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/bedrock.ts#L188)

Flag to include status field in tool results.

-   `true`: Always include status field
-   `false`: Never include status field
-   `'auto'`: Automatically determine based on model ID (default)

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`includeToolResultStatus`](/docs/api/typescript/BedrockModelConfig/index.md#includetoolresultstatus)

---

### region?

```ts
optional region: string;
```

Defined in: [src/models/bedrock.ts:198](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/bedrock.ts#L198)

AWS region to use for the Bedrock service.

---

### clientConfig?

```ts
optional clientConfig: BedrockRuntimeClientConfig;
```

Defined in: [src/models/bedrock.ts:203](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/bedrock.ts#L203)

Configuration for the Bedrock Runtime client.

---

### apiKey?

```ts
optional apiKey: string;
```

Defined in: [src/models/bedrock.ts:210](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/bedrock.ts#L210)

Amazon Bedrock API key for bearer token authentication. When provided, requests use the API key instead of SigV4 signing.

#### See

[https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html)

---

### modelId?

```ts
optional modelId: string;
```

Defined in: [src/models/model.ts:56](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/model.ts#L56)

The model identifier. This typically specifies which model to use from the provider’s catalog.

#### Inherited from

[`BedrockModelConfig`](/docs/api/typescript/BedrockModelConfig/index.md).[`modelId`](/docs/api/typescript/BedrockModelConfig/index.md#modelid)