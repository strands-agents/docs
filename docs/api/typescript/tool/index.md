```ts
function tool<TInput, TReturn>(config): InvokableTool<ZodInferred<TInput>, TReturn>;
```

Defined in: [src/tools/zod-tool.ts:231](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/tools/zod-tool.ts#L231)

Creates an InvokableTool from a Zod schema and callback function.

The tool() function validates input against the schema and generates JSON schema for model providers using Zod v4’s built-in z.toJSONSchema() method.

## Type Parameters

| Type Parameter | Default type | Description |
| --- | --- | --- |
| `TInput` *extends* `ZodType`<`unknown`, `unknown`, `$ZodTypeInternals`<`unknown`, `unknown`\>> | \- | Zod schema type for input validation |
| `TReturn` *extends* [`JSONValue`](/docs/api/typescript/JSONValue/index.md) | [`JSONValue`](/docs/api/typescript/JSONValue/index.md) | Return type of the callback function |

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `config` | `ToolConfig`<`TInput`, `TReturn`\> | Tool configuration |

## Returns

[`InvokableTool`](/docs/api/typescript/InvokableTool/index.md)<`ZodInferred`<`TInput`\>, `TReturn`\>

An InvokableTool that implements the Tool interface with invoke() method

## Example

```typescript
import { tool } from '@strands-agents/sdk'
import { z } from 'zod'

// Tool with input parameters
const calculator = tool({
  name: 'calculator',
  description: 'Performs basic arithmetic',
  inputSchema: z.object({
    operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
    a: z.number(),
    b: z.number()
  }),
  callback: (input) => {
    switch (input.operation) {
      case 'add': return input.a + input.b
      case 'subtract': return input.a - input.b
      case 'multiply': return input.a * input.b
      case 'divide': return input.a / input.b
    }
  }
})

// Tool without input (omit inputSchema)
const getStatus = tool({
  name: 'getStatus',
  description: 'Gets system status',
  callback: () => ({ status: 'operational', uptime: 99.9 })
})

// Direct invocation
const result = await calculator.invoke({ operation: 'add', a: 5, b: 3 })

// Agent usage
for await (const event of calculator.stream(context)) {
  console.log(event)
}
```