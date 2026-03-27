Defined in: [src/models/streaming.ts:204](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/streaming.ts#L204)

Event emitted when the message completes.

## Implements

-   [<code dir="auto">ModelMessageStopEventData</code>](/docs/api/typescript/ModelMessageStopEventData/index.md)

## Constructors

### Constructor

```ts
new ModelMessageStopEvent(data): ModelMessageStopEvent;
```

Defined in: [src/models/streaming.ts:220](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/streaming.ts#L220)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [<code dir="auto">ModelMessageStopEventData</code>](/docs/api/typescript/ModelMessageStopEventData/index.md) |

#### Returns

`ModelMessageStopEvent`

## Properties

### type

```ts
readonly type: "modelMessageStopEvent";
```

Defined in: [src/models/streaming.ts:208](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/streaming.ts#L208)

Discriminator for message stop events.

#### Implementation of

[<code dir="auto">ModelMessageStopEventData</code>](/docs/api/typescript/ModelMessageStopEventData/index.md).[<code dir="auto">type</code>](/docs/api/typescript/ModelMessageStopEventData/index.md#type)

---

### stopReason

```ts
readonly stopReason: StopReason;
```

Defined in: [src/models/streaming.ts:213](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/streaming.ts#L213)

Reason why generation stopped.

#### Implementation of

[<code dir="auto">ModelMessageStopEventData</code>](/docs/api/typescript/ModelMessageStopEventData/index.md).[<code dir="auto">stopReason</code>](/docs/api/typescript/ModelMessageStopEventData/index.md#stopreason)

---

### additionalModelResponseFields?

```ts
readonly optional additionalModelResponseFields?: JSONValue;
```

Defined in: [src/models/streaming.ts:218](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/models/streaming.ts#L218)

Additional provider-specific response fields.

#### Implementation of

[<code dir="auto">ModelMessageStopEventData</code>](/docs/api/typescript/ModelMessageStopEventData/index.md).[<code dir="auto">additionalModelResponseFields</code>](/docs/api/typescript/ModelMessageStopEventData/index.md#additionalmodelresponsefields)