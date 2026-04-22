```ts
type SlidingWindowConversationManagerConfig = {
  windowSize?: number;
  shouldTruncateResults?: boolean;
};
```

Defined in: [src/conversation-manager/sliding-window-conversation-manager.ts:17](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/conversation-manager/sliding-window-conversation-manager.ts#L17)

Configuration for the sliding window conversation manager.

## Properties

### windowSize?

```ts
optional windowSize?: number;
```

Defined in: [src/conversation-manager/sliding-window-conversation-manager.ts:22](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/conversation-manager/sliding-window-conversation-manager.ts#L22)

Maximum number of messages to keep in the conversation history. Defaults to 40 messages.

---

### shouldTruncateResults?

```ts
optional shouldTruncateResults?: boolean;
```

Defined in: [src/conversation-manager/sliding-window-conversation-manager.ts:28](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/conversation-manager/sliding-window-conversation-manager.ts#L28)

Whether to truncate tool results when a message is too large for the model’s context window. Defaults to true.