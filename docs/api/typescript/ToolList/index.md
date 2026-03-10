```ts
type ToolList = (
  | Tool
  | McpClient
  | ToolList)[];
```

Defined in: [src/agent/agent.ts:63](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/agent/agent.ts#L63)

Recursive type definition for nested tool arrays. Allows tools to be organized in nested arrays of any depth.