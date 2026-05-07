Defined in: [src/hooks/events.ts:437](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L437)

Response from a model invocation containing the message and stop reason.

## Properties

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:441](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L441)

The message returned by the model.

---

### stopReason

```ts
readonly stopReason: StopReason;
```

Defined in: [src/hooks/events.ts:445](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L445)

The reason the model stopped generating.

---

### redaction?

```ts
readonly optional redaction?: Redaction;
```

Defined in: [src/hooks/events.ts:451](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/hooks/events.ts#L451)

Optional redaction info when guardrails blocked input. When present, indicates the last user message was redacted. The redacted message is available in `agent.messages` (last message).