Defined in: [src/hooks/events.ts:357](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/events.ts#L357)

Event triggered when a tool execution completes. Wraps the tool result block after a tool finishes execution.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ToolResultEvent(data): ToolResultEvent;
```

Defined in: [src/hooks/events.ts:362](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/events.ts#L362)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [`AgentData`](/docs/api/typescript/AgentData/index.md); `result`: [`ToolResultBlock`](/docs/api/typescript/ToolResultBlock/index.md); } |
| `data.agent` | [`AgentData`](/docs/api/typescript/AgentData/index.md) |
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

Defined in: [src/hooks/events.ts:358](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/events.ts#L358)

---

### agent

```ts
readonly agent: AgentData;
```

Defined in: [src/hooks/events.ts:359](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/events.ts#L359)

---

### result

```ts
readonly result: ToolResultBlock;
```

Defined in: [src/hooks/events.ts:360](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/events.ts#L360)