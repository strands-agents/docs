Defined in: [src/session/file-storage.ts:25](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/file-storage.ts#L25)

File-based implementation of SnapshotStorage. Persists session snapshots to the local filesystem under a configurable base directory.

Directory layout:

```plaintext
<baseDir>/<sessionId>/scopes/<scope>/<scopeId>/snapshots/
  snapshot_latest.json
  immutable_history/
    snapshot_<uuid7>.json
```

## Implements

-   [<code dir="auto">SnapshotStorage</code>](/docs/api/typescript/SnapshotStorage/index.md)

## Constructors

### Constructor

```ts
new FileStorage(baseDir): FileStorage;
```

Defined in: [src/session/file-storage.ts:32](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/file-storage.ts#L32)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `baseDir` | `string` | Absolute path to the root directory for storing session snapshots. |

#### Returns

`FileStorage`

## Methods

### saveSnapshot()

```ts
saveSnapshot(params): Promise<void>;
```

Defined in: [src/session/file-storage.ts:62](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/file-storage.ts#L62)

Persists a snapshot to disk. If `isLatest` is true, writes to `snapshot_latest.json` (overwriting any previous). Otherwise, writes to `immutable_history/snapshot_<snapshotId>.json`.

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `location`: [<code dir="auto">SnapshotLocation</code>](/docs/api/typescript/SnapshotLocation/index.md); `snapshotId`: `string`; `isLatest`: `boolean`; `snapshot`: [<code dir="auto">Snapshot</code>](/docs/api/typescript/Snapshot/index.md); } |
| `params.location` | [<code dir="auto">SnapshotLocation</code>](/docs/api/typescript/SnapshotLocation/index.md) |
| `params.snapshotId` | `string` |
| `params.isLatest` | `boolean` |
| `params.snapshot` | [<code dir="auto">Snapshot</code>](/docs/api/typescript/Snapshot/index.md) |

#### Returns

`Promise`<`void`\>

#### Implementation of

[<code dir="auto">SnapshotStorage</code>](/docs/api/typescript/SnapshotStorage/index.md).[<code dir="auto">saveSnapshot</code>](/docs/api/typescript/SnapshotStorage/index.md#savesnapshot)

---

### loadSnapshot()

```ts
loadSnapshot(params): Promise<Snapshot>;
```

Defined in: [src/session/file-storage.ts:79](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/file-storage.ts#L79)

Loads a snapshot from disk. If `snapshotId` is omitted, loads `snapshot_latest.json`. Returns null if the file does not exist.

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `location`: [<code dir="auto">SnapshotLocation</code>](/docs/api/typescript/SnapshotLocation/index.md); `snapshotId?`: `string`; } |
| `params.location` | [<code dir="auto">SnapshotLocation</code>](/docs/api/typescript/SnapshotLocation/index.md) |
| `params.snapshotId?` | `string` |

#### Returns

`Promise`<[<code dir="auto">Snapshot</code>](/docs/api/typescript/Snapshot/index.md)\>

#### Implementation of

[<code dir="auto">SnapshotStorage</code>](/docs/api/typescript/SnapshotStorage/index.md).[<code dir="auto">loadSnapshot</code>](/docs/api/typescript/SnapshotStorage/index.md#loadsnapshot)

---

### listSnapshotIds()

```ts
listSnapshotIds(params): Promise<string[]>;
```

Defined in: [src/session/file-storage.ts:94](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/file-storage.ts#L94)

Lists immutable snapshot IDs for a scope, sorted chronologically. Since IDs are UUID v7, lexicographic sort equals chronological order. `startAfter` filters to IDs after the given UUID v7 (exclusive cursor). `limit` caps the number of returned IDs. Returns an empty array if no snapshots exist yet.

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `location`: [<code dir="auto">SnapshotLocation</code>](/docs/api/typescript/SnapshotLocation/index.md); `limit?`: `number`; `startAfter?`: `string`; } |
| `params.location` | [<code dir="auto">SnapshotLocation</code>](/docs/api/typescript/SnapshotLocation/index.md) |
| `params.limit?` | `number` |
| `params.startAfter?` | `string` |

#### Returns

`Promise`<`string`\[\]>

#### Implementation of

[<code dir="auto">SnapshotStorage</code>](/docs/api/typescript/SnapshotStorage/index.md).[<code dir="auto">listSnapshotIds</code>](/docs/api/typescript/SnapshotStorage/index.md#listsnapshotids)

---

### deleteSession()

```ts
deleteSession(params): Promise<void>;
```

Defined in: [src/session/file-storage.ts:126](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/file-storage.ts#L126)

Deletes all data for a session by removing its root directory (`<baseDir>/<sessionId>/`) recursively. No-ops if the session directory does not exist.

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `sessionId`: `string`; } |
| `params.sessionId` | `string` |

#### Returns

`Promise`<`void`\>

#### Implementation of

[<code dir="auto">SnapshotStorage</code>](/docs/api/typescript/SnapshotStorage/index.md).[<code dir="auto">deleteSession</code>](/docs/api/typescript/SnapshotStorage/index.md#deletesession)

---

### loadManifest()

```ts
loadManifest(params): Promise<SnapshotManifest>;
```

Defined in: [src/session/file-storage.ts:140](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/file-storage.ts#L140)

Loads the snapshot manifest for a scope. Returns a default manifest with the current timestamp if none exists yet.

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `location`: [<code dir="auto">SnapshotLocation</code>](/docs/api/typescript/SnapshotLocation/index.md); } |
| `params.location` | [<code dir="auto">SnapshotLocation</code>](/docs/api/typescript/SnapshotLocation/index.md) |

#### Returns

`Promise`<[<code dir="auto">SnapshotManifest</code>](/docs/api/typescript/SnapshotManifest/index.md)\>

#### Implementation of

[<code dir="auto">SnapshotStorage</code>](/docs/api/typescript/SnapshotStorage/index.md).[<code dir="auto">loadManifest</code>](/docs/api/typescript/SnapshotStorage/index.md#loadmanifest)

---

### saveManifest()

```ts
saveManifest(params): Promise<void>;
```

Defined in: [src/session/file-storage.ts:155](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/file-storage.ts#L155)

Persists the snapshot manifest for a scope to disk.

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `location`: [<code dir="auto">SnapshotLocation</code>](/docs/api/typescript/SnapshotLocation/index.md); `manifest`: [<code dir="auto">SnapshotManifest</code>](/docs/api/typescript/SnapshotManifest/index.md); } |
| `params.location` | [<code dir="auto">SnapshotLocation</code>](/docs/api/typescript/SnapshotLocation/index.md) |
| `params.manifest` | [<code dir="auto">SnapshotManifest</code>](/docs/api/typescript/SnapshotManifest/index.md) |

#### Returns

`Promise`<`void`\>

#### Implementation of

[<code dir="auto">SnapshotStorage</code>](/docs/api/typescript/SnapshotStorage/index.md).[<code dir="auto">saveManifest</code>](/docs/api/typescript/SnapshotStorage/index.md#savemanifest)