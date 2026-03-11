Defined in: [src/types/messages.ts:393](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/messages.ts#L393)

Data for a reasoning block.

## Properties

### text?

```ts
optional text: string;
```

Defined in: [src/types/messages.ts:397](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/messages.ts#L397)

The text content of the reasoning process.

---

### signature?

```ts
optional signature: string;
```

Defined in: [src/types/messages.ts:402](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/messages.ts#L402)

A cryptographic signature for verification purposes.

---

### redactedContent?

```ts
optional redactedContent: Uint8Array;
```

Defined in: [src/types/messages.ts:407](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/types/messages.ts#L407)

The redacted content of the reasoning process.