Defined in: [src/hooks/events.ts:181](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L181)

Event triggered just before a tool is executed. Fired after tool lookup but before execution begins. Hook callbacks can set [cancel](#cancel) to prevent the tool from executing.

## Extends

-   [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new BeforeToolCallEvent(data): BeforeToolCallEvent;
```

Defined in: [src/hooks/events.ts:198](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L198)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md); `toolUse`: { `name`: `string`; `toolUseId`: `string`; `input`: [<code dir="auto">JSONValue</code>](/docs/api/typescript/JSONValue/index.md); }; `tool`: [<code dir="auto">Tool</code>](/docs/api/typescript/Tool/index.md); } |
| `data.agent` | [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md) |
| `data.toolUse` | { `name`: `string`; `toolUseId`: `string`; `input`: [<code dir="auto">JSONValue</code>](/docs/api/typescript/JSONValue/index.md); } |
| `data.toolUse.name` | `string` |
| `data.toolUse.toolUseId` | `string` |
| `data.toolUse.input` | [<code dir="auto">JSONValue</code>](/docs/api/typescript/JSONValue/index.md) |
| `data.tool` | [<code dir="auto">Tool</code>](/docs/api/typescript/Tool/index.md) |

#### Returns

`BeforeToolCallEvent`

#### Overrides

[<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "beforeToolCallEvent";
```

Defined in: [src/hooks/events.ts:182](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L182)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:183](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L183)

---

### toolUse

```ts
readonly toolUse: {
  name: string;
  toolUseId: string;
  input: JSONValue;
};
```

Defined in: [src/hooks/events.ts:184](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L184)

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

Defined in: [src/hooks/events.ts:189](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L189)

---

### cancel

```ts
cancel: string | boolean = false;
```

Defined in: [src/hooks/events.ts:196](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L196)

Set by hook callbacks to cancel this tool call. When set to `true`, a default cancel message is used. When set to a string, that string is used as the tool result error message.

## Methods

### toJSON()

```ts
toJSON(): Pick<BeforeToolCallEvent, "type" | "toolUse">;
```

Defined in: [src/hooks/events.ts:213](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L213)

Serializes for wire transport, excluding the agent reference, tool instance, and mutable cancel flag. Called automatically by JSON.stringify().

#### Returns

`Pick`<`BeforeToolCallEvent`, `"type"` | `"toolUse"`\>