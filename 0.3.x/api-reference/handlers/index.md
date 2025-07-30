# `strands.handlers`

Various handlers for performing custom actions on agent state.

Examples include:

- Displaying events from the event stream

## `strands.handlers.callback_handler`

This module provides handlers for formatting and displaying events from the agent.

### `CompositeCallbackHandler`

Class-based callback handler that combines multiple callback handlers.

This handler allows multiple callback handlers to be invoked for the same events, enabling different processing or output formats for the same stream data.

Source code in `strands/handlers/callback_handler.py`

```
class CompositeCallbackHandler:
    """Class-based callback handler that combines multiple callback handlers.

    This handler allows multiple callback handlers to be invoked for the same events,
    enabling different processing or output formats for the same stream data.
    """

    def __init__(self, *handlers: Callable) -> None:
        """Initialize handler."""
        self.handlers = handlers

    def __call__(self, **kwargs: Any) -> None:
        """Invoke all handlers in the chain."""
        for handler in self.handlers:
            handler(**kwargs)

```

#### `__call__(**kwargs)`

Invoke all handlers in the chain.

Source code in `strands/handlers/callback_handler.py`

```
def __call__(self, **kwargs: Any) -> None:
    """Invoke all handlers in the chain."""
    for handler in self.handlers:
        handler(**kwargs)

```

#### `__init__(*handlers)`

Initialize handler.

Source code in `strands/handlers/callback_handler.py`

```
def __init__(self, *handlers: Callable) -> None:
    """Initialize handler."""
    self.handlers = handlers

```

### `PrintingCallbackHandler`

Handler for streaming text output and tool invocations to stdout.

Source code in `strands/handlers/callback_handler.py`

```
class PrintingCallbackHandler:
    """Handler for streaming text output and tool invocations to stdout."""

    def __init__(self) -> None:
        """Initialize handler."""
        self.tool_count = 0
        self.previous_tool_use = None

    def __call__(self, **kwargs: Any) -> None:
        """Stream text output and tool invocations to stdout.

        Args:
            **kwargs: Callback event data including:
                - reasoningText (Optional[str]): Reasoning text to print if provided.
                - data (str): Text content to stream.
                - complete (bool): Whether this is the final chunk of a response.
                - current_tool_use (dict): Information about the current tool being used.
        """
        reasoningText = kwargs.get("reasoningText", False)
        data = kwargs.get("data", "")
        complete = kwargs.get("complete", False)
        current_tool_use = kwargs.get("current_tool_use", {})

        if reasoningText:
            print(reasoningText, end="")

        if data:
            print(data, end="" if not complete else "\n")

        if current_tool_use and current_tool_use.get("name"):
            tool_name = current_tool_use.get("name", "Unknown tool")
            if self.previous_tool_use != current_tool_use:
                self.previous_tool_use = current_tool_use
                self.tool_count += 1
                print(f"\nTool #{self.tool_count}: {tool_name}")

        if complete and data:
            print("\n")

```

#### `__call__(**kwargs)`

Stream text output and tool invocations to stdout.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `**kwargs` | `Any` | Callback event data including: - reasoningText (Optional[str]): Reasoning text to print if provided. - data (str): Text content to stream. - complete (bool): Whether this is the final chunk of a response. - current_tool_use (dict): Information about the current tool being used. | `{}` |

Source code in `strands/handlers/callback_handler.py`

```
def __call__(self, **kwargs: Any) -> None:
    """Stream text output and tool invocations to stdout.

    Args:
        **kwargs: Callback event data including:
            - reasoningText (Optional[str]): Reasoning text to print if provided.
            - data (str): Text content to stream.
            - complete (bool): Whether this is the final chunk of a response.
            - current_tool_use (dict): Information about the current tool being used.
    """
    reasoningText = kwargs.get("reasoningText", False)
    data = kwargs.get("data", "")
    complete = kwargs.get("complete", False)
    current_tool_use = kwargs.get("current_tool_use", {})

    if reasoningText:
        print(reasoningText, end="")

    if data:
        print(data, end="" if not complete else "\n")

    if current_tool_use and current_tool_use.get("name"):
        tool_name = current_tool_use.get("name", "Unknown tool")
        if self.previous_tool_use != current_tool_use:
            self.previous_tool_use = current_tool_use
            self.tool_count += 1
            print(f"\nTool #{self.tool_count}: {tool_name}")

    if complete and data:
        print("\n")

```

#### `__init__()`

Initialize handler.

Source code in `strands/handlers/callback_handler.py`

```
def __init__(self) -> None:
    """Initialize handler."""
    self.tool_count = 0
    self.previous_tool_use = None

```

### `null_callback_handler(**_kwargs)`

Callback handler that discards all output.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `**_kwargs` | `Any` | Event data (ignored). | `{}` |

Source code in `strands/handlers/callback_handler.py`

```
def null_callback_handler(**_kwargs: Any) -> None:
    """Callback handler that discards all output.

    Args:
        **_kwargs: Event data (ignored).
    """
    return None

```
