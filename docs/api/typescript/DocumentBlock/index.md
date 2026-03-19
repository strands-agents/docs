Defined in: [src/types/media.ts:428](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L428)

Document content block.

## Implements

-   [`DocumentBlockData`](/docs/api/typescript/DocumentBlockData/index.md)
-   `JSONSerializable`<{ `document`: `Serialized`<[`DocumentBlockData`](/docs/api/typescript/DocumentBlockData/index.md)\>; }>

## Constructors

### Constructor

```ts
new DocumentBlock(data): DocumentBlock;
```

Defined in: [src/types/media.ts:459](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L459)

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

Defined in: [src/types/media.ts:432](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L432)

Discriminator for document content.

---

### name

```ts
readonly name: string;
```

Defined in: [src/types/media.ts:437](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L437)

Document name.

#### Implementation of

[`DocumentBlockData`](/docs/api/typescript/DocumentBlockData/index.md).[`name`](/docs/api/typescript/DocumentBlockData/index.md#name)

---

### format

```ts
readonly format: DocumentFormat;
```

Defined in: [src/types/media.ts:442](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L442)

Document format.

#### Implementation of

[`DocumentBlockData`](/docs/api/typescript/DocumentBlockData/index.md).[`format`](/docs/api/typescript/DocumentBlockData/index.md#format)

---

### source

```ts
readonly source: DocumentSource;
```

Defined in: [src/types/media.ts:447](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L447)

Document source.

#### Implementation of

[`DocumentBlockData`](/docs/api/typescript/DocumentBlockData/index.md).[`source`](/docs/api/typescript/DocumentBlockData/index.md#source)

---

### citations?

```ts
readonly optional citations?: {
  enabled: boolean;
};
```

Defined in: [src/types/media.ts:452](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L452)

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
readonly optional context?: string;
```

Defined in: [src/types/media.ts:457](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L457)

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
        location: {
           type: "s3";
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

Defined in: [src/types/media.ts:504](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L504)

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
        location: {
           type: "s3";
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
| `document` | { `name`: `string`; `format`: [`DocumentFormat`](/docs/api/typescript/DocumentFormat/index.md); `source`: | { `bytes`: `string`; } | { `text`: `string`; } | { `content`: { `text`: `string`; }\[\]; } | { `location`: { `type`: `"s3"`; `uri`: `string`; `bucketOwner?`: `string`; }; }; `citations?`: { `enabled`: `boolean`; }; `context?`: `string`; } | \- | [src/types/media.ts:504](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L504) |
| `document.name` | `string` | Document name. | [src/types/media.ts:402](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L402) |
| `document.format` | [`DocumentFormat`](/docs/api/typescript/DocumentFormat/index.md) | Document format. | [src/types/media.ts:407](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L407) |
| `document.source` | | { `bytes`: `string`; } | { `text`: `string`; } | { `content`: { `text`: `string`; }\[\]; } | { `location`: { `type`: `"s3"`; `uri`: `string`; `bucketOwner?`: `string`; }; } | Document source. | [src/types/media.ts:412](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L412) |
| `document.citations?` | { `enabled`: `boolean`; } | Citation configuration. | [src/types/media.ts:417](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L417) |
| `document.citations.enabled` | `boolean` | \- | [src/types/media.ts:417](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L417) |
| `document.context?` | `string` | Context information for the document. | [src/types/media.ts:422](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L422) |

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): DocumentBlock;
```

Defined in: [src/types/media.ts:533](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/types/media.ts#L533)

Creates a DocumentBlock instance from its wrapped data format. Base64-encoded bytes are decoded back to Uint8Array.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | { `document`: { `name`: `string`; `format`: [`DocumentFormat`](/docs/api/typescript/DocumentFormat/index.md); `source`: | { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; } | { `text`: `string`; } | { `content`: { `text`: `string`; }\[\]; } | { `location`: { `type`: `"s3"`; `uri`: `string`; `bucketOwner?`: `string`; }; }; `citations?`: { `enabled`: `boolean`; }; `context?`: `string`; }; } | Wrapped DocumentBlockData to deserialize (accepts both string and Uint8Array for bytes) |
| `data.document` | { `name`: `string`; `format`: [`DocumentFormat`](/docs/api/typescript/DocumentFormat/index.md); `source`: | { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; } | { `text`: `string`; } | { `content`: { `text`: `string`; }\[\]; } | { `location`: { `type`: `"s3"`; `uri`: `string`; `bucketOwner?`: `string`; }; }; `citations?`: { `enabled`: `boolean`; }; `context?`: `string`; } | \- |
| `data.document.name` | `string` | Document name. |
| `data.document.format` | [`DocumentFormat`](/docs/api/typescript/DocumentFormat/index.md) | Document format. |
| `data.document.source` | | { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; } | { `text`: `string`; } | { `content`: { `text`: `string`; }\[\]; } | { `location`: { `type`: `"s3"`; `uri`: `string`; `bucketOwner?`: `string`; }; } | Document source. |
| `data.document.citations?` | { `enabled`: `boolean`; } | Citation configuration. |
| `data.document.citations.enabled` | `boolean` | \- |
| `data.document.context?` | `string` | Context information for the document. |

#### Returns

`DocumentBlock`

DocumentBlock instance