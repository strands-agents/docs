```ts
type ContentBlockDelta =
  | TextDelta
  | ToolUseInputDelta
  | ReasoningContentDelta
  | CitationsDelta;
```

Defined in: [src/models/streaming.ts:327](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L327)

A delta (incremental chunk) of content within a content block. Can be text, tool use input, or reasoning content.

This is a discriminated union for type-safe delta handling.