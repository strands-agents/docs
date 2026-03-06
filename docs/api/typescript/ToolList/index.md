```ts
type ToolList = (
  | Tool
  | McpClient
  | ToolList)[];
```

Defined in: [src/agent/agent.ts:62](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/agent/agent.ts#L62)

Recursive type definition for nested tool arrays. Allows tools to be organized in nested arrays of any depth.