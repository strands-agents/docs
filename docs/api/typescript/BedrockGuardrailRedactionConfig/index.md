Defined in: [src/models/bedrock.ts:114](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L114)

Redaction configuration for Bedrock guardrails. Controls whether and how blocked content is replaced.

## Properties

### input?

```ts
optional input?: boolean;
```

Defined in: [src/models/bedrock.ts:116](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L116)

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

Defined in: [src/models/bedrock.ts:119](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L119)

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

Defined in: [src/models/bedrock.ts:122](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L122)

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

Defined in: [src/models/bedrock.ts:125](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/bedrock.ts#L125)

Replacement message for redacted output.

#### Default Value

```ts
'[Assistant output redacted.]'
```