Defined in: [src/session/session-manager.ts:29](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/session-manager.ts#L29)

## Properties

### storage

```ts
storage: {
  snapshot: SnapshotStorage;
};
```

Defined in: [src/session/session-manager.ts:31](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/session-manager.ts#L31)

Pluggable storage backends for snapshot persistence. Defaults to FileStorage in Node.js; required in browser environments.

#### snapshot

```ts
snapshot: SnapshotStorage;
```

---

### sessionId?

```ts
optional sessionId?: string;
```

Defined in: [src/session/session-manager.ts:35](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/session-manager.ts#L35)

Unique session identifier. Defaults to `'default-session'`.

---

### saveLatestOn?

```ts
optional saveLatestOn?: SaveLatestStrategy;
```

Defined in: [src/session/session-manager.ts:37](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/session-manager.ts#L37)

When to save snapshot\_latest. Default: `'invocation'` (after each agent invocation completes). See [SaveLatestStrategy](/docs/api/typescript/SaveLatestStrategy/index.md) for details.

---

### snapshotTrigger?

```ts
optional snapshotTrigger?: SnapshotTriggerCallback;
```

Defined in: [src/session/session-manager.ts:39](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/session/session-manager.ts#L39)

Callback invoked after each invocation to decide whether to create an immutable snapshot.