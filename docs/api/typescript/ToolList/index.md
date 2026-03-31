```ts
type ToolList = (
  | Tool
  | McpClient
  | ToolList)[];
```

Defined in: [src/agent/agent.ts:74](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/agent/agent.ts#L74)

Recursive type definition for nested tool arrays. Allows tools to be organized in nested arrays of any depth.