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
  agentId?: string;
};
```

Defined in: [src/agent/agent.ts:68](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L68)

Configuration object for creating a new Agent.

## Properties

### model?

```ts
optional model:
  | Model<BaseModelConfig>
  | string;
```

Defined in: [src/agent/agent.ts:91](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L91)

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

Defined in: [src/agent/agent.ts:93](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L93)

An initial set of messages to seed the agent’s conversation history.

---

### tools?

```ts
optional tools: ToolList;
```

Defined in: [src/agent/agent.ts:98](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L98)

An initial set of tools to register with the agent. Accepts nested arrays of tools at any depth, which will be flattened automatically.

---

### systemPrompt?

```ts
optional systemPrompt:
  | SystemPrompt
  | SystemPromptData;
```

Defined in: [src/agent/agent.ts:102](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L102)

A system prompt which guides model behavior.

---

### state?

```ts
optional state: Record<string, JSONValue>;
```

Defined in: [src/agent/agent.ts:104](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L104)

Optional initial state values for the agent.

---

### printer?

```ts
optional printer: boolean;
```

Defined in: [src/agent/agent.ts:110](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L110)

Enable automatic printing of agent output to console. When true, prints text generation, reasoning, and tool usage as they occur. Defaults to true.

---

### conversationManager?

```ts
optional conversationManager: HookProvider;
```

Defined in: [src/agent/agent.ts:115](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L115)

Conversation manager for handling message history and context overflow. Defaults to SlidingWindowConversationManager with windowSize of 40.

---

### hooks?

```ts
optional hooks: HookProvider[];
```

Defined in: [src/agent/agent.ts:120](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L120)

Hook providers to register with the agent. Hooks enable observing and extending agent behavior.

---

### structuredOutputSchema?

```ts
optional structuredOutputSchema: z.ZodSchema;
```

Defined in: [src/agent/agent.ts:124](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L124)

Zod schema for structured output validation.

---

### sessionManager?

```ts
optional sessionManager: SessionManager;
```

Defined in: [src/agent/agent.ts:128](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L128)

Session manager for saving and restoring agent sessions

---

### traceAttributes?

```ts
optional traceAttributes: Record<string, AttributeValue>;
```

Defined in: [src/agent/agent.ts:134](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L134)

Custom trace attributes to include in all spans. These attributes are merged with standard attributes in telemetry spans. Telemetry must be enabled globally via telemetry.setupTracer() for these to take effect.

---

### name?

```ts
optional name: string;
```

Defined in: [src/agent/agent.ts:138](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L138)

Optional name for the agent. Defaults to “Strands Agent”.

---

### agentId?

```ts
optional agentId: string;
```

Defined in: [src/agent/agent.ts:142](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/agent/agent.ts#L142)

Optional unique identifier for the agent. Defaults to “default”.