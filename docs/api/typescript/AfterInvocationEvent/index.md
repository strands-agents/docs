Defined in: [src/hooks/events.ts:113](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L113)

Event triggered at the end of an agent request. Fired after all processing completes, regardless of success or error. Uses reverse callback ordering for proper cleanup semantics.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AfterInvocationEvent(data): AfterInvocationEvent;
```

Defined in: [src/hooks/events.ts:117](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L117)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [`LocalAgent`](/docs/api/typescript/LocalAgent/index.md); } |
| `data.agent` | [`LocalAgent`](/docs/api/typescript/LocalAgent/index.md) |

#### Returns

`AfterInvocationEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "afterInvocationEvent";
```

Defined in: [src/hooks/events.ts:114](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L114)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:115](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L115)