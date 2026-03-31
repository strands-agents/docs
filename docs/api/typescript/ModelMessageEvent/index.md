Defined in: [src/hooks/events.ts:443](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L443)

Event triggered when the model completes a full message. Wraps the assembled message and stop reason after model streaming finishes.

## Extends

-   [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ModelMessageEvent(data): ModelMessageEvent;
```

Defined in: [src/hooks/events.ts:449](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L449)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `message`: [<code dir="auto">Message</code>](/docs/api/typescript/Message/index.md); `stopReason`: [<code dir="auto">StopReason</code>](/docs/api/typescript/StopReason/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.message` | [<code dir="auto">Message</code>](/docs/api/typescript/Message/index.md) |
| `data.stopReason` | [<code dir="auto">StopReason</code>](/docs/api/typescript/StopReason/index.md) |

#### Returns

`ModelMessageEvent`

#### Overrides

[<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "modelMessageEvent";
```

Defined in: [src/hooks/events.ts:444](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L444)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:445](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L445)

---

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:446](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L446)

---

### stopReason

```ts
readonly stopReason: StopReason;
```

Defined in: [src/hooks/events.ts:447](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L447)

## Methods

### toJSON()

```ts
toJSON(): Pick<ModelMessageEvent, "type" | "message" | "stopReason">;
```

Defined in: [src/hooks/events.ts:460](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L460)

Serializes for wire transport, excluding the agent reference. Called automatically by JSON.stringify().

#### Returns

`Pick`<`ModelMessageEvent`, `"type"` | `"message"` | `"stopReason"`\>