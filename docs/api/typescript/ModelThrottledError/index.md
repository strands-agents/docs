Defined in: [src/errors.ts:122](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/errors.ts#L122)

Error thrown when a model provider returns a throttling or rate limit error.

This error indicates that the model API has rate limited the request. Users can handle this error in hooks to implement custom retry strategies using the `AfterModelCallEvent.retry` mechanism.

## Extends

-   [<code dir="auto">ModelError</code>](/docs/api/typescript/ModelError/index.md)

## Constructors

### Constructor

```ts
new ModelThrottledError(message, options?): ModelThrottledError;
```

Defined in: [src/errors.ts:129](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/errors.ts#L129)

Creates a new ModelThrottledError.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `message` | `string` | Error message describing the throttling condition |
| `options?` | `ErrorOptions` | Optional error options including cause for error chaining |

#### Returns

`ModelThrottledError`

#### Overrides

[<code dir="auto">ModelError</code>](/docs/api/typescript/ModelError/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/ModelError/index.md#constructor)