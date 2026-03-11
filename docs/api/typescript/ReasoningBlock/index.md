Defined in: [src/types/messages.ts:413](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/messages.ts#L413)

Reasoning content block within a message.

## Implements

-   [`ReasoningBlockData`](/docs/api/typescript/ReasoningBlockData/index.md)
-   `JSONSerializable`<{ `reasoning`: `Serialized`<[`ReasoningBlockData`](/docs/api/typescript/ReasoningBlockData/index.md)\>; }>

## Constructors

### Constructor

```ts
new ReasoningBlock(data): ReasoningBlock;
```

Defined in: [src/types/messages.ts:436](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/messages.ts#L436)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [`ReasoningBlockData`](/docs/api/typescript/ReasoningBlockData/index.md) |

#### Returns

`ReasoningBlock`

## Properties

### type

```ts
readonly type: "reasoningBlock";
```

Defined in: [src/types/messages.ts:419](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/messages.ts#L419)

Discriminator for reasoning content.

---

### text?

```ts
readonly optional text: string;
```

Defined in: [src/types/messages.ts:424](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/messages.ts#L424)

The text content of the reasoning process.

#### Implementation of

[`ReasoningBlockData`](/docs/api/typescript/ReasoningBlockData/index.md).[`text`](/docs/api/typescript/ReasoningBlockData/index.md#text)

---

### signature?

```ts
readonly optional signature: string;
```

Defined in: [src/types/messages.ts:429](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/messages.ts#L429)

A cryptographic signature for verification purposes.

#### Implementation of

[`ReasoningBlockData`](/docs/api/typescript/ReasoningBlockData/index.md).[`signature`](/docs/api/typescript/ReasoningBlockData/index.md#signature)

---

### redactedContent?

```ts
readonly optional redactedContent: Uint8Array;
```

Defined in: [src/types/messages.ts:434](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/messages.ts#L434)

The redacted content of the reasoning process.

#### Implementation of

[`ReasoningBlockData`](/docs/api/typescript/ReasoningBlockData/index.md).[`redactedContent`](/docs/api/typescript/ReasoningBlockData/index.md#redactedcontent)

## Methods

### toJSON()

```ts
toJSON(): {
  reasoning: {
     text?: string;
     signature?: string;
     redactedContent?: string;
  };
};
```

Defined in: [src/types/messages.ts:453](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/messages.ts#L453)

Serializes the ReasoningBlock to a JSON-compatible ContentBlockData object. Called automatically by JSON.stringify(). Uint8Array redactedContent is encoded as base64 string.

#### Returns

```ts
{
  reasoning: {
     text?: string;
     signature?: string;
     redactedContent?: string;
  };
}
```

| Name | Type | Description | Defined in |
| --- | --- | --- | --- |
| `reasoning` | { `text?`: `string`; `signature?`: `string`; `redactedContent?`: `string`; } | \- | [src/types/messages.ts:453](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/messages.ts#L453) |
| `reasoning.text?` | `string` | The text content of the reasoning process. | [src/types/messages.ts:397](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/messages.ts#L397) |
| `reasoning.signature?` | `string` | A cryptographic signature for verification purposes. | [src/types/messages.ts:402](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/messages.ts#L402) |
| `reasoning.redactedContent?` | `string` | The redacted content of the reasoning process. | [src/types/messages.ts:407](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/messages.ts#L407) |

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): ReasoningBlock;
```

Defined in: [src/types/messages.ts:470](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/messages.ts#L470)

Creates a ReasoningBlock instance from its wrapped data format. Base64-encoded redactedContent is decoded back to Uint8Array.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | { `reasoning`: { `text?`: `string`; `signature?`: `string`; `redactedContent?`: `string` | `Uint8Array`<`ArrayBufferLike`\>; }; } | Wrapped ReasoningBlockData to deserialize (accepts both string and Uint8Array for redactedContent) |
| `data.reasoning` | { `text?`: `string`; `signature?`: `string`; `redactedContent?`: `string` | `Uint8Array`<`ArrayBufferLike`\>; } | \- |
| `data.reasoning.text?` | `string` | The text content of the reasoning process. |
| `data.reasoning.signature?` | `string` | A cryptographic signature for verification purposes. |
| `data.reasoning.redactedContent?` | `string` | `Uint8Array`<`ArrayBufferLike`\> | The redacted content of the reasoning process. |

#### Returns

`ReasoningBlock`

ReasoningBlock instance