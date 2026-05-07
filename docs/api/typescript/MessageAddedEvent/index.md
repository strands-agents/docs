Defined in: [src/hooks/events.ts:211](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L211)

Event triggered when the framework adds a message to the conversation history. Fired during the agent loop execution for framework-generated messages. Does not fire for initial messages from AgentConfig or user input messages.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new MessageAddedEvent(data): MessageAddedEvent;
```

Defined in: [src/hooks/events.ts:217](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L217)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `message`: [`Message`](/docs/api/typescript/Message/index.md); `invocationState`: [`InvocationState`](/docs/api/typescript/InvocationState/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.message` | [`Message`](/docs/api/typescript/Message/index.md) |
| `data.invocationState` | [`InvocationState`](/docs/api/typescript/InvocationState/index.md) |

#### Returns

`MessageAddedEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "messageAddedEvent";
```

Defined in: [src/hooks/events.ts:212](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L212)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:213](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L213)

---

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:214](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L214)

---

### invocationState

```ts
readonly invocationState: InvocationState;
```

Defined in: [src/hooks/events.ts:215](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L215)

## Methods

### toJSON()

```ts
toJSON(): Pick<MessageAddedEvent, "type" | "message">;
```

Defined in: [src/hooks/events.ts:228](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L228)

Serializes for wire transport, excluding the agent reference and invocationState. Called automatically by JSON.stringify().

#### Returns

`Pick`<`MessageAddedEvent`, `"type"` | `"message"`\>