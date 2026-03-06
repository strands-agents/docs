```ts
type AgentConfig = {
  model?:   | Model<BaseModelConfig>
     | string;
  messages?:   | Message[]
     | MessageData[];
  tools?: ToolList;
  systemPrompt?:   | SystemPrompt
     | SystemPromptData;
  state?: Record<string, JSONValue>;
  printer?: boolean;
  conversationManager?: HookProvider;
  hooks?: HookProvider[];
  structuredOutputSchema?: z.ZodSchema;
  traceAttributes?: Record<string, AttributeValue>;
  name?: string;
  agentId?: string;
};
```

Defined in: [src/agent/agent.ts:67](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/agent/agent.ts#L67)

Configuration object for creating a new Agent.

## Properties

### model?

```ts
optional model:
  | Model<BaseModelConfig>
  | string;
```

Defined in: [src/agent/agent.ts:90](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/agent/agent.ts#L90)

The model instance that the agent will use to make decisions. Accepts either a Model instance or a string representing a Bedrock model ID. When a string is provided, it will be used to create a BedrockModel instance.

#### Example

```typescript
// Using a string model ID (creates BedrockModel)
const agent = new Agent({
  model: 'anthropic.claude-3-5-sonnet-20240620-v1:0'
})

// Using an explicit BedrockModel instance with configuration
const agent = new Agent({
  model: new BedrockModel({
    modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
    temperature: 0.7,
    maxTokens: 2048
  })
})
```

---

### messages?

```ts
optional messages:
  | Message[]
  | MessageData[];
```

Defined in: [src/agent/agent.ts:92](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/agent/agent.ts#L92)

An initial set of messages to seed the agent’s conversation history.

---

### tools?

```ts
optional tools: ToolList;
```

Defined in: [src/agent/agent.ts:97](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/agent/agent.ts#L97)

An initial set of tools to register with the agent. Accepts nested arrays of tools at any depth, which will be flattened automatically.

---

### systemPrompt?

```ts
optional systemPrompt:
  | SystemPrompt
  | SystemPromptData;
```

Defined in: [src/agent/agent.ts:101](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/agent/agent.ts#L101)

A system prompt which guides model behavior.

---

### state?

```ts
optional state: Record<string, JSONValue>;
```

Defined in: [src/agent/agent.ts:103](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/agent/agent.ts#L103)

Optional initial state values for the agent.

---

### printer?

```ts
optional printer: boolean;
```

Defined in: [src/agent/agent.ts:109](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/agent/agent.ts#L109)

Enable automatic printing of agent output to console. When true, prints text generation, reasoning, and tool usage as they occur. Defaults to true.

---

### conversationManager?

```ts
optional conversationManager: HookProvider;
```

Defined in: [src/agent/agent.ts:114](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/agent/agent.ts#L114)

Conversation manager for handling message history and context overflow. Defaults to SlidingWindowConversationManager with windowSize of 40.

---

### hooks?

```ts
optional hooks: HookProvider[];
```

Defined in: [src/agent/agent.ts:119](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/agent/agent.ts#L119)

Hook providers to register with the agent. Hooks enable observing and extending agent behavior.

---

### structuredOutputSchema?

```ts
optional structuredOutputSchema: z.ZodSchema;
```

Defined in: [src/agent/agent.ts:123](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/agent/agent.ts#L123)

Zod schema for structured output validation.

---

### traceAttributes?

```ts
optional traceAttributes: Record<string, AttributeValue>;
```

Defined in: [src/agent/agent.ts:129](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/agent/agent.ts#L129)

Custom trace attributes to include in all spans. These attributes are merged with standard attributes in telemetry spans. Telemetry must be enabled globally via telemetry.setupTracer() for these to take effect.

---

### name?

```ts
optional name: string;
```

Defined in: [src/agent/agent.ts:133](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/agent/agent.ts#L133)

Optional name for the agent. Defaults to “Strands Agent”.

---

### agentId?

```ts
optional agentId: string;
```

Defined in: [src/agent/agent.ts:137](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/agent/agent.ts#L137)

Optional unique identifier for the agent. Defaults to “default”.