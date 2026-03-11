```ts
type S3StorageConfig = {
  bucket: string;
  prefix?: string;
  region?: string;
  s3Client?: S3Client;
};
```

Defined in: [src/session/s3-storage.ts:23](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/session/s3-storage.ts#L23)

Configuration options for S3Storage

## Properties

### bucket

```ts
bucket: string;
```

Defined in: [src/session/s3-storage.ts:25](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/session/s3-storage.ts#L25)

S3 bucket name

---

### prefix?

```ts
optional prefix: string;
```

Defined in: [src/session/s3-storage.ts:27](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/session/s3-storage.ts#L27)

Optional key prefix for all objects

---

### region?

```ts
optional region: string;
```

Defined in: [src/session/s3-storage.ts:29](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/session/s3-storage.ts#L29)

AWS region (default: us-east-1). Cannot be used with s3Client

---

### s3Client?

```ts
optional s3Client: S3Client;
```

Defined in: [src/session/s3-storage.ts:31](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/session/s3-storage.ts#L31)

Pre-configured S3 client. Cannot be used with region