Defined in: [src/hooks/events.ts:113](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/hooks/events.ts#L113)

Event triggered at the end of an agent request. Fired after all processing completes, regardless of success or error. Uses reverse callback ordering for proper cleanup semantics.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AfterInvocationEvent(data): AfterInvocationEvent;
```

Defined in: [src/hooks/events.ts:117](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/hooks/events.ts#L117)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [`AgentData`](/docs/api/typescript/AgentData/index.md); } |
| `data.agent` | [`AgentData`](/docs/api/typescript/AgentData/index.md) |

#### Returns

`AfterInvocationEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "afterInvocationEvent";
```

Defined in: [src/hooks/events.ts:114](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/hooks/events.ts#L114)

---

### agent

```ts
readonly agent: AgentData;
```

Defined in: [src/hooks/events.ts:115](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/hooks/events.ts#L115)