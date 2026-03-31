Defined in: [src/types/agent.ts:147](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/agent.ts#L147)

Result returned by the agent loop.

## Constructors

### Constructor

```ts
new AgentResult(data): AgentResult;
```

Defined in: [src/types/agent.ts:178](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/agent.ts#L178)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `stopReason`: [<code dir="auto">StopReason</code>](/docs/api/typescript/StopReason/index.md); `lastMessage`: [<code dir="auto">Message</code>](/docs/api/typescript/Message/index.md); `traces?`: [<code dir="auto">AgentTrace</code>](/docs/api/typescript/AgentTrace/index.md)\[\]; `metrics?`: [<code dir="auto">AgentMetrics</code>](/docs/api/typescript/AgentMetrics/index.md); `structuredOutput?`: `unknown`; } |
| `data.stopReason` | [<code dir="auto">StopReason</code>](/docs/api/typescript/StopReason/index.md) |
| `data.lastMessage` | [<code dir="auto">Message</code>](/docs/api/typescript/Message/index.md) |
| `data.traces?` | [<code dir="auto">AgentTrace</code>](/docs/api/typescript/AgentTrace/index.md)\[\] |
| `data.metrics?` | [<code dir="auto">AgentMetrics</code>](/docs/api/typescript/AgentMetrics/index.md) |
| `data.structuredOutput?` | `unknown` |

#### Returns

`AgentResult`

## Properties

### type

```ts
readonly type: "agentResult";
```

Defined in: [src/types/agent.ts:148](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/agent.ts#L148)

---

### stopReason

```ts
readonly stopReason: StopReason;
```

Defined in: [src/types/agent.ts:153](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/agent.ts#L153)

The stop reason from the final model response.

---

### lastMessage

```ts
readonly lastMessage: Message;
```

Defined in: [src/types/agent.ts:158](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/agent.ts#L158)

The last message added to the messages array.

---

### traces?

```ts
readonly optional traces?: AgentTrace[];
```

Defined in: [src/types/agent.ts:164](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/agent.ts#L164)

Local execution traces collected during the agent invocation. Contains timing and hierarchy of operations within the agent loop.

---

### structuredOutput?

```ts
readonly optional structuredOutput?: unknown;
```

Defined in: [src/types/agent.ts:170](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/agent.ts#L170)

The validated structured output from the LLM, if a schema was provided. Type represents any validated Zod schema output.

---

### metrics?

```ts
readonly optional metrics?: AgentMetrics;
```

Defined in: [src/types/agent.ts:176](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/agent.ts#L176)

Aggregated metrics for the agent’s loop execution. Tracks cycle counts, token usage, tool execution stats, and model latency.

## Methods

### toJSON()

```ts
toJSON(): object;
```

Defined in: [src/types/agent.ts:208](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/agent.ts#L208)

Custom JSON serialization that excludes traces and metrics by default. This prevents accidentally sending large trace/metric data over the wire when serializing AgentResult for API responses.

Traces and metrics remain accessible via their properties for debugging, but won’t be included in JSON.stringify() output.

#### Returns

`object`

Object representation without traces/metrics for safe serialization

---

### toString()

```ts
toString(): string;
```

Defined in: [src/types/agent.ts:223](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/agent.ts#L223)

Extracts and concatenates all text content from the last message. Includes text from TextBlock and ReasoningBlock content blocks.

#### Returns

`string`

The agent’s last message as a string, with multiple blocks joined by newlines.