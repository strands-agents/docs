# `strands.telemetry`

Telemetry module.

This module provides metrics and tracing functionality.

## `strands.telemetry.metrics`

Utilities for collecting and reporting performance metrics in the SDK.

### `EventLoopMetrics`

Aggregated metrics for an event loop's execution.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `cycle_count` | `int` | Number of event loop cycles executed. | | `tool_metrics` | `Dict[str, ToolMetrics]` | Metrics for each tool used, keyed by tool name. | | `cycle_durations` | `List[float]` | List of durations for each cycle in seconds. | | `traces` | `List[Trace]` | List of execution traces. | | `accumulated_usage` | `Usage` | Accumulated token usage across all model invocations. | | `accumulated_metrics` | `Metrics` | Accumulated performance metrics across all model invocations. |

Source code in `strands/telemetry/metrics.py`

```
@dataclass
class EventLoopMetrics:
    """Aggregated metrics for an event loop's execution.

    Attributes:
        cycle_count: Number of event loop cycles executed.
        tool_metrics: Metrics for each tool used, keyed by tool name.
        cycle_durations: List of durations for each cycle in seconds.
        traces: List of execution traces.
        accumulated_usage: Accumulated token usage across all model invocations.
        accumulated_metrics: Accumulated performance metrics across all model invocations.
    """

    cycle_count: int = 0
    tool_metrics: Dict[str, ToolMetrics] = field(default_factory=dict)
    cycle_durations: List[float] = field(default_factory=list)
    traces: List[Trace] = field(default_factory=list)
    accumulated_usage: Usage = field(default_factory=lambda: Usage(inputTokens=0, outputTokens=0, totalTokens=0))
    accumulated_metrics: Metrics = field(default_factory=lambda: Metrics(latencyMs=0))

    def start_cycle(self) -> Tuple[float, Trace]:
        """Start a new event loop cycle and create a trace for it.

        Returns:
            A tuple containing the start time and the cycle trace object.
        """
        self.cycle_count += 1
        start_time = time.time()
        cycle_trace = Trace(f"Cycle {self.cycle_count}", start_time=start_time)
        self.traces.append(cycle_trace)
        return start_time, cycle_trace

    def end_cycle(self, start_time: float, cycle_trace: Trace) -> None:
        """End the current event loop cycle and record its duration.

        Args:
            start_time: The timestamp when the cycle started.
            cycle_trace: The trace object for this cycle.
        """
        end_time = time.time()
        duration = end_time - start_time
        self.cycle_durations.append(duration)
        cycle_trace.end(end_time)

    def add_tool_usage(
        self, tool: ToolUse, duration: float, tool_trace: Trace, success: bool, message: Message
    ) -> None:
        """Record metrics for a tool invocation.

        Args:
            tool: The tool that was used.
            duration: How long the tool call took in seconds.
            tool_trace: The trace object for this tool call.
            success: Whether the tool call was successful.
            message: The message associated with the tool call.
        """
        tool_name = tool.get("name", "unknown_tool")
        tool_use_id = tool.get("toolUseId", "unknown")

        tool_trace.metadata.update(
            {
                "toolUseId": tool_use_id,
                "tool_name": tool_name,
            }
        )
        tool_trace.raw_name = f"{tool_name} - {tool_use_id}"
        tool_trace.add_message(message)

        self.tool_metrics.setdefault(tool_name, ToolMetrics(tool)).add_call(tool, duration, success)

        tool_trace.end()

    def update_usage(self, usage: Usage) -> None:
        """Update the accumulated token usage with new usage data.

        Args:
            usage: The usage data to add to the accumulated totals.
        """
        self.accumulated_usage["inputTokens"] += usage["inputTokens"]
        self.accumulated_usage["outputTokens"] += usage["outputTokens"]
        self.accumulated_usage["totalTokens"] += usage["totalTokens"]

    def update_metrics(self, metrics: Metrics) -> None:
        """Update the accumulated performance metrics with new metrics data.

        Args:
            metrics: The metrics data to add to the accumulated totals.
        """
        self.accumulated_metrics["latencyMs"] += metrics["latencyMs"]

    def get_summary(self) -> Dict[str, Any]:
        """Generate a comprehensive summary of all collected metrics.

        Returns:
            A dictionary containing summarized metrics data.
            This includes cycle statistics, tool usage, traces, and accumulated usage information.
        """
        summary = {
            "total_cycles": self.cycle_count,
            "total_duration": sum(self.cycle_durations),
            "average_cycle_time": (sum(self.cycle_durations) / self.cycle_count if self.cycle_count > 0 else 0),
            "tool_usage": {
                tool_name: {
                    "tool_info": {
                        "tool_use_id": metrics.tool.get("toolUseId", "N/A"),
                        "name": metrics.tool.get("name", "unknown"),
                        "input_params": metrics.tool.get("input", {}),
                    },
                    "execution_stats": {
                        "call_count": metrics.call_count,
                        "success_count": metrics.success_count,
                        "error_count": metrics.error_count,
                        "total_time": metrics.total_time,
                        "average_time": (metrics.total_time / metrics.call_count if metrics.call_count > 0 else 0),
                        "success_rate": (metrics.success_count / metrics.call_count if metrics.call_count > 0 else 0),
                    },
                }
                for tool_name, metrics in self.tool_metrics.items()
            },
            "traces": [trace.to_dict() for trace in self.traces],
            "accumulated_usage": self.accumulated_usage,
            "accumulated_metrics": self.accumulated_metrics,
        }
        return summary

```

