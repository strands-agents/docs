Defined in: [src/models/streaming.ts:184](https://github.com/strands-agents/sdk-typescript/blob/6a95bb5c4ffe0bb4e9969eefa8ccc38ba19193b6/strands-ts/src/models/streaming.ts#L184)

Data for a message stop event.

## Properties

### type

```ts
type: "modelMessageStopEvent";
```

Defined in: [src/models/streaming.ts:188](https://github.com/strands-agents/sdk-typescript/blob/6a95bb5c4ffe0bb4e9969eefa8ccc38ba19193b6/strands-ts/src/models/streaming.ts#L188)

Discriminator for message stop events.

---

### stopReason

```ts
stopReason: StopReason;
```

Defined in: [src/models/streaming.ts:193](https://github.com/strands-agents/sdk-typescript/blob/6a95bb5c4ffe0bb4e9969eefa8ccc38ba19193b6/strands-ts/src/models/streaming.ts#L193)

Reason why generation stopped.

---

### additionalModelResponseFields?

```ts
optional additionalModelResponseFields?: JSONValue;
```

Defined in: [src/models/streaming.ts:198](https://github.com/strands-agents/sdk-typescript/blob/6a95bb5c4ffe0bb4e9969eefa8ccc38ba19193b6/strands-ts/src/models/streaming.ts#L198)

Additional provider-specific response fields.