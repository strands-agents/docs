Defined in: [src/hooks/events.ts:493](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L493)

Event triggered for each streaming progress event from a tool during execution. Wraps a [ToolStreamEvent](/docs/api/typescript/ToolStreamEvent/index.md) with agent context, keeping the tool authoring interface unchanged — tools construct `ToolStreamEvent` without knowledge of agents or hooks, and the agent layer wraps them at the boundary.

Consistent with [ModelStreamUpdateEvent](/docs/api/typescript/ModelStreamUpdateEvent/index.md) which wraps model streaming events the same way.

## Extends

-   [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new ToolStreamUpdateEvent(data): ToolStreamUpdateEvent;
```

Defined in: [src/hooks/events.ts:498](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L498)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md); `event`: [<code dir="auto">ToolStreamEvent</code>](/docs/api/typescript/ToolStreamEvent/index.md); } |
| `data.agent` | [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md) |
| `data.event` | [<code dir="auto">ToolStreamEvent</code>](/docs/api/typescript/ToolStreamEvent/index.md) |

#### Returns

`ToolStreamUpdateEvent`

#### Overrides

[<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "toolStreamUpdateEvent";
```

Defined in: [src/hooks/events.ts:494](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L494)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:495](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L495)

---

### event

```ts
readonly event: ToolStreamEvent;
```

Defined in: [src/hooks/events.ts:496](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L496)

## Methods

### toJSON()

```ts
toJSON(): Pick<ToolStreamUpdateEvent, "type" | "event">;
```

Defined in: [src/hooks/events.ts:508](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L508)

Serializes for wire transport, excluding the agent reference. Called automatically by JSON.stringify().

#### Returns

`Pick`<`ToolStreamUpdateEvent`, `"type"` | `"event"`\>