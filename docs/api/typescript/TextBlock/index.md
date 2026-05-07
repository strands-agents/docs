Defined in: [src/types/messages.ts:178](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L178)

Text content block within a message.

## Implements

-   [`TextBlockData`](/docs/api/typescript/TextBlockData/index.md)
-   `JSONSerializable`<[`TextBlockData`](/docs/api/typescript/TextBlockData/index.md)\>

## Constructors

### Constructor

```ts
new TextBlock(data): TextBlock;
```

Defined in: [src/types/messages.ts:189](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L189)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | `string` |

#### Returns

`TextBlock`

## Properties

### type

```ts
readonly type: "textBlock";
```

Defined in: [src/types/messages.ts:182](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L182)

Discriminator for text content.

---

### text

```ts
readonly text: string;
```

Defined in: [src/types/messages.ts:187](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L187)

Plain text content.

#### Implementation of

[`TextBlockData`](/docs/api/typescript/TextBlockData/index.md).[`text`](/docs/api/typescript/TextBlockData/index.md#text)

## Methods

### toJSON()

```ts
toJSON(): TextBlockData;
```

Defined in: [src/types/messages.ts:197](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L197)

Serializes the TextBlock to a JSON-compatible TextBlockData object. Called automatically by JSON.stringify().

#### Returns

[`TextBlockData`](/docs/api/typescript/TextBlockData/index.md)

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): TextBlock;
```

Defined in: [src/types/messages.ts:207](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L207)

Creates a TextBlock instance from TextBlockData.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | [`TextBlockData`](/docs/api/typescript/TextBlockData/index.md) | TextBlockData to deserialize |

#### Returns

`TextBlock`

TextBlock instance