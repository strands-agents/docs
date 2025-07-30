# `strands.tools`

Agent tool interfaces and utilities.

This module provides the core functionality for creating, managing, and executing tools through agents.

## `strands.tools.tools`

Core tool implementations.

This module provides the base classes for all tool implementations in the SDK, including function-based tools and Python module-based tools, as well as utilities for validating tool uses and normalizing tool schemas.

### `InvalidToolUseNameException`

Bases: `Exception`

Exception raised when a tool use has an invalid name.

Source code in `strands/tools/tools.py`

```
class InvalidToolUseNameException(Exception):
    """Exception raised when a tool use has an invalid name."""

    pass

```

### `PythonAgentTool`

Bases: `AgentTool`

Tool implementation for Python-based tools.

This class handles tools implemented as Python functions, providing a simple interface for executing Python code as SDK tools.

Source code in `strands/tools/tools.py`

```
class PythonAgentTool(AgentTool):
    """Tool implementation for Python-based tools.

    This class handles tools implemented as Python functions, providing a simple interface for executing Python code
    as SDK tools.
    """

    _tool_name: str
    _tool_spec: ToolSpec
    _tool_func: ToolFunc

    def __init__(self, tool_name: str, tool_spec: ToolSpec, tool_func: ToolFunc) -> None:
        """Initialize a Python-based tool.

        Args:
            tool_name: Unique identifier for the tool.
            tool_spec: Tool specification defining parameters and behavior.
            tool_func: Python function to execute when the tool is invoked.
        """
        super().__init__()

        self._tool_name = tool_name
        self._tool_spec = tool_spec
        self._tool_func = tool_func

    @property
    def tool_name(self) -> str:
        """Get the name of the tool.

        Returns:
            The name of the tool.
        """
        return self._tool_name

    @property
    def tool_spec(self) -> ToolSpec:
        """Get the tool specification for this Python-based tool.

        Returns:
            The tool specification.
        """
        return self._tool_spec

    @property
    def tool_type(self) -> str:
        """Identifies this as a Python-based tool implementation.

        Returns:
            "python".
        """
        return "python"

    @override
    async def stream(self, tool_use: ToolUse, invocation_state: dict[str, Any], **kwargs: Any) -> ToolGenerator:
        """Stream the Python function with the given tool use request.

        Args:
            tool_use: The tool use request.
            invocation_state: Context for the tool invocation, including agent state.
            **kwargs: Additional keyword arguments for future extensibility.

        Yields:
            Tool events with the last being the tool result.
        """
        if inspect.iscoroutinefunction(self._tool_func):
            result = await self._tool_func(tool_use, **invocation_state)
        else:
            result = await asyncio.to_thread(self._tool_func, tool_use, **invocation_state)

        yield result

```

#### `tool_name`

Get the name of the tool.

Returns:

| Type | Description | | --- | --- | | `str` | The name of the tool. |

#### `tool_spec`

Get the tool specification for this Python-based tool.

Returns:

| Type | Description | | --- | --- | | `ToolSpec` | The tool specification. |

#### `tool_type`

Identifies this as a Python-based tool implementation.

Returns:

| Type | Description | | --- | --- | | `str` | "python". |

#### `__init__(tool_name, tool_spec, tool_func)`

Initialize a Python-based tool.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_name` | `str` | Unique identifier for the tool. | *required* | | `tool_spec` | `ToolSpec` | Tool specification defining parameters and behavior. | *required* | | `tool_func` | `ToolFunc` | Python function to execute when the tool is invoked. | *required* |

Source code in `strands/tools/tools.py`

```
def __init__(self, tool_name: str, tool_spec: ToolSpec, tool_func: ToolFunc) -> None:
    """Initialize a Python-based tool.

    Args:
        tool_name: Unique identifier for the tool.
        tool_spec: Tool specification defining parameters and behavior.
        tool_func: Python function to execute when the tool is invoked.
    """
    super().__init__()

    self._tool_name = tool_name
    self._tool_spec = tool_spec
    self._tool_func = tool_func

```

#### `stream(tool_use, invocation_state, **kwargs)`

Stream the Python function with the given tool use request.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_use` | `ToolUse` | The tool use request. | *required* | | `invocation_state` | `dict[str, Any]` | Context for the tool invocation, including agent state. | *required* | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Yields:

| Type | Description | | --- | --- | | `ToolGenerator` | Tool events with the last being the tool result. |

Source code in `strands/tools/tools.py`

```
@override
async def stream(self, tool_use: ToolUse, invocation_state: dict[str, Any], **kwargs: Any) -> ToolGenerator:
    """Stream the Python function with the given tool use request.

    Args:
        tool_use: The tool use request.
        invocation_state: Context for the tool invocation, including agent state.
        **kwargs: Additional keyword arguments for future extensibility.

    Yields:
        Tool events with the last being the tool result.
    """
    if inspect.iscoroutinefunction(self._tool_func):
        result = await self._tool_func(tool_use, **invocation_state)
    else:
        result = await asyncio.to_thread(self._tool_func, tool_use, **invocation_state)

    yield result

```

### `normalize_schema(schema)`

Normalize a JSON schema to match expectations.

This function recursively processes nested objects to preserve the complete schema structure. Uses a copy-then-normalize approach to preserve all original schema properties.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `schema` | `dict[str, Any]` | The schema to normalize. | *required* |

Returns:

| Type | Description | | --- | --- | | `dict[str, Any]` | The normalized schema. |

Source code in `strands/tools/tools.py`

```
def normalize_schema(schema: dict[str, Any]) -> dict[str, Any]:
    """Normalize a JSON schema to match expectations.

    This function recursively processes nested objects to preserve the complete schema structure.
    Uses a copy-then-normalize approach to preserve all original schema properties.

    Args:
        schema: The schema to normalize.

    Returns:
        The normalized schema.
    """
    # Start with a complete copy to preserve all existing properties
    normalized = schema.copy()

    # Ensure essential structure exists
    normalized.setdefault("type", "object")
    normalized.setdefault("properties", {})
    normalized.setdefault("required", [])

    # Process properties recursively
    if "properties" in normalized:
        properties = normalized["properties"]
        for prop_name, prop_def in properties.items():
            normalized["properties"][prop_name] = _normalize_property(prop_name, prop_def)

    return normalized

```

### `normalize_tool_spec(tool_spec)`

Normalize a complete tool specification by transforming its inputSchema.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_spec` | `ToolSpec` | The tool specification to normalize. | *required* |

Returns:

| Type | Description | | --- | --- | | `ToolSpec` | The normalized tool specification. |

Source code in `strands/tools/tools.py`

```
def normalize_tool_spec(tool_spec: ToolSpec) -> ToolSpec:
    """Normalize a complete tool specification by transforming its inputSchema.

    Args:
        tool_spec: The tool specification to normalize.

    Returns:
        The normalized tool specification.
    """
    normalized = tool_spec.copy()

    # Handle inputSchema
    if "inputSchema" in normalized:
        if isinstance(normalized["inputSchema"], dict):
            if "json" in normalized["inputSchema"]:
                # Schema is already in correct format, just normalize inner schema
                normalized["inputSchema"]["json"] = normalize_schema(normalized["inputSchema"]["json"])
            else:
                # Convert direct schema to proper format
                normalized["inputSchema"] = {"json": normalize_schema(normalized["inputSchema"])}

    return normalized

```

### `validate_tool_use(tool)`

Validate a tool use request.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool` | `ToolUse` | The tool use to validate. | *required* |

Source code in `strands/tools/tools.py`

```
def validate_tool_use(tool: ToolUse) -> None:
    """Validate a tool use request.

    Args:
        tool: The tool use to validate.
    """
    validate_tool_use_name(tool)

```

### `validate_tool_use_name(tool)`

Validate the name of a tool use.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool` | `ToolUse` | The tool use to validate. | *required* |

Raises:

| Type | Description | | --- | --- | | `InvalidToolUseNameException` | If the tool name is invalid. |

Source code in `strands/tools/tools.py`

```
def validate_tool_use_name(tool: ToolUse) -> None:
    """Validate the name of a tool use.

    Args:
        tool: The tool use to validate.

    Raises:
        InvalidToolUseNameException: If the tool name is invalid.
    """
    # We need to fix some typing here, because we don't actually expect a ToolUse, but dict[str, Any]
    if "name" not in tool:
        message = "tool name missing"  # type: ignore[unreachable]
        logger.warning(message)
        raise InvalidToolUseNameException(message)

    tool_name = tool["name"]
    tool_name_pattern = r"^[a-zA-Z0-9_\-]{1,}$"
    tool_name_max_length = 64
    valid_name_pattern = bool(re.match(tool_name_pattern, tool_name))
    tool_name_len = len(tool_name)

    if not valid_name_pattern:
        message = f"tool_name=<{tool_name}> | invalid tool name pattern"
        logger.warning(message)
        raise InvalidToolUseNameException(message)

    if tool_name_len > tool_name_max_length:
        message = f"tool_name=<{tool_name}>, tool_name_max_length=<{tool_name_max_length}> | invalid tool name length"
        logger.warning(message)
        raise InvalidToolUseNameException(message)

```

## `strands.tools.decorator`

Tool decorator for SDK.

This module provides the @tool decorator that transforms Python functions into SDK Agent tools with automatic metadata extraction and validation.

The @tool decorator performs several functions:

1. Extracts function metadata (name, description, parameters) from docstrings and type hints
1. Generates a JSON schema for input validation
1. Handles two different calling patterns:
1. Standard function calls (func(arg1, arg2))
1. Tool use calls (agent.my_tool(param1="hello", param2=123))
1. Provides error handling and result formatting
1. Works with both standalone functions and class methods

Example

```
from strands import Agent, tool

@tool
def my_tool(param1: str, param2: int = 42) -> dict:
    '''
    Tool description - explain what it does.

    #Args:
        param1: Description of first parameter.
        param2: Description of second parameter (default: 42).

    #Returns:
        A dictionary with the results.
    '''
    result = do_something(param1, param2)
    return {
        "status": "success",
        "content": [{"text": f"Result: {result}"}]
    }

agent = Agent(tools=[my_tool])
agent.my_tool(param1="hello", param2=123)

```

### `DecoratedFunctionTool`

Bases: `AgentTool`, `Generic[P, R]`

An AgentTool that wraps a function that was decorated with @tool.

This class adapts Python functions decorated with @tool to the AgentTool interface. It handles both direct function calls and tool use invocations, maintaining the function's original behavior while adding tool capabilities.

The class is generic over the function's parameter types (P) and return type (R) to maintain type safety.

Source code in `strands/tools/decorator.py`

````
class DecoratedFunctionTool(AgentTool, Generic[P, R]):
    """An AgentTool that wraps a function that was decorated with @tool.

    This class adapts Python functions decorated with @tool to the AgentTool interface. It handles both direct
    function calls and tool use invocations, maintaining the function's
    original behavior while adding tool capabilities.

    The class is generic over the function's parameter types (P) and return type (R) to maintain type safety.
    """

    _tool_name: str
    _tool_spec: ToolSpec
    _tool_func: Callable[P, R]
    _metadata: FunctionToolMetadata

    def __init__(
        self,
        tool_name: str,
        tool_spec: ToolSpec,
        tool_func: Callable[P, R],
        metadata: FunctionToolMetadata,
    ):
        """Initialize the decorated function tool.

        Args:
            tool_name: The name to use for the tool (usually the function name).
            tool_spec: The tool specification containing metadata for Agent integration.
            tool_func: The original function being decorated.
            metadata: The FunctionToolMetadata object with extracted function information.
        """
        super().__init__()

        self._tool_name = tool_name
        self._tool_spec = tool_spec
        self._tool_func = tool_func
        self._metadata = metadata

        functools.update_wrapper(wrapper=self, wrapped=self._tool_func)

    def __get__(self, instance: Any, obj_type: Optional[Type] = None) -> "DecoratedFunctionTool[P, R]":
        """Descriptor protocol implementation for proper method binding.

        This method enables the decorated function to work correctly when used as a class method.
        It binds the instance to the function call when accessed through an instance.

        Args:
            instance: The instance through which the descriptor is accessed, or None when accessed through the class.
            obj_type: The class through which the descriptor is accessed.

        Returns:
            A new DecoratedFunctionTool with the instance bound to the function if accessed through an instance,
            otherwise returns self.

        Example:
            ```python
            class MyClass:
                @tool
                def my_tool():
                    ...

            instance = MyClass()
            # instance of DecoratedFunctionTool that works as you'd expect
            tool = instance.my_tool
            ```
        """
        if instance is not None and not inspect.ismethod(self._tool_func):
            # Create a bound method
            tool_func = self._tool_func.__get__(instance, instance.__class__)
            return DecoratedFunctionTool(self._tool_name, self._tool_spec, tool_func, self._metadata)

        return self

    def __call__(self, *args: P.args, **kwargs: P.kwargs) -> R:
        """Call the original function with the provided arguments.

        This method enables the decorated function to be called directly with its original signature,
        preserving the normal function call behavior.

        Args:
            *args: Positional arguments to pass to the function.
            **kwargs: Keyword arguments to pass to the function.

        Returns:
            The result of the original function call.
        """
        return self._tool_func(*args, **kwargs)

    @property
    def tool_name(self) -> str:
        """Get the name of the tool.

        Returns:
            The tool name as a string.
        """
        return self._tool_name

    @property
    def tool_spec(self) -> ToolSpec:
        """Get the tool specification.

        Returns:
            The tool specification dictionary containing metadata for Agent integration.
        """
        return self._tool_spec

    @property
    def tool_type(self) -> str:
        """Get the type of the tool.

        Returns:
            The string "function" indicating this is a function-based tool.
        """
        return "function"

    @override
    async def stream(self, tool_use: ToolUse, invocation_state: dict[str, Any], **kwargs: Any) -> ToolGenerator:
        """Stream the tool with a tool use specification.

        This method handles tool use streams from a Strands Agent. It validates the input,
        calls the function, and formats the result according to the expected tool result format.

        Key operations:

        1. Extract tool use ID and input parameters
        2. Validate input against the function's expected parameters
        3. Call the function with validated input
        4. Format the result as a standard tool result
        5. Handle and format any errors that occur

        Args:
            tool_use: The tool use specification from the Agent.
            invocation_state: Context for the tool invocation, including agent state.
            **kwargs: Additional keyword arguments for future extensibility.

        Yields:
            Tool events with the last being the tool result.
        """
        # This is a tool use call - process accordingly
        tool_use_id = tool_use.get("toolUseId", "unknown")
        tool_input = tool_use.get("input", {})

        try:
            # Validate input against the Pydantic model
            validated_input = self._metadata.validate_input(tool_input)

            # Pass along the agent if provided and expected by the function
            if "agent" in invocation_state and "agent" in self._metadata.signature.parameters:
                validated_input["agent"] = invocation_state.get("agent")

            # "Too few arguments" expected, hence the type ignore
            if inspect.iscoroutinefunction(self._tool_func):
                result = await self._tool_func(**validated_input)  # type: ignore
            else:
                result = await asyncio.to_thread(self._tool_func, **validated_input)  # type: ignore

            # FORMAT THE RESULT for Strands Agent
            if isinstance(result, dict) and "status" in result and "content" in result:
                # Result is already in the expected format, just add toolUseId
                result["toolUseId"] = tool_use_id
                yield result
            else:
                # Wrap any other return value in the standard format
                # Always include at least one content item for consistency
                yield {
                    "toolUseId": tool_use_id,
                    "status": "success",
                    "content": [{"text": str(result)}],
                }

        except ValueError as e:
            # Special handling for validation errors
            error_msg = str(e)
            yield {
                "toolUseId": tool_use_id,
                "status": "error",
                "content": [{"text": f"Error: {error_msg}"}],
            }
        except Exception as e:
            # Return error result with exception details for any other error
            error_type = type(e).__name__
            error_msg = str(e)
            yield {
                "toolUseId": tool_use_id,
                "status": "error",
                "content": [{"text": f"Error: {error_type} - {error_msg}"}],
            }

    @property
    def supports_hot_reload(self) -> bool:
        """Check if this tool supports automatic reloading when modified.

        Returns:
            Always true for function-based tools.
        """
        return True

    @override
    def get_display_properties(self) -> dict[str, str]:
        """Get properties to display in UI representations.

        Returns:
            Function properties (e.g., function name).
        """
        properties = super().get_display_properties()
        properties["Function"] = self._tool_func.__name__
        return properties

````

#### `supports_hot_reload`

Check if this tool supports automatic reloading when modified.

Returns:

| Type | Description | | --- | --- | | `bool` | Always true for function-based tools. |

#### `tool_name`

Get the name of the tool.

Returns:

| Type | Description | | --- | --- | | `str` | The tool name as a string. |

#### `tool_spec`

Get the tool specification.

Returns:

| Type | Description | | --- | --- | | `ToolSpec` | The tool specification dictionary containing metadata for Agent integration. |

#### `tool_type`

Get the type of the tool.

Returns:

| Type | Description | | --- | --- | | `str` | The string "function" indicating this is a function-based tool. |

#### `__call__(*args, **kwargs)`

Call the original function with the provided arguments.

This method enables the decorated function to be called directly with its original signature, preserving the normal function call behavior.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `*args` | `args` | Positional arguments to pass to the function. | `()` | | `**kwargs` | `kwargs` | Keyword arguments to pass to the function. | `{}` |

Returns:

| Type | Description | | --- | --- | | `R` | The result of the original function call. |

Source code in `strands/tools/decorator.py`

```
def __call__(self, *args: P.args, **kwargs: P.kwargs) -> R:
    """Call the original function with the provided arguments.

    This method enables the decorated function to be called directly with its original signature,
    preserving the normal function call behavior.

    Args:
        *args: Positional arguments to pass to the function.
        **kwargs: Keyword arguments to pass to the function.

    Returns:
        The result of the original function call.
    """
    return self._tool_func(*args, **kwargs)