#### `add_tool_usage(tool, duration, tool_trace, success, message)`

Record metrics for a tool invocation.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool` | `ToolUse` | The tool that was used. | *required* | | `duration` | `float` | How long the tool call took in seconds. | *required* | | `tool_trace` | `Trace` | The trace object for this tool call. | *required* | | `success` | `bool` | Whether the tool call was successful. | *required* | | `message` | `Message` | The message associated with the tool call. | *required* |

Source code in `strands/telemetry/metrics.py`

```
def add_tool_usage(
    self, tool: ToolUse, duration: float, tool_trace: Trace, success: bool, message: Message
) -> None:
    """Record metrics for a tool invocation.

    Args:
        tool: The tool that was used.
        duration: How long the tool call took in seconds.
        tool_trace: The trace object for this tool call.
        success: Whether the tool call was successful.
        message: The message associated with the tool call.
    """
    tool_name = tool.get("name", "unknown_tool")
    tool_use_id = tool.get("toolUseId", "unknown")

    tool_trace.metadata.update(
        {
            "toolUseId": tool_use_id,
            "tool_name": tool_name,
        }
    )
    tool_trace.raw_name = f"{tool_name} - {tool_use_id}"
    tool_trace.add_message(message)

    self.tool_metrics.setdefault(tool_name, ToolMetrics(tool)).add_call(tool, duration, success)

    tool_trace.end()

```

#### `end_cycle(start_time, cycle_trace)`

End the current event loop cycle and record its duration.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `start_time` | `float` | The timestamp when the cycle started. | *required* | | `cycle_trace` | `Trace` | The trace object for this cycle. | *required* |

Source code in `strands/telemetry/metrics.py`

```
def end_cycle(self, start_time: float, cycle_trace: Trace) -> None:
    """End the current event loop cycle and record its duration.

    Args:
        start_time: The timestamp when the cycle started.
        cycle_trace: The trace object for this cycle.
    """
    end_time = time.time()
    duration = end_time - start_time
    self.cycle_durations.append(duration)
    cycle_trace.end(end_time)

