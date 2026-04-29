Defined in: [src/hooks/events.ts:323](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L323)

Event triggered just before the model is invoked. Fired before sending messages to the model for inference.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new BeforeModelCallEvent(data): BeforeModelCallEvent;
```

Defined in: [src/hooks/events.ts:344](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L344)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `model`: [`Model`](/docs/api/typescript/Model/index.md); `invocationState`: [`InvocationState`](/docs/api/typescript/InvocationState/index.md); `projectedInputTokens?`: `number`; } |
| `data.agent` | `LocalAgent` |
| `data.model` | [`Model`](/docs/api/typescript/Model/index.md) |
| `data.invocationState` | [`InvocationState`](/docs/api/typescript/InvocationState/index.md) |
| `data.projectedInputTokens?` | `number` |

#### Returns

`BeforeModelCallEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "beforeModelCallEvent";
```

Defined in: [src/hooks/events.ts:324](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L324)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:325](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L325)

---

### model

```ts
readonly model: Model;
```

Defined in: [src/hooks/events.ts:326](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L326)

---

### invocationState

```ts
readonly invocationState: InvocationState;
```

Defined in: [src/hooks/events.ts:327](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L327)

---

### cancel

```ts
cancel: string | boolean = false;
```

Defined in: [src/hooks/events.ts:334](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L334)

Set by hook callbacks to cancel this model call. When set to `true`, a default cancel message is used. When set to a string, that string is used as the assistant response message.

---

### projectedInputTokens?

```ts
readonly optional projectedInputTokens?: number;
```

Defined in: [src/hooks/events.ts:342](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L342)

Projected input token count for the upcoming model call. Computed by the agent loop from message metadata and token estimation. Available for hooks and plugins (e.g. conversation managers) to make proactive decisions about context management.

## Methods

### toJSON()

```ts
toJSON(): Pick<BeforeModelCallEvent, "type" | "projectedInputTokens">;
```

Defined in: [src/hooks/events.ts:363](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L363)

Serializes for wire transport, excluding the agent reference and invocationState. Called automatically by JSON.stringify().

#### Returns

`Pick`<`BeforeModelCallEvent`, `"type"` | `"projectedInputTokens"`\>