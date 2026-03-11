```ts
type McpClientConfig = RuntimeConfig & {
  transport: Transport;
  disableMcpInstrumentation?: boolean;
  tasksConfig?: TasksConfig;
};
```

Defined in: [src/mcp.ts:40](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/mcp.ts#L40)

Arguments for configuring an MCP Client.

## Type Declaration

| Name | Type | Description | Defined in |
| --- | --- | --- | --- |
| `transport` | `Transport` | \- | [src/mcp.ts:41](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/mcp.ts#L41) |
| `disableMcpInstrumentation?` | `boolean` | Disable OpenTelemetry MCP instrumentation. | [src/mcp.ts:44](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/mcp.ts#L44) |
| `tasksConfig?` | [`TasksConfig`](/docs/api/typescript/TasksConfig/index.md) | Configuration for task-augmented tool execution (experimental). When provided (even as empty object), enables MCP task-based tool invocation. When undefined, tools are called directly without task management. | [src/mcp.ts:51](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/mcp.ts#L51) |