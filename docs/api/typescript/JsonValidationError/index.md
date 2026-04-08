Defined in: [src/errors.ts:85](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/errors.ts#L85)

Error thrown when attempting to serialize a value that is not JSON-serializable.

This error indicates that a value contains non-serializable types such as functions, symbols, or undefined values that cannot be converted to JSON.

## Extends

-   `Error`

## Constructors

### Constructor

```ts
new JsonValidationError(message): JsonValidationError;
```

Defined in: [src/errors.ts:91](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/errors.ts#L91)

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