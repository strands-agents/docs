Defined in: [src/errors.ts:84](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/errors.ts#L84)

Error thrown when attempting to serialize a value that is not JSON-serializable.

This error indicates that a value contains non-serializable types such as functions, symbols, or undefined values that cannot be converted to JSON.

## Extends

-   `Error`

## Constructors

### Constructor

```ts
new JsonValidationError(message): JsonValidationError;
```

Defined in: [src/errors.ts:90](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/errors.ts#L90)

Creates a new JsonValidationError.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `message` | `string` | Error message describing the validation failure |

#### Returns

`JsonValidationError`

#### Overrides

```ts
Error.constructor
```