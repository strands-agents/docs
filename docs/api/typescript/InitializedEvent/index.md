Defined in: [src/hooks/events.ts:101](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L101)

Event triggered when an agent has finished initialization. Fired after the agent has been fully constructed and all built-in components have been initialized.

## Extends

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new InitializedEvent(data): InitializedEvent;
```

Defined in: [src/hooks/events.ts:105](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L105)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: `LocalAgent`; } |
| `data.agent` | `LocalAgent` |

#### Returns

`InitializedEvent`

#### Overrides

[`HookableEvent`](/docs/api/typescript/HookableEvent/index.md).[`constructor`](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "initializedEvent";
```

Defined in: [src/hooks/events.ts:102](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L102)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:103](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L103)

## Methods

### toJSON()

```ts
toJSON(): Pick<InitializedEvent, "type">;
```

Defined in: [src/hooks/events.ts:114](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/hooks/events.ts#L114)

Serializes for wire transport, excluding the agent reference. Called automatically by JSON.stringify().

#### Returns

`Pick`<`InitializedEvent`, `"type"`\>