Defined in: [src/errors.ts:19](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/errors.ts#L19)

Base exception class for all model-related errors.

This class serves as the common base type for errors that originate from model provider interactions. By catching ModelError, consumers can handle all model-related errors uniformly while still having access to specific error types through instanceof checks.

## Extends

-   `Error`

## Extended by

-   [<code dir="auto">ContextWindowOverflowError</code>](/docs/api/typescript/ContextWindowOverflowError/index.md)
-   [<code dir="auto">MaxTokensError</code>](/docs/api/typescript/MaxTokensError/index.md)
-   [<code dir="auto">ModelThrottledError</code>](/docs/api/typescript/ModelThrottledError/index.md)

## Constructors

### Constructor

```ts
new ModelError(message, options?): ModelError;
```

Defined in: [src/errors.ts:26](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/errors.ts#L26)

Creates a new ModelError.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `message` | `string` | Error message describing the model error |
| `options?` | { `cause?`: `unknown`; } | Optional error options including the cause |
| `options.cause?` | `unknown` | \- |

#### Returns

`ModelError`

#### Overrides

```ts
Error.constructor
```