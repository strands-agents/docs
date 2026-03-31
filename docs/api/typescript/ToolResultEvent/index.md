Defined in: [src/hooks/events.ts:469](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L469)

Event triggered when a tool execution completes. Wraps the tool result block after a tool finishes execution.

## Extends

-   [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ToolResultEvent(data): ToolResultEvent;
```

Defined in: [src/hooks/events.ts:474](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L474)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `result`: [<code dir="auto">ToolResultBlock</code>](/docs/api/typescript/ToolResultBlock/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.result` | [<code dir="auto">ToolResultBlock</code>](/docs/api/typescript/ToolResultBlock/index.md) |

#### Returns

`ToolResultEvent`

#### Overrides

[<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "toolResultEvent";
```

Defined in: [src/hooks/events.ts:470](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L470)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:471](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L471)

---

### result

```ts
readonly result: ToolResultBlock;
```

Defined in: [src/hooks/events.ts:472](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L472)

## Methods

### toJSON()

```ts
toJSON(): Pick<ToolResultEvent, "type" | "result">;
```

Defined in: [src/hooks/events.ts:484](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L484)

Serializes for wire transport, excluding the agent reference. Called automatically by JSON.stringify().

#### Returns

`Pick`<`ToolResultEvent`, `"type"` | `"result"`\>