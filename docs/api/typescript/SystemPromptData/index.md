```ts
type SystemPromptData = string | SystemContentBlockData[];
```

Defined in: [src/types/messages.ts:635](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L635)

Data representation of a system prompt. Can be a simple string or an array of system content block data for advanced caching.

This is the data interface counterpart to SystemPrompt, following the “Data” pattern.