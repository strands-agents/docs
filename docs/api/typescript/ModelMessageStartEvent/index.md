Defined in: [src/models/streaming.ts:66](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/streaming.ts#L66)

Event emitted when a new message starts in the stream.

## Implements

-   [<code dir="auto">ModelMessageStartEventData</code>](/docs/api/typescript/ModelMessageStartEventData/index.md)

## Constructors

### Constructor

```ts
new ModelMessageStartEvent(data): ModelMessageStartEvent;
```

Defined in: [src/models/streaming.ts:77](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/streaming.ts#L77)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [<code dir="auto">ModelMessageStartEventData</code>](/docs/api/typescript/ModelMessageStartEventData/index.md) |

#### Returns

`ModelMessageStartEvent`

## Properties

### type

```ts
readonly type: "modelMessageStartEvent";
```

Defined in: [src/models/streaming.ts:70](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/streaming.ts#L70)

Discriminator for message start events.

#### Implementation of

[<code dir="auto">ModelMessageStartEventData</code>](/docs/api/typescript/ModelMessageStartEventData/index.md).[<code dir="auto">type</code>](/docs/api/typescript/ModelMessageStartEventData/index.md#type)

---

### role

```ts
readonly role: Role;
```

Defined in: [src/models/streaming.ts:75](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/streaming.ts#L75)

The role of the message being started.

#### Implementation of

[<code dir="auto">ModelMessageStartEventData</code>](/docs/api/typescript/ModelMessageStartEventData/index.md).[<code dir="auto">role</code>](/docs/api/typescript/ModelMessageStartEventData/index.md#role)