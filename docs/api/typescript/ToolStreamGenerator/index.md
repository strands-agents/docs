```ts
type ToolStreamGenerator = AsyncGenerator<ToolStreamEvent, ToolResultBlock, undefined>;
```

Defined in: [src/tools/tool.ts:81](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/tools/tool.ts#L81)

Type alias for the async generator returned by tool stream methods. Yields ToolStreamEvents during execution and returns a ToolResultBlock.