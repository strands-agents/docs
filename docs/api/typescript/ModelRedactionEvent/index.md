Defined in: [src/models/streaming.ts:344](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/streaming.ts#L344)

Event emitted when guardrails block content and trigger redaction.

## Implements

-   [<code dir="auto">ModelRedactionEventData</code>](/docs/api/typescript/ModelRedactionEventData/index.md)

## Constructors

### Constructor

```ts
new ModelRedactionEvent(data): ModelRedactionEvent;
```

Defined in: [src/models/streaming.ts:360](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/streaming.ts#L360)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [<code dir="auto">ModelRedactionEventData</code>](/docs/api/typescript/ModelRedactionEventData/index.md) |

#### Returns

`ModelRedactionEvent`

## Properties

### type

```ts
readonly type: "modelRedactionEvent";
```

Defined in: [src/models/streaming.ts:348](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/streaming.ts#L348)

Discriminator for redact events.

#### Implementation of

[<code dir="auto">ModelRedactionEventData</code>](/docs/api/typescript/ModelRedactionEventData/index.md).[<code dir="auto">type</code>](/docs/api/typescript/ModelRedactionEventData/index.md#type)

---

### inputRedaction?

```ts
readonly optional inputRedaction?: RedactInputContent;
```

Defined in: [src/models/streaming.ts:353](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/streaming.ts#L353)

Input redaction information (when input is blocked).

#### Implementation of

[<code dir="auto">ModelRedactionEventData</code>](/docs/api/typescript/ModelRedactionEventData/index.md).[<code dir="auto">inputRedaction</code>](/docs/api/typescript/ModelRedactionEventData/index.md#inputredaction)

---

### outputRedaction?

```ts
readonly optional outputRedaction?: RedactOutputContent;
```

Defined in: [src/models/streaming.ts:358](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/streaming.ts#L358)

Output redaction information (when output is blocked).

#### Implementation of

[<code dir="auto">ModelRedactionEventData</code>](/docs/api/typescript/ModelRedactionEventData/index.md).[<code dir="auto">outputRedaction</code>](/docs/api/typescript/ModelRedactionEventData/index.md#outputredaction)