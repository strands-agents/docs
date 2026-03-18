```ts
function contentBlockFromData(data): ContentBlock;
```

Defined in: [src/types/messages.ts:864](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/messages.ts#L864)

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