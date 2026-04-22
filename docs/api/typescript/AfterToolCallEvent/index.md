Defined in: [src/hooks/events.ts:224](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/hooks/events.ts#L224)

Event triggered after a tool execution completes. Fired after tool execution finishes, whether successful or failed. Uses reverse callback ordering for proper cleanup semantics.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AfterToolCallEvent(data): AfterToolCallEvent;
```

Defined in: [src/hooks/events.ts:242](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/hooks/events.ts#L242)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `toolUse`: { `name`: `string`; `toolUseId`: `string`; `input`: [`JSONValue`](/docs/api/typescript/JSONValue/index.md); }; `tool`: [`Tool`](/docs/api/typescript/Tool/index.md); `result`: [`ToolResultBlock`](/docs/api/typescript/ToolResultBlock/index.md); `error?`: `Error`; } |
| `data.agent` | `LocalAgent` |
| `data.toolUse` | { `name`: `string`; `toolUseId`: `string`; `input`: [`JSONValue`](/docs/api/typescript/JSONValue/index.md); } |
| `data.toolUse.name` | `string` |
| `data.toolUse.toolUseId` | `string` |
| `data.toolUse.input` | [`JSONValue`](/docs/api/typescript/JSONValue/index.md) |
| `data.tool` | [`Tool`](/docs/api/typescript/Tool/index.md) |
| `data.result` | [`ToolResultBlock`](/docs/api/typescript/ToolResultBlock/index.md) |
| `data.error?` | `Error` |

#### Returns

`AfterToolCallEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "afterToolCallEvent";
```

Defined in: [src/hooks/events.ts:225](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/hooks/events.ts#L225)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:226](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/hooks/events.ts#L226)

---

### toolUse

```ts
readonly toolUse: {
  name: string;
  toolUseId: string;
  input: JSONValue;
};
```

Defined in: [src/hooks/events.ts:227](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/hooks/events.ts#L227)

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

Defined in: [src/hooks/events.ts:232](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/hooks/events.ts#L232)

---

### result

```ts
readonly result: ToolResultBlock;
```

Defined in: [src/hooks/events.ts:233](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/hooks/events.ts#L233)

---

### error?

```ts
readonly optional error?: Error;
```

Defined in: [src/hooks/events.ts:234](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/hooks/events.ts#L234)

---

### retry?

```ts
optional retry?: boolean;
```

Defined in: [src/hooks/events.ts:240](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/hooks/events.ts#L240)

Optional flag that can be set by hook callbacks to request a retry of the tool call. When set to true, the agent will re-execute the tool.

## Methods

### toJSON()

```ts
toJSON(): Pick<AfterToolCallEvent, "toolUse" | "type" | "result"> & {
  error?: {
     message?: string;
  };
};
```

Defined in: [src/hooks/events.ts:268](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/hooks/events.ts#L268)

Serializes for wire transport, excluding the agent reference, tool instance, and mutable retry flag. Converts Error to an extensible object for safe wire serialization. Called automatically by JSON.stringify().

#### Returns

`Pick`<`AfterToolCallEvent`, `"toolUse"` | `"type"` | `"result"`\> & { `error?`: { `message?`: `string`; }; }