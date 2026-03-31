Defined in: [src/hooks/events.ts:157](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L157)

Event triggered when the framework adds a message to the conversation history. Fired during the agent loop execution for framework-generated messages. Does not fire for initial messages from AgentConfig or user input messages.

## Extends

-   [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new MessageAddedEvent(data): MessageAddedEvent;
```

Defined in: [src/hooks/events.ts:162](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L162)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `message`: [<code dir="auto">Message</code>](/docs/api/typescript/Message/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.message` | [<code dir="auto">Message</code>](/docs/api/typescript/Message/index.md) |

#### Returns

`MessageAddedEvent`

#### Overrides

[<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "messageAddedEvent";
```

Defined in: [src/hooks/events.ts:158](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L158)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:159](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L159)

---

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:160](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L160)

## Methods

### toJSON()

```ts
toJSON(): Pick<MessageAddedEvent, "type" | "message">;
```

Defined in: [src/hooks/events.ts:172](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L172)

Serializes for wire transport, excluding the agent reference. Called automatically by JSON.stringify().

#### Returns

`Pick`<`MessageAddedEvent`, `"type"` | `"message"`\>