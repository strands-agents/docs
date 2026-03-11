```ts
type ContentBlockData =
  | TextBlockData
  | {
  toolUse: ToolUseBlockData;
}
  | {
  toolResult: ToolResultBlockData;
}
  | {
  reasoning: ReasoningBlockData;
}
  | {
  cachePoint: CachePointBlockData;
}
  | {
  guardContent: GuardContentBlockData;
}
  | {
  image: ImageBlockData;
}
  | {
  video: VideoBlockData;
}
  | {
  document: DocumentBlockData;
}
  | {
  citations: CitationsBlockData;
};
```

Defined in: [src/types/messages.ts:110](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/messages.ts#L110)

A block of content within a message. Content blocks can contain text, tool usage requests, tool results, reasoning content, cache points, guard content, or media (image, video, document).

This is a discriminated union where the object key determines the content format.

## Example

```typescript
if ('text' in block) {
  console.log(block.text.text)
}
```