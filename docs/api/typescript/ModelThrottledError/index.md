Defined in: [src/errors.ts:121](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/errors.ts#L121)

Error thrown when a model provider returns a throttling or rate limit error.

This error indicates that the model API has rate limited the request. Users can handle this error in hooks to implement custom retry strategies using the `AfterModelCallEvent.retry` mechanism.

## Extends

-   [`ModelError`](/docs/api/typescript/ModelError/index.md)

## Constructors

### Constructor

```ts
new ModelThrottledError(message, options?): ModelThrottledError;
```

Defined in: [src/errors.ts:128](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/errors.ts#L128)

Creates a new ModelThrottledError.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `message` | `string` | Error message describing the throttling condition |
| `options?` | `ErrorOptions` | Optional error options including cause for error chaining |

#### Returns

`ModelThrottledError`

#### Overrides

[`ModelError`](/docs/api/typescript/ModelError/index.md).[`constructor`](/docs/api/typescript/ModelError/index.md#constructor)