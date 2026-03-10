```ts
type S3StorageConfig = {
  bucket: string;
  prefix?: string;
  region?: string;
  s3Client?: S3Client;
};
```

Defined in: [src/session/s3-storage.ts:17](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/session/s3-storage.ts#L17)

Configuration options for S3Storage

## Properties

### bucket

```ts
bucket: string;
```

Defined in: [src/session/s3-storage.ts:19](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/session/s3-storage.ts#L19)

S3 bucket name

---

### prefix?

```ts
optional prefix: string;
```

Defined in: [src/session/s3-storage.ts:21](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/session/s3-storage.ts#L21)

Optional key prefix for all objects

---

### region?

```ts
optional region: string;
```

Defined in: [src/session/s3-storage.ts:23](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/session/s3-storage.ts#L23)

AWS region (default: us-east-1). Cannot be used with s3Client

---

### s3Client?

```ts
optional s3Client: S3Client;
```

Defined in: [src/session/s3-storage.ts:25](https://github.com/strands-agents/sdk-typescript/blob/f988e8537a106650bc307420920f6006522ced17/src/session/s3-storage.ts#L25)

Pre-configured S3 client. Cannot be used with region