Defined in: [src/models/bedrock.ts:136](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L136)

Configuration for Bedrock guardrails.

For production use with sensitive content, consider `SessionManager` with `saveLatestOn: 'message'` to persist redactions immediately.

## See

[https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html)

## Properties

### guardrailIdentifier

```ts
guardrailIdentifier: string;
```

Defined in: [src/models/bedrock.ts:138](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L138)

Guardrail identifier

---

### guardrailVersion

```ts
guardrailVersion: string;
```

Defined in: [src/models/bedrock.ts:141](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L141)

Guardrail version (e.g., “1”, “DRAFT”)

---

### trace?

```ts
optional trace?: "enabled" | "disabled" | "enabled_full";
```

Defined in: [src/models/bedrock.ts:144](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L144)

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

Defined in: [src/models/bedrock.ts:147](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L147)

Stream processing mode

---

### redaction?

```ts
optional redaction?: BedrockGuardrailRedactionConfig;
```

Defined in: [src/models/bedrock.ts:150](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L150)

Redaction behavior when content is blocked

---

### guardLatestUserMessage?

```ts
optional guardLatestUserMessage?: boolean;
```

Defined in: [src/models/bedrock.ts:164](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L164)

Only evaluate the latest user message with guardrails. When true, wraps the latest user message’s text/image content in guardContent blocks. This can improve performance and reduce costs in multi-turn conversations.

#### Remarks

The implementation finds the last user message containing text or image content (not just the last message), ensuring correct behavior during tool execution cycles where toolResult messages may follow the user’s actual input.

#### Default Value

```ts
false
```