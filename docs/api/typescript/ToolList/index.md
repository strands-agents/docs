```ts
type ToolList = (
  | Tool
  | McpClient
  | ToolList)[];
```

Defined in: [src/agent/agent.ts:64](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/agent.ts#L64)

Recursive type definition for nested tool arrays. Allows tools to be organized in nested arrays of any depth.