Defined in: [src/models/streaming.ts:344](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/models/streaming.ts#L344)

Event emitted when guardrails block content and trigger redaction.

## Implements

-   [`ModelRedactionEventData`](/docs/api/typescript/ModelRedactionEventData/index.md)

## Constructors

### Constructor

```ts
new ModelRedactionEvent(data): ModelRedactionEvent;
```

Defined in: [src/models/streaming.ts:360](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/models/streaming.ts#L360)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | [`ModelRedactionEventData`](/docs/api/typescript/ModelRedactionEventData/index.md) |

#### Returns

`ModelRedactionEvent`

## Properties

### type

```ts
readonly type: "modelRedactionEvent";
```

Defined in: [src/models/streaming.ts:348](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/models/streaming.ts#L348)

Discriminator for redact events.

#### Implementation of

[`ModelRedactionEventData`](/docs/api/typescript/ModelRedactionEventData/index.md).[`type`](/docs/api/typescript/ModelRedactionEventData/index.md#type)

---

### inputRedaction?

```ts
readonly optional inputRedaction?: RedactInputContent;
```

Defined in: [src/models/streaming.ts:353](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/models/streaming.ts#L353)

Input redaction information (when input is blocked).

#### Implementation of

[`ModelRedactionEventData`](/docs/api/typescript/ModelRedactionEventData/index.md).[`inputRedaction`](/docs/api/typescript/ModelRedactionEventData/index.md#inputredaction)

---

### outputRedaction?

```ts
readonly optional outputRedaction?: RedactOutputContent;
```

Defined in: [src/models/streaming.ts:358](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/models/streaming.ts#L358)

Output redaction information (when output is blocked).

#### Implementation of

[`ModelRedactionEventData`](/docs/api/typescript/ModelRedactionEventData/index.md).[`outputRedaction`](/docs/api/typescript/ModelRedactionEventData/index.md#outputredaction)