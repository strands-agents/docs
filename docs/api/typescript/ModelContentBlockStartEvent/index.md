Defined in: [src/models/streaming.ts:99](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/models/streaming.ts#L99)

Event emitted when a new content block starts in the stream.

## Implements

-   [`ModelContentBlockStartEventData`](/docs/api/typescript/ModelContentBlockStartEventData/index.md)

## Properties

### type

```ts
readonly type: "modelContentBlockStartEvent";
```

Defined in: [src/models/streaming.ts:103](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/models/streaming.ts#L103)

Discriminator for content block start events.

#### Implementation of

```ts
ModelContentBlockStartEventData.type
```

---

### start?

```ts
readonly optional start: ToolUseStart;
```

Defined in: [src/models/streaming.ts:109](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/models/streaming.ts#L109)

Information about the content block being started. Only present for tool use blocks.

#### Implementation of

```ts
ModelContentBlockStartEventData.start
```