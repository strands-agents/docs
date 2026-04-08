Utilities for collecting and reporting performance metrics in the SDK.

## Trace

```python
class Trace()
```

Defined in: [src/strands/telemetry/metrics.py:21](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L21)

A trace representing a single operation or step in the execution flow.

#### \_\_init\_\_

```python
def __init__(name: str,
             parent_id: str | None = None,
             start_time: float | None = None,
             raw_name: str | None = None,
             metadata: dict[str, Any] | None = None,
             message: Message | None = None) -> None
```

Defined in: [src/strands/telemetry/metrics.py:24](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L24)

Initialize a new trace.

**Arguments**:

-   `name` - Human-readable name of the operation being traced.
-   `parent_id` - ID of the parent trace, if this is a child operation.
-   `start_time` - Timestamp when the trace started. If not provided, the current time will be used.
-   `raw_name` - System level name.
-   `metadata` - Additional contextual information about the trace.
-   `message` - Message associated with the trace.

#### end

```python
def end(end_time: float | None = None) -> None
```

Defined in: [src/strands/telemetry/metrics.py:54](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L54)

Mark the trace as complete with the given or current timestamp.

**Arguments**:

-   `end_time` - Timestamp to use as the end time. If not provided, the current time will be used.

#### add\_child

```python
def add_child(child: "Trace") -> None
```

Defined in: [src/strands/telemetry/metrics.py:63](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L63)

Add a child trace to this trace.

**Arguments**:

-   `child` - The child trace to add.

#### duration

```python
def duration() -> float | None
```

Defined in: [src/strands/telemetry/metrics.py:71](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L71)

Calculate the duration of this trace.

**Returns**:

The duration in seconds, or None if the trace hasn’t ended yet.

#### add\_message

```python
def add_message(message: Message) -> None
```

Defined in: [src/strands/telemetry/metrics.py:79](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L79)

Add a message to the trace.

**Arguments**:

-   `message` - The message to add.

#### to\_dict

```python
def to_dict() -> dict[str, Any]
```

Defined in: [src/strands/telemetry/metrics.py:87](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L87)

Convert the trace to a dictionary representation.

**Returns**:

A dictionary containing all trace information, suitable for serialization.

## ToolMetrics

```python
@dataclass
class ToolMetrics()
```

Defined in: [src/strands/telemetry/metrics.py:108](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L108)

Metrics for a specific tool’s usage.

**Attributes**:

-   `tool` - The tool being tracked.
-   `call_count` - Number of times the tool has been called.
-   `success_count` - Number of successful tool calls.
-   `error_count` - Number of failed tool calls.
-   `total_time` - Total execution time across all calls in seconds.

#### add\_call

```python
def add_call(tool: ToolUse,
             duration: float,
             success: bool,
             metrics_client: "MetricsClient",
             attributes: dict[str, Any] | None = None) -> None
```

Defined in: [src/strands/telemetry/metrics.py:125](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L125)

Record a new tool call with its outcome.

**Arguments**:

-   `tool` - The tool that was called.
-   `duration` - How long the call took in seconds.
-   `success` - Whether the call was successful.
-   `metrics_client` - The metrics client for recording the metrics.
-   `attributes` - attributes of the metrics.

## EventLoopCycleMetric

```python
@dataclass
class EventLoopCycleMetric()
```

Defined in: [src/strands/telemetry/metrics.py:156](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L156)

Aggregated metrics for a single event loop cycle.

**Attributes**:

-   `event_loop_cycle_id` - Current eventLoop cycle id.
-   `usage` - Total token usage for the entire cycle (succeeded model invocation, excluding tool invocations).

## AgentInvocation

```python
@dataclass
class AgentInvocation()
```

Defined in: [src/strands/telemetry/metrics.py:169](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L169)

Metrics for a single agent invocation.

AgentInvocation contains all the event loop cycles and accumulated token usage for that invocation.

**Attributes**:

-   `cycles` - List of event loop cycles that occurred during this invocation.
-   `usage` - Accumulated token usage for this invocation across all cycles.

## EventLoopMetrics

```python
@dataclass
class EventLoopMetrics()
```

Defined in: [src/strands/telemetry/metrics.py:184](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L184)

Aggregated metrics for an event loop’s execution.

**Attributes**:

-   `cycle_count` - Number of event loop cycles executed.
-   `tool_metrics` - Metrics for each tool used, keyed by tool name.
-   `cycle_durations` - List of durations for each cycle in seconds.
-   `agent_invocations` - Agent invocation metrics containing cycles and usage data.
-   `traces` - List of execution traces.
-   `accumulated_usage` - Accumulated token usage across all model invocations (across all requests).
-   `accumulated_metrics` - Accumulated performance metrics across all model invocations.

