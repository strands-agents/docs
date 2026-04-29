Defined in: [src/models/bedrock.ts:117](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/models/bedrock.ts#L117)

Redaction configuration for Bedrock guardrails. Controls whether and how blocked content is replaced.

## Properties

### input?

```ts
optional input?: boolean;
```

Defined in: [src/models/bedrock.ts:119](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/models/bedrock.ts#L119)

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

Defined in: [src/models/bedrock.ts:122](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/models/bedrock.ts#L122)

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

Defined in: [src/models/bedrock.ts:125](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/models/bedrock.ts#L125)

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

Defined in: [src/models/bedrock.ts:128](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/models/bedrock.ts#L128)

Replacement message for redacted output.

#### Default Value

```ts
'[Assistant output redacted.]'
```