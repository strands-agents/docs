```ts
type ToolList = (
  | Tool
  | McpClient
  | ToolList)[];
```

Defined in: [src/agent/agent.ts:73](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/agent.ts#L73)

Recursive type definition for nested tool arrays. Allows tools to be organized in nested arrays of any depth.