```ts
type ContentBlockDelta =
  | TextDelta
  | ToolUseInputDelta
  | ReasoningContentDelta
  | CitationsDelta;
```

Defined in: [src/models/streaming.ts:327](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/streaming.ts#L327)

A delta (incremental chunk) of content within a content block. Can be text, tool use input, or reasoning content.

This is a discriminated union for type-safe delta handling.