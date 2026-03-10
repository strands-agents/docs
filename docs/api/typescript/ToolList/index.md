```ts
type ToolList = (
  | Tool
  | McpClient
  | ToolList)[];
```

Defined in: [src/agent/agent.ts:63](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/agent/agent.ts#L63)

Recursive type definition for nested tool arrays. Allows tools to be organized in nested arrays of any depth.