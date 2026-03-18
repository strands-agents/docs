Defined in: [src/types/agent.ts:121](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/agent.ts#L121)

Result returned by the agent loop.

## Constructors

### Constructor

```ts
new AgentResult(data): AgentResult;
```

Defined in: [src/types/agent.ts:146](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/agent.ts#L146)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `stopReason`: [`StopReason`](/docs/api/typescript/StopReason/index.md); `lastMessage`: [`Message`](/docs/api/typescript/Message/index.md); `metrics?`: [`AgentMetrics`](/docs/api/typescript/AgentMetrics/index.md); `structuredOutput?`: `unknown`; } |
| `data.stopReason` | [`StopReason`](/docs/api/typescript/StopReason/index.md) |
| `data.lastMessage` | [`Message`](/docs/api/typescript/Message/index.md) |
| `data.metrics?` | [`AgentMetrics`](/docs/api/typescript/AgentMetrics/index.md) |
| `data.structuredOutput?` | `unknown` |

#### Returns

`AgentResult`

## Properties

### type

```ts
readonly type: "agentResult";
```

Defined in: [src/types/agent.ts:122](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/agent.ts#L122)

---

### stopReason

```ts
readonly stopReason: StopReason;
```

Defined in: [src/types/agent.ts:127](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/agent.ts#L127)

The stop reason from the final model response.

---

### lastMessage

```ts
readonly lastMessage: Message;
```

Defined in: [src/types/agent.ts:132](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/agent.ts#L132)

The last message added to the messages array.

---

### structuredOutput?

```ts
readonly optional structuredOutput: unknown;
```

Defined in: [src/types/agent.ts:138](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/agent.ts#L138)

The validated structured output from the LLM, if a schema was provided. Type represents any validated Zod schema output.

---

### metrics?

```ts
readonly optional metrics: AgentMetrics;
```

Defined in: [src/types/agent.ts:144](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/agent.ts#L144)

Aggregated metrics for the agent’s loop execution. Tracks cycle counts, token usage, tool execution stats, and model latency.

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [src/types/agent.ts:168](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/agent.ts#L168)

Extracts and concatenates all text content from the last message. Includes text from TextBlock and ReasoningBlock content blocks.

#### Returns

`string`

The agent’s last message as a string, with multiple blocks joined by newlines.