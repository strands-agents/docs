Defined in: [src/models/bedrock.ts:105](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/bedrock.ts#L105)

Redaction configuration for Bedrock guardrails. Controls whether and how blocked content is replaced.

## Properties

### input?

```ts
optional input: boolean;
```

Defined in: [src/models/bedrock.ts:107](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/bedrock.ts#L107)

Redact input when blocked.

#### Default Value

```ts
true
```

---

### inputMessage?

```ts
optional inputMessage: string;
```

Defined in: [src/models/bedrock.ts:110](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/bedrock.ts#L110)

Replacement message for redacted input.

#### Default Value

```ts
'[User input redacted.]'
```

---

### output?

```ts
optional output: boolean;
```

Defined in: [src/models/bedrock.ts:113](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/bedrock.ts#L113)

Redact output when blocked.

#### Default Value

```ts
false
```

---

### outputMessage?

```ts
optional outputMessage: string;
```

Defined in: [src/models/bedrock.ts:116](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/models/bedrock.ts#L116)

Replacement message for redacted output.

#### Default Value

```ts
'[Assistant output redacted.]'
```