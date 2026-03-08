Defined in: [src/types/media.ts:116](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/types/media.ts#L116)

Data for an S3 location. Used by Bedrock for referencing media and documents stored in S3.

## Properties

### uri

```ts
uri: string;
```

Defined in: [src/types/media.ts:120](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/types/media.ts#L120)

S3 URI in format: s3://bucket-name/key-name

---

### bucketOwner?

```ts
optional bucketOwner: string;
```

Defined in: [src/types/media.ts:126](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/types/media.ts#L126)

AWS account ID of the S3 bucket owner (12-digit). Required if the bucket belongs to another AWS account.