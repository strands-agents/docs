Defined in: [src/models/streaming.ts:525](https://github.com/strands-agents/sdk-typescript/blob/4dd13ca32f73cd4603a1d468e3e5f60292a88334/strands-ts/src/models/streaming.ts#L525)

Performance metrics for a model invocation.

## Properties

### latencyMs

```ts
latencyMs: number;
```

Defined in: [src/models/streaming.ts:529](https://github.com/strands-agents/sdk-typescript/blob/4dd13ca32f73cd4603a1d468e3e5f60292a88334/strands-ts/src/models/streaming.ts#L529)

Latency in milliseconds.

---

### timeToFirstByteMs?

```ts
optional timeToFirstByteMs?: number;
```

Defined in: [src/models/streaming.ts:535](https://github.com/strands-agents/sdk-typescript/blob/4dd13ca32f73cd4603a1d468e3e5f60292a88334/strands-ts/src/models/streaming.ts#L535)

Time to first byte in milliseconds. Latency from sending the model request to receiving the first content chunk.