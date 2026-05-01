Defined in: [src/hooks/events.ts:647](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L647)

Event triggered as the final event in the agent stream. Wraps the agent result containing the stop reason and last message.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AgentResultEvent(data): AgentResultEvent;
```

Defined in: [src/hooks/events.ts:653](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L653)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `result`: [`AgentResult`](/docs/api/typescript/AgentResult/index.md); `invocationState`: [`InvocationState`](/docs/api/typescript/InvocationState/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.result` | [`AgentResult`](/docs/api/typescript/AgentResult/index.md) |
| `data.invocationState` | [`InvocationState`](/docs/api/typescript/InvocationState/index.md) |

#### Returns

`AgentResultEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "agentResultEvent";
```

Defined in: [src/hooks/events.ts:648](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L648)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:649](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L649)

---

### result

```ts
readonly result: AgentResult;
```

Defined in: [src/hooks/events.ts:650](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L650)

---

### invocationState

```ts
readonly invocationState: InvocationState;
```

Defined in: [src/hooks/events.ts:651](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L651)

## Methods

### toJSON()

```ts
toJSON(): Pick<AgentResultEvent, "type" | "result">;
```

Defined in: [src/hooks/events.ts:664](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L664)

Serializes for wire transport, excluding the agent reference and invocationState. Called automatically by JSON.stringify().

#### Returns

`Pick`<`AgentResultEvent`, `"type"` | `"result"`\>