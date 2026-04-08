OpenTelemetry integration.

This module provides tracing capabilities using OpenTelemetry, enabling trace data to be sent to OTLP endpoints.

## JSONEncoder

```python
class JSONEncoder(json.JSONEncoder)
```

Defined in: [src/strands/telemetry/tracer.py:29](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L29)

Custom JSON encoder that handles non-serializable types.

#### encode

```python
def encode(obj: Any) -> str
```

Defined in: [src/strands/telemetry/tracer.py:32](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L32)

Recursively encode objects, preserving structure and only replacing unserializable values.

**Arguments**:

-   `obj` - The object to encode

**Returns**:

JSON string representation of the object

## Tracer

```python
class Tracer()
```

Defined in: [src/strands/telemetry/tracer.py:77](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L77)

Handles OpenTelemetry tracing.

This class provides a simple interface for creating and managing traces, with support for sending to OTLP endpoints.

When the OTEL\_EXPORTER\_OTLP\_ENDPOINT environment variable is set, traces are sent to the OTLP endpoint.

Both attributes are controlled by including “gen\_ai\_latest\_experimental” or “gen\_ai\_tool\_definitions”, respectively, in the OTEL\_SEMCONV\_STABILITY\_OPT\_IN environment variable.

#### \_\_init\_\_

```python
def __init__() -> None
```

Defined in: [src/strands/telemetry/tracer.py:90](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L90)

Initialize the tracer.

#### is\_langfuse

```python
@property
def is_langfuse() -> bool
```

Defined in: [src/strands/telemetry/tracer.py:114](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L114)

Check if Langfuse is configured as the OTLP endpoint.

**Returns**:

True if Langfuse is the OTLP endpoint, False otherwise.

#### end\_span\_with\_error

```python
def end_span_with_error(span: Span,
                        error_message: str,
                        exception: Exception | None = None) -> None
```

Defined in: [src/strands/telemetry/tracer.py:227](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L227)

End a span with error status.

**Arguments**:

-   `span` - The span to end.
-   `error_message` - Error message to set in the span status.
-   `exception` - Optional exception to record in the span.

#### start\_model\_invoke\_span

```python
def start_model_invoke_span(messages: Messages,
                            parent_span: Span | None = None,
                            model_id: str | None = None,
                            custom_trace_attributes: Mapping[str,
                                                             AttributeValue]
                            | None = None,
                            system_prompt: str | None = None,
                            system_prompt_content: list | None = None,
                            **kwargs: Any) -> Span
```

Defined in: [src/strands/telemetry/tracer.py:285](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L285)

Start a new span for a model invocation.

**Arguments**:

-   `messages` - Messages being sent to the model.
-   `parent_span` - Optional parent span to link this span to.
-   `model_id` - Optional identifier for the model being invoked.
-   `custom_trace_attributes` - Optional mapping of custom trace attributes to include in the span.
-   `system_prompt` - Optional system prompt string provided to the model.
-   `system_prompt_content` - Optional list of system prompt content blocks.
-   `**kwargs` - Additional attributes to add to the span.

**Returns**:

The created span, or None if tracing is not enabled.

#### end\_model\_invoke\_span

```python
def end_model_invoke_span(span: Span, message: Message, usage: Usage,
                          metrics: Metrics, stop_reason: StopReason) -> None
```

Defined in: [src/strands/telemetry/tracer.py:326](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L326)

End a model invocation span with results and metrics.

**Arguments**:

-   `span` - The span to end.
-   `message` - The message response from the model.
-   `usage` - Token usage information from the model call.
-   `metrics` - Metrics from the model call.
-   `stop_reason` - The reason the model stopped generating.

#### start\_tool\_call\_span

```python
def start_tool_call_span(tool: ToolUse,
                         parent_span: Span | None = None,
                         custom_trace_attributes: Mapping[str, AttributeValue]
                         | None = None,
                         **kwargs: Any) -> Span
```

Defined in: [src/strands/telemetry/tracer.py:383](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L383)

Start a new span for a tool call.

**Arguments**:

-   `tool` - The tool being used.
-   `parent_span` - Optional parent span to link this span to.
-   `custom_trace_attributes` - Optional mapping of custom trace attributes to include in the span.
-   `**kwargs` - Additional attributes to add to the span.