```

#### `__get__(instance, obj_type=None)`

Descriptor protocol implementation for proper method binding.

This method enables the decorated function to work correctly when used as a class method. It binds the instance to the function call when accessed through an instance.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `instance` | `Any` | The instance through which the descriptor is accessed, or None when accessed through the class. | *required* | | `obj_type` | `Optional[Type]` | The class through which the descriptor is accessed. | `None` |

Returns:

| Type | Description | | --- | --- | | `DecoratedFunctionTool[P, R]` | A new DecoratedFunctionTool with the instance bound to the function if accessed through an instance, | | `DecoratedFunctionTool[P, R]` | otherwise returns self. |

Example

```
class MyClass:
    @tool
    def my_tool():
        ...

instance = MyClass()
# instance of DecoratedFunctionTool that works as you'd expect
tool = instance.my_tool

```

Source code in `strands/tools/decorator.py`

````
def __get__(self, instance: Any, obj_type: Optional[Type] = None) -> "DecoratedFunctionTool[P, R]":
    """Descriptor protocol implementation for proper method binding.

    This method enables the decorated function to work correctly when used as a class method.
    It binds the instance to the function call when accessed through an instance.

    Args:
        instance: The instance through which the descriptor is accessed, or None when accessed through the class.
        obj_type: The class through which the descriptor is accessed.

    Returns:
        A new DecoratedFunctionTool with the instance bound to the function if accessed through an instance,
        otherwise returns self.

    Example:
        ```python
        class MyClass:
            @tool
            def my_tool():
                ...

        instance = MyClass()
        # instance of DecoratedFunctionTool that works as you'd expect
        tool = instance.my_tool
        ```
    """
    if instance is not None and not inspect.ismethod(self._tool_func):
        # Create a bound method
        tool_func = self._tool_func.__get__(instance, instance.__class__)
        return DecoratedFunctionTool(self._tool_name, self._tool_spec, tool_func, self._metadata)

    return self

````

#### `__init__(tool_name, tool_spec, tool_func, metadata)`

Initialize the decorated function tool.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_name` | `str` | The name to use for the tool (usually the function name). | *required* | | `tool_spec` | `ToolSpec` | The tool specification containing metadata for Agent integration. | *required* | | `tool_func` | `Callable[P, R]` | The original function being decorated. | *required* | | `metadata` | `FunctionToolMetadata` | The FunctionToolMetadata object with extracted function information. | *required* |

Source code in `strands/tools/decorator.py`

```
def __init__(
    self,
    tool_name: str,
    tool_spec: ToolSpec,
    tool_func: Callable[P, R],
    metadata: FunctionToolMetadata,
):
    """Initialize the decorated function tool.

    Args:
        tool_name: The name to use for the tool (usually the function name).
        tool_spec: The tool specification containing metadata for Agent integration.
        tool_func: The original function being decorated.
        metadata: The FunctionToolMetadata object with extracted function information.
    """
    super().__init__()

    self._tool_name = tool_name
    self._tool_spec = tool_spec
    self._tool_func = tool_func
    self._metadata = metadata

    functools.update_wrapper(wrapper=self, wrapped=self._tool_func)

```

#### `get_display_properties()`

Get properties to display in UI representations.

Returns:

| Type | Description | | --- | --- | | `dict[str, str]` | Function properties (e.g., function name). |

Source code in `strands/tools/decorator.py`

```
@override
def get_display_properties(self) -> dict[str, str]:
    """Get properties to display in UI representations.

    Returns:
        Function properties (e.g., function name).
    """
    properties = super().get_display_properties()
    properties["Function"] = self._tool_func.__name__
    return properties

```

#### `stream(tool_use, invocation_state, **kwargs)`

Stream the tool with a tool use specification.

This method handles tool use streams from a Strands Agent. It validates the input, calls the function, and formats the result according to the expected tool result format.

Key operations:

1. Extract tool use ID and input parameters
1. Validate input against the function's expected parameters
1. Call the function with validated input
1. Format the result as a standard tool result
1. Handle and format any errors that occur

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_use` | `ToolUse` | The tool use specification from the Agent. | *required* | | `invocation_state` | `dict[str, Any]` | Context for the tool invocation, including agent state. | *required* | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Yields:

| Type | Description | | --- | --- | | `ToolGenerator` | Tool events with the last being the tool result. |

Source code in `strands/tools/decorator.py`

```
@override
async def stream(self, tool_use: ToolUse, invocation_state: dict[str, Any], **kwargs: Any) -> ToolGenerator:
    """Stream the tool with a tool use specification.

    This method handles tool use streams from a Strands Agent. It validates the input,
    calls the function, and formats the result according to the expected tool result format.

    Key operations:

    1. Extract tool use ID and input parameters
    2. Validate input against the function's expected parameters
    3. Call the function with validated input
    4. Format the result as a standard tool result
    5. Handle and format any errors that occur

    Args:
        tool_use: The tool use specification from the Agent.
        invocation_state: Context for the tool invocation, including agent state.
        **kwargs: Additional keyword arguments for future extensibility.

    Yields:
        Tool events with the last being the tool result.
    """
    # This is a tool use call - process accordingly
    tool_use_id = tool_use.get("toolUseId", "unknown")
    tool_input = tool_use.get("input", {})

    try:
        # Validate input against the Pydantic model
        validated_input = self._metadata.validate_input(tool_input)

        # Pass along the agent if provided and expected by the function
        if "agent" in invocation_state and "agent" in self._metadata.signature.parameters:
            validated_input["agent"] = invocation_state.get("agent")

        # "Too few arguments" expected, hence the type ignore
        if inspect.iscoroutinefunction(self._tool_func):
            result = await self._tool_func(**validated_input)  # type: ignore
        else:
            result = await asyncio.to_thread(self._tool_func, **validated_input)  # type: ignore

        # FORMAT THE RESULT for Strands Agent
        if isinstance(result, dict) and "status" in result and "content" in result:
            # Result is already in the expected format, just add toolUseId
            result["toolUseId"] = tool_use_id
            yield result
        else:
            # Wrap any other return value in the standard format
            # Always include at least one content item for consistency
            yield {
                "toolUseId": tool_use_id,
                "status": "success",
                "content": [{"text": str(result)}],
            }

    except ValueError as e:
        # Special handling for validation errors
        error_msg = str(e)
        yield {
            "toolUseId": tool_use_id,
            "status": "error",
            "content": [{"text": f"Error: {error_msg}"}],
        }
    except Exception as e:
        # Return error result with exception details for any other error
        error_type = type(e).__name__
        error_msg = str(e)
        yield {
            "toolUseId": tool_use_id,
            "status": "error",
            "content": [{"text": f"Error: {error_type} - {error_msg}"}],
        }

```

### `FunctionToolMetadata`

Helper class to extract and manage function metadata for tool decoration.

This class handles the extraction of metadata from Python functions including:

- Function name and description from docstrings
- Parameter names, types, and descriptions
- Return type information
- Creation of Pydantic models for input validation

The extracted metadata is used to generate a tool specification that can be used by Strands Agent to understand and validate tool usage.

Source code in `strands/tools/decorator.py`

```
class FunctionToolMetadata:
    """Helper class to extract and manage function metadata for tool decoration.

    This class handles the extraction of metadata from Python functions including:

    - Function name and description from docstrings
    - Parameter names, types, and descriptions
    - Return type information
    - Creation of Pydantic models for input validation

    The extracted metadata is used to generate a tool specification that can be used by Strands Agent to understand and
    validate tool usage.
    """

    def __init__(self, func: Callable[..., Any]) -> None:
        """Initialize with the function to process.

        Args:
            func: The function to extract metadata from.
                 Can be a standalone function or a class method.
        """
        self.func = func
        self.signature = inspect.signature(func)
        self.type_hints = get_type_hints(func)

        # Parse the docstring with docstring_parser
        doc_str = inspect.getdoc(func) or ""
        self.doc = docstring_parser.parse(doc_str)

        # Get parameter descriptions from parsed docstring
        self.param_descriptions = {
            param.arg_name: param.description or f"Parameter {param.arg_name}" for param in self.doc.params
        }

        # Create a Pydantic model for validation
        self.input_model = self._create_input_model()

    def _create_input_model(self) -> Type[BaseModel]:
        """Create a Pydantic model from function signature for input validation.

        This method analyzes the function's signature, type hints, and docstring to create a Pydantic model that can
        validate input data before passing it to the function.

        Special parameters like 'self', 'cls', and 'agent' are excluded from the model.

        Returns:
            A Pydantic BaseModel class customized for the function's parameters.
        """
        field_definitions: dict[str, Any] = {}

        for name, param in self.signature.parameters.items():
            # Skip special parameters
            if name in ("self", "cls", "agent"):
                continue

            # Get parameter type and default
            param_type = self.type_hints.get(name, Any)
            default = ... if param.default is inspect.Parameter.empty else param.default
            description = self.param_descriptions.get(name, f"Parameter {name}")

            # Create Field with description and default
            field_definitions[name] = (param_type, Field(default=default, description=description))

        # Create model name based on function name
        model_name = f"{self.func.__name__.capitalize()}Tool"

        # Create and return the model
        if field_definitions:
            return create_model(model_name, **field_definitions)
        else:
            # Handle case with no parameters
            return create_model(model_name)

    def extract_metadata(self) -> ToolSpec:
        """Extract metadata from the function to create a tool specification.

        This method analyzes the function to create a standardized tool specification that Strands Agent can use to
        understand and interact with the tool.

        The specification includes:

        - name: The function name (or custom override)
        - description: The function's docstring
        - inputSchema: A JSON schema describing the expected parameters

        Returns:
            A dictionary containing the tool specification.
        """
        func_name = self.func.__name__

        # Extract function description from docstring, preserving paragraph breaks
        description = inspect.getdoc(self.func)
        if description:
            description = description.strip()
        else:
            description = func_name

        # Get schema directly from the Pydantic model
        input_schema = self.input_model.model_json_schema()

        # Clean up Pydantic-specific schema elements
        self._clean_pydantic_schema(input_schema)

        # Create tool specification
        tool_spec: ToolSpec = {"name": func_name, "description": description, "inputSchema": {"json": input_schema}}

        return tool_spec

    def _clean_pydantic_schema(self, schema: dict[str, Any]) -> None:
        """Clean up Pydantic schema to match Strands' expected format.

        Pydantic's JSON schema output includes several elements that aren't needed for Strands Agent tools and could
        cause validation issues. This method removes those elements and simplifies complex type structures.

        Key operations:

        1. Remove Pydantic-specific metadata (title, $defs, etc.)
        2. Process complex types like Union and Optional to simpler formats
        3. Handle nested property structures recursively

        Args:
            schema: The Pydantic-generated JSON schema to clean up (modified in place).
        """
        # Remove Pydantic metadata
        keys_to_remove = ["title", "additionalProperties"]
        for key in keys_to_remove:
            if key in schema:
                del schema[key]

        # Process properties to clean up anyOf and similar structures
        if "properties" in schema:
            for _prop_name, prop_schema in schema["properties"].items():
                # Handle anyOf constructs (common for Optional types)
                if "anyOf" in prop_schema:
                    any_of = prop_schema["anyOf"]
                    # Handle Optional[Type] case (represented as anyOf[Type, null])
                    if len(any_of) == 2 and any(item.get("type") == "null" for item in any_of):
                        # Find the non-null type
                        for item in any_of:
                            if item.get("type") != "null":
                                # Copy the non-null properties to the main schema
                                for k, v in item.items():
                                    prop_schema[k] = v
                                # Remove the anyOf construct
                                del prop_schema["anyOf"]
                                break

                # Clean up nested properties recursively
                if "properties" in prop_schema:
                    self._clean_pydantic_schema(prop_schema)

                # Remove any remaining Pydantic metadata from properties
                for key in keys_to_remove:
                    if key in prop_schema:
                        del prop_schema[key]

    def validate_input(self, input_data: dict[str, Any]) -> dict[str, Any]:
        """Validate input data using the Pydantic model.

        This method ensures that the input data meets the expected schema before it's passed to the actual function. It
        converts the data to the correct types when possible and raises informative errors when not.

        Args:
            input_data: A dictionary of parameter names and values to validate.

        Returns:
            A dictionary with validated and converted parameter values.

        Raises:
            ValueError: If the input data fails validation, with details about what failed.
        """
        try:
            # Validate with Pydantic model
            validated = self.input_model(**input_data)

            # Return as dict
            return validated.model_dump()
        except Exception as e:
            # Re-raise with more detailed error message
            error_msg = str(e)
            raise ValueError(f"Validation failed for input parameters: {error_msg}") from e

```

#### `__init__(func)`

Initialize with the function to process.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `func` | `Callable[..., Any]` | The function to extract metadata from. Can be a standalone function or a class method. | *required* |

Source code in `strands/tools/decorator.py`

```
def __init__(self, func: Callable[..., Any]) -> None:
    """Initialize with the function to process.

    Args:
        func: The function to extract metadata from.
             Can be a standalone function or a class method.
    """
    self.func = func
    self.signature = inspect.signature(func)
    self.type_hints = get_type_hints(func)

    # Parse the docstring with docstring_parser
    doc_str = inspect.getdoc(func) or ""
    self.doc = docstring_parser.parse(doc_str)

    # Get parameter descriptions from parsed docstring
    self.param_descriptions = {
        param.arg_name: param.description or f"Parameter {param.arg_name}" for param in self.doc.params
    }

    # Create a Pydantic model for validation
    self.input_model = self._create_input_model()

```

#### `extract_metadata()`

Extract metadata from the function to create a tool specification.

This method analyzes the function to create a standardized tool specification that Strands Agent can use to understand and interact with the tool.

The specification includes:

- name: The function name (or custom override)
- description: The function's docstring
- inputSchema: A JSON schema describing the expected parameters

Returns:

| Type | Description | | --- | --- | | `ToolSpec` | A dictionary containing the tool specification. |

Source code in `strands/tools/decorator.py`

```
def extract_metadata(self) -> ToolSpec:
    """Extract metadata from the function to create a tool specification.

    This method analyzes the function to create a standardized tool specification that Strands Agent can use to
    understand and interact with the tool.

    The specification includes:

    - name: The function name (or custom override)
    - description: The function's docstring
    - inputSchema: A JSON schema describing the expected parameters

    Returns:
        A dictionary containing the tool specification.
    """
    func_name = self.func.__name__

    # Extract function description from docstring, preserving paragraph breaks
    description = inspect.getdoc(self.func)
    if description:
        description = description.strip()
    else:
        description = func_name

    # Get schema directly from the Pydantic model
    input_schema = self.input_model.model_json_schema()

    # Clean up Pydantic-specific schema elements
    self._clean_pydantic_schema(input_schema)

    # Create tool specification
    tool_spec: ToolSpec = {"name": func_name, "description": description, "inputSchema": {"json": input_schema}}

    return tool_spec

```

#### `validate_input(input_data)`

Validate input data using the Pydantic model.

This method ensures that the input data meets the expected schema before it's passed to the actual function. It converts the data to the correct types when possible and raises informative errors when not.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `input_data` | `dict[str, Any]` | A dictionary of parameter names and values to validate. | *required* |

Returns:

| Type | Description | | --- | --- | | `dict[str, Any]` | A dictionary with validated and converted parameter values. |

Raises:

| Type | Description | | --- | --- | | `ValueError` | If the input data fails validation, with details about what failed. |

Source code in `strands/tools/decorator.py`

```
def validate_input(self, input_data: dict[str, Any]) -> dict[str, Any]:
    """Validate input data using the Pydantic model.

    This method ensures that the input data meets the expected schema before it's passed to the actual function. It
    converts the data to the correct types when possible and raises informative errors when not.

    Args:
        input_data: A dictionary of parameter names and values to validate.

    Returns:
        A dictionary with validated and converted parameter values.

    Raises:
        ValueError: If the input data fails validation, with details about what failed.
    """
    try:
        # Validate with Pydantic model
        validated = self.input_model(**input_data)

        # Return as dict
        return validated.model_dump()
    except Exception as e:
        # Re-raise with more detailed error message
        error_msg = str(e)
        raise ValueError(f"Validation failed for input parameters: {error_msg}") from e

```

### `tool(func=None, description=None, inputSchema=None, name=None)`

```
tool(__func: Callable[P, R]) -> DecoratedFunctionTool[P, R]

```

```
tool(description: Optional[str] = None, inputSchema: Optional[JSONSchema] = None, name: Optional[str] = None) -> Callable[[Callable[P, R]], DecoratedFunctionTool[P, R]]

```

Decorator that transforms a Python function into a Strands tool.

This decorator seamlessly enables a function to be called both as a regular Python function and as a Strands tool. It extracts metadata from the function's signature, docstring, and type hints to generate an OpenAPI-compatible tool specification.

When decorated, a function:

1. Still works as a normal function when called directly with arguments
1. Processes tool use API calls when provided with a tool use dictionary
1. Validates inputs against the function's type hints and parameter spec
1. Formats return values according to the expected Strands tool result format
1. Provides automatic error handling and reporting

The decorator can be used in two ways:

- As a simple decorator: `@tool`
- With parameters: `@tool(name="custom_name", description="Custom description")`

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `func` | `Optional[Callable[P, R]]` | The function to decorate. When used as a simple decorator, this is the function being decorated. When used with parameters, this will be None. | `None` | | `description` | `Optional[str]` | Optional custom description to override the function's docstring. | `None` | | `inputSchema` | `Optional[JSONSchema]` | Optional custom JSON schema to override the automatically generated schema. | `None` | | `name` | `Optional[str]` | Optional custom name to override the function's name. | `None` |

Returns:

| Type | Description | | --- | --- | | `Union[DecoratedFunctionTool[P, R], Callable[[Callable[P, R]], DecoratedFunctionTool[P, R]]]` | An AgentTool that also mimics the original function when invoked |

Example

```
@tool
def my_tool(name: str, count: int = 1) -> str:
    # Does something useful with the provided parameters.
    #
    # Parameters:
    #   name: The name to process
    #   count: Number of times to process (default: 1)
    #
    # Returns:
    #   A message with the result
    return f"Processed {name} {count} times"

