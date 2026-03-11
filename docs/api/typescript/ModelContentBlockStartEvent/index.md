Defined in: [src/models/streaming.ts:101](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/streaming.ts#L101)

Event emitted when a new content block starts in the stream.

## Implements

-   [`ModelContentBlockStartEventData`](/docs/api/typescript/ModelContentBlockStartEventData/index.md)

## Properties

### type

```ts
readonly type: "modelContentBlockStartEvent";
```

Defined in: [src/models/streaming.ts:105](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/streaming.ts#L105)

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

Defined in: [src/models/streaming.ts:111](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/streaming.ts#L111)

Information about the content block being started. Only present for tool use blocks.

#### Implementation of

```ts
ModelContentBlockStartEventData.start
```