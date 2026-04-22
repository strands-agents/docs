Defined in: [src/types/messages.ts:811](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/messages.ts#L811)

Guard content block for guardrail evaluation. Marks content that should be evaluated by guardrails for safety, grounding, or other policies. Can be used in both message content and system prompts.

## Implements

-   [`GuardContentBlockData`](/docs/api/typescript/GuardContentBlockData/index.md)
-   `JSONSerializable`<{ `guardContent`: `Serialized`<[`GuardContentBlockData`](/docs/api/typescript/GuardContentBlockData/index.md)\>; }>

## Constructors

### Constructor

```ts
new GuardContentBlock(data): GuardContentBlock;
```

Defined in: [src/types/messages.ts:829](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/messages.ts#L829)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [`GuardContentBlockData`](/docs/api/typescript/GuardContentBlockData/index.md) |

#### Returns

`GuardContentBlock`

## Properties

### type

```ts
readonly type: "guardContentBlock";
```

Defined in: [src/types/messages.ts:817](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/messages.ts#L817)

Discriminator for guard content.

---

### text?

```ts
readonly optional text?: GuardContentText;
```

Defined in: [src/types/messages.ts:822](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/messages.ts#L822)

Text content with evaluation qualifiers.

#### Implementation of

[`GuardContentBlockData`](/docs/api/typescript/GuardContentBlockData/index.md).[`text`](/docs/api/typescript/GuardContentBlockData/index.md#text)

---

### image?

```ts
readonly optional image?: GuardContentImage;
```

Defined in: [src/types/messages.ts:827](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/messages.ts#L827)

Image content with evaluation qualifiers.

#### Implementation of

[`GuardContentBlockData`](/docs/api/typescript/GuardContentBlockData/index.md).[`image`](/docs/api/typescript/GuardContentBlockData/index.md#image)

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

Defined in: [src/types/messages.ts:849](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/messages.ts#L849)

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
| `guardContent` | { `text?`: { `qualifiers`: [`GuardQualifier`](/docs/api/typescript/GuardQualifier/index.md)\[\]; `text`: `string`; }; `image?`: { `format`: [`GuardImageFormat`](/docs/api/typescript/GuardImageFormat/index.md); `source`: { `bytes`: `string`; }; }; } | \- | [src/types/messages.ts:849](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/messages.ts#L849) |
| `guardContent.text?` | { `qualifiers`: [`GuardQualifier`](/docs/api/typescript/GuardQualifier/index.md)\[\]; `text`: `string`; } | Text content with evaluation qualifiers. | [src/types/messages.ts:798](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/messages.ts#L798) |
| `guardContent.text.qualifiers` | [`GuardQualifier`](/docs/api/typescript/GuardQualifier/index.md)\[\] | Qualifiers that specify how this content should be evaluated. | [src/types/messages.ts:767](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/messages.ts#L767) |
| `guardContent.text.text` | `string` | The text content to be evaluated. | [src/types/messages.ts:772](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/messages.ts#L772) |
| `guardContent.image?` | { `format`: [`GuardImageFormat`](/docs/api/typescript/GuardImageFormat/index.md); `source`: { `bytes`: `string`; }; } | Image content with evaluation qualifiers. | [src/types/messages.ts:803](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/messages.ts#L803) |
| `guardContent.image.format` | [`GuardImageFormat`](/docs/api/typescript/GuardImageFormat/index.md) | Image format. | [src/types/messages.ts:782](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/messages.ts#L782) |
| `guardContent.image.source` | { `bytes`: `string`; } | Image source (bytes only). | [src/types/messages.ts:787](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/messages.ts#L787) |
| `guardContent.image.source.bytes` | `string` | \- | [src/types/messages.ts:758](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/messages.ts#L758) |

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): GuardContentBlock;
```

Defined in: [src/types/messages.ts:870](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/messages.ts#L870)

Creates a GuardContentBlock instance from its wrapped data format. Base64-encoded image bytes are decoded back to Uint8Array.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | { `guardContent`: { `text?`: { `qualifiers`: [`GuardQualifier`](/docs/api/typescript/GuardQualifier/index.md)\[\]; `text`: `string`; }; `image?`: { `format`: [`GuardImageFormat`](/docs/api/typescript/GuardImageFormat/index.md); `source`: { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; }; }; }; } | Wrapped GuardContentBlockData to deserialize (accepts both string and Uint8Array for image bytes) |
| `data.guardContent` | { `text?`: { `qualifiers`: [`GuardQualifier`](/docs/api/typescript/GuardQualifier/index.md)\[\]; `text`: `string`; }; `image?`: { `format`: [`GuardImageFormat`](/docs/api/typescript/GuardImageFormat/index.md); `source`: { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; }; }; } | \- |
| `data.guardContent.text?` | { `qualifiers`: [`GuardQualifier`](/docs/api/typescript/GuardQualifier/index.md)\[\]; `text`: `string`; } | Text content with evaluation qualifiers. |
| `data.guardContent.text.qualifiers` | [`GuardQualifier`](/docs/api/typescript/GuardQualifier/index.md)\[\] | Qualifiers that specify how this content should be evaluated. |
| `data.guardContent.text.text` | `string` | The text content to be evaluated. |
| `data.guardContent.image?` | { `format`: [`GuardImageFormat`](/docs/api/typescript/GuardImageFormat/index.md); `source`: { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; }; } | Image content with evaluation qualifiers. |
| `data.guardContent.image.format` | [`GuardImageFormat`](/docs/api/typescript/GuardImageFormat/index.md) | Image format. |
| `data.guardContent.image.source` | { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; } | Image source (bytes only). |
| `data.guardContent.image.source.bytes` | `string` | `Uint8Array`<`ArrayBufferLike`\> | \- |

#### Returns

`GuardContentBlock`

GuardContentBlock instance