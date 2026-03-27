Defined in: [src/types/media.ts:81](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/media.ts#L81)

Data for an S3 location.

## Extends

-   [<code dir="auto">LocationData</code>](/docs/api/typescript/LocationData/index.md)

## Properties

### type

```ts
type: "s3";
```

Defined in: [src/types/media.ts:85](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/media.ts#L85)

Location type — always “s3”.

#### Overrides

[<code dir="auto">LocationData</code>](/docs/api/typescript/LocationData/index.md).[<code dir="auto">type</code>](/docs/api/typescript/LocationData/index.md#type)

---

### uri

```ts
uri: string;
```

Defined in: [src/types/media.ts:90](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/media.ts#L90)

S3 URI in format: s3://bucket-name/key-name

---

### bucketOwner?

```ts
optional bucketOwner?: string;
```

Defined in: [src/types/media.ts:96](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/types/media.ts#L96)

AWS account ID of the S3 bucket owner (12-digit). Required if the bucket belongs to another AWS account.