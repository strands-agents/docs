```ts
type ConversationManagerReduceOptions = {
  agent: LocalAgent;
  model: Model;
  error: ContextWindowOverflowError;
};
```

Defined in: [src/conversation-manager/conversation-manager.ts:17](https://github.com/strands-agents/sdk-typescript/blob/714aa5fa654cfa8ea39cf6fea0813dd27b2f39e9/strands-ts/src/conversation-manager/conversation-manager.ts#L17)

Options passed to [ConversationManager.reduce](/docs/api/typescript/ConversationManager/index.md#reduce).

## Properties

### agent

```ts
agent: LocalAgent;
```

Defined in: [src/conversation-manager/conversation-manager.ts:21](https://github.com/strands-agents/sdk-typescript/blob/714aa5fa654cfa8ea39cf6fea0813dd27b2f39e9/strands-ts/src/conversation-manager/conversation-manager.ts#L21)

The agent instance. Mutate `agent.messages` in place to reduce history.

---

### model

```ts
model: Model;
```

Defined in: [src/conversation-manager/conversation-manager.ts:27](https://github.com/strands-agents/sdk-typescript/blob/714aa5fa654cfa8ea39cf6fea0813dd27b2f39e9/strands-ts/src/conversation-manager/conversation-manager.ts#L27)

The model instance that triggered the overflow. Used by conversation managers that perform model-based reduction (e.g. summarization).

---

### error

```ts
error: ContextWindowOverflowError;
```

Defined in: [src/conversation-manager/conversation-manager.ts:34](https://github.com/strands-agents/sdk-typescript/blob/714aa5fa654cfa8ea39cf6fea0813dd27b2f39e9/strands-ts/src/conversation-manager/conversation-manager.ts#L34)

The [ContextWindowOverflowError](/docs/api/typescript/ContextWindowOverflowError/index.md) that triggered this call. `reduce` MUST remove enough history for the next model call to succeed, or this error will propagate out of the agent loop uncaught.