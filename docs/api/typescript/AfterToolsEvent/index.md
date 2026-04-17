Defined in: [src/hooks/events.ts:579](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L579)

Event triggered after all tools complete execution. Fired after tool results are collected and ready to be added to conversation. Uses reverse callback ordering for proper cleanup semantics.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AfterToolsEvent(data): AfterToolsEvent;
```

Defined in: [src/hooks/events.ts:584](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L584)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `message`: [`Message`](/docs/api/typescript/Message/index.md); } |
| `data.agent` | `LocalAgent` |
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

Defined in: [src/hooks/events.ts:580](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L580)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:581](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L581)

---

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:582](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L582)

## Methods

### toJSON()

```ts
toJSON(): Pick<AfterToolsEvent, "type" | "message">;
```

Defined in: [src/hooks/events.ts:598](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L598)

Serializes for wire transport, excluding the agent reference. Called automatically by JSON.stringify().

#### Returns

`Pick`<`AfterToolsEvent`, `"type"` | `"message"`\>