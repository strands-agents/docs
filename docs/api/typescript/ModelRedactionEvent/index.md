Defined in: [src/models/streaming.ts:344](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/streaming.ts#L344)

Event emitted when guardrails block content and trigger redaction.

## Implements

-   [`ModelRedactionEventData`](/docs/api/typescript/ModelRedactionEventData/index.md)

## Properties

### type

```ts
readonly type: "modelRedactionEvent";
```

Defined in: [src/models/streaming.ts:348](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/streaming.ts#L348)

Discriminator for redact events.

#### Implementation of

```ts
ModelRedactionEventData.type
```

---

### inputRedaction?

```ts
readonly optional inputRedaction: RedactInputContent;
```

Defined in: [src/models/streaming.ts:353](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/streaming.ts#L353)

Input redaction information (when input is blocked).

#### Implementation of

```ts
ModelRedactionEventData.inputRedaction
```

---

### outputRedaction?

```ts
readonly optional outputRedaction: RedactOutputContent;
```

Defined in: [src/models/streaming.ts:358](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/streaming.ts#L358)

Output redaction information (when output is blocked).

#### Implementation of

```ts
ModelRedactionEventData.outputRedaction
```