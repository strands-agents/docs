Defined in: [src/hooks/events.ts:522](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L522)

Event triggered as the final event in the agent stream. Wraps the agent result containing the stop reason and last message.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AgentResultEvent(data): AgentResultEvent;
```

Defined in: [src/hooks/events.ts:527](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L527)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `result`: [`AgentResult`](/docs/api/typescript/AgentResult/index.md); } |
| `data.agent` | `LocalAgent` |
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

Defined in: [src/hooks/events.ts:523](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L523)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:524](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L524)

---

### result

```ts
readonly result: AgentResult;
```

Defined in: [src/hooks/events.ts:525](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L525)

## Methods

### toJSON()

```ts
toJSON(): Pick<AgentResultEvent, "type" | "result">;
```

Defined in: [src/hooks/events.ts:537](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L537)

Serializes for wire transport, excluding the agent reference. Called automatically by JSON.stringify().

#### Returns

`Pick`<`AgentResultEvent`, `"type"` | `"result"`\>