Defined in: [src/session/session-manager.ts:28](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/session/session-manager.ts#L28)

## Properties

### storage

```ts
storage: {
  snapshot: SnapshotStorage;
};
```

Defined in: [src/session/session-manager.ts:30](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/session/session-manager.ts#L30)

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

Defined in: [src/session/session-manager.ts:34](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/session/session-manager.ts#L34)

Unique session identifier. Defaults to `'default-session'`.

---

### saveLatestOn?

```ts
optional saveLatestOn: SaveLatestStrategy;
```

Defined in: [src/session/session-manager.ts:36](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/session/session-manager.ts#L36)

When to save snapshot\_latest. Default: `'invocation'` (after each agent invocation completes). See [SaveLatestStrategy](/docs/api/typescript/SaveLatestStrategy/index.md) for details.

---

### snapshotTrigger?

```ts
optional snapshotTrigger: SnapshotTriggerCallback;
```

Defined in: [src/session/session-manager.ts:38](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/session/session-manager.ts#L38)

Callback invoked after each invocation to decide whether to create an immutable snapshot.