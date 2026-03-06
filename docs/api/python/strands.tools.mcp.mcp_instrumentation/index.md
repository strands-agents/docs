OpenTelemetry instrumentation for Model Context Protocol (MCP) tracing.

Enables distributed tracing across MCP client-server boundaries by injecting OpenTelemetry context into MCP request metadata (\_meta field) and extracting it on the server side, creating unified traces that span from agent calls through MCP tool executions.

Based on: [https://github.com/traceloop/openllmetry/tree/main/packages/opentelemetry-instrumentation-mcp](https://github.com/traceloop/openllmetry/tree/main/packages/opentelemetry-instrumentation-mcp) Related issue: [https://github.com/modelcontextprotocol/modelcontextprotocol/issues/246](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/246)

## ItemWithContext

```python
@dataclass(slots=True, frozen=True)
class ItemWithContext()
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:27](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L27)

Wrapper for items that need to carry OpenTelemetry context.

Used to preserve tracing context across async boundaries in MCP sessions, ensuring that distributed traces remain connected even when messages are processed asynchronously.

**Attributes**:

-   `item` - The original item being wrapped
-   `ctx` - The OpenTelemetry context associated with the item

#### mcp\_instrumentation

```python
def mcp_instrumentation() -> None
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:43](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L43)

Apply OpenTelemetry instrumentation patches to MCP components.

This function instruments three key areas of MCP communication:

1.  Client-side: Injects tracing context into tool call requests
2.  Transport-level: Extracts context from incoming messages
3.  Session-level: Manages bidirectional context flow

The patches enable distributed tracing by:

-   Adding OpenTelemetry context to the \_meta field of MCP requests
-   Extracting and activating context on the server side
-   Preserving context across async message processing boundaries

This function is idempotent - multiple calls will not accumulate wrappers.

## TransportContextExtractingReader

```python
class TransportContextExtractingReader(ObjectProxy)
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:185](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L185)

A proxy reader that extracts OpenTelemetry context from MCP messages.

Wraps an async message stream reader to automatically extract and activate OpenTelemetry context from the \_meta field of incoming MCP requests. This enables server-side trace continuation from client-injected context.

The reader handles both SessionMessage and JSONRPCMessage formats, and supports both dict and Pydantic model parameter structures.

#### \_\_init\_\_

```python
def __init__(wrapped: Any) -> None
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:196](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L196)

Initialize the context-extracting reader.

**Arguments**:

-   `wrapped` - The original async stream reader to wrap

#### \_\_aenter\_\_

```python
async def __aenter__() -> Any
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:204](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L204)

Enter the async context manager by delegating to the wrapped object.

#### \_\_aexit\_\_

```python
async def __aexit__(exc_type: Any, exc_value: Any, traceback: Any) -> Any
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:208](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L208)

Exit the async context manager by delegating to the wrapped object.

#### \_\_aiter\_\_

```python
async def __aiter__() -> AsyncGenerator[Any, None]
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:212](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L212)

Iterate over messages, extracting and activating context as needed.

For each incoming message, checks if it contains tracing context in the \_meta field. If found, extracts and activates the context for the duration of message processing, then properly detaches it.

**Yields**:

Messages from the wrapped stream, processed under the appropriate OpenTelemetry context

## SessionContextSavingWriter

```python
class SessionContextSavingWriter(ObjectProxy)
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:254](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L254)

A proxy writer that preserves OpenTelemetry context with outgoing items.

Wraps an async message stream writer to capture the current OpenTelemetry context and associate it with outgoing items. This enables context preservation across async boundaries in MCP session processing.

#### \_\_init\_\_

```python
def __init__(wrapped: Any) -> None
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:262](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L262)

Initialize the context-saving writer.

**Arguments**:

-   `wrapped` - The original async stream writer to wrap

#### \_\_aenter\_\_

```python
async def __aenter__() -> Any
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:270](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L270)

Enter the async context manager by delegating to the wrapped object.

#### \_\_aexit\_\_

```python
async def __aexit__(exc_type: Any, exc_value: Any, traceback: Any) -> Any
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:274](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L274)

Exit the async context manager by delegating to the wrapped object.

#### send

```python
async def send(item: Any) -> Any
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:278](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L278)

Send an item while preserving the current OpenTelemetry context.

Captures the current context and wraps the item with it, enabling the receiving side to restore the appropriate tracing context.

**Arguments**:

-   `item` - The item to send through the stream

**Returns**:

Result of sending the wrapped item

## SessionContextAttachingReader

```python
class SessionContextAttachingReader(ObjectProxy)
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:294](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L294)

A proxy reader that restores OpenTelemetry context from wrapped items.

Wraps an async message stream reader to detect ItemWithContext instances and restore their associated OpenTelemetry context during processing. This completes the context preservation cycle started by SessionContextSavingWriter.

#### \_\_init\_\_

```python
def __init__(wrapped: Any) -> None
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:302](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L302)

Initialize the context-attaching reader.

**Arguments**:

-   `wrapped` - The original async stream reader to wrap

#### \_\_aenter\_\_

```python
async def __aenter__() -> Any
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:310](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L310)

Enter the async context manager by delegating to the wrapped object.

#### \_\_aexit\_\_

```python
async def __aexit__(exc_type: Any, exc_value: Any, traceback: Any) -> Any
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:314](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L314)

Exit the async context manager by delegating to the wrapped object.

#### \_\_aiter\_\_

```python
async def __aiter__() -> AsyncGenerator[Any, None]
```

Defined in: [src/strands/tools/mcp/mcp\_instrumentation.py:318](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_instrumentation.py#L318)

Iterate over items, restoring context for ItemWithContext instances.

For items wrapped with context, temporarily activates the associated OpenTelemetry context during processing, then properly detaches it. Regular items are yielded without context modification.

**Yields**:

Unwrapped items processed under their associated OpenTelemetry context