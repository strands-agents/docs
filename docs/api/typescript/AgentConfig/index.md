```ts
type AgentConfig = {
  model?:   | Model<BaseModelConfig>
     | string;
  messages?:   | Message[]
     | MessageData[];
  tools?: ToolList;
  systemPrompt?:   | SystemPrompt
     | SystemPromptData;
  appState?: Record<string, JSONValue>;
  printer?: boolean;
  conversationManager?: ConversationManager;
  plugins?: Plugin[];
  structuredOutputSchema?: z.ZodSchema;
  sessionManager?: SessionManager;
  traceAttributes?: Record<string, AttributeValue>;
  name?: string;
  description?: string;
  id?: string;
};
```

Defined in: [src/agent/agent.ts:78](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/agent.ts#L78)

Configuration object for creating a new Agent.

## Properties

### model?

```ts
optional model?:
  | Model<BaseModelConfig>
  | string;
```

Defined in: [src/agent/agent.ts:101](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/agent.ts#L101)

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
optional messages?:
  | Message[]
  | MessageData[];
```

Defined in: [src/agent/agent.ts:103](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/agent.ts#L103)

An initial set of messages to seed the agent’s conversation history.

---

### tools?

```ts
optional tools?: ToolList;
```

Defined in: [src/agent/agent.ts:108](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/agent.ts#L108)

An initial set of tools to register with the agent. Accepts nested arrays of tools at any depth, which will be flattened automatically.

---

### systemPrompt?

```ts
optional systemPrompt?:
  | SystemPrompt
  | SystemPromptData;
```

Defined in: [src/agent/agent.ts:112](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/agent.ts#L112)

A system prompt which guides model behavior.

---

### appState?

```ts
optional appState?: Record<string, JSONValue>;
```

Defined in: [src/agent/agent.ts:114](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/agent.ts#L114)

Optional initial state values for the agent.

---

### printer?

```ts
optional printer?: boolean;
```

Defined in: [src/agent/agent.ts:120](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/agent.ts#L120)

Enable automatic printing of agent output to console. When true, prints text generation, reasoning, and tool usage as they occur. Defaults to true.

---

### conversationManager?

```ts
optional conversationManager?: ConversationManager;
```

Defined in: [src/agent/agent.ts:125](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/agent.ts#L125)

Conversation manager for handling message history and context overflow. Defaults to SlidingWindowConversationManager with windowSize of 40.

---

### plugins?

```ts
optional plugins?: Plugin[];
```

Defined in: [src/agent/agent.ts:129](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/agent.ts#L129)

Plugins to register with the agent.

---

### structuredOutputSchema?

```ts
optional structuredOutputSchema?: z.ZodSchema;
```

Defined in: [src/agent/agent.ts:133](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/agent.ts#L133)

Zod schema for structured output validation.

---

### sessionManager?

```ts
optional sessionManager?: SessionManager;
```

Defined in: [src/agent/agent.ts:137](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/agent.ts#L137)

Session manager for saving and restoring agent sessions

---

### traceAttributes?

```ts
optional traceAttributes?: Record<string, AttributeValue>;
```

Defined in: [src/agent/agent.ts:143](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/agent.ts#L143)

Custom trace attributes to include in all spans. These attributes are merged with standard attributes in telemetry spans. Telemetry must be enabled globally via telemetry.setupTracer() for these to take effect.

---

### name?

```ts
optional name?: string;
```

Defined in: [src/agent/agent.ts:147](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/agent.ts#L147)

Optional name for the agent. Defaults to “Strands Agent”.

---

### description?

```ts
optional description?: string;
```

Defined in: [src/agent/agent.ts:151](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/agent.ts#L151)

Optional description of what the agent does.

---

### id?

```ts
optional id?: string;
```

Defined in: [src/agent/agent.ts:155](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/agent/agent.ts#L155)

Optional unique identifier for the agent. Defaults to “agent”.