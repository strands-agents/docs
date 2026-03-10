Defined in: [src/errors.ts:84](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/errors.ts#L84)

Error thrown when attempting to serialize a value that is not JSON-serializable.

This error indicates that a value contains non-serializable types such as functions, symbols, or undefined values that cannot be converted to JSON.

## Extends

-   `Error`

## Constructors

### Constructor

```ts
new JsonValidationError(message): JsonValidationError;
```

Defined in: [src/errors.ts:90](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/errors.ts#L90)

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