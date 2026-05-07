Defined in: [src/mcp.ts:43](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/mcp.ts#L43)

Configuration for MCP task-augmented tool execution.

WARNING: MCP Tasks is an experimental feature in both the MCP specification and this SDK. The API may change without notice in future versions.

When provided to McpClient, enables task-based tool invocation which supports long-running tools with progress tracking. Without this config, tools are called directly without task management.

## Properties

### ttl?

```ts
optional ttl?: number;
```

Defined in: [src/mcp.ts:48](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/mcp.ts#L48)

Time-to-live in milliseconds for task polling. Defaults to 60000 (60 seconds).

---

### pollTimeout?

```ts
optional pollTimeout?: number;
```

Defined in: [src/mcp.ts:54](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/mcp.ts#L54)

Maximum time in milliseconds to wait for task completion during polling. Defaults to 300000 (5 minutes).