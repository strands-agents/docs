Defined in: [src/hooks/events.ts:168](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L168)

Event triggered at the end of an agent request. Fired after all processing completes, regardless of success or error. Uses reverse callback ordering for proper cleanup semantics.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AfterInvocationEvent(data): AfterInvocationEvent;
```

Defined in: [src/hooks/events.ts:184](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L184)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `invocationState`: [`InvocationState`](/docs/api/typescript/InvocationState/index.md); } |
| `data.agent` | `LocalAgent` |
| `data.invocationState` | [`InvocationState`](/docs/api/typescript/InvocationState/index.md) |

#### Returns

`AfterInvocationEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "afterInvocationEvent";
```

Defined in: [src/hooks/events.ts:169](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L169)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:170](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L170)

---

### invocationState

```ts
readonly invocationState: InvocationState;
```

Defined in: [src/hooks/events.ts:171](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L171)

---

### resume

```ts
resume: InvokeArgs = undefined;
```

Defined in: [src/hooks/events.ts:182](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L182)

Set by hook callbacks to trigger a follow-up agent invocation with new input. When set, after this event’s callbacks complete the agent re-enters its loop with these args as new input, under the same invocation lock. A fresh [BeforeInvocationEvent](/docs/api/typescript/BeforeInvocationEvent/index.md)/AfterInvocationEvent pair fires for the resumed run. Ignored if the invocation ended with an error.

If multiple callbacks set `resume`, the last callback to run wins.

## Methods

### toJSON()

```ts
toJSON(): Pick<AfterInvocationEvent, "type">;
```

Defined in: [src/hooks/events.ts:199](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L199)

Serializes for wire transport, excluding the agent reference, invocationState, and mutable resume field. Called automatically by JSON.stringify().

#### Returns

`Pick`<`AfterInvocationEvent`, `"type"`\>