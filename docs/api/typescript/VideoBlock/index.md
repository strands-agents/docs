Defined in: [src/types/media.ts:292](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/media.ts#L292)

Video content block.

## Implements

-   [`VideoBlockData`](/docs/api/typescript/VideoBlockData/index.md)
-   `JSONSerializable`<{ `video`: `Serialized`<[`VideoBlockData`](/docs/api/typescript/VideoBlockData/index.md)\>; }>

## Constructors

### Constructor

```ts
new VideoBlock(data): VideoBlock;
```

Defined in: [src/types/media.ts:308](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/media.ts#L308)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [`VideoBlockData`](/docs/api/typescript/VideoBlockData/index.md) |

#### Returns

`VideoBlock`

## Properties

### type

```ts
readonly type: "videoBlock";
```

Defined in: [src/types/media.ts:296](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/media.ts#L296)

Discriminator for video content.

---

### format

```ts
readonly format: VideoFormat;
```

Defined in: [src/types/media.ts:301](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/media.ts#L301)

Video format.

#### Implementation of

[`VideoBlockData`](/docs/api/typescript/VideoBlockData/index.md).[`format`](/docs/api/typescript/VideoBlockData/index.md#format)

---

### source

```ts
readonly source: VideoSource;
```

Defined in: [src/types/media.ts:306](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/media.ts#L306)

Video source.

#### Implementation of

[`VideoBlockData`](/docs/api/typescript/VideoBlockData/index.md).[`source`](/docs/api/typescript/VideoBlockData/index.md#source)

## Methods

### toJSON()

```ts
toJSON(): {
  video: {
     format: VideoFormat;
     source:   | {
        bytes: string;
      }
        | {
        location: {
           type: "s3";
           uri: string;
           bucketOwner?: string;
        };
      };
  };
};
```

Defined in: [src/types/media.ts:331](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/media.ts#L331)

Serializes the VideoBlock to a JSON-compatible ContentBlockData object. Called automatically by JSON.stringify(). Uint8Array bytes are encoded as base64 string.

#### Returns

```ts
{
  video: {
     format: VideoFormat;
     source:   | {
        bytes: string;
      }
        | {
        location: {
           type: "s3";
           uri: string;
           bucketOwner?: string;
        };
      };
  };
}
```

| Name | Type | Description | Defined in |
| --- | --- | --- | --- |
| `video` | { `format`: [`VideoFormat`](/docs/api/typescript/VideoFormat/index.md); `source`: | { `bytes`: `string`; } | { `location`: { `type`: `"s3"`; `uri`: `string`; `bucketOwner?`: `string`; }; }; } | \- | [src/types/media.ts:331](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/media.ts#L331) |
| `video.format` | [`VideoFormat`](/docs/api/typescript/VideoFormat/index.md) | Video format. | [src/types/media.ts:281](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/media.ts#L281) |
| `video.source` | | { `bytes`: `string`; } | { `location`: { `type`: `"s3"`; `uri`: `string`; `bucketOwner?`: `string`; }; } | Video source. | [src/types/media.ts:286](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/media.ts#L286) |

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): VideoBlock;
```

Defined in: [src/types/media.ts:353](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/types/media.ts#L353)

Creates a VideoBlock instance from its wrapped data format. Base64-encoded bytes are decoded back to Uint8Array.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | { `video`: { `format`: [`VideoFormat`](/docs/api/typescript/VideoFormat/index.md); `source`: | { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; } | { `location`: { `type`: `"s3"`; `uri`: `string`; `bucketOwner?`: `string`; }; }; }; } | Wrapped VideoBlockData to deserialize (accepts both string and Uint8Array for bytes) |
| `data.video` | { `format`: [`VideoFormat`](/docs/api/typescript/VideoFormat/index.md); `source`: | { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; } | { `location`: { `type`: `"s3"`; `uri`: `string`; `bucketOwner?`: `string`; }; }; } | \- |
| `data.video.format` | [`VideoFormat`](/docs/api/typescript/VideoFormat/index.md) | Video format. |
| `data.video.source` | | { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; } | { `location`: { `type`: `"s3"`; `uri`: `string`; `bucketOwner?`: `string`; }; } | Video source. |

#### Returns

`VideoBlock`

VideoBlock instance