agent = Agent(tools=[my_tool])
agent.my_tool(name="example", count=3)
# Returns: {
#   "toolUseId": "123",
#   "status": "success",
#   "content": [{"text": "Processed example 3 times"}]
# }

```

Example with parameters

```
@tool(name="custom_tool", description="A tool with a custom name and description")
def my_tool(name: str, count: int = 1) -> str:
    return f"Processed {name} {count} times"

```

Source code in `strands/tools/decorator.py`

````
def tool(  # type: ignore
    func: Optional[Callable[P, R]] = None,
    description: Optional[str] = None,
    inputSchema: Optional[JSONSchema] = None,
    name: Optional[str] = None,
) -> Union[DecoratedFunctionTool[P, R], Callable[[Callable[P, R]], DecoratedFunctionTool[P, R]]]:
    """Decorator that transforms a Python function into a Strands tool.

    This decorator seamlessly enables a function to be called both as a regular Python function and as a Strands tool.
    It extracts metadata from the function's signature, docstring, and type hints to generate an OpenAPI-compatible tool
    specification.

    When decorated, a function:

    1. Still works as a normal function when called directly with arguments
    2. Processes tool use API calls when provided with a tool use dictionary
    3. Validates inputs against the function's type hints and parameter spec
    4. Formats return values according to the expected Strands tool result format
    5. Provides automatic error handling and reporting

    The decorator can be used in two ways:
    - As a simple decorator: `@tool`
    - With parameters: `@tool(name="custom_name", description="Custom description")`

    Args:
        func: The function to decorate. When used as a simple decorator, this is the function being decorated.
            When used with parameters, this will be None.
        description: Optional custom description to override the function's docstring.
        inputSchema: Optional custom JSON schema to override the automatically generated schema.
        name: Optional custom name to override the function's name.

    Returns:
        An AgentTool that also mimics the original function when invoked

    Example:
        ```python
        @tool
        def my_tool(name: str, count: int = 1) -> str:
            # Does something useful with the provided parameters.
            #
            # Parameters:
            #   name: The name to process
            #   count: Number of times to process (default: 1)
            #
            # Returns:
            #   A message with the result
            return f"Processed {name} {count} times"

        agent = Agent(tools=[my_tool])
        agent.my_tool(name="example", count=3)
        # Returns: {
        #   "toolUseId": "123",
        #   "status": "success",
        #   "content": [{"text": "Processed example 3 times"}]
        # }
        ```

    Example with parameters:
        ```python
        @tool(name="custom_tool", description="A tool with a custom name and description")
        def my_tool(name: str, count: int = 1) -> str:
            return f"Processed {name} {count} times"
        ```
    """

    def decorator(f: T) -> "DecoratedFunctionTool[P, R]":
        # Create function tool metadata
        tool_meta = FunctionToolMetadata(f)
        tool_spec = tool_meta.extract_metadata()
        if name is not None:
            tool_spec["name"] = name
        if description is not None:
            tool_spec["description"] = description
        if inputSchema is not None:
            tool_spec["inputSchema"] = inputSchema

        tool_name = tool_spec.get("name", f.__name__)

        if not isinstance(tool_name, str):
            raise ValueError(f"Tool name must be a string, got {type(tool_name)}")

        return DecoratedFunctionTool(tool_name, tool_spec, f, tool_meta)

    # Handle both @tool and @tool() syntax
    if func is None:
        # Need to ignore type-checking here since it's hard to represent the support
        # for both flows using the type system
        return decorator

    return decorator(func)

````

## `strands.tools.executor`

Tool execution functionality for the event loop.

### `run_tools(handler, tool_uses, event_loop_metrics, invalid_tool_use_ids, tool_results, cycle_trace, parent_span=None)`

Execute tools concurrently.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `handler` | `RunToolHandler` | Tool handler processing function. | *required* | | `tool_uses` | `list[ToolUse]` | List of tool uses to execute. | *required* | | `event_loop_metrics` | `EventLoopMetrics` | Metrics collection object. | *required* | | `invalid_tool_use_ids` | `list[str]` | List of invalid tool use IDs. | *required* | | `tool_results` | `list[ToolResult]` | List to populate with tool results. | *required* | | `cycle_trace` | `Trace` | Parent trace for the current cycle. | *required* | | `parent_span` | `Optional[Span]` | Parent span for the current cycle. | `None` |

Yields:

| Type | Description | | --- | --- | | `ToolGenerator` | Events of the tool stream. Tool results are appended to tool_results. |

Source code in `strands/tools/executor.py`

```
async def run_tools(
    handler: RunToolHandler,
    tool_uses: list[ToolUse],
    event_loop_metrics: EventLoopMetrics,
    invalid_tool_use_ids: list[str],
    tool_results: list[ToolResult],
    cycle_trace: Trace,
    parent_span: Optional[trace_api.Span] = None,
) -> ToolGenerator:
    """Execute tools concurrently.

    Args:
        handler: Tool handler processing function.
        tool_uses: List of tool uses to execute.
        event_loop_metrics: Metrics collection object.
        invalid_tool_use_ids: List of invalid tool use IDs.
        tool_results: List to populate with tool results.
        cycle_trace: Parent trace for the current cycle.
        parent_span: Parent span for the current cycle.

    Yields:
        Events of the tool stream. Tool results are appended to `tool_results`.
    """

    async def work(
        tool_use: ToolUse,
        worker_id: int,
        worker_queue: asyncio.Queue,
        worker_event: asyncio.Event,
        stop_event: object,
    ) -> ToolResult:
        tracer = get_tracer()
        tool_call_span = tracer.start_tool_call_span(tool_use, parent_span)

        tool_name = tool_use["name"]
        tool_trace = Trace(f"Tool: {tool_name}", parent_id=cycle_trace.id, raw_name=tool_name)
        tool_start_time = time.time()
        with trace_api.use_span(tool_call_span):
            try:
                async for event in handler(tool_use):
                    worker_queue.put_nowait((worker_id, event))
                    await worker_event.wait()
                    worker_event.clear()

                result = cast(ToolResult, event)
            finally:
                worker_queue.put_nowait((worker_id, stop_event))

            tool_success = result.get("status") == "success"
            tool_duration = time.time() - tool_start_time
            message = Message(role="user", content=[{"toolResult": result}])
            event_loop_metrics.add_tool_usage(tool_use, tool_duration, tool_trace, tool_success, message)
            cycle_trace.add_child(tool_trace)

            tracer.end_tool_call_span(tool_call_span, result)

        return result

    tool_uses = [tool_use for tool_use in tool_uses if tool_use.get("toolUseId") not in invalid_tool_use_ids]
    worker_queue: asyncio.Queue[tuple[int, Any]] = asyncio.Queue()
    worker_events = [asyncio.Event() for _ in tool_uses]
    stop_event = object()

    workers = [
        asyncio.create_task(work(tool_use, worker_id, worker_queue, worker_events[worker_id], stop_event))
        for worker_id, tool_use in enumerate(tool_uses)
    ]

    worker_count = len(workers)
    while worker_count:
        worker_id, event = await worker_queue.get()
        if event is stop_event:
            worker_count -= 1
            continue

        yield event
        worker_events[worker_id].set()

    tool_results.extend([worker.result() for worker in workers])

```

### `validate_and_prepare_tools(message, tool_uses, tool_results, invalid_tool_use_ids)`

Validate tool uses and prepare them for execution.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `message` | `Message` | Current message. | *required* | | `tool_uses` | `list[ToolUse]` | List to populate with tool uses. | *required* | | `tool_results` | `list[ToolResult]` | List to populate with tool results for invalid tools. | *required* | | `invalid_tool_use_ids` | `list[str]` | List to populate with invalid tool use IDs. | *required* |

Source code in `strands/tools/executor.py`

```
def validate_and_prepare_tools(
    message: Message,
    tool_uses: list[ToolUse],
    tool_results: list[ToolResult],
    invalid_tool_use_ids: list[str],
) -> None:
    """Validate tool uses and prepare them for execution.

    Args:
        message: Current message.
        tool_uses: List to populate with tool uses.
        tool_results: List to populate with tool results for invalid tools.
        invalid_tool_use_ids: List to populate with invalid tool use IDs.
    """
    # Extract tool uses from message
    for content in message["content"]:
        if isinstance(content, dict) and "toolUse" in content:
            tool_uses.append(content["toolUse"])

    # Validate tool uses
    # Avoid modifying original `tool_uses` variable during iteration
    tool_uses_copy = tool_uses.copy()
    for tool in tool_uses_copy:
        try:
            validate_tool_use(tool)
        except InvalidToolUseNameException as e:
            # Replace the invalid toolUse name and return invalid name error as ToolResult to the LLM as context
            tool_uses.remove(tool)
            tool["name"] = "INVALID_TOOL_NAME"
            invalid_tool_use_ids.append(tool["toolUseId"])
            tool_uses.append(tool)
            tool_results.append(
                {
                    "toolUseId": tool["toolUseId"],
                    "status": "error",
                    "content": [{"text": f"Error: {str(e)}"}],
                }
            )

```

## `strands.tools.loader`

Tool loading utilities.

### `ToolLoader`

Handles loading of tools from different sources.

Source code in `strands/tools/loader.py`

```
class ToolLoader:
    """Handles loading of tools from different sources."""

    @staticmethod
    def load_python_tool(tool_path: str, tool_name: str) -> AgentTool:
        """Load a Python tool module.

        Args:
            tool_path: Path to the Python tool file.
            tool_name: Name of the tool.

        Returns:
            Tool instance.

        Raises:
            AttributeError: If required attributes are missing from the tool module.
            ImportError: If there are issues importing the tool module.
            TypeError: If the tool function is not callable.
            ValueError: If function in module is not a valid tool.
            Exception: For other errors during tool loading.
        """
        try:
            # Check if tool_path is in the format "package.module:function"; but keep in mind windows whose file path
            # could have a colon so also ensure that it's not a file
            if not os.path.exists(tool_path) and ":" in tool_path:
                module_path, function_name = tool_path.rsplit(":", 1)
                logger.debug("tool_name=<%s>, module_path=<%s> | importing tool from path", function_name, module_path)

                try:
                    # Import the module
                    module = __import__(module_path, fromlist=["*"])

                    # Get the function
                    if not hasattr(module, function_name):
                        raise AttributeError(f"Module {module_path} has no function named {function_name}")

                    func = getattr(module, function_name)

                    if isinstance(func, DecoratedFunctionTool):
                        logger.debug(
                            "tool_name=<%s>, module_path=<%s> | found function-based tool", function_name, module_path
                        )
                        # mypy has problems converting between DecoratedFunctionTool <-> AgentTool
                        return cast(AgentTool, func)
                    else:
                        raise ValueError(
                            f"Function {function_name} in {module_path} is not a valid tool (missing @tool decorator)"
                        )

                except ImportError as e:
                    raise ImportError(f"Failed to import module {module_path}: {str(e)}") from e

            # Normal file-based tool loading
            abs_path = str(Path(tool_path).resolve())

            logger.debug("tool_path=<%s> | loading python tool from path", abs_path)

            # First load the module to get TOOL_SPEC and check for Lambda deployment
            spec = importlib.util.spec_from_file_location(tool_name, abs_path)
            if not spec:
                raise ImportError(f"Could not create spec for {tool_name}")
            if not spec.loader:
                raise ImportError(f"No loader available for {tool_name}")

            module = importlib.util.module_from_spec(spec)
            sys.modules[tool_name] = module
            spec.loader.exec_module(module)

            # First, check for function-based tools with @tool decorator
            for attr_name in dir(module):
                attr = getattr(module, attr_name)
                if isinstance(attr, DecoratedFunctionTool):
                    logger.debug(
                        "tool_name=<%s>, tool_path=<%s> | found function-based tool in path", attr_name, tool_path
                    )
                    # mypy has problems converting between DecoratedFunctionTool <-> AgentTool
                    return cast(AgentTool, attr)

            # If no function-based tools found, fall back to traditional module-level tool
            tool_spec = getattr(module, "TOOL_SPEC", None)
            if not tool_spec:
                raise AttributeError(
                    f"Tool {tool_name} missing TOOL_SPEC (neither at module level nor as a decorated function)"
                )

            # Standard local tool loading
            tool_func_name = tool_name
            if not hasattr(module, tool_func_name):
                raise AttributeError(f"Tool {tool_name} missing function {tool_func_name}")

            tool_func = getattr(module, tool_func_name)
            if not callable(tool_func):
                raise TypeError(f"Tool {tool_name} function is not callable")

            return PythonAgentTool(tool_name, tool_spec, tool_func)

        except Exception:
            logger.exception("tool_name=<%s>, sys_path=<%s> | failed to load python tool", tool_name, sys.path)
            raise

    @classmethod
    def load_tool(cls, tool_path: str, tool_name: str) -> AgentTool:
        """Load a tool based on its file extension.

        Args:
            tool_path: Path to the tool file.
            tool_name: Name of the tool.

        Returns:
            Tool instance.

        Raises:
            FileNotFoundError: If the tool file does not exist.
            ValueError: If the tool file has an unsupported extension.
            Exception: For other errors during tool loading.
        """
        ext = Path(tool_path).suffix.lower()
        abs_path = str(Path(tool_path).resolve())

        if not os.path.exists(abs_path):
            raise FileNotFoundError(f"Tool file not found: {abs_path}")

        try:
            if ext == ".py":
                return cls.load_python_tool(abs_path, tool_name)
            else:
                raise ValueError(f"Unsupported tool file type: {ext}")
        except Exception:
            logger.exception(
                "tool_name=<%s>, tool_path=<%s>, tool_ext=<%s>, cwd=<%s> | failed to load tool",
                tool_name,
                abs_path,
                ext,
                os.getcwd(),
            )
            raise

```

#### `load_python_tool(tool_path, tool_name)`

Load a Python tool module.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_path` | `str` | Path to the Python tool file. | *required* | | `tool_name` | `str` | Name of the tool. | *required* |

Returns:

| Type | Description | | --- | --- | | `AgentTool` | Tool instance. |

Raises:

| Type | Description | | --- | --- | | `AttributeError` | If required attributes are missing from the tool module. | | `ImportError` | If there are issues importing the tool module. | | `TypeError` | If the tool function is not callable. | | `ValueError` | If function in module is not a valid tool. | | `Exception` | For other errors during tool loading. |

Source code in `strands/tools/loader.py`

```
@staticmethod
def load_python_tool(tool_path: str, tool_name: str) -> AgentTool:
    """Load a Python tool module.

    Args:
        tool_path: Path to the Python tool file.
        tool_name: Name of the tool.

    Returns:
        Tool instance.

    Raises:
        AttributeError: If required attributes are missing from the tool module.
        ImportError: If there are issues importing the tool module.
        TypeError: If the tool function is not callable.
        ValueError: If function in module is not a valid tool.
        Exception: For other errors during tool loading.
    """
    try:
        # Check if tool_path is in the format "package.module:function"; but keep in mind windows whose file path
        # could have a colon so also ensure that it's not a file
        if not os.path.exists(tool_path) and ":" in tool_path:
            module_path, function_name = tool_path.rsplit(":", 1)
            logger.debug("tool_name=<%s>, module_path=<%s> | importing tool from path", function_name, module_path)

            try:
                # Import the module
                module = __import__(module_path, fromlist=["*"])

                # Get the function
                if not hasattr(module, function_name):
                    raise AttributeError(f"Module {module_path} has no function named {function_name}")

                func = getattr(module, function_name)

                if isinstance(func, DecoratedFunctionTool):
                    logger.debug(
                        "tool_name=<%s>, module_path=<%s> | found function-based tool", function_name, module_path
                    )
                    # mypy has problems converting between DecoratedFunctionTool <-> AgentTool
                    return cast(AgentTool, func)
                else:
                    raise ValueError(
                        f"Function {function_name} in {module_path} is not a valid tool (missing @tool decorator)"
                    )

            except ImportError as e:
                raise ImportError(f"Failed to import module {module_path}: {str(e)}") from e

        # Normal file-based tool loading
        abs_path = str(Path(tool_path).resolve())

        logger.debug("tool_path=<%s> | loading python tool from path", abs_path)

        # First load the module to get TOOL_SPEC and check for Lambda deployment
        spec = importlib.util.spec_from_file_location(tool_name, abs_path)
        if not spec:
            raise ImportError(f"Could not create spec for {tool_name}")
        if not spec.loader:
            raise ImportError(f"No loader available for {tool_name}")

        module = importlib.util.module_from_spec(spec)
        sys.modules[tool_name] = module
        spec.loader.exec_module(module)

        # First, check for function-based tools with @tool decorator
        for attr_name in dir(module):
            attr = getattr(module, attr_name)
            if isinstance(attr, DecoratedFunctionTool):
                logger.debug(
                    "tool_name=<%s>, tool_path=<%s> | found function-based tool in path", attr_name, tool_path
                )
                # mypy has problems converting between DecoratedFunctionTool <-> AgentTool
                return cast(AgentTool, attr)

        # If no function-based tools found, fall back to traditional module-level tool
        tool_spec = getattr(module, "TOOL_SPEC", None)
        if not tool_spec:
            raise AttributeError(
                f"Tool {tool_name} missing TOOL_SPEC (neither at module level nor as a decorated function)"
            )

        # Standard local tool loading
        tool_func_name = tool_name
        if not hasattr(module, tool_func_name):
            raise AttributeError(f"Tool {tool_name} missing function {tool_func_name}")

        tool_func = getattr(module, tool_func_name)
        if not callable(tool_func):
            raise TypeError(f"Tool {tool_name} function is not callable")

        return PythonAgentTool(tool_name, tool_spec, tool_func)

    except Exception:
        logger.exception("tool_name=<%s>, sys_path=<%s> | failed to load python tool", tool_name, sys.path)
        raise

```

#### `load_tool(tool_path, tool_name)`

