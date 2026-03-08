Defined in: [src/models/streaming.ts:121](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/streaming.ts#L121)

Data for a content block delta event.

## Properties

### type

```ts
type: "modelContentBlockDeltaEvent";
```

Defined in: [src/models/streaming.ts:125](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/streaming.ts#L125)

Discriminator for content block delta events.

---

### delta

```ts
delta: ContentBlockDelta;
```

Defined in: [src/models/streaming.ts:130](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/streaming.ts#L130)

The incremental content update.