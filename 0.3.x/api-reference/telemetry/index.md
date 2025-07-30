# `strands.telemetry`

Telemetry module.

This module provides metrics and tracing functionality.

## `strands.telemetry.config`

OpenTelemetry configuration and setup utilities for Strands agents.

This module provides centralized configuration and initialization functionality for OpenTelemetry components and other telemetry infrastructure shared across Strands applications.

### `StrandsTelemetry`

OpenTelemetry configuration and setup for Strands applications.

Automatically initializes a tracer provider with text map propagators. Trace exporters (console, OTLP) can be set up individually using dedicated methods that support method chaining for convenient configuration.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tracer_provider` | `TracerProvider | None` | Optional pre-configured SDKTracerProvider. If None, a new one will be created and set as the global tracer provider. | `None` |

Environment Variables

Environment variables are handled by the underlying OpenTelemetry SDK:

- OTEL_EXPORTER_OTLP_ENDPOINT: OTLP endpoint URL
- OTEL_EXPORTER_OTLP_HEADERS: Headers for OTLP requests

Examples:

Quick setup with method chaining:

```
>>> StrandsTelemetry().setup_console_exporter().setup_otlp_exporter()

```

Using a custom tracer provider:

```
>>> StrandsTelemetry(tracer_provider=my_provider).setup_console_exporter()

```

Step-by-step configuration:

```
>>> telemetry = StrandsTelemetry()
>>> telemetry.setup_console_exporter()
>>> telemetry.setup_otlp_exporter()

```

To setup global meter provider

```
>>> telemetry.setup_meter(enable_console_exporter=True, enable_otlp_exporter=True) # default are False

```

Note

- The tracer provider is automatically initialized upon instantiation
- When no tracer_provider is provided, the instance sets itself as the global provider
- Exporters must be explicitly configured using the setup methods
- Failed exporter configurations are logged but do not raise exceptions
- All setup methods return self to enable method chaining

Source code in `strands/telemetry/config.py`

```
class StrandsTelemetry:
    """OpenTelemetry configuration and setup for Strands applications.

    Automatically initializes a tracer provider with text map propagators.
    Trace exporters (console, OTLP) can be set up individually using dedicated methods
    that support method chaining for convenient configuration.

    Args:
        tracer_provider: Optional pre-configured SDKTracerProvider. If None,
            a new one will be created and set as the global tracer provider.

    Environment Variables:
        Environment variables are handled by the underlying OpenTelemetry SDK:
        - OTEL_EXPORTER_OTLP_ENDPOINT: OTLP endpoint URL
        - OTEL_EXPORTER_OTLP_HEADERS: Headers for OTLP requests

    Examples:
        Quick setup with method chaining:
        >>> StrandsTelemetry().setup_console_exporter().setup_otlp_exporter()

        Using a custom tracer provider:
        >>> StrandsTelemetry(tracer_provider=my_provider).setup_console_exporter()

        Step-by-step configuration:
        >>> telemetry = StrandsTelemetry()
        >>> telemetry.setup_console_exporter()
        >>> telemetry.setup_otlp_exporter()

        To setup global meter provider
        >>> telemetry.setup_meter(enable_console_exporter=True, enable_otlp_exporter=True) # default are False

    Note:
        - The tracer provider is automatically initialized upon instantiation
        - When no tracer_provider is provided, the instance sets itself as the global provider
        - Exporters must be explicitly configured using the setup methods
        - Failed exporter configurations are logged but do not raise exceptions
        - All setup methods return self to enable method chaining
    """

    def __init__(
        self,
        tracer_provider: SDKTracerProvider | None = None,
    ) -> None:
        """Initialize the StrandsTelemetry instance.

        Args:
            tracer_provider: Optional pre-configured tracer provider.
                If None, a new one will be created and set as global.

        The instance is ready to use immediately after initialization, though
        trace exporters must be configured separately using the setup methods.
        """
        self.resource = get_otel_resource()
        if tracer_provider:
            self.tracer_provider = tracer_provider
        else:
            self._initialize_tracer()

    def _initialize_tracer(self) -> None:
        """Initialize the OpenTelemetry tracer."""
        logger.info("Initializing tracer")

        # Create tracer provider
        self.tracer_provider = SDKTracerProvider(resource=self.resource)

        # Set as global tracer provider
        trace_api.set_tracer_provider(self.tracer_provider)

        # Set up propagators
        propagate.set_global_textmap(
            CompositePropagator(
                [
                    W3CBaggagePropagator(),
                    TraceContextTextMapPropagator(),
                ]
            )
        )

    def setup_console_exporter(self, **kwargs: Any) -> "StrandsTelemetry":
        """Set up console exporter for the tracer provider.

        Args:
            **kwargs: Optional keyword arguments passed directly to
                OpenTelemetry's ConsoleSpanExporter initializer.

        Returns:
            self: Enables method chaining.

        This method configures a SimpleSpanProcessor with a ConsoleSpanExporter,
        allowing trace data to be output to the console. Any additional keyword
        arguments provided will be forwarded to the ConsoleSpanExporter.
        """
        try:
            logger.info("Enabling console export")
            console_processor = SimpleSpanProcessor(ConsoleSpanExporter(**kwargs))
            self.tracer_provider.add_span_processor(console_processor)
        except Exception as e:
            logger.exception("error=<%s> | Failed to configure console exporter", e)
        return self

    def setup_otlp_exporter(self, **kwargs: Any) -> "StrandsTelemetry":
        """Set up OTLP exporter for the tracer provider.

        Args:
            **kwargs: Optional keyword arguments passed directly to
                OpenTelemetry's OTLPSpanExporter initializer.

        Returns:
            self: Enables method chaining.

        This method configures a BatchSpanProcessor with an OTLPSpanExporter,
        allowing trace data to be exported to an OTLP endpoint. Any additional
        keyword arguments provided will be forwarded to the OTLPSpanExporter.
        """
        from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

        try:
            otlp_exporter = OTLPSpanExporter(**kwargs)
            batch_processor = BatchSpanProcessor(otlp_exporter)
            self.tracer_provider.add_span_processor(batch_processor)
            logger.info("OTLP exporter configured")
        except Exception as e:
            logger.exception("error=<%s> | Failed to configure OTLP exporter", e)
        return self

    def setup_meter(
        self, enable_console_exporter: bool = False, enable_otlp_exporter: bool = False
    ) -> "StrandsTelemetry":
        """Initialize the OpenTelemetry Meter."""
        logger.info("Initializing meter")
        metrics_readers = []
        try:
            if enable_console_exporter:
                logger.info("Enabling console metrics exporter")
                console_reader = PeriodicExportingMetricReader(ConsoleMetricExporter())
                metrics_readers.append(console_reader)
            if enable_otlp_exporter:
                logger.info("Enabling OTLP metrics exporter")
                from opentelemetry.exporter.otlp.proto.http.metric_exporter import OTLPMetricExporter

                otlp_reader = PeriodicExportingMetricReader(OTLPMetricExporter())
                metrics_readers.append(otlp_reader)
        except Exception as e:
            logger.exception("error=<%s> | Failed to configure OTLP metrics exporter", e)

        self.meter_provider = metrics_sdk.MeterProvider(resource=self.resource, metric_readers=metrics_readers)

        # Set as global tracer provider
        metrics_api.set_meter_provider(self.meter_provider)
        logger.info("Strands Meter configured")
        return self

