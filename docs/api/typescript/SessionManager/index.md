Defined in: [src/session/session-manager.ts:57](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/session-manager.ts#L57)

Manages session persistence for agents, enabling conversation state to be saved and restored across invocations using pluggable storage backends.

## Example

```typescript
import { SessionManager, FileStorage } from '@strands-agents/sdk'

const session = new SessionManager({
  sessionId: 'my-session',
  storage: { snapshot: new FileStorage() },
})
const agent = new Agent({ sessionManager: session })
```

## Implements

-   [<code dir="auto">Plugin</code>](/docs/api/typescript/Plugin/index.md)

## Constructors

### Constructor

```ts
new SessionManager(config): SessionManager;
```

Defined in: [src/session/session-manager.ts:70](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/session-manager.ts#L70)

#### Parameters

| Parameter | Type |
| --- | --- |
| `config` | [<code dir="auto">SessionManagerConfig</code>](/docs/api/typescript/SessionManagerConfig/index.md) |

#### Returns

`SessionManager`

## Accessors

### name

#### Get Signature

```ts
get name(): string;
```

Defined in: [src/session/session-manager.ts:66](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/session-manager.ts#L66)

Unique identifier for this plugin.

##### Returns

`string`

A stable string identifier for the plugin. Used for logging, duplicate detection, and plugin management.

For strands-vended plugins, names should be prefixed with `strands:`.

#### Implementation of

[<code dir="auto">Plugin</code>](/docs/api/typescript/Plugin/index.md).[<code dir="auto">name</code>](/docs/api/typescript/Plugin/index.md#name)

## Methods

### initAgent()

```ts
initAgent(agent): void;
```

Defined in: [src/session/session-manager.ts:78](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/session-manager.ts#L78)

Initializes the plugin by registering lifecycle hook callbacks.

#### Parameters

| Parameter | Type |
| --- | --- |
| `agent` | `LocalAgent` |

#### Returns

`void`

#### Implementation of

[<code dir="auto">Plugin</code>](/docs/api/typescript/Plugin/index.md).[<code dir="auto">initAgent</code>](/docs/api/typescript/Plugin/index.md#initagent)

---

### saveSnapshot()

```ts
saveSnapshot(params): Promise<void>;
```

Defined in: [src/session/session-manager.ts:101](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/session-manager.ts#L101)

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `target`: `LocalAgent`; `isLatest`: `boolean`; } |
| `params.target` | `LocalAgent` |
| `params.isLatest` | `boolean` |

#### Returns

`Promise`<`void`\>

---

### deleteSession()

```ts
deleteSession(): Promise<void>;
```

Defined in: [src/session/session-manager.ts:113](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/session-manager.ts#L113)

Deletes all snapshots and manifests for this session from storage.

#### Returns

`Promise`<`void`\>

---

### restoreSnapshot()

```ts
restoreSnapshot(params): Promise<boolean>;
```

Defined in: [src/session/session-manager.ts:118](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/session-manager.ts#L118)

Loads a snapshot from storage and restores it into the target agent. Returns false if no snapshot exists.

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `target`: `LocalAgent`; `snapshotId?`: `string`; } |
| `params.target` | `LocalAgent` |
| `params.snapshotId?` | `string` |

#### Returns

`Promise`<`boolean`\>