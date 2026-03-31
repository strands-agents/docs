Defined in: [src/models/streaming.ts:525](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/streaming.ts#L525)

Performance metrics for a model invocation.

## Properties

### latencyMs

```ts
latencyMs: number;
```

Defined in: [src/models/streaming.ts:529](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/streaming.ts#L529)

Latency in milliseconds.

---

### timeToFirstByteMs?

```ts
optional timeToFirstByteMs?: number;
```

Defined in: [src/models/streaming.ts:535](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/streaming.ts#L535)

Time to first byte in milliseconds. Latency from sending the model request to receiving the first content chunk.