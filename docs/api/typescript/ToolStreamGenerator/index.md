```ts
type ToolStreamGenerator = AsyncGenerator<ToolStreamEvent, ToolResultBlock, undefined>;
```

Defined in: [src/tools/tool.ts:81](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/tools/tool.ts#L81)

Type alias for the async generator returned by tool stream methods. Yields ToolStreamEvents during execution and returns a ToolResultBlock.