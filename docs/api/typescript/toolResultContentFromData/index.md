```ts
function toolResultContentFromData(data): ToolResultContent;
```

Defined in: [src/types/messages.ts:425](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/messages.ts#L425)

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