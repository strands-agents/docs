Defined in: [src/agent/agent.ts:170](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/agent/agent.ts#L170)

Orchestrates the interaction between a model, a set of tools, and MCP clients. The Agent is responsible for managing the lifecycle of tools and clients and invoking the core decision-making loop.

## Implements

-   `InvokableAgent`

## Constructors

### Constructor

```ts
new Agent(config?): Agent;
```

Defined in: [src/agent/agent.ts:227](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/agent/agent.ts#L227)

Creates an instance of the Agent.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `config?` | [<code dir="auto">AgentConfig</code>](/docs/api/typescript/AgentConfig/index.md) | The configuration for the agent. |

#### Returns

`Agent`

## Properties

### messages

```ts
readonly messages: Message[];
```

Defined in: [src/agent/agent.ts:177](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/agent/agent.ts#L177)

The conversation history of messages between user and assistant.

#### Implementation of

```ts
LocalAgent.messages
```

---

### appState

```ts
readonly appState: StateStore;
```

Defined in: [src/agent/agent.ts:182](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/agent/agent.ts#L182)

App state storage accessible to tools and application logic. State is not passed to the model during inference.

#### Implementation of

```ts
LocalAgent.appState
```

---

### model

```ts
model: Model;
```

Defined in: [src/agent/agent.ts:188](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/agent/agent.ts#L188)

The model provider used by the agent for inference.

---

### systemPrompt?

```ts
optional systemPrompt?: SystemPrompt;
```

Defined in: [src/agent/agent.ts:193](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/agent/agent.ts#L193)

The system prompt to pass to the model provider.

#### Implementation of

```ts
LocalAgent.systemPrompt
```

---

### name

```ts
readonly name: string;
```

Defined in: [src/agent/agent.ts:198](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/agent/agent.ts#L198)

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

Defined in: [src/agent/agent.ts:203](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/agent/agent.ts#L203)

The unique identifier of the agent instance.

#### Implementation of

```ts
LocalAgent.id
```

---

### description?

```ts
readonly optional description?: string;
```

Defined in: [src/agent/agent.ts:208](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/agent/agent.ts#L208)

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

Defined in: [src/agent/agent.ts:343](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/agent/agent.ts#L343)

The tools this agent can use.

##### Returns

[<code dir="auto">Tool</code>](/docs/api/typescript/Tool/index.md)\[\]

---

### toolRegistry

#### Get Signature

```ts
get toolRegistry(): ToolRegistry;
```

Defined in: [src/agent/agent.ts:350](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/agent/agent.ts#L350)

The tool registry for managing the agent’s tools.

##### Returns

`ToolRegistry`

#### Implementation of

```ts
LocalAgent.toolRegistry
```

## Methods

### addHook()

```ts
addHook<T>(eventType, callback): HookCleanup;
```

Defined in: [src/agent/agent.ts:297](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/agent/agent.ts#L297)

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

```ts
LocalAgent.addHook
```

---

### initialize()

```ts
initialize(): Promise<void>;
```

Defined in: [src/agent/agent.ts:301](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/agent/agent.ts#L301)

#### Returns

`Promise`<`void`\>

---

### invoke()

```ts
invoke(args, options?): Promise<AgentResult>;
```

Defined in: [src/agent/agent.ts:372](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/agent/agent.ts#L372)

Invokes the agent and returns the final result.

This is a convenience method that consumes the stream() method and returns only the final AgentResult. Use stream() if you need access to intermediate streaming events.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | `InvokeArgs` | Arguments for invoking the agent |
| `options?` | `InvokeOptions` | Optional per-invocation options |

#### Returns

`Promise`<[<code dir="auto">AgentResult</code>](/docs/api/typescript/AgentResult/index.md)\>

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

Defined in: [src/agent/agent.ts:411](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/agent/agent.ts#L411)

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

`AsyncGenerator`<[<code dir="auto">AgentStreamEvent</code>](/docs/api/typescript/AgentStreamEvent/index.md), [<code dir="auto">AgentResult</code>](/docs/api/typescript/AgentResult/index.md), `undefined`\>

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