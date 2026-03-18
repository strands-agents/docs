Defined in: [src/telemetry/meter.ts:147](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/telemetry/meter.ts#L147)

Read-only snapshot of aggregated agent metrics.

Returned by Meter.metrics and stored on [AgentResult](/docs/api/typescript/AgentResult/index.md). Provides access to cycle counts, tool usage, token consumption, and per-invocation breakdowns. Supports serialization via [toJSON](#tojson).

## Example

```typescript
const result = await agent.invoke('Hello')
console.log(result.metrics?.cycleCount)
console.log(result.metrics?.totalDuration)
console.log(result.metrics?.accumulatedData)
console.log(result.metrics?.toolMetrics)
console.log(JSON.stringify(result.metrics))
```

## Implements

-   `JSONSerializable`<`AgentMetricsData`\>

## Constructors

### Constructor

```ts
new AgentMetrics(data?): AgentMetrics;
```

Defined in: [src/telemetry/meter.ts:173](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/telemetry/meter.ts#L173)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data?` | `Partial`<`AgentMetricsData`\> |

#### Returns

`AgentMetrics`

## Properties

### cycleCount

```ts
readonly cycleCount: number;
```

Defined in: [src/telemetry/meter.ts:151](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/telemetry/meter.ts#L151)

Number of agent loop cycles executed.

---

### accumulatedUsage

```ts
readonly accumulatedUsage: Usage;
```

Defined in: [src/telemetry/meter.ts:156](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/telemetry/meter.ts#L156)

Accumulated token usage across all model invocations.

---

### accumulatedMetrics

```ts
readonly accumulatedMetrics: Metrics;
```

Defined in: [src/telemetry/meter.ts:161](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/telemetry/meter.ts#L161)

Accumulated performance metrics across all model invocations.

---

### agentInvocations

```ts
readonly agentInvocations: InvocationMetricsData[];
```

Defined in: [src/telemetry/meter.ts:166](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/telemetry/meter.ts#L166)

Per-invocation metrics.

---

### toolMetrics

```ts
readonly toolMetrics: Record<string, ToolMetricsData>;
```

Defined in: [src/telemetry/meter.ts:171](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/telemetry/meter.ts#L171)

Per-tool execution metrics keyed by tool name.

## Accessors

### latestAgentInvocation

#### Get Signature

```ts
get latestAgentInvocation(): InvocationMetricsData;
```

Defined in: [src/telemetry/meter.ts:184](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/telemetry/meter.ts#L184)

The most recent agent invocation, or undefined if none exist.

##### Returns

`InvocationMetricsData`

---

### accumulatedData

#### Get Signature

```ts
get accumulatedData(): {
  usage: Usage;
  metrics: Metrics;
};
```

Defined in: [src/telemetry/meter.ts:191](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/telemetry/meter.ts#L191)

Accumulated usage and performance metrics across all model invocations.

##### Returns

```ts
{
  usage: Usage;
  metrics: Metrics;
}
```

| Name | Type | Defined in |
| --- | --- | --- |
| `usage` | [`Usage`](/docs/api/typescript/Usage/index.md) | [src/telemetry/meter.ts:191](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/telemetry/meter.ts#L191) |
| `metrics` | [`Metrics`](/docs/api/typescript/Metrics/index.md) | [src/telemetry/meter.ts:191](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/telemetry/meter.ts#L191) |

---

### totalDuration

#### Get Signature

```ts
get totalDuration(): number;
```

Defined in: [src/telemetry/meter.ts:198](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/telemetry/meter.ts#L198)

Total duration of all cycles in milliseconds.

##### Returns

`number`

---

### averageCycleTime

#### Get Signature

```ts
get averageCycleTime(): number;
```

Defined in: [src/telemetry/meter.ts:205](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/telemetry/meter.ts#L205)

Average cycle duration in milliseconds, or 0 if no cycles exist.

##### Returns

`number`

---

### toolUsage

#### Get Signature

```ts
get toolUsage(): Record<string, ToolMetricsData & {
  averageTime: number;
  successRate: number;
}>;
```

Defined in: [src/telemetry/meter.ts:213](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/telemetry/meter.ts#L213)

Per-tool execution statistics with computed averages and rates.

##### Returns

`Record`<`string`, `ToolMetricsData` & { `averageTime`: `number`; `successRate`: `number`; }>

## Methods

### toJSON()

```ts
toJSON(): AgentMetricsData;
```

Defined in: [src/telemetry/meter.ts:231](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/telemetry/meter.ts#L231)

Returns a JSON-serializable representation of all collected metrics. Called automatically by JSON.stringify().

#### Returns

`AgentMetricsData`

A plain object suitable for round-trip serialization

#### Implementation of

```ts
JSONSerializable.toJSON
```