```

#### `get_summary()`

Generate a comprehensive summary of all collected metrics.

Returns:

| Type | Description | | --- | --- | | `Dict[str, Any]` | A dictionary containing summarized metrics data. | | `Dict[str, Any]` | This includes cycle statistics, tool usage, traces, and accumulated usage information. |

Source code in `strands/telemetry/metrics.py`

```
def get_summary(self) -> Dict[str, Any]:
    """Generate a comprehensive summary of all collected metrics.

    Returns:
        A dictionary containing summarized metrics data.
        This includes cycle statistics, tool usage, traces, and accumulated usage information.
    """
    summary = {
        "total_cycles": self.cycle_count,
        "total_duration": sum(self.cycle_durations),
        "average_cycle_time": (sum(self.cycle_durations) / self.cycle_count if self.cycle_count > 0 else 0),
        "tool_usage": {
            tool_name: {
                "tool_info": {
                    "tool_use_id": metrics.tool.get("toolUseId", "N/A"),
                    "name": metrics.tool.get("name", "unknown"),
                    "input_params": metrics.tool.get("input", {}),
                },
                "execution_stats": {
                    "call_count": metrics.call_count,
                    "success_count": metrics.success_count,
                    "error_count": metrics.error_count,
                    "total_time": metrics.total_time,
                    "average_time": (metrics.total_time / metrics.call_count if metrics.call_count > 0 else 0),
                    "success_rate": (metrics.success_count / metrics.call_count if metrics.call_count > 0 else 0),
                },
            }
            for tool_name, metrics in self.tool_metrics.items()
        },
        "traces": [trace.to_dict() for trace in self.traces],
        "accumulated_usage": self.accumulated_usage,
        "accumulated_metrics": self.accumulated_metrics,
    }
    return summary

```

#### `start_cycle()`

Start a new event loop cycle and create a trace for it.

Returns:

| Type | Description | | --- | --- | | `Tuple[float, Trace]` | A tuple containing the start time and the cycle trace object. |

Source code in `strands/telemetry/metrics.py`

```
def start_cycle(self) -> Tuple[float, Trace]:
    """Start a new event loop cycle and create a trace for it.

    Returns:
        A tuple containing the start time and the cycle trace object.
    """
    self.cycle_count += 1
    start_time = time.time()
    cycle_trace = Trace(f"Cycle {self.cycle_count}", start_time=start_time)
    self.traces.append(cycle_trace)
    return start_time, cycle_trace

```

#### `update_metrics(metrics)`

Update the accumulated performance metrics with new metrics data.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `metrics` | `Metrics` | The metrics data to add to the accumulated totals. | *required* |

Source code in `strands/telemetry/metrics.py`

```
def update_metrics(self, metrics: Metrics) -> None:
    """Update the accumulated performance metrics with new metrics data.

    Args:
        metrics: The metrics data to add to the accumulated totals.
    """
    self.accumulated_metrics["latencyMs"] += metrics["latencyMs"]

```

#### `update_usage(usage)`

Update the accumulated token usage with new usage data.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `usage` | `Usage` | The usage data to add to the accumulated totals. | *required* |

Source code in `strands/telemetry/metrics.py`

```
def update_usage(self, usage: Usage) -> None:
    """Update the accumulated token usage with new usage data.

    Args:
        usage: The usage data to add to the accumulated totals.
    """
    self.accumulated_usage["inputTokens"] += usage["inputTokens"]
    self.accumulated_usage["outputTokens"] += usage["outputTokens"]
    self.accumulated_usage["totalTokens"] += usage["totalTokens"]

```

### `ToolMetrics`

Metrics for a specific tool's usage.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `tool` | `ToolUse` | The tool being tracked. | | `call_count` | `int` | Number of times the tool has been called. | | `success_count` | `int` | Number of successful tool calls. | | `error_count` | `int` | Number of failed tool calls. | | `total_time` | `float` | Total execution time across all calls in seconds. |

Source code in `strands/telemetry/metrics.py`

```
@dataclass
class ToolMetrics:
    """Metrics for a specific tool's usage.

    Attributes:
        tool: The tool being tracked.
        call_count: Number of times the tool has been called.
        success_count: Number of successful tool calls.
        error_count: Number of failed tool calls.
        total_time: Total execution time across all calls in seconds.
    """

    tool: ToolUse
    call_count: int = 0
    success_count: int = 0
    error_count: int = 0
    total_time: float = 0.0

    def add_call(self, tool: ToolUse, duration: float, success: bool) -> None:
        """Record a new tool call with its outcome.

        Args:
            tool: The tool that was called.
            duration: How long the call took in seconds.
            success: Whether the call was successful.
        """
        self.tool = tool  # Update with latest tool state
        self.call_count += 1
        self.total_time += duration

        if success:
            self.success_count += 1
        else:
            self.error_count += 1

