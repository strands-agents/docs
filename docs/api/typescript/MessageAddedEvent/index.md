Defined in: [src/hooks/events.ts:132](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L132)

Event triggered when the framework adds a message to the conversation history. Fired during the agent loop execution for framework-generated messages. Does not fire for initial messages from AgentConfig or user input messages.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new MessageAddedEvent(data): MessageAddedEvent;
```

Defined in: [src/hooks/events.ts:137](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L137)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [`LocalAgent`](/docs/api/typescript/LocalAgent/index.md); `message`: [`Message`](/docs/api/typescript/Message/index.md); } |
| `data.agent` | [`LocalAgent`](/docs/api/typescript/LocalAgent/index.md) |
| `data.message` | [`Message`](/docs/api/typescript/Message/index.md) |

#### Returns

`MessageAddedEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "messageAddedEvent";
```

Defined in: [src/hooks/events.ts:133](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L133)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:134](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L134)

---

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:135](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L135)