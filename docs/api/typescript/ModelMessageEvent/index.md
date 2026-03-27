Defined in: [src/hooks/events.ts:438](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L438)

Event triggered when the model completes a full message. Wraps the assembled message and stop reason after model streaming finishes.

## Extends

-   [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ModelMessageEvent(data): ModelMessageEvent;
```

Defined in: [src/hooks/events.ts:444](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L444)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md); `message`: [<code dir="auto">Message</code>](/docs/api/typescript/Message/index.md); `stopReason`: [<code dir="auto">StopReason</code>](/docs/api/typescript/StopReason/index.md); } |
| `data.agent` | [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md) |
| `data.message` | [<code dir="auto">Message</code>](/docs/api/typescript/Message/index.md) |
| `data.stopReason` | [<code dir="auto">StopReason</code>](/docs/api/typescript/StopReason/index.md) |

#### Returns

`ModelMessageEvent`

#### Overrides

[<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "modelMessageEvent";
```

Defined in: [src/hooks/events.ts:439](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L439)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:440](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L440)

---

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:441](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L441)

---

### stopReason

```ts
readonly stopReason: StopReason;
```

Defined in: [src/hooks/events.ts:442](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L442)

## Methods

### toJSON()

```ts
toJSON(): Pick<ModelMessageEvent, "type" | "message" | "stopReason">;
```

Defined in: [src/hooks/events.ts:455](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L455)

Serializes for wire transport, excluding the agent reference. Called automatically by JSON.stringify().

#### Returns

`Pick`<`ModelMessageEvent`, `"type"` | `"message"` | `"stopReason"`\>