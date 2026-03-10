Defined in: [src/models/streaming.ts:255](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L255)

Event containing metadata about the stream. Includes usage statistics, performance metrics, and trace information.

## Implements

-   [`ModelMetadataEventData`](/docs/api/typescript/ModelMetadataEventData/index.md)

## Properties

### type

```ts
readonly type: "modelMetadataEvent";
```

Defined in: [src/models/streaming.ts:259](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L259)

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

Defined in: [src/models/streaming.ts:264](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L264)

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

Defined in: [src/models/streaming.ts:269](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L269)

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

Defined in: [src/models/streaming.ts:274](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L274)

Trace information for observability.

#### Implementation of

```ts
ModelMetadataEventData.trace
```