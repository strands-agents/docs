Defined in: [src/types/messages.ts:147](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/messages.ts#L147)

Text content block within a message.

## Implements

-   [<code dir="auto">TextBlockData</code>](/docs/api/typescript/TextBlockData/index.md)
-   `JSONSerializable`<[<code dir="auto">TextBlockData</code>](/docs/api/typescript/TextBlockData/index.md)\>

## Constructors

### Constructor

```ts
new TextBlock(data): TextBlock;
```

Defined in: [src/types/messages.ts:158](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/messages.ts#L158)

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

Defined in: [src/types/messages.ts:151](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/messages.ts#L151)

Discriminator for text content.

---

### text

```ts
readonly text: string;
```

Defined in: [src/types/messages.ts:156](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/messages.ts#L156)

Plain text content.

#### Implementation of

[<code dir="auto">TextBlockData</code>](/docs/api/typescript/TextBlockData/index.md).[<code dir="auto">text</code>](/docs/api/typescript/TextBlockData/index.md#text)

## Methods

### toJSON()

```ts
toJSON(): TextBlockData;
```

Defined in: [src/types/messages.ts:166](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/messages.ts#L166)

Serializes the TextBlock to a JSON-compatible TextBlockData object. Called automatically by JSON.stringify().

#### Returns

[<code dir="auto">TextBlockData</code>](/docs/api/typescript/TextBlockData/index.md)

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): TextBlock;
```

Defined in: [src/types/messages.ts:176](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/messages.ts#L176)

Creates a TextBlock instance from TextBlockData.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | [<code dir="auto">TextBlockData</code>](/docs/api/typescript/TextBlockData/index.md) | TextBlockData to deserialize |

#### Returns

`TextBlock`

TextBlock instance