Defined in: [src/hooks/events.ts:243](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/events.ts#L243)

Response from a model invocation containing the message and stop reason.

## Properties

### message

```ts
readonly message: Message;
```

Defined in: [src/hooks/events.ts:247](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/events.ts#L247)

The message returned by the model.

---

### stopReason

```ts
readonly stopReason: StopReason;
```

Defined in: [src/hooks/events.ts:251](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/events.ts#L251)

The reason the model stopped generating.

---

### redaction?

```ts
readonly optional redaction: Redaction;
```

Defined in: [src/hooks/events.ts:257](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/events.ts#L257)

Optional redaction info when guardrails blocked input. When present, indicates the last user message was redacted. The redacted message is available in `agent.messages` (last message).