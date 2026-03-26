Defined in: [src/types/messages.ts:211](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/messages.ts#L211)

Tool use content block.

## Implements

-   [<code dir="auto">ToolUseBlockData</code>](/docs/api/typescript/ToolUseBlockData/index.md)
-   `JSONSerializable`<{ `toolUse`: [<code dir="auto">ToolUseBlockData</code>](/docs/api/typescript/ToolUseBlockData/index.md); }>

## Constructors

### Constructor

```ts
new ToolUseBlock(data): ToolUseBlock;
```

Defined in: [src/types/messages.ts:239](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/messages.ts#L239)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [<code dir="auto">ToolUseBlockData</code>](/docs/api/typescript/ToolUseBlockData/index.md) |

#### Returns

`ToolUseBlock`

## Properties

### type

```ts
readonly type: "toolUseBlock";
```

Defined in: [src/types/messages.ts:215](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/messages.ts#L215)

Discriminator for tool use content.

---

### name

```ts
readonly name: string;
```

Defined in: [src/types/messages.ts:220](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/messages.ts#L220)

The name of the tool to execute.

#### Implementation of

[<code dir="auto">ToolUseBlockData</code>](/docs/api/typescript/ToolUseBlockData/index.md).[<code dir="auto">name</code>](/docs/api/typescript/ToolUseBlockData/index.md#name)

---

### toolUseId

```ts
readonly toolUseId: string;
```

Defined in: [src/types/messages.ts:225](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/messages.ts#L225)

Unique identifier for this tool use instance.

#### Implementation of

[<code dir="auto">ToolUseBlockData</code>](/docs/api/typescript/ToolUseBlockData/index.md).[<code dir="auto">toolUseId</code>](/docs/api/typescript/ToolUseBlockData/index.md#tooluseid)

---

### input

```ts
readonly input: JSONValue;
```

Defined in: [src/types/messages.ts:231](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/messages.ts#L231)

The input parameters for the tool. This can be any JSON-serializable value.

#### Implementation of

[<code dir="auto">ToolUseBlockData</code>](/docs/api/typescript/ToolUseBlockData/index.md).[<code dir="auto">input</code>](/docs/api/typescript/ToolUseBlockData/index.md#input)

---

### reasoningSignature?

```ts
readonly optional reasoningSignature?: string;
```

Defined in: [src/types/messages.ts:237](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/messages.ts#L237)

Reasoning signature from thinking models (e.g., Gemini). Must be preserved and sent back to the model for multi-turn tool use.

#### Implementation of

[<code dir="auto">ToolUseBlockData</code>](/docs/api/typescript/ToolUseBlockData/index.md).[<code dir="auto">reasoningSignature</code>](/docs/api/typescript/ToolUseBlockData/index.md#reasoningsignature)

## Methods

### toJSON()

```ts
toJSON(): {
  toolUse: ToolUseBlockData;
};
```

Defined in: [src/types/messages.ts:252](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/messages.ts#L252)

Serializes the ToolUseBlock to a JSON-compatible ContentBlockData object. Called automatically by JSON.stringify().

#### Returns

```ts
{
  toolUse: ToolUseBlockData;
}
```

| Name | Type | Defined in |
| --- | --- | --- |
| `toolUse` | [<code dir="auto">ToolUseBlockData</code>](/docs/api/typescript/ToolUseBlockData/index.md) | [src/types/messages.ts:252](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/messages.ts#L252) |

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): ToolUseBlock;
```

Defined in: [src/types/messages.ts:269](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/messages.ts#L269)

Creates a ToolUseBlock instance from its wrapped data format.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | { `toolUse`: [<code dir="auto">ToolUseBlockData</code>](/docs/api/typescript/ToolUseBlockData/index.md); } | Wrapped ToolUseBlockData to deserialize |
| `data.toolUse` | [<code dir="auto">ToolUseBlockData</code>](/docs/api/typescript/ToolUseBlockData/index.md) | \- |

#### Returns

`ToolUseBlock`

ToolUseBlock instance