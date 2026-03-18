```ts
type ToolList = (
  | Tool
  | McpClient
  | ToolList)[];
```

Defined in: [src/agent/agent.ts:73](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/agent/agent.ts#L73)

Recursive type definition for nested tool arrays. Allows tools to be organized in nested arrays of any depth.