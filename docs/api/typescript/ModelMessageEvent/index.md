Defined in: [src/hooks/events.ts:322](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/events.ts#L322)

Event triggered when the model completes a full message. Wraps the assembled message and stop reason after model streaming finishes.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ModelMessageEvent(data): ModelMessageEvent;
```

Defined in: [src/hooks/events.ts:328](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/events.ts#L328)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [`AgentData`](/docs/api/typescript/AgentData/index.md); `message`: [`Message`](/docs/api/typescript/Message/index.md); `stopReason`: [`StopReason`](/docs/api/typescript/StopReason/index.md); } |
| `data.agent` | [`AgentData`](/docs/api/typescript/AgentData/index.md) |
| `data.message` | [`Message`](/docs/api/typescript/Message/index.md) |
| `data.stopReason` | [`StopReason`](/docs/api/typescript/StopReason/index.md) |

#### Returns

`ModelMessageEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "modelMessageEvent";
```

Defined in: [src/hooks/events.ts:323](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/events.ts#L323)

---

### agent

```ts
readonly agent: AgentData;
```

Defined in: [src/hooks/events.ts:324](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/events.ts#L324)

---

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:325](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/events.ts#L325)

---

### stopReason

```ts
readonly stopReason: StopReason;
```

Defined in: [src/hooks/events.ts:326](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/events.ts#L326)