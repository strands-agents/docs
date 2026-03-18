```ts
function toolResultContentFromData(data): ToolResultContent;
```

Defined in: [src/types/messages.ts:394](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/messages.ts#L394)

Converts a single ToolResultContentData to a ToolResultContent class instance.

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | `ToolResultContentData` | The tool result content data to convert |

## Returns

[`ToolResultContent`](/docs/api/typescript/ToolResultContent/index.md)

A ToolResultContent instance of the appropriate type

## Throws

Error if the content data type is unknown