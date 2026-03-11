Defined in: [src/agent/snapshot.ts:55](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/snapshot.ts#L55)

Point-in-time capture of agent state.

## Properties

### scope

```ts
scope: Scope;
```

Defined in: [src/agent/snapshot.ts:59](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/snapshot.ts#L59)

Scope identifying the snapshot context (agent or multi-agent).

---

### schemaVersion

```ts
schemaVersion: string;
```

Defined in: [src/agent/snapshot.ts:64](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/snapshot.ts#L64)

Schema version string for forward compatibility.

---

### createdAt

```ts
createdAt: string;
```

Defined in: [src/agent/snapshot.ts:69](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/snapshot.ts#L69)

ISO 8601 timestamp of when snapshot was created.

---

### data

```ts
data: Record<string, JSONValue>;
```

Defined in: [src/agent/snapshot.ts:74](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/snapshot.ts#L74)

Agent’s evolving state (messages, state, systemPrompt). Strands-owned.

---

### appData

```ts
appData: Record<string, JSONValue>;
```

Defined in: [src/agent/snapshot.ts:79](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/snapshot.ts#L79)

Application-owned data. Strands does not read or modify this.