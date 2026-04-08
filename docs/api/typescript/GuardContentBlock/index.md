Defined in: [src/types/messages.ts:780](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L780)

Guard content block for guardrail evaluation. Marks content that should be evaluated by guardrails for safety, grounding, or other policies. Can be used in both message content and system prompts.

## Implements

-   [`GuardContentBlockData`](/docs/api/typescript/GuardContentBlockData/index.md)
-   `JSONSerializable`<{ `guardContent`: `Serialized`<[`GuardContentBlockData`](/docs/api/typescript/GuardContentBlockData/index.md)\>; }>

## Constructors

### Constructor

```ts
new GuardContentBlock(data): GuardContentBlock;
```

Defined in: [src/types/messages.ts:798](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L798)

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

Defined in: [src/types/messages.ts:786](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L786)

Discriminator for guard content.

---

### text?

```ts
readonly optional text?: GuardContentText;
```

Defined in: [src/types/messages.ts:791](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L791)

Text content with evaluation qualifiers.

#### Implementation of

[`GuardContentBlockData`](/docs/api/typescript/GuardContentBlockData/index.md).[`text`](/docs/api/typescript/GuardContentBlockData/index.md#text)

---

### image?

```ts
readonly optional image?: GuardContentImage;
```

Defined in: [src/types/messages.ts:796](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L796)

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

Defined in: [src/types/messages.ts:818](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L818)

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
| `guardContent` | { `text?`: { `qualifiers`: [`GuardQualifier`](/docs/api/typescript/GuardQualifier/index.md)\[\]; `text`: `string`; }; `image?`: { `format`: [`GuardImageFormat`](/docs/api/typescript/GuardImageFormat/index.md); `source`: { `bytes`: `string`; }; }; } | \- | [src/types/messages.ts:818](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L818) |
| `guardContent.text?` | { `qualifiers`: [`GuardQualifier`](/docs/api/typescript/GuardQualifier/index.md)\[\]; `text`: `string`; } | Text content with evaluation qualifiers. | [src/types/messages.ts:767](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L767) |
| `guardContent.text.qualifiers` | [`GuardQualifier`](/docs/api/typescript/GuardQualifier/index.md)\[\] | Qualifiers that specify how this content should be evaluated. | [src/types/messages.ts:736](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L736) |
| `guardContent.text.text` | `string` | The text content to be evaluated. | [src/types/messages.ts:741](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L741) |
| `guardContent.image?` | { `format`: [`GuardImageFormat`](/docs/api/typescript/GuardImageFormat/index.md); `source`: { `bytes`: `string`; }; } | Image content with evaluation qualifiers. | [src/types/messages.ts:772](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L772) |
| `guardContent.image.format` | [`GuardImageFormat`](/docs/api/typescript/GuardImageFormat/index.md) | Image format. | [src/types/messages.ts:751](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L751) |
| `guardContent.image.source` | { `bytes`: `string`; } | Image source (bytes only). | [src/types/messages.ts:756](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L756) |
| `guardContent.image.source.bytes` | `string` | \- | [src/types/messages.ts:727](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L727) |

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): GuardContentBlock;
```

Defined in: [src/types/messages.ts:839](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/messages.ts#L839)

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