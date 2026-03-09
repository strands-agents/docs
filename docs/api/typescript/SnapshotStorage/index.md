Defined in: [src/session/storage.ts:47](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/session/storage.ts#L47)

Interface for snapshot persistence. Implementations provide storage backends (S3, filesystem, etc.).

File layout convention:

```plaintext
sessions/<session_id>/
  scopes/
    agent/<scope_id>/
      snapshots/
        snapshot_latest.json
        immutable_history/
          snapshot_<uuid>.json
          snapshot_<uuid>.json
```

## Methods

### saveSnapshot()

```ts
saveSnapshot(params): Promise<void>;
```

Defined in: [src/session/storage.ts:51](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/session/storage.ts#L51)

Persists a snapshot to storage.

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `location`: [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md); `snapshotId`: `string`; `isLatest`: `boolean`; `snapshot`: [`Snapshot`](/docs/api/typescript/Snapshot/index.md); } |
| `params.location` | [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md) |
| `params.snapshotId` | `string` |
| `params.isLatest` | `boolean` |
| `params.snapshot` | [`Snapshot`](/docs/api/typescript/Snapshot/index.md) |

#### Returns

`Promise`<`void`\>

---

### loadSnapshot()

```ts
loadSnapshot(params): Promise<Snapshot>;
```

Defined in: [src/session/storage.ts:61](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/session/storage.ts#L61)

Loads a snapshot from storage.

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `location`: [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md); `snapshotId?`: `string`; } |
| `params.location` | [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md) |
| `params.snapshotId?` | `string` |

#### Returns

`Promise`<[`Snapshot`](/docs/api/typescript/Snapshot/index.md)\>

---

### listSnapshotIds()

```ts
listSnapshotIds(params): Promise<string[]>;
```

Defined in: [src/session/storage.ts:76](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/session/storage.ts#L76)

Lists all available snapshot IDs for a session scope.

TODO: Add pagination support for long-running agents with many snapshots. Future signature could be:

```typescript
listSnapshots(params: {
  location: SnapshotLocation
  limit?: number        // Max results to return (e.g., 100)
  startAfter?: string   // Snapshot ID to start after (for cursor-based pagination)
}): Promise<{ snapshotIds: string[]; nextToken?: string }>
```

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `location`: [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md); } |
| `params.location` | [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md) |

#### Returns

`Promise`<`string`\[\]>

---

### loadManifest()

```ts
loadManifest(params): Promise<SnapshotManifest>;
```

Defined in: [src/session/storage.ts:81](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/session/storage.ts#L81)

Loads the snapshot manifest.

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `location`: [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md); } |
| `params.location` | [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md) |

#### Returns

`Promise`<[`SnapshotManifest`](/docs/api/typescript/SnapshotManifest/index.md)\>

---

### saveManifest()

```ts
saveManifest(params): Promise<void>;
```

Defined in: [src/session/storage.ts:86](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/session/storage.ts#L86)

Saves the snapshot manifest.

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `location`: [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md); `manifest`: [`SnapshotManifest`](/docs/api/typescript/SnapshotManifest/index.md); } |
| `params.location` | [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md) |
| `params.manifest` | [`SnapshotManifest`](/docs/api/typescript/SnapshotManifest/index.md) |

#### Returns

`Promise`<`void`\>