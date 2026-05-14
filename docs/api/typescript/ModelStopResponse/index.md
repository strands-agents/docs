Defined in: [src/hooks/events.ts:443](https://github.com/strands-agents/sdk-typescript/blob/13a12727f03fa603a6fe1163a9e2a97bd32f1e8c/strands-ts/src/hooks/events.ts#L443)

Response from a model invocation containing the message and stop reason.

## Properties

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:447](https://github.com/strands-agents/sdk-typescript/blob/13a12727f03fa603a6fe1163a9e2a97bd32f1e8c/strands-ts/src/hooks/events.ts#L447)

The message returned by the model.

---

### stopReason

```ts
readonly stopReason: StopReason;
```

Defined in: [src/hooks/events.ts:451](https://github.com/strands-agents/sdk-typescript/blob/13a12727f03fa603a6fe1163a9e2a97bd32f1e8c/strands-ts/src/hooks/events.ts#L451)

The reason the model stopped generating.

---

### redaction?

```ts
readonly optional redaction?: Redaction;
```

Defined in: [src/hooks/events.ts:457](https://github.com/strands-agents/sdk-typescript/blob/13a12727f03fa603a6fe1163a9e2a97bd32f1e8c/strands-ts/src/hooks/events.ts#L457)

Optional redaction info when guardrails blocked input. When present, indicates the last user message was redacted. The redacted message is available in `agent.messages` (last message).