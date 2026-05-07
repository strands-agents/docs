```ts
type SummarizingConversationManagerConfig = {
  model?: Model;
  summaryRatio?: number;
  preserveRecentMessages?: number;
  summarizationSystemPrompt?: string;
  proactiveCompression?: boolean | ProactiveCompressionConfig;
};
```

Defined in: [src/conversation-manager/summarizing-conversation-manager.ts:52](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/conversation-manager/summarizing-conversation-manager.ts#L52)

Configuration for the summarization conversation manager.

## Properties

### model?

```ts
optional model?: Model;
```

Defined in: [src/conversation-manager/summarizing-conversation-manager.ts:58](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/conversation-manager/summarizing-conversation-manager.ts#L58)

Model to use for generating summaries. When provided, overrides the model attached to the agent. Useful when you want to use a different model than the one attached to the agent.

---

### summaryRatio?

```ts
optional summaryRatio?: number;
```

Defined in: [src/conversation-manager/summarizing-conversation-manager.ts:64](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/conversation-manager/summarizing-conversation-manager.ts#L64)

Ratio of messages to summarize when context overflow occurs. Value is clamped to \[0.1, 0.8\]. Defaults to 0.3 (summarize 30% of oldest messages).

---

### preserveRecentMessages?

```ts
optional preserveRecentMessages?: number;
```

Defined in: [src/conversation-manager/summarizing-conversation-manager.ts:70](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/conversation-manager/summarizing-conversation-manager.ts#L70)

Minimum number of recent messages to always keep. Defaults to 10.

---

### summarizationSystemPrompt?

```ts
optional summarizationSystemPrompt?: string;
```

Defined in: [src/conversation-manager/summarizing-conversation-manager.ts:76](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/conversation-manager/summarizing-conversation-manager.ts#L76)

Custom system prompt for summarization. If not provided, uses a default prompt that produces structured bullet-point summaries.

---

### proactiveCompression?

```ts
optional proactiveCompression?: boolean | ProactiveCompressionConfig;
```

Defined in: [src/conversation-manager/summarizing-conversation-manager.ts:85](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/conversation-manager/summarizing-conversation-manager.ts#L85)

Enable proactive context compression before the model call.

-   `true`: compress when 70% of the context window is used (default threshold).
-   `{ compressionThreshold: number }`: compress at the specified ratio (0, 1\].
-   `false` or omitted: disabled, only reactive overflow recovery is used.