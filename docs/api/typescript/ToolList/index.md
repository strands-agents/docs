```ts
type ToolList = (
  | Tool
  | McpClient
  | ToolList)[];
```

Defined in: [src/agent/agent.ts:73](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/agent/agent.ts#L73)

Recursive type definition for nested tool arrays. Allows tools to be organized in nested arrays of any depth.