Load a tool based on its file extension.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_path` | `str` | Path to the tool file. | *required* | | `tool_name` | `str` | Name of the tool. | *required* |

Returns:

| Type | Description | | --- | --- | | `AgentTool` | Tool instance. |

Raises:

| Type | Description | | --- | --- | | `FileNotFoundError` | If the tool file does not exist. | | `ValueError` | If the tool file has an unsupported extension. | | `Exception` | For other errors during tool loading. |

Source code in `strands/tools/loader.py`

```
@classmethod
def load_tool(cls, tool_path: str, tool_name: str) -> AgentTool:
    """Load a tool based on its file extension.

    Args:
        tool_path: Path to the tool file.
        tool_name: Name of the tool.

    Returns:
        Tool instance.

    Raises:
        FileNotFoundError: If the tool file does not exist.
        ValueError: If the tool file has an unsupported extension.
        Exception: For other errors during tool loading.
    """
    ext = Path(tool_path).suffix.lower()
    abs_path = str(Path(tool_path).resolve())

    if not os.path.exists(abs_path):
        raise FileNotFoundError(f"Tool file not found: {abs_path}")

    try:
        if ext == ".py":
            return cls.load_python_tool(abs_path, tool_name)
        else:
            raise ValueError(f"Unsupported tool file type: {ext}")
    except Exception:
        logger.exception(
            "tool_name=<%s>, tool_path=<%s>, tool_ext=<%s>, cwd=<%s> | failed to load tool",
            tool_name,
            abs_path,
            ext,
            os.getcwd(),
        )
        raise

```

## `strands.tools.registry`

Tool registry.

This module provides the central registry for all tools available to the agent, including discovery, validation, and invocation capabilities.

### `ToolRegistry`

Central registry for all tools available to the agent.

This class manages tool registration, validation, discovery, and invocation.

Source code in `strands/tools/registry.py`

```
class ToolRegistry:
    """Central registry for all tools available to the agent.

    This class manages tool registration, validation, discovery, and invocation.
    """

    def __init__(self) -> None:
        """Initialize the tool registry."""
        self.registry: Dict[str, AgentTool] = {}
        self.dynamic_tools: Dict[str, AgentTool] = {}
        self.tool_config: Optional[Dict[str, Any]] = None

    def process_tools(self, tools: List[Any]) -> List[str]:
        """Process tools list that can contain tool names, paths, imported modules, or functions.

        Args:
            tools: List of tool specifications.
                Can be:

                - String tool names (e.g., "calculator")
                - File paths (e.g., "/path/to/tool.py")
                - Imported Python modules (e.g., a module object)
                - Functions decorated with @tool
                - Dictionaries with name/path keys
                - Instance of an AgentTool

        Returns:
            List of tool names that were processed.
        """
        tool_names = []

        def add_tool(tool: Any) -> None:
            # Case 1: String file path
            if isinstance(tool, str):
                # Extract tool name from path
                tool_name = os.path.basename(tool).split(".")[0]
                self.load_tool_from_filepath(tool_name=tool_name, tool_path=tool)
                tool_names.append(tool_name)

            # Case 2: Dictionary with name and path
            elif isinstance(tool, dict) and "name" in tool and "path" in tool:
                self.load_tool_from_filepath(tool_name=tool["name"], tool_path=tool["path"])
                tool_names.append(tool["name"])

            # Case 3: Dictionary with path only
            elif isinstance(tool, dict) and "path" in tool:
                tool_name = os.path.basename(tool["path"]).split(".")[0]
                self.load_tool_from_filepath(tool_name=tool_name, tool_path=tool["path"])
                tool_names.append(tool_name)

            # Case 4: Imported Python module
            elif hasattr(tool, "__file__") and inspect.ismodule(tool):
                # Get the module file path
                module_path = tool.__file__
                # Extract the tool name from the module name
                tool_name = tool.__name__.split(".")[-1]

                # Check for TOOL_SPEC in module to validate it's a Strands tool
                if hasattr(tool, "TOOL_SPEC") and hasattr(tool, tool_name) and module_path:
                    self.load_tool_from_filepath(tool_name=tool_name, tool_path=module_path)
                    tool_names.append(tool_name)
                else:
                    function_tools = self._scan_module_for_tools(tool)
                    for function_tool in function_tools:
                        self.register_tool(function_tool)
                        tool_names.append(function_tool.tool_name)

                    if not function_tools:
                        logger.warning("tool_name=<%s>, module_path=<%s> | invalid agent tool", tool_name, module_path)

            # Case 5: AgentTools (which also covers @tool)
            elif isinstance(tool, AgentTool):
                self.register_tool(tool)
                tool_names.append(tool.tool_name)
            # Case 6: Nested iterable (list, tuple, etc.) - add each sub-tool
            elif isinstance(tool, Iterable) and not isinstance(tool, (str, bytes, bytearray)):
                for t in tool:
                    add_tool(t)
            else:
                logger.warning("tool=<%s> | unrecognized tool specification", tool)

        for a_tool in tools:
            add_tool(a_tool)

        return tool_names

    def load_tool_from_filepath(self, tool_name: str, tool_path: str) -> None:
        """Load a tool from a file path.

        Args:
            tool_name: Name of the tool.
            tool_path: Path to the tool file.

        Raises:
            FileNotFoundError: If the tool file is not found.
            ValueError: If the tool cannot be loaded.
        """
        from .loader import ToolLoader

        try:
            tool_path = expanduser(tool_path)
            if not os.path.exists(tool_path):
                raise FileNotFoundError(f"Tool file not found: {tool_path}")

            loaded_tool = ToolLoader.load_tool(tool_path, tool_name)
            loaded_tool.mark_dynamic()

            # Because we're explicitly registering the tool we don't need an allowlist
            self.register_tool(loaded_tool)
        except Exception as e:
            exception_str = str(e)
            logger.exception("tool_name=<%s> | failed to load tool", tool_name)
            raise ValueError(f"Failed to load tool {tool_name}: {exception_str}") from e

    def get_all_tools_config(self) -> Dict[str, Any]:
        """Dynamically generate tool configuration by combining built-in and dynamic tools.

        Returns:
            Dictionary containing all tool configurations.
        """
        tool_config = {}
        logger.debug("getting tool configurations")

        # Add all registered tools
        for tool_name, tool in self.registry.items():
            # Make a deep copy to avoid modifying the original
            spec = tool.tool_spec.copy()
            try:
                # Normalize the schema before validation
                spec = normalize_tool_spec(spec)
                self.validate_tool_spec(spec)
                tool_config[tool_name] = spec
                logger.debug("tool_name=<%s> | loaded tool config", tool_name)
            except ValueError as e:
                logger.warning("tool_name=<%s> | spec validation failed | %s", tool_name, e)

        # Add any dynamic tools
        for tool_name, tool in self.dynamic_tools.items():
            if tool_name not in tool_config:
                # Make a deep copy to avoid modifying the original
                spec = tool.tool_spec.copy()
                try:
                    # Normalize the schema before validation
                    spec = normalize_tool_spec(spec)
                    self.validate_tool_spec(spec)
                    tool_config[tool_name] = spec
                    logger.debug("tool_name=<%s> | loaded dynamic tool config", tool_name)
                except ValueError as e:
                    logger.warning("tool_name=<%s> | dynamic tool spec validation failed | %s", tool_name, e)

        logger.debug("tool_count=<%s> | tools configured", len(tool_config))
        return tool_config

    # mypy has problems converting between DecoratedFunctionTool <-> AgentTool
    def register_tool(self, tool: AgentTool) -> None:
        """Register a tool function with the given name.

        Args:
            tool: The tool to register.
        """
        logger.debug(
            "tool_name=<%s>, tool_type=<%s>, is_dynamic=<%s> | registering tool",
            tool.tool_name,
            tool.tool_type,
            tool.is_dynamic,
        )

        if self.registry.get(tool.tool_name) is None:
            normalized_name = tool.tool_name.replace("-", "_")

            matching_tools = [
                tool_name
                for (tool_name, tool) in self.registry.items()
                if tool_name.replace("-", "_") == normalized_name
            ]

            if matching_tools:
                raise ValueError(
                    f"Tool name '{tool.tool_name}' already exists as '{matching_tools[0]}'."
                    " Cannot add a duplicate tool which differs by a '-' or '_'"
                )

        # Register in main registry
        self.registry[tool.tool_name] = tool

        # Register in dynamic tools if applicable
        if tool.is_dynamic:
            self.dynamic_tools[tool.tool_name] = tool

            if not tool.supports_hot_reload:
                logger.debug("tool_name=<%s>, tool_type=<%s> | skipping hot reloading", tool.tool_name, tool.tool_type)
                return

            logger.debug(
                "tool_name=<%s>, tool_registry=<%s>, dynamic_tools=<%s> | tool registered",
                tool.tool_name,
                list(self.registry.keys()),
                list(self.dynamic_tools.keys()),
            )

    def get_tools_dirs(self) -> List[Path]:
        """Get all tool directory paths.

        Returns:
            A list of Path objects for current working directory's "./tools/".
        """
        # Current working directory's tools directory
        cwd_tools_dir = Path.cwd() / "tools"

        # Return all directories that exist
        tool_dirs = []
        for directory in [cwd_tools_dir]:
            if directory.exists() and directory.is_dir():
                tool_dirs.append(directory)
                logger.debug("tools_dir=<%s> | found tools directory", directory)
            else:
                logger.debug("tools_dir=<%s> | tools directory not found", directory)

        return tool_dirs

    def discover_tool_modules(self) -> Dict[str, Path]:
        """Discover available tool modules in all tools directories.

        Returns:
            Dictionary mapping tool names to their full paths.
        """
        tool_modules = {}
        tools_dirs = self.get_tools_dirs()

        for tools_dir in tools_dirs:
            logger.debug("tools_dir=<%s> | scanning", tools_dir)

            # Find Python tools
            for extension in ["*.py"]:
                for item in tools_dir.glob(extension):
                    if item.is_file() and not item.name.startswith("__"):
                        module_name = item.stem
                        # If tool already exists, newer paths take precedence
                        if module_name in tool_modules:
                            logger.debug("tools_dir=<%s>, module_name=<%s> | tool overridden", tools_dir, module_name)
                        tool_modules[module_name] = item

        logger.debug("tool_modules=<%s> | discovered", list(tool_modules.keys()))
        return tool_modules

    def reload_tool(self, tool_name: str) -> None:
        """Reload a specific tool module.

        Args:
            tool_name: Name of the tool to reload.

        Raises:
            FileNotFoundError: If the tool file cannot be found.
            ImportError: If there are issues importing the tool module.
            ValueError: If the tool specification is invalid or required components are missing.
            Exception: For other errors during tool reloading.
        """
        try:
            # Check for tool file
            logger.debug("tool_name=<%s> | searching directories for tool", tool_name)
            tools_dirs = self.get_tools_dirs()
            tool_path = None

            # Search for the tool file in all tool directories
            for tools_dir in tools_dirs:
                temp_path = tools_dir / f"{tool_name}.py"
                if temp_path.exists():
                    tool_path = temp_path
                    break

            if not tool_path:
                raise FileNotFoundError(f"No tool file found for: {tool_name}")

            logger.debug("tool_name=<%s> | reloading tool", tool_name)

            # Add tool directory to path temporarily
            tool_dir = str(tool_path.parent)
            sys.path.insert(0, tool_dir)
            try:
                # Load the module directly using spec
                spec = util.spec_from_file_location(tool_name, str(tool_path))
                if spec is None:
                    raise ImportError(f"Could not load spec for {tool_name}")

                module = util.module_from_spec(spec)
                sys.modules[tool_name] = module

                if spec.loader is None:
                    raise ImportError(f"Could not load {tool_name}")

                spec.loader.exec_module(module)

            finally:
                # Remove the temporary path
                sys.path.remove(tool_dir)

            # Look for function-based tools first
            try:
                function_tools = self._scan_module_for_tools(module)

                if function_tools:
                    for function_tool in function_tools:
                        # Register the function-based tool
                        self.register_tool(function_tool)

                        # Update tool configuration if available
                        if self.tool_config is not None:
                            self._update_tool_config(self.tool_config, {"spec": function_tool.tool_spec})

                    logger.debug("tool_name=<%s> | successfully reloaded function-based tool from module", tool_name)
                    return
            except ImportError:
                logger.debug("function tool loader not available | falling back to traditional tools")

            # Fall back to traditional module-level tools
            if not hasattr(module, "TOOL_SPEC"):
                raise ValueError(
                    f"Tool {tool_name} is missing TOOL_SPEC (neither at module level nor as a decorated function)"
                )

            expected_func_name = tool_name
            if not hasattr(module, expected_func_name):
                raise ValueError(f"Tool {tool_name} is missing {expected_func_name} function")

            tool_function = getattr(module, expected_func_name)
            if not callable(tool_function):
                raise ValueError(f"Tool {tool_name} function is not callable")

            # Validate tool spec
            self.validate_tool_spec(module.TOOL_SPEC)

            new_tool = PythonAgentTool(tool_name, module.TOOL_SPEC, tool_function)

            # Register the tool
            self.register_tool(new_tool)

            # Update tool configuration if available
            if self.tool_config is not None:
                self._update_tool_config(self.tool_config, {"spec": module.TOOL_SPEC})
            logger.debug("tool_name=<%s> | successfully reloaded tool", tool_name)

        except Exception:
            logger.exception("tool_name=<%s> | failed to reload tool", tool_name)
            raise

    def initialize_tools(self, load_tools_from_directory: bool = False) -> None:
        """Initialize all tools by discovering and loading them dynamically from all tool directories.

        Args:
            load_tools_from_directory: Whether to reload tools if changes are made at runtime.
        """
        self.tool_config = None

        # Then discover and load other tools
        tool_modules = self.discover_tool_modules()
        successful_loads = 0
        total_tools = len(tool_modules)
        tool_import_errors = {}

        # Process Python tools
        for tool_name, tool_path in tool_modules.items():
            if tool_name in ["__init__"]:
                continue

            if not load_tools_from_directory:
                continue

            try:
                # Add directory to path temporarily
                tool_dir = str(tool_path.parent)
                sys.path.insert(0, tool_dir)
                try:
                    module = import_module(tool_name)
                finally:
                    if tool_dir in sys.path:
                        sys.path.remove(tool_dir)

                # Process Python tool
                if tool_path.suffix == ".py":
                    # Check for decorated function tools first
                    try:
                        function_tools = self._scan_module_for_tools(module)

                        if function_tools:
                            for function_tool in function_tools:
                                self.register_tool(function_tool)
                                successful_loads += 1
                        else:
                            # Fall back to traditional tools
                            # Check for expected tool function
                            expected_func_name = tool_name
                            if hasattr(module, expected_func_name):
                                tool_function = getattr(module, expected_func_name)
                                if not callable(tool_function):
                                    logger.warning(
                                        "tool_name=<%s> | tool function exists but is not callable", tool_name
                                    )
                                    continue

                                # Validate tool spec before registering
                                if not hasattr(module, "TOOL_SPEC"):
                                    logger.warning("tool_name=<%s> | tool is missing TOOL_SPEC | skipping", tool_name)
                                    continue

                                try:
                                    self.validate_tool_spec(module.TOOL_SPEC)
                                except ValueError as e:
                                    logger.warning("tool_name=<%s> | tool spec validation failed | %s", tool_name, e)
                                    continue

                                tool_spec = module.TOOL_SPEC
                                tool = PythonAgentTool(tool_name, tool_spec, tool_function)
                                self.register_tool(tool)
                                successful_loads += 1

                            else:
                                logger.warning("tool_name=<%s> | tool function missing", tool_name)
                    except ImportError:
                        # Function tool loader not available, fall back to traditional tools
                        # Check for expected tool function
                        expected_func_name = tool_name
                        if hasattr(module, expected_func_name):
                            tool_function = getattr(module, expected_func_name)
                            if not callable(tool_function):
                                logger.warning("tool_name=<%s> | tool function exists but is not callable", tool_name)
                                continue

                            # Validate tool spec before registering
                            if not hasattr(module, "TOOL_SPEC"):
                                logger.warning("tool_name=<%s> | tool is missing TOOL_SPEC | skipping", tool_name)
                                continue

                            try:
                                self.validate_tool_spec(module.TOOL_SPEC)
                            except ValueError as e:
                                logger.warning("tool_name=<%s> | tool spec validation failed | %s", tool_name, e)
                                continue

                            tool_spec = module.TOOL_SPEC
                            tool = PythonAgentTool(tool_name, tool_spec, tool_function)
                            self.register_tool(tool)
                            successful_loads += 1

                        else:
                            logger.warning("tool_name=<%s> | tool function missing", tool_name)

            except Exception as e:
                logger.warning("tool_name=<%s> | failed to load tool | %s", tool_name, e)
                tool_import_errors[tool_name] = str(e)

        # Log summary
        logger.debug("tool_count=<%d>, success_count=<%d> | finished loading tools", total_tools, successful_loads)
        if tool_import_errors:
            for tool_name, error in tool_import_errors.items():
                logger.debug("tool_name=<%s> | import error | %s", tool_name, error)

    def get_all_tool_specs(self) -> list[ToolSpec]:
        """Get all the tool specs for all tools in this registry..

        Returns:
            A list of ToolSpecs.
        """
        all_tools = self.get_all_tools_config()
        tools: List[ToolSpec] = [tool_spec for tool_spec in all_tools.values()]
        return tools

    def validate_tool_spec(self, tool_spec: ToolSpec) -> None:
        """Validate tool specification against required schema.

        Args:
            tool_spec: Tool specification to validate.

        Raises:
            ValueError: If the specification is invalid.
        """
        required_fields = ["name", "description"]
        missing_fields = [field for field in required_fields if field not in tool_spec]
        if missing_fields:
            raise ValueError(f"Missing required fields in tool spec: {', '.join(missing_fields)}")

        if "json" not in tool_spec["inputSchema"]:
            # Convert direct schema to proper format
            json_schema = normalize_schema(tool_spec["inputSchema"])
            tool_spec["inputSchema"] = {"json": json_schema}
            return

        # Validate json schema fields
        json_schema = tool_spec["inputSchema"]["json"]

        # Ensure schema has required fields
        if "type" not in json_schema:
            json_schema["type"] = "object"
        if "properties" not in json_schema:
            json_schema["properties"] = {}
        if "required" not in json_schema:
            json_schema["required"] = []

        # Validate property definitions
        for prop_name, prop_def in json_schema.get("properties", {}).items():
            if not isinstance(prop_def, dict):
                json_schema["properties"][prop_name] = {
                    "type": "string",
                    "description": f"Property {prop_name}",
                }
                continue

            # It is expected that type and description are already included in referenced $def.
            if "$ref" in prop_def:
                continue

            if "type" not in prop_def:
                prop_def["type"] = "string"
            if "description" not in prop_def:
                prop_def["description"] = f"Property {prop_name}"

    class NewToolDict(TypedDict):
        """Dictionary type for adding or updating a tool in the configuration.

        Attributes:
            spec: The tool specification that defines the tool's interface and behavior.
        """

        spec: ToolSpec

    def _update_tool_config(self, tool_config: Dict[str, Any], new_tool: NewToolDict) -> None:
        """Update tool configuration with a new tool.

        Args:
            tool_config: The current tool configuration dictionary.
            new_tool: The new tool to add/update.

        Raises:
            ValueError: If the new tool spec is invalid.
        """
        if not new_tool.get("spec"):
            raise ValueError("Invalid tool format - missing spec")

        # Validate tool spec before updating
        try:
            self.validate_tool_spec(new_tool["spec"])
        except ValueError as e:
            raise ValueError(f"Tool specification validation failed: {str(e)}") from e

        new_tool_name = new_tool["spec"]["name"]
        existing_tool_idx = None

        # Find if tool already exists
        for idx, tool_entry in enumerate(tool_config["tools"]):
            if tool_entry["toolSpec"]["name"] == new_tool_name:
                existing_tool_idx = idx
                break

        # Update existing tool or add new one
        new_tool_entry = {"toolSpec": new_tool["spec"]}
        if existing_tool_idx is not None:
            tool_config["tools"][existing_tool_idx] = new_tool_entry
            logger.debug("tool_name=<%s> | updated existing tool", new_tool_name)
        else:
            tool_config["tools"].append(new_tool_entry)
            logger.debug("tool_name=<%s> | added new tool", new_tool_name)

    def _scan_module_for_tools(self, module: Any) -> List[AgentTool]:
        """Scan a module for function-based tools.

        Args:
            module: The module to scan.

        Returns:
            List of FunctionTool instances found in the module.
        """
        tools: List[AgentTool] = []

        for name, obj in inspect.getmembers(module):
            if isinstance(obj, DecoratedFunctionTool):
                # Create a function tool with correct name
                try:
                    # Cast as AgentTool for mypy
                    tools.append(cast(AgentTool, obj))
                except Exception as e:
                    logger.warning("tool_name=<%s> | failed to create function tool | %s", name, e)

        return tools

