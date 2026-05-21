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

Defined in: [src/types/messages.ts:153](https://github.com/strands-agents/sdk-typescript/blob/4dd13ca32f73cd4603a1d468e3e5f60292a88334/strands-ts/src/types/messages.ts#L153)