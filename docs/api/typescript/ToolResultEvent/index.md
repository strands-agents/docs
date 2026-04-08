Defined in: [src/hooks/events.ts:469](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L469)

Event triggered when a tool execution completes. Wraps the tool result block after a tool finishes execution.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ToolResultEvent(data): ToolResultEvent;
```

Defined in: [src/hooks/events.ts:474](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L474)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `result`: [`ToolResultBlock`](/docs/api/typescript/ToolResultBlock/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.result` | [`ToolResultBlock`](/docs/api/typescript/ToolResultBlock/index.md) |

#### Returns

`ToolResultEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "toolResultEvent";
```

Defined in: [src/hooks/events.ts:470](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L470)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:471](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L471)

---

### result

```ts
readonly result: ToolResultBlock;
```

Defined in: [src/hooks/events.ts:472](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L472)

## Methods

### toJSON()

```ts
toJSON(): Pick<ToolResultEvent, "type" | "result">;
```

Defined in: [src/hooks/events.ts:484](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L484)

Serializes for wire transport, excluding the agent reference. Called automatically by JSON.stringify().

#### Returns

`Pick`<`ToolResultEvent`, `"type"` | `"result"`\>