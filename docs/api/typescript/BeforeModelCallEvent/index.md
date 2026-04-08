Defined in: [src/hooks/events.ts:282](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L282)

Event triggered just before the model is invoked. Fired before sending messages to the model for inference.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new BeforeModelCallEvent(data): BeforeModelCallEvent;
```

Defined in: [src/hooks/events.ts:287](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L287)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `model`: [`Model`](/docs/api/typescript/Model/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.model` | [`Model`](/docs/api/typescript/Model/index.md) |

#### Returns

`BeforeModelCallEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "beforeModelCallEvent";
```

Defined in: [src/hooks/events.ts:283](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L283)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:284](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L284)

---

### model

```ts
readonly model: Model;
```

Defined in: [src/hooks/events.ts:285](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L285)

## Methods

### toJSON()

```ts
toJSON(): Pick<BeforeModelCallEvent, "type">;
```

Defined in: [src/hooks/events.ts:297](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/hooks/events.ts#L297)

Serializes for wire transport, excluding the agent reference. Called automatically by JSON.stringify().

#### Returns

`Pick`<`BeforeModelCallEvent`, `"type"`\>