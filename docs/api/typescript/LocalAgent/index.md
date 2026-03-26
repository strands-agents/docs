Defined in: [src/types/agent.ts:93](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/agent.ts#L93)

Interface for agents with locally accessible state, messages, tools, and hooks. Used by ToolContext and hook events that need access to agent internals.

## Properties

### id

```ts
readonly id: string;
```

Defined in: [src/types/agent.ts:97](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/agent.ts#L97)

The unique identifier of the agent instance.

---

### appState

```ts
appState: StateStore;
```

Defined in: [src/types/agent.ts:102](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/agent.ts#L102)

App state storage accessible to tools and application logic.

---

### messages

```ts
messages: Message[];
```

Defined in: [src/types/agent.ts:107](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/agent.ts#L107)

The conversation history of messages between user and assistant.

---

### toolRegistry

```ts
readonly toolRegistry: ToolRegistry;
```

Defined in: [src/types/agent.ts:112](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/agent.ts#L112)

The tool registry for registering tools with the agent.

---

### systemPrompt?

```ts
optional systemPrompt?: SystemPrompt;
```

Defined in: [src/types/agent.ts:117](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/agent.ts#L117)

The system prompt to pass to the model provider.

## Methods

### addHook()

```ts
addHook<T>(eventType, callback): HookCleanup;
```

Defined in: [src/types/agent.ts:126](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/types/agent.ts#L126)

Register a hook callback for a specific event type.

#### Type Parameters

| Type Parameter |
| --- |
| `T` *extends* [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md) |

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `eventType` | [<code dir="auto">HookableEventConstructor</code>](/docs/api/typescript/HookableEventConstructor/index.md)<`T`\> | The event class constructor to register the callback for |
| `callback` | [<code dir="auto">HookCallback</code>](/docs/api/typescript/HookCallback/index.md)<`T`\> | The callback function to invoke when the event occurs |

#### Returns

`HookCleanup`

Cleanup function that removes the callback when invoked