Defined in: [src/types/messages.ts:536](https://github.com/strands-agents/sdk-typescript/blob/4dd13ca32f73cd4603a1d468e3e5f60292a88334/strands-ts/src/types/messages.ts#L536)

Data for a cache point block.

## Properties

### cacheType

```ts
cacheType: "default";
```

Defined in: [src/types/messages.ts:540](https://github.com/strands-agents/sdk-typescript/blob/4dd13ca32f73cd4603a1d468e3e5f60292a88334/strands-ts/src/types/messages.ts#L540)

The cache type. Currently only ‘default’ is supported.

---

### ttl?

```ts
optional ttl?: string;
```

Defined in: [src/types/messages.ts:549](https://github.com/strands-agents/sdk-typescript/blob/4dd13ca32f73cd4603a1d468e3e5f60292a88334/strands-ts/src/types/messages.ts#L549)

Optional TTL for the cache entry. When omitted, the provider’s default TTL is used.

The accepted value space is provider-specific. For example, the Bedrock provider only accepts the values defined by `BedrockCacheTTL` (`'5m'` and `'1h'`). Other providers may accept different values or ignore this field.