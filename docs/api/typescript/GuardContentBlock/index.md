Defined in: [src/types/messages.ts:778](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L778)

Guard content block for guardrail evaluation. Marks content that should be evaluated by guardrails for safety, grounding, or other policies. Can be used in both message content and system prompts.

## Implements

-   [<code dir="auto">GuardContentBlockData</code>](/docs/api/typescript/GuardContentBlockData/index.md)
-   `JSONSerializable`<{ `guardContent`: `Serialized`<[<code dir="auto">GuardContentBlockData</code>](/docs/api/typescript/GuardContentBlockData/index.md)\>; }>

## Constructors

### Constructor

```ts
new GuardContentBlock(data): GuardContentBlock;
```

Defined in: [src/types/messages.ts:796](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L796)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [<code dir="auto">GuardContentBlockData</code>](/docs/api/typescript/GuardContentBlockData/index.md) |

#### Returns

`GuardContentBlock`

## Properties

### type

```ts
readonly type: "guardContentBlock";
```

Defined in: [src/types/messages.ts:784](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L784)

Discriminator for guard content.

---

### text?

```ts
readonly optional text?: GuardContentText;
```

Defined in: [src/types/messages.ts:789](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L789)

Text content with evaluation qualifiers.

#### Implementation of

[<code dir="auto">GuardContentBlockData</code>](/docs/api/typescript/GuardContentBlockData/index.md).[<code dir="auto">text</code>](/docs/api/typescript/GuardContentBlockData/index.md#text)

---

### image?

```ts
readonly optional image?: GuardContentImage;
```

Defined in: [src/types/messages.ts:794](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L794)

Image content with evaluation qualifiers.

#### Implementation of

[<code dir="auto">GuardContentBlockData</code>](/docs/api/typescript/GuardContentBlockData/index.md).[<code dir="auto">image</code>](/docs/api/typescript/GuardContentBlockData/index.md#image)

## Methods

### toJSON()

```ts
toJSON(): {
  guardContent: {
     text?: {
        qualifiers: GuardQualifier[];
        text: string;
     };
     image?: {
        format: GuardImageFormat;
        source: {
           bytes: string;
        };
     };
  };
};
```

Defined in: [src/types/messages.ts:816](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L816)

Serializes the GuardContentBlock to a JSON-compatible ContentBlockData object. Called automatically by JSON.stringify(). Uint8Array image bytes are encoded as base64 string.

#### Returns

```ts
{
  guardContent: {
     text?: {
        qualifiers: GuardQualifier[];
        text: string;
     };
     image?: {
        format: GuardImageFormat;
        source: {
           bytes: string;
        };
     };
  };
}
```

| Name | Type | Description | Defined in |
| --- | --- | --- | --- |
| `guardContent` | { `text?`: { `qualifiers`: [<code dir="auto">GuardQualifier</code>](/docs/api/typescript/GuardQualifier/index.md)\[\]; `text`: `string`; }; `image?`: { `format`: [<code dir="auto">GuardImageFormat</code>](/docs/api/typescript/GuardImageFormat/index.md); `source`: { `bytes`: `string`; }; }; } | \- | [src/types/messages.ts:816](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L816) |
| `guardContent.text?` | { `qualifiers`: [<code dir="auto">GuardQualifier</code>](/docs/api/typescript/GuardQualifier/index.md)\[\]; `text`: `string`; } | Text content with evaluation qualifiers. | [src/types/messages.ts:765](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L765) |
| `guardContent.text.qualifiers` | [<code dir="auto">GuardQualifier</code>](/docs/api/typescript/GuardQualifier/index.md)\[\] | Qualifiers that specify how this content should be evaluated. | [src/types/messages.ts:734](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L734) |
| `guardContent.text.text` | `string` | The text content to be evaluated. | [src/types/messages.ts:739](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L739) |
| `guardContent.image?` | { `format`: [<code dir="auto">GuardImageFormat</code>](/docs/api/typescript/GuardImageFormat/index.md); `source`: { `bytes`: `string`; }; } | Image content with evaluation qualifiers. | [src/types/messages.ts:770](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L770) |
| `guardContent.image.format` | [<code dir="auto">GuardImageFormat</code>](/docs/api/typescript/GuardImageFormat/index.md) | Image format. | [src/types/messages.ts:749](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L749) |
| `guardContent.image.source` | { `bytes`: `string`; } | Image source (bytes only). | [src/types/messages.ts:754](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L754) |
| `guardContent.image.source.bytes` | `string` | \- | [src/types/messages.ts:725](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L725) |

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): GuardContentBlock;
```

Defined in: [src/types/messages.ts:837](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L837)

Creates a GuardContentBlock instance from its wrapped data format. Base64-encoded image bytes are decoded back to Uint8Array.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | { `guardContent`: { `text?`: { `qualifiers`: [<code dir="auto">GuardQualifier</code>](/docs/api/typescript/GuardQualifier/index.md)\[\]; `text`: `string`; }; `image?`: { `format`: [<code dir="auto">GuardImageFormat</code>](/docs/api/typescript/GuardImageFormat/index.md); `source`: { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; }; }; }; } | Wrapped GuardContentBlockData to deserialize (accepts both string and Uint8Array for image bytes) |
| `data.guardContent` | { `text?`: { `qualifiers`: [<code dir="auto">GuardQualifier</code>](/docs/api/typescript/GuardQualifier/index.md)\[\]; `text`: `string`; }; `image?`: { `format`: [<code dir="auto">GuardImageFormat</code>](/docs/api/typescript/GuardImageFormat/index.md); `source`: { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; }; }; } | \- |
| `data.guardContent.text?` | { `qualifiers`: [<code dir="auto">GuardQualifier</code>](/docs/api/typescript/GuardQualifier/index.md)\[\]; `text`: `string`; } | Text content with evaluation qualifiers. |
| `data.guardContent.text.qualifiers` | [<code dir="auto">GuardQualifier</code>](/docs/api/typescript/GuardQualifier/index.md)\[\] | Qualifiers that specify how this content should be evaluated. |
| `data.guardContent.text.text` | `string` | The text content to be evaluated. |
| `data.guardContent.image?` | { `format`: [<code dir="auto">GuardImageFormat</code>](/docs/api/typescript/GuardImageFormat/index.md); `source`: { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; }; } | Image content with evaluation qualifiers. |
| `data.guardContent.image.format` | [<code dir="auto">GuardImageFormat</code>](/docs/api/typescript/GuardImageFormat/index.md) | Image format. |
| `data.guardContent.image.source` | { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; } | Image source (bytes only). |
| `data.guardContent.image.source.bytes` | `string` | `Uint8Array`<`ArrayBufferLike`\> | \- |

#### Returns

`GuardContentBlock`

GuardContentBlock instance