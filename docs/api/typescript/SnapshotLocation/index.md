```ts
type SnapshotLocation = {
  sessionId: string;
  scope: Scope;
  scopeId: string;
};
```

Defined in: [src/session/storage.ts:6](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/session/storage.ts#L6)

Identifies the location of a snapshot within the storage hierarchy.

## Properties

### sessionId

```ts
sessionId: string;
```

Defined in: [src/session/storage.ts:8](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/session/storage.ts#L8)

Session identifier

---

### scope

```ts
scope: Scope;
```

Defined in: [src/session/storage.ts:10](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/session/storage.ts#L10)

Scope of the snapshot (agent or multi-agent)

---

### scopeId

```ts
scopeId: string;
```

Defined in: [src/session/storage.ts:12](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/session/storage.ts#L12)

Scope-specific identifier (agentId or multiAgentId)