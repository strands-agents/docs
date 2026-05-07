Defined in: [src/agent/agent.ts:227](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L227)

Orchestrates the interaction between a model, a set of tools, and MCP clients. The Agent is responsible for managing the lifecycle of tools and clients and invoking the core decision-making loop.

## Implements

-   `InvokableAgent`

## Constructors

### Constructor

```ts
new Agent(config?): Agent;
```

Defined in: [src/agent/agent.ts:301](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L301)

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
messages: Message[];
```

Defined in: [src/agent/agent.ts:234](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L234)

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

Defined in: [src/agent/agent.ts:239](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L239)

App state storage accessible to tools and application logic. State is not passed to the model during inference.

#### Implementation of

```ts
LocalAgent.appState
```

---

### modelState

```ts
readonly modelState: StateStore;
```

Defined in: [src/agent/agent.ts:245](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L245)

Runtime state for the model provider. Used by stateful models to persist provider-specific data (e.g., response IDs for conversation chaining) across invocations.

#### Implementation of

```ts
LocalAgent.modelState
```

---

### model

```ts
model: Model;
```

Defined in: [src/agent/agent.ts:251](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L251)

The model provider used by the agent for inference.

#### Implementation of

```ts
LocalAgent.model
```

---

### systemPrompt?

```ts
optional systemPrompt?: SystemPrompt;
```

Defined in: [src/agent/agent.ts:256](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L256)

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

Defined in: [src/agent/agent.ts:261](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L261)

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

Defined in: [src/agent/agent.ts:266](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L266)

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

Defined in: [src/agent/agent.ts:271](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L271)

Optional description of what the agent does.

#### Implementation of

```ts
InvokableAgent.description
```

---

### sessionManager?

```ts
readonly optional sessionManager?: SessionManager;
```

Defined in: [src/agent/agent.ts:276](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L276)

The session manager for saving and restoring agent sessions, if configured.

---

### \_interruptState

```ts
_interruptState: InterruptState;
```

Defined in: [src/agent/agent.ts:293](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L293)

Interrupt state for human-in-the-loop workflows.

## Accessors

### tools

#### Get Signature

```ts
get tools(): Tool[];
```

Defined in: [src/agent/agent.ts:471](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L471)

The tools this agent can use.

##### Returns

[`Tool`](/docs/api/typescript/Tool/index.md)\[\]

---

### toolRegistry

#### Get Signature

```ts
get toolRegistry(): ToolRegistry;
```

Defined in: [src/agent/agent.ts:478](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L478)

The tool registry for managing the agent’s tools.

##### Returns

`ToolRegistry`

#### Implementation of

```ts
LocalAgent.toolRegistry
```

---

### cancelSignal

#### Get Signature

```ts
get cancelSignal(): AbortSignal;
```

Defined in: [src/agent/agent.ts:488](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L488)

The cancellation signal for the current invocation.

Tools can pass this to cancellable operations (e.g., `fetch(url, { signal: agent.cancelSignal })`). Hooks can check `event.agent.cancelSignal.aborted` to detect cancellation.

##### Returns

`AbortSignal`

#### Implementation of

```ts
LocalAgent.cancelSignal
```

## Methods

### addHook()

```ts
addHook<T>(
   eventType,
   callback,
   options?): HookCleanup;
```

Defined in: [src/agent/agent.ts:411](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L411)

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
| `options?` | [`HookCallbackOptions`](/docs/api/typescript/HookCallbackOptions/index.md) | Optional configuration including execution order |

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

Defined in: [src/agent/agent.ts:419](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L419)

#### Returns

`Promise`<`void`\>

---

### cancel()

```ts
cancel(): void;
```

Defined in: [src/agent/agent.ts:520](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L520)

Cancels the current agent invocation cooperatively.

The agent will stop at the next cancellation checkpoint:

-   During model response streaming
-   Before tool execution
-   Between sequential tool executions
-   At the top of each agent loop cycle

If a tool is already executing, it will run to completion unless the tool checks LocalAgent.cancelSignal | cancelSignal internally.

Hook callbacks can check `event.agent.cancelSignal.aborted` to detect cancellation and adjust their behavior accordingly.

The stream/invoke call will return an AgentResult with `stopReason: 'cancelled'`. If the agent is not currently invoking, this is a no-op.

#### Returns

`void`

#### Example

```typescript
const agent = new Agent({ model, tools })

// Cancel after 5 seconds
setTimeout(() => agent.cancel(), 5000)
const result = await agent.invoke('Do something')
console.log(result.stopReason) // 'cancelled'
```

---

### invoke()

```ts
invoke(args, options?): Promise<AgentResult>;
```

Defined in: [src/agent/agent.ts:552](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L552)

Invokes the agent and returns the final result.

This is a convenience method that consumes the stream() method and returns only the final AgentResult. Use stream() if you need access to intermediate streaming events.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`InvokeArgs`](/docs/api/typescript/InvokeArgs/index.md) | Arguments for invoking the agent |
| `options?` | [`InvokeOptions`](/docs/api/typescript/InvokeOptions/index.md) | Optional per-invocation options |

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

Defined in: [src/agent/agent.ts:591](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L591)

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
| `args` | [`InvokeArgs`](/docs/api/typescript/InvokeArgs/index.md) | Arguments for invoking the agent |
| `options?` | [`InvokeOptions`](/docs/api/typescript/InvokeOptions/index.md) | Optional per-invocation options |

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

---

### asTool()

```ts
asTool(options?): Tool;
```

Defined in: [src/agent/agent.ts:710](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/agent/agent.ts#L710)

Returns a [Tool](/docs/api/typescript/Tool/index.md) that wraps this agent, allowing it to be used as a tool by another agent.

The returned tool accepts a single `input` string parameter, invokes this agent, and returns the text response as a tool result.

**Note:** You can also pass an Agent directly in another agent’s [tools](/docs/api/typescript/AgentConfig/index.md#tools) array — it will be wrapped automatically via this method.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `options?` | [`AgentAsToolOptions`](/docs/api/typescript/AgentAsToolOptions/index.md) | Optional configuration for the tool name, description, and context preservation |

#### Returns

[`Tool`](/docs/api/typescript/Tool/index.md)

A Tool wrapping this agent

#### Example

```typescript
const researcher = new Agent({ name: 'researcher', description: 'Finds info', printer: false })

// Explicit wrapping
const writer = new Agent({ tools: [researcher.asTool()] })

// Automatic wrapping (equivalent)
const writer = new Agent({ tools: [researcher] })
```