Defined in: [src/models/streaming.ts:257](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/streaming.ts#L257)

Event containing metadata about the stream. Includes usage statistics, performance metrics, and trace information.

## Implements

-   [<code dir="auto">ModelMetadataEventData</code>](/docs/api/typescript/ModelMetadataEventData/index.md)

## Constructors

### Constructor

```ts
new ModelMetadataEvent(data): ModelMetadataEvent;
```

Defined in: [src/models/streaming.ts:278](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/streaming.ts#L278)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [<code dir="auto">ModelMetadataEventData</code>](/docs/api/typescript/ModelMetadataEventData/index.md) |

#### Returns

`ModelMetadataEvent`

## Properties

### type

```ts
readonly type: "modelMetadataEvent";
```

Defined in: [src/models/streaming.ts:261](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/streaming.ts#L261)

Discriminator for metadata events.

#### Implementation of

[<code dir="auto">ModelMetadataEventData</code>](/docs/api/typescript/ModelMetadataEventData/index.md).[<code dir="auto">type</code>](/docs/api/typescript/ModelMetadataEventData/index.md#type)

---

### usage?

```ts
readonly optional usage?: Usage;
```

Defined in: [src/models/streaming.ts:266](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/streaming.ts#L266)

Token usage information.

#### Implementation of

[<code dir="auto">ModelMetadataEventData</code>](/docs/api/typescript/ModelMetadataEventData/index.md).[<code dir="auto">usage</code>](/docs/api/typescript/ModelMetadataEventData/index.md#usage)

---

### metrics?

```ts
readonly optional metrics?: Metrics;
```

Defined in: [src/models/streaming.ts:271](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/streaming.ts#L271)

Performance metrics.

#### Implementation of

[<code dir="auto">ModelMetadataEventData</code>](/docs/api/typescript/ModelMetadataEventData/index.md).[<code dir="auto">metrics</code>](/docs/api/typescript/ModelMetadataEventData/index.md#metrics)

---

### trace?

```ts
readonly optional trace?: unknown;
```

Defined in: [src/models/streaming.ts:276](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/streaming.ts#L276)

Trace information for observability.

#### Implementation of

[<code dir="auto">ModelMetadataEventData</code>](/docs/api/typescript/ModelMetadataEventData/index.md).[<code dir="auto">trace</code>](/docs/api/typescript/ModelMetadataEventData/index.md#trace)