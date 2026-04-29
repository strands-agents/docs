Defined in: [src/session/session-manager.ts:53](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/session/session-manager.ts#L53)

## Properties

### storage

```ts
storage: {
  snapshot: SnapshotStorage;
};
```

Defined in: [src/session/session-manager.ts:55](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/session/session-manager.ts#L55)

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

Defined in: [src/session/session-manager.ts:59](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/session/session-manager.ts#L59)

Unique session identifier. Defaults to `'default-session'`.

---

### saveLatestOn?

```ts
optional saveLatestOn?: SaveLatestStrategy;
```

Defined in: [src/session/session-manager.ts:61](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/session/session-manager.ts#L61)

When to save snapshot\_latest. Default: `'invocation'` (after each agent invocation completes). See [SaveLatestStrategy](/docs/api/typescript/SaveLatestStrategy/index.md) for details.

---

### snapshotTrigger?

```ts
optional snapshotTrigger?: SnapshotTriggerCallback;
```

Defined in: [src/session/session-manager.ts:63](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/session/session-manager.ts#L63)

Callback invoked after each invocation to decide whether to create an immutable snapshot.

---

### multiAgentSaveLatestOn?

```ts
optional multiAgentSaveLatestOn?: MultiAgentSaveLatestStrategy;
```

Defined in: [src/session/session-manager.ts:69](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/session/session-manager.ts#L69)

When to save snapshot\_latest for multi-agent orchestrators. Default: `'node'` (after each node invocation completes). See [MultiAgentSaveLatestStrategy](/docs/api/typescript/MultiAgentSaveLatestStrategy/index.md) for details.