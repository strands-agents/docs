Defined in: [src/models/streaming.ts:257](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/streaming.ts#L257)

Event containing metadata about the stream. Includes usage statistics, performance metrics, and trace information.

## Implements

-   [`ModelMetadataEventData`](/docs/api/typescript/ModelMetadataEventData/index.md)

## Properties

### type

```ts
readonly type: "modelMetadataEvent";
```

Defined in: [src/models/streaming.ts:261](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/streaming.ts#L261)

Discriminator for metadata events.

#### Implementation of

```ts
ModelMetadataEventData.type
```

---

### usage?

```ts
readonly optional usage: Usage;
```

Defined in: [src/models/streaming.ts:266](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/streaming.ts#L266)

Token usage information.

#### Implementation of

```ts
ModelMetadataEventData.usage
```

---

### metrics?

```ts
readonly optional metrics: Metrics;
```

Defined in: [src/models/streaming.ts:271](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/streaming.ts#L271)

Performance metrics.

#### Implementation of

```ts
ModelMetadataEventData.metrics
```

---

### trace?

```ts
readonly optional trace: unknown;
```

Defined in: [src/models/streaming.ts:276](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/streaming.ts#L276)

Trace information for observability.

#### Implementation of

```ts
ModelMetadataEventData.trace
```