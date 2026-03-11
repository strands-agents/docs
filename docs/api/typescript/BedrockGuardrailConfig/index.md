Defined in: [src/models/bedrock.ts:127](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/bedrock.ts#L127)

Configuration for Bedrock guardrails.

For production use with sensitive content, consider `SessionManager` with `saveLatestOn: 'message'` to persist redactions immediately.

## See

[https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html)

## Properties

### guardrailIdentifier

```ts
guardrailIdentifier: string;
```

Defined in: [src/models/bedrock.ts:129](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/bedrock.ts#L129)

Guardrail identifier

---

### guardrailVersion

```ts
guardrailVersion: string;
```

Defined in: [src/models/bedrock.ts:132](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/bedrock.ts#L132)

Guardrail version (e.g., “1”, “DRAFT”)

---

### trace?

```ts
optional trace: "enabled" | "disabled" | "enabled_full";
```

Defined in: [src/models/bedrock.ts:135](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/bedrock.ts#L135)

Trace mode for evaluation.

#### Default Value

```ts
'enabled'
```

---

### streamProcessingMode?

```ts
optional streamProcessingMode: "sync" | "async";
```

Defined in: [src/models/bedrock.ts:138](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/bedrock.ts#L138)

Stream processing mode

---

### redaction?

```ts
optional redaction: BedrockGuardrailRedactionConfig;
```

Defined in: [src/models/bedrock.ts:141](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/bedrock.ts#L141)

Redaction behavior when content is blocked