Defined in: [src/types/agent.ts:275](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/agent.ts#L275)

Result returned by the agent loop.

## Constructors

### Constructor

```ts
new AgentResult(data): AgentResult;
```

Defined in: [src/types/agent.ts:320](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/agent.ts#L320)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `stopReason`: [`StopReason`](/docs/api/typescript/StopReason/index.md); `lastMessage`: [`Message`](/docs/api/typescript/Message/index.md); `invocationState`: [`InvocationState`](/docs/api/typescript/InvocationState/index.md); `traces?`: [`AgentTrace`](/docs/api/typescript/AgentTrace/index.md)\[\]; `metrics?`: [`AgentMetrics`](/docs/api/typescript/AgentMetrics/index.md); `structuredOutput?`: `unknown`; `interrupts?`: [`Interrupt`](/docs/api/typescript/Interrupt/index.md)\[\]; } |
| `data.stopReason` | [`StopReason`](/docs/api/typescript/StopReason/index.md) |
| `data.lastMessage` | [`Message`](/docs/api/typescript/Message/index.md) |
| `data.invocationState` | [`InvocationState`](/docs/api/typescript/InvocationState/index.md) |
| `data.traces?` | [`AgentTrace`](/docs/api/typescript/AgentTrace/index.md)\[\] |
| `data.metrics?` | [`AgentMetrics`](/docs/api/typescript/AgentMetrics/index.md) |
| `data.structuredOutput?` | `unknown` |
| `data.interrupts?` | [`Interrupt`](/docs/api/typescript/Interrupt/index.md)\[\] |

#### Returns

`AgentResult`

## Properties

### type

```ts
readonly type: "agentResult";
```

Defined in: [src/types/agent.ts:276](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/agent.ts#L276)

---

### stopReason

```ts
readonly stopReason: StopReason;
```

Defined in: [src/types/agent.ts:281](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/agent.ts#L281)

The stop reason from the final model response.

---

### lastMessage

```ts
readonly lastMessage: Message;
```

Defined in: [src/types/agent.ts:286](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/agent.ts#L286)

The last message added to the messages array.

---

### traces?

```ts
readonly optional traces?: AgentTrace[];
```

Defined in: [src/types/agent.ts:292](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/agent.ts#L292)

Local execution traces collected during the agent invocation. Contains timing and hierarchy of operations within the agent loop.

---

### structuredOutput?

```ts
readonly optional structuredOutput?: unknown;
```

Defined in: [src/types/agent.ts:298](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/agent.ts#L298)

The validated structured output from the LLM, if a schema was provided. Type represents any validated Zod schema output.

---

### metrics?

```ts
readonly optional metrics?: AgentMetrics;
```

Defined in: [src/types/agent.ts:304](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/agent.ts#L304)

Aggregated metrics for the agent’s loop execution. Tracks cycle counts, token usage, tool execution stats, and model latency.

---

### invocationState

```ts
readonly invocationState: InvocationState;
```

Defined in: [src/types/agent.ts:312](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/agent.ts#L312)

Per-invocation state passed into the agent, threaded through hooks and tools, and surfaced here at the end of the invocation. See [InvocationState](/docs/api/typescript/InvocationState/index.md) for details. Always defined — defaults to `{}` when no `invocationState` was provided in [InvokeOptions](/docs/api/typescript/InvokeOptions/index.md).

---

### interrupts?

```ts
readonly optional interrupts?: Interrupt[];
```

Defined in: [src/types/agent.ts:318](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/agent.ts#L318)

Interrupts that caused the agent to stop, when `stopReason` is `'interrupt'`. Contains the unanswered interrupts that require human input to resume.

## Accessors

### contextSize

#### Get Signature

```ts
get contextSize(): number;
```

Defined in: [src/types/agent.ts:351](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/agent.ts#L351)

The most recent input token count from the last model invocation. Convenience accessor that delegates to `metrics.latestContextSize`. Returns `undefined` when no metrics or invocations are available.

##### Returns

`number`

---

### projectedContextSize

#### Get Signature

```ts
get projectedContextSize(): number;
```

Defined in: [src/types/agent.ts:360](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/agent.ts#L360)

Projected context size for the next model call (inputTokens + outputTokens from the last call). Convenience accessor that delegates to `metrics.projectedContextSize`. Returns `undefined` when no metrics or invocations are available.

##### Returns

`number`

## Methods

### toJSON()

```ts
toJSON(): object;
```

Defined in: [src/types/agent.ts:374](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/agent.ts#L374)

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

Defined in: [src/types/agent.ts:389](https://github.com/strands-agents/sdk-typescript/blob/9d6ae1a310097815db085f4d3aec6ec8f0057c1b/strands-ts/src/types/agent.ts#L389)

Extracts and concatenates all text content from the last message. Includes text from TextBlock and ReasoningBlock content blocks.

#### Returns

`string`

The agent’s last message as a string, with multiple blocks joined by newlines.