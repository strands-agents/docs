Defined in: [src/session/s3-storage.ts:46](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/session/s3-storage.ts#L46)

S3-based implementation of SnapshotStorage. Persists session snapshots as JSON objects in an S3 bucket.

Object key layout:

```plaintext
[<prefix>/]<sessionId>/scopes/<scope>/<scopeId>/snapshots/
  snapshot_latest.json
  immutable_history/
    snapshot_<uuid7>.json
```

## Implements

-   [`SnapshotStorage`](/docs/api/typescript/SnapshotStorage/index.md)

## Constructors

### Constructor

```ts
new S3Storage(config): S3Storage;
```

Defined in: [src/session/s3-storage.ts:57](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/session/s3-storage.ts#L57)

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

Defined in: [src/session/s3-storage.ts:93](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/session/s3-storage.ts#L93)

Persists a snapshot to S3. If `isLatest` is true, writes to `snapshot_latest.json` (overwriting any previous). Otherwise, writes to `immutable_history/snapshot_<snapshotId>.json`.

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

Defined in: [src/session/s3-storage.ts:111](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/session/s3-storage.ts#L111)

Loads a snapshot from S3. If `snapshotId` is omitted, loads `snapshot_latest.json`. Returns null if the object does not exist.

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

Defined in: [src/session/s3-storage.ts:126](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/session/s3-storage.ts#L126)

Lists immutable snapshot IDs for a scope, sorted chronologically. Since IDs are UUID v7, lexicographic sort equals chronological order. Pushes `startAfter` and `limit` down to S3 via `StartAfter` and `MaxKeys` to avoid fetching unnecessary objects. Returns an empty array if no snapshots exist yet.

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `location`: [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md); `limit?`: `number`; `startAfter?`: `string`; } |
| `params.location` | [`SnapshotLocation`](/docs/api/typescript/SnapshotLocation/index.md) |
| `params.limit?` | `number` |
| `params.startAfter?` | `string` |

#### Returns

`Promise`<`string`\[\]>

#### Implementation of

[`SnapshotStorage`](/docs/api/typescript/SnapshotStorage/index.md).[`listSnapshotIds`](/docs/api/typescript/SnapshotStorage/index.md#listsnapshotids)

---

### deleteSession()

```ts
deleteSession(params): Promise<void>;
```

Defined in: [src/session/s3-storage.ts:180](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/session/s3-storage.ts#L180)

Deletes all S3 objects belonging to a session by listing and batch-deleting everything under `[<prefix>/]<sessionId>/`. Handles buckets with more than 1000 objects via continuation token pagination. No-ops if the session has no objects.

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `sessionId`: `string`; } |
| `params.sessionId` | `string` |

#### Returns

`Promise`<`void`\>

#### Implementation of

[`SnapshotStorage`](/docs/api/typescript/SnapshotStorage/index.md).[`deleteSession`](/docs/api/typescript/SnapshotStorage/index.md#deletesession)

---

### loadManifest()

```ts
loadManifest(params): Promise<SnapshotManifest>;
```

Defined in: [src/session/s3-storage.ts:203](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/session/s3-storage.ts#L203)

Loads the snapshot manifest for a scope from S3. Returns a default manifest with the current timestamp if none exists yet.

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

Defined in: [src/session/s3-storage.ts:218](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/session/s3-storage.ts#L218)

Persists the snapshot manifest for a scope to S3.

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