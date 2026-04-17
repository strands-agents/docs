Defined in: [src/hooks/events.ts:182](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L182)

Event triggered just before a tool is executed. Fired after tool lookup but before execution begins. Hook callbacks can set [cancel](#cancel) to prevent the tool from executing.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new BeforeToolCallEvent(data): BeforeToolCallEvent;
```

Defined in: [src/hooks/events.ts:199](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L199)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `toolUse`: { `name`: `string`; `toolUseId`: `string`; `input`: [`JSONValue`](/docs/api/typescript/JSONValue/index.md); }; `tool`: [`Tool`](/docs/api/typescript/Tool/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.toolUse` | { `name`: `string`; `toolUseId`: `string`; `input`: [`JSONValue`](/docs/api/typescript/JSONValue/index.md); } |
| `data.toolUse.name` | `string` |
| `data.toolUse.toolUseId` | `string` |
| `data.toolUse.input` | [`JSONValue`](/docs/api/typescript/JSONValue/index.md) |
| `data.tool` | [`Tool`](/docs/api/typescript/Tool/index.md) |

#### Returns

`BeforeToolCallEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "beforeToolCallEvent";
```

Defined in: [src/hooks/events.ts:183](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L183)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:184](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L184)

---

### toolUse

```ts
readonly toolUse: {
  name: string;
  toolUseId: string;
  input: JSONValue;
};
```

Defined in: [src/hooks/events.ts:185](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L185)

#### name

```ts
name: string;
```

#### toolUseId

```ts
toolUseId: string;
```

#### input

```ts
input: JSONValue;
```

---

### tool

```ts
readonly tool: Tool;
```

Defined in: [src/hooks/events.ts:190](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L190)

---

### cancel

```ts
cancel: string | boolean = false;
```

Defined in: [src/hooks/events.ts:197](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L197)

Set by hook callbacks to cancel this tool call. When set to `true`, a default cancel message is used. When set to a string, that string is used as the tool result error message.

## Methods

### toJSON()

```ts
toJSON(): Pick<BeforeToolCallEvent, "type" | "toolUse">;
```

Defined in: [src/hooks/events.ts:214](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/hooks/events.ts#L214)

Serializes for wire transport, excluding the agent reference, tool instance, and mutable cancel flag. Called automatically by JSON.stringify().

#### Returns

`Pick`<`BeforeToolCallEvent`, `"type"` | `"toolUse"`\>