Defined in: [src/hooks/events.ts:376](https://github.com/strands-agents/sdk-typescript/blob/f72cbc85fd52a15f9ee0400e717de2ab11731169/strands-ts/src/hooks/events.ts#L376)

Event triggered just before the model is invoked. Fired before sending messages to the model for inference.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new BeforeModelCallEvent(data): BeforeModelCallEvent;
```

Defined in: [src/hooks/events.ts:397](https://github.com/strands-agents/sdk-typescript/blob/f72cbc85fd52a15f9ee0400e717de2ab11731169/strands-ts/src/hooks/events.ts#L397)

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

Defined in: [src/hooks/events.ts:377](https://github.com/strands-agents/sdk-typescript/blob/f72cbc85fd52a15f9ee0400e717de2ab11731169/strands-ts/src/hooks/events.ts#L377)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:378](https://github.com/strands-agents/sdk-typescript/blob/f72cbc85fd52a15f9ee0400e717de2ab11731169/strands-ts/src/hooks/events.ts#L378)

---

### model

```ts
readonly model: Model;
```

Defined in: [src/hooks/events.ts:379](https://github.com/strands-agents/sdk-typescript/blob/f72cbc85fd52a15f9ee0400e717de2ab11731169/strands-ts/src/hooks/events.ts#L379)

---

### invocationState

```ts
readonly invocationState: InvocationState;
```

Defined in: [src/hooks/events.ts:380](https://github.com/strands-agents/sdk-typescript/blob/f72cbc85fd52a15f9ee0400e717de2ab11731169/strands-ts/src/hooks/events.ts#L380)

---

### cancel

```ts
cancel: string | boolean = false;
```

Defined in: [src/hooks/events.ts:387](https://github.com/strands-agents/sdk-typescript/blob/f72cbc85fd52a15f9ee0400e717de2ab11731169/strands-ts/src/hooks/events.ts#L387)

Set by hook callbacks to cancel this model call. When set to `true`, a default cancel message is used. When set to a string, that string is used as the assistant response message.

---

### projectedInputTokens?

```ts
readonly optional projectedInputTokens?: number;
```

Defined in: [src/hooks/events.ts:395](https://github.com/strands-agents/sdk-typescript/blob/f72cbc85fd52a15f9ee0400e717de2ab11731169/strands-ts/src/hooks/events.ts#L395)

Projected input token count for the upcoming model call. Computed by the agent loop from message metadata and token estimation. Available for hooks and plugins (e.g. conversation managers) to make proactive decisions about context management.

## Methods

### toJSON()

```ts
toJSON(): Pick<BeforeModelCallEvent, "type" | "projectedInputTokens">;
```

Defined in: [src/hooks/events.ts:416](https://github.com/strands-agents/sdk-typescript/blob/f72cbc85fd52a15f9ee0400e717de2ab11731169/strands-ts/src/hooks/events.ts#L416)

Serializes for wire transport, excluding the agent reference and invocationState. Called automatically by JSON.stringify().

#### Returns

`Pick`<`BeforeModelCallEvent`, `"type"` | `"projectedInputTokens"`\>