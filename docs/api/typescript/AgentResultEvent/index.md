Defined in: [src/hooks/events.ts:517](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L517)

Event triggered as the final event in the agent stream. Wraps the agent result containing the stop reason and last message.

## Extends

-   [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AgentResultEvent(data): AgentResultEvent;
```

Defined in: [src/hooks/events.ts:522](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L522)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md); `result`: [<code dir="auto">AgentResult</code>](/docs/api/typescript/AgentResult/index.md); } |
| `data.agent` | [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md) |
| `data.result` | [<code dir="auto">AgentResult</code>](/docs/api/typescript/AgentResult/index.md) |

#### Returns

`AgentResultEvent`

#### Overrides

[<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "agentResultEvent";
```

Defined in: [src/hooks/events.ts:518](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L518)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:519](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L519)

---

### result

```ts
readonly result: AgentResult;
```

Defined in: [src/hooks/events.ts:520](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L520)

## Methods

### toJSON()

```ts
toJSON(): Pick<AgentResultEvent, "type" | "result">;
```

Defined in: [src/hooks/events.ts:532](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L532)

Serializes for wire transport, excluding the agent reference. Called automatically by JSON.stringify().

#### Returns

`Pick`<`AgentResultEvent`, `"type"` | `"result"`\>