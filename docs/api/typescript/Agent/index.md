Defined in: [src/agent/agent.ts:176](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L176)

Orchestrates the interaction between a model, a set of tools, and MCP clients. The Agent is responsible for managing the lifecycle of tools and clients and invoking the core decision-making loop.

## Implements

-   [`AgentData`](/docs/api/typescript/AgentData/index.md)

## Constructors

### Constructor

```ts
new Agent(config?): Agent;
```

Defined in: [src/agent/agent.ts:231](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L231)

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

Defined in: [src/agent/agent.ts:180](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L180)

The conversation history of messages between user and assistant.

#### Implementation of

[`AgentData`](/docs/api/typescript/AgentData/index.md).[`messages`](/docs/api/typescript/AgentData/index.md#messages)

---

### state

```ts
readonly state: AppState;
```

Defined in: [src/agent/agent.ts:185](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L185)

App state storage accessible to tools and application logic. State is not passed to the model during inference.

#### Implementation of

[`AgentData`](/docs/api/typescript/AgentData/index.md).[`state`](/docs/api/typescript/AgentData/index.md#state)

---

### conversationManager

```ts
readonly conversationManager: HookProvider;
```

Defined in: [src/agent/agent.ts:189](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L189)

Conversation manager for handling message history and context overflow.

---

### hooks

```ts
readonly hooks: HookRegistry;
```

Defined in: [src/agent/agent.ts:194](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L194)

Hook registry for managing event callbacks. Hooks enable observing and extending agent behavior.

---

### model

```ts
model: Model;
```

Defined in: [src/agent/agent.ts:199](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L199)

The model provider used by the agent for inference.

---

### systemPrompt?

```ts
optional systemPrompt: SystemPrompt;
```

Defined in: [src/agent/agent.ts:204](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L204)

The system prompt to pass to the model provider.

---

### name

```ts
readonly name: string;
```

Defined in: [src/agent/agent.ts:209](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L209)

The name of the agent.

---

### agentId

```ts
readonly agentId: string;
```

Defined in: [src/agent/agent.ts:214](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L214)

The unique identifier of the agent instance.

## Accessors

### tools

#### Get Signature

```ts
get tools(): Tool[];
```

Defined in: [src/agent/agent.ts:316](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L316)

The tools this agent can use.

##### Returns

[`Tool`](/docs/api/typescript/Tool/index.md)\[\]

---

### toolRegistry

#### Get Signature

```ts
get toolRegistry(): ToolRegistry;
```

Defined in: [src/agent/agent.ts:323](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L323)

The tool registry for managing the agent’s tools.

##### Returns

`ToolRegistry`

## Methods

### initialize()

```ts
initialize(): Promise<void>;
```

Defined in: [src/agent/agent.ts:277](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L277)

#### Returns

`Promise`<`void`\>

---

### invoke()

```ts
invoke(args, options?): Promise<AgentResult>;
```

Defined in: [src/agent/agent.ts:345](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L345)

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

---

### stream()

```ts
stream(args, options?): AsyncGenerator<AgentStreamEvent, AgentResult, undefined>;
```

Defined in: [src/agent/agent.ts:384](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L384)

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