```ts
type McpClientConfig = RuntimeConfig & {
  transport: McpTransport;
  disableMcpInstrumentation?: boolean;
  tasksConfig?: TasksConfig;
  elicitationCallback?: ElicitationCallback;
};
```

Defined in: [src/mcp.ts:52](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/mcp.ts#L52)

Arguments for configuring an MCP Client.

## Type Declaration

| Name | Type | Description | Defined in |
| --- | --- | --- | --- |
| `transport` | [`McpTransport`](/docs/api/typescript/McpTransport/index.md) | \- | [src/mcp.ts:53](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/mcp.ts#L53) |
| `disableMcpInstrumentation?` | `boolean` | Disable OpenTelemetry MCP instrumentation. | [src/mcp.ts:56](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/mcp.ts#L56) |
| `tasksConfig?` | [`TasksConfig`](/docs/api/typescript/TasksConfig/index.md) | Configuration for task-augmented tool execution (experimental). When provided (even as empty object), enables MCP task-based tool invocation. When undefined, tools are called directly without task management. | [src/mcp.ts:63](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/mcp.ts#L63) |
| `elicitationCallback?` | [`ElicitationCallback`](/docs/api/typescript/ElicitationCallback/index.md) | Callback to handle server-initiated elicitation requests. When provided, the client advertises elicitation support (form + url modes) and routes incoming elicitation requests to this callback. | [src/mcp.ts:70](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/mcp.ts#L70) |