```

#### `NewToolDict`

Bases: `TypedDict`

Dictionary type for adding or updating a tool in the configuration.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `spec` | `ToolSpec` | The tool specification that defines the tool's interface and behavior. |

Source code in `strands/tools/registry.py`

```
class NewToolDict(TypedDict):
    """Dictionary type for adding or updating a tool in the configuration.

    Attributes:
        spec: The tool specification that defines the tool's interface and behavior.
    """

    spec: ToolSpec

```

#### `__init__()`

Initialize the tool registry.

Source code in `strands/tools/registry.py`

```
def __init__(self) -> None:
    """Initialize the tool registry."""
    self.registry: Dict[str, AgentTool] = {}
    self.dynamic_tools: Dict[str, AgentTool] = {}
    self.tool_config: Optional[Dict[str, Any]] = None

```

#### `discover_tool_modules()`

Discover available tool modules in all tools directories.

Returns:

| Type | Description | | --- | --- | | `Dict[str, Path]` | Dictionary mapping tool names to their full paths. |

Source code in `strands/tools/registry.py`

```
def discover_tool_modules(self) -> Dict[str, Path]:
    """Discover available tool modules in all tools directories.

    Returns:
        Dictionary mapping tool names to their full paths.
    """
    tool_modules = {}
    tools_dirs = self.get_tools_dirs()

    for tools_dir in tools_dirs:
        logger.debug("tools_dir=<%s> | scanning", tools_dir)

        # Find Python tools
        for extension in ["*.py"]:
            for item in tools_dir.glob(extension):
                if item.is_file() and not item.name.startswith("__"):
                    module_name = item.stem
                    # If tool already exists, newer paths take precedence
                    if module_name in tool_modules:
                        logger.debug("tools_dir=<%s>, module_name=<%s> | tool overridden", tools_dir, module_name)
                    tool_modules[module_name] = item

    logger.debug("tool_modules=<%s> | discovered", list(tool_modules.keys()))
    return tool_modules

```

#### `get_all_tool_specs()`

Get all the tool specs for all tools in this registry..

Returns:

| Type | Description | | --- | --- | | `list[ToolSpec]` | A list of ToolSpecs. |

Source code in `strands/tools/registry.py`

```
def get_all_tool_specs(self) -> list[ToolSpec]:
    """Get all the tool specs for all tools in this registry..

    Returns:
        A list of ToolSpecs.
    """
    all_tools = self.get_all_tools_config()
    tools: List[ToolSpec] = [tool_spec for tool_spec in all_tools.values()]
    return tools

```

#### `get_all_tools_config()`

Dynamically generate tool configuration by combining built-in and dynamic tools.

Returns:

| Type | Description | | --- | --- | | `Dict[str, Any]` | Dictionary containing all tool configurations. |

Source code in `strands/tools/registry.py`

```
def get_all_tools_config(self) -> Dict[str, Any]:
    """Dynamically generate tool configuration by combining built-in and dynamic tools.

    Returns:
        Dictionary containing all tool configurations.
    """
    tool_config = {}
    logger.debug("getting tool configurations")

    # Add all registered tools
    for tool_name, tool in self.registry.items():
        # Make a deep copy to avoid modifying the original
        spec = tool.tool_spec.copy()
        try:
            # Normalize the schema before validation
            spec = normalize_tool_spec(spec)
            self.validate_tool_spec(spec)
            tool_config[tool_name] = spec
            logger.debug("tool_name=<%s> | loaded tool config", tool_name)
        except ValueError as e:
            logger.warning("tool_name=<%s> | spec validation failed | %s", tool_name, e)

    # Add any dynamic tools
    for tool_name, tool in self.dynamic_tools.items():
        if tool_name not in tool_config:
            # Make a deep copy to avoid modifying the original
            spec = tool.tool_spec.copy()
            try:
                # Normalize the schema before validation
                spec = normalize_tool_spec(spec)
                self.validate_tool_spec(spec)
                tool_config[tool_name] = spec
                logger.debug("tool_name=<%s> | loaded dynamic tool config", tool_name)
            except ValueError as e:
                logger.warning("tool_name=<%s> | dynamic tool spec validation failed | %s", tool_name, e)

    logger.debug("tool_count=<%s> | tools configured", len(tool_config))
    return tool_config

```

#### `get_tools_dirs()`

Get all tool directory paths.

Returns:

| Type | Description | | --- | --- | | `List[Path]` | A list of Path objects for current working directory's "./tools/". |

Source code in `strands/tools/registry.py`

```
def get_tools_dirs(self) -> List[Path]:
    """Get all tool directory paths.

    Returns:
        A list of Path objects for current working directory's "./tools/".
    """
    # Current working directory's tools directory
    cwd_tools_dir = Path.cwd() / "tools"

    # Return all directories that exist
    tool_dirs = []
    for directory in [cwd_tools_dir]:
        if directory.exists() and directory.is_dir():
            tool_dirs.append(directory)
            logger.debug("tools_dir=<%s> | found tools directory", directory)
        else:
            logger.debug("tools_dir=<%s> | tools directory not found", directory)

    return tool_dirs

```

#### `initialize_tools(load_tools_from_directory=False)`

Initialize all tools by discovering and loading them dynamically from all tool directories.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `load_tools_from_directory` | `bool` | Whether to reload tools if changes are made at runtime. | `False` |

Source code in `strands/tools/registry.py`

```
def initialize_tools(self, load_tools_from_directory: bool = False) -> None:
    """Initialize all tools by discovering and loading them dynamically from all tool directories.

    Args:
        load_tools_from_directory: Whether to reload tools if changes are made at runtime.
    """
    self.tool_config = None

    # Then discover and load other tools
    tool_modules = self.discover_tool_modules()
    successful_loads = 0
    total_tools = len(tool_modules)
    tool_import_errors = {}

    # Process Python tools
    for tool_name, tool_path in tool_modules.items():
        if tool_name in ["__init__"]:
            continue

        if not load_tools_from_directory:
            continue

        try:
            # Add directory to path temporarily
            tool_dir = str(tool_path.parent)
            sys.path.insert(0, tool_dir)
            try:
                module = import_module(tool_name)
            finally:
                if tool_dir in sys.path:
                    sys.path.remove(tool_dir)

            # Process Python tool
            if tool_path.suffix == ".py":
                # Check for decorated function tools first
                try:
                    function_tools = self._scan_module_for_tools(module)

                    if function_tools:
                        for function_tool in function_tools:
                            self.register_tool(function_tool)
                            successful_loads += 1
                    else:
                        # Fall back to traditional tools
                        # Check for expected tool function
                        expected_func_name = tool_name
                        if hasattr(module, expected_func_name):
                            tool_function = getattr(module, expected_func_name)
                            if not callable(tool_function):
                                logger.warning(
                                    "tool_name=<%s> | tool function exists but is not callable", tool_name
                                )
                                continue

                            # Validate tool spec before registering
                            if not hasattr(module, "TOOL_SPEC"):
                                logger.warning("tool_name=<%s> | tool is missing TOOL_SPEC | skipping", tool_name)
                                continue

                            try:
                                self.validate_tool_spec(module.TOOL_SPEC)
                            except ValueError as e:
                                logger.warning("tool_name=<%s> | tool spec validation failed | %s", tool_name, e)
                                continue

                            tool_spec = module.TOOL_SPEC
                            tool = PythonAgentTool(tool_name, tool_spec, tool_function)
                            self.register_tool(tool)
                            successful_loads += 1

                        else:
                            logger.warning("tool_name=<%s> | tool function missing", tool_name)
                except ImportError:
                    # Function tool loader not available, fall back to traditional tools
                    # Check for expected tool function
                    expected_func_name = tool_name
                    if hasattr(module, expected_func_name):
                        tool_function = getattr(module, expected_func_name)
                        if not callable(tool_function):
                            logger.warning("tool_name=<%s> | tool function exists but is not callable", tool_name)
                            continue

                        # Validate tool spec before registering
                        if not hasattr(module, "TOOL_SPEC"):
                            logger.warning("tool_name=<%s> | tool is missing TOOL_SPEC | skipping", tool_name)
                            continue

                        try:
                            self.validate_tool_spec(module.TOOL_SPEC)
                        except ValueError as e:
                            logger.warning("tool_name=<%s> | tool spec validation failed | %s", tool_name, e)
                            continue

                        tool_spec = module.TOOL_SPEC
                        tool = PythonAgentTool(tool_name, tool_spec, tool_function)
                        self.register_tool(tool)
                        successful_loads += 1

                    else:
                        logger.warning("tool_name=<%s> | tool function missing", tool_name)

        except Exception as e:
            logger.warning("tool_name=<%s> | failed to load tool | %s", tool_name, e)
            tool_import_errors[tool_name] = str(e)

    # Log summary
    logger.debug("tool_count=<%d>, success_count=<%d> | finished loading tools", total_tools, successful_loads)
    if tool_import_errors:
        for tool_name, error in tool_import_errors.items():
            logger.debug("tool_name=<%s> | import error | %s", tool_name, error)

```

#### `load_tool_from_filepath(tool_name, tool_path)`

Load a tool from a file path.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_name` | `str` | Name of the tool. | *required* | | `tool_path` | `str` | Path to the tool file. | *required* |

Raises:

| Type | Description | | --- | --- | | `FileNotFoundError` | If the tool file is not found. | | `ValueError` | If the tool cannot be loaded. |

Source code in `strands/tools/registry.py`

```
def load_tool_from_filepath(self, tool_name: str, tool_path: str) -> None:
    """Load a tool from a file path.

    Args:
        tool_name: Name of the tool.
        tool_path: Path to the tool file.

    Raises:
        FileNotFoundError: If the tool file is not found.
        ValueError: If the tool cannot be loaded.
    """
    from .loader import ToolLoader

    try:
        tool_path = expanduser(tool_path)
        if not os.path.exists(tool_path):
            raise FileNotFoundError(f"Tool file not found: {tool_path}")

        loaded_tool = ToolLoader.load_tool(tool_path, tool_name)
        loaded_tool.mark_dynamic()

        # Because we're explicitly registering the tool we don't need an allowlist
        self.register_tool(loaded_tool)
    except Exception as e:
        exception_str = str(e)
        logger.exception("tool_name=<%s> | failed to load tool", tool_name)
        raise ValueError(f"Failed to load tool {tool_name}: {exception_str}") from e

```

#### `process_tools(tools)`

Process tools list that can contain tool names, paths, imported modules, or functions.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tools` | `List[Any]` | List of tool specifications. Can be: String tool names (e.g., "calculator") File paths (e.g., "/path/to/tool.py") Imported Python modules (e.g., a module object) Functions decorated with @tool Dictionaries with name/path keys Instance of an AgentTool | *required* |

Returns:

| Type | Description | | --- | --- | | `List[str]` | List of tool names that were processed. |

Source code in `strands/tools/registry.py`

```
def process_tools(self, tools: List[Any]) -> List[str]:
    """Process tools list that can contain tool names, paths, imported modules, or functions.

    Args:
        tools: List of tool specifications.
            Can be:

            - String tool names (e.g., "calculator")
            - File paths (e.g., "/path/to/tool.py")
            - Imported Python modules (e.g., a module object)
            - Functions decorated with @tool
            - Dictionaries with name/path keys
            - Instance of an AgentTool

    Returns:
        List of tool names that were processed.
    """
    tool_names = []

    def add_tool(tool: Any) -> None:
        # Case 1: String file path
        if isinstance(tool, str):
            # Extract tool name from path
            tool_name = os.path.basename(tool).split(".")[0]
            self.load_tool_from_filepath(tool_name=tool_name, tool_path=tool)
            tool_names.append(tool_name)

        # Case 2: Dictionary with name and path
        elif isinstance(tool, dict) and "name" in tool and "path" in tool:
            self.load_tool_from_filepath(tool_name=tool["name"], tool_path=tool["path"])
            tool_names.append(tool["name"])

        # Case 3: Dictionary with path only
        elif isinstance(tool, dict) and "path" in tool:
            tool_name = os.path.basename(tool["path"]).split(".")[0]
            self.load_tool_from_filepath(tool_name=tool_name, tool_path=tool["path"])
            tool_names.append(tool_name)

        # Case 4: Imported Python module
        elif hasattr(tool, "__file__") and inspect.ismodule(tool):
            # Get the module file path
            module_path = tool.__file__
            # Extract the tool name from the module name
            tool_name = tool.__name__.split(".")[-1]

            # Check for TOOL_SPEC in module to validate it's a Strands tool
            if hasattr(tool, "TOOL_SPEC") and hasattr(tool, tool_name) and module_path:
                self.load_tool_from_filepath(tool_name=tool_name, tool_path=module_path)
                tool_names.append(tool_name)
            else:
                function_tools = self._scan_module_for_tools(tool)
                for function_tool in function_tools:
                    self.register_tool(function_tool)
                    tool_names.append(function_tool.tool_name)

                if not function_tools:
                    logger.warning("tool_name=<%s>, module_path=<%s> | invalid agent tool", tool_name, module_path)

        # Case 5: AgentTools (which also covers @tool)
        elif isinstance(tool, AgentTool):
            self.register_tool(tool)
            tool_names.append(tool.tool_name)
        # Case 6: Nested iterable (list, tuple, etc.) - add each sub-tool
        elif isinstance(tool, Iterable) and not isinstance(tool, (str, bytes, bytearray)):
            for t in tool:
                add_tool(t)
        else:
            logger.warning("tool=<%s> | unrecognized tool specification", tool)

    for a_tool in tools:
        add_tool(a_tool)

    return tool_names

```

#### `register_tool(tool)`

Register a tool function with the given name.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool` | `AgentTool` | The tool to register. | *required* |

Source code in `strands/tools/registry.py`

```
def register_tool(self, tool: AgentTool) -> None:
    """Register a tool function with the given name.

    Args:
        tool: The tool to register.
    """
    logger.debug(
        "tool_name=<%s>, tool_type=<%s>, is_dynamic=<%s> | registering tool",
        tool.tool_name,
        tool.tool_type,
        tool.is_dynamic,
    )

    if self.registry.get(tool.tool_name) is None:
        normalized_name = tool.tool_name.replace("-", "_")

        matching_tools = [
            tool_name
            for (tool_name, tool) in self.registry.items()
            if tool_name.replace("-", "_") == normalized_name
        ]

        if matching_tools:
            raise ValueError(
                f"Tool name '{tool.tool_name}' already exists as '{matching_tools[0]}'."
                " Cannot add a duplicate tool which differs by a '-' or '_'"
            )

    # Register in main registry
    self.registry[tool.tool_name] = tool

    # Register in dynamic tools if applicable
    if tool.is_dynamic:
        self.dynamic_tools[tool.tool_name] = tool

        if not tool.supports_hot_reload:
            logger.debug("tool_name=<%s>, tool_type=<%s> | skipping hot reloading", tool.tool_name, tool.tool_type)
            return

        logger.debug(
            "tool_name=<%s>, tool_registry=<%s>, dynamic_tools=<%s> | tool registered",
            tool.tool_name,
            list(self.registry.keys()),
            list(self.dynamic_tools.keys()),
        )

```

