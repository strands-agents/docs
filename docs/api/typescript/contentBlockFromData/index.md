```ts
function contentBlockFromData(data): ContentBlock;
```

Defined in: [src/types/messages.ts:864](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/messages.ts#L864)

Converts ContentBlockData to a ContentBlock instance. Handles all content block types including text, tool use/result, reasoning, cache points, guard content, and media blocks.

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | [<code dir="auto">ContentBlockData</code>](/docs/api/typescript/ContentBlockData/index.md) | The content block data to convert |

## Returns

[<code dir="auto">ContentBlock</code>](/docs/api/typescript/ContentBlock/index.md)

A ContentBlock instance of the appropriate type

## Throws

Error if the content block type is unknown