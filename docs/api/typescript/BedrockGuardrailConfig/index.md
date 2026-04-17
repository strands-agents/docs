Defined in: [src/models/bedrock.ts:137](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/bedrock.ts#L137)

Configuration for Bedrock guardrails.

For production use with sensitive content, consider `SessionManager` with `saveLatestOn: 'message'` to persist redactions immediately.

## See

[https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html)

## Properties

### guardrailIdentifier

```ts
guardrailIdentifier: string;
```

Defined in: [src/models/bedrock.ts:139](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/bedrock.ts#L139)

Guardrail identifier

---

### guardrailVersion

```ts
guardrailVersion: string;
```

Defined in: [src/models/bedrock.ts:142](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/bedrock.ts#L142)

Guardrail version (e.g., “1”, “DRAFT”)

---

### trace?

```ts
optional trace?: "enabled" | "disabled" | "enabled_full";
```

Defined in: [src/models/bedrock.ts:145](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/bedrock.ts#L145)

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

Defined in: [src/models/bedrock.ts:148](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/bedrock.ts#L148)

Stream processing mode

---

### redaction?

```ts
optional redaction?: BedrockGuardrailRedactionConfig;
```

Defined in: [src/models/bedrock.ts:151](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/bedrock.ts#L151)

Redaction behavior when content is blocked

---

### guardLatestUserMessage?

```ts
optional guardLatestUserMessage?: boolean;
```

Defined in: [src/models/bedrock.ts:165](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/bedrock.ts#L165)

Only evaluate the latest user message with guardrails. When true, wraps the latest user message’s text/image content in guardContent blocks. This can improve performance and reduce costs in multi-turn conversations.

#### Remarks

The implementation finds the last user message containing text or image content (not just the last message), ensuring correct behavior during tool execution cycles where toolResult messages may follow the user’s actual input.

#### Default Value

```ts
false
```