#### `reload_tool(tool_name)`

Reload a specific tool module.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_name` | `str` | Name of the tool to reload. | *required* |

Raises:

| Type | Description | | --- | --- | | `FileNotFoundError` | If the tool file cannot be found. | | `ImportError` | If there are issues importing the tool module. | | `ValueError` | If the tool specification is invalid or required components are missing. | | `Exception` | For other errors during tool reloading. |

Source code in `strands/tools/registry.py`

```
def reload_tool(self, tool_name: str) -> None:
    """Reload a specific tool module.

    Args:
        tool_name: Name of the tool to reload.

    Raises:
        FileNotFoundError: If the tool file cannot be found.
        ImportError: If there are issues importing the tool module.
        ValueError: If the tool specification is invalid or required components are missing.
        Exception: For other errors during tool reloading.
    """
    try:
        # Check for tool file
        logger.debug("tool_name=<%s> | searching directories for tool", tool_name)
        tools_dirs = self.get_tools_dirs()
        tool_path = None

        # Search for the tool file in all tool directories
        for tools_dir in tools_dirs:
            temp_path = tools_dir / f"{tool_name}.py"
            if temp_path.exists():
                tool_path = temp_path
                break

        if not tool_path:
            raise FileNotFoundError(f"No tool file found for: {tool_name}")

        logger.debug("tool_name=<%s> | reloading tool", tool_name)

        # Add tool directory to path temporarily
        tool_dir = str(tool_path.parent)
        sys.path.insert(0, tool_dir)
        try:
            # Load the module directly using spec
            spec = util.spec_from_file_location(tool_name, str(tool_path))
            if spec is None:
                raise ImportError(f"Could not load spec for {tool_name}")

            module = util.module_from_spec(spec)
            sys.modules[tool_name] = module

            if spec.loader is None:
                raise ImportError(f"Could not load {tool_name}")

            spec.loader.exec_module(module)

        finally:
            # Remove the temporary path
            sys.path.remove(tool_dir)

        # Look for function-based tools first
        try:
            function_tools = self._scan_module_for_tools(module)

            if function_tools:
                for function_tool in function_tools:
                    # Register the function-based tool
                    self.register_tool(function_tool)

                    # Update tool configuration if available
                    if self.tool_config is not None:
                        self._update_tool_config(self.tool_config, {"spec": function_tool.tool_spec})

                logger.debug("tool_name=<%s> | successfully reloaded function-based tool from module", tool_name)
                return
        except ImportError:
            logger.debug("function tool loader not available | falling back to traditional tools")

        # Fall back to traditional module-level tools
        if not hasattr(module, "TOOL_SPEC"):
            raise ValueError(
                f"Tool {tool_name} is missing TOOL_SPEC (neither at module level nor as a decorated function)"
            )

        expected_func_name = tool_name
        if not hasattr(module, expected_func_name):
            raise ValueError(f"Tool {tool_name} is missing {expected_func_name} function")

        tool_function = getattr(module, expected_func_name)
        if not callable(tool_function):
            raise ValueError(f"Tool {tool_name} function is not callable")

        # Validate tool spec
        self.validate_tool_spec(module.TOOL_SPEC)

        new_tool = PythonAgentTool(tool_name, module.TOOL_SPEC, tool_function)

        # Register the tool
        self.register_tool(new_tool)

        # Update tool configuration if available
        if self.tool_config is not None:
            self._update_tool_config(self.tool_config, {"spec": module.TOOL_SPEC})
        logger.debug("tool_name=<%s> | successfully reloaded tool", tool_name)

    except Exception:
        logger.exception("tool_name=<%s> | failed to reload tool", tool_name)
        raise

```

#### `validate_tool_spec(tool_spec)`

Validate tool specification against required schema.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_spec` | `ToolSpec` | Tool specification to validate. | *required* |

Raises:

| Type | Description | | --- | --- | | `ValueError` | If the specification is invalid. |

Source code in `strands/tools/registry.py`

```
def validate_tool_spec(self, tool_spec: ToolSpec) -> None:
    """Validate tool specification against required schema.

    Args:
        tool_spec: Tool specification to validate.

    Raises:
        ValueError: If the specification is invalid.
    """
    required_fields = ["name", "description"]
    missing_fields = [field for field in required_fields if field not in tool_spec]
    if missing_fields:
        raise ValueError(f"Missing required fields in tool spec: {', '.join(missing_fields)}")

    if "json" not in tool_spec["inputSchema"]:
        # Convert direct schema to proper format
        json_schema = normalize_schema(tool_spec["inputSchema"])
        tool_spec["inputSchema"] = {"json": json_schema}
        return

    # Validate json schema fields
    json_schema = tool_spec["inputSchema"]["json"]

    # Ensure schema has required fields
    if "type" not in json_schema:
        json_schema["type"] = "object"
    if "properties" not in json_schema:
        json_schema["properties"] = {}
    if "required" not in json_schema:
        json_schema["required"] = []

    # Validate property definitions
    for prop_name, prop_def in json_schema.get("properties", {}).items():
        if not isinstance(prop_def, dict):
            json_schema["properties"][prop_name] = {
                "type": "string",
                "description": f"Property {prop_name}",
            }
            continue

        # It is expected that type and description are already included in referenced $def.
        if "$ref" in prop_def:
            continue

        if "type" not in prop_def:
            prop_def["type"] = "string"
        if "description" not in prop_def:
            prop_def["description"] = f"Property {prop_name}"

```

## `strands.tools.structured_output`

Tools for converting Pydantic models to Bedrock tools.

### `convert_pydantic_to_tool_spec(model, description=None)`

Converts a Pydantic model to a tool description for the Amazon Bedrock Converse API.

Handles optional vs. required fields, resolves $refs, and uses docstrings.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `model` | `Type[BaseModel]` | The Pydantic model class to convert | *required* | | `description` | `Optional[str]` | Optional description of the tool's purpose | `None` |

Returns:

| Name | Type | Description | | --- | --- | --- | | `ToolSpec` | `ToolSpec` | Dict containing the Bedrock tool specification |

Source code in `strands/tools/structured_output.py`

```
def convert_pydantic_to_tool_spec(
    model: Type[BaseModel],
    description: Optional[str] = None,
) -> ToolSpec:
    """Converts a Pydantic model to a tool description for the Amazon Bedrock Converse API.

    Handles optional vs. required fields, resolves $refs, and uses docstrings.

    Args:
        model: The Pydantic model class to convert
        description: Optional description of the tool's purpose

    Returns:
        ToolSpec: Dict containing the Bedrock tool specification
    """
    name = model.__name__

    # Get the JSON schema
    input_schema = model.model_json_schema()

    # Get model docstring for description if not provided
    model_description = description
    if not model_description and model.__doc__:
        model_description = model.__doc__.strip()

    # Process all referenced models to ensure proper docstrings
    # This step is important for gathering descriptions from referenced models
    _process_referenced_models(input_schema, model)

    # Now, let's fully expand the nested models with all their properties
    _expand_nested_properties(input_schema, model)

    # Flatten the schema
    flattened_schema = _flatten_schema(input_schema)

    final_schema = flattened_schema

    # Construct the tool specification
    return ToolSpec(
        name=name,
        description=model_description or f"{name} structured output tool",
        inputSchema={"json": final_schema},
    )

```

## `strands.tools.watcher`

Tool watcher for hot reloading tools during development.

This module provides functionality to watch tool directories for changes and automatically reload tools when they are modified.

### `ToolWatcher`

Watches tool directories for changes and reloads tools when they are modified.

Source code in `strands/tools/watcher.py`

```
class ToolWatcher:
    """Watches tool directories for changes and reloads tools when they are modified."""

    # This class uses class variables for the observer and handlers because watchdog allows only one Observer instance
    # per directory. Using class variables ensures that all ToolWatcher instances share a single Observer, with the
    # MasterChangeHandler routing file system events to the appropriate individual handlers for each registry. This
    # design pattern avoids conflicts when multiple tool registries are watching the same directories.

    _shared_observer = None
    _watched_dirs: Set[str] = set()
    _observer_started = False
    _registry_handlers: Dict[str, Dict[int, "ToolWatcher.ToolChangeHandler"]] = {}

    def __init__(self, tool_registry: ToolRegistry) -> None:
        """Initialize a tool watcher for the given tool registry.

        Args:
            tool_registry: The tool registry to report changes.
        """
        self.tool_registry = tool_registry
        self.start()

    class ToolChangeHandler(FileSystemEventHandler):
        """Handler for tool file changes."""

        def __init__(self, tool_registry: ToolRegistry) -> None:
            """Initialize a tool change handler.

            Args:
                tool_registry: The tool registry to update when tools change.
            """
            self.tool_registry = tool_registry

        def on_modified(self, event: Any) -> None:
            """Reload tool if file modification detected.

            Args:
                event: The file system event that triggered this handler.
            """
            if event.src_path.endswith(".py"):
                tool_path = Path(event.src_path)
                tool_name = tool_path.stem

                if tool_name not in ["__init__"]:
                    logger.debug("tool_name=<%s> | tool change detected", tool_name)
                    try:
                        self.tool_registry.reload_tool(tool_name)
                    except Exception as e:
                        logger.error("tool_name=<%s>, exception=<%s> | failed to reload tool", tool_name, str(e))

    class MasterChangeHandler(FileSystemEventHandler):
        """Master handler that delegates to all registered handlers."""

        def __init__(self, dir_path: str) -> None:
            """Initialize a master change handler for a specific directory.

            Args:
                dir_path: The directory path to watch.
            """
            self.dir_path = dir_path

        def on_modified(self, event: Any) -> None:
            """Delegate file modification events to all registered handlers.

            Args:
                event: The file system event that triggered this handler.
            """
            if event.src_path.endswith(".py"):
                tool_path = Path(event.src_path)
                tool_name = tool_path.stem

                if tool_name not in ["__init__"]:
                    # Delegate to all registered handlers for this directory
                    for handler in ToolWatcher._registry_handlers.get(self.dir_path, {}).values():
                        try:
                            handler.on_modified(event)
                        except Exception as e:
                            logger.error("exception=<%s> | handler error", str(e))

    def start(self) -> None:
        """Start watching all tools directories for changes."""
        # Initialize shared observer if not already done
        if ToolWatcher._shared_observer is None:
            ToolWatcher._shared_observer = Observer()

        # Create handler for this instance
        self.tool_change_handler = self.ToolChangeHandler(self.tool_registry)
        registry_id = id(self.tool_registry)

        # Get tools directories to watch
        tools_dirs = self.tool_registry.get_tools_dirs()

        for tools_dir in tools_dirs:
            dir_str = str(tools_dir)

            # Initialize the registry handlers dict for this directory if needed
            if dir_str not in ToolWatcher._registry_handlers:
                ToolWatcher._registry_handlers[dir_str] = {}

            # Store this handler with its registry id
            ToolWatcher._registry_handlers[dir_str][registry_id] = self.tool_change_handler

            # Schedule or update the master handler for this directory
            if dir_str not in ToolWatcher._watched_dirs:
                # First time seeing this directory, create a master handler
                master_handler = self.MasterChangeHandler(dir_str)
                ToolWatcher._shared_observer.schedule(master_handler, dir_str, recursive=False)
                ToolWatcher._watched_dirs.add(dir_str)
                logger.debug("tools_dir=<%s> | started watching tools directory", tools_dir)
            else:
                # Directory already being watched, just log it
                logger.debug("tools_dir=<%s> | directory already being watched", tools_dir)

        # Start the observer if not already started
        if not ToolWatcher._observer_started:
            ToolWatcher._shared_observer.start()
            ToolWatcher._observer_started = True
            logger.debug("tool directory watching initialized")

```

#### `MasterChangeHandler`

Bases: `FileSystemEventHandler`

Master handler that delegates to all registered handlers.

Source code in `strands/tools/watcher.py`

```
class MasterChangeHandler(FileSystemEventHandler):
    """Master handler that delegates to all registered handlers."""

    def __init__(self, dir_path: str) -> None:
        """Initialize a master change handler for a specific directory.

        Args:
            dir_path: The directory path to watch.
        """
        self.dir_path = dir_path

    def on_modified(self, event: Any) -> None:
        """Delegate file modification events to all registered handlers.

        Args:
            event: The file system event that triggered this handler.
        """
        if event.src_path.endswith(".py"):
            tool_path = Path(event.src_path)
            tool_name = tool_path.stem

            if tool_name not in ["__init__"]:
                # Delegate to all registered handlers for this directory
                for handler in ToolWatcher._registry_handlers.get(self.dir_path, {}).values():
                    try:
                        handler.on_modified(event)
                    except Exception as e:
                        logger.error("exception=<%s> | handler error", str(e))

```

##### `__init__(dir_path)`

Initialize a master change handler for a specific directory.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `dir_path` | `str` | The directory path to watch. | *required* |

Source code in `strands/tools/watcher.py`

```
def __init__(self, dir_path: str) -> None:
    """Initialize a master change handler for a specific directory.

    Args:
        dir_path: The directory path to watch.
    """
    self.dir_path = dir_path

```

##### `on_modified(event)`

Delegate file modification events to all registered handlers.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `Any` | The file system event that triggered this handler. | *required* |

Source code in `strands/tools/watcher.py`

```
def on_modified(self, event: Any) -> None:
    """Delegate file modification events to all registered handlers.

    Args:
        event: The file system event that triggered this handler.
    """
    if event.src_path.endswith(".py"):
        tool_path = Path(event.src_path)
        tool_name = tool_path.stem

        if tool_name not in ["__init__"]:
            # Delegate to all registered handlers for this directory
            for handler in ToolWatcher._registry_handlers.get(self.dir_path, {}).values():
                try:
                    handler.on_modified(event)
                except Exception as e:
                    logger.error("exception=<%s> | handler error", str(e))

```

#### `ToolChangeHandler`

Bases: `FileSystemEventHandler`

Handler for tool file changes.

Source code in `strands/tools/watcher.py`

```
class ToolChangeHandler(FileSystemEventHandler):
    """Handler for tool file changes."""

    def __init__(self, tool_registry: ToolRegistry) -> None:
        """Initialize a tool change handler.

        Args:
            tool_registry: The tool registry to update when tools change.
        """
        self.tool_registry = tool_registry

    def on_modified(self, event: Any) -> None:
        """Reload tool if file modification detected.

        Args:
            event: The file system event that triggered this handler.
        """
        if event.src_path.endswith(".py"):
            tool_path = Path(event.src_path)
            tool_name = tool_path.stem

            if tool_name not in ["__init__"]:
                logger.debug("tool_name=<%s> | tool change detected", tool_name)
                try:
                    self.tool_registry.reload_tool(tool_name)
                except Exception as e:
                    logger.error("tool_name=<%s>, exception=<%s> | failed to reload tool", tool_name, str(e))

```

##### `__init__(tool_registry)`

Initialize a tool change handler.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_registry` | `ToolRegistry` | The tool registry to update when tools change. | *required* |

Source code in `strands/tools/watcher.py`

```
def __init__(self, tool_registry: ToolRegistry) -> None:
    """Initialize a tool change handler.

    Args:
        tool_registry: The tool registry to update when tools change.
    """
    self.tool_registry = tool_registry

```

##### `on_modified(event)`

Reload tool if file modification detected.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `Any` | The file system event that triggered this handler. | *required* |

Source code in `strands/tools/watcher.py`

```
def on_modified(self, event: Any) -> None:
    """Reload tool if file modification detected.

    Args:
        event: The file system event that triggered this handler.
    """
    if event.src_path.endswith(".py"):
        tool_path = Path(event.src_path)
        tool_name = tool_path.stem

        if tool_name not in ["__init__"]:
            logger.debug("tool_name=<%s> | tool change detected", tool_name)
            try:
                self.tool_registry.reload_tool(tool_name)
            except Exception as e:
                logger.error("tool_name=<%s>, exception=<%s> | failed to reload tool", tool_name, str(e))

```

#### `__init__(tool_registry)`

Initialize a tool watcher for the given tool registry.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_registry` | `ToolRegistry` | The tool registry to report changes. | *required* |

Source code in `strands/tools/watcher.py`

```
def __init__(self, tool_registry: ToolRegistry) -> None:
    """Initialize a tool watcher for the given tool registry.

    Args:
        tool_registry: The tool registry to report changes.
    """
    self.tool_registry = tool_registry
    self.start()

```

#### `start()`

Start watching all tools directories for changes.

Source code in `strands/tools/watcher.py`

```
def start(self) -> None:
    """Start watching all tools directories for changes."""
    # Initialize shared observer if not already done
    if ToolWatcher._shared_observer is None:
        ToolWatcher._shared_observer = Observer()

    # Create handler for this instance
    self.tool_change_handler = self.ToolChangeHandler(self.tool_registry)
    registry_id = id(self.tool_registry)

    # Get tools directories to watch
    tools_dirs = self.tool_registry.get_tools_dirs()

    for tools_dir in tools_dirs:
        dir_str = str(tools_dir)

        # Initialize the registry handlers dict for this directory if needed
        if dir_str not in ToolWatcher._registry_handlers:
            ToolWatcher._registry_handlers[dir_str] = {}

        # Store this handler with its registry id
        ToolWatcher._registry_handlers[dir_str][registry_id] = self.tool_change_handler

        # Schedule or update the master handler for this directory
        if dir_str not in ToolWatcher._watched_dirs:
            # First time seeing this directory, create a master handler
            master_handler = self.MasterChangeHandler(dir_str)
            ToolWatcher._shared_observer.schedule(master_handler, dir_str, recursive=False)
            ToolWatcher._watched_dirs.add(dir_str)
            logger.debug("tools_dir=<%s> | started watching tools directory", tools_dir)
        else:
            # Directory already being watched, just log it
            logger.debug("tools_dir=<%s> | directory already being watched", tools_dir)

    # Start the observer if not already started
    if not ToolWatcher._observer_started:
        ToolWatcher._shared_observer.start()
        ToolWatcher._observer_started = True
        logger.debug("tool directory watching initialized")

```

