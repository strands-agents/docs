Defined in: [src/tools/function-tool.ts:99](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/tools/function-tool.ts#L99)

A Tool implementation that wraps a callback function and handles all ToolResultBlock conversion.

FunctionTool allows creating tools from existing functions without needing to manually handle ToolResultBlock formatting or error handling. It supports multiple callback patterns:

-   Async generators for streaming responses
-   Promises for async operations
-   Synchronous functions for immediate results

All return values are automatically wrapped in ToolResultBlock, and errors are caught and returned as error ToolResultBlocks.

## Example

```typescript
// Create a tool with streaming
const streamingTool = new FunctionTool({
  name: 'processor',
  description: 'Processes data with progress updates',
  inputSchema: { type: 'object', properties: { data: { type: 'string' } } },
  callback: async function* (input: any) {
    yield 'Starting processing...'
    // Do some work
    yield 'Halfway done...'
    // More work
    return 'Processing complete!'
  }
})
```

## Extends

-   [<code dir="auto">Tool</code>](/docs/api/typescript/Tool/index.md)

## Implements

-   [<code dir="auto">InvokableTool</code>](/docs/api/typescript/InvokableTool/index.md)<`unknown`, [<code dir="auto">JSONValue</code>](/docs/api/typescript/JSONValue/index.md)\>

## Constructors

### Constructor

```ts
new FunctionTool(config): FunctionTool;
```

Defined in: [src/tools/function-tool.ts:147](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/tools/function-tool.ts#L147)

Creates a new FunctionTool instance.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `config` | [<code dir="auto">FunctionToolConfig</code>](/docs/api/typescript/FunctionToolConfig/index.md) | Configuration object for the tool |

#### Returns

`FunctionTool`

#### Example

```typescript
// Tool with input schema
const greetTool = new FunctionTool({
  name: 'greeter',
  description: 'Greets a person by name',
  inputSchema: {
    type: 'object',
    properties: { name: { type: 'string' } },
    required: ['name']
  },
  callback: (input: any) => `Hello, ${input.name}!`
})

// Tool without input (no parameters)
const statusTool = new FunctionTool({
  name: 'getStatus',
  description: 'Gets system status',
  callback: () => ({ status: 'operational' })
})
```

#### Overrides

[<code dir="auto">Tool</code>](/docs/api/typescript/Tool/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/Tool/index.md#constructor)

## Properties

### name

```ts
readonly name: string;
```

Defined in: [src/tools/function-tool.ts:103](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/tools/function-tool.ts#L103)

The unique name of the tool.

#### Implementation of

[<code dir="auto">InvokableTool</code>](/docs/api/typescript/InvokableTool/index.md).[<code dir="auto">name</code>](/docs/api/typescript/InvokableTool/index.md#name)

#### Overrides

[<code dir="auto">Tool</code>](/docs/api/typescript/Tool/index.md).[<code dir="auto">name</code>](/docs/api/typescript/Tool/index.md#name)

---

### description

```ts
readonly description: string;
```

Defined in: [src/tools/function-tool.ts:108](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/tools/function-tool.ts#L108)

Human-readable description of what the tool does.

#### Implementation of

[<code dir="auto">InvokableTool</code>](/docs/api/typescript/InvokableTool/index.md).[<code dir="auto">description</code>](/docs/api/typescript/InvokableTool/index.md#description)

#### Overrides

[<code dir="auto">Tool</code>](/docs/api/typescript/Tool/index.md).[<code dir="auto">description</code>](/docs/api/typescript/Tool/index.md#description)

---

### toolSpec

```ts
readonly toolSpec: ToolSpec;
```

Defined in: [src/tools/function-tool.ts:113](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/tools/function-tool.ts#L113)

OpenAPI JSON specification for the tool.

#### Implementation of

[<code dir="auto">InvokableTool</code>](/docs/api/typescript/InvokableTool/index.md).[<code dir="auto">toolSpec</code>](/docs/api/typescript/InvokableTool/index.md#toolspec)

#### Overrides

[<code dir="auto">Tool</code>](/docs/api/typescript/Tool/index.md).[<code dir="auto">toolSpec</code>](/docs/api/typescript/Tool/index.md#toolspec)

## Methods

### stream()

```ts
stream(toolContext): AsyncGenerator<ToolStreamEvent, ToolResultBlock, unknown>;
```

Defined in: [src/tools/function-tool.ts:174](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/tools/function-tool.ts#L174)

Executes the tool with streaming support. Handles all callback patterns (async generator, promise, sync) and converts results to ToolResultBlock.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `toolContext` | [<code dir="auto">ToolContext</code>](/docs/api/typescript/ToolContext/index.md) | Context information including the tool use request and invocation state |

#### Returns

`AsyncGenerator`<[<code dir="auto">ToolStreamEvent</code>](/docs/api/typescript/ToolStreamEvent/index.md), [<code dir="auto">ToolResultBlock</code>](/docs/api/typescript/ToolResultBlock/index.md), `unknown`\>

Async generator that yields ToolStreamEvents and returns a ToolResultBlock

#### Implementation of

[<code dir="auto">InvokableTool</code>](/docs/api/typescript/InvokableTool/index.md).[<code dir="auto">stream</code>](/docs/api/typescript/InvokableTool/index.md#stream)

#### Overrides

[<code dir="auto">Tool</code>](/docs/api/typescript/Tool/index.md).[<code dir="auto">stream</code>](/docs/api/typescript/Tool/index.md#stream)

---

### invoke()

```ts
invoke(input, context?): Promise<JSONValue>;
```

Defined in: [src/tools/function-tool.ts:224](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/tools/function-tool.ts#L224)

Invokes the tool directly with raw input and returns the unwrapped result.

Unlike stream(), this method:

-   Returns the raw result (not wrapped in ToolResult)
-   Consumes async generators and returns the generator’s return value
-   Lets errors throw naturally (not wrapped in error ToolResult)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `input` | `unknown` | The input parameters for the tool |
| `context?` | [<code dir="auto">ToolContext</code>](/docs/api/typescript/ToolContext/index.md) | Optional tool execution context |

#### Returns

`Promise`<[<code dir="auto">JSONValue</code>](/docs/api/typescript/JSONValue/index.md)\>

The unwrapped result

#### Implementation of

[<code dir="auto">InvokableTool</code>](/docs/api/typescript/InvokableTool/index.md).[<code dir="auto">invoke</code>](/docs/api/typescript/InvokableTool/index.md#invoke)