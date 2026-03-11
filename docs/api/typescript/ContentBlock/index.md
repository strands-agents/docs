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

Defined in: [src/types/messages.ts:122](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/types/messages.ts#L122)