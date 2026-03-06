Defined in: [src/models/streaming.ts:412](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/models/streaming.ts#L412)

Token usage statistics for a model invocation. Tracks input, output, and total tokens, plus cache-related metrics.

## Properties

### inputTokens

```ts
inputTokens: number;
```

Defined in: [src/models/streaming.ts:416](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/models/streaming.ts#L416)

Number of tokens in the input (prompt).

---

### outputTokens

```ts
outputTokens: number;
```

Defined in: [src/models/streaming.ts:421](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/models/streaming.ts#L421)

Number of tokens in the output (completion).

---

### totalTokens

```ts
totalTokens: number;
```

Defined in: [src/models/streaming.ts:426](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/models/streaming.ts#L426)

Total number of tokens (input + output).

---

### cacheReadInputTokens?

```ts
optional cacheReadInputTokens: number;
```

Defined in: [src/models/streaming.ts:432](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/models/streaming.ts#L432)

Number of input tokens read from cache. This can reduce latency and cost.

---

### cacheWriteInputTokens?

```ts
optional cacheWriteInputTokens: number;
```

Defined in: [src/models/streaming.ts:438](https://github.com/strands-agents/sdk-typescript/blob/a4458cd64080cab5899aecb70ff742e591c09ab1/src/models/streaming.ts#L438)

Number of input tokens written to cache. These tokens can be reused in future requests.