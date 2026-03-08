Defined in: [src/session/file-storage.ts:16](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/session/file-storage.ts#L16)

File-based implementation of SnapshotStorage for persisting session snapshots

## Implements

-   [`SnapshotStorage`](/docs/api/typescript/SnapshotStorage/index.md)

## Constructors

### Constructor

```ts
new FileStorage(baseDir): FileStorage;
```

Defined in: [src/session/file-storage.ts:24](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/session/file-storage.ts#L24)

Creates new FileStorage instance

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `baseDir` | `string` | Base directory path for storing snapshots |

#### Returns

`FileStorage`

## Methods

### saveSnapshot()

```ts
saveSnapshot(params): Promise<void>;
```

Defined in: [src/session/file-storage.ts:41](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/session/file-storage.ts#L41)

Saves snapshot to file, optionally marking as latest

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

Defined in: [src/session/file-storage.ts:57](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/session/file-storage.ts#L57)

Loads snapshot by ID or latest if null

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

Defined in: [src/session/file-storage.ts:86](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/session/file-storage.ts#L86)

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

Defined in: [src/session/file-storage.ts:106](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/session/file-storage.ts#L106)

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

Defined in: [src/session/file-storage.ts:121](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/session/file-storage.ts#L121)

Saves manifest to file

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