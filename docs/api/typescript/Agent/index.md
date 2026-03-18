Defined in: [src/agent/agent.ts:169](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/agent/agent.ts#L169)

Orchestrates the interaction between a model, a set of tools, and MCP clients. The Agent is responsible for managing the lifecycle of tools and clients and invoking the core decision-making loop.

## Implements

-   [`LocalAgent`](/docs/api/typescript/LocalAgent/index.md)
-   `InvokableAgent`

## Constructors

### Constructor

```ts
new Agent(config?): Agent;
```

Defined in: [src/agent/agent.ts:223](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/agent/agent.ts#L223)

Creates an instance of the Agent.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `config?` | [`AgentConfig`](/docs/api/typescript/AgentConfig/index.md) | The configuration for the agent. |

#### Returns

`Agent`

## Properties

### messages

```ts
readonly messages: Message[];
```

Defined in: [src/agent/agent.ts:173](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/agent/agent.ts#L173)

The conversation history of messages between user and assistant.

#### Implementation of

[`LocalAgent`](/docs/api/typescript/LocalAgent/index.md).[`messages`](/docs/api/typescript/LocalAgent/index.md#messages)

---

### state

```ts
readonly state: AppState;
```

Defined in: [src/agent/agent.ts:178](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/agent/agent.ts#L178)

App state storage accessible to tools and application logic. State is not passed to the model during inference.

#### Implementation of

[`LocalAgent`](/docs/api/typescript/LocalAgent/index.md).[`state`](/docs/api/typescript/LocalAgent/index.md#state)

---

### model

```ts
model: Model;
```

Defined in: [src/agent/agent.ts:184](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/agent/agent.ts#L184)

The model provider used by the agent for inference.

---

### systemPrompt?

```ts
optional systemPrompt: SystemPrompt;
```

Defined in: [src/agent/agent.ts:189](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/agent/agent.ts#L189)

The system prompt to pass to the model provider.

---

### name

```ts
readonly name: string;
```

Defined in: [src/agent/agent.ts:194](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/agent/agent.ts#L194)

The name of the agent.

#### Implementation of

```ts
InvokableAgent.name
```

---

### id

```ts
readonly id: string;
```

Defined in: [src/agent/agent.ts:199](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/agent/agent.ts#L199)

The unique identifier of the agent instance.

#### Implementation of

```ts
InvokableAgent.id
```

---

### description?

```ts
readonly optional description: string;
```

Defined in: [src/agent/agent.ts:204](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/agent/agent.ts#L204)

Optional description of what the agent does.

#### Implementation of

```ts
InvokableAgent.description
```

## Accessors

### tools

#### Get Signature

```ts
get tools(): Tool[];
```

Defined in: [src/agent/agent.ts:339](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/agent/agent.ts#L339)

The tools this agent can use.

##### Returns

[`Tool`](/docs/api/typescript/Tool/index.md)\[\]

---

### toolRegistry

#### Get Signature

```ts
get toolRegistry(): ToolRegistry;
```

Defined in: [src/agent/agent.ts:346](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/agent/agent.ts#L346)

The tool registry for managing the agent’s tools.

##### Returns

`ToolRegistry`

The tool registry for registering tools with the agent.

#### Implementation of

[`LocalAgent`](/docs/api/typescript/LocalAgent/index.md).[`toolRegistry`](/docs/api/typescript/LocalAgent/index.md#toolregistry)

## Methods

### addHook()

```ts
addHook<T>(eventType, callback): HookCleanup;
```

Defined in: [src/agent/agent.ts:293](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/agent/agent.ts#L293)

Register a hook callback for a specific event type.

#### Type Parameters

| Type Parameter |
| --- |
| `T` *extends* [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md) |

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `eventType` | [`HookableEventConstructor`](/docs/api/typescript/HookableEventConstructor/index.md)<`T`\> | The event class constructor to register the callback for |
| `callback` | [`HookCallback`](/docs/api/typescript/HookCallback/index.md)<`T`\> | The callback function to invoke when the event occurs |

#### Returns

`HookCleanup`

Cleanup function that removes the callback when invoked

#### Example

```typescript
const agent = new Agent({ model })

const cleanup = agent.addHook(BeforeInvocationEvent, (event) => {
  console.log('Invocation started')
})

// Later, to remove the hook:
cleanup()
```

#### Implementation of

[`LocalAgent`](/docs/api/typescript/LocalAgent/index.md).[`addHook`](/docs/api/typescript/LocalAgent/index.md#addhook)

---

### initialize()

```ts
initialize(): Promise<void>;
```

Defined in: [src/agent/agent.ts:297](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/agent/agent.ts#L297)

#### Returns

`Promise`<`void`\>

---

### invoke()

```ts
invoke(args, options?): Promise<AgentResult>;
```

Defined in: [src/agent/agent.ts:368](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/agent/agent.ts#L368)

Invokes the agent and returns the final result.

This is a convenience method that consumes the stream() method and returns only the final AgentResult. Use stream() if you need access to intermediate streaming events.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | `InvokeArgs` | Arguments for invoking the agent |
| `options?` | `InvokeOptions` | Optional per-invocation options |

#### Returns

`Promise`<[`AgentResult`](/docs/api/typescript/AgentResult/index.md)\>

Promise that resolves to the final AgentResult

#### Example

```typescript
const agent = new Agent({ model, tools })
const result = await agent.invoke('What is 2 + 2?')
console.log(result.lastMessage) // Agent's response
```

#### Implementation of

```ts
InvokableAgent.invoke
```

---

### stream()

```ts
stream(args, options?): AsyncGenerator<AgentStreamEvent, AgentResult, undefined>;
```

Defined in: [src/agent/agent.ts:407](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/agent/agent.ts#L407)

Streams the agent execution, yielding events and returning the final result.

The agent loop manages the conversation flow by:

1.  Streaming model responses and yielding all events
2.  Executing tools when the model requests them
3.  Continuing the loop until the model completes without tool use

Use this method when you need access to intermediate streaming events. For simple request/response without streaming, use invoke() instead.

An explicit goal of this method is to always leave the message array in a way that the agent can be reinvoked with a user prompt after this method completes. To that end assistant messages containing tool uses are only added after tool execution succeeds with valid toolResponses

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | `InvokeArgs` | Arguments for invoking the agent |
| `options?` | `InvokeOptions` | Optional per-invocation options |

#### Returns

`AsyncGenerator`<[`AgentStreamEvent`](/docs/api/typescript/AgentStreamEvent/index.md), [`AgentResult`](/docs/api/typescript/AgentResult/index.md), `undefined`\>

Async generator that yields AgentStreamEvent objects and returns AgentResult

#### Example

```typescript
const agent = new Agent({ model, tools })

for await (const event of agent.stream('Hello')) {
  console.log('Event:', event.type)
}
// Messages array is mutated in place and contains the full conversation
```

#### Implementation of

```ts
InvokableAgent.stream
```