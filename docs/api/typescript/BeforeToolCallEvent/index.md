Defined in: [src/hooks/events.ts:242](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/hooks/events.ts#L242)

Event triggered just before a tool is executed. Fired after tool lookup but before execution begins.

Hook callbacks can:

-   Set [cancel](#cancel) to prevent the tool from executing.
-   Set [selectedTool](#selectedtool) to execute a different tool in place of the registry’s match.
-   Mutate [toolUse](#tooluse) to rewrite the tool input, id, or name before execution. If `name` is changed and `selectedTool` is not set, the tool is re-resolved from the registry under the new name.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new BeforeToolCallEvent(data): BeforeToolCallEvent;
```

Defined in: [src/hooks/events.ts:267](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/hooks/events.ts#L267)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `toolUse`: [`ToolUseData`](/docs/api/typescript/ToolUseData/index.md); `tool`: [`Tool`](/docs/api/typescript/Tool/index.md); `invocationState`: [`InvocationState`](/docs/api/typescript/InvocationState/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.toolUse` | [`ToolUseData`](/docs/api/typescript/ToolUseData/index.md) |
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

Defined in: [src/hooks/events.ts:243](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/hooks/events.ts#L243)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:244](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/hooks/events.ts#L244)

---

### toolUse

```ts
toolUse: ToolUseData;
```

Defined in: [src/hooks/events.ts:245](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/hooks/events.ts#L245)

---

### tool

```ts
readonly tool: Tool;
```

Defined in: [src/hooks/events.ts:246](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/hooks/events.ts#L246)

---

### invocationState

```ts
readonly invocationState: InvocationState;
```

Defined in: [src/hooks/events.ts:247](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/hooks/events.ts#L247)

---

### cancel

```ts
cancel: string | boolean = false;
```

Defined in: [src/hooks/events.ts:254](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/hooks/events.ts#L254)

Set by hook callbacks to cancel this tool call. When set to `true`, a default cancel message is used. When set to a string, that string is used as the tool result error message.

---

### selectedTool

```ts
selectedTool: Tool = undefined;
```

Defined in: [src/hooks/events.ts:265](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/hooks/events.ts#L265)

Set by hook callbacks to execute a replacement tool instead of [tool](#tool). When undefined, the tool looked up from the registry (or re-resolved from a mutated `toolUse.name`) is used.

If multiple callbacks set `selectedTool`, the last callback to run wins. Callbacks run in registration order for this event, so the last-registered callback’s value is the one used.

## Methods

### toJSON()

```ts
toJSON(): Pick<BeforeToolCallEvent, "type" | "toolUse">;
```

Defined in: [src/hooks/events.ts:285](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/hooks/events.ts#L285)

Serializes for wire transport, excluding the agent reference, tool instance, invocationState, and mutable cancel / selectedTool fields. Called automatically by JSON.stringify().

#### Returns

`Pick`<`BeforeToolCallEvent`, `"type"` | `"toolUse"`\>