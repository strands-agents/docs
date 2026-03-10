Defined in: [src/structured-output/exceptions.ts:8](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/structured-output/exceptions.ts#L8)

Exception raised when the model fails to produce structured output. This is raised only when the LLM refuses to use the structured output tool even after being forced via toolChoice.

## Extends

-   `Error`

## Constructors

### Constructor

```ts
new StructuredOutputException(message): StructuredOutputException;
```

Defined in: [src/structured-output/exceptions.ts:9](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/structured-output/exceptions.ts#L9)

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