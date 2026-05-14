```ts
type SystemPromptData = string | SystemContentBlockData[];
```

Defined in: [src/types/messages.ts:683](https://github.com/strands-agents/sdk-typescript/blob/13a12727f03fa603a6fe1163a9e2a97bd32f1e8c/strands-ts/src/types/messages.ts#L683)

Data representation of a system prompt. Can be a simple string or an array of system content block data for advanced caching.

This is the data interface counterpart to SystemPrompt, following the “Data” pattern.