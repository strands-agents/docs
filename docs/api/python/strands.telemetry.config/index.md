OpenTelemetry configuration and setup utilities for Strands agents.

This module provides centralized configuration and initialization functionality for OpenTelemetry components and other telemetry infrastructure shared across Strands applications.

#### get\_otel\_resource

```python
def get_otel_resource() -> Resource
```

Defined in: [src/strands/telemetry/config.py:27](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/config.py#L27)

Create a standard OpenTelemetry resource with service information.

**Returns**:

Resource object with standard service information.

## StrandsTelemetry

```python
class StrandsTelemetry()
```

Defined in: [src/strands/telemetry/config.py:47](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/config.py#L47)

OpenTelemetry configuration and setup for Strands applications.

Automatically initializes a tracer provider with text map propagators. Trace exporters (console, OTLP) can be set up individually using dedicated methods that support method chaining for convenient configuration.

**Arguments**:

-   `tracer_provider` - Optional pre-configured SDKTracerProvider. If None, a new one will be created and set as the global tracer provider.
    
    Environment Variables: Environment variables are handled by the underlying OpenTelemetry SDK:
    
    -   OTEL\_EXPORTER\_OTLP\_ENDPOINT: OTLP endpoint URL
    -   OTEL\_EXPORTER\_OTLP\_HEADERS: Headers for OTLP requests
    -   OTEL\_SERVICE\_NAME: Overrides resource service name

**Examples**:

Quick setup with method chaining:

> > > StrandsTelemetry().setup\_console\_exporter().setup\_otlp\_exporter()

Using a custom tracer provider:

> > > StrandsTelemetry(tracer\_provider=my\_provider).setup\_console\_exporter()

Step-by-step configuration:

> > > telemetry = StrandsTelemetry() telemetry.setup\_console\_exporter() telemetry.setup\_otlp\_exporter()

To setup global meter provider

> > > telemetry.setup\_meter(enable\_console\_exporter=True, enable\_otlp\_exporter=True) # default are False

**Notes**:

-   The tracer provider is automatically initialized upon instantiation
-   When no tracer\_provider is provided, the instance sets itself as the global provider
-   Exporters must be explicitly configured using the setup methods
-   Failed exporter configurations are logged but do not raise exceptions
-   All setup methods return self to enable method chaining

#### \_\_init\_\_

```python
def __init__(tracer_provider: SDKTracerProvider | None = None) -> None
```

Defined in: [src/strands/telemetry/config.py:87](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/config.py#L87)

Initialize the StrandsTelemetry instance.

**Arguments**:

-   `tracer_provider` - Optional pre-configured tracer provider. If None, a new one will be created and set as global.
    
    The instance is ready to use immediately after initialization, though trace exporters must be configured separately using the setup methods.
    

#### setup\_console\_exporter

```python
def setup_console_exporter(**kwargs: Any) -> "StrandsTelemetry"
```

Defined in: [src/strands/telemetry/config.py:126](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/config.py#L126)

Set up console exporter for the tracer provider.

**Arguments**:

-   `**kwargs` - Optional keyword arguments passed directly to OpenTelemetry’s ConsoleSpanExporter initializer.

**Returns**:

-   `self` - Enables method chaining.
    
    This method configures a SimpleSpanProcessor with a ConsoleSpanExporter, allowing trace data to be output to the console. Any additional keyword arguments provided will be forwarded to the ConsoleSpanExporter.
    

#### setup\_otlp\_exporter

```python
def setup_otlp_exporter(**kwargs: Any) -> "StrandsTelemetry"
```

Defined in: [src/strands/telemetry/config.py:148](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/config.py#L148)

Set up OTLP exporter for the tracer provider.

**Arguments**:

-   `**kwargs` - Optional keyword arguments passed directly to OpenTelemetry’s OTLPSpanExporter initializer.

**Returns**:

-   `self` - Enables method chaining.
    
    This method configures a BatchSpanProcessor with an OTLPSpanExporter, allowing trace data to be exported to an OTLP endpoint. Any additional keyword arguments provided will be forwarded to the OTLPSpanExporter.
    

#### setup\_meter

```python
def setup_meter(enable_console_exporter: bool = False,
                enable_otlp_exporter: bool = False) -> "StrandsTelemetry"
```

Defined in: [src/strands/telemetry/config.py:173](https://github.com/strands-agents/sdk-python/blob/main/src/strands/telemetry/config.py#L173)

Initialize the OpenTelemetry Meter.