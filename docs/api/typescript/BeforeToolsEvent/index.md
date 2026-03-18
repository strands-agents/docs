Defined in: [src/hooks/events.ts:410](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/hooks/events.ts#L410)

Event triggered before executing tools. Fired when the model returns tool use blocks that need to be executed.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new BeforeToolsEvent(data): BeforeToolsEvent;
```

Defined in: [src/hooks/events.ts:415](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/hooks/events.ts#L415)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [`LocalAgent`](/docs/api/typescript/LocalAgent/index.md); `message`: [`Message`](/docs/api/typescript/Message/index.md); } |
| `data.agent` | [`LocalAgent`](/docs/api/typescript/LocalAgent/index.md) |
| `data.message` | [`Message`](/docs/api/typescript/Message/index.md) |

#### Returns

`BeforeToolsEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "beforeToolsEvent";
```

Defined in: [src/hooks/events.ts:411](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/hooks/events.ts#L411)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:412](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/hooks/events.ts#L412)

---

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:413](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/hooks/events.ts#L413)