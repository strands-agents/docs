Defined in: [src/errors.ts:190](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/errors.ts#L190)

Thrown when the model fails to produce structured output. This occurs when the LLM refuses to use the structured output tool even after being forced via toolChoice.

## Extends

-   `Error`

## Constructors

### Constructor

```ts
new StructuredOutputError(message): StructuredOutputError;
```

Defined in: [src/errors.ts:191](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/errors.ts#L191)

#### Parameters

| Parameter | Type |
| --- | --- |
| `message` | `string` |

#### Returns

`StructuredOutputError`

#### Overrides

```ts
Error.constructor
```