Defined in: [src/tools/function-tool.ts:91](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/tools/function-tool.ts#L91)

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

-   [`Tool`](/docs/api/typescript/Tool/index.md)

## Constructors

### Constructor

```ts
new FunctionTool(config): FunctionTool;
```

Defined in: [src/tools/function-tool.ts:139](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/tools/function-tool.ts#L139)

Creates a new FunctionTool instance.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `config` | `FunctionToolConfig` | Configuration object for the tool |

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

[`Tool`](/docs/api/typescript/Tool/index.md).[`constructor`](/docs/api/typescript/Tool/index.md#constructor)

## Properties

### name

```ts
readonly name: string;
```

Defined in: [src/tools/function-tool.ts:95](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/tools/function-tool.ts#L95)

The unique name of the tool.

#### Overrides

[`Tool`](/docs/api/typescript/Tool/index.md).[`name`](/docs/api/typescript/Tool/index.md#name)

---

### description

```ts
readonly description: string;
```

Defined in: [src/tools/function-tool.ts:100](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/tools/function-tool.ts#L100)

Human-readable description of what the tool does.

#### Overrides

[`Tool`](/docs/api/typescript/Tool/index.md).[`description`](/docs/api/typescript/Tool/index.md#description)

---

### toolSpec

```ts
readonly toolSpec: ToolSpec;
```

Defined in: [src/tools/function-tool.ts:105](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/tools/function-tool.ts#L105)

OpenAPI JSON specification for the tool.

#### Overrides

[`Tool`](/docs/api/typescript/Tool/index.md).[`toolSpec`](/docs/api/typescript/Tool/index.md#toolspec)

## Methods

### stream()

```ts
stream(toolContext): AsyncGenerator<ToolStreamEvent, ToolResultBlock, unknown>;
```

Defined in: [src/tools/function-tool.ts:166](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/tools/function-tool.ts#L166)

Executes the tool with streaming support. Handles all callback patterns (async generator, promise, sync) and converts results to ToolResultBlock.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `toolContext` | [`ToolContext`](/docs/api/typescript/ToolContext/index.md) | Context information including the tool use request and invocation state |

#### Returns

`AsyncGenerator`<[`ToolStreamEvent`](/docs/api/typescript/ToolStreamEvent/index.md), [`ToolResultBlock`](/docs/api/typescript/ToolResultBlock/index.md), `unknown`\>

Async generator that yields ToolStreamEvents and returns a ToolResultBlock

#### Overrides

[`Tool`](/docs/api/typescript/Tool/index.md).[`stream`](/docs/api/typescript/Tool/index.md#stream)