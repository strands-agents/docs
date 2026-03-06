Defined in: [src/types/media.ts:471](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L471)

Document content block.

## Implements

-   [`DocumentBlockData`](/docs/api/typescript/DocumentBlockData/index.md)
-   `JSONSerializable`<{ `document`: `Serialized`<[`DocumentBlockData`](/docs/api/typescript/DocumentBlockData/index.md)\>; }>

## Constructors

### Constructor

```ts
new DocumentBlock(data): DocumentBlock;
```

Defined in: [src/types/media.ts:502](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L502)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [`DocumentBlockData`](/docs/api/typescript/DocumentBlockData/index.md) |

#### Returns

`DocumentBlock`

## Properties

### type

```ts
readonly type: "documentBlock";
```

Defined in: [src/types/media.ts:475](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L475)

Discriminator for document content.

---

### name

```ts
readonly name: string;
```

Defined in: [src/types/media.ts:480](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L480)

Document name.

#### Implementation of

[`DocumentBlockData`](/docs/api/typescript/DocumentBlockData/index.md).[`name`](/docs/api/typescript/DocumentBlockData/index.md#name)

---

### format

```ts
readonly format: DocumentFormat;
```

Defined in: [src/types/media.ts:485](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L485)

Document format.

#### Implementation of

[`DocumentBlockData`](/docs/api/typescript/DocumentBlockData/index.md).[`format`](/docs/api/typescript/DocumentBlockData/index.md#format)

---

### source

```ts
readonly source: DocumentSource;
```

Defined in: [src/types/media.ts:490](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L490)

Document source.

#### Implementation of

[`DocumentBlockData`](/docs/api/typescript/DocumentBlockData/index.md).[`source`](/docs/api/typescript/DocumentBlockData/index.md#source)

---

### citations?

```ts
readonly optional citations: {
  enabled: boolean;
};
```

Defined in: [src/types/media.ts:495](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L495)

Citation configuration.

#### enabled

```ts
enabled: boolean;
```

#### Implementation of

[`DocumentBlockData`](/docs/api/typescript/DocumentBlockData/index.md).[`citations`](/docs/api/typescript/DocumentBlockData/index.md#citations)

---

### context?

```ts
readonly optional context: string;
```

Defined in: [src/types/media.ts:500](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L500)

Context information for the document.

#### Implementation of

[`DocumentBlockData`](/docs/api/typescript/DocumentBlockData/index.md).[`context`](/docs/api/typescript/DocumentBlockData/index.md#context)

## Methods

### toJSON()

```ts
toJSON(): {
  document: {
     name: string;
     format: DocumentFormat;
     source:   | {
        bytes: string;
      }
        | {
        text: string;
      }
        | {
        content: {
           text: string;
        }[];
      }
        | {
        s3Location: {
           uri: string;
           bucketOwner?: string;
        };
      };
     citations?: {
        enabled: boolean;
     };
     context?: string;
  };
};
```

Defined in: [src/types/media.ts:547](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L547)

Serializes the DocumentBlock to a JSON-compatible ContentBlockData object. Called automatically by JSON.stringify(). Uint8Array bytes are encoded as base64 string.

#### Returns

```ts
{
  document: {
     name: string;
     format: DocumentFormat;
     source:   | {
        bytes: string;
      }
        | {
        text: string;
      }
        | {
        content: {
           text: string;
        }[];
      }
        | {
        s3Location: {
           uri: string;
           bucketOwner?: string;
        };
      };
     citations?: {
        enabled: boolean;
     };
     context?: string;
  };
}
```

| Name | Type | Description | Defined in |
| --- | --- | --- | --- |
| `document` | { `name`: `string`; `format`: [`DocumentFormat`](/docs/api/typescript/DocumentFormat/index.md); `source`: | { `bytes`: `string`; } | { `text`: `string`; } | { `content`: { `text`: `string`; }\[\]; } | { `s3Location`: { `uri`: `string`; `bucketOwner?`: `string`; }; }; `citations?`: { `enabled`: `boolean`; }; `context?`: `string`; } | \- | [src/types/media.ts:547](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L547) |
| `document.name` | `string` | Document name. | [src/types/media.ts:445](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L445) |
| `document.format` | [`DocumentFormat`](/docs/api/typescript/DocumentFormat/index.md) | Document format. | [src/types/media.ts:450](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L450) |
| `document.source` | | { `bytes`: `string`; } | { `text`: `string`; } | { `content`: { `text`: `string`; }\[\]; } | { `s3Location`: { `uri`: `string`; `bucketOwner?`: `string`; }; } | Document source. | [src/types/media.ts:455](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L455) |
| `document.citations?` | { `enabled`: `boolean`; } | Citation configuration. | [src/types/media.ts:460](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L460) |
| `document.citations.enabled` | `boolean` | \- | [src/types/media.ts:460](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L460) |
| `document.context?` | `string` | Context information for the document. | [src/types/media.ts:465](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L465) |

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): DocumentBlock;
```

Defined in: [src/types/media.ts:576](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/types/media.ts#L576)

Creates a DocumentBlock instance from its wrapped data format. Base64-encoded bytes are decoded back to Uint8Array.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | { `document`: { `name`: `string`; `format`: [`DocumentFormat`](/docs/api/typescript/DocumentFormat/index.md); `source`: | { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; } | { `text`: `string`; } | { `content`: { `text`: `string`; }\[\]; } | { `s3Location`: { `uri`: `string`; `bucketOwner?`: `string`; }; }; `citations?`: { `enabled`: `boolean`; }; `context?`: `string`; }; } | Wrapped DocumentBlockData to deserialize (accepts both string and Uint8Array for bytes) |
| `data.document` | { `name`: `string`; `format`: [`DocumentFormat`](/docs/api/typescript/DocumentFormat/index.md); `source`: | { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; } | { `text`: `string`; } | { `content`: { `text`: `string`; }\[\]; } | { `s3Location`: { `uri`: `string`; `bucketOwner?`: `string`; }; }; `citations?`: { `enabled`: `boolean`; }; `context?`: `string`; } | \- |
| `data.document.name` | `string` | Document name. |
| `data.document.format` | [`DocumentFormat`](/docs/api/typescript/DocumentFormat/index.md) | Document format. |
| `data.document.source` | | { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; } | { `text`: `string`; } | { `content`: { `text`: `string`; }\[\]; } | { `s3Location`: { `uri`: `string`; `bucketOwner?`: `string`; }; } | Document source. |
| `data.document.citations?` | { `enabled`: `boolean`; } | Citation configuration. |
| `data.document.citations.enabled` | `boolean` | \- |
| `data.document.context?` | `string` | Context information for the document. |

#### Returns

`DocumentBlock`

DocumentBlock instance