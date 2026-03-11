```ts
type ToolList = (
  | Tool
  | McpClient
  | ToolList)[];
```

Defined in: [src/agent/agent.ts:64](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/agent/agent.ts#L64)

Recursive type definition for nested tool arrays. Allows tools to be organized in nested arrays of any depth.