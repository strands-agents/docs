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
  sessionManager?: SessionManager;
  traceAttributes?: Record<string, AttributeValue>;
  name?: string;
  description?: string;
  agentId?: string;
};
```

Defined in: [src/agent/agent.ts:69](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/agent.ts#L69)

Configuration object for creating a new Agent.

## Properties

### model?

```ts
optional model:
  | Model<BaseModelConfig>
  | string;
```

Defined in: [src/agent/agent.ts:92](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/agent.ts#L92)

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

Defined in: [src/agent/agent.ts:94](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/agent.ts#L94)

An initial set of messages to seed the agent’s conversation history.

---

### tools?

```ts
optional tools: ToolList;
```

Defined in: [src/agent/agent.ts:99](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/agent.ts#L99)

An initial set of tools to register with the agent. Accepts nested arrays of tools at any depth, which will be flattened automatically.

---

### systemPrompt?

```ts
optional systemPrompt:
  | SystemPrompt
  | SystemPromptData;
```

Defined in: [src/agent/agent.ts:103](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/agent.ts#L103)

A system prompt which guides model behavior.

---

### state?

```ts
optional state: Record<string, JSONValue>;
```

Defined in: [src/agent/agent.ts:105](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/agent.ts#L105)

Optional initial state values for the agent.

---

### printer?

```ts
optional printer: boolean;
```

Defined in: [src/agent/agent.ts:111](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/agent.ts#L111)

Enable automatic printing of agent output to console. When true, prints text generation, reasoning, and tool usage as they occur. Defaults to true.

---

### conversationManager?

```ts
optional conversationManager: HookProvider;
```

Defined in: [src/agent/agent.ts:116](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/agent.ts#L116)

Conversation manager for handling message history and context overflow. Defaults to SlidingWindowConversationManager with windowSize of 40.

---

### hooks?

```ts
optional hooks: HookProvider[];
```

Defined in: [src/agent/agent.ts:121](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/agent.ts#L121)

Hook providers to register with the agent. Hooks enable observing and extending agent behavior.

---

### structuredOutputSchema?

```ts
optional structuredOutputSchema: z.ZodSchema;
```

Defined in: [src/agent/agent.ts:125](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/agent.ts#L125)

Zod schema for structured output validation.

---

### sessionManager?

```ts
optional sessionManager: SessionManager;
```

Defined in: [src/agent/agent.ts:129](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/agent.ts#L129)

Session manager for saving and restoring agent sessions

---

### traceAttributes?

```ts
optional traceAttributes: Record<string, AttributeValue>;
```

Defined in: [src/agent/agent.ts:135](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/agent.ts#L135)

Custom trace attributes to include in all spans. These attributes are merged with standard attributes in telemetry spans. Telemetry must be enabled globally via telemetry.setupTracer() for these to take effect.

---

### name?

```ts
optional name: string;
```

Defined in: [src/agent/agent.ts:139](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/agent.ts#L139)

Optional name for the agent. Defaults to “Strands Agent”.

---

### description?

```ts
optional description: string;
```

Defined in: [src/agent/agent.ts:143](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/agent.ts#L143)

Optional description of what the agent does.

---

### agentId?

```ts
optional agentId: string;
```

Defined in: [src/agent/agent.ts:147](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/agent/agent.ts#L147)

Optional unique identifier for the agent. Defaults to “default”.