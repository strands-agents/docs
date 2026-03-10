```ts
type SessionStorage = {
  snapshot: SnapshotStorage;
};
```

Defined in: [src/session/storage.ts:26](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/session/storage.ts#L26)

SessionStorage configuration for pluggable storage backends. Allows users to configure snapshot and transcript storage independently.

## Example

```typescript
const storage: SessionStorage = {
  snapshot: new S3Storage({ bucket: 'my-bucket' })
}
```

## Properties

### snapshot

```ts
snapshot: SnapshotStorage;
```

Defined in: [src/session/storage.ts:27](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/session/storage.ts#L27)