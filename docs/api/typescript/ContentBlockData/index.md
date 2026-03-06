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

Defined in: [src/types/messages.ts:110](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/messages.ts#L110)

A block of content within a message. Content blocks can contain text, tool usage requests, tool results, reasoning content, cache points, guard content, or media (image, video, document).

This is a discriminated union where the object key determines the content format.

## Example

```typescript
if ('text' in block) {
  console.log(block.text.text)
}
```