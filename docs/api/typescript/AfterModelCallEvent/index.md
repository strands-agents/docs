Defined in: [src/hooks/events.ts:340](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L340)

Event triggered after the model invocation completes. Fired after the model finishes generating a response, whether successful or failed. Uses reverse callback ordering for proper cleanup semantics.

Note: stopData may be undefined if an error occurs before the model completes.

## Extends

-   [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AfterModelCallEvent(data): AfterModelCallEvent;
```

Defined in: [src/hooks/events.ts:353](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L353)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; `model`: [<code dir="auto">Model</code>](/docs/api/typescript/Model/index.md); `stopData?`: [<code dir="auto">ModelStopResponse</code>](/docs/api/typescript/ModelStopResponse/index.md); `error?`: `Error`; } |
| `data.agent` | `LocalAgent` |
| `data.model` | [<code dir="auto">Model</code>](/docs/api/typescript/Model/index.md) |
| `data.stopData?` | [<code dir="auto">ModelStopResponse</code>](/docs/api/typescript/ModelStopResponse/index.md) |
| `data.error?` | `Error` |

#### Returns

`AfterModelCallEvent`

#### Overrides

[<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "afterModelCallEvent";
```

Defined in: [src/hooks/events.ts:341](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L341)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:342](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L342)

---

### model

```ts
readonly model: Model;
```

Defined in: [src/hooks/events.ts:343](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L343)

---

### stopData?

```ts
readonly optional stopData?: ModelStopResponse;
```

Defined in: [src/hooks/events.ts:344](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L344)

---

### error?

```ts
readonly optional error?: Error;
```

Defined in: [src/hooks/events.ts:345](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L345)

---

### retry?

```ts
optional retry?: boolean;
```

Defined in: [src/hooks/events.ts:351](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L351)

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

Defined in: [src/hooks/events.ts:374](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L374)

Serializes for wire transport, excluding the agent reference and mutable retry flag. Converts Error to an extensible object for safe wire serialization. Called automatically by JSON.stringify().

#### Returns

`Pick`<`AfterModelCallEvent`, `"type"` | `"stopData"`\> & { `error?`: { `message?`: `string`; }; }