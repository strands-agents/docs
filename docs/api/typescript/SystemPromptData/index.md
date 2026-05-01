```ts
type SystemPromptData = string | SystemContentBlockData[];
```

Defined in: [src/types/messages.ts:681](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/messages.ts#L681)

Data representation of a system prompt. Can be a simple string or an array of system content block data for advanced caching.

This is the data interface counterpart to SystemPrompt, following the “Data” pattern.