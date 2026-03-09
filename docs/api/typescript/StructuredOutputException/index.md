Defined in: [src/structured-output/exceptions.ts:8](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/structured-output/exceptions.ts#L8)

Exception raised when the model fails to produce structured output. This is raised only when the LLM refuses to use the structured output tool even after being forced via toolChoice.

## Extends

-   `Error`

## Constructors

### Constructor

```ts
new StructuredOutputException(message): StructuredOutputException;
```

Defined in: [src/structured-output/exceptions.ts:9](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/structured-output/exceptions.ts#L9)

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