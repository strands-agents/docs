Defined in: [src/types/agent.ts:256](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/agent.ts#L256)

Result returned by the agent loop.

## Constructors

### Constructor

```ts
new AgentResult(data): AgentResult;
```

Defined in: [src/types/agent.ts:295](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/agent.ts#L295)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `stopReason`: [`StopReason`](/docs/api/typescript/StopReason/index.md); `lastMessage`: [`Message`](/docs/api/typescript/Message/index.md); `invocationState`: [`InvocationState`](/docs/api/typescript/InvocationState/index.md); `traces?`: [`AgentTrace`](/docs/api/typescript/AgentTrace/index.md)\[\]; `metrics?`: [`AgentMetrics`](/docs/api/typescript/AgentMetrics/index.md); `structuredOutput?`: `unknown`; } |
| `data.stopReason` | [`StopReason`](/docs/api/typescript/StopReason/index.md) |
| `data.lastMessage` | [`Message`](/docs/api/typescript/Message/index.md) |
| `data.invocationState` | [`InvocationState`](/docs/api/typescript/InvocationState/index.md) |
| `data.traces?` | [`AgentTrace`](/docs/api/typescript/AgentTrace/index.md)\[\] |
| `data.metrics?` | [`AgentMetrics`](/docs/api/typescript/AgentMetrics/index.md) |
| `data.structuredOutput?` | `unknown` |

#### Returns

`AgentResult`

## Properties

### type

```ts
readonly type: "agentResult";
```

Defined in: [src/types/agent.ts:257](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/agent.ts#L257)

---

### stopReason

```ts
readonly stopReason: StopReason;
```

Defined in: [src/types/agent.ts:262](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/agent.ts#L262)

The stop reason from the final model response.

---

### lastMessage

```ts
readonly lastMessage: Message;
```

Defined in: [src/types/agent.ts:267](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/agent.ts#L267)

The last message added to the messages array.

---

### traces?

```ts
readonly optional traces?: AgentTrace[];
```

Defined in: [src/types/agent.ts:273](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/agent.ts#L273)

Local execution traces collected during the agent invocation. Contains timing and hierarchy of operations within the agent loop.

---

### structuredOutput?

```ts
readonly optional structuredOutput?: unknown;
```

Defined in: [src/types/agent.ts:279](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/agent.ts#L279)

The validated structured output from the LLM, if a schema was provided. Type represents any validated Zod schema output.

---

### metrics?

```ts
readonly optional metrics?: AgentMetrics;
```

Defined in: [src/types/agent.ts:285](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/agent.ts#L285)

Aggregated metrics for the agent’s loop execution. Tracks cycle counts, token usage, tool execution stats, and model latency.

---

### invocationState

```ts
readonly invocationState: InvocationState;
```

Defined in: [src/types/agent.ts:293](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/agent.ts#L293)

Per-invocation state passed into the agent, threaded through hooks and tools, and surfaced here at the end of the invocation. See [InvocationState](/docs/api/typescript/InvocationState/index.md) for details. Always defined — defaults to `{}` when no `invocationState` was provided in [InvokeOptions](/docs/api/typescript/InvokeOptions/index.md).

## Accessors

### contextSize

#### Get Signature

```ts
get contextSize(): number;
```

Defined in: [src/types/agent.ts:322](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/agent.ts#L322)

The most recent input token count from the last model invocation. Convenience accessor that delegates to `metrics.latestContextSize`. Returns `undefined` when no metrics or invocations are available.

##### Returns

`number`

---

### projectedContextSize

#### Get Signature

```ts
get projectedContextSize(): number;
```

Defined in: [src/types/agent.ts:331](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/agent.ts#L331)

Projected context size for the next model call (inputTokens + outputTokens from the last call). Convenience accessor that delegates to `metrics.projectedContextSize`. Returns `undefined` when no metrics or invocations are available.

##### Returns

`number`

## Methods

### toJSON()

```ts
toJSON(): object;
```

Defined in: [src/types/agent.ts:345](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/agent.ts#L345)

Custom JSON serialization that excludes traces, metrics, and invocationState. Traces and metrics are excluded to avoid sending large payloads over the wire in API responses; `invocationState` is excluded because its values are caller-owned and may not be serializable (see [InvocationState](/docs/api/typescript/InvocationState/index.md)).

All three remain accessible via their properties for debugging.

#### Returns

`object`

Object representation for safe serialization

---

### toString()

```ts
toString(): string;
```

Defined in: [src/types/agent.ts:360](https://github.com/strands-agents/sdk-typescript/blob/a12ea3e3c4680daacc8ca5937b6b8be41474c92b/strands-ts/src/types/agent.ts#L360)

Extracts and concatenates all text content from the last message. Includes text from TextBlock and ReasoningBlock content blocks.

#### Returns

`string`

The agent’s last message as a string, with multiple blocks joined by newlines.