```ts
type SummarizingConversationManagerConfig = {
  model?: Model;
  summaryRatio?: number;
  preserveRecentMessages?: number;
  summarizationSystemPrompt?: string;
};
```

Defined in: [src/conversation-manager/summarizing-conversation-manager.ts:46](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/conversation-manager/summarizing-conversation-manager.ts#L46)

Configuration for the summarization conversation manager.

## Properties

### model?

```ts
optional model?: Model;
```

Defined in: [src/conversation-manager/summarizing-conversation-manager.ts:52](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/conversation-manager/summarizing-conversation-manager.ts#L52)

Model to use for generating summaries. When provided, overrides the model attached to the agent. Useful when you want to use a different model than the one attached to the agent.

---

### summaryRatio?

```ts
optional summaryRatio?: number;
```

Defined in: [src/conversation-manager/summarizing-conversation-manager.ts:58](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/conversation-manager/summarizing-conversation-manager.ts#L58)

Ratio of messages to summarize when context overflow occurs. Value is clamped to \[0.1, 0.8\]. Defaults to 0.3 (summarize 30% of oldest messages).

---

### preserveRecentMessages?

```ts
optional preserveRecentMessages?: number;
```

Defined in: [src/conversation-manager/summarizing-conversation-manager.ts:64](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/conversation-manager/summarizing-conversation-manager.ts#L64)

Minimum number of recent messages to always keep. Defaults to 10.

---

### summarizationSystemPrompt?

```ts
optional summarizationSystemPrompt?: string;
```

Defined in: [src/conversation-manager/summarizing-conversation-manager.ts:70](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/conversation-manager/summarizing-conversation-manager.ts#L70)

Custom system prompt for summarization. If not provided, uses a default prompt that produces structured bullet-point summaries.