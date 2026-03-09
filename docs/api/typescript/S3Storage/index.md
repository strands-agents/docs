Defined in: [src/session/s3-storage.ts:31](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/session/s3-storage.ts#L31)

S3-based implementation of SnapshotStorage for persisting session snapshots

## Implements

-   [`SnapshotStorage`](/docs/api/typescript/SnapshotStorage/index.md)

## Constructors

### Constructor

```ts
new S3Storage(config): S3Storage;
```

Defined in: [src/session/s3-storage.ts:42](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/session/s3-storage.ts#L42)

Creates new S3Storage instance

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `config` | [`S3StorageConfig`](/docs/api/typescript/S3StorageConfig/index.md) | Configuration options |

#### Returns

`S3Storage`

## Methods

### saveSnapshot()

```ts
saveSnapshot(params): Promise<void>;
```

Defined in: [src/session/s3-storage.ts:65](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/session/s3-storage.ts#L65)

Saves snapshot to S3, optionally marking as latest

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

#### Implementation of

[`SnapshotStorage`](/docs/api/typescript/SnapshotStorage/index.md).[`saveSnapshot`](/docs/api/typescript/SnapshotStorage/index.md#savesnapshot)

---

### loadSnapshot()

```ts
loadSnapshot(params): Promise<Snapshot>;
```

Defined in: [src/session/s3-storage.ts:81](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/session/s3-storage.ts#L81)

Loads snapshot by ID or latest if undefined

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `location`: [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md); `snapshotId?`: `string`; } |
| `params.location` | [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md) |
| `params.snapshotId?` | `string` |

#### Returns

`Promise`<[`Snapshot`](/docs/api/typescript/Snapshot/index.md)\>

#### Implementation of

[`SnapshotStorage`](/docs/api/typescript/SnapshotStorage/index.md).[`loadSnapshot`](/docs/api/typescript/SnapshotStorage/index.md#loadsnapshot)

---

### listSnapshotIds()

```ts
listSnapshotIds(params): Promise<string[]>;
```

Defined in: [src/session/s3-storage.ts:103](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/session/s3-storage.ts#L103)

Lists all snapshot IDs for a session scope.

TODO: Add pagination support for long-running agents with many snapshots. Future signature could be:

```typescript
listSnapshots(params: {
  sessionId: string
  scope: Scope
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

#### Implementation of

[`SnapshotStorage`](/docs/api/typescript/SnapshotStorage/index.md).[`listSnapshotIds`](/docs/api/typescript/SnapshotStorage/index.md#listsnapshotids)

---

### loadManifest()

```ts
loadManifest(params): Promise<SnapshotManifest>;
```

Defined in: [src/session/s3-storage.ts:124](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/session/s3-storage.ts#L124)

Loads manifest or returns default if not found

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `location`: [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md); } |
| `params.location` | [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md) |

#### Returns

`Promise`<[`SnapshotManifest`](/docs/api/typescript/SnapshotManifest/index.md)\>

#### Implementation of

[`SnapshotStorage`](/docs/api/typescript/SnapshotStorage/index.md).[`loadManifest`](/docs/api/typescript/SnapshotStorage/index.md#loadmanifest)

---

### saveManifest()

```ts
saveManifest(params): Promise<void>;
```

Defined in: [src/session/s3-storage.ts:139](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/session/s3-storage.ts#L139)

Saves manifest to S3

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `location`: [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md); `manifest`: [`SnapshotManifest`](/docs/api/typescript/SnapshotManifest/index.md); } |
| `params.location` | [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md) |
| `params.manifest` | [`SnapshotManifest`](/docs/api/typescript/SnapshotManifest/index.md) |

#### Returns

`Promise`<`void`\>

#### Implementation of

[`SnapshotStorage`](/docs/api/typescript/SnapshotStorage/index.md).[`saveManifest`](/docs/api/typescript/SnapshotStorage/index.md#savemanifest)