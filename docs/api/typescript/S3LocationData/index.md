Defined in: [src/types/media.ts:116](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/types/media.ts#L116)

Data for an S3 location. Used by Bedrock for referencing media and documents stored in S3.

## Properties

### uri

```ts
uri: string;
```

Defined in: [src/types/media.ts:120](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/types/media.ts#L120)

S3 URI in format: s3://bucket-name/key-name

---

### bucketOwner?

```ts
optional bucketOwner: string;
```

Defined in: [src/types/media.ts:126](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/types/media.ts#L126)

AWS account ID of the S3 bucket owner (12-digit). Required if the bucket belongs to another AWS account.