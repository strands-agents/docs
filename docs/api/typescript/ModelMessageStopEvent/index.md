Defined in: [src/models/streaming.ts:204](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/streaming.ts#L204)

Event emitted when the message completes.

## Implements

-   [`ModelMessageStopEventData`](/docs/api/typescript/ModelMessageStopEventData/index.md)

## Properties

### type

```ts
readonly type: "modelMessageStopEvent";
```

Defined in: [src/models/streaming.ts:208](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/streaming.ts#L208)

Discriminator for message stop events.

#### Implementation of

```ts
ModelMessageStopEventData.type
```

---

### stopReason

```ts
readonly stopReason: StopReason;
```

Defined in: [src/models/streaming.ts:213](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/streaming.ts#L213)

Reason why generation stopped.

#### Implementation of

```ts
ModelMessageStopEventData.stopReason
```

---

### additionalModelResponseFields?

```ts
readonly optional additionalModelResponseFields: JSONValue;
```

Defined in: [src/models/streaming.ts:218](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/streaming.ts#L218)

Additional provider-specific response fields.

#### Implementation of

```ts
ModelMessageStopEventData.additionalModelResponseFields
```