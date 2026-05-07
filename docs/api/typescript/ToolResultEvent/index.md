Defined in: [src/hooks/events.ts:618](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L618)

Event triggered when a tool execution completes. Wraps the tool result block after a tool finishes execution.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ToolResultEvent(data): ToolResultEvent;
```

Defined in: [src/hooks/events.ts:624](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L624)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `result`: [`ToolResultBlock`](/docs/api/typescript/ToolResultBlock/index.md); `invocationState`: [`InvocationState`](/docs/api/typescript/InvocationState/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.result` | [`ToolResultBlock`](/docs/api/typescript/ToolResultBlock/index.md) |
| `data.invocationState` | [`InvocationState`](/docs/api/typescript/InvocationState/index.md) |

#### Returns

`ToolResultEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "toolResultEvent";
```

Defined in: [src/hooks/events.ts:619](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L619)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:620](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L620)

---

### result

```ts
readonly result: ToolResultBlock;
```

Defined in: [src/hooks/events.ts:621](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L621)

---

### invocationState

```ts
readonly invocationState: InvocationState;
```

Defined in: [src/hooks/events.ts:622](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L622)

## Methods

### toJSON()

```ts
toJSON(): Pick<ToolResultEvent, "type" | "result">;
```

Defined in: [src/hooks/events.ts:635](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L635)

Serializes for wire transport, excluding the agent reference and invocationState. Called automatically by JSON.stringify().

#### Returns

`Pick`<`ToolResultEvent`, `"type"` | `"result"`\>