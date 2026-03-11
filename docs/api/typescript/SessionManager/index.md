Defined in: [src/session/session-manager.ts:57](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/session/session-manager.ts#L57)

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

-   [`HookProvider`](/docs/api/typescript/HookProvider/index.md)

## Constructors

### Constructor

```ts
new SessionManager(config): SessionManager;
```

Defined in: [src/session/session-manager.ts:63](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/session/session-manager.ts#L63)

#### Parameters

| Parameter | Type |
| --- | --- |
| `config` | [`SessionManagerConfig`](/docs/api/typescript/SessionManagerConfig/index.md) |

#### Returns

`SessionManager`

## Methods

### registerCallbacks()

```ts
registerCallbacks(registry): void;
```

Defined in: [src/session/session-manager.ts:71](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/session/session-manager.ts#L71)

Registers lifecycle hook callbacks on the provided registry.

#### Parameters

| Parameter | Type |
| --- | --- |
| `registry` | `HookRegistry` |

#### Returns

`void`

#### Implementation of

[`HookProvider`](/docs/api/typescript/HookProvider/index.md).[`registerCallbacks`](/docs/api/typescript/HookProvider/index.md#registercallbacks)

---

### saveSnapshot()

```ts
saveSnapshot(params): Promise<void>;
```

Defined in: [src/session/session-manager.ts:94](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/session/session-manager.ts#L94)

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

Defined in: [src/session/session-manager.ts:106](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/session/session-manager.ts#L106)

Deletes all snapshots and manifests for this session from storage.

#### Returns

`Promise`<`void`\>

---

### restoreSnapshot()

```ts
restoreSnapshot(params): Promise<boolean>;
```

Defined in: [src/session/session-manager.ts:111](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/session/session-manager.ts#L111)

Loads a snapshot from storage and restores it into the target agent. Returns false if no snapshot exists.

#### Parameters

| Parameter | Type |
| --- | --- |
| `params` | { `target`: [`Agent`](/docs/api/typescript/Agent/index.md); `snapshotId?`: `string`; } |
| `params.target` | [`Agent`](/docs/api/typescript/Agent/index.md) |
| `params.snapshotId?` | `string` |

#### Returns

`Promise`<`boolean`\>