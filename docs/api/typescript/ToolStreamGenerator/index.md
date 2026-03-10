```ts
type ToolStreamGenerator = AsyncGenerator<ToolStreamEvent, ToolResultBlock, undefined>;
```

Defined in: [src/tools/tool.ts:81](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/tools/tool.ts#L81)

Type alias for the async generator returned by tool stream methods. Yields ToolStreamEvents during execution and returns a ToolResultBlock.