```

#### `__init__(tracer_provider=None)`

Initialize the StrandsTelemetry instance.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tracer_provider` | `TracerProvider | None` | Optional pre-configured tracer provider. If None, a new one will be created and set as global. | `None` |

The instance is ready to use immediately after initialization, though trace exporters must be configured separately using the setup methods.

Source code in `strands/telemetry/config.py`

```
def __init__(
    self,
    tracer_provider: SDKTracerProvider | None = None,
) -> None:
    """Initialize the StrandsTelemetry instance.

    Args:
        tracer_provider: Optional pre-configured tracer provider.
            If None, a new one will be created and set as global.

    The instance is ready to use immediately after initialization, though
    trace exporters must be configured separately using the setup methods.
    """
    self.resource = get_otel_resource()
    if tracer_provider:
        self.tracer_provider = tracer_provider
    else:
        self._initialize_tracer()

```

#### `setup_console_exporter(**kwargs)`

Set up console exporter for the tracer provider.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `**kwargs` | `Any` | Optional keyword arguments passed directly to OpenTelemetry's ConsoleSpanExporter initializer. | `{}` |

Returns:

| Name | Type | Description | | --- | --- | --- | | `self` | `StrandsTelemetry` | Enables method chaining. |

This method configures a SimpleSpanProcessor with a ConsoleSpanExporter, allowing trace data to be output to the console. Any additional keyword arguments provided will be forwarded to the ConsoleSpanExporter.

Source code in `strands/telemetry/config.py`

```
def setup_console_exporter(self, **kwargs: Any) -> "StrandsTelemetry":
    """Set up console exporter for the tracer provider.

    Args:
        **kwargs: Optional keyword arguments passed directly to
            OpenTelemetry's ConsoleSpanExporter initializer.

    Returns:
        self: Enables method chaining.

    This method configures a SimpleSpanProcessor with a ConsoleSpanExporter,
    allowing trace data to be output to the console. Any additional keyword
    arguments provided will be forwarded to the ConsoleSpanExporter.
    """
    try:
        logger.info("Enabling console export")
        console_processor = SimpleSpanProcessor(ConsoleSpanExporter(**kwargs))
        self.tracer_provider.add_span_processor(console_processor)
    except Exception as e:
        logger.exception("error=<%s> | Failed to configure console exporter", e)
    return self

```

#### `setup_meter(enable_console_exporter=False, enable_otlp_exporter=False)`

Initialize the OpenTelemetry Meter.

Source code in `strands/telemetry/config.py`

```
def setup_meter(
    self, enable_console_exporter: bool = False, enable_otlp_exporter: bool = False
) -> "StrandsTelemetry":
    """Initialize the OpenTelemetry Meter."""
    logger.info("Initializing meter")
    metrics_readers = []
    try:
        if enable_console_exporter:
            logger.info("Enabling console metrics exporter")
            console_reader = PeriodicExportingMetricReader(ConsoleMetricExporter())
            metrics_readers.append(console_reader)
        if enable_otlp_exporter:
            logger.info("Enabling OTLP metrics exporter")
            from opentelemetry.exporter.otlp.proto.http.metric_exporter import OTLPMetricExporter

            otlp_reader = PeriodicExportingMetricReader(OTLPMetricExporter())
            metrics_readers.append(otlp_reader)
    except Exception as e:
        logger.exception("error=<%s> | Failed to configure OTLP metrics exporter", e)

    self.meter_provider = metrics_sdk.MeterProvider(resource=self.resource, metric_readers=metrics_readers)

    # Set as global tracer provider
    metrics_api.set_meter_provider(self.meter_provider)
    logger.info("Strands Meter configured")
    return self

```

#### `setup_otlp_exporter(**kwargs)`

Set up OTLP exporter for the tracer provider.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `**kwargs` | `Any` | Optional keyword arguments passed directly to OpenTelemetry's OTLPSpanExporter initializer. | `{}` |

Returns:

| Name | Type | Description | | --- | --- | --- | | `self` | `StrandsTelemetry` | Enables method chaining. |

This method configures a BatchSpanProcessor with an OTLPSpanExporter, allowing trace data to be exported to an OTLP endpoint. Any additional keyword arguments provided will be forwarded to the OTLPSpanExporter.

Source code in `strands/telemetry/config.py`

```
def setup_otlp_exporter(self, **kwargs: Any) -> "StrandsTelemetry":
    """Set up OTLP exporter for the tracer provider.

    Args:
        **kwargs: Optional keyword arguments passed directly to
            OpenTelemetry's OTLPSpanExporter initializer.

    Returns:
        self: Enables method chaining.

    This method configures a BatchSpanProcessor with an OTLPSpanExporter,
    allowing trace data to be exported to an OTLP endpoint. Any additional
    keyword arguments provided will be forwarded to the OTLPSpanExporter.
    """
    from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

    try:
        otlp_exporter = OTLPSpanExporter(**kwargs)
        batch_processor = BatchSpanProcessor(otlp_exporter)
        self.tracer_provider.add_span_processor(batch_processor)
        logger.info("OTLP exporter configured")
    except Exception as e:
        logger.exception("error=<%s> | Failed to configure OTLP exporter", e)
    return self

```

### `get_otel_resource()`

Create a standard OpenTelemetry resource with service information.

Returns:

| Type | Description | | --- | --- | | `Resource` | Resource object with standard service information. |

Source code in `strands/telemetry/config.py`

