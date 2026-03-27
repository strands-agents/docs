Defined in: [src/agent/snapshot.ts:56](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/snapshot.ts#L56)

Point-in-time capture of agent state.

## Properties

### scope

```ts
scope: Scope;
```

Defined in: [src/agent/snapshot.ts:60](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/snapshot.ts#L60)

Scope identifying the snapshot context (agent or multi-agent).

---

### schemaVersion

```ts
schemaVersion: string;
```

Defined in: [src/agent/snapshot.ts:65](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/snapshot.ts#L65)

Schema version string for forward compatibility.

---

### createdAt

```ts
createdAt: string;
```

Defined in: [src/agent/snapshot.ts:70](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/snapshot.ts#L70)

ISO 8601 timestamp of when snapshot was created.

---

### data

```ts
data: Record<string, JSONValue>;
```

Defined in: [src/agent/snapshot.ts:75](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/snapshot.ts#L75)

Agent’s evolving state (messages, state, systemPrompt). Strands-owned.

---

### appData

```ts
appData: Record<string, JSONValue>;
```

Defined in: [src/agent/snapshot.ts:80](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/snapshot.ts#L80)

Application-owned data. Strands does not read or modify this.