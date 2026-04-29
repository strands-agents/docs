Defined in: [src/hooks/events.ts:211](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L211)

Event triggered just before a tool is executed. Fired after tool lookup but before execution begins. Hook callbacks can set [cancel](#cancel) to prevent the tool from executing.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new BeforeToolCallEvent(data): BeforeToolCallEvent;
```

Defined in: [src/hooks/events.ts:229](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L229)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `toolUse`: { `name`: `string`; `toolUseId`: `string`; `input`: [`JSONValue`](/docs/api/typescript/JSONValue/index.md); }; `tool`: [`Tool`](/docs/api/typescript/Tool/index.md); `invocationState`: [`InvocationState`](/docs/api/typescript/InvocationState/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.toolUse` | { `name`: `string`; `toolUseId`: `string`; `input`: [`JSONValue`](/docs/api/typescript/JSONValue/index.md); } |
| `data.toolUse.name` | `string` |
| `data.toolUse.toolUseId` | `string` |
| `data.toolUse.input` | [`JSONValue`](/docs/api/typescript/JSONValue/index.md) |
| `data.tool` | [`Tool`](/docs/api/typescript/Tool/index.md) |
| `data.invocationState` | [`InvocationState`](/docs/api/typescript/InvocationState/index.md) |

#### Returns

`BeforeToolCallEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "beforeToolCallEvent";
```

Defined in: [src/hooks/events.ts:212](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L212)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:213](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L213)

---

### toolUse

```ts
readonly toolUse: {
  name: string;
  toolUseId: string;
  input: JSONValue;
};
```

Defined in: [src/hooks/events.ts:214](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L214)

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

Defined in: [src/hooks/events.ts:219](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L219)

---

### invocationState

```ts
readonly invocationState: InvocationState;
```

Defined in: [src/hooks/events.ts:220](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L220)

---

### cancel

```ts
cancel: string | boolean = false;
```

Defined in: [src/hooks/events.ts:227](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L227)

Set by hook callbacks to cancel this tool call. When set to `true`, a default cancel message is used. When set to a string, that string is used as the tool result error message.

## Methods

### toJSON()

```ts
toJSON(): Pick<BeforeToolCallEvent, "type" | "toolUse">;
```

Defined in: [src/hooks/events.ts:246](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L246)

Serializes for wire transport, excluding the agent reference, tool instance, invocationState, and mutable cancel flag. Called automatically by JSON.stringify().

#### Returns

`Pick`<`BeforeToolCallEvent`, `"type"` | `"toolUse"`\>