Defined in: [src/hooks/events.ts:361](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/hooks/events.ts#L361)

Event triggered for each streaming progress event from a tool during execution. Wraps a [ToolStreamEvent](/docs/api/typescript/ToolStreamEvent/index.md) with agent context, keeping the tool authoring interface unchanged — tools construct `ToolStreamEvent` without knowledge of agents or hooks, and the agent layer wraps them at the boundary.

Consistent with [ModelStreamUpdateEvent](/docs/api/typescript/ModelStreamUpdateEvent/index.md) which wraps model streaming events the same way.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ToolStreamUpdateEvent(data): ToolStreamUpdateEvent;
```

Defined in: [src/hooks/events.ts:366](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/hooks/events.ts#L366)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [`AgentData`](/docs/api/typescript/AgentData/index.md); `event`: [`ToolStreamEvent`](/docs/api/typescript/ToolStreamEvent/index.md); } |
| `data.agent` | [`AgentData`](/docs/api/typescript/AgentData/index.md) |
| `data.event` | [`ToolStreamEvent`](/docs/api/typescript/ToolStreamEvent/index.md) |

#### Returns

`ToolStreamUpdateEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "toolStreamUpdateEvent";
```

Defined in: [src/hooks/events.ts:362](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/hooks/events.ts#L362)

---

### agent

```ts
readonly agent: AgentData;
```

Defined in: [src/hooks/events.ts:363](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/hooks/events.ts#L363)

---

### event

```ts
readonly event: ToolStreamEvent;
```

Defined in: [src/hooks/events.ts:364](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/hooks/events.ts#L364)