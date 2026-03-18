Defined in: [src/types/messages.ts:406](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/messages.ts#L406)

Data for a reasoning block.

## Properties

### text?

```ts
optional text: string;
```

Defined in: [src/types/messages.ts:410](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/messages.ts#L410)

The text content of the reasoning process.

---

### signature?

```ts
optional signature: string;
```

Defined in: [src/types/messages.ts:415](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/messages.ts#L415)

A cryptographic signature for verification purposes.

---

### redactedContent?

```ts
optional redactedContent: Uint8Array;
```

Defined in: [src/types/messages.ts:420](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/messages.ts#L420)

The redacted content of the reasoning process.