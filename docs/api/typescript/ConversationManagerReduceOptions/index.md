```ts
type ConversationManagerReduceOptions = {
  agent: LocalAgent;
  error: ContextWindowOverflowError;
};
```

Defined in: [src/conversation-manager/conversation-manager.ts:16](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/conversation-manager/conversation-manager.ts#L16)

Options passed to [ConversationManager.reduce](/docs/api/typescript/ConversationManager/index.md#reduce).

## Properties

### agent

```ts
agent: LocalAgent;
```

Defined in: [src/conversation-manager/conversation-manager.ts:20](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/conversation-manager/conversation-manager.ts#L20)

The agent instance. Mutate `agent.messages` in place to reduce history.

---

### error

```ts
error: ContextWindowOverflowError;
```

Defined in: [src/conversation-manager/conversation-manager.ts:27](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/conversation-manager/conversation-manager.ts#L27)

The [ContextWindowOverflowError](/docs/api/typescript/ContextWindowOverflowError/index.md) that triggered this call. `reduce` MUST remove enough history for the next model call to succeed, or this error will propagate out of the agent loop uncaught.