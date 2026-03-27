Defined in: [src/types/media.ts:102](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/media.ts#L102)

S3 location for media and document sources.

## Implements

-   [<code dir="auto">S3LocationData</code>](/docs/api/typescript/S3LocationData/index.md)
-   `JSONSerializable`<[<code dir="auto">S3LocationData</code>](/docs/api/typescript/S3LocationData/index.md)\>

## Constructors

### Constructor

```ts
new S3Location(data): S3Location;
```

Defined in: [src/types/media.ts:107](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/media.ts#L107)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | `Omit`<[<code dir="auto">S3LocationData</code>](/docs/api/typescript/S3LocationData/index.md), `"type"`\> & { `type?`: `"s3"`; } |

#### Returns

`S3Location`

## Properties

### type

```ts
readonly type: "s3";
```

Defined in: [src/types/media.ts:103](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/media.ts#L103)

Location type — always “s3”.

#### Implementation of

[<code dir="auto">S3LocationData</code>](/docs/api/typescript/S3LocationData/index.md).[<code dir="auto">type</code>](/docs/api/typescript/S3LocationData/index.md#type)

---

### uri

```ts
readonly uri: string;
```

Defined in: [src/types/media.ts:104](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/media.ts#L104)

S3 URI in format: s3://bucket-name/key-name

#### Implementation of

[<code dir="auto">S3LocationData</code>](/docs/api/typescript/S3LocationData/index.md).[<code dir="auto">uri</code>](/docs/api/typescript/S3LocationData/index.md#uri)

---

### bucketOwner?

```ts
readonly optional bucketOwner?: string;
```

Defined in: [src/types/media.ts:105](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/media.ts#L105)

AWS account ID of the S3 bucket owner (12-digit). Required if the bucket belongs to another AWS account.

#### Implementation of

[<code dir="auto">S3LocationData</code>](/docs/api/typescript/S3LocationData/index.md).[<code dir="auto">bucketOwner</code>](/docs/api/typescript/S3LocationData/index.md#bucketowner)

## Methods

### toJSON()

```ts
toJSON(): S3LocationData;
```

Defined in: [src/types/media.ts:118](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/media.ts#L118)

Serializes the S3Location to a JSON-compatible S3LocationData object. Called automatically by JSON.stringify().

#### Returns

[<code dir="auto">S3LocationData</code>](/docs/api/typescript/S3LocationData/index.md)

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): S3Location;
```

Defined in: [src/types/media.ts:132](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/media.ts#L132)

Creates an S3Location instance from S3LocationData.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | [<code dir="auto">S3LocationData</code>](/docs/api/typescript/S3LocationData/index.md) | S3LocationData to deserialize |

#### Returns

`S3Location`

S3Location instance