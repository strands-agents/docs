Defined in: [src/session/session-manager.ts:48](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/session/session-manager.ts#L48)

## Properties

### storage

```ts
storage: {
  snapshot: SnapshotStorage;
};
```

Defined in: [src/session/session-manager.ts:50](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/session/session-manager.ts#L50)

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

Defined in: [src/session/session-manager.ts:54](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/session/session-manager.ts#L54)

Unique session identifier. Defaults to `'default-session'`.

---

### saveLatestOn?

```ts
optional saveLatestOn?: SaveLatestStrategy;
```

Defined in: [src/session/session-manager.ts:56](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/session/session-manager.ts#L56)

When to save snapshot\_latest. Default: `'invocation'` (after each agent invocation completes). See [SaveLatestStrategy](/docs/api/typescript/SaveLatestStrategy/index.md) for details.

---

### snapshotTrigger?

```ts
optional snapshotTrigger?: SnapshotTriggerCallback;
```

Defined in: [src/session/session-manager.ts:58](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/session/session-manager.ts#L58)

Callback invoked after each invocation to decide whether to create an immutable snapshot.

---

### multiAgentSaveLatestOn?

```ts
optional multiAgentSaveLatestOn?: "invocation";
```

Defined in: [src/session/session-manager.ts:60](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/session/session-manager.ts#L60)

When to save snapshot\_latest for multi-agent orchestrators. Default: `'invocation'` (after each orchestrator invocation completes). See MultiAgentSaveLatestStrategy for details.