Defined in: [src/mcp.ts:25](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/mcp.ts#L25)

Configuration for MCP task-augmented tool execution.

WARNING: MCP Tasks is an experimental feature in both the MCP specification and this SDK. The API may change without notice in future versions.

When provided to McpClient, enables task-based tool invocation which supports long-running tools with progress tracking. Without this config, tools are called directly without task management.

## Properties

### ttl?

```ts
optional ttl: number;
```

Defined in: [src/mcp.ts:30](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/mcp.ts#L30)

Time-to-live in milliseconds for task polling. Defaults to 60000 (60 seconds).

---

### pollTimeout?

```ts
optional pollTimeout: number;
```

Defined in: [src/mcp.ts:36](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/mcp.ts#L36)

Maximum time in milliseconds to wait for task completion during polling. Defaults to 300000 (5 minutes).