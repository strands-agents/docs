```ts
type SystemPromptData = string | SystemContentBlockData[];
```

Defined in: [src/types/messages.ts:681](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/types/messages.ts#L681)

Data representation of a system prompt. Can be a simple string or an array of system content block data for advanced caching.

This is the data interface counterpart to SystemPrompt, following the “Data” pattern.