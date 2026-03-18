```ts
type SessionStorage = {
  snapshot: SnapshotStorage;
};
```

Defined in: [src/session/storage.ts:26](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/session/storage.ts#L26)

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

Defined in: [src/session/storage.ts:27](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/session/storage.ts#L27)