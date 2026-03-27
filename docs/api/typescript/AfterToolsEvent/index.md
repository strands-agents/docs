Defined in: [src/hooks/events.ts:574](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L574)

Event triggered after all tools complete execution. Fired after tool results are collected and ready to be added to conversation. Uses reverse callback ordering for proper cleanup semantics.

## Extends

-   [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AfterToolsEvent(data): AfterToolsEvent;
```

Defined in: [src/hooks/events.ts:579](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L579)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md); `message`: [<code dir="auto">Message</code>](/docs/api/typescript/Message/index.md); } |
| `data.agent` | [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md) |
| `data.message` | [<code dir="auto">Message</code>](/docs/api/typescript/Message/index.md) |

#### Returns

`AfterToolsEvent`

#### Overrides

[<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "afterToolsEvent";
```

Defined in: [src/hooks/events.ts:575](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L575)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:576](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L576)

---

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:577](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L577)

## Methods

### toJSON()

```ts
toJSON(): Pick<AfterToolsEvent, "type" | "message">;
```

Defined in: [src/hooks/events.ts:593](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L593)

Serializes for wire transport, excluding the agent reference. Called automatically by JSON.stringify().

#### Returns

`Pick`<`AfterToolsEvent`, `"type"` | `"message"`\>