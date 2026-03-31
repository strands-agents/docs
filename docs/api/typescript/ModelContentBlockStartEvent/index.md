Defined in: [src/models/streaming.ts:101](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/streaming.ts#L101)

Event emitted when a new content block starts in the stream.

## Implements

-   [<code dir="auto">ModelContentBlockStartEventData</code>](/docs/api/typescript/ModelContentBlockStartEventData/index.md)

## Constructors

### Constructor

```ts
new ModelContentBlockStartEvent(data): ModelContentBlockStartEvent;
```

Defined in: [src/models/streaming.ts:113](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/streaming.ts#L113)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [<code dir="auto">ModelContentBlockStartEventData</code>](/docs/api/typescript/ModelContentBlockStartEventData/index.md) |

#### Returns

`ModelContentBlockStartEvent`

## Properties

### type

```ts
readonly type: "modelContentBlockStartEvent";
```

Defined in: [src/models/streaming.ts:105](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/streaming.ts#L105)

Discriminator for content block start events.

#### Implementation of

[<code dir="auto">ModelContentBlockStartEventData</code>](/docs/api/typescript/ModelContentBlockStartEventData/index.md).[<code dir="auto">type</code>](/docs/api/typescript/ModelContentBlockStartEventData/index.md#type)

---

### start?

```ts
readonly optional start?: ToolUseStart;
```

Defined in: [src/models/streaming.ts:111](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/streaming.ts#L111)

Information about the content block being started. Only present for tool use blocks.

#### Implementation of

[<code dir="auto">ModelContentBlockStartEventData</code>](/docs/api/typescript/ModelContentBlockStartEventData/index.md).[<code dir="auto">start</code>](/docs/api/typescript/ModelContentBlockStartEventData/index.md#start)