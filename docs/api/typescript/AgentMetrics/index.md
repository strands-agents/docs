Defined in: [src/telemetry/meter.ts:140](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/telemetry/meter.ts#L140)

Read-only snapshot of aggregated agent metrics.

Returned by Meter.metrics and stored on [AgentResult](/docs/api/typescript/AgentResult/index.md). Provides access to cycle counts, tool usage, token consumption, and per-invocation breakdowns. Supports serialization via [toJSON](#tojson).

## Example

```typescript
const result = await agent.invoke('Hello')
console.log(result.metrics.cycleCount)
console.log(result.metrics.totalDuration)
console.log(result.metrics.accumulatedData)
console.log(result.metrics.toolMetrics)
console.log(JSON.stringify(result.metrics))
```

## Implements

-   `JSONSerializable`<`AgentMetricsData`\>

## Constructors

### Constructor

```ts
new AgentMetrics(data?): AgentMetrics;
```

Defined in: [src/telemetry/meter.ts:166](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/telemetry/meter.ts#L166)

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

Defined in: [src/telemetry/meter.ts:144](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/telemetry/meter.ts#L144)

Number of agent loop cycles executed.

---

### accumulatedUsage

```ts
readonly accumulatedUsage: Usage;
```

Defined in: [src/telemetry/meter.ts:149](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/telemetry/meter.ts#L149)

Accumulated token usage across all model invocations.

---

### accumulatedMetrics

```ts
readonly accumulatedMetrics: Metrics;
```

Defined in: [src/telemetry/meter.ts:154](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/telemetry/meter.ts#L154)

Accumulated performance metrics across all model invocations.

---

### agentInvocations

```ts
readonly agentInvocations: InvocationMetricsData[];
```

Defined in: [src/telemetry/meter.ts:159](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/telemetry/meter.ts#L159)

Per-invocation metrics.

---

### toolMetrics

```ts
readonly toolMetrics: Record<string, ToolMetricsData>;
```

Defined in: [src/telemetry/meter.ts:164](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/telemetry/meter.ts#L164)

Per-tool execution metrics keyed by tool name.

## Accessors

### latestAgentInvocation

#### Get Signature

```ts
get latestAgentInvocation(): InvocationMetricsData;
```

Defined in: [src/telemetry/meter.ts:177](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/telemetry/meter.ts#L177)

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

Defined in: [src/telemetry/meter.ts:184](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/telemetry/meter.ts#L184)

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
| `usage` | [`Usage`](/docs/api/typescript/Usage/index.md) | [src/telemetry/meter.ts:184](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/telemetry/meter.ts#L184) |
| `metrics` | [`Metrics`](/docs/api/typescript/Metrics/index.md) | [src/telemetry/meter.ts:184](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/telemetry/meter.ts#L184) |

---

### totalDuration

#### Get Signature

```ts
get totalDuration(): number;
```

Defined in: [src/telemetry/meter.ts:191](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/telemetry/meter.ts#L191)

Total duration of all cycles in milliseconds.

##### Returns

`number`

---

### averageCycleTime

#### Get Signature

```ts
get averageCycleTime(): number;
```

Defined in: [src/telemetry/meter.ts:198](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/telemetry/meter.ts#L198)

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

Defined in: [src/telemetry/meter.ts:206](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/telemetry/meter.ts#L206)

Per-tool execution statistics with computed averages and rates.

##### Returns

`Record`<`string`, `ToolMetricsData` & { `averageTime`: `number`; `successRate`: `number`; }>

## Methods

### toJSON()

```ts
toJSON(): AgentMetricsData;
```

Defined in: [src/telemetry/meter.ts:224](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/telemetry/meter.ts#L224)

Returns a JSON-serializable representation of all collected metrics. Called automatically by JSON.stringify().

#### Returns

`AgentMetricsData`

A plain object suitable for round-trip serialization

#### Implementation of

```ts
JSONSerializable.toJSON
```