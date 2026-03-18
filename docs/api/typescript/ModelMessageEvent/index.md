Defined in: [src/hooks/events.ts:339](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L339)

Event triggered when the model completes a full message. Wraps the assembled message and stop reason after model streaming finishes.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ModelMessageEvent(data): ModelMessageEvent;
```

Defined in: [src/hooks/events.ts:345](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L345)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [`LocalAgent`](/docs/api/typescript/LocalAgent/index.md); `message`: [`Message`](/docs/api/typescript/Message/index.md); `stopReason`: [`StopReason`](/docs/api/typescript/StopReason/index.md); } |
| `data.agent` | [`LocalAgent`](/docs/api/typescript/LocalAgent/index.md) |
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

Defined in: [src/hooks/events.ts:340](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L340)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:341](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L341)

---

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:342](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L342)

---

### stopReason

```ts
readonly stopReason: StopReason;
```

Defined in: [src/hooks/events.ts:343](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L343)