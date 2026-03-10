Defined in: [src/models/streaming.ts:182](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L182)

Data for a message stop event.

## Properties

### type

```ts
type: "modelMessageStopEvent";
```

Defined in: [src/models/streaming.ts:186](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L186)

Discriminator for message stop events.

---

### stopReason

```ts
stopReason: StopReason;
```

Defined in: [src/models/streaming.ts:191](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L191)

Reason why generation stopped.

---

### additionalModelResponseFields?

```ts
optional additionalModelResponseFields: JSONValue;
```

Defined in: [src/models/streaming.ts:196](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/models/streaming.ts#L196)

Additional provider-specific response fields.