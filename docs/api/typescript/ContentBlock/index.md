```ts
type ContentBlock =
  | TextBlock
  | ToolUseBlock
  | ToolResultBlock
  | ReasoningBlock
  | CachePointBlock
  | GuardContentBlock
  | ImageBlock
  | VideoBlock
  | DocumentBlock
  | CitationsBlock;
```

Defined in: [src/types/messages.ts:122](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/messages.ts#L122)