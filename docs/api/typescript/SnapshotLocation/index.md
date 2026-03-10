```ts
type SnapshotLocation = {
  sessionId: string;
  scope: Scope;
  scopeId: string;
};
```

Defined in: [src/session/storage.ts:6](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/session/storage.ts#L6)

Identifies the location of a snapshot within the storage hierarchy.

## Properties

### sessionId

```ts
sessionId: string;
```

Defined in: [src/session/storage.ts:8](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/session/storage.ts#L8)

Session identifier

---

### scope

```ts
scope: Scope;
```

Defined in: [src/session/storage.ts:10](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/session/storage.ts#L10)

Scope of the snapshot (agent or multi-agent)

---

### scopeId

```ts
scopeId: string;
```

Defined in: [src/session/storage.ts:12](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/session/storage.ts#L12)

Scope-specific identifier (agentId or multiAgentId)