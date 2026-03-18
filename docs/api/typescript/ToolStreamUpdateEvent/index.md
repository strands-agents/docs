Defined in: [src/hooks/events.ts:378](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L378)

Event triggered for each streaming progress event from a tool during execution. Wraps a [ToolStreamEvent](/docs/api/typescript/ToolStreamEvent/index.md) with agent context, keeping the tool authoring interface unchanged — tools construct `ToolStreamEvent` without knowledge of agents or hooks, and the agent layer wraps them at the boundary.

Consistent with [ModelStreamUpdateEvent](/docs/api/typescript/ModelStreamUpdateEvent/index.md) which wraps model streaming events the same way.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ToolStreamUpdateEvent(data): ToolStreamUpdateEvent;
```

Defined in: [src/hooks/events.ts:383](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L383)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [`LocalAgent`](/docs/api/typescript/LocalAgent/index.md); `event`: [`ToolStreamEvent`](/docs/api/typescript/ToolStreamEvent/index.md); } |
| `data.agent` | [`LocalAgent`](/docs/api/typescript/LocalAgent/index.md) |
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

Defined in: [src/hooks/events.ts:379](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L379)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:380](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L380)

---

### event

```ts
readonly event: ToolStreamEvent;
```

Defined in: [src/hooks/events.ts:381](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L381)