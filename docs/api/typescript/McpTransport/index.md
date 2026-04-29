```ts
type McpTransport = Omit<Transport, "sessionId"> & {
  sessionId?: string;
};
```

Defined in: [src/mcp.ts:19](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/mcp.ts#L19)

Widened transport type that accepts MCP transport implementations without requiring explicit casts.

Under `exactOptionalPropertyTypes`, `StreamableHTTPClientTransport` is not directly assignable to `Transport` because its `sessionId` getter returns `string | undefined`, while `Transport` declares `sessionId?: string` (absent or string, but not explicitly undefined). This type relaxes that constraint so users can pass any MCP transport without `as Transport`.

## Type Declaration

| Name | Type | Defined in |
| --- | --- | --- |
| `sessionId?` | `string` | [src/mcp.ts:19](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/mcp.ts#L19) |