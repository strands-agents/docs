Defined in: [src/models/streaming.ts:64](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/models/streaming.ts#L64)

Event emitted when a new message starts in the stream.

## Implements

-   [`ModelMessageStartEventData`](/docs/api/typescript/ModelMessageStartEventData/index.md)

## Properties

### type

```ts
readonly type: "modelMessageStartEvent";
```

Defined in: [src/models/streaming.ts:68](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/models/streaming.ts#L68)

Discriminator for message start events.

#### Implementation of

```ts
ModelMessageStartEventData.type
```

---

### role

```ts
readonly role: Role;
```

Defined in: [src/models/streaming.ts:73](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/models/streaming.ts#L73)

The role of the message being started.

#### Implementation of

```ts
ModelMessageStartEventData.role
```