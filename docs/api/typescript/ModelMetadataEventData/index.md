Defined in: [src/models/streaming.ts:229](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/models/streaming.ts#L229)

Data for a metadata event.

## Properties

### type

```ts
type: "modelMetadataEvent";
```

Defined in: [src/models/streaming.ts:233](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/models/streaming.ts#L233)

Discriminator for metadata events.

---

### usage?

```ts
optional usage: Usage;
```

Defined in: [src/models/streaming.ts:238](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/models/streaming.ts#L238)

Token usage information.

---

### metrics?

```ts
optional metrics: Metrics;
```

Defined in: [src/models/streaming.ts:243](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/models/streaming.ts#L243)

Performance metrics.

---

### trace?

```ts
optional trace: unknown;
```

Defined in: [src/models/streaming.ts:248](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/models/streaming.ts#L248)

Trace information for observability.