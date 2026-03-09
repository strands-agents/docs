Defined in: [src/types/media.ts:330](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/types/media.ts#L330)

Video content block.

## Implements

-   [`VideoBlockData`](/docs/api/typescript/VideoBlockData/index.md)
-   `JSONSerializable`<{ `video`: `Serialized`<[`VideoBlockData`](/docs/api/typescript/VideoBlockData/index.md)\>; }>

## Constructors

### Constructor

```ts
new VideoBlock(data): VideoBlock;
```

Defined in: [src/types/media.ts:346](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/types/media.ts#L346)

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

Defined in: [src/types/media.ts:334](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/types/media.ts#L334)

Discriminator for video content.

---

### format

```ts
readonly format: VideoFormat;
```

Defined in: [src/types/media.ts:339](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/types/media.ts#L339)

Video format.

#### Implementation of

[`VideoBlockData`](/docs/api/typescript/VideoBlockData/index.md).[`format`](/docs/api/typescript/VideoBlockData/index.md#format)

---

### source

```ts
readonly source: VideoSource;
```

Defined in: [src/types/media.ts:344](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/types/media.ts#L344)

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
        s3Location: {
           uri: string;
           bucketOwner?: string;
        };
      };
  };
};
```

Defined in: [src/types/media.ts:369](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/types/media.ts#L369)

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
        s3Location: {
           uri: string;
           bucketOwner?: string;
        };
      };
  };
}
```

| Name | Type | Description | Defined in |
| --- | --- | --- | --- |
| `video` | { `format`: [`VideoFormat`](/docs/api/typescript/VideoFormat/index.md); `source`: | { `bytes`: `string`; } | { `s3Location`: { `uri`: `string`; `bucketOwner?`: `string`; }; }; } | \- | [src/types/media.ts:369](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/types/media.ts#L369) |
| `video.format` | [`VideoFormat`](/docs/api/typescript/VideoFormat/index.md) | Video format. | [src/types/media.ts:319](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/types/media.ts#L319) |
| `video.source` | | { `bytes`: `string`; } | { `s3Location`: { `uri`: `string`; `bucketOwner?`: `string`; }; } | Video source. | [src/types/media.ts:324](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/types/media.ts#L324) |

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): VideoBlock;
```

Defined in: [src/types/media.ts:391](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/types/media.ts#L391)

Creates a VideoBlock instance from its wrapped data format. Base64-encoded bytes are decoded back to Uint8Array.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | { `video`: { `format`: [`VideoFormat`](/docs/api/typescript/VideoFormat/index.md); `source`: | { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; } | { `s3Location`: { `uri`: `string`; `bucketOwner?`: `string`; }; }; }; } | Wrapped VideoBlockData to deserialize (accepts both string and Uint8Array for bytes) |
| `data.video` | { `format`: [`VideoFormat`](/docs/api/typescript/VideoFormat/index.md); `source`: | { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; } | { `s3Location`: { `uri`: `string`; `bucketOwner?`: `string`; }; }; } | \- |
| `data.video.format` | [`VideoFormat`](/docs/api/typescript/VideoFormat/index.md) | Video format. |
| `data.video.source` | | { `bytes`: `string` | `Uint8Array`<`ArrayBufferLike`\>; } | { `s3Location`: { `uri`: `string`; `bucketOwner?`: `string`; }; } | Video source. |

#### Returns

`VideoBlock`

VideoBlock instance