#### latest\_context\_size

```python
@property
def latest_context_size() -> int | None
```

Defined in: [src/strands/telemetry/metrics.py:206](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L206)

Most recent context size from the last LLM call.

This represents the current context size as reported by the model.

**Returns**:

The input token count from the most recent cycle, or None if no data is available.

#### latest\_agent\_invocation

```python
@property
def latest_agent_invocation() -> AgentInvocation | None
```

Defined in: [src/strands/telemetry/metrics.py:224](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L224)

Get the most recent agent invocation.

**Returns**:

The most recent AgentInvocation, or None if no invocations exist.

#### start\_cycle

```python
def start_cycle(attributes: dict[str, Any]) -> tuple[float, Trace]
```

Defined in: [src/strands/telemetry/metrics.py:232](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L232)

Start a new event loop cycle and create a trace for it.

**Arguments**:

-   `attributes` - attributes of the metrics, including event\_loop\_cycle\_id.

**Returns**:

A tuple containing the start time and the cycle trace object.

#### end\_cycle

```python
def end_cycle(start_time: float,
              cycle_trace: Trace,
              attributes: dict[str, Any] | None = None) -> None
```

Defined in: [src/strands/telemetry/metrics.py:260](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L260)

End the current event loop cycle and record its duration.

**Arguments**:

-   `start_time` - The timestamp when the cycle started.
-   `cycle_trace` - The trace object for this cycle.
-   `attributes` - attributes of the metrics.

#### add\_tool\_usage

```python
def add_tool_usage(tool: ToolUse, duration: float, tool_trace: Trace,
                   success: bool, message: Message) -> None
```

Defined in: [src/strands/telemetry/metrics.py:275](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L275)

Record metrics for a tool invocation.

**Arguments**:

-   `tool` - The tool that was used.
-   `duration` - How long the tool call took in seconds.
-   `tool_trace` - The trace object for this tool call.
-   `success` - Whether the tool call was successful.
-   `message` - The message associated with the tool call.

#### update\_usage

```python
def update_usage(usage: Usage) -> None
```

Defined in: [src/strands/telemetry/metrics.py:333](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L333)

Update the accumulated token usage with new usage data.

**Arguments**:

-   `usage` - The usage data to add to the accumulated totals.

#### reset\_usage\_metrics

```python
def reset_usage_metrics() -> None
```

Defined in: [src/strands/telemetry/metrics.py:356](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L356)

Start a new agent invocation by creating a new AgentInvocation.

This should be called at the start of a new request to begin tracking a new agent invocation with fresh usage and cycle data.

#### update\_metrics

```python
def update_metrics(metrics: Metrics) -> None
```

Defined in: [src/strands/telemetry/metrics.py:364](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L364)

Update the accumulated performance metrics with new metrics data.

**Arguments**:

-   `metrics` - The metrics data to add to the accumulated totals.

#### get\_summary

```python
def get_summary() -> dict[str, Any]
```

Defined in: [src/strands/telemetry/metrics.py:375](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L375)

Generate a comprehensive summary of all collected metrics.

**Returns**:

A dictionary containing summarized metrics data. This includes cycle statistics, tool usage, traces, and accumulated usage information.

#### metrics\_to\_string

```python
def metrics_to_string(event_loop_metrics: EventLoopMetrics,
                      allowed_names: set[str] | None = None) -> str
```

Defined in: [src/strands/telemetry/metrics.py:514](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L514)

Convert event loop metrics to a human-readable string representation.

**Arguments**:

-   `event_loop_metrics` - The metrics to format.
-   `allowed_names` - Set of names that are allowed to be displayed unmodified.

**Returns**:

A formatted string representation of the metrics.

## MetricsClient

```python
class MetricsClient()
```

Defined in: [src/strands/telemetry/metrics.py:527](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L527)

Singleton client for managing OpenTelemetry metrics instruments.

The actual metrics export destination (console, OTLP endpoint, etc.) is configured through OpenTelemetry SDK configuration by users, not by this client.

#### \_\_new\_\_

```python
def __new__(cls) -> "MetricsClient"
```

Defined in: [src/strands/telemetry/metrics.py:551](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L551)

Create or return the singleton instance of MetricsClient.

**Returns**:

The single MetricsClient instance.

#### \_\_init\_\_

```python
def __init__() -> None
```

Defined in: [src/strands/telemetry/metrics.py:561](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L561)

Initialize the MetricsClient.

This method only runs once due to the singleton pattern. Sets up the OpenTelemetry meter and creates metric instruments.

#### create\_instruments

```python
def create_instruments() -> None
```

Defined in: [src/strands/telemetry/metrics.py:575](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/metrics.py#L575)

Create and initialize all OpenTelemetry metric instruments.