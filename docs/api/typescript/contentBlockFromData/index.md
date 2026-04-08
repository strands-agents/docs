```ts
function contentBlockFromData(data): ContentBlock;
```

Defined in: [src/types/messages.ts:866](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L866)

Converts ContentBlockData to a ContentBlock instance. Handles all content block types including text, tool use/result, reasoning, cache points, guard content, and media blocks.

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | [`ContentBlockData`](/docs/api/typescript/ContentBlockData/index.md) | The content block data to convert |

## Returns

[`ContentBlock`](/docs/api/typescript/ContentBlock/index.md)

A ContentBlock instance of the appropriate type

## Throws

Error if the content block type is unknown