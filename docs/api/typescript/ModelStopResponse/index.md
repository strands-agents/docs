Defined in: [src/hooks/events.ts:313](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L313)

Response from a model invocation containing the message and stop reason.

## Properties

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:317](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L317)

The message returned by the model.

---

### stopReason

```ts
readonly stopReason: StopReason;
```

Defined in: [src/hooks/events.ts:321](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L321)

The reason the model stopped generating.

---

### redaction?

```ts
readonly optional redaction?: Redaction;
```

Defined in: [src/hooks/events.ts:327](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L327)

Optional redaction info when guardrails blocked input. When present, indicates the last user message was redacted. The redacted message is available in `agent.messages` (last message).