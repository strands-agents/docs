Defined in: [src/models/streaming.ts:307](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/models/streaming.ts#L307)

Information about output content redaction. May include the original content if captured during streaming.

## Properties

### redactedContent?

```ts
optional redactedContent?: string;
```

Defined in: [src/models/streaming.ts:312](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/models/streaming.ts#L312)

The original content that was blocked by guardrails. May not be available for all providers.

---

### replaceContent

```ts
replaceContent: string;
```

Defined in: [src/models/streaming.ts:317](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/models/streaming.ts#L317)

The content to replace the redacted output with.