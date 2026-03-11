```ts
type ToolList = (
  | Tool
  | McpClient
  | ToolList)[];
```

Defined in: [src/agent/agent.ts:64](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/agent/agent.ts#L64)

Recursive type definition for nested tool arrays. Allows tools to be organized in nested arrays of any depth.