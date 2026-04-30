Defined in: [src/types/messages.ts:437](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/types/messages.ts#L437)

Data for a reasoning block.

## Properties

### text?

```ts
optional text?: string;
```

Defined in: [src/types/messages.ts:441](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/types/messages.ts#L441)

The text content of the reasoning process.

---

### signature?

```ts
optional signature?: string;
```

Defined in: [src/types/messages.ts:446](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/types/messages.ts#L446)

A cryptographic signature for verification purposes.

---

### redactedContent?

```ts
optional redactedContent?: Uint8Array;
```

Defined in: [src/types/messages.ts:451](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/types/messages.ts#L451)

The redacted content of the reasoning process.