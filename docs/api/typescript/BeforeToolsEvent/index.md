Defined in: [src/hooks/events.ts:547](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L547)

Event triggered before executing tools. Fired when the model returns tool use blocks that need to be executed. Hook callbacks can set [cancel](#cancel) to prevent all tools from executing.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new BeforeToolsEvent(data): BeforeToolsEvent;
```

Defined in: [src/hooks/events.ts:559](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L559)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `message`: [`Message`](/docs/api/typescript/Message/index.md); } |
| `data.agent` | `LocalAgent` |
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

Defined in: [src/hooks/events.ts:548](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L548)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:549](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L549)

---

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:550](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L550)

---

### cancel

```ts
cancel: string | boolean = false;
```

Defined in: [src/hooks/events.ts:557](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L557)

Set by hook callbacks to cancel all tool calls. When set to `true`, a default cancel message is used. When set to a string, that string is used as the tool result error message.

## Methods

### toJSON()

```ts
toJSON(): Pick<BeforeToolsEvent, "type" | "message">;
```

Defined in: [src/hooks/events.ts:569](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L569)

Serializes for wire transport, excluding the agent reference and mutable cancel flag. Called automatically by JSON.stringify().

#### Returns

`Pick`<`BeforeToolsEvent`, `"type"` | `"message"`\>