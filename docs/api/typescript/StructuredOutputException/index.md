Defined in: [src/structured-output/exceptions.ts:8](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/structured-output/exceptions.ts#L8)

Exception raised when the model fails to produce structured output. This is raised only when the LLM refuses to use the structured output tool even after being forced via toolChoice.

## Extends

-   `Error`

## Constructors

### Constructor

```ts
new StructuredOutputException(message): StructuredOutputException;
```

Defined in: [src/structured-output/exceptions.ts:9](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/structured-output/exceptions.ts#L9)

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