**Returns**:

The created span, or None if tracing is not enabled.

#### end\_tool\_call\_span

```python
def end_tool_call_span(span: Span,
                       tool_result: ToolResult | None,
                       error: Exception | None = None) -> None
```

Defined in: [src/strands/telemetry/tracer.py:453](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L453)

End a tool call span with results.

**Arguments**:

-   `span` - The span to end.
-   `tool_result` - The result from the tool execution.
-   `error` - Optional exception if the tool call failed.

#### start\_event\_loop\_cycle\_span

```python
def start_event_loop_cycle_span(
        invocation_state: Any,
        messages: Messages,
        parent_span: Span | None = None,
        custom_trace_attributes: Mapping[str, AttributeValue] | None = None,
        **kwargs: Any) -> Span
```

Defined in: [src/strands/telemetry/tracer.py:506](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L506)

Start a new span for an event loop cycle.

**Arguments**:

-   `invocation_state` - Arguments for the event loop cycle.
-   `parent_span` - Optional parent span to link this span to.
-   `messages` - Messages being processed in this cycle.
-   `custom_trace_attributes` - Optional mapping of custom trace attributes to include in the span.
-   `**kwargs` - Additional attributes to add to the span.

**Returns**:

The created span, or None if tracing is not enabled.

#### end\_event\_loop\_cycle\_span

```python
def end_event_loop_cycle_span(
        span: Span,
        message: Message,
        tool_result_message: Message | None = None) -> None
```

Defined in: [src/strands/telemetry/tracer.py:548](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L548)

End an event loop cycle span with results.

**Arguments**:

-   `span` - The span to end.
-   `message` - The message response from this cycle.
-   `tool_result_message` - Optional tool result message if a tool was called.

#### start\_agent\_span

```python
def start_agent_span(messages: Messages,
                     agent_name: str,
                     model_id: str | None = None,
                     tools: list | None = None,
                     custom_trace_attributes: Mapping[str, AttributeValue]
                     | None = None,
                     tools_config: dict | None = None,
                     **kwargs: Any) -> Span
```

Defined in: [src/strands/telemetry/tracer.py:590](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L590)

Start a new span for an agent invocation.

**Arguments**:

-   `messages` - List of messages being sent to the agent.
-   `agent_name` - Name of the agent.
-   `model_id` - Optional model identifier.
-   `tools` - Optional list of tools being used.
-   `custom_trace_attributes` - Optional mapping of custom trace attributes to include in the span.
-   `tools_config` - Optional dictionary of tool configurations.
-   `**kwargs` - Additional attributes to add to the span.

**Returns**:

The created span, or None if tracing is not enabled.

#### end\_agent\_span

```python
def end_agent_span(span: Span,
                   response: AgentResult | None = None,
                   error: Exception | None = None) -> None
```

Defined in: [src/strands/telemetry/tracer.py:649](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L649)

End an agent span with results and metrics.

**Arguments**:

-   `span` - The span to end.
-   `response` - The response from the agent.
-   `error` - Any error that occurred.

#### start\_multiagent\_span

```python
def start_multiagent_span(
    task: MultiAgentInput,
    instance: str,
    custom_trace_attributes: Mapping[str, AttributeValue] | None = None
) -> Span
```

Defined in: [src/strands/telemetry/tracer.py:719](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L719)

Start a new span for swarm invocation.

#### end\_swarm\_span

```python
def end_swarm_span(span: Span, result: str | None = None) -> None
```

Defined in: [src/strands/telemetry/tracer.py:760](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L760)

End a swarm span with results.

#### get\_tracer

```python
def get_tracer() -> Tracer
```

Defined in: [src/strands/telemetry/tracer.py:935](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L935)

Get or create the global tracer.

**Returns**:

The global tracer instance.

#### serialize

```python
def serialize(obj: Any) -> str
```

Defined in: [src/strands/telemetry/tracer.py:949](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/tracer.py#L949)

Serialize an object to JSON with consistent settings.

**Arguments**:

-   `obj` - The object to serialize

**Returns**:

JSON string representation of the object