```ts
type SystemPromptData = string | SystemContentBlockData[];
```

Defined in: [src/types/messages.ts:648](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/messages.ts#L648)

Data representation of a system prompt. Can be a simple string or an array of system content block data for advanced caching.

This is the data interface counterpart to SystemPrompt, following the “Data” pattern.