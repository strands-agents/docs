```ts
type ToolList = (
  | Tool
  | McpClient
  | ToolList)[];
```

Defined in: [src/agent/agent.ts:63](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/agent/agent.ts#L63)

Recursive type definition for nested tool arrays. Allows tools to be organized in nested arrays of any depth.