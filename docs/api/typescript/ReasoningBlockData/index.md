Defined in: [src/types/messages.ts:393](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/types/messages.ts#L393)

Data for a reasoning block.

## Properties

### text?

```ts
optional text: string;
```

Defined in: [src/types/messages.ts:397](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/types/messages.ts#L397)

The text content of the reasoning process.

---

### signature?

```ts
optional signature: string;
```

Defined in: [src/types/messages.ts:402](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/types/messages.ts#L402)

A cryptographic signature for verification purposes.

---

### redactedContent?

```ts
optional redactedContent: Uint8Array;
```

Defined in: [src/types/messages.ts:407](https://github.com/strands-agents/sdk-typescript/blob/b5da87357191fa3e191973c773a8a5bb63396d61/src/types/messages.ts#L407)

The redacted content of the reasoning process.