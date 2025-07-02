# `strands.handlers`

Various handlers for performing custom actions on agent state.

Examples include:

- Processing tool invocations
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

## `strands.handlers.tool_handler`

This module provides handlers for managing tool invocations.

### `AgentToolHandler`

Bases: `ToolHandler`

Handler for processing tool invocations in agent.

This class implements the ToolHandler interface and provides functionality for looking up tools in a registry and invoking them with the appropriate parameters.

Source code in `strands/handlers/tool_handler.py`

```
class AgentToolHandler(ToolHandler):
    """Handler for processing tool invocations in agent.

    This class implements the ToolHandler interface and provides functionality for looking up tools in a registry and
    invoking them with the appropriate parameters.
    """

    def __init__(self, tool_registry: ToolRegistry) -> None:
        """Initialize handler.

        Args:
            tool_registry: Registry of available tools.
        """
        self.tool_registry = tool_registry

    def preprocess(
        self,
        tool: ToolUse,
        tool_config: ToolConfig,
        **kwargs: Any,
    ) -> Optional[ToolResult]:
        """Preprocess a tool before invocation (not implemented).

        Args:
            tool: The tool use object to preprocess.
            tool_config: Configuration for the tool.
            **kwargs: Additional keyword arguments.

        Returns:
            Result of preprocessing, if any.
        """
        pass

    def process(
        self,
        tool: Any,
        *,
        model: Model,
        system_prompt: Optional[str],
        messages: List[Any],
        tool_config: Any,
        callback_handler: Any,
        **kwargs: Any,
    ) -> Any:
        """Process a tool invocation.

        Looks up the tool in the registry and invokes it with the provided parameters.

        Args:
            tool: The tool object to process, containing name and parameters.
            model: The model being used for the agent.
            system_prompt: The system prompt for the agent.
            messages: The conversation history.
            tool_config: Configuration for the tool.
            callback_handler: Callback for processing events as they happen.
            **kwargs: Additional keyword arguments passed to the tool.

        Returns:
            The result of the tool invocation, or an error response if the tool fails or is not found.
        """
        logger.debug("tool=<%s> | invoking", tool)
        tool_use_id = tool["toolUseId"]
        tool_name = tool["name"]

        # Get the tool info
        tool_info = self.tool_registry.dynamic_tools.get(tool_name)
        tool_func = tool_info if tool_info is not None else self.tool_registry.registry.get(tool_name)

        try:
            # Check if tool exists
            if not tool_func:
                logger.error(
                    "tool_name=<%s>, available_tools=<%s> | tool not found in registry",
                    tool_name,
                    list(self.tool_registry.registry.keys()),
                )
                return {
                    "toolUseId": tool_use_id,
                    "status": "error",
                    "content": [{"text": f"Unknown tool: {tool_name}"}],
                }
            # Add standard arguments to kwargs for Python tools
            kwargs.update(
                {
                    "model": model,
                    "system_prompt": system_prompt,
                    "messages": messages,
                    "tool_config": tool_config,
                    "callback_handler": callback_handler,
                }
            )

            return tool_func.invoke(tool, **kwargs)

        except Exception as e:
            logger.exception("tool_name=<%s> | failed to process tool", tool_name)
            return {
                "toolUseId": tool_use_id,
                "status": "error",
                "content": [{"text": f"Error: {str(e)}"}],
            }

```

#### `__init__(tool_registry)`

Initialize handler.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_registry` | `ToolRegistry` | Registry of available tools. | *required* |

Source code in `strands/handlers/tool_handler.py`

```
def __init__(self, tool_registry: ToolRegistry) -> None:
    """Initialize handler.

    Args:
        tool_registry: Registry of available tools.
    """
    self.tool_registry = tool_registry

```

#### `preprocess(tool, tool_config, **kwargs)`

Preprocess a tool before invocation (not implemented).

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool` | `ToolUse` | The tool use object to preprocess. | *required* | | `tool_config` | `ToolConfig` | Configuration for the tool. | *required* | | `**kwargs` | `Any` | Additional keyword arguments. | `{}` |

Returns:

| Type | Description | | --- | --- | | `Optional[ToolResult]` | Result of preprocessing, if any. |

Source code in `strands/handlers/tool_handler.py`

```
def preprocess(
    self,
    tool: ToolUse,
    tool_config: ToolConfig,
    **kwargs: Any,
) -> Optional[ToolResult]:
    """Preprocess a tool before invocation (not implemented).

    Args:
        tool: The tool use object to preprocess.
        tool_config: Configuration for the tool.
        **kwargs: Additional keyword arguments.

    Returns:
        Result of preprocessing, if any.
    """
    pass

```

#### `process(tool, *, model, system_prompt, messages, tool_config, callback_handler, **kwargs)`

Process a tool invocation.

Looks up the tool in the registry and invokes it with the provided parameters.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool` | `Any` | The tool object to process, containing name and parameters. | *required* | | `model` | `Model` | The model being used for the agent. | *required* | | `system_prompt` | `Optional[str]` | The system prompt for the agent. | *required* | | `messages` | `List[Any]` | The conversation history. | *required* | | `tool_config` | `Any` | Configuration for the tool. | *required* | | `callback_handler` | `Any` | Callback for processing events as they happen. | *required* | | `**kwargs` | `Any` | Additional keyword arguments passed to the tool. | `{}` |

Returns:

| Type | Description | | --- | --- | | `Any` | The result of the tool invocation, or an error response if the tool fails or is not found. |

Source code in `strands/handlers/tool_handler.py`

```
def process(
    self,
    tool: Any,
    *,
    model: Model,
    system_prompt: Optional[str],
    messages: List[Any],
    tool_config: Any,
    callback_handler: Any,
    **kwargs: Any,
) -> Any:
    """Process a tool invocation.

    Looks up the tool in the registry and invokes it with the provided parameters.

    Args:
        tool: The tool object to process, containing name and parameters.
        model: The model being used for the agent.
        system_prompt: The system prompt for the agent.
        messages: The conversation history.
        tool_config: Configuration for the tool.
        callback_handler: Callback for processing events as they happen.
        **kwargs: Additional keyword arguments passed to the tool.

    Returns:
        The result of the tool invocation, or an error response if the tool fails or is not found.
    """
    logger.debug("tool=<%s> | invoking", tool)
    tool_use_id = tool["toolUseId"]
    tool_name = tool["name"]

    # Get the tool info
    tool_info = self.tool_registry.dynamic_tools.get(tool_name)
    tool_func = tool_info if tool_info is not None else self.tool_registry.registry.get(tool_name)

    try:
        # Check if tool exists
        if not tool_func:
            logger.error(
                "tool_name=<%s>, available_tools=<%s> | tool not found in registry",
                tool_name,
                list(self.tool_registry.registry.keys()),
            )
            return {
                "toolUseId": tool_use_id,
                "status": "error",
                "content": [{"text": f"Unknown tool: {tool_name}"}],
            }
        # Add standard arguments to kwargs for Python tools
        kwargs.update(
            {
                "model": model,
                "system_prompt": system_prompt,
                "messages": messages,
                "tool_config": tool_config,
                "callback_handler": callback_handler,
            }
        )

        return tool_func.invoke(tool, **kwargs)

    except Exception as e:
        logger.exception("tool_name=<%s> | failed to process tool", tool_name)
        return {
            "toolUseId": tool_use_id,
            "status": "error",
            "content": [{"text": f"Error: {str(e)}"}],
        }

```
