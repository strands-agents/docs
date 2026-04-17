```ts
type ToolList = (
  | Tool
  | McpClient
  | Agent
  | ToolList)[];
```

Defined in: [src/agent/agent.ts:81](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/agent/agent.ts#L81)

Recursive type definition for nested tool arrays. Allows tools to be organized in nested arrays of any depth.

[Agent](/docs/api/typescript/Agent/index.md) instances in the array are automatically wrapped via [Agent.asTool](/docs/api/typescript/Agent/index.md#astool), so they can be passed directly without calling `.asTool()` explicitly.