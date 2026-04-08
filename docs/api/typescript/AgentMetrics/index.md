Defined in: [src/telemetry/meter.ts:148](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/telemetry/meter.ts#L148)

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

Defined in: [src/telemetry/meter.ts:174](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/telemetry/meter.ts#L174)

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

Defined in: [src/telemetry/meter.ts:152](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/telemetry/meter.ts#L152)

Number of agent loop cycles executed.

---

### accumulatedUsage

```ts
readonly accumulatedUsage: Usage;
```

Defined in: [src/telemetry/meter.ts:157](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/telemetry/meter.ts#L157)

Accumulated token usage across all model invocations.

---

### accumulatedMetrics

```ts
readonly accumulatedMetrics: Metrics;
```

Defined in: [src/telemetry/meter.ts:162](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/telemetry/meter.ts#L162)

Accumulated performance metrics across all model invocations.

---

### agentInvocations

```ts
readonly agentInvocations: InvocationMetricsData[];
```

Defined in: [src/telemetry/meter.ts:167](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/telemetry/meter.ts#L167)

Per-invocation metrics.

---

### toolMetrics

```ts
readonly toolMetrics: Record<string, ToolMetricsData>;
```

Defined in: [src/telemetry/meter.ts:172](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/telemetry/meter.ts#L172)

Per-tool execution metrics keyed by tool name.

## Accessors

### latestAgentInvocation

#### Get Signature

```ts
get latestAgentInvocation(): InvocationMetricsData;
```

Defined in: [src/telemetry/meter.ts:185](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/telemetry/meter.ts#L185)

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

Defined in: [src/telemetry/meter.ts:192](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/telemetry/meter.ts#L192)

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
| `usage` | [`Usage`](/docs/api/typescript/Usage/index.md) | [src/telemetry/meter.ts:192](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/telemetry/meter.ts#L192) |
| `metrics` | [`Metrics`](/docs/api/typescript/Metrics/index.md) | [src/telemetry/meter.ts:192](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/telemetry/meter.ts#L192) |

---

### totalDuration

#### Get Signature

```ts
get totalDuration(): number;
```

Defined in: [src/telemetry/meter.ts:199](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/telemetry/meter.ts#L199)

Total duration of all cycles in milliseconds.

##### Returns

`number`

---

### averageCycleTime

#### Get Signature

```ts
get averageCycleTime(): number;
```

Defined in: [src/telemetry/meter.ts:206](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/telemetry/meter.ts#L206)

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

Defined in: [src/telemetry/meter.ts:214](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/telemetry/meter.ts#L214)

Per-tool execution statistics with computed averages and rates.

##### Returns

`Record`<`string`, `ToolMetricsData` & { `averageTime`: `number`; `successRate`: `number`; }>

## Methods

### toJSON()

```ts
toJSON(): AgentMetricsData;
```

Defined in: [src/telemetry/meter.ts:232](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/telemetry/meter.ts#L232)

Returns a JSON-serializable representation of all collected metrics. Called automatically by JSON.stringify().

#### Returns

`AgentMetricsData`

A plain object suitable for round-trip serialization

#### Implementation of

```ts
JSONSerializable.toJSON
```