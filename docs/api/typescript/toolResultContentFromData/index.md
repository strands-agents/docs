```ts
function toolResultContentFromData(data): ToolResultContent;
```

Defined in: [src/types/messages.ts:394](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/messages.ts#L394)

Converts a single ToolResultContentData to a ToolResultContent class instance.

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | `ToolResultContentData` | The tool result content data to convert |

## Returns

[<code dir="auto">ToolResultContent</code>](/docs/api/typescript/ToolResultContent/index.md)

A ToolResultContent instance of the appropriate type

## Throws

Error if the content data type is unknown