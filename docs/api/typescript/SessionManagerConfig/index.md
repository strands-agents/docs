Defined in: [src/session/session-manager.ts:28](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/session/session-manager.ts#L28)

## Properties

### storage

```ts
storage: {
  snapshot: SnapshotStorage;
};
```

Defined in: [src/session/session-manager.ts:30](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/session/session-manager.ts#L30)

Pluggable storage backends for snapshot persistence. Defaults to FileStorage in Node.js; required in browser environments.

#### snapshot

```ts
snapshot: SnapshotStorage;
```

---

### sessionId?

```ts
optional sessionId: string;
```

Defined in: [src/session/session-manager.ts:34](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/session/session-manager.ts#L34)

Unique session identifier. Defaults to `'default-session'`.

---

### saveLatestOn?

```ts
optional saveLatestOn: SaveLatestStrategy;
```

Defined in: [src/session/session-manager.ts:36](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/session/session-manager.ts#L36)

When to save snapshot\_latest. Default: `'invocation'` (after each agent invocation completes). See [SaveLatestStrategy](/docs/api/typescript/SaveLatestStrategy/index.md) for details.

---

### snapshotTrigger?

```ts
optional snapshotTrigger: SnapshotTriggerCallback;
```

Defined in: [src/session/session-manager.ts:38](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/session/session-manager.ts#L38)

Callback invoked after each invocation to decide whether to create an immutable snapshot.