Defined in: [src/models/bedrock.ts:115](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/bedrock.ts#L115)

Redaction configuration for Bedrock guardrails. Controls whether and how blocked content is replaced.

## Properties

### input?

```ts
optional input?: boolean;
```

Defined in: [src/models/bedrock.ts:117](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/bedrock.ts#L117)

Redact input when blocked.

#### Default Value

```ts
true
```

---

### inputMessage?

```ts
optional inputMessage?: string;
```

Defined in: [src/models/bedrock.ts:120](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/bedrock.ts#L120)

Replacement message for redacted input.

#### Default Value

```ts
'[User input redacted.]'
```

---

### output?

```ts
optional output?: boolean;
```

Defined in: [src/models/bedrock.ts:123](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/bedrock.ts#L123)

Redact output when blocked.

#### Default Value

```ts
false
```

---

### outputMessage?

```ts
optional outputMessage?: string;
```

Defined in: [src/models/bedrock.ts:126](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/bedrock.ts#L126)

Replacement message for redacted output.

#### Default Value

```ts
'[Assistant output redacted.]'
```