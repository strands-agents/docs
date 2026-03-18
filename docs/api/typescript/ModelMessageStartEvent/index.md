Defined in: [src/models/streaming.ts:66](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/streaming.ts#L66)

Event emitted when a new message starts in the stream.

## Implements

-   [`ModelMessageStartEventData`](/docs/api/typescript/ModelMessageStartEventData/index.md)

## Properties

### type

```ts
readonly type: "modelMessageStartEvent";
```

Defined in: [src/models/streaming.ts:70](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/streaming.ts#L70)

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

Defined in: [src/models/streaming.ts:75](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/streaming.ts#L75)

The role of the message being started.

#### Implementation of

```ts
ModelMessageStartEventData.role
```