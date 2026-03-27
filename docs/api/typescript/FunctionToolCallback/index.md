```ts
type FunctionToolCallback = (input, toolContext) =>
  | AsyncGenerator<JSONValue, JSONValue, never>
  | Promise<JSONValue>
  | JSONValue;
```

Defined in: [src/tools/function-tool.ts:51](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/tools/function-tool.ts#L51)

Callback function for FunctionTool implementations. The callback can return values in multiple ways, and FunctionTool handles the conversion to ToolResultBlock.

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `input` | `unknown` | The input parameters conforming to the tool’s inputSchema |
| `toolContext` | [<code dir="auto">ToolContext</code>](/docs/api/typescript/ToolContext/index.md) | The tool execution context with invocation state |

## Returns

| `AsyncGenerator`<[<code dir="auto">JSONValue</code>](/docs/api/typescript/JSONValue/index.md), [<code dir="auto">JSONValue</code>](/docs/api/typescript/JSONValue/index.md), `never`\> | `Promise`<[<code dir="auto">JSONValue</code>](/docs/api/typescript/JSONValue/index.md)\> | [<code dir="auto">JSONValue</code>](/docs/api/typescript/JSONValue/index.md)

Can return:

-   AsyncGenerator: Each yielded value becomes a ToolStreamEvent, final value wrapped in ToolResultBlock
-   Promise: Resolved value is wrapped in ToolResultBlock
-   Synchronous value: Value is wrapped in ToolResultBlock
-   If an error is thrown, it’s handled and returned as an error ToolResultBlock

## Example

```typescript
// Async generator example
async function* calculator(input: unknown, context: ToolContext) {
  yield 'Calculating...'
  const result = input.a + input.b
  yield `Result: ${result}`
  return result
}

// Promise example
async function fetchData(input: unknown, context: ToolContext) {
  const response = await fetch(input.url)
  return await response.json()
}

// Synchronous example
function multiply(input: unknown, context: ToolContext) {
  return input.a * input.b
}
```