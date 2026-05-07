Defined in: [src/types/messages.ts:242](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L242)

Tool use content block.

## Implements

-   [`ToolUseBlockData`](/docs/api/typescript/ToolUseBlockData/index.md)
-   `JSONSerializable`<{ `toolUse`: [`ToolUseBlockData`](/docs/api/typescript/ToolUseBlockData/index.md); }>

## Constructors

### Constructor

```ts
new ToolUseBlock(data): ToolUseBlock;
```

Defined in: [src/types/messages.ts:270](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L270)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [`ToolUseBlockData`](/docs/api/typescript/ToolUseBlockData/index.md) |

#### Returns

`ToolUseBlock`

## Properties

### type

```ts
readonly type: "toolUseBlock";
```

Defined in: [src/types/messages.ts:246](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L246)

Discriminator for tool use content.

---

### name

```ts
readonly name: string;
```

Defined in: [src/types/messages.ts:251](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L251)

The name of the tool to execute.

#### Implementation of

[`ToolUseBlockData`](/docs/api/typescript/ToolUseBlockData/index.md).[`name`](/docs/api/typescript/ToolUseBlockData/index.md#name)

---

### toolUseId

```ts
readonly toolUseId: string;
```

Defined in: [src/types/messages.ts:256](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L256)

Unique identifier for this tool use instance.

#### Implementation of

[`ToolUseBlockData`](/docs/api/typescript/ToolUseBlockData/index.md).[`toolUseId`](/docs/api/typescript/ToolUseBlockData/index.md#tooluseid)

---

### input

```ts
readonly input: JSONValue;
```

Defined in: [src/types/messages.ts:262](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L262)

The input parameters for the tool. This can be any JSON-serializable value.

#### Implementation of

[`ToolUseBlockData`](/docs/api/typescript/ToolUseBlockData/index.md).[`input`](/docs/api/typescript/ToolUseBlockData/index.md#input)

---

### reasoningSignature?

```ts
readonly optional reasoningSignature?: string;
```

Defined in: [src/types/messages.ts:268](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L268)

Reasoning signature from thinking models (e.g., Gemini). Must be preserved and sent back to the model for multi-turn tool use.

#### Implementation of

[`ToolUseBlockData`](/docs/api/typescript/ToolUseBlockData/index.md).[`reasoningSignature`](/docs/api/typescript/ToolUseBlockData/index.md#reasoningsignature)

## Methods

### toJSON()

```ts
toJSON(): {
  toolUse: ToolUseBlockData;
};
```

Defined in: [src/types/messages.ts:283](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L283)

Serializes the ToolUseBlock to a JSON-compatible ContentBlockData object. Called automatically by JSON.stringify().

#### Returns

```ts
{
  toolUse: ToolUseBlockData;
}
```

| Name | Type | Defined in |
| --- | --- | --- |
| `toolUse` | [`ToolUseBlockData`](/docs/api/typescript/ToolUseBlockData/index.md) | [src/types/messages.ts:283](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L283) |

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): ToolUseBlock;
```

Defined in: [src/types/messages.ts:300](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L300)

Creates a ToolUseBlock instance from its wrapped data format.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | { `toolUse`: [`ToolUseBlockData`](/docs/api/typescript/ToolUseBlockData/index.md); } | Wrapped ToolUseBlockData to deserialize |
| `data.toolUse` | [`ToolUseBlockData`](/docs/api/typescript/ToolUseBlockData/index.md) | \- |

#### Returns

`ToolUseBlock`

ToolUseBlock instance