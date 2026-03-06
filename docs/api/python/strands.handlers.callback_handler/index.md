This module provides handlers for formatting and displaying events from the agent.

## PrintingCallbackHandler

```python
class PrintingCallbackHandler()
```

Defined in: [src/strands/handlers/callback\_handler.py:7](https://github.com/strands-agents/sdk-python/blob/main/src/strands/handlers/callback_handler.py#L7)

Handler for streaming text output and tool invocations to stdout.

#### \_\_init\_\_

```python
def __init__(verbose_tool_use: bool = True) -> None
```

Defined in: [src/strands/handlers/callback\_handler.py:10](https://github.com/strands-agents/sdk-python/blob/main/src/strands/handlers/callback_handler.py#L10)

Initialize handler.

**Arguments**:

-   `verbose_tool_use` - Print out verbose information about tool calls.

#### \_\_call\_\_

```python
def __call__(**kwargs: Any) -> None
```

Defined in: [src/strands/handlers/callback\_handler.py:19](https://github.com/strands-agents/sdk-python/blob/main/src/strands/handlers/callback_handler.py#L19)

Stream text output and tool invocations to stdout.

**Arguments**:

-   `**kwargs` - Callback event data including:
    -   reasoningText (Optional\[str\]): Reasoning text to print if provided.
    -   data (str): Text content to stream.
    -   complete (bool): Whether this is the final chunk of a response.
    -   event (dict): ModelStreamChunkEvent.

## CompositeCallbackHandler

```python
class CompositeCallbackHandler()
```

Defined in: [src/strands/handlers/callback\_handler.py:50](https://github.com/strands-agents/sdk-python/blob/main/src/strands/handlers/callback_handler.py#L50)

Class-based callback handler that combines multiple callback handlers.

This handler allows multiple callback handlers to be invoked for the same events, enabling different processing or output formats for the same stream data.

#### \_\_init\_\_

```python
def __init__(*handlers: Callable) -> None
```

Defined in: [src/strands/handlers/callback\_handler.py:57](https://github.com/strands-agents/sdk-python/blob/main/src/strands/handlers/callback_handler.py#L57)

Initialize handler.

#### \_\_call\_\_

```python
def __call__(**kwargs: Any) -> None
```

Defined in: [src/strands/handlers/callback\_handler.py:61](https://github.com/strands-agents/sdk-python/blob/main/src/strands/handlers/callback_handler.py#L61)

Invoke all handlers in the chain.

#### null\_callback\_handler

```python
def null_callback_handler(**_kwargs: Any) -> None
```

Defined in: [src/strands/handlers/callback\_handler.py:67](https://github.com/strands-agents/sdk-python/blob/main/src/strands/handlers/callback_handler.py#L67)

Callback handler that discards all output.

**Arguments**:

-   `**_kwargs` - Event data (ignored).