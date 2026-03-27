Defined in: [src/hooks/events.ts:542](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L542)

Event triggered before executing tools. Fired when the model returns tool use blocks that need to be executed. Hook callbacks can set [cancel](#cancel) to prevent all tools from executing.

## Extends

-   [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new BeforeToolsEvent(data): BeforeToolsEvent;
```

Defined in: [src/hooks/events.ts:554](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L554)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md); `message`: [<code dir="auto">Message</code>](/docs/api/typescript/Message/index.md); } |
| `data.agent` | [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md) |
| `data.message` | [<code dir="auto">Message</code>](/docs/api/typescript/Message/index.md) |

#### Returns

`BeforeToolsEvent`

#### Overrides

[<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "beforeToolsEvent";
```

Defined in: [src/hooks/events.ts:543](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L543)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:544](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L544)

---

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:545](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L545)

---

### cancel

```ts
cancel: string | boolean = false;
```

Defined in: [src/hooks/events.ts:552](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L552)

Set by hook callbacks to cancel all tool calls. When set to `true`, a default cancel message is used. When set to a string, that string is used as the tool result error message.

## Methods

### toJSON()

```ts
toJSON(): Pick<BeforeToolsEvent, "type" | "message">;
```

Defined in: [src/hooks/events.ts:564](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L564)

Serializes for wire transport, excluding the agent reference and mutable cancel flag. Called automatically by JSON.stringify().

#### Returns

`Pick`<`BeforeToolsEvent`, `"type"` | `"message"`\>