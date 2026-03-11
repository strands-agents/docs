Defined in: [src/types/messages.ts:35](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/messages.ts#L35)

A message in a conversation between user and assistant. Each message has a role (user or assistant) and an array of content blocks.

## Implements

-   `JSONSerializable`<[`MessageData`](/docs/api/typescript/MessageData/index.md)\>

## Constructors

### Constructor

```ts
new Message(data): Message;
```

Defined in: [src/types/messages.ts:51](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/messages.ts#L51)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `role`: [`Role`](/docs/api/typescript/Role/index.md); `content`: [`ContentBlock`](/docs/api/typescript/ContentBlock/index.md)\[\]; } |
| `data.role` | [`Role`](/docs/api/typescript/Role/index.md) |
| `data.content` | [`ContentBlock`](/docs/api/typescript/ContentBlock/index.md)\[\] |

#### Returns

`Message`

## Properties

### type

```ts
readonly type: "message";
```

Defined in: [src/types/messages.ts:39](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/messages.ts#L39)

Discriminator for message type.

---

### role

```ts
readonly role: Role;
```

Defined in: [src/types/messages.ts:44](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/messages.ts#L44)

The role of the message sender.

---

### content

```ts
readonly content: ContentBlock[];
```

Defined in: [src/types/messages.ts:49](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/messages.ts#L49)

Array of content blocks that make up this message.

## Methods

### fromMessageData()

```ts
static fromMessageData(data): Message;
```

Defined in: [src/types/messages.ts:59](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/messages.ts#L59)

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

Defined in: [src/types/messages.ts:72](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/messages.ts#L72)

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

Defined in: [src/types/messages.ts:86](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/messages.ts#L86)

Creates a Message instance from MessageData. Alias for fromMessageData for API consistency.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | [`MessageData`](/docs/api/typescript/MessageData/index.md) | MessageData to deserialize |

#### Returns

`Message`

Message instance