## `strands.tools.mcp`

Model Context Protocol (MCP) integration.

This package provides integration with the Model Context Protocol (MCP), allowing agents to use tools provided by MCP servers.

- Docs: https://www.anthropic.com/news/model-context-protocol

### `strands.tools.mcp.mcp_agent_tool`

MCP Agent Tool module for adapting Model Context Protocol tools to the agent framework.

This module provides the MCPAgentTool class which serves as an adapter between MCP (Model Context Protocol) tools and the agent framework's tool interface. It allows MCP tools to be seamlessly integrated and used within the agent ecosystem.

#### `MCPAgentTool`

Bases: `AgentTool`

Adapter class that wraps an MCP tool and exposes it as an AgentTool.

This class bridges the gap between the MCP protocol's tool representation and the agent framework's tool interface, allowing MCP tools to be used seamlessly within the agent framework.

Source code in `strands/tools/mcp/mcp_agent_tool.py`

```
class MCPAgentTool(AgentTool):
    """Adapter class that wraps an MCP tool and exposes it as an AgentTool.

    This class bridges the gap between the MCP protocol's tool representation
    and the agent framework's tool interface, allowing MCP tools to be used
    seamlessly within the agent framework.
    """

    def __init__(self, mcp_tool: MCPTool, mcp_client: "MCPClient") -> None:
        """Initialize a new MCPAgentTool instance.

        Args:
            mcp_tool: The MCP tool to adapt
            mcp_client: The MCP server connection to use for tool invocation
        """
        super().__init__()
        logger.debug("tool_name=<%s> | creating mcp agent tool", mcp_tool.name)
        self.mcp_tool = mcp_tool
        self.mcp_client = mcp_client

    @property
    def tool_name(self) -> str:
        """Get the name of the tool.

        Returns:
            str: The name of the MCP tool
        """
        return self.mcp_tool.name

    @property
    def tool_spec(self) -> ToolSpec:
        """Get the specification of the tool.

        This method converts the MCP tool specification to the agent framework's
        ToolSpec format, including the input schema and description.

        Returns:
            ToolSpec: The tool specification in the agent framework format
        """
        description: str = self.mcp_tool.description or f"Tool which performs {self.mcp_tool.name}"
        return {
            "inputSchema": {"json": self.mcp_tool.inputSchema},
            "name": self.mcp_tool.name,
            "description": description,
        }

    @property
    def tool_type(self) -> str:
        """Get the type of the tool.

        Returns:
            str: The type of the tool, always "python" for MCP tools
        """
        return "python"

    @override
    async def stream(self, tool_use: ToolUse, invocation_state: dict[str, Any], **kwargs: Any) -> ToolGenerator:
        """Stream the MCP tool.

        This method delegates the tool stream to the MCP server connection, passing the tool use ID, tool name, and
        input arguments.

        Args:
            tool_use: The tool use request containing tool ID and parameters.
            invocation_state: Context for the tool invocation, including agent state.
            **kwargs: Additional keyword arguments for future extensibility.

        Yields:
            Tool events with the last being the tool result.
        """
        logger.debug("tool_name=<%s>, tool_use_id=<%s> | streaming", self.tool_name, tool_use["toolUseId"])

        result = await self.mcp_client.call_tool_async(
            tool_use_id=tool_use["toolUseId"],
            name=self.tool_name,
            arguments=tool_use["input"],
        )
        yield result

```

##### `tool_name`

Get the name of the tool.

Returns:

| Name | Type | Description | | --- | --- | --- | | `str` | `str` | The name of the MCP tool |

##### `tool_spec`

Get the specification of the tool.

This method converts the MCP tool specification to the agent framework's ToolSpec format, including the input schema and description.

Returns:

| Name | Type | Description | | --- | --- | --- | | `ToolSpec` | `ToolSpec` | The tool specification in the agent framework format |

##### `tool_type`

Get the type of the tool.

Returns:

| Name | Type | Description | | --- | --- | --- | | `str` | `str` | The type of the tool, always "python" for MCP tools |

##### `__init__(mcp_tool, mcp_client)`

Initialize a new MCPAgentTool instance.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `mcp_tool` | `Tool` | The MCP tool to adapt | *required* | | `mcp_client` | `MCPClient` | The MCP server connection to use for tool invocation | *required* |

Source code in `strands/tools/mcp/mcp_agent_tool.py`

```
def __init__(self, mcp_tool: MCPTool, mcp_client: "MCPClient") -> None:
    """Initialize a new MCPAgentTool instance.

    Args:
        mcp_tool: The MCP tool to adapt
        mcp_client: The MCP server connection to use for tool invocation
    """
    super().__init__()
    logger.debug("tool_name=<%s> | creating mcp agent tool", mcp_tool.name)
    self.mcp_tool = mcp_tool
    self.mcp_client = mcp_client

```

##### `stream(tool_use, invocation_state, **kwargs)`

Stream the MCP tool.

This method delegates the tool stream to the MCP server connection, passing the tool use ID, tool name, and input arguments.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_use` | `ToolUse` | The tool use request containing tool ID and parameters. | *required* | | `invocation_state` | `dict[str, Any]` | Context for the tool invocation, including agent state. | *required* | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Yields:

| Type | Description | | --- | --- | | `ToolGenerator` | Tool events with the last being the tool result. |

Source code in `strands/tools/mcp/mcp_agent_tool.py`

```
@override
async def stream(self, tool_use: ToolUse, invocation_state: dict[str, Any], **kwargs: Any) -> ToolGenerator:
    """Stream the MCP tool.

    This method delegates the tool stream to the MCP server connection, passing the tool use ID, tool name, and
    input arguments.

    Args:
        tool_use: The tool use request containing tool ID and parameters.
        invocation_state: Context for the tool invocation, including agent state.
        **kwargs: Additional keyword arguments for future extensibility.

    Yields:
        Tool events with the last being the tool result.
    """
    logger.debug("tool_name=<%s>, tool_use_id=<%s> | streaming", self.tool_name, tool_use["toolUseId"])

    result = await self.mcp_client.call_tool_async(
        tool_use_id=tool_use["toolUseId"],
        name=self.tool_name,
        arguments=tool_use["input"],
    )
    yield result

```

### `strands.tools.mcp.mcp_client`

Model Context Protocol (MCP) server connection management module.

This module provides the MCPClient class which handles connections to MCP servers. It manages the lifecycle of MCP connections, including initialization, tool discovery, tool invocation, and proper cleanup of resources. The connection runs in a background thread to avoid blocking the main application thread while maintaining communication with the MCP service.

#### `MCPClient`

Represents a connection to a Model Context Protocol (MCP) server.

This class implements a context manager pattern for efficient connection management, allowing reuse of the same connection for multiple tool calls to reduce latency. It handles the creation, initialization, and cleanup of MCP connections.

The connection runs in a background thread to avoid blocking the main application thread while maintaining communication with the MCP service. When structured content is available from MCP tools, it will be returned as the last item in the content array of the ToolResult.

Source code in `strands/tools/mcp/mcp_client.py`

```
class MCPClient:
    """Represents a connection to a Model Context Protocol (MCP) server.

    This class implements a context manager pattern for efficient connection management,
    allowing reuse of the same connection for multiple tool calls to reduce latency.
    It handles the creation, initialization, and cleanup of MCP connections.

    The connection runs in a background thread to avoid blocking the main application thread
    while maintaining communication with the MCP service. When structured content is available
    from MCP tools, it will be returned as the last item in the content array of the ToolResult.
    """

    def __init__(self, transport_callable: Callable[[], MCPTransport]):
        """Initialize a new MCP Server connection.

        Args:
            transport_callable: A callable that returns an MCPTransport (read_stream, write_stream) tuple
        """
        self._session_id = uuid.uuid4()
        self._log_debug_with_thread("initializing MCPClient connection")
        self._init_future: futures.Future[None] = futures.Future()  # Main thread blocks until future completes
        self._close_event = asyncio.Event()  # Do not want to block other threads while close event is false
        self._transport_callable = transport_callable

        self._background_thread: threading.Thread | None = None
        self._background_thread_session: ClientSession
        self._background_thread_event_loop: AbstractEventLoop

    def __enter__(self) -> "MCPClient":
        """Context manager entry point which initializes the MCP server connection."""
        return self.start()

    def __exit__(self, exc_type: BaseException, exc_val: BaseException, exc_tb: TracebackType) -> None:
        """Context manager exit point that cleans up resources."""
        self.stop(exc_type, exc_val, exc_tb)

    def start(self) -> "MCPClient":
        """Starts the background thread and waits for initialization.

        This method starts the background thread that manages the MCP connection
        and blocks until the connection is ready or times out.

        Returns:
            self: The MCPClient instance

        Raises:
            Exception: If the MCP connection fails to initialize within the timeout period
        """
        if self._is_session_active():
            raise MCPClientInitializationError("the client session is currently running")

        self._log_debug_with_thread("entering MCPClient context")
        self._background_thread = threading.Thread(target=self._background_task, args=[], daemon=True)
        self._background_thread.start()
        self._log_debug_with_thread("background thread started, waiting for ready event")
        try:
            # Blocking main thread until session is initialized in other thread or if the thread stops
            self._init_future.result(timeout=30)
            self._log_debug_with_thread("the client initialization was successful")
        except futures.TimeoutError as e:
            raise MCPClientInitializationError("background thread did not start in 30 seconds") from e
        except Exception as e:
            logger.exception("client failed to initialize")
            raise MCPClientInitializationError("the client initialization failed") from e
        return self

    def stop(
        self, exc_type: Optional[BaseException], exc_val: Optional[BaseException], exc_tb: Optional[TracebackType]
    ) -> None:
        """Signals the background thread to stop and waits for it to complete, ensuring proper cleanup of all resources.

        Args:
            exc_type: Exception type if an exception was raised in the context
            exc_val: Exception value if an exception was raised in the context
            exc_tb: Exception traceback if an exception was raised in the context
        """
        self._log_debug_with_thread("exiting MCPClient context")

        async def _set_close_event() -> None:
            self._close_event.set()

        self._invoke_on_background_thread(_set_close_event()).result()
        self._log_debug_with_thread("waiting for background thread to join")
        if self._background_thread is not None:
            self._background_thread.join()
        self._log_debug_with_thread("background thread joined, MCPClient context exited")

        # Reset fields to allow instance reuse
        self._init_future = futures.Future()
        self._close_event = asyncio.Event()
        self._background_thread = None
        self._session_id = uuid.uuid4()

    def list_tools_sync(self, pagination_token: Optional[str] = None) -> PaginatedList[MCPAgentTool]:
        """Synchronously retrieves the list of available tools from the MCP server.

        This method calls the asynchronous list_tools method on the MCP session
        and adapts the returned tools to the AgentTool interface.

        Returns:
            List[AgentTool]: A list of available tools adapted to the AgentTool interface
        """
        self._log_debug_with_thread("listing MCP tools synchronously")
        if not self._is_session_active():
            raise MCPClientInitializationError(CLIENT_SESSION_NOT_RUNNING_ERROR_MESSAGE)

        async def _list_tools_async() -> ListToolsResult:
            return await self._background_thread_session.list_tools(cursor=pagination_token)

        list_tools_response: ListToolsResult = self._invoke_on_background_thread(_list_tools_async()).result()
        self._log_debug_with_thread("received %d tools from MCP server", len(list_tools_response.tools))

        mcp_tools = [MCPAgentTool(tool, self) for tool in list_tools_response.tools]
        self._log_debug_with_thread("successfully adapted %d MCP tools", len(mcp_tools))
        return PaginatedList[MCPAgentTool](mcp_tools, token=list_tools_response.nextCursor)

    def list_prompts_sync(self, pagination_token: Optional[str] = None) -> ListPromptsResult:
        """Synchronously retrieves the list of available prompts from the MCP server.

        This method calls the asynchronous list_prompts method on the MCP session
        and returns the raw ListPromptsResult with pagination support.

        Args:
            pagination_token: Optional token for pagination

        Returns:
            ListPromptsResult: The raw MCP response containing prompts and pagination info
        """
        self._log_debug_with_thread("listing MCP prompts synchronously")
        if not self._is_session_active():
            raise MCPClientInitializationError(CLIENT_SESSION_NOT_RUNNING_ERROR_MESSAGE)

        async def _list_prompts_async() -> ListPromptsResult:
            return await self._background_thread_session.list_prompts(cursor=pagination_token)

        list_prompts_result: ListPromptsResult = self._invoke_on_background_thread(_list_prompts_async()).result()
        self._log_debug_with_thread("received %d prompts from MCP server", len(list_prompts_result.prompts))
        for prompt in list_prompts_result.prompts:
            self._log_debug_with_thread(prompt.name)

        return list_prompts_result

    def get_prompt_sync(self, prompt_id: str, args: dict[str, Any]) -> GetPromptResult:
        """Synchronously retrieves a prompt from the MCP server.

        Args:
            prompt_id: The ID of the prompt to retrieve
            args: Optional arguments to pass to the prompt

        Returns:
            GetPromptResult: The prompt response from the MCP server
        """
        self._log_debug_with_thread("getting MCP prompt synchronously")
        if not self._is_session_active():
            raise MCPClientInitializationError(CLIENT_SESSION_NOT_RUNNING_ERROR_MESSAGE)

        async def _get_prompt_async() -> GetPromptResult:
            return await self._background_thread_session.get_prompt(prompt_id, arguments=args)

        get_prompt_result: GetPromptResult = self._invoke_on_background_thread(_get_prompt_async()).result()
        self._log_debug_with_thread("received prompt from MCP server")

        return get_prompt_result

    def call_tool_sync(
        self,
        tool_use_id: str,
        name: str,
        arguments: dict[str, Any] | None = None,
        read_timeout_seconds: timedelta | None = None,
    ) -> MCPToolResult:
        """Synchronously calls a tool on the MCP server.

        This method calls the asynchronous call_tool method on the MCP session
        and converts the result to the ToolResult format. If the MCP tool returns
        structured content, it will be included as the last item in the content array
        of the returned ToolResult.

        Args:
            tool_use_id: Unique identifier for this tool use
            name: Name of the tool to call
            arguments: Optional arguments to pass to the tool
            read_timeout_seconds: Optional timeout for the tool call

        Returns:
            MCPToolResult: The result of the tool call
        """
        self._log_debug_with_thread("calling MCP tool '%s' synchronously with tool_use_id=%s", name, tool_use_id)
        if not self._is_session_active():
            raise MCPClientInitializationError(CLIENT_SESSION_NOT_RUNNING_ERROR_MESSAGE)

        async def _call_tool_async() -> MCPCallToolResult:
            return await self._background_thread_session.call_tool(name, arguments, read_timeout_seconds)

        try:
            call_tool_result: MCPCallToolResult = self._invoke_on_background_thread(_call_tool_async()).result()
            return self._handle_tool_result(tool_use_id, call_tool_result)
        except Exception as e:
            logger.exception("tool execution failed")
            return self._handle_tool_execution_error(tool_use_id, e)

    async def call_tool_async(
        self,
        tool_use_id: str,
        name: str,
        arguments: dict[str, Any] | None = None,
        read_timeout_seconds: timedelta | None = None,
    ) -> MCPToolResult:
        """Asynchronously calls a tool on the MCP server.

        This method calls the asynchronous call_tool method on the MCP session
        and converts the result to the MCPToolResult format.

        Args:
            tool_use_id: Unique identifier for this tool use
            name: Name of the tool to call
            arguments: Optional arguments to pass to the tool
            read_timeout_seconds: Optional timeout for the tool call

        Returns:
            MCPToolResult: The result of the tool call
        """
        self._log_debug_with_thread("calling MCP tool '%s' asynchronously with tool_use_id=%s", name, tool_use_id)
        if not self._is_session_active():
            raise MCPClientInitializationError(CLIENT_SESSION_NOT_RUNNING_ERROR_MESSAGE)

        async def _call_tool_async() -> MCPCallToolResult:
            return await self._background_thread_session.call_tool(name, arguments, read_timeout_seconds)

        try:
            future = self._invoke_on_background_thread(_call_tool_async())
            call_tool_result: MCPCallToolResult = await asyncio.wrap_future(future)
            return self._handle_tool_result(tool_use_id, call_tool_result)
        except Exception as e:
            logger.exception("tool execution failed")
            return self._handle_tool_execution_error(tool_use_id, e)

    def _handle_tool_execution_error(self, tool_use_id: str, exception: Exception) -> MCPToolResult:
        """Create error ToolResult with consistent logging."""
        return MCPToolResult(
            status="error",
            toolUseId=tool_use_id,
            content=[{"text": f"Tool execution failed: {str(exception)}"}],
        )

    def _handle_tool_result(self, tool_use_id: str, call_tool_result: MCPCallToolResult) -> MCPToolResult:
        """Maps MCP tool result to the agent's MCPToolResult format.

        This method processes the content from the MCP tool call result and converts it to the format
        expected by the framework.

        Args:
            tool_use_id: Unique identifier for this tool use
            call_tool_result: The result from the MCP tool call

        Returns:
            MCPToolResult: The converted tool result
        """
        self._log_debug_with_thread("received tool result with %d content items", len(call_tool_result.content))

        mapped_content = [
            mapped_content
            for content in call_tool_result.content
            if (mapped_content := self._map_mcp_content_to_tool_result_content(content)) is not None
        ]

        status: ToolResultStatus = "error" if call_tool_result.isError else "success"
        self._log_debug_with_thread("tool execution completed with status: %s", status)
        result = MCPToolResult(
            status=status,
            toolUseId=tool_use_id,
            content=mapped_content,
        )
        if call_tool_result.structuredContent:
            result["structuredContent"] = call_tool_result.structuredContent

        return result

    async def _async_background_thread(self) -> None:
        """Asynchronous method that runs in the background thread to manage the MCP connection.

        This method establishes the transport connection, creates and initializes the MCP session,
        signals readiness to the main thread, and waits for a close signal.
        """
        self._log_debug_with_thread("starting async background thread for MCP connection")
        try:
            async with self._transport_callable() as (read_stream, write_stream, *_):
                self._log_debug_with_thread("transport connection established")
                async with ClientSession(read_stream, write_stream) as session:
                    self._log_debug_with_thread("initializing MCP session")
                    await session.initialize()

                    self._log_debug_with_thread("session initialized successfully")
                    # Store the session for use while we await the close event
                    self._background_thread_session = session
                    self._init_future.set_result(None)  # Signal that the session has been created and is ready for use

                    self._log_debug_with_thread("waiting for close signal")
                    # Keep background thread running until signaled to close.
                    # Thread is not blocked as this is an asyncio.Event not a threading.Event
                    await self._close_event.wait()
                    self._log_debug_with_thread("close signal received")
        except Exception as e:
            # If we encounter an exception and the future is still running,
            # it means it was encountered during the initialization phase.
            if not self._init_future.done():
                self._init_future.set_exception(e)
            else:
                self._log_debug_with_thread(
                    "encountered exception on background thread after initialization %s", str(e)
                )

    def _background_task(self) -> None:
        """Sets up and runs the event loop in the background thread.

        This method creates a new event loop for the background thread,
        sets it as the current event loop, and runs the async_background_thread
        coroutine until completion. In this case "until completion" means until the _close_event is set.
        This allows for a long-running event loop.
        """
        self._log_debug_with_thread("setting up background task event loop")
        self._background_thread_event_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self._background_thread_event_loop)
        self._background_thread_event_loop.run_until_complete(self._async_background_thread())

    def _map_mcp_content_to_tool_result_content(
        self,
        content: MCPTextContent | MCPImageContent | Any,
    ) -> Union[ToolResultContent, None]:
        """Maps MCP content types to tool result content types.

        This method converts MCP-specific content types to the generic
        ToolResultContent format used by the agent framework.

        Args:
            content: The MCP content to convert

        Returns:
            ToolResultContent or None: The converted content, or None if the content type is not supported
        """
        if isinstance(content, MCPTextContent):
            self._log_debug_with_thread("mapping MCP text content")
            return {"text": content.text}
        elif isinstance(content, MCPImageContent):
            self._log_debug_with_thread("mapping MCP image content with mime type: %s", content.mimeType)
            return {
                "image": {
                    "format": MIME_TO_FORMAT[content.mimeType],
                    "source": {"bytes": base64.b64decode(content.data)},
                }
            }
        else:
            self._log_debug_with_thread("unhandled content type: %s - dropping content", content.__class__.__name__)
            return None

    def _log_debug_with_thread(self, msg: str, *args: Any, **kwargs: Any) -> None:
        """Logger helper to help differentiate logs coming from MCPClient background thread."""
        formatted_msg = msg % args if args else msg
        logger.debug(
            "[Thread: %s, Session: %s] %s", threading.current_thread().name, self._session_id, formatted_msg, **kwargs
        )

    def _invoke_on_background_thread(self, coro: Coroutine[Any, Any, T]) -> futures.Future[T]:
        if self._background_thread_session is None or self._background_thread_event_loop is None:
            raise MCPClientInitializationError("the client session was not initialized")
        return asyncio.run_coroutine_threadsafe(coro=coro, loop=self._background_thread_event_loop)

    def _is_session_active(self) -> bool:
        return self._background_thread is not None and self._background_thread.is_alive()

