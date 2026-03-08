Defined in: [src/hooks/events.ts:175](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/events.ts#L175)

Event triggered after a tool execution completes. Fired after tool execution finishes, whether successful or failed. Uses reverse callback ordering for proper cleanup semantics.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AfterToolCallEvent(data): AfterToolCallEvent;
```

Defined in: [src/hooks/events.ts:193](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/events.ts#L193)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [`AgentData`](/docs/api/typescript/AgentData/index.md); `toolUse`: { `name`: `string`; `toolUseId`: `string`; `input`: [`JSONValue`](/docs/api/typescript/JSONValue/index.md); }; `tool`: [`Tool`](/docs/api/typescript/Tool/index.md); `result`: [`ToolResultBlock`](/docs/api/typescript/ToolResultBlock/index.md); `error?`: `Error`; } |
| `data.agent` | [`AgentData`](/docs/api/typescript/AgentData/index.md) |
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

Defined in: [src/hooks/events.ts:176](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/events.ts#L176)

---

### agent

```ts
readonly agent: AgentData;
```

Defined in: [src/hooks/events.ts:177](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/events.ts#L177)

---

### toolUse

```ts
readonly toolUse: {
  name: string;
  toolUseId: string;
  input: JSONValue;
};
```

Defined in: [src/hooks/events.ts:178](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/events.ts#L178)

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

Defined in: [src/hooks/events.ts:183](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/events.ts#L183)

---

### result

```ts
readonly result: ToolResultBlock;
```

Defined in: [src/hooks/events.ts:184](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/events.ts#L184)

---

### error?

```ts
readonly optional error: Error;
```

Defined in: [src/hooks/events.ts:185](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/events.ts#L185)

---

### retry?

```ts
optional retry: boolean;
```

Defined in: [src/hooks/events.ts:191](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/events.ts#L191)

Optional flag that can be set by hook callbacks to request a retry of the tool call. When set to true, the agent will re-execute the tool.