```ts
type SessionStorage = {
  snapshot: SnapshotStorage;
};
```

Defined in: [src/session/storage.ts:26](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/session/storage.ts#L26)

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

Defined in: [src/session/storage.ts:27](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/session/storage.ts#L27)