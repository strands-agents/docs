```ts
type ConversationManagerOptions = {
  proactiveCompression?: boolean | ProactiveCompressionConfig;
};
```

Defined in: [src/conversation-manager/conversation-manager.ts:71](https://github.com/strands-agents/sdk-typescript/blob/13a12727f03fa603a6fe1163a9e2a97bd32f1e8c/strands-ts/src/conversation-manager/conversation-manager.ts#L71)

Configuration options for the ConversationManager base class.

## Properties

### proactiveCompression?

```ts
optional proactiveCompression?: boolean | ProactiveCompressionConfig;
```

Defined in: [src/conversation-manager/conversation-manager.ts:79](https://github.com/strands-agents/sdk-typescript/blob/13a12727f03fa603a6fe1163a9e2a97bd32f1e8c/strands-ts/src/conversation-manager/conversation-manager.ts#L79)

Enable proactive context compression before the model call.

-   `true`: compress when 70% of the context window is used (default threshold).
-   `{ compressionThreshold: number }`: compress at the specified ratio (0, 1\].
-   `false` or omitted: disabled, only reactive overflow recovery is used.