```ts
type ToolList = (
  | Tool
  | McpClient
  | ToolList)[];
```

Defined in: [src/agent/agent.ts:73](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/agent/agent.ts#L73)

Recursive type definition for nested tool arrays. Allows tools to be organized in nested arrays of any depth.