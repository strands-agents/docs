Defined in: [src/structured-output/exceptions.ts:8](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/structured-output/exceptions.ts#L8)

Exception raised when the model fails to produce structured output. This is raised only when the LLM refuses to use the structured output tool even after being forced via toolChoice.

## Extends

-   `Error`

## Constructors

### Constructor

```ts
new StructuredOutputException(message): StructuredOutputException;
```

Defined in: [src/structured-output/exceptions.ts:9](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/structured-output/exceptions.ts#L9)

#### Parameters

| Parameter | Type |
| --- | --- |
| `message` | `string` |

#### Returns

`StructuredOutputException`

#### Overrides

```ts
Error.constructor
```