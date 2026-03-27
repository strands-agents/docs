Defined in: [src/errors.ts:39](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/errors.ts#L39)

Error thrown when input exceeds the model’s context window.

This error indicates that the combined length of the input (prompt, messages, system prompt, and tool definitions) exceeds the maximum context window size supported by the model.

## Extends

-   [<code dir="auto">ModelError</code>](/docs/api/typescript/ModelError/index.md)

## Constructors

### Constructor

```ts
new ContextWindowOverflowError(message): ContextWindowOverflowError;
```

Defined in: [src/errors.ts:45](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/errors.ts#L45)

Creates a new ContextWindowOverflowError.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `message` | `string` | Error message describing the context overflow |

#### Returns

`ContextWindowOverflowError`

#### Overrides

[<code dir="auto">ModelError</code>](/docs/api/typescript/ModelError/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/ModelError/index.md#constructor)