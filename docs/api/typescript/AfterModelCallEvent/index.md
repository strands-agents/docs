Defined in: [src/hooks/events.ts:337](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L337)

Event triggered after the model invocation completes. Fired after the model finishes generating a response, whether successful or failed. Uses reverse callback ordering for proper cleanup semantics.

Note: stopData may be undefined if an error occurs before the model completes.

## Extends

-   [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AfterModelCallEvent(data): AfterModelCallEvent;
```

Defined in: [src/hooks/events.ts:349](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L349)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md); `stopData?`: [<code dir="auto">ModelStopResponse</code>](/docs/api/typescript/ModelStopResponse/index.md); `error?`: `Error`; } |
| `data.agent` | [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md) |
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

Defined in: [src/hooks/events.ts:338](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L338)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:339](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L339)

---

### stopData?

```ts
readonly optional stopData?: ModelStopResponse;
```

Defined in: [src/hooks/events.ts:340](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L340)

---

### error?

```ts
readonly optional error?: Error;
```

Defined in: [src/hooks/events.ts:341](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L341)

---

### retry?

```ts
optional retry?: boolean;
```

Defined in: [src/hooks/events.ts:347](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L347)

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

Defined in: [src/hooks/events.ts:369](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/hooks/events.ts#L369)

Serializes for wire transport, excluding the agent reference and mutable retry flag. Converts Error to an extensible object for safe wire serialization. Called automatically by JSON.stringify().

#### Returns

`Pick`<`AfterModelCallEvent`, `"type"` | `"stopData"`\> & { `error?`: { `message?`: `string`; }; }