Defined in: [src/hooks/events.ts:184](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/hooks/events.ts#L184)

Event triggered when the framework adds a message to the conversation history. Fired during the agent loop execution for framework-generated messages. Does not fire for initial messages from AgentConfig or user input messages.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new MessageAddedEvent(data): MessageAddedEvent;
```

Defined in: [src/hooks/events.ts:190](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/hooks/events.ts#L190)

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

Defined in: [src/hooks/events.ts:185](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/hooks/events.ts#L185)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:186](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/hooks/events.ts#L186)

---

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:187](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/hooks/events.ts#L187)

---

### invocationState

```ts
readonly invocationState: InvocationState;
```

Defined in: [src/hooks/events.ts:188](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/hooks/events.ts#L188)

## Methods

### toJSON()

```ts
toJSON(): Pick<MessageAddedEvent, "type" | "message">;
```

Defined in: [src/hooks/events.ts:201](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/hooks/events.ts#L201)

Serializes for wire transport, excluding the agent reference and invocationState. Called automatically by JSON.stringify().

#### Returns

`Pick`<`MessageAddedEvent`, `"type"` | `"message"`\>