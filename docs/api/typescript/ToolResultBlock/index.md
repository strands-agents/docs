Defined in: [src/types/messages.ts:314](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L314)

Tool result content block.

## Implements

-   [`ToolResultBlockData`](/docs/api/typescript/ToolResultBlockData/index.md)
-   `JSONSerializable`<{ `toolResult`: [`ToolResultBlockData`](/docs/api/typescript/ToolResultBlockData/index.md); }>

## Constructors

### Constructor

```ts
new ToolResultBlock(data): ToolResultBlock;
```

Defined in: [src/types/messages.ts:342](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L342)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `toolUseId`: `string`; `status`: `"success"` | `"error"`; `content`: [`ToolResultContent`](/docs/api/typescript/ToolResultContent/index.md)\[\]; `error?`: `Error`; } |
| `data.toolUseId` | `string` |
| `data.status` | `"success"` | `"error"` |
| `data.content` | [`ToolResultContent`](/docs/api/typescript/ToolResultContent/index.md)\[\] |
| `data.error?` | `Error` |

#### Returns

`ToolResultBlock`

## Properties

### type

```ts
readonly type: "toolResultBlock";
```

Defined in: [src/types/messages.ts:318](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L318)

Discriminator for tool result content.

---

### toolUseId

```ts
readonly toolUseId: string;
```

Defined in: [src/types/messages.ts:323](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L323)

The ID of the tool use that this result corresponds to.

#### Implementation of

[`ToolResultBlockData`](/docs/api/typescript/ToolResultBlockData/index.md).[`toolUseId`](/docs/api/typescript/ToolResultBlockData/index.md#tooluseid)

---

### status

```ts
readonly status: "success" | "error";
```

Defined in: [src/types/messages.ts:328](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L328)

Status of the tool execution.

#### Implementation of

[`ToolResultBlockData`](/docs/api/typescript/ToolResultBlockData/index.md).[`status`](/docs/api/typescript/ToolResultBlockData/index.md#status)

---

### content

```ts
readonly content: ToolResultContent[];
```

Defined in: [src/types/messages.ts:333](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L333)

The content returned by the tool.

#### Implementation of

[`ToolResultBlockData`](/docs/api/typescript/ToolResultBlockData/index.md).[`content`](/docs/api/typescript/ToolResultBlockData/index.md#content)

---

### error?

```ts
readonly optional error: Error;
```

Defined in: [src/types/messages.ts:340](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L340)

The original error object when status is ‘error’. Available for inspection by hooks, error handlers, and agent loop. Tools must wrap non-Error thrown values into Error objects.

#### Implementation of

[`ToolResultBlockData`](/docs/api/typescript/ToolResultBlockData/index.md).[`error`](/docs/api/typescript/ToolResultBlockData/index.md#error)

## Methods

### toJSON()

```ts
toJSON(): {
  toolResult: ToolResultBlockData;
};
```

Defined in: [src/types/messages.ts:356](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L356)

Serializes the ToolResultBlock to a JSON-compatible ContentBlockData object. Called automatically by JSON.stringify(). Note: The error field is not serialized (deferred for future implementation).

#### Returns

```ts
{
  toolResult: ToolResultBlockData;
}
```

| Name | Type | Defined in |
| --- | --- | --- |
| `toolResult` | [`ToolResultBlockData`](/docs/api/typescript/ToolResultBlockData/index.md) | [src/types/messages.ts:356](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L356) |

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): ToolResultBlock;
```

Defined in: [src/types/messages.ts:372](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L372)

Creates a ToolResultBlock instance from its wrapped data format.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | { `toolResult`: [`ToolResultBlockData`](/docs/api/typescript/ToolResultBlockData/index.md); } | Wrapped ToolResultBlockData to deserialize |
| `data.toolResult` | [`ToolResultBlockData`](/docs/api/typescript/ToolResultBlockData/index.md) | \- |

#### Returns

`ToolResultBlock`

ToolResultBlock instance