```ts
type ToolList = (
  | Tool
  | McpClient
  | ToolList)[];
```

Defined in: [src/agent/agent.ts:63](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/agent/agent.ts#L63)

Recursive type definition for nested tool arrays. Allows tools to be organized in nested arrays of any depth.