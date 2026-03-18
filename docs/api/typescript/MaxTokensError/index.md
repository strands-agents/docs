Defined in: [src/errors.ts:58](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/errors.ts#L58)

Error thrown when the model reaches its maximum token limit during generation.

This error indicates that the model stopped generating content because it reached the maximum number of tokens allowed for the response. This is an unrecoverable state that requires intervention, such as reducing the input size or adjusting the max tokens parameter.

## Extends

-   [`ModelError`](/docs/api/typescript/ModelError/index.md)

## Constructors

### Constructor

```ts
new MaxTokensError(message, partialMessage): MaxTokensError;
```

Defined in: [src/errors.ts:71](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/errors.ts#L71)

Creates a new MaxTokensError.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `message` | `string` | Error message describing the max tokens condition |
| `partialMessage` | [`Message`](/docs/api/typescript/Message/index.md) | The partial assistant message generated before the limit |

#### Returns

`MaxTokensError`

#### Overrides

[`ModelError`](/docs/api/typescript/ModelError/index.md).[`constructor`](/docs/api/typescript/ModelError/index.md#constructor)

## Properties

### partialMessage

```ts
readonly partialMessage: Message;
```

Defined in: [src/errors.ts:63](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/errors.ts#L63)

The partial assistant message that was generated before hitting the token limit. This can be useful for understanding what the model was trying to generate.