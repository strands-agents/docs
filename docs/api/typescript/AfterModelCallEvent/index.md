Defined in: [src/hooks/events.ts:447](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L447)

Event triggered after the model invocation completes. Fired after the model finishes generating a response, whether successful or failed. Uses reverse callback ordering for proper cleanup semantics.

Note: stopData may be undefined if an error occurs before the model completes.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AfterModelCallEvent(data): AfterModelCallEvent;
```

Defined in: [src/hooks/events.ts:461](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L461)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `model`: [`Model`](/docs/api/typescript/Model/index.md); `invocationState`: [`InvocationState`](/docs/api/typescript/InvocationState/index.md); `stopData?`: [`ModelStopResponse`](/docs/api/typescript/ModelStopResponse/index.md); `error?`: `Error`; } |
| `data.agent` | `LocalAgent` |
| `data.model` | [`Model`](/docs/api/typescript/Model/index.md) |
| `data.invocationState` | [`InvocationState`](/docs/api/typescript/InvocationState/index.md) |
| `data.stopData?` | [`ModelStopResponse`](/docs/api/typescript/ModelStopResponse/index.md) |
| `data.error?` | `Error` |

#### Returns

`AfterModelCallEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "afterModelCallEvent";
```

Defined in: [src/hooks/events.ts:448](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L448)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:449](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L449)

---

### model

```ts
readonly model: Model;
```

Defined in: [src/hooks/events.ts:450](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L450)

---

### stopData?

```ts
readonly optional stopData?: ModelStopResponse;
```

Defined in: [src/hooks/events.ts:451](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L451)

---

### error?

```ts
readonly optional error?: Error;
```

Defined in: [src/hooks/events.ts:452](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L452)

---

### invocationState

```ts
readonly invocationState: InvocationState;
```

Defined in: [src/hooks/events.ts:453](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L453)

---

### retry?

```ts
optional retry?: boolean;
```

Defined in: [src/hooks/events.ts:459](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L459)

Optional flag that can be set by hook callbacks to request a retry of the model call. When set to true, the agent will retry the model invocation.

## Methods

### toJSON()

```ts
toJSON(): Pick<AfterModelCallEvent, "type" | "stopData"> & {
  error?: {
     message?: string;
  };
};
```

Defined in: [src/hooks/events.ts:489](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/hooks/events.ts#L489)

Serializes for wire transport, excluding the agent reference, invocationState, and mutable retry flag. Converts Error to an extensible object for safe wire serialization. Called automatically by JSON.stringify().

#### Returns

`Pick`<`AfterModelCallEvent`, `"type"` | `"stopData"`\> & { `error?`: { `message?`: `string`; }; }