Defined in: [src/hooks/events.ts:84](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/events.ts#L84)

Event triggered when an agent has finished initialization. Fired after the agent has been fully constructed and all built-in components have been initialized.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new InitializedEvent(data): InitializedEvent;
```

Defined in: [src/hooks/events.ts:88](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/events.ts#L88)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [`AgentData`](/docs/api/typescript/AgentData/index.md); } |
| `data.agent` | [`AgentData`](/docs/api/typescript/AgentData/index.md) |

#### Returns

`InitializedEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "initializedEvent";
```

Defined in: [src/hooks/events.ts:85](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/events.ts#L85)

---

### agent

```ts
readonly agent: AgentData;
```

Defined in: [src/hooks/events.ts:86](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/events.ts#L86)