Defined in: [src/mcp.ts:37](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/mcp.ts#L37)

Configuration for MCP task-augmented tool execution.

WARNING: MCP Tasks is an experimental feature in both the MCP specification and this SDK. The API may change without notice in future versions.

When provided to McpClient, enables task-based tool invocation which supports long-running tools with progress tracking. Without this config, tools are called directly without task management.

## Properties

### ttl?

```ts
optional ttl?: number;
```

Defined in: [src/mcp.ts:42](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/mcp.ts#L42)

Time-to-live in milliseconds for task polling. Defaults to 60000 (60 seconds).

---

### pollTimeout?

```ts
optional pollTimeout?: number;
```

Defined in: [src/mcp.ts:48](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/mcp.ts#L48)

Maximum time in milliseconds to wait for task completion during polling. Defaults to 300000 (5 minutes).