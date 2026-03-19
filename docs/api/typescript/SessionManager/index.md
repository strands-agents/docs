Defined in: [src/session/session-manager.ts:57](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/session/session-manager.ts#L57)

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

-   [`Plugin`](/docs/api/typescript/Plugin/index.md)

## Constructors

### Constructor

```ts
new SessionManager(config): SessionManager;
```

Defined in: [src/session/session-manager.ts:70](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/session/session-manager.ts#L70)

#### Parameters

| Parameter | Type |
| --- | --- |
| `config` | [`SessionManagerConfig`](/docs/api/typescript/SessionManagerConfig/index.md) |

#### Returns

`SessionManager`

## Accessors

### name

#### Get Signature

```ts
get name(): string;
```

Defined in: [src/session/session-manager.ts:66](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/session/session-manager.ts#L66)

Unique identifier for this plugin.

##### Returns

`string`

A stable string identifier for the plugin. Used for logging, duplicate detection, and plugin management.

For strands-vended plugins, names should be prefixed with `strands:`.

#### Implementation of

[`Plugin`](/docs/api/typescript/Plugin/index.md).[`name`](/docs/api/typescript/Plugin/index.md#name)

## Methods

### initAgent()

```ts
initAgent(agent): void;
```

Defined in: [src/session/session-manager.ts:78](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/session/session-manager.ts#L78)

Initializes the plugin by registering lifecycle hook callbacks.

#### Parameters

| Parameter | Type |
| --- | --- |
| `agent` | [`LocalAgent`](/docs/api/typescript/LocalAgent/index.md) |

#### Returns

`void`

#### Implementation of

[`Plugin`](/docs/api/typescript/Plugin/index.md).[`initAgent`](/docs/api/typescript/Plugin/index.md#initagent)

---

### saveSnapshot()

```ts
saveSnapshot(params): Promise<void>;
```

Defined in: [src/session/session-manager.ts:101](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/session/session-manager.ts#L101)

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `target`: [`Agent`](/docs/api/typescript/Agent/index.md); `isLatest`: `boolean`; } |
| `params.target` | [`Agent`](/docs/api/typescript/Agent/index.md) |
| `params.isLatest` | `boolean` |

#### Returns

`Promise`<`void`\>

---

### deleteSession()

```ts
deleteSession(): Promise<void>;
```

Defined in: [src/session/session-manager.ts:113](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/session/session-manager.ts#L113)

Deletes all snapshots and manifests for this session from storage.

#### Returns

`Promise`<`void`\>

---

### restoreSnapshot()

```ts
restoreSnapshot(params): Promise<boolean>;
```

Defined in: [src/session/session-manager.ts:118](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/session/session-manager.ts#L118)

Loads a snapshot from storage and restores it into the target agent. Returns false if no snapshot exists.

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `target`: [`Agent`](/docs/api/typescript/Agent/index.md); `snapshotId?`: `string`; } |
| `params.target` | [`Agent`](/docs/api/typescript/Agent/index.md) |
| `params.snapshotId?` | `string` |

#### Returns

`Promise`<`boolean`\>