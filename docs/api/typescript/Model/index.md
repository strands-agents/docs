Defined in: [src/models/model.ts:153](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/model.ts#L153)

Base abstract class for model providers. Defines the contract that all model provider implementations must follow.

Model providers handle communication with LLM APIs and implement streaming responses using async iterables.

## Extended by

-   [<code dir="auto">BedrockModel</code>](/docs/api/typescript/BedrockModel/index.md)

## Type Parameters

| Type Parameter | Default type | Description |
| --- | --- | --- |
| `T` *extends* [<code dir="auto">BaseModelConfig</code>](/docs/api/typescript/BaseModelConfig/index.md) | [<code dir="auto">BaseModelConfig</code>](/docs/api/typescript/BaseModelConfig/index.md) | Model configuration type extending BaseModelConfig |

## Constructors

### Constructor

```ts
new Model<T>(): Model<T>;
```

#### Returns

`Model`<`T`\>

## Accessors

### modelId

#### Get Signature

```ts
get modelId(): string;
```

Defined in: [src/models/model.ts:172](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/model.ts#L172)

The model ID from the current configuration, if configured.

##### Returns

`string`

## Methods

### updateConfig()

```ts
abstract updateConfig(modelConfig): void;
```

Defined in: [src/models/model.ts:160](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/model.ts#L160)

Updates the model configuration. Merges the provided configuration with existing settings.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `modelConfig` | `T` | Configuration object with model-specific settings to update |

#### Returns

`void`

---

### getConfig()

```ts
abstract getConfig(): T;
```

Defined in: [src/models/model.ts:167](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/model.ts#L167)

Retrieves the current model configuration.

#### Returns

`T`

The current configuration object

---

### stream()

```ts
abstract stream(messages, options?): AsyncIterable<ModelStreamEvent>;
```

Defined in: [src/models/model.ts:184](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/model.ts#L184)

Streams a conversation with the model. Returns an async iterable that yields streaming events as they occur.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `messages` | [<code dir="auto">Message</code>](/docs/api/typescript/Message/index.md)\[\] | Array of conversation messages |
| `options?` | [<code dir="auto">StreamOptions</code>](/docs/api/typescript/StreamOptions/index.md) | Optional streaming configuration |

#### Returns

`AsyncIterable`<[<code dir="auto">ModelStreamEvent</code>](/docs/api/typescript/ModelStreamEvent/index.md)\>

Async iterable of streaming events

---

### streamAggregated()

```ts
streamAggregated(messages, options?): AsyncGenerator<
  | ContentBlock
| ModelStreamEvent, StreamAggregatedResult, undefined>;
```

Defined in: [src/models/model.ts:240](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/model.ts#L240)

Streams a conversation with aggregated content blocks and messages. Returns an async generator that yields streaming events and content blocks, and returns the final message with stop reason and optional metadata.

This method enhances the basic stream() by collecting streaming events into complete ContentBlock and Message objects, which are needed by the agentic loop for tool execution and conversation management.

The method yields:

-   ModelStreamEvent - Original streaming events (passed through)
-   ContentBlock - Complete content block (emitted when block completes)

The method returns:

-   StreamAggregatedResult containing the complete message, stop reason, and optional metadata

All exceptions thrown from this method are wrapped in ModelError to provide a consistent error type for model-related errors. Specific error subtypes like ContextWindowOverflowError, ModelThrottledError, and MaxTokensError are preserved.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `messages` | [<code dir="auto">Message</code>](/docs/api/typescript/Message/index.md)\[\] | Array of conversation messages |
| `options?` | [<code dir="auto">StreamOptions</code>](/docs/api/typescript/StreamOptions/index.md) | Optional streaming configuration |

#### Returns

`AsyncGenerator`< | [<code dir="auto">ContentBlock</code>](/docs/api/typescript/ContentBlock/index.md) | [<code dir="auto">ModelStreamEvent</code>](/docs/api/typescript/ModelStreamEvent/index.md), `StreamAggregatedResult`, `undefined`\>

Async generator yielding ModelStreamEvent | ContentBlock and returning a StreamAggregatedResult

#### Throws

ModelError - Base class for all model-related errors

#### Throws

ContextWindowOverflowError - When input exceeds the model’s context window

#### Throws

ModelThrottledError - When the model provider throttles requests

#### Throws

MaxTokensError - When the model reaches its maximum token limit