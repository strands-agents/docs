```ts
type ToolList = (
  | Tool
  | McpClient
  | ToolList)[];
```

Defined in: [src/agent/agent.ts:63](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L63)

Recursive type definition for nested tool arrays. Allows tools to be organized in nested arrays of any depth.