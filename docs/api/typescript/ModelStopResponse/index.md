Defined in: [src/hooks/events.ts:385](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/hooks/events.ts#L385)

Response from a model invocation containing the message and stop reason.

## Properties

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:389](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/hooks/events.ts#L389)

The message returned by the model.

---

### stopReason

```ts
readonly stopReason: StopReason;
```

Defined in: [src/hooks/events.ts:393](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/hooks/events.ts#L393)

The reason the model stopped generating.

---

### redaction?

```ts
readonly optional redaction?: Redaction;
```

Defined in: [src/hooks/events.ts:399](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/hooks/events.ts#L399)

Optional redaction info when guardrails blocked input. When present, indicates the last user message was redacted. The redacted message is available in `agent.messages` (last message).