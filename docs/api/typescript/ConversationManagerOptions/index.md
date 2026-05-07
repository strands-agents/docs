```ts
type ConversationManagerOptions = {
  proactiveCompression?: boolean | ProactiveCompressionConfig;
};
```

Defined in: [src/conversation-manager/conversation-manager.ts:71](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/conversation-manager/conversation-manager.ts#L71)

Configuration options for the ConversationManager base class.

## Properties

### proactiveCompression?

```ts
optional proactiveCompression?: boolean | ProactiveCompressionConfig;
```

Defined in: [src/conversation-manager/conversation-manager.ts:79](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/conversation-manager/conversation-manager.ts#L79)

Enable proactive context compression before the model call.

-   `true`: compress when 70% of the context window is used (default threshold).
-   `{ compressionThreshold: number }`: compress at the specified ratio (0, 1\].
-   `false` or omitted: disabled, only reactive overflow recovery is used.