Defined in: [src/types/messages.ts:56](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L56)

A message in a conversation between user and assistant. Each message has a role (user or assistant) and an array of content blocks.

## Implements

-   `JSONSerializable`<[`MessageData`](/docs/api/typescript/MessageData/index.md)\>

## Constructors

### Constructor

```ts
new Message(data): Message;
```

Defined in: [src/types/messages.ts:77](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L77)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `role`: [`Role`](/docs/api/typescript/Role/index.md); `content`: [`ContentBlock`](/docs/api/typescript/ContentBlock/index.md)\[\]; `metadata?`: `MessageMetadata`; } |
| `data.role` | [`Role`](/docs/api/typescript/Role/index.md) |
| `data.content` | [`ContentBlock`](/docs/api/typescript/ContentBlock/index.md)\[\] |
| `data.metadata?` | `MessageMetadata` |

#### Returns

`Message`

## Properties

### type

```ts
readonly type: "message";
```

Defined in: [src/types/messages.ts:60](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L60)

Discriminator for message type.

---

### role

```ts
readonly role: Role;
```

Defined in: [src/types/messages.ts:65](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L65)

The role of the message sender.

---

### content

```ts
readonly content: ContentBlock[];
```

Defined in: [src/types/messages.ts:70](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L70)

Array of content blocks that make up this message.

---

### metadata?

```ts
readonly optional metadata?: MessageMetadata;
```

Defined in: [src/types/messages.ts:75](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L75)

Optional metadata, not sent to model providers.

## Methods

### fromMessageData()

```ts
static fromMessageData(data): Message;
```

Defined in: [src/types/messages.ts:88](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L88)

Creates a Message instance from MessageData.

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [`MessageData`](/docs/api/typescript/MessageData/index.md) |

#### Returns

`Message`

---

### toJSON()

```ts
toJSON(): MessageData;
```

Defined in: [src/types/messages.ts:102](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L102)

Serializes the Message to a JSON-compatible MessageData object. Called automatically by JSON.stringify().

#### Returns

[`MessageData`](/docs/api/typescript/MessageData/index.md)

#### Implementation of

```ts
JSONSerializable.toJSON
```

---

### fromJSON()

```ts
static fromJSON(data): Message;
```

Defined in: [src/types/messages.ts:117](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/messages.ts#L117)

Creates a Message instance from MessageData. Alias for fromMessageData for API consistency.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | [`MessageData`](/docs/api/typescript/MessageData/index.md) | MessageData to deserialize |

#### Returns

`Message`

Message instance