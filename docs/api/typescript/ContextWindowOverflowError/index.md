Defined in: [src/errors.ts:38](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/errors.ts#L38)

Error thrown when input exceeds the model’s context window.

This error indicates that the combined length of the input (prompt, messages, system prompt, and tool definitions) exceeds the maximum context window size supported by the model.

## Extends

-   [`ModelError`](/docs/api/typescript/ModelError/index.md)

## Constructors

### Constructor

```ts
new ContextWindowOverflowError(message): ContextWindowOverflowError;
```

Defined in: [src/errors.ts:44](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/errors.ts#L44)

Creates a new ContextWindowOverflowError.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `message` | `string` | Error message describing the context overflow |

#### Returns

`ContextWindowOverflowError`

#### Overrides

[`ModelError`](/docs/api/typescript/ModelError/index.md).[`constructor`](/docs/api/typescript/ModelError/index.md#constructor)