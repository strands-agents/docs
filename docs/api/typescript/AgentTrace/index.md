Defined in: [src/telemetry/tracer.ts:73](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/telemetry/tracer.ts#L73)

Execution trace for performance analysis. Tracks timing and hierarchy of operations within the agent loop. Fields default to null for JSON serialization compatibility.

## Implements

-   `JSONSerializable`<`AgentTraceData`\>

## Constructors

### Constructor

```ts
new AgentTrace(name, options?): AgentTrace;
```

Defined in: [src/telemetry/tracer.ts:97](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/telemetry/tracer.ts#L97)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | Display name for this trace |
| `options?` | { `parent?`: `AgentTrace`; `startTime?`: `number`; } | Optional configuration for parent and startTime |
| `options.parent?` | `AgentTrace` | \- |
| `options.startTime?` | `number` | \- |

#### Returns

`AgentTrace`

## Properties

### id

```ts
readonly id: string;
```

Defined in: [src/telemetry/tracer.ts:75](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/telemetry/tracer.ts#L75)

Unique identifier (UUID) for this trace.

---

### name

```ts
readonly name: string;
```

Defined in: [src/telemetry/tracer.ts:77](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/telemetry/tracer.ts#L77)

Human-readable display name (e.g., “Cycle 1”, “Tool: calc”, “stream\_messages”).

---

### parentId

```ts
readonly parentId: string;
```

Defined in: [src/telemetry/tracer.ts:79](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/telemetry/tracer.ts#L79)

ID of the parent trace, if this trace is nested. Null for root traces.

---

### startTime

```ts
readonly startTime: number;
```

Defined in: [src/telemetry/tracer.ts:81](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/telemetry/tracer.ts#L81)

Start time in milliseconds since epoch.

---

### endTime

```ts
endTime: number = null;
```

Defined in: [src/telemetry/tracer.ts:83](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/telemetry/tracer.ts#L83)

End time in milliseconds since epoch. Null until trace is ended.

---

### duration

```ts
duration: number = 0;
```

Defined in: [src/telemetry/tracer.ts:85](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/telemetry/tracer.ts#L85)

Duration in milliseconds (endTime - startTime).

---

### children

```ts
readonly children: AgentTrace[] = [];
```

Defined in: [src/telemetry/tracer.ts:87](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/telemetry/tracer.ts#L87)

Child traces nested under this trace.

---

### metadata

```ts
readonly metadata: Record<string, string> = {};
```

Defined in: [src/telemetry/tracer.ts:89](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/telemetry/tracer.ts#L89)

Additional metadata for this trace (e.g., cycleId, toolUseId, toolName).

---

### message

```ts
message: Message = null;
```

Defined in: [src/telemetry/tracer.ts:91](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/telemetry/tracer.ts#L91)

Message associated with this trace (e.g., model output). Null if not applicable.

## Methods

### end()

```ts
end(endTime?): void;
```

Defined in: [src/telemetry/tracer.ts:111](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/telemetry/tracer.ts#L111)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `endTime?` | `number` | Optional end time in milliseconds since epoch |

#### Returns

`void`

---

### toJSON()

```ts
toJSON(): AgentTraceData;
```

Defined in: [src/telemetry/tracer.ts:116](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/telemetry/tracer.ts#L116)

#### Returns

`AgentTraceData`

#### Implementation of

```ts
JSONSerializable.toJSON
```