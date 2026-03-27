```ts
type SummarizationConversationManagerConfig = {
  agent: Agent;
  summaryRatio?: number;
  preserveRecentMessages?: number;
  summarizationSystemPrompt?: string;
};
```

Defined in: [src/conversation-manager/summarization-conversation-manager.ts:46](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/conversation-manager/summarization-conversation-manager.ts#L46)

Configuration for the summarization conversation manager.

## Properties

### agent

```ts
agent: Agent;
```

Defined in: [src/conversation-manager/summarization-conversation-manager.ts:50](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/conversation-manager/summarization-conversation-manager.ts#L50)

The agent whose model will be used for generating summaries.

---

### summaryRatio?

```ts
optional summaryRatio?: number;
```

Defined in: [src/conversation-manager/summarization-conversation-manager.ts:56](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/conversation-manager/summarization-conversation-manager.ts#L56)

Ratio of messages to summarize when context overflow occurs. Value is clamped to \[0.1, 0.8\]. Defaults to 0.3 (summarize 30% of oldest messages).

---

### preserveRecentMessages?

```ts
optional preserveRecentMessages?: number;
```

Defined in: [src/conversation-manager/summarization-conversation-manager.ts:62](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/conversation-manager/summarization-conversation-manager.ts#L62)

Minimum number of recent messages to always keep. Defaults to 10.

---

### summarizationSystemPrompt?

```ts
optional summarizationSystemPrompt?: string;
```

Defined in: [src/conversation-manager/summarization-conversation-manager.ts:68](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/conversation-manager/summarization-conversation-manager.ts#L68)

Custom system prompt for summarization. If not provided, uses a default prompt that produces structured bullet-point summaries.