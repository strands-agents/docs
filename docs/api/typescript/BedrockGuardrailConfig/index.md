Defined in: [src/models/bedrock.ts:135](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/models/bedrock.ts#L135)

Configuration for Bedrock guardrails.

For production use with sensitive content, consider `SessionManager` with `saveLatestOn: 'message'` to persist redactions immediately.

## See

[https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html)

## Properties

### guardrailIdentifier

```ts
guardrailIdentifier: string;
```

Defined in: [src/models/bedrock.ts:137](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/models/bedrock.ts#L137)

Guardrail identifier

---

### guardrailVersion

```ts
guardrailVersion: string;
```

Defined in: [src/models/bedrock.ts:140](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/models/bedrock.ts#L140)

Guardrail version (e.g., “1”, “DRAFT”)

---

### trace?

```ts
optional trace?: "enabled" | "disabled" | "enabled_full";
```

Defined in: [src/models/bedrock.ts:143](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/models/bedrock.ts#L143)

Trace mode for evaluation.

#### Default Value

```ts
'enabled'
```

---

### streamProcessingMode?

```ts
optional streamProcessingMode?: "sync" | "async";
```

Defined in: [src/models/bedrock.ts:146](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/models/bedrock.ts#L146)

Stream processing mode

---

### redaction?

```ts
optional redaction?: BedrockGuardrailRedactionConfig;
```

Defined in: [src/models/bedrock.ts:149](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/models/bedrock.ts#L149)

Redaction behavior when content is blocked

---

### guardLatestUserMessage?

```ts
optional guardLatestUserMessage?: boolean;
```

Defined in: [src/models/bedrock.ts:163](https://github.com/strands-agents/sdk-typescript/blob/4ab6306cee14134c3f8938275d64dbac6fb2c8ac/src/models/bedrock.ts#L163)

Only evaluate the latest user message with guardrails. When true, wraps the latest user message’s text/image content in guardContent blocks. This can improve performance and reduce costs in multi-turn conversations.

#### Remarks

The implementation finds the last user message containing text or image content (not just the last message), ensuring correct behavior during tool execution cycles where toolResult messages may follow the user’s actual input.

#### Default Value

```ts
false
```