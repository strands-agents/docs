Defined in: [src/hooks/events.ts:394](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/hooks/events.ts#L394)

Event triggered as the final event in the agent stream. Wraps the agent result containing the stop reason and last message.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AgentResultEvent(data): AgentResultEvent;
```

Defined in: [src/hooks/events.ts:399](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/hooks/events.ts#L399)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [`AgentData`](/docs/api/typescript/AgentData/index.md); `result`: [`AgentResult`](/docs/api/typescript/AgentResult/index.md); } |
| `data.agent` | [`AgentData`](/docs/api/typescript/AgentData/index.md) |
| `data.result` | [`AgentResult`](/docs/api/typescript/AgentResult/index.md) |

#### Returns

`AgentResultEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "agentResultEvent";
```

Defined in: [src/hooks/events.ts:395](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/hooks/events.ts#L395)

---

### agent

```ts
readonly agent: AgentData;
```

Defined in: [src/hooks/events.ts:396](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/hooks/events.ts#L396)

---

### result

```ts
readonly result: AgentResult;
```

Defined in: [src/hooks/events.ts:397](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/hooks/events.ts#L397)