```

#### `add_call(tool, duration, success)`

Record a new tool call with its outcome.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool` | `ToolUse` | The tool that was called. | *required* | | `duration` | `float` | How long the call took in seconds. | *required* | | `success` | `bool` | Whether the call was successful. | *required* |

Source code in `strands/telemetry/metrics.py`

```
def add_call(self, tool: ToolUse, duration: float, success: bool) -> None:
    """Record a new tool call with its outcome.

    Args:
        tool: The tool that was called.
        duration: How long the call took in seconds.
        success: Whether the call was successful.
    """
    self.tool = tool  # Update with latest tool state
    self.call_count += 1
    self.total_time += duration

    if success:
        self.success_count += 1
    else:
        self.error_count += 1

```

### `Trace`

A trace representing a single operation or step in the execution flow.

Source code in `strands/telemetry/metrics.py`

```
class Trace:
    """A trace representing a single operation or step in the execution flow."""

    def __init__(
        self,
        name: str,
        parent_id: Optional[str] = None,
        start_time: Optional[float] = None,
        raw_name: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        message: Optional[Message] = None,
    ) -> None:
        """Initialize a new trace.

        Args:
            name: Human-readable name of the operation being traced.
            parent_id: ID of the parent trace, if this is a child operation.
            start_time: Timestamp when the trace started.
                If not provided, the current time will be used.
            raw_name: System level name.
            metadata: Additional contextual information about the trace.
            message: Message associated with the trace.
        """
        self.id: str = str(uuid.uuid4())
        self.name: str = name
        self.raw_name: Optional[str] = raw_name
        self.parent_id: Optional[str] = parent_id
        self.start_time: float = start_time if start_time is not None else time.time()
        self.end_time: Optional[float] = None
        self.children: List["Trace"] = []
        self.metadata: Dict[str, Any] = metadata or {}
        self.message: Optional[Message] = message

    def end(self, end_time: Optional[float] = None) -> None:
        """Mark the trace as complete with the given or current timestamp.

        Args:
            end_time: Timestamp to use as the end time.
                If not provided, the current time will be used.
        """
        self.end_time = end_time if end_time is not None else time.time()

    def add_child(self, child: "Trace") -> None:
        """Add a child trace to this trace.

        Args:
            child: The child trace to add.
        """
        self.children.append(child)

    def duration(self) -> Optional[float]:
        """Calculate the duration of this trace.

        Returns:
            The duration in seconds, or None if the trace hasn't ended yet.
        """
        return None if self.end_time is None else self.end_time - self.start_time

    def add_message(self, message: Message) -> None:
        """Add a message to the trace.

        Args:
            message: The message to add.
        """
        self.message = message

    def to_dict(self) -> Dict[str, Any]:
        """Convert the trace to a dictionary representation.

        Returns:
            A dictionary containing all trace information, suitable for serialization.
        """
        return {
            "id": self.id,
            "name": self.name,
            "raw_name": self.raw_name,
            "parent_id": self.parent_id,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "duration": self.duration(),
            "children": [child.to_dict() for child in self.children],
            "metadata": self.metadata,
            "message": self.message,
        }

```

#### `__init__(name, parent_id=None, start_time=None, raw_name=None, metadata=None, message=None)`

Initialize a new trace.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `name` | `str` | Human-readable name of the operation being traced. | *required* | | `parent_id` | `Optional[str]` | ID of the parent trace, if this is a child operation. | `None` | | `start_time` | `Optional[float]` | Timestamp when the trace started. If not provided, the current time will be used. | `None` | | `raw_name` | `Optional[str]` | System level name. | `None` | | `metadata` | `Optional[Dict[str, Any]]` | Additional contextual information about the trace. | `None` | | `message` | `Optional[Message]` | Message associated with the trace. | `None` |

Source code in `strands/telemetry/metrics.py`

