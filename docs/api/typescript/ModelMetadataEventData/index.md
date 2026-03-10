Defined in: [src/models/streaming.ts:229](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L229)

Data for a metadata event.

## Properties

### type

```ts
type: "modelMetadataEvent";
```

Defined in: [src/models/streaming.ts:233](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L233)

Discriminator for metadata events.

---

### usage?

```ts
optional usage: Usage;
```

Defined in: [src/models/streaming.ts:238](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L238)

Token usage information.

---

### metrics?

```ts
optional metrics: Metrics;
```

Defined in: [src/models/streaming.ts:243](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L243)

Performance metrics.

---

### trace?

```ts
optional trace: unknown;
```

Defined in: [src/models/streaming.ts:248](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L248)

Trace information for observability.