```ts
type ToolList = (
  | Tool
  | McpClient
  | ToolList)[];
```

Defined in: [src/agent/agent.ts:73](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/agent/agent.ts#L73)

Recursive type definition for nested tool arrays. Allows tools to be organized in nested arrays of any depth.