```
def __init__(
    self,
    name: str,
    parent_id: Optional[str] = None,
    start_time: Optional[float] = None,
    raw_name: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
    message: Optional[Message] = None,
) -> None:
    """Initialize a new trace.

    Args:
        name: Human-readable name of the operation being traced.
        parent_id: ID of the parent trace, if this is a child operation.
        start_time: Timestamp when the trace started.
            If not provided, the current time will be used.
        raw_name: System level name.
        metadata: Additional contextual information about the trace.
        message: Message associated with the trace.
    """
    self.id: str = str(uuid.uuid4())
    self.name: str = name
    self.raw_name: Optional[str] = raw_name
    self.parent_id: Optional[str] = parent_id
    self.start_time: float = start_time if start_time is not None else time.time()
    self.end_time: Optional[float] = None
    self.children: List["Trace"] = []
    self.metadata: Dict[str, Any] = metadata or {}
    self.message: Optional[Message] = message

```

#### `add_child(child)`

Add a child trace to this trace.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `child` | `Trace` | The child trace to add. | *required* |

Source code in `strands/telemetry/metrics.py`

```
def add_child(self, child: "Trace") -> None:
    """Add a child trace to this trace.

    Args:
        child: The child trace to add.
    """
    self.children.append(child)

```

#### `add_message(message)`

Add a message to the trace.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `message` | `Message` | The message to add. | *required* |

Source code in `strands/telemetry/metrics.py`

```
def add_message(self, message: Message) -> None:
    """Add a message to the trace.

    Args:
        message: The message to add.
    """
    self.message = message

```

#### `duration()`

Calculate the duration of this trace.

Returns:

| Type | Description | | --- | --- | | `Optional[float]` | The duration in seconds, or None if the trace hasn't ended yet. |

Source code in `strands/telemetry/metrics.py`

```
def duration(self) -> Optional[float]:
    """Calculate the duration of this trace.

    Returns:
        The duration in seconds, or None if the trace hasn't ended yet.
    """
    return None if self.end_time is None else self.end_time - self.start_time

```

#### `end(end_time=None)`

Mark the trace as complete with the given or current timestamp.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `end_time` | `Optional[float]` | Timestamp to use as the end time. If not provided, the current time will be used. | `None` |

Source code in `strands/telemetry/metrics.py`

```
def end(self, end_time: Optional[float] = None) -> None:
    """Mark the trace as complete with the given or current timestamp.

    Args:
        end_time: Timestamp to use as the end time.
            If not provided, the current time will be used.
    """
    self.end_time = end_time if end_time is not None else time.time()

```

#### `to_dict()`

Convert the trace to a dictionary representation.

Returns:

| Type | Description | | --- | --- | | `Dict[str, Any]` | A dictionary containing all trace information, suitable for serialization. |

Source code in `strands/telemetry/metrics.py`

```
def to_dict(self) -> Dict[str, Any]:
    """Convert the trace to a dictionary representation.

    Returns:
        A dictionary containing all trace information, suitable for serialization.
    """
    return {
        "id": self.id,
        "name": self.name,
        "raw_name": self.raw_name,
        "parent_id": self.parent_id,
        "start_time": self.start_time,
        "end_time": self.end_time,
        "duration": self.duration(),
        "children": [child.to_dict() for child in self.children],
        "metadata": self.metadata,
        "message": self.message,
    }

```

### `metrics_to_string(event_loop_metrics, allowed_names=None)`

Convert event loop metrics to a human-readable string representation.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event_loop_metrics` | `EventLoopMetrics` | The metrics to format. | *required* | | `allowed_names` | `Optional[Set[str]]` | Set of names that are allowed to be displayed unmodified. | `None` |

Returns:

| Type | Description | | --- | --- | | `str` | A formatted string representation of the metrics. |

Source code in `strands/telemetry/metrics.py`

```
def metrics_to_string(event_loop_metrics: EventLoopMetrics, allowed_names: Optional[Set[str]] = None) -> str:
    """Convert event loop metrics to a human-readable string representation.

    Args:
        event_loop_metrics: The metrics to format.
        allowed_names: Set of names that are allowed to be displayed unmodified.

    Returns:
        A formatted string representation of the metrics.
    """
    return "\n".join(_metrics_summary_to_lines(event_loop_metrics, allowed_names or set()))

```
