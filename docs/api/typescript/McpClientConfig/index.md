```ts
type McpClientConfig = RuntimeConfig & {
  transport: McpTransport;
  disableMcpInstrumentation?: boolean;
  tasksConfig?: TasksConfig;
  elicitationCallback?: ElicitationCallback;
  failOpen?: boolean;
  logHandler?: (params) => void;
};
```

Defined in: [src/mcp.ts:61](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/mcp.ts#L61)

Arguments for configuring an MCP Client.

## Type Declaration

| Name | Type | Description | Defined in |
| --- | --- | --- | --- |
| `transport` | [`McpTransport`](/docs/api/typescript/McpTransport/index.md) | \- | [src/mcp.ts:62](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/mcp.ts#L62) |
| `disableMcpInstrumentation?` | `boolean` | Disable OpenTelemetry MCP instrumentation. | [src/mcp.ts:65](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/mcp.ts#L65) |
| `tasksConfig?` | [`TasksConfig`](/docs/api/typescript/TasksConfig/index.md) | Configuration for task-augmented tool execution (experimental). When provided (even as empty object), enables MCP task-based tool invocation. When undefined, tools are called directly without task management. | [src/mcp.ts:72](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/mcp.ts#L72) |
| `elicitationCallback?` | [`ElicitationCallback`](/docs/api/typescript/ElicitationCallback/index.md) | Callback to handle server-initiated elicitation requests. When provided, the client advertises elicitation support (form + url modes) and routes incoming elicitation requests to this callback. | [src/mcp.ts:79](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/mcp.ts#L79) |
| `failOpen?` | `boolean` | When true, connection failures are logged as warnings instead of throwing. | [src/mcp.ts:82](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/mcp.ts#L82) |
| `logHandler()?` | (`params`) => `void` | Called when the server emits a log message. Defaults to routing through the Strands logger. | [src/mcp.ts:85](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/mcp.ts#L85) |