```

##### `__enter__()`

Context manager entry point which initializes the MCP server connection.

Source code in `strands/tools/mcp/mcp_client.py`

```
def __enter__(self) -> "MCPClient":
    """Context manager entry point which initializes the MCP server connection."""
    return self.start()

```

##### `__exit__(exc_type, exc_val, exc_tb)`

Context manager exit point that cleans up resources.

Source code in `strands/tools/mcp/mcp_client.py`

```
def __exit__(self, exc_type: BaseException, exc_val: BaseException, exc_tb: TracebackType) -> None:
    """Context manager exit point that cleans up resources."""
    self.stop(exc_type, exc_val, exc_tb)

```

##### `__init__(transport_callable)`

Initialize a new MCP Server connection.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `transport_callable` | `Callable[[], MCPTransport]` | A callable that returns an MCPTransport (read_stream, write_stream) tuple | *required* |

Source code in `strands/tools/mcp/mcp_client.py`

```
def __init__(self, transport_callable: Callable[[], MCPTransport]):
    """Initialize a new MCP Server connection.

    Args:
        transport_callable: A callable that returns an MCPTransport (read_stream, write_stream) tuple
    """
    self._session_id = uuid.uuid4()
    self._log_debug_with_thread("initializing MCPClient connection")
    self._init_future: futures.Future[None] = futures.Future()  # Main thread blocks until future completes
    self._close_event = asyncio.Event()  # Do not want to block other threads while close event is false
    self._transport_callable = transport_callable

    self._background_thread: threading.Thread | None = None
    self._background_thread_session: ClientSession
    self._background_thread_event_loop: AbstractEventLoop

```

##### `call_tool_async(tool_use_id, name, arguments=None, read_timeout_seconds=None)`

Asynchronously calls a tool on the MCP server.

This method calls the asynchronous call_tool method on the MCP session and converts the result to the MCPToolResult format.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_use_id` | `str` | Unique identifier for this tool use | *required* | | `name` | `str` | Name of the tool to call | *required* | | `arguments` | `dict[str, Any] | None` | Optional arguments to pass to the tool | `None` | | `read_timeout_seconds` | `timedelta | None` | Optional timeout for the tool call | `None` |

Returns:

| Name | Type | Description | | --- | --- | --- | | `MCPToolResult` | `MCPToolResult` | The result of the tool call |

Source code in `strands/tools/mcp/mcp_client.py`

```
async def call_tool_async(
    self,
    tool_use_id: str,
    name: str,
    arguments: dict[str, Any] | None = None,
    read_timeout_seconds: timedelta | None = None,
) -> MCPToolResult:
    """Asynchronously calls a tool on the MCP server.

    This method calls the asynchronous call_tool method on the MCP session
    and converts the result to the MCPToolResult format.

    Args:
        tool_use_id: Unique identifier for this tool use
        name: Name of the tool to call
        arguments: Optional arguments to pass to the tool
        read_timeout_seconds: Optional timeout for the tool call

    Returns:
        MCPToolResult: The result of the tool call
    """
    self._log_debug_with_thread("calling MCP tool '%s' asynchronously with tool_use_id=%s", name, tool_use_id)
    if not self._is_session_active():
        raise MCPClientInitializationError(CLIENT_SESSION_NOT_RUNNING_ERROR_MESSAGE)

    async def _call_tool_async() -> MCPCallToolResult:
        return await self._background_thread_session.call_tool(name, arguments, read_timeout_seconds)

    try:
        future = self._invoke_on_background_thread(_call_tool_async())
        call_tool_result: MCPCallToolResult = await asyncio.wrap_future(future)
        return self._handle_tool_result(tool_use_id, call_tool_result)
    except Exception as e:
        logger.exception("tool execution failed")
        return self._handle_tool_execution_error(tool_use_id, e)

```

##### `call_tool_sync(tool_use_id, name, arguments=None, read_timeout_seconds=None)`

Synchronously calls a tool on the MCP server.

This method calls the asynchronous call_tool method on the MCP session and converts the result to the ToolResult format. If the MCP tool returns structured content, it will be included as the last item in the content array of the returned ToolResult.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_use_id` | `str` | Unique identifier for this tool use | *required* | | `name` | `str` | Name of the tool to call | *required* | | `arguments` | `dict[str, Any] | None` | Optional arguments to pass to the tool | `None` | | `read_timeout_seconds` | `timedelta | None` | Optional timeout for the tool call | `None` |

Returns:

| Name | Type | Description | | --- | --- | --- | | `MCPToolResult` | `MCPToolResult` | The result of the tool call |

Source code in `strands/tools/mcp/mcp_client.py`

```
def call_tool_sync(
    self,
    tool_use_id: str,
    name: str,
    arguments: dict[str, Any] | None = None,
    read_timeout_seconds: timedelta | None = None,
) -> MCPToolResult:
    """Synchronously calls a tool on the MCP server.

    This method calls the asynchronous call_tool method on the MCP session
    and converts the result to the ToolResult format. If the MCP tool returns
    structured content, it will be included as the last item in the content array
    of the returned ToolResult.

    Args:
        tool_use_id: Unique identifier for this tool use
        name: Name of the tool to call
        arguments: Optional arguments to pass to the tool
        read_timeout_seconds: Optional timeout for the tool call

    Returns:
        MCPToolResult: The result of the tool call
    """
    self._log_debug_with_thread("calling MCP tool '%s' synchronously with tool_use_id=%s", name, tool_use_id)
    if not self._is_session_active():
        raise MCPClientInitializationError(CLIENT_SESSION_NOT_RUNNING_ERROR_MESSAGE)

    async def _call_tool_async() -> MCPCallToolResult:
        return await self._background_thread_session.call_tool(name, arguments, read_timeout_seconds)

    try:
        call_tool_result: MCPCallToolResult = self._invoke_on_background_thread(_call_tool_async()).result()
        return self._handle_tool_result(tool_use_id, call_tool_result)
    except Exception as e:
        logger.exception("tool execution failed")
        return self._handle_tool_execution_error(tool_use_id, e)

```

##### `get_prompt_sync(prompt_id, args)`

Synchronously retrieves a prompt from the MCP server.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `prompt_id` | `str` | The ID of the prompt to retrieve | *required* | | `args` | `dict[str, Any]` | Optional arguments to pass to the prompt | *required* |

Returns:

| Name | Type | Description | | --- | --- | --- | | `GetPromptResult` | `GetPromptResult` | The prompt response from the MCP server |

Source code in `strands/tools/mcp/mcp_client.py`

```
def get_prompt_sync(self, prompt_id: str, args: dict[str, Any]) -> GetPromptResult:
    """Synchronously retrieves a prompt from the MCP server.

    Args:
        prompt_id: The ID of the prompt to retrieve
        args: Optional arguments to pass to the prompt

    Returns:
        GetPromptResult: The prompt response from the MCP server
    """
    self._log_debug_with_thread("getting MCP prompt synchronously")
    if not self._is_session_active():
        raise MCPClientInitializationError(CLIENT_SESSION_NOT_RUNNING_ERROR_MESSAGE)

    async def _get_prompt_async() -> GetPromptResult:
        return await self._background_thread_session.get_prompt(prompt_id, arguments=args)

    get_prompt_result: GetPromptResult = self._invoke_on_background_thread(_get_prompt_async()).result()
    self._log_debug_with_thread("received prompt from MCP server")

    return get_prompt_result

```

##### `list_prompts_sync(pagination_token=None)`

Synchronously retrieves the list of available prompts from the MCP server.

This method calls the asynchronous list_prompts method on the MCP session and returns the raw ListPromptsResult with pagination support.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `pagination_token` | `Optional[str]` | Optional token for pagination | `None` |

Returns:

| Name | Type | Description | | --- | --- | --- | | `ListPromptsResult` | `ListPromptsResult` | The raw MCP response containing prompts and pagination info |

Source code in `strands/tools/mcp/mcp_client.py`

```
def list_prompts_sync(self, pagination_token: Optional[str] = None) -> ListPromptsResult:
    """Synchronously retrieves the list of available prompts from the MCP server.

    This method calls the asynchronous list_prompts method on the MCP session
    and returns the raw ListPromptsResult with pagination support.

    Args:
        pagination_token: Optional token for pagination

    Returns:
        ListPromptsResult: The raw MCP response containing prompts and pagination info
    """
    self._log_debug_with_thread("listing MCP prompts synchronously")
    if not self._is_session_active():
        raise MCPClientInitializationError(CLIENT_SESSION_NOT_RUNNING_ERROR_MESSAGE)

    async def _list_prompts_async() -> ListPromptsResult:
        return await self._background_thread_session.list_prompts(cursor=pagination_token)

    list_prompts_result: ListPromptsResult = self._invoke_on_background_thread(_list_prompts_async()).result()
    self._log_debug_with_thread("received %d prompts from MCP server", len(list_prompts_result.prompts))
    for prompt in list_prompts_result.prompts:
        self._log_debug_with_thread(prompt.name)

    return list_prompts_result

```

##### `list_tools_sync(pagination_token=None)`

Synchronously retrieves the list of available tools from the MCP server.

This method calls the asynchronous list_tools method on the MCP session and adapts the returned tools to the AgentTool interface.

Returns:

| Type | Description | | --- | --- | | `PaginatedList[MCPAgentTool]` | List\[AgentTool\]: A list of available tools adapted to the AgentTool interface |

Source code in `strands/tools/mcp/mcp_client.py`

```
def list_tools_sync(self, pagination_token: Optional[str] = None) -> PaginatedList[MCPAgentTool]:
    """Synchronously retrieves the list of available tools from the MCP server.

    This method calls the asynchronous list_tools method on the MCP session
    and adapts the returned tools to the AgentTool interface.

    Returns:
        List[AgentTool]: A list of available tools adapted to the AgentTool interface
    """
    self._log_debug_with_thread("listing MCP tools synchronously")
    if not self._is_session_active():
        raise MCPClientInitializationError(CLIENT_SESSION_NOT_RUNNING_ERROR_MESSAGE)

    async def _list_tools_async() -> ListToolsResult:
        return await self._background_thread_session.list_tools(cursor=pagination_token)

    list_tools_response: ListToolsResult = self._invoke_on_background_thread(_list_tools_async()).result()
    self._log_debug_with_thread("received %d tools from MCP server", len(list_tools_response.tools))

    mcp_tools = [MCPAgentTool(tool, self) for tool in list_tools_response.tools]
    self._log_debug_with_thread("successfully adapted %d MCP tools", len(mcp_tools))
    return PaginatedList[MCPAgentTool](mcp_tools, token=list_tools_response.nextCursor)

```

##### `start()`

Starts the background thread and waits for initialization.

This method starts the background thread that manages the MCP connection and blocks until the connection is ready or times out.

Returns:

| Name | Type | Description | | --- | --- | --- | | `self` | `MCPClient` | The MCPClient instance |

Raises:

| Type | Description | | --- | --- | | `Exception` | If the MCP connection fails to initialize within the timeout period |

Source code in `strands/tools/mcp/mcp_client.py`

```
def start(self) -> "MCPClient":
    """Starts the background thread and waits for initialization.

    This method starts the background thread that manages the MCP connection
    and blocks until the connection is ready or times out.

    Returns:
        self: The MCPClient instance

    Raises:
        Exception: If the MCP connection fails to initialize within the timeout period
    """
    if self._is_session_active():
        raise MCPClientInitializationError("the client session is currently running")

    self._log_debug_with_thread("entering MCPClient context")
    self._background_thread = threading.Thread(target=self._background_task, args=[], daemon=True)
    self._background_thread.start()
    self._log_debug_with_thread("background thread started, waiting for ready event")
    try:
        # Blocking main thread until session is initialized in other thread or if the thread stops
        self._init_future.result(timeout=30)
        self._log_debug_with_thread("the client initialization was successful")
    except futures.TimeoutError as e:
        raise MCPClientInitializationError("background thread did not start in 30 seconds") from e
    except Exception as e:
        logger.exception("client failed to initialize")
        raise MCPClientInitializationError("the client initialization failed") from e
    return self

```

##### `stop(exc_type, exc_val, exc_tb)`

Signals the background thread to stop and waits for it to complete, ensuring proper cleanup of all resources.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `exc_type` | `Optional[BaseException]` | Exception type if an exception was raised in the context | *required* | | `exc_val` | `Optional[BaseException]` | Exception value if an exception was raised in the context | *required* | | `exc_tb` | `Optional[TracebackType]` | Exception traceback if an exception was raised in the context | *required* |

Source code in `strands/tools/mcp/mcp_client.py`

```
def stop(
    self, exc_type: Optional[BaseException], exc_val: Optional[BaseException], exc_tb: Optional[TracebackType]
) -> None:
    """Signals the background thread to stop and waits for it to complete, ensuring proper cleanup of all resources.

    Args:
        exc_type: Exception type if an exception was raised in the context
        exc_val: Exception value if an exception was raised in the context
        exc_tb: Exception traceback if an exception was raised in the context
    """
    self._log_debug_with_thread("exiting MCPClient context")

    async def _set_close_event() -> None:
        self._close_event.set()

    self._invoke_on_background_thread(_set_close_event()).result()
    self._log_debug_with_thread("waiting for background thread to join")
    if self._background_thread is not None:
        self._background_thread.join()
    self._log_debug_with_thread("background thread joined, MCPClient context exited")

    # Reset fields to allow instance reuse
    self._init_future = futures.Future()
    self._close_event = asyncio.Event()
    self._background_thread = None
    self._session_id = uuid.uuid4()

```

### `strands.tools.mcp.mcp_types`

Type definitions for MCP integration.

#### `MCPToolResult`

Bases: `ToolResult`

Result of an MCP tool execution.

Extends the base ToolResult with MCP-specific structured content support. The structuredContent field contains optional JSON data returned by MCP tools that provides structured results beyond the standard text/image/document content.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `structuredContent` | `NotRequired[Dict[str, Any]]` | Optional JSON object containing structured data returned by the MCP tool. This allows MCP tools to return complex data structures that can be processed programmatically by agents or other tools. |

Source code in `strands/tools/mcp/mcp_types.py`

```
class MCPToolResult(ToolResult):
    """Result of an MCP tool execution.

    Extends the base ToolResult with MCP-specific structured content support.
    The structuredContent field contains optional JSON data returned by MCP tools
    that provides structured results beyond the standard text/image/document content.

    Attributes:
        structuredContent: Optional JSON object containing structured data returned
            by the MCP tool. This allows MCP tools to return complex data structures
            that can be processed programmatically by agents or other tools.
    """

    structuredContent: NotRequired[Dict[str, Any]]

```
