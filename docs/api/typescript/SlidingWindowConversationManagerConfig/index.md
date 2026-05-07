```ts
type SlidingWindowConversationManagerConfig = {
  windowSize?: number;
  shouldTruncateResults?: boolean;
  proactiveCompression?: boolean | ProactiveCompressionConfig;
};
```

Defined in: [src/conversation-manager/sliding-window-conversation-manager.ts:21](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/conversation-manager/sliding-window-conversation-manager.ts#L21)

Configuration for the sliding window conversation manager.

## Properties

### windowSize?

```ts
optional windowSize?: number;
```

Defined in: [src/conversation-manager/sliding-window-conversation-manager.ts:26](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/conversation-manager/sliding-window-conversation-manager.ts#L26)

Maximum number of messages to keep in the conversation history. Defaults to 40 messages.

---

### shouldTruncateResults?

```ts
optional shouldTruncateResults?: boolean;
```

Defined in: [src/conversation-manager/sliding-window-conversation-manager.ts:32](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/conversation-manager/sliding-window-conversation-manager.ts#L32)

Whether to truncate tool results when a message is too large for the model’s context window. Defaults to true.

---

### proactiveCompression?

```ts
optional proactiveCompression?: boolean | ProactiveCompressionConfig;
```

Defined in: [src/conversation-manager/sliding-window-conversation-manager.ts:41](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/conversation-manager/sliding-window-conversation-manager.ts#L41)

Enable proactive context compression before the model call.

-   `true`: compress when 70% of the context window is used (default threshold).
-   `{ compressionThreshold: number }`: compress at the specified ratio (0, 1\].
-   `false` or omitted: disabled, only reactive overflow recovery is used.