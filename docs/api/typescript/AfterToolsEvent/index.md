Defined in: [src/hooks/events.ts:427](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/hooks/events.ts#L427)

Event triggered after all tools complete execution. Fired after tool results are collected and ready to be added to conversation. Uses reverse callback ordering for proper cleanup semantics.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AfterToolsEvent(data): AfterToolsEvent;
```

Defined in: [src/hooks/events.ts:432](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/hooks/events.ts#L432)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [`AgentData`](/docs/api/typescript/AgentData/index.md); `message`: [`Message`](/docs/api/typescript/Message/index.md); } |
| `data.agent` | [`AgentData`](/docs/api/typescript/AgentData/index.md) |
| `data.message` | [`Message`](/docs/api/typescript/Message/index.md) |

#### Returns

`AfterToolsEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "afterToolsEvent";
```

Defined in: [src/hooks/events.ts:428](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/hooks/events.ts#L428)

---

### agent

```ts
readonly agent: AgentData;
```

Defined in: [src/hooks/events.ts:429](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/hooks/events.ts#L429)

---

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:430](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/hooks/events.ts#L430)