```
def get_otel_resource() -> Resource:
    """Create a standard OpenTelemetry resource with service information.

    Returns:
        Resource object with standard service information.
    """
    resource = Resource.create(
        {
            "service.name": "strands-agents",
            "service.version": version("strands-agents"),
            "telemetry.sdk.name": "opentelemetry",
            "telemetry.sdk.language": "python",
        }
    )

    return resource

```

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

    @property
    def _metrics_client(self) -> "MetricsClient":
        """Get the singleton MetricsClient instance."""
        return MetricsClient()

    def start_cycle(
        self,
        attributes: Optional[Dict[str, Any]] = None,
    ) -> Tuple[float, Trace]:
        """Start a new event loop cycle and create a trace for it.

        Args:
            attributes: attributes of the metrics.

        Returns:
            A tuple containing the start time and the cycle trace object.
        """
        self._metrics_client.event_loop_cycle_count.add(1, attributes=attributes)
        self._metrics_client.event_loop_start_cycle.add(1, attributes=attributes)
        self.cycle_count += 1
        start_time = time.time()
        cycle_trace = Trace(f"Cycle {self.cycle_count}", start_time=start_time)
        self.traces.append(cycle_trace)
        return start_time, cycle_trace

    def end_cycle(self, start_time: float, cycle_trace: Trace, attributes: Optional[Dict[str, Any]] = None) -> None:
        """End the current event loop cycle and record its duration.

        Args:
            start_time: The timestamp when the cycle started.
            cycle_trace: The trace object for this cycle.
            attributes: attributes of the metrics.
        """
        self._metrics_client.event_loop_end_cycle.add(1, attributes)
        end_time = time.time()
        duration = end_time - start_time
        self._metrics_client.event_loop_cycle_duration.record(duration, attributes)
        self.cycle_durations.append(duration)
        cycle_trace.end(end_time)

    def add_tool_usage(
        self,
        tool: ToolUse,
        duration: float,
        tool_trace: Trace,
        success: bool,
        message: Message,
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

        self.tool_metrics.setdefault(tool_name, ToolMetrics(tool)).add_call(
            tool,
            duration,
            success,
            self._metrics_client,
            attributes={
                "tool_name": tool_name,
                "tool_use_id": tool_use_id,
            },
        )
        tool_trace.end()

    def update_usage(self, usage: Usage) -> None:
        """Update the accumulated token usage with new usage data.

        Args:
            usage: The usage data to add to the accumulated totals.
        """
        self._metrics_client.event_loop_input_tokens.record(usage["inputTokens"])
        self._metrics_client.event_loop_output_tokens.record(usage["outputTokens"])
        self.accumulated_usage["inputTokens"] += usage["inputTokens"]
        self.accumulated_usage["outputTokens"] += usage["outputTokens"]
        self.accumulated_usage["totalTokens"] += usage["totalTokens"]

    def update_metrics(self, metrics: Metrics) -> None:
        """Update the accumulated performance metrics with new metrics data.

        Args:
            metrics: The metrics data to add to the accumulated totals.
        """
        self._metrics_client.event_loop_latency.record(metrics["latencyMs"])
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
    self,
    tool: ToolUse,
    duration: float,
    tool_trace: Trace,
    success: bool,
    message: Message,
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

    self.tool_metrics.setdefault(tool_name, ToolMetrics(tool)).add_call(
        tool,
        duration,
        success,
        self._metrics_client,
        attributes={
            "tool_name": tool_name,
            "tool_use_id": tool_use_id,
        },
    )
    tool_trace.end()

```

#### `end_cycle(start_time, cycle_trace, attributes=None)`

End the current event loop cycle and record its duration.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `start_time` | `float` | The timestamp when the cycle started. | *required* | | `cycle_trace` | `Trace` | The trace object for this cycle. | *required* | | `attributes` | `Optional[Dict[str, Any]]` | attributes of the metrics. | `None` |

Source code in `strands/telemetry/metrics.py`

```
def end_cycle(self, start_time: float, cycle_trace: Trace, attributes: Optional[Dict[str, Any]] = None) -> None:
    """End the current event loop cycle and record its duration.

    Args:
        start_time: The timestamp when the cycle started.
        cycle_trace: The trace object for this cycle.
        attributes: attributes of the metrics.
    """
    self._metrics_client.event_loop_end_cycle.add(1, attributes)
    end_time = time.time()
    duration = end_time - start_time
    self._metrics_client.event_loop_cycle_duration.record(duration, attributes)
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

#### `start_cycle(attributes=None)`

Start a new event loop cycle and create a trace for it.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `attributes` | `Optional[Dict[str, Any]]` | attributes of the metrics. | `None` |

Returns:

| Type | Description | | --- | --- | | `Tuple[float, Trace]` | A tuple containing the start time and the cycle trace object. |

Source code in `strands/telemetry/metrics.py`

```
def start_cycle(
    self,
    attributes: Optional[Dict[str, Any]] = None,
) -> Tuple[float, Trace]:
    """Start a new event loop cycle and create a trace for it.

    Args:
        attributes: attributes of the metrics.

    Returns:
        A tuple containing the start time and the cycle trace object.
    """
    self._metrics_client.event_loop_cycle_count.add(1, attributes=attributes)
    self._metrics_client.event_loop_start_cycle.add(1, attributes=attributes)
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
    self._metrics_client.event_loop_latency.record(metrics["latencyMs"])
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
    self._metrics_client.event_loop_input_tokens.record(usage["inputTokens"])
    self._metrics_client.event_loop_output_tokens.record(usage["outputTokens"])
    self.accumulated_usage["inputTokens"] += usage["inputTokens"]
    self.accumulated_usage["outputTokens"] += usage["outputTokens"]
    self.accumulated_usage["totalTokens"] += usage["totalTokens"]

```

### `MetricsClient`

Singleton client for managing OpenTelemetry metrics instruments.

The actual metrics export destination (console, OTLP endpoint, etc.) is configured through OpenTelemetry SDK configuration by users, not by this client.

Source code in `strands/telemetry/metrics.py`

```
class MetricsClient:
    """Singleton client for managing OpenTelemetry metrics instruments.

    The actual metrics export destination (console, OTLP endpoint, etc.) is configured
    through OpenTelemetry SDK configuration by users, not by this client.
    """

    _instance: Optional["MetricsClient"] = None
    meter: Meter
    event_loop_cycle_count: Counter
    event_loop_start_cycle: Counter
    event_loop_end_cycle: Counter
    event_loop_cycle_duration: Histogram
    event_loop_latency: Histogram
    event_loop_input_tokens: Histogram
    event_loop_output_tokens: Histogram

    tool_call_count: Counter
    tool_success_count: Counter
    tool_error_count: Counter
    tool_duration: Histogram

    def __new__(cls) -> "MetricsClient":
        """Create or return the singleton instance of MetricsClient.

        Returns:
            The single MetricsClient instance.
        """
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self) -> None:
        """Initialize the MetricsClient.

        This method only runs once due to the singleton pattern.
        Sets up the OpenTelemetry meter and creates metric instruments.
        """
        if hasattr(self, "meter"):
            return

        logger.info("Creating Strands MetricsClient")
        meter_provider: metrics_api.MeterProvider = metrics_api.get_meter_provider()
        self.meter = meter_provider.get_meter(__name__)
        self.create_instruments()

    def create_instruments(self) -> None:
        """Create and initialize all OpenTelemetry metric instruments."""
        self.event_loop_cycle_count = self.meter.create_counter(
            name=constants.STRANDS_EVENT_LOOP_CYCLE_COUNT, unit="Count"
        )
        self.event_loop_start_cycle = self.meter.create_counter(
            name=constants.STRANDS_EVENT_LOOP_START_CYCLE, unit="Count"
        )
        self.event_loop_end_cycle = self.meter.create_counter(name=constants.STRANDS_EVENT_LOOP_END_CYCLE, unit="Count")
        self.event_loop_cycle_duration = self.meter.create_histogram(
            name=constants.STRANDS_EVENT_LOOP_CYCLE_DURATION, unit="s"
        )
        self.event_loop_latency = self.meter.create_histogram(name=constants.STRANDS_EVENT_LOOP_LATENCY, unit="ms")
        self.tool_call_count = self.meter.create_counter(name=constants.STRANDS_TOOL_CALL_COUNT, unit="Count")
        self.tool_success_count = self.meter.create_counter(name=constants.STRANDS_TOOL_SUCCESS_COUNT, unit="Count")
        self.tool_error_count = self.meter.create_counter(name=constants.STRANDS_TOOL_ERROR_COUNT, unit="Count")
        self.tool_duration = self.meter.create_histogram(name=constants.STRANDS_TOOL_DURATION, unit="s")
        self.event_loop_input_tokens = self.meter.create_histogram(
            name=constants.STRANDS_EVENT_LOOP_INPUT_TOKENS, unit="token"
        )
        self.event_loop_output_tokens = self.meter.create_histogram(
            name=constants.STRANDS_EVENT_LOOP_OUTPUT_TOKENS, unit="token"
        )

```

#### `__init__()`

Initialize the MetricsClient.

This method only runs once due to the singleton pattern. Sets up the OpenTelemetry meter and creates metric instruments.

Source code in `strands/telemetry/metrics.py`

```
def __init__(self) -> None:
    """Initialize the MetricsClient.

    This method only runs once due to the singleton pattern.
    Sets up the OpenTelemetry meter and creates metric instruments.
    """
    if hasattr(self, "meter"):
        return

    logger.info("Creating Strands MetricsClient")
    meter_provider: metrics_api.MeterProvider = metrics_api.get_meter_provider()
    self.meter = meter_provider.get_meter(__name__)
    self.create_instruments()

```

#### `__new__()`

Create or return the singleton instance of MetricsClient.

Returns:

| Type | Description | | --- | --- | | `MetricsClient` | The single MetricsClient instance. |

Source code in `strands/telemetry/metrics.py`

```
def __new__(cls) -> "MetricsClient":
    """Create or return the singleton instance of MetricsClient.

    Returns:
        The single MetricsClient instance.
    """
    if cls._instance is None:
        cls._instance = super().__new__(cls)
    return cls._instance

```

#### `create_instruments()`

Create and initialize all OpenTelemetry metric instruments.

Source code in `strands/telemetry/metrics.py`

```
def create_instruments(self) -> None:
    """Create and initialize all OpenTelemetry metric instruments."""
    self.event_loop_cycle_count = self.meter.create_counter(
        name=constants.STRANDS_EVENT_LOOP_CYCLE_COUNT, unit="Count"
    )
    self.event_loop_start_cycle = self.meter.create_counter(
        name=constants.STRANDS_EVENT_LOOP_START_CYCLE, unit="Count"
    )
    self.event_loop_end_cycle = self.meter.create_counter(name=constants.STRANDS_EVENT_LOOP_END_CYCLE, unit="Count")
    self.event_loop_cycle_duration = self.meter.create_histogram(
        name=constants.STRANDS_EVENT_LOOP_CYCLE_DURATION, unit="s"
    )
    self.event_loop_latency = self.meter.create_histogram(name=constants.STRANDS_EVENT_LOOP_LATENCY, unit="ms")
    self.tool_call_count = self.meter.create_counter(name=constants.STRANDS_TOOL_CALL_COUNT, unit="Count")
    self.tool_success_count = self.meter.create_counter(name=constants.STRANDS_TOOL_SUCCESS_COUNT, unit="Count")
    self.tool_error_count = self.meter.create_counter(name=constants.STRANDS_TOOL_ERROR_COUNT, unit="Count")
    self.tool_duration = self.meter.create_histogram(name=constants.STRANDS_TOOL_DURATION, unit="s")
    self.event_loop_input_tokens = self.meter.create_histogram(
        name=constants.STRANDS_EVENT_LOOP_INPUT_TOKENS, unit="token"
    )
    self.event_loop_output_tokens = self.meter.create_histogram(
        name=constants.STRANDS_EVENT_LOOP_OUTPUT_TOKENS, unit="token"
    )

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

    def add_call(
        self,
        tool: ToolUse,
        duration: float,
        success: bool,
        metrics_client: "MetricsClient",
        attributes: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Record a new tool call with its outcome.

        Args:
            tool: The tool that was called.
            duration: How long the call took in seconds.
            success: Whether the call was successful.
            metrics_client: The metrics client for recording the metrics.
            attributes: attributes of the metrics.
        """
        self.tool = tool  # Update with latest tool state
        self.call_count += 1
        self.total_time += duration
        metrics_client.tool_call_count.add(1, attributes=attributes)
        metrics_client.tool_duration.record(duration, attributes=attributes)
        if success:
            self.success_count += 1
            metrics_client.tool_success_count.add(1, attributes=attributes)
        else:
            self.error_count += 1
            metrics_client.tool_error_count.add(1, attributes=attributes)

```

#### `add_call(tool, duration, success, metrics_client, attributes=None)`

Record a new tool call with its outcome.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool` | `ToolUse` | The tool that was called. | *required* | | `duration` | `float` | How long the call took in seconds. | *required* | | `success` | `bool` | Whether the call was successful. | *required* | | `metrics_client` | `MetricsClient` | The metrics client for recording the metrics. | *required* | | `attributes` | `Optional[Dict[str, Any]]` | attributes of the metrics. | `None` |

Source code in `strands/telemetry/metrics.py`

```
def add_call(
    self,
    tool: ToolUse,
    duration: float,
    success: bool,
    metrics_client: "MetricsClient",
    attributes: Optional[Dict[str, Any]] = None,
) -> None:
    """Record a new tool call with its outcome.

    Args:
        tool: The tool that was called.
        duration: How long the call took in seconds.
        success: Whether the call was successful.
        metrics_client: The metrics client for recording the metrics.
        attributes: attributes of the metrics.
    """
    self.tool = tool  # Update with latest tool state
    self.call_count += 1
    self.total_time += duration
    metrics_client.tool_call_count.add(1, attributes=attributes)
    metrics_client.tool_duration.record(duration, attributes=attributes)
    if success:
        self.success_count += 1
        metrics_client.tool_success_count.add(1, attributes=attributes)
    else:
        self.error_count += 1
        metrics_client.tool_error_count.add(1, attributes=attributes)

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

## `strands.telemetry.metrics_constants`

Metrics that are emitted in Strands-Agents.

## `strands.telemetry.tracer`

OpenTelemetry integration.

This module provides tracing capabilities using OpenTelemetry, enabling trace data to be sent to OTLP endpoints.

### `JSONEncoder`

Bases: `JSONEncoder`

Custom JSON encoder that handles non-serializable types.

Source code in `strands/telemetry/tracer.py`

```
class JSONEncoder(json.JSONEncoder):
    """Custom JSON encoder that handles non-serializable types."""

    def encode(self, obj: Any) -> str:
        """Recursively encode objects, preserving structure and only replacing unserializable values.

        Args:
            obj: The object to encode

        Returns:
            JSON string representation of the object
        """
        # Process the object to handle non-serializable values
        processed_obj = self._process_value(obj)
        # Use the parent class to encode the processed object
        return super().encode(processed_obj)

    def _process_value(self, value: Any) -> Any:
        """Process any value, handling containers recursively.

        Args:
            value: The value to process

        Returns:
            Processed value with unserializable parts replaced
        """
        # Handle datetime objects directly
        if isinstance(value, (datetime, date)):
            return value.isoformat()

        # Handle dictionaries
        elif isinstance(value, dict):
            return {k: self._process_value(v) for k, v in value.items()}

        # Handle lists
        elif isinstance(value, list):
            return [self._process_value(item) for item in value]

        # Handle all other values
        else:
            try:
                # Test if the value is JSON serializable
                json.dumps(value)
                return value
            except (TypeError, OverflowError, ValueError):
                return "<replaced>"

```

#### `encode(obj)`

Recursively encode objects, preserving structure and only replacing unserializable values.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `obj` | `Any` | The object to encode | *required* |

Returns:

| Type | Description | | --- | --- | | `str` | JSON string representation of the object |

Source code in `strands/telemetry/tracer.py`

```
def encode(self, obj: Any) -> str:
    """Recursively encode objects, preserving structure and only replacing unserializable values.

    Args:
        obj: The object to encode

    Returns:
        JSON string representation of the object
    """
    # Process the object to handle non-serializable values
    processed_obj = self._process_value(obj)
    # Use the parent class to encode the processed object
    return super().encode(processed_obj)

```

### `Tracer`

Handles OpenTelemetry tracing.

This class provides a simple interface for creating and managing traces, with support for sending to OTLP endpoints.

When the OTEL_EXPORTER_OTLP_ENDPOINT environment variable is set, traces are sent to the OTLP endpoint.

Source code in `strands/telemetry/tracer.py`

```
class Tracer:
    """Handles OpenTelemetry tracing.

    This class provides a simple interface for creating and managing traces,
    with support for sending to OTLP endpoints.

    When the OTEL_EXPORTER_OTLP_ENDPOINT environment variable is set, traces
    are sent to the OTLP endpoint.
    """

    def __init__(
        self,
    ) -> None:
        """Initialize the tracer."""
        self.service_name = __name__
        self.tracer_provider: Optional[trace_api.TracerProvider] = None
        self.tracer_provider = trace_api.get_tracer_provider()
        self.tracer = self.tracer_provider.get_tracer(self.service_name)
        ThreadingInstrumentor().instrument()

    def _start_span(
        self,
        span_name: str,
        parent_span: Optional[Span] = None,
        attributes: Optional[Dict[str, AttributeValue]] = None,
        span_kind: trace_api.SpanKind = trace_api.SpanKind.INTERNAL,
    ) -> Span:
        """Generic helper method to start a span with common attributes.

        Args:
            span_name: Name of the span to create
            parent_span: Optional parent span to link this span to
            attributes: Dictionary of attributes to set on the span
            span_kind: enum of OptenTelemetry SpanKind

        Returns:
            The created span, or None if tracing is not enabled
        """
        if not parent_span:
            parent_span = trace_api.get_current_span()

        context = None
        if parent_span and parent_span.is_recording() and parent_span != trace_api.INVALID_SPAN:
            context = trace_api.set_span_in_context(parent_span)

        span = self.tracer.start_span(name=span_name, context=context, kind=span_kind)

        # Set start time as a common attribute
        span.set_attribute("gen_ai.event.start_time", datetime.now(timezone.utc).isoformat())

        # Add all provided attributes
        if attributes:
            self._set_attributes(span, attributes)

        return span

    def _set_attributes(self, span: Span, attributes: Dict[str, AttributeValue]) -> None:
        """Set attributes on a span, handling different value types appropriately.

        Args:
            span: The span to set attributes on
            attributes: Dictionary of attributes to set
        """
        if not span:
            return

        for key, value in attributes.items():
            span.set_attribute(key, value)

    def _end_span(
        self,
        span: Span,
        attributes: Optional[Dict[str, AttributeValue]] = None,
        error: Optional[Exception] = None,
    ) -> None:
        """Generic helper method to end a span.

        Args:
            span: The span to end
            attributes: Optional attributes to set before ending the span
            error: Optional exception if an error occurred
        """
        if not span:
            return

        try:
            # Set end time as a common attribute
            span.set_attribute("gen_ai.event.end_time", datetime.now(timezone.utc).isoformat())

            # Add any additional attributes
            if attributes:
                self._set_attributes(span, attributes)

            # Handle error if present
            if error:
                span.set_status(StatusCode.ERROR, str(error))
                span.record_exception(error)
            else:
                span.set_status(StatusCode.OK)
        except Exception as e:
            logger.warning("error=<%s> | error while ending span", e, exc_info=True)
        finally:
            span.end()
            # Force flush to ensure spans are exported
            if self.tracer_provider and hasattr(self.tracer_provider, "force_flush"):
                try:
                    self.tracer_provider.force_flush()
                except Exception as e:
                    logger.warning("error=<%s> | failed to force flush tracer provider", e)

    def end_span_with_error(self, span: Span, error_message: str, exception: Optional[Exception] = None) -> None:
        """End a span with error status.

        Args:
            span: The span to end.
            error_message: Error message to set in the span status.
            exception: Optional exception to record in the span.
        """
        if not span:
            return

        error = exception or Exception(error_message)
        self._end_span(span, error=error)

    def _add_event(self, span: Optional[Span], event_name: str, event_attributes: Dict[str, AttributeValue]) -> None:
        """Add an event with attributes to a span.

        Args:
            span: The span to add the event to
            event_name: Name of the event
            event_attributes: Dictionary of attributes to set on the event
        """
        if not span:
            return

        span.add_event(event_name, attributes=event_attributes)

    def start_model_invoke_span(
        self,
        messages: Messages,
        parent_span: Optional[Span] = None,
        model_id: Optional[str] = None,
        **kwargs: Any,
    ) -> Span:
        """Start a new span for a model invocation.

        Args:
            messages: Messages being sent to the model.
            parent_span: Optional parent span to link this span to.
            model_id: Optional identifier for the model being invoked.
            **kwargs: Additional attributes to add to the span.

        Returns:
            The created span, or None if tracing is not enabled.
        """
        attributes: Dict[str, AttributeValue] = {
            "gen_ai.system": "strands-agents",
            "gen_ai.operation.name": "chat",
        }

        if model_id:
            attributes["gen_ai.request.model"] = model_id

        # Add additional kwargs as attributes
        attributes.update({k: v for k, v in kwargs.items() if isinstance(v, (str, int, float, bool))})

        span = self._start_span("chat", parent_span, attributes=attributes, span_kind=trace_api.SpanKind.CLIENT)
        for message in messages:
            self._add_event(
                span,
                f"gen_ai.{message['role']}.message",
                {"content": serialize(message["content"])},
            )
        return span

    def end_model_invoke_span(
        self, span: Span, message: Message, usage: Usage, stop_reason: StopReason, error: Optional[Exception] = None
    ) -> None:
        """End a model invocation span with results and metrics.

        Args:
            span: The span to end.
            message: The message response from the model.
            usage: Token usage information from the model call.
            stop_reason (StopReason): The reason the model stopped generating.
            error: Optional exception if the model call failed.
        """
        attributes: Dict[str, AttributeValue] = {
            "gen_ai.usage.prompt_tokens": usage["inputTokens"],
            "gen_ai.usage.input_tokens": usage["inputTokens"],
            "gen_ai.usage.completion_tokens": usage["outputTokens"],
            "gen_ai.usage.output_tokens": usage["outputTokens"],
            "gen_ai.usage.total_tokens": usage["totalTokens"],
        }

        self._add_event(
            span,
            "gen_ai.choice",
            event_attributes={"finish_reason": str(stop_reason), "message": serialize(message["content"])},
        )

        self._end_span(span, attributes, error)

    def start_tool_call_span(self, tool: ToolUse, parent_span: Optional[Span] = None, **kwargs: Any) -> Span:
        """Start a new span for a tool call.

        Args:
            tool: The tool being used.
            parent_span: Optional parent span to link this span to.
            **kwargs: Additional attributes to add to the span.

        Returns:
            The created span, or None if tracing is not enabled.
        """
        attributes: Dict[str, AttributeValue] = {
            "gen_ai.operation.name": "execute_tool",
            "gen_ai.system": "strands-agents",
            "gen_ai.tool.name": tool["name"],
            "gen_ai.tool.call.id": tool["toolUseId"],
        }

        # Add additional kwargs as attributes
        attributes.update(kwargs)

        span_name = f"execute_tool {tool['name']}"
        span = self._start_span(span_name, parent_span, attributes=attributes, span_kind=trace_api.SpanKind.INTERNAL)

        self._add_event(
            span,
            "gen_ai.tool.message",
            event_attributes={
                "role": "tool",
                "content": serialize(tool["input"]),
                "id": tool["toolUseId"],
            },
        )

        return span

    def end_tool_call_span(
        self, span: Span, tool_result: Optional[ToolResult], error: Optional[Exception] = None
    ) -> None:
        """End a tool call span with results.

        Args:
            span: The span to end.
            tool_result: The result from the tool execution.
            error: Optional exception if the tool call failed.
        """
        attributes: Dict[str, AttributeValue] = {}
        if tool_result is not None:
            status = tool_result.get("status")
            status_str = str(status) if status is not None else ""

            attributes.update(
                {
                    "tool.status": status_str,
                }
            )

            self._add_event(
                span,
                "gen_ai.choice",
                event_attributes={
                    "message": serialize(tool_result.get("content")),
                    "id": tool_result.get("toolUseId", ""),
                },
            )

        self._end_span(span, attributes, error)

    def start_event_loop_cycle_span(
        self,
        invocation_state: Any,
        messages: Messages,
        parent_span: Optional[Span] = None,
        **kwargs: Any,
    ) -> Optional[Span]:
        """Start a new span for an event loop cycle.

        Args:
            invocation_state: Arguments for the event loop cycle.
            parent_span: Optional parent span to link this span to.
            messages:  Messages being processed in this cycle.
            **kwargs: Additional attributes to add to the span.

        Returns:
            The created span, or None if tracing is not enabled.
        """
        event_loop_cycle_id = str(invocation_state.get("event_loop_cycle_id"))
        parent_span = parent_span if parent_span else invocation_state.get("event_loop_parent_span")

        attributes: Dict[str, AttributeValue] = {
            "event_loop.cycle_id": event_loop_cycle_id,
        }

        if "event_loop_parent_cycle_id" in invocation_state:
            attributes["event_loop.parent_cycle_id"] = str(invocation_state["event_loop_parent_cycle_id"])

        # Add additional kwargs as attributes
        attributes.update({k: v for k, v in kwargs.items() if isinstance(v, (str, int, float, bool))})

        span_name = "execute_event_loop_cycle"
        span = self._start_span(span_name, parent_span, attributes)
        for message in messages or []:
            self._add_event(
                span,
                f"gen_ai.{message['role']}.message",
                {"content": serialize(message["content"])},
            )

        return span

    def end_event_loop_cycle_span(
        self,
        span: Span,
        message: Message,
        tool_result_message: Optional[Message] = None,
        error: Optional[Exception] = None,
    ) -> None:
        """End an event loop cycle span with results.

        Args:
            span: The span to end.
            message: The message response from this cycle.
            tool_result_message: Optional tool result message if a tool was called.
            error: Optional exception if the cycle failed.
        """
        attributes: Dict[str, AttributeValue] = {}
        event_attributes: Dict[str, AttributeValue] = {"message": serialize(message["content"])}

        if tool_result_message:
            event_attributes["tool.result"] = serialize(tool_result_message["content"])
        self._add_event(span, "gen_ai.choice", event_attributes=event_attributes)
        self._end_span(span, attributes, error)

    def start_agent_span(
        self,
        message: Message,
        agent_name: str,
        model_id: Optional[str] = None,
        tools: Optional[list] = None,
        custom_trace_attributes: Optional[Mapping[str, AttributeValue]] = None,
        **kwargs: Any,
    ) -> Span:
        """Start a new span for an agent invocation.

        Args:
            message: The user message being sent to the agent.
            agent_name: Name of the agent.
            model_id: Optional model identifier.
            tools: Optional list of tools being used.
            custom_trace_attributes: Optional mapping of custom trace attributes to include in the span.
            **kwargs: Additional attributes to add to the span.

        Returns:
            The created span, or None if tracing is not enabled.
        """
        attributes: Dict[str, AttributeValue] = {
            "gen_ai.system": "strands-agents",
            "gen_ai.agent.name": agent_name,
            "gen_ai.operation.name": "invoke_agent",
        }

        if model_id:
            attributes["gen_ai.request.model"] = model_id

        if tools:
            tools_json = serialize(tools)
            attributes["gen_ai.agent.tools"] = tools_json

        # Add custom trace attributes if provided
        if custom_trace_attributes:
            attributes.update(custom_trace_attributes)

        # Add additional kwargs as attributes
        attributes.update({k: v for k, v in kwargs.items() if isinstance(v, (str, int, float, bool))})

        span = self._start_span(
            f"invoke_agent {agent_name}", attributes=attributes, span_kind=trace_api.SpanKind.CLIENT
        )
        self._add_event(
            span,
            "gen_ai.user.message",
            event_attributes={
                "content": serialize(message["content"]),
            },
        )

        return span

    def end_agent_span(
        self,
        span: Span,
        response: Optional[AgentResult] = None,
        error: Optional[Exception] = None,
    ) -> None:
        """End an agent span with results and metrics.

        Args:
            span: The span to end.
            response: The response from the agent.
            error: Any error that occurred.
        """
        attributes: Dict[str, AttributeValue] = {}

        if response:
            self._add_event(
                span,
                "gen_ai.choice",
                event_attributes={"message": str(response), "finish_reason": str(response.stop_reason)},
            )

            if hasattr(response, "metrics") and hasattr(response.metrics, "accumulated_usage"):
                accumulated_usage = response.metrics.accumulated_usage
                attributes.update(
                    {
                        "gen_ai.usage.prompt_tokens": accumulated_usage["inputTokens"],
                        "gen_ai.usage.completion_tokens": accumulated_usage["outputTokens"],
                        "gen_ai.usage.input_tokens": accumulated_usage["inputTokens"],
                        "gen_ai.usage.output_tokens": accumulated_usage["outputTokens"],
                        "gen_ai.usage.total_tokens": accumulated_usage["totalTokens"],
                    }
                )

        self._end_span(span, attributes, error)

    def start_multiagent_span(
        self,
        task: str | list[ContentBlock],
        instance: str,
    ) -> Span:
        """Start a new span for swarm invocation."""
        attributes: Dict[str, AttributeValue] = {
            "gen_ai.system": "strands-agents",
            "gen_ai.agent.name": instance,
            "gen_ai.operation.name": f"invoke_{instance}",
        }

        span = self._start_span(f"invoke_{instance}", attributes=attributes, span_kind=trace_api.SpanKind.CLIENT)
        content = serialize(task) if isinstance(task, list) else task
        self._add_event(
            span,
            "gen_ai.user.message",
            event_attributes={"content": content},
        )

        return span

    def end_swarm_span(
        self,
        span: Span,
        result: Optional[str] = None,
    ) -> None:
        """End a swarm span with results."""
        if result:
            self._add_event(
                span,
                "gen_ai.choice",
                event_attributes={"message": result},
            )

```

#### `__init__()`

Initialize the tracer.

Source code in `strands/telemetry/tracer.py`

```
def __init__(
    self,
) -> None:
    """Initialize the tracer."""
    self.service_name = __name__
    self.tracer_provider: Optional[trace_api.TracerProvider] = None
    self.tracer_provider = trace_api.get_tracer_provider()
    self.tracer = self.tracer_provider.get_tracer(self.service_name)
    ThreadingInstrumentor().instrument()

```

#### `end_agent_span(span, response=None, error=None)`

End an agent span with results and metrics.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `span` | `Span` | The span to end. | *required* | | `response` | `Optional[AgentResult]` | The response from the agent. | `None` | | `error` | `Optional[Exception]` | Any error that occurred. | `None` |

Source code in `strands/telemetry/tracer.py`

```
def end_agent_span(
    self,
    span: Span,
    response: Optional[AgentResult] = None,
    error: Optional[Exception] = None,
) -> None:
    """End an agent span with results and metrics.

    Args:
        span: The span to end.
        response: The response from the agent.
        error: Any error that occurred.
    """
    attributes: Dict[str, AttributeValue] = {}

    if response:
        self._add_event(
            span,
            "gen_ai.choice",
            event_attributes={"message": str(response), "finish_reason": str(response.stop_reason)},
        )

        if hasattr(response, "metrics") and hasattr(response.metrics, "accumulated_usage"):
            accumulated_usage = response.metrics.accumulated_usage
            attributes.update(
                {
                    "gen_ai.usage.prompt_tokens": accumulated_usage["inputTokens"],
                    "gen_ai.usage.completion_tokens": accumulated_usage["outputTokens"],
                    "gen_ai.usage.input_tokens": accumulated_usage["inputTokens"],
                    "gen_ai.usage.output_tokens": accumulated_usage["outputTokens"],
                    "gen_ai.usage.total_tokens": accumulated_usage["totalTokens"],
                }
            )

    self._end_span(span, attributes, error)

```

#### `end_event_loop_cycle_span(span, message, tool_result_message=None, error=None)`

End an event loop cycle span with results.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `span` | `Span` | The span to end. | *required* | | `message` | `Message` | The message response from this cycle. | *required* | | `tool_result_message` | `Optional[Message]` | Optional tool result message if a tool was called. | `None` | | `error` | `Optional[Exception]` | Optional exception if the cycle failed. | `None` |

Source code in `strands/telemetry/tracer.py`

```
def end_event_loop_cycle_span(
    self,
    span: Span,
    message: Message,
    tool_result_message: Optional[Message] = None,
    error: Optional[Exception] = None,
) -> None:
    """End an event loop cycle span with results.

    Args:
        span: The span to end.
        message: The message response from this cycle.
        tool_result_message: Optional tool result message if a tool was called.
        error: Optional exception if the cycle failed.
    """
    attributes: Dict[str, AttributeValue] = {}
    event_attributes: Dict[str, AttributeValue] = {"message": serialize(message["content"])}

    if tool_result_message:
        event_attributes["tool.result"] = serialize(tool_result_message["content"])
    self._add_event(span, "gen_ai.choice", event_attributes=event_attributes)
    self._end_span(span, attributes, error)

```

#### `end_model_invoke_span(span, message, usage, stop_reason, error=None)`

End a model invocation span with results and metrics.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `span` | `Span` | The span to end. | *required* | | `message` | `Message` | The message response from the model. | *required* | | `usage` | `Usage` | Token usage information from the model call. | *required* | | `stop_reason` | `StopReason` | The reason the model stopped generating. | *required* | | `error` | `Optional[Exception]` | Optional exception if the model call failed. | `None` |

Source code in `strands/telemetry/tracer.py`

```
def end_model_invoke_span(
    self, span: Span, message: Message, usage: Usage, stop_reason: StopReason, error: Optional[Exception] = None
) -> None:
    """End a model invocation span with results and metrics.

    Args:
        span: The span to end.
        message: The message response from the model.
        usage: Token usage information from the model call.
        stop_reason (StopReason): The reason the model stopped generating.
        error: Optional exception if the model call failed.
    """
    attributes: Dict[str, AttributeValue] = {
        "gen_ai.usage.prompt_tokens": usage["inputTokens"],
        "gen_ai.usage.input_tokens": usage["inputTokens"],
        "gen_ai.usage.completion_tokens": usage["outputTokens"],
        "gen_ai.usage.output_tokens": usage["outputTokens"],
        "gen_ai.usage.total_tokens": usage["totalTokens"],
    }

    self._add_event(
        span,
        "gen_ai.choice",
        event_attributes={"finish_reason": str(stop_reason), "message": serialize(message["content"])},
    )

    self._end_span(span, attributes, error)

```

#### `end_span_with_error(span, error_message, exception=None)`

End a span with error status.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `span` | `Span` | The span to end. | *required* | | `error_message` | `str` | Error message to set in the span status. | *required* | | `exception` | `Optional[Exception]` | Optional exception to record in the span. | `None` |

Source code in `strands/telemetry/tracer.py`

```
def end_span_with_error(self, span: Span, error_message: str, exception: Optional[Exception] = None) -> None:
    """End a span with error status.

    Args:
        span: The span to end.
        error_message: Error message to set in the span status.
        exception: Optional exception to record in the span.
    """
    if not span:
        return

    error = exception or Exception(error_message)
    self._end_span(span, error=error)

```

#### `end_swarm_span(span, result=None)`

End a swarm span with results.

Source code in `strands/telemetry/tracer.py`

```
def end_swarm_span(
    self,
    span: Span,
    result: Optional[str] = None,
) -> None:
    """End a swarm span with results."""
    if result:
        self._add_event(
            span,
            "gen_ai.choice",
            event_attributes={"message": result},
        )

```

#### `end_tool_call_span(span, tool_result, error=None)`

End a tool call span with results.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `span` | `Span` | The span to end. | *required* | | `tool_result` | `Optional[ToolResult]` | The result from the tool execution. | *required* | | `error` | `Optional[Exception]` | Optional exception if the tool call failed. | `None` |

Source code in `strands/telemetry/tracer.py`

```
def end_tool_call_span(
    self, span: Span, tool_result: Optional[ToolResult], error: Optional[Exception] = None
) -> None:
    """End a tool call span with results.

    Args:
        span: The span to end.
        tool_result: The result from the tool execution.
        error: Optional exception if the tool call failed.
    """
    attributes: Dict[str, AttributeValue] = {}
    if tool_result is not None:
        status = tool_result.get("status")
        status_str = str(status) if status is not None else ""

        attributes.update(
            {
                "tool.status": status_str,
            }
        )

        self._add_event(
            span,
            "gen_ai.choice",
            event_attributes={
                "message": serialize(tool_result.get("content")),
                "id": tool_result.get("toolUseId", ""),
            },
        )

    self._end_span(span, attributes, error)

```

#### `start_agent_span(message, agent_name, model_id=None, tools=None, custom_trace_attributes=None, **kwargs)`

Start a new span for an agent invocation.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `message` | `Message` | The user message being sent to the agent. | *required* | | `agent_name` | `str` | Name of the agent. | *required* | | `model_id` | `Optional[str]` | Optional model identifier. | `None` | | `tools` | `Optional[list]` | Optional list of tools being used. | `None` | | `custom_trace_attributes` | `Optional[Mapping[str, AttributeValue]]` | Optional mapping of custom trace attributes to include in the span. | `None` | | `**kwargs` | `Any` | Additional attributes to add to the span. | `{}` |

Returns:

| Type | Description | | --- | --- | | `Span` | The created span, or None if tracing is not enabled. |

Source code in `strands/telemetry/tracer.py`

```
def start_agent_span(
    self,
    message: Message,
    agent_name: str,
    model_id: Optional[str] = None,
    tools: Optional[list] = None,
    custom_trace_attributes: Optional[Mapping[str, AttributeValue]] = None,
    **kwargs: Any,
) -> Span:
    """Start a new span for an agent invocation.

    Args:
        message: The user message being sent to the agent.
        agent_name: Name of the agent.
        model_id: Optional model identifier.
        tools: Optional list of tools being used.
        custom_trace_attributes: Optional mapping of custom trace attributes to include in the span.
        **kwargs: Additional attributes to add to the span.

    Returns:
        The created span, or None if tracing is not enabled.
    """
    attributes: Dict[str, AttributeValue] = {
        "gen_ai.system": "strands-agents",
        "gen_ai.agent.name": agent_name,
        "gen_ai.operation.name": "invoke_agent",
    }

    if model_id:
        attributes["gen_ai.request.model"] = model_id

    if tools:
        tools_json = serialize(tools)
        attributes["gen_ai.agent.tools"] = tools_json

    # Add custom trace attributes if provided
    if custom_trace_attributes:
        attributes.update(custom_trace_attributes)

    # Add additional kwargs as attributes
    attributes.update({k: v for k, v in kwargs.items() if isinstance(v, (str, int, float, bool))})

    span = self._start_span(
        f"invoke_agent {agent_name}", attributes=attributes, span_kind=trace_api.SpanKind.CLIENT
    )
    self._add_event(
        span,
        "gen_ai.user.message",
        event_attributes={
            "content": serialize(message["content"]),
        },
    )

    return span

```

#### `start_event_loop_cycle_span(invocation_state, messages, parent_span=None, **kwargs)`

Start a new span for an event loop cycle.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `invocation_state` | `Any` | Arguments for the event loop cycle. | *required* | | `parent_span` | `Optional[Span]` | Optional parent span to link this span to. | `None` | | `messages` | `Messages` | Messages being processed in this cycle. | *required* | | `**kwargs` | `Any` | Additional attributes to add to the span. | `{}` |

Returns:

| Type | Description | | --- | --- | | `Optional[Span]` | The created span, or None if tracing is not enabled. |

Source code in `strands/telemetry/tracer.py`

```
def start_event_loop_cycle_span(
    self,
    invocation_state: Any,
    messages: Messages,
    parent_span: Optional[Span] = None,
    **kwargs: Any,
) -> Optional[Span]:
    """Start a new span for an event loop cycle.

    Args:
        invocation_state: Arguments for the event loop cycle.
        parent_span: Optional parent span to link this span to.
        messages:  Messages being processed in this cycle.
        **kwargs: Additional attributes to add to the span.

    Returns:
        The created span, or None if tracing is not enabled.
    """
    event_loop_cycle_id = str(invocation_state.get("event_loop_cycle_id"))
    parent_span = parent_span if parent_span else invocation_state.get("event_loop_parent_span")

    attributes: Dict[str, AttributeValue] = {
        "event_loop.cycle_id": event_loop_cycle_id,
    }

    if "event_loop_parent_cycle_id" in invocation_state:
        attributes["event_loop.parent_cycle_id"] = str(invocation_state["event_loop_parent_cycle_id"])

    # Add additional kwargs as attributes
    attributes.update({k: v for k, v in kwargs.items() if isinstance(v, (str, int, float, bool))})

    span_name = "execute_event_loop_cycle"
    span = self._start_span(span_name, parent_span, attributes)
    for message in messages or []:
        self._add_event(
            span,
            f"gen_ai.{message['role']}.message",
            {"content": serialize(message["content"])},
        )

    return span

```

#### `start_model_invoke_span(messages, parent_span=None, model_id=None, **kwargs)`

Start a new span for a model invocation.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `messages` | `Messages` | Messages being sent to the model. | *required* | | `parent_span` | `Optional[Span]` | Optional parent span to link this span to. | `None` | | `model_id` | `Optional[str]` | Optional identifier for the model being invoked. | `None` | | `**kwargs` | `Any` | Additional attributes to add to the span. | `{}` |

Returns:

| Type | Description | | --- | --- | | `Span` | The created span, or None if tracing is not enabled. |

Source code in `strands/telemetry/tracer.py`

```
def start_model_invoke_span(
    self,
    messages: Messages,
    parent_span: Optional[Span] = None,
    model_id: Optional[str] = None,
    **kwargs: Any,
) -> Span:
    """Start a new span for a model invocation.

    Args:
        messages: Messages being sent to the model.
        parent_span: Optional parent span to link this span to.
        model_id: Optional identifier for the model being invoked.
        **kwargs: Additional attributes to add to the span.

    Returns:
        The created span, or None if tracing is not enabled.
    """
    attributes: Dict[str, AttributeValue] = {
        "gen_ai.system": "strands-agents",
        "gen_ai.operation.name": "chat",
    }

    if model_id:
        attributes["gen_ai.request.model"] = model_id

    # Add additional kwargs as attributes
    attributes.update({k: v for k, v in kwargs.items() if isinstance(v, (str, int, float, bool))})

    span = self._start_span("chat", parent_span, attributes=attributes, span_kind=trace_api.SpanKind.CLIENT)
    for message in messages:
        self._add_event(
            span,
            f"gen_ai.{message['role']}.message",
            {"content": serialize(message["content"])},
        )
    return span

```

#### `start_multiagent_span(task, instance)`

Start a new span for swarm invocation.

Source code in `strands/telemetry/tracer.py`

```
def start_multiagent_span(
    self,
    task: str | list[ContentBlock],
    instance: str,
) -> Span:
    """Start a new span for swarm invocation."""
    attributes: Dict[str, AttributeValue] = {
        "gen_ai.system": "strands-agents",
        "gen_ai.agent.name": instance,
        "gen_ai.operation.name": f"invoke_{instance}",
    }

    span = self._start_span(f"invoke_{instance}", attributes=attributes, span_kind=trace_api.SpanKind.CLIENT)
    content = serialize(task) if isinstance(task, list) else task
    self._add_event(
        span,
        "gen_ai.user.message",
        event_attributes={"content": content},
    )

    return span

```

#### `start_tool_call_span(tool, parent_span=None, **kwargs)`

Start a new span for a tool call.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool` | `ToolUse` | The tool being used. | *required* | | `parent_span` | `Optional[Span]` | Optional parent span to link this span to. | `None` | | `**kwargs` | `Any` | Additional attributes to add to the span. | `{}` |

Returns:

| Type | Description | | --- | --- | | `Span` | The created span, or None if tracing is not enabled. |

Source code in `strands/telemetry/tracer.py`

```
def start_tool_call_span(self, tool: ToolUse, parent_span: Optional[Span] = None, **kwargs: Any) -> Span:
    """Start a new span for a tool call.

    Args:
        tool: The tool being used.
        parent_span: Optional parent span to link this span to.
        **kwargs: Additional attributes to add to the span.

    Returns:
        The created span, or None if tracing is not enabled.
    """
    attributes: Dict[str, AttributeValue] = {
        "gen_ai.operation.name": "execute_tool",
        "gen_ai.system": "strands-agents",
        "gen_ai.tool.name": tool["name"],
        "gen_ai.tool.call.id": tool["toolUseId"],
    }

    # Add additional kwargs as attributes
    attributes.update(kwargs)

    span_name = f"execute_tool {tool['name']}"
    span = self._start_span(span_name, parent_span, attributes=attributes, span_kind=trace_api.SpanKind.INTERNAL)

    self._add_event(
        span,
        "gen_ai.tool.message",
        event_attributes={
            "role": "tool",
            "content": serialize(tool["input"]),
            "id": tool["toolUseId"],
        },
    )

    return span

```

### `get_tracer()`

Get or create the global tracer.

Returns:

| Type | Description | | --- | --- | | `Tracer` | The global tracer instance. |

Source code in `strands/telemetry/tracer.py`

```
def get_tracer() -> Tracer:
    """Get or create the global tracer.

    Returns:
        The global tracer instance.
    """
    global _tracer_instance

    if not _tracer_instance:
        _tracer_instance = Tracer()

    return _tracer_instance

```

### `serialize(obj)`

Serialize an object to JSON with consistent settings.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `obj` | `Any` | The object to serialize | *required* |

Returns:

| Type | Description | | --- | --- | | `str` | JSON string representation of the object |

Source code in `strands/telemetry/tracer.py`

```
def serialize(obj: Any) -> str:
    """Serialize an object to JSON with consistent settings.

    Args:
        obj: The object to serialize

    Returns:
        JSON string representation of the object
    """
    return json.dumps(obj, ensure_ascii=False, cls=JSONEncoder)

```
