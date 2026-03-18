Defined in: [src/models/streaming.ts:123](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/streaming.ts#L123)

Data for a content block delta event.

## Properties

### type

```ts
type: "modelContentBlockDeltaEvent";
```

Defined in: [src/models/streaming.ts:127](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/streaming.ts#L127)

Discriminator for content block delta events.

---

### delta

```ts
delta: ContentBlockDelta;
```

Defined in: [src/models/streaming.ts:132](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/streaming.ts#L132)

The incremental content update.