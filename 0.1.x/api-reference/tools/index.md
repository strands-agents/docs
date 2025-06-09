# `strands.tools`

Agent tool interfaces and utilities.

This module provides the core functionality for creating, managing, and executing tools through agents.

## `strands.tools.tools`

Core tool implementations.

This module provides the base classes for all tool implementations in the SDK, including function-based tools and Python module-based tools, as well as utilities for validating tool uses and normalizing tool schemas.

### `FunctionTool`

Bases: `AgentTool`

Tool implementation for function-based tools created with @tool.

This class adapts Python functions decorated with @tool to the AgentTool interface.

Source code in `strands/tools/tools.py`

```
class FunctionTool(AgentTool):
    """Tool implementation for function-based tools created with @tool.

    This class adapts Python functions decorated with @tool to the AgentTool interface.
    """

    def __init__(self, func: Callable[[ToolUse, Unpack[Any]], ToolResult], tool_name: Optional[str] = None) -> None:
        """Initialize a function-based tool.

        Args:
            func: The decorated function.
            tool_name: Optional tool name (defaults to function name).

        Raises:
            ValueError: If func is not decorated with @tool.
        """
        super().__init__()

        self._func = func

        # Get TOOL_SPEC from the decorated function
        if hasattr(func, "TOOL_SPEC") and isinstance(func.TOOL_SPEC, dict):
            self._tool_spec = cast(ToolSpec, func.TOOL_SPEC)
            # Use name from tool spec if available, otherwise use function name or passed tool_name
            name = self._tool_spec.get("name", tool_name or func.__name__)
            if isinstance(name, str):
                self._name = name
            else:
                raise ValueError(f"Tool name must be a string, got {type(name)}")
        else:
            raise ValueError(f"Function {func.__name__} is not decorated with @tool")

    @property
    def tool_name(self) -> str:
        """Get the name of the tool.

        Returns:
            The name of the tool.
        """
        return self._name

    @property
    def tool_spec(self) -> ToolSpec:
        """Get the tool specification for this function-based tool.

        Returns:
            The tool specification.
        """
        return self._tool_spec

    @property
    def tool_type(self) -> str:
        """Get the type of the tool.

        Returns:
            The string "function" indicating this is a function-based tool.
        """
        return "function"

    @property
    def supports_hot_reload(self) -> bool:
        """Check if this tool supports automatic reloading when modified.

        Returns:
            Always true for function-based tools.
        """
        return True

    def invoke(self, tool: ToolUse, *args: Any, **kwargs: Any) -> ToolResult:
        """Execute the function with the given tool use request.

        Args:
            tool: The tool use request containing the tool name, ID, and input parameters.
            *args: Additional positional arguments to pass to the function.
            **kwargs: Additional keyword arguments to pass to the function.

        Returns:
            A ToolResult containing the status and content from the function execution.
        """
        # Make sure to pass through all kwargs, including 'agent' if provided
        try:
            # Check if the function accepts agent as a keyword argument
            sig = inspect.signature(self._func)
            if "agent" in sig.parameters:
                # Pass agent if function accepts it
                return self._func(tool, **kwargs)
            else:
                # Skip passing agent if function doesn't accept it
                filtered_kwargs = {k: v for k, v in kwargs.items() if k != "agent"}
                return self._func(tool, **filtered_kwargs)
        except Exception as e:
            return {
                "toolUseId": tool.get("toolUseId", "unknown"),
                "status": "error",
                "content": [{"text": f"Error executing function: {str(e)}"}],
            }

    @property
    def original_function(self) -> Callable:
        """Get the original function (without wrapper).

        Returns:
            Undecorated function.
        """
        if hasattr(self._func, "original_function"):
            return cast(Callable, self._func.original_function)
        return self._func

    def get_display_properties(self) -> dict[str, str]:
        """Get properties to display in UI representations.

        Returns:
            Function properties (e.g., function name).
        """
        properties = super().get_display_properties()
        properties["Function"] = self.original_function.__name__
        return properties

```

#### `original_function`

Get the original function (without wrapper).

Returns:

| Type | Description | | --- | --- | | `Callable` | Undecorated function. |

#### `supports_hot_reload`

Check if this tool supports automatic reloading when modified.

Returns:

| Type | Description | | --- | --- | | `bool` | Always true for function-based tools. |

#### `tool_name`

Get the name of the tool.

Returns:

| Type | Description | | --- | --- | | `str` | The name of the tool. |

#### `tool_spec`

Get the tool specification for this function-based tool.

Returns:

| Type | Description | | --- | --- | | `ToolSpec` | The tool specification. |

#### `tool_type`

Get the type of the tool.

Returns:

| Type | Description | | --- | --- | | `str` | The string "function" indicating this is a function-based tool. |

#### `__init__(func, tool_name=None)`

Initialize a function-based tool.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `func` | `Callable[[ToolUse, Unpack[Any]], ToolResult]` | The decorated function. | *required* | | `tool_name` | `Optional[str]` | Optional tool name (defaults to function name). | `None` |

Raises:

| Type | Description | | --- | --- | | `ValueError` | If func is not decorated with @tool. |

Source code in `strands/tools/tools.py`

```
def __init__(self, func: Callable[[ToolUse, Unpack[Any]], ToolResult], tool_name: Optional[str] = None) -> None:
    """Initialize a function-based tool.

    Args:
        func: The decorated function.
        tool_name: Optional tool name (defaults to function name).

    Raises:
        ValueError: If func is not decorated with @tool.
    """
    super().__init__()

    self._func = func

    # Get TOOL_SPEC from the decorated function
    if hasattr(func, "TOOL_SPEC") and isinstance(func.TOOL_SPEC, dict):
        self._tool_spec = cast(ToolSpec, func.TOOL_SPEC)
        # Use name from tool spec if available, otherwise use function name or passed tool_name
        name = self._tool_spec.get("name", tool_name or func.__name__)
        if isinstance(name, str):
            self._name = name
        else:
            raise ValueError(f"Tool name must be a string, got {type(name)}")
    else:
        raise ValueError(f"Function {func.__name__} is not decorated with @tool")

```

#### `get_display_properties()`

Get properties to display in UI representations.

Returns:

| Type | Description | | --- | --- | | `dict[str, str]` | Function properties (e.g., function name). |

Source code in `strands/tools/tools.py`

```
def get_display_properties(self) -> dict[str, str]:
    """Get properties to display in UI representations.

    Returns:
        Function properties (e.g., function name).
    """
    properties = super().get_display_properties()
    properties["Function"] = self.original_function.__name__
    return properties

```

#### `invoke(tool, *args, **kwargs)`

Execute the function with the given tool use request.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool` | `ToolUse` | The tool use request containing the tool name, ID, and input parameters. | *required* | | `*args` | `Any` | Additional positional arguments to pass to the function. | `()` | | `**kwargs` | `Any` | Additional keyword arguments to pass to the function. | `{}` |

Returns:

| Type | Description | | --- | --- | | `ToolResult` | A ToolResult containing the status and content from the function execution. |

Source code in `strands/tools/tools.py`

```
def invoke(self, tool: ToolUse, *args: Any, **kwargs: Any) -> ToolResult:
    """Execute the function with the given tool use request.

    Args:
        tool: The tool use request containing the tool name, ID, and input parameters.
        *args: Additional positional arguments to pass to the function.
        **kwargs: Additional keyword arguments to pass to the function.

    Returns:
        A ToolResult containing the status and content from the function execution.
    """
    # Make sure to pass through all kwargs, including 'agent' if provided
    try:
        # Check if the function accepts agent as a keyword argument
        sig = inspect.signature(self._func)
        if "agent" in sig.parameters:
            # Pass agent if function accepts it
            return self._func(tool, **kwargs)
        else:
            # Skip passing agent if function doesn't accept it
            filtered_kwargs = {k: v for k, v in kwargs.items() if k != "agent"}
            return self._func(tool, **filtered_kwargs)
    except Exception as e:
        return {
            "toolUseId": tool.get("toolUseId", "unknown"),
            "status": "error",
            "content": [{"text": f"Error executing function: {str(e)}"}],
        }

```

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

    _callback: Callable[[ToolUse, Any, dict[str, Any]], ToolResult]
    _tool_name: str
    _tool_spec: ToolSpec

    def __init__(
        self, tool_name: str, tool_spec: ToolSpec, callback: Callable[[ToolUse, Any, dict[str, Any]], ToolResult]
    ) -> None:
        """Initialize a Python-based tool.

        Args:
            tool_name: Unique identifier for the tool.
            tool_spec: Tool specification defining parameters and behavior.
            callback: Python function to execute when the tool is invoked.
        """
        super().__init__()

        self._tool_name = tool_name
        self._tool_spec = tool_spec
        self._callback = callback

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

    def invoke(self, tool: ToolUse, *args: Any, **kwargs: dict[str, Any]) -> ToolResult:
        """Execute the Python function with the given tool use request.

        Args:
            tool: The tool use request.
            *args: Additional positional arguments to pass to the underlying callback function.
            **kwargs: Additional keyword arguments to pass to the underlying callback function.

        Returns:
            A ToolResult containing the status and content from the callback execution.
        """
        return self._callback(tool, *args, **kwargs)

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

#### `__init__(tool_name, tool_spec, callback)`

Initialize a Python-based tool.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_name` | `str` | Unique identifier for the tool. | *required* | | `tool_spec` | `ToolSpec` | Tool specification defining parameters and behavior. | *required* | | `callback` | `Callable[[ToolUse, Any, dict[str, Any]], ToolResult]` | Python function to execute when the tool is invoked. | *required* |

Source code in `strands/tools/tools.py`

```
def __init__(
    self, tool_name: str, tool_spec: ToolSpec, callback: Callable[[ToolUse, Any, dict[str, Any]], ToolResult]
) -> None:
    """Initialize a Python-based tool.

    Args:
        tool_name: Unique identifier for the tool.
        tool_spec: Tool specification defining parameters and behavior.
        callback: Python function to execute when the tool is invoked.
    """
    super().__init__()

    self._tool_name = tool_name
    self._tool_spec = tool_spec
    self._callback = callback

```

#### `invoke(tool, *args, **kwargs)`

Execute the Python function with the given tool use request.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool` | `ToolUse` | The tool use request. | *required* | | `*args` | `Any` | Additional positional arguments to pass to the underlying callback function. | `()` | | `**kwargs` | `dict[str, Any]` | Additional keyword arguments to pass to the underlying callback function. | `{}` |

Returns:

| Type | Description | | --- | --- | | `ToolResult` | A ToolResult containing the status and content from the callback execution. |

Source code in `strands/tools/tools.py`

```
def invoke(self, tool: ToolUse, *args: Any, **kwargs: dict[str, Any]) -> ToolResult:
    """Execute the Python function with the given tool use request.

    Args:
        tool: The tool use request.
        *args: Additional positional arguments to pass to the underlying callback function.
        **kwargs: Additional keyword arguments to pass to the underlying callback function.

    Returns:
        A ToolResult containing the status and content from the callback execution.
    """
    return self._callback(tool, *args, **kwargs)

```

### `normalize_schema(schema)`

Normalize a JSON schema to match expectations.

This function recursively processes nested objects to preserve the complete schema structure. Uses a copy-then-normalize approach to preserve all original schema properties.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `schema` | `Dict[str, Any]` | The schema to normalize. | *required* |

Returns:

| Type | Description | | --- | --- | | `Dict[str, Any]` | The normalized schema. |

Source code in `strands/tools/tools.py`

```
def normalize_schema(schema: Dict[str, Any]) -> Dict[str, Any]:
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
    tool_name_pattern = r"^[a-zA-Z][a-zA-Z0-9_\-]*$"
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
        field_definitions: Dict[str, Any] = {}

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

    def extract_metadata(self) -> Dict[str, Any]:
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
        tool_spec = {"name": func_name, "description": description, "inputSchema": {"json": input_schema}}

        return tool_spec

    def _clean_pydantic_schema(self, schema: Dict[str, Any]) -> None:
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
        keys_to_remove = ["title", "$defs", "additionalProperties"]
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

    def validate_input(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
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

| Type | Description | | --- | --- | | `Dict[str, Any]` | A dictionary containing the tool specification. |

Source code in `strands/tools/decorator.py`

```
def extract_metadata(self) -> Dict[str, Any]:
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
    tool_spec = {"name": func_name, "description": description, "inputSchema": {"json": input_schema}}

    return tool_spec

```

#### `validate_input(input_data)`

Validate input data using the Pydantic model.

This method ensures that the input data meets the expected schema before it's passed to the actual function. It converts the data to the correct types when possible and raises informative errors when not.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `input_data` | `Dict[str, Any]` | A dictionary of parameter names and values to validate. | *required* |

Returns:

| Type | Description | | --- | --- | | `Dict[str, Any]` | A dictionary with validated and converted parameter values. |

Raises:

| Type | Description | | --- | --- | | `ValueError` | If the input data fails validation, with details about what failed. |

Source code in `strands/tools/decorator.py`

```
def validate_input(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
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

### `tool(func=None, **tool_kwargs)`

Decorator that transforms a Python function into a Strands tool.

This decorator seamlessly enables a function to be called both as a regular Python function and as a Strands tool. It extracts metadata from the function's signature, docstring, and type hints to generate an OpenAPI-compatible tool specification.

When decorated, a function:

1. Still works as a normal function when called directly with arguments
1. Processes tool use API calls when provided with a tool use dictionary
1. Validates inputs against the function's type hints and parameter spec
1. Formats return values according to the expected Strands tool result format
1. Provides automatic error handling and reporting

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `func` | `Optional[Callable[..., Any]]` | The function to decorate. | `None` | | `**tool_kwargs` | `Any` | Additional tool specification options to override extracted values. E.g., name="custom_name", description="Custom description". | `{}` |

Returns:

| Type | Description | | --- | --- | | `Callable[[T], T]` | The decorated function with attached tool specifications. |

Example

```
@tool
def my_tool(name: str, count: int = 1) -> str:
    '''Does something useful with the provided parameters.

    "Args:
        name: The name to process
        count: Number of times to process (default: 1)

    "Returns:
        A message with the result
    '''
    return f"Processed {name} {count} times"

agent = Agent(tools=[my_tool])
agent.my_tool(name="example", count=3)
# Returns: {
#   "toolUseId": "123",
#   "status": "success",
#   "content": [{"text": "Processed example 3 times"}]
# }

```

Source code in `strands/tools/decorator.py`

````
def tool(func: Optional[Callable[..., Any]] = None, **tool_kwargs: Any) -> Callable[[T], T]:
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

    Args:
        func: The function to decorate.
        **tool_kwargs: Additional tool specification options to override extracted values.
            E.g., `name="custom_name", description="Custom description"`.

    Returns:
        The decorated function with attached tool specifications.

    Example:
        ```python
        @tool
        def my_tool(name: str, count: int = 1) -> str:
            '''Does something useful with the provided parameters.

            "Args:
                name: The name to process
                count: Number of times to process (default: 1)

            "Returns:
                A message with the result
            '''
            return f"Processed {name} {count} times"

        agent = Agent(tools=[my_tool])
        agent.my_tool(name="example", count=3)
        # Returns: {
        #   "toolUseId": "123",
        #   "status": "success",
        #   "content": [{"text": "Processed example 3 times"}]
        # }
        ```
    """

    def decorator(f: T) -> T:
        # Create function tool metadata
        tool_meta = FunctionToolMetadata(f)
        tool_spec = tool_meta.extract_metadata()

        # Update with any additional kwargs
        tool_spec.update(tool_kwargs)

        # Attach TOOL_SPEC directly to the original function (critical for backward compatibility)
        f.TOOL_SPEC = tool_spec  # type: ignore

        @functools.wraps(f)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            """Tool wrapper.

            This wrapper handles two different calling patterns:

            1. Normal function calls: `func(arg1, arg2, ...)`
            2. Tool use calls: `func({"toolUseId": "id", "input": {...}}, agent=agent)`
            """
            # Initialize variables to track call type
            is_method_call = False
            instance = None

            # DETECT IF THIS IS A METHOD CALL (with 'self' as first argument)
            # If this is a method call, the first arg would be 'self' (instance)
            if len(args) > 0 and not isinstance(args[0], dict):
                try:
                    # Try to find f in the class of args[0]
                    if hasattr(args[0], "__class__"):
                        if hasattr(args[0].__class__, f.__name__):
                            # This is likely a method call with self as first argument
                            is_method_call = True
                            instance = args[0]
                            args = args[1:]  # Remove self from args
                except (AttributeError, TypeError):
                    pass

            # DETECT IF THIS IS A TOOL USE CALL
            # Check if this is a tool use call (dict with toolUseId or input)
            if (
                len(args) > 0
                and isinstance(args[0], dict)
                and (not args[0] or "toolUseId" in args[0] or "input" in args[0])
            ):
                # This is a tool use call - process accordingly
                tool_use = args[0]
                tool_use_id = tool_use.get("toolUseId", "unknown")
                tool_input = tool_use.get("input", {})

                try:
                    # Validate input against the Pydantic model
                    validated_input = tool_meta.validate_input(tool_input)

                    # Pass along the agent if provided and expected by the function
                    if "agent" in kwargs and "agent" in tool_meta.signature.parameters:
                        validated_input["agent"] = kwargs.get("agent")

                    # CALL THE ACTUAL FUNCTION based on whether it's a method or not
                    if is_method_call:
                        # For methods, pass the instance as 'self'
                        result = f(instance, **validated_input)
                    else:
                        # For standalone functions, just pass the validated inputs
                        result = f(**validated_input)

                    # FORMAT THE RESULT for Strands Agent
                    if isinstance(result, dict) and "status" in result and "content" in result:
                        # Result is already in the expected format, just add toolUseId
                        result["toolUseId"] = tool_use_id
                        return result
                    else:
                        # Wrap any other return value in the standard format
                        # Always include at least one content item for consistency
                        return {
                            "toolUseId": tool_use_id,
                            "status": "success",
                            "content": [{"text": str(result)}],
                        }

                except ValueError as e:
                    # Special handling for validation errors
                    error_msg = str(e)
                    return {
                        "toolUseId": tool_use_id,
                        "status": "error",
                        "content": [{"text": f"Error: {error_msg}"}],
                    }
                except Exception as e:
                    # Return error result with exception details for any other error
                    error_type = type(e).__name__
                    error_msg = str(e)
                    return {
                        "toolUseId": tool_use_id,
                        "status": "error",
                        "content": [{"text": f"Error: {error_type} - {error_msg}"}],
                    }
            else:
                # NORMAL FUNCTION CALL - pass through to the original function
                if is_method_call:
                    # Put instance back as first argument for method calls
                    return f(instance, *args, **kwargs)
                else:
                    # Standard function call
                    return f(*args, **kwargs)

        # Also attach TOOL_SPEC to wrapper for compatibility
        wrapper.TOOL_SPEC = tool_spec  # type: ignore

        # Return the wrapper
        return cast(T, wrapper)

    # Handle both @tool and @tool() syntax
    if func is None:
        return decorator
    return decorator(func)

````

## `strands.tools.executor`

Tool execution functionality for the event loop.

### `run_tools(handler, tool_uses, event_loop_metrics, request_state, invalid_tool_use_ids, tool_results, cycle_trace, parent_span=None, parallel_tool_executor=None)`

Execute tools either in parallel or sequentially.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `handler` | `Callable[[ToolUse], ToolResult]` | Tool handler processing function. | *required* | | `tool_uses` | `List[ToolUse]` | List of tool uses to execute. | *required* | | `event_loop_metrics` | `EventLoopMetrics` | Metrics collection object. | *required* | | `request_state` | `Any` | Current request state. | *required* | | `invalid_tool_use_ids` | `List[str]` | List of invalid tool use IDs. | *required* | | `tool_results` | `List[ToolResult]` | List to populate with tool results. | *required* | | `cycle_trace` | `Trace` | Parent trace for the current cycle. | *required* | | `parent_span` | `Optional[Span]` | Parent span for the current cycle. | `None` | | `parallel_tool_executor` | `Optional[ParallelToolExecutorInterface]` | Optional executor for parallel processing. | `None` |

Returns:

| Name | Type | Description | | --- | --- | --- | | `bool` | `bool` | True if any tool failed, False otherwise. |

Source code in `strands/tools/executor.py`

```
def run_tools(
    handler: Callable[[ToolUse], ToolResult],
    tool_uses: List[ToolUse],
    event_loop_metrics: EventLoopMetrics,
    request_state: Any,
    invalid_tool_use_ids: List[str],
    tool_results: List[ToolResult],
    cycle_trace: Trace,
    parent_span: Optional[trace.Span] = None,
    parallel_tool_executor: Optional[ParallelToolExecutorInterface] = None,
) -> bool:
    """Execute tools either in parallel or sequentially.

    Args:
        handler: Tool handler processing function.
        tool_uses: List of tool uses to execute.
        event_loop_metrics: Metrics collection object.
        request_state: Current request state.
        invalid_tool_use_ids: List of invalid tool use IDs.
        tool_results: List to populate with tool results.
        cycle_trace: Parent trace for the current cycle.
        parent_span: Parent span for the current cycle.
        parallel_tool_executor: Optional executor for parallel processing.

    Returns:
        bool: True if any tool failed, False otherwise.
    """

    def _handle_tool_execution(tool: ToolUse) -> Tuple[bool, Optional[ToolResult]]:
        result = None
        tool_succeeded = False

        tracer = get_tracer()
        tool_call_span = tracer.start_tool_call_span(tool, parent_span)

        try:
            if "toolUseId" not in tool or tool["toolUseId"] not in invalid_tool_use_ids:
                tool_name = tool["name"]
                tool_trace = Trace(f"Tool: {tool_name}", parent_id=cycle_trace.id, raw_name=tool_name)
                tool_start_time = time.time()
                result = handler(tool)
                tool_success = result.get("status") == "success"
                if tool_success:
                    tool_succeeded = True

                tool_duration = time.time() - tool_start_time
                message = Message(role="user", content=[{"toolResult": result}])
                event_loop_metrics.add_tool_usage(tool, tool_duration, tool_trace, tool_success, message)
                cycle_trace.add_child(tool_trace)

            if tool_call_span:
                tracer.end_tool_call_span(tool_call_span, result)
        except Exception as e:
            if tool_call_span:
                tracer.end_span_with_error(tool_call_span, str(e), e)

        return tool_succeeded, result

    any_tool_failed = False
    if parallel_tool_executor:
        logger.debug(
            "tool_count=<%s>, tool_executor=<%s> | executing tools in parallel",
            len(tool_uses),
            type(parallel_tool_executor).__name__,
        )
        # Submit all tasks with their associated tools
        future_to_tool = {
            parallel_tool_executor.submit(_handle_tool_execution, tool_use): tool_use for tool_use in tool_uses
        }
        logger.debug("tool_count=<%s> | submitted tasks to parallel executor", len(tool_uses))

        # Collect results truly in parallel using the provided executor's as_completed method
        completed_results = []
        try:
            for future in parallel_tool_executor.as_completed(future_to_tool):
                try:
                    succeeded, result = future.result()
                    if result is not None:
                        completed_results.append(result)
                    if not succeeded:
                        any_tool_failed = True
                except Exception as e:
                    tool = future_to_tool[future]
                    logger.debug("tool_name=<%s> | tool execution failed | %s", tool["name"], e)
                    any_tool_failed = True
        except TimeoutError:
            logger.error("timeout_seconds=<%s> | parallel tool execution timed out", parallel_tool_executor.timeout)
            # Process any completed tasks
            for future in future_to_tool:
                if future.done():  # type: ignore
                    try:
                        succeeded, result = future.result(timeout=0)
                        if result is not None:
                            completed_results.append(result)
                    except Exception as tool_e:
                        tool = future_to_tool[future]
                        logger.debug("tool_name=<%s> | tool execution failed | %s", tool["name"], tool_e)
                else:
                    # This future didn't complete within the timeout
                    tool = future_to_tool[future]
                    logger.debug("tool_name=<%s> | tool execution timed out", tool["name"])

            any_tool_failed = True

        # Add completed results to tool_results
        tool_results.extend(completed_results)
    else:
        # Sequential execution fallback
        for tool_use in tool_uses:
            succeeded, result = _handle_tool_execution(tool_use)
            if result is not None:
                tool_results.append(result)
            if not succeeded:
                any_tool_failed = True

    return any_tool_failed

```

### `validate_and_prepare_tools(message, tool_uses, tool_results, invalid_tool_use_ids)`

Validate tool uses and prepare them for execution.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `message` | `Message` | Current message. | *required* | | `tool_uses` | `List[ToolUse]` | List to populate with tool uses. | *required* | | `tool_results` | `List[ToolResult]` | List to populate with tool results for invalid tools. | *required* | | `invalid_tool_use_ids` | `List[str]` | List to populate with invalid tool use IDs. | *required* |

Source code in `strands/tools/executor.py`

```
def validate_and_prepare_tools(
    message: Message,
    tool_uses: List[ToolUse],
    tool_results: List[ToolResult],
    invalid_tool_use_ids: List[str],
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

                    # Check if the function has a TOOL_SPEC (from @tool decorator)
                    if inspect.isfunction(func) and hasattr(func, "TOOL_SPEC"):
                        logger.debug(
                            "tool_name=<%s>, module_path=<%s> | found function-based tool", function_name, module_path
                        )
                        return FunctionTool(func)
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
                # Check if this is a function with TOOL_SPEC attached (from @tool decorator)
                if inspect.isfunction(attr) and hasattr(attr, "TOOL_SPEC"):
                    logger.debug(
                        "tool_name=<%s>, tool_path=<%s> | found function-based tool in path", attr_name, tool_path
                    )
                    # Return as FunctionTool
                    return FunctionTool(attr)

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

            return PythonAgentTool(tool_name, tool_spec, callback=tool_func)

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

                # Check if the function has a TOOL_SPEC (from @tool decorator)
                if inspect.isfunction(func) and hasattr(func, "TOOL_SPEC"):
                    logger.debug(
                        "tool_name=<%s>, module_path=<%s> | found function-based tool", function_name, module_path
                    )
                    return FunctionTool(func)
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
            # Check if this is a function with TOOL_SPEC attached (from @tool decorator)
            if inspect.isfunction(attr) and hasattr(attr, "TOOL_SPEC"):
                logger.debug(
                    "tool_name=<%s>, tool_path=<%s> | found function-based tool in path", attr_name, tool_path
                )
                # Return as FunctionTool
                return FunctionTool(attr)

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

        return PythonAgentTool(tool_name, tool_spec, callback=tool_func)

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

### `load_function_tool(func)`

Load a function as a tool if it's decorated with @tool.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `func` | `Any` | The function to load. | *required* |

Returns:

| Type | Description | | --- | --- | | `Optional[FunctionTool]` | FunctionTool if successful, None otherwise. |

Source code in `strands/tools/loader.py`

```
def load_function_tool(func: Any) -> Optional[FunctionTool]:
    """Load a function as a tool if it's decorated with @tool.

    Args:
        func: The function to load.

    Returns:
        FunctionTool if successful, None otherwise.
    """
    if not inspect.isfunction(func):
        return None

    if not hasattr(func, "TOOL_SPEC"):
        return None

    try:
        return FunctionTool(func)
    except Exception as e:
        logger.warning("tool_name=<%s> | failed to load function tool | %s", func.__name__, e)
        return None

```

### `scan_directory_for_tools(directory)`

Scan a directory for Python modules containing function-based tools.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `directory` | `Path` | The directory to scan. | *required* |

Returns:

| Type | Description | | --- | --- | | `Dict[str, FunctionTool]` | Dictionary mapping tool names to FunctionTool instances. |

Source code in `strands/tools/loader.py`

```
def scan_directory_for_tools(directory: Path) -> Dict[str, FunctionTool]:
    """Scan a directory for Python modules containing function-based tools.

    Args:
        directory: The directory to scan.

    Returns:
        Dictionary mapping tool names to FunctionTool instances.
    """
    tools: Dict[str, FunctionTool] = {}

    if not directory.exists() or not directory.is_dir():
        return tools

    for file_path in directory.glob("*.py"):
        if file_path.name.startswith("_"):
            continue

        try:
            # Dynamically import the module
            module_name = file_path.stem
            spec = importlib.util.spec_from_file_location(module_name, file_path)
            if not spec or not spec.loader:
                continue

            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)

            # Find tools in the module
            for attr_name in dir(module):
                attr = getattr(module, attr_name)
                if hasattr(attr, "TOOL_SPEC") and callable(attr):
                    tool = load_function_tool(attr)
                    if tool:
                        # Use the tool's name from tool_name property (which includes custom names)
                        tools[tool.tool_name] = tool

        except Exception as e:
            logger.warning("tool_path=<%s> | failed to load tools under path | %s", file_path, e)

    return tools

```

### `scan_module_for_tools(module)`

Scan a module for function-based tools.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `module` | `Any` | The module to scan. | *required* |

Returns:

| Type | Description | | --- | --- | | `List[FunctionTool]` | List of FunctionTool instances found in the module. |

Source code in `strands/tools/loader.py`

```
def scan_module_for_tools(module: Any) -> List[FunctionTool]:
    """Scan a module for function-based tools.

    Args:
        module: The module to scan.

    Returns:
        List of FunctionTool instances found in the module.
    """
    tools = []

    for name, obj in inspect.getmembers(module):
        # Check if this is a function with TOOL_SPEC attached
        if inspect.isfunction(obj) and hasattr(obj, "TOOL_SPEC"):
            # Create a function tool with correct name
            try:
                tool = FunctionTool(obj)
                tools.append(tool)
            except Exception as e:
                logger.warning("tool_name=<%s> | failed to create function tool | %s", name, e)

    return tools

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

        for tool in tools:
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
                    function_tools = scan_module_for_tools(tool)
                    for function_tool in function_tools:
                        self.register_tool(function_tool)
                        tool_names.append(function_tool.tool_name)

                    if not function_tools:
                        logger.warning("tool_name=<%s>, module_path=<%s> | invalid agent tool", tool_name, module_path)

            # Case 5: Function decorated with @tool
            elif inspect.isfunction(tool) and hasattr(tool, "TOOL_SPEC"):
                try:
                    function_tool = FunctionTool(tool)
                    logger.debug("tool_name=<%s> | registering function tool", function_tool.tool_name)
                    self.register_tool(function_tool)
                    tool_names.append(function_tool.tool_name)
                except Exception as e:
                    logger.warning("tool_name=<%s> | failed to register function tool | %s", tool.__name__, e)
            elif isinstance(tool, AgentTool):
                self.register_tool(tool)
                tool_names.append(tool.tool_name)
            else:
                logger.warning("tool=<%s> | unrecognized tool specification", tool)

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
                function_tools = scan_module_for_tools(module)

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

            new_tool = PythonAgentTool(
                tool_name=tool_name,
                tool_spec=module.TOOL_SPEC,
                callback=tool_function,
            )

            # Register the tool
            self.register_tool(new_tool)

            # Update tool configuration if available
            if self.tool_config is not None:
                self._update_tool_config(self.tool_config, {"spec": module.TOOL_SPEC})
            logger.debug("tool_name=<%s> | successfully reloaded tool", tool_name)

        except Exception:
            logger.exception("tool_name=<%s> | failed to reload tool", tool_name)
            raise

    def initialize_tools(self, load_tools_from_directory: bool = True) -> None:
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
                        function_tools = scan_module_for_tools(module)

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
                                tool = PythonAgentTool(
                                    tool_name=tool_name,
                                    tool_spec=tool_spec,
                                    callback=tool_function,
                                )
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
                            tool = PythonAgentTool(
                                tool_name=tool_name,
                                tool_spec=tool_spec,
                                callback=tool_function,
                            )
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

    def initialize_tool_config(self) -> ToolConfig:
        """Initialize tool configuration from tool handler with optional filtering.

        Returns:
            Tool config.
        """
        all_tools = self.get_all_tools_config()

        tools: List[Tool] = [{"toolSpec": tool_spec} for tool_spec in all_tools.values()]

        return ToolConfig(
            tools=tools,
            toolChoice=cast(ToolChoice, {"auto": ToolChoiceAuto()}),
        )

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

#### `initialize_tool_config()`

Initialize tool configuration from tool handler with optional filtering.

Returns:

| Type | Description | | --- | --- | | `ToolConfig` | Tool config. |

Source code in `strands/tools/registry.py`

```
def initialize_tool_config(self) -> ToolConfig:
    """Initialize tool configuration from tool handler with optional filtering.

    Returns:
        Tool config.
    """
    all_tools = self.get_all_tools_config()

    tools: List[Tool] = [{"toolSpec": tool_spec} for tool_spec in all_tools.values()]

    return ToolConfig(
        tools=tools,
        toolChoice=cast(ToolChoice, {"auto": ToolChoiceAuto()}),
    )

```

#### `initialize_tools(load_tools_from_directory=True)`

Initialize all tools by discovering and loading them dynamically from all tool directories.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `load_tools_from_directory` | `bool` | Whether to reload tools if changes are made at runtime. | `True` |

Source code in `strands/tools/registry.py`

```
def initialize_tools(self, load_tools_from_directory: bool = True) -> None:
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
                    function_tools = scan_module_for_tools(module)

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
                            tool = PythonAgentTool(
                                tool_name=tool_name,
                                tool_spec=tool_spec,
                                callback=tool_function,
                            )
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
                        tool = PythonAgentTool(
                            tool_name=tool_name,
                            tool_spec=tool_spec,
                            callback=tool_function,
                        )
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

    for tool in tools:
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
                function_tools = scan_module_for_tools(tool)
                for function_tool in function_tools:
                    self.register_tool(function_tool)
                    tool_names.append(function_tool.tool_name)

                if not function_tools:
                    logger.warning("tool_name=<%s>, module_path=<%s> | invalid agent tool", tool_name, module_path)

        # Case 5: Function decorated with @tool
        elif inspect.isfunction(tool) and hasattr(tool, "TOOL_SPEC"):
            try:
                function_tool = FunctionTool(tool)
                logger.debug("tool_name=<%s> | registering function tool", function_tool.tool_name)
                self.register_tool(function_tool)
                tool_names.append(function_tool.tool_name)
            except Exception as e:
                logger.warning("tool_name=<%s> | failed to register function tool | %s", tool.__name__, e)
        elif isinstance(tool, AgentTool):
            self.register_tool(tool)
            tool_names.append(tool.tool_name)
        else:
            logger.warning("tool=<%s> | unrecognized tool specification", tool)

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
            function_tools = scan_module_for_tools(module)

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

        new_tool = PythonAgentTool(
            tool_name=tool_name,
            tool_spec=module.TOOL_SPEC,
            callback=tool_function,
        )

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

        if "type" not in prop_def:
            prop_def["type"] = "string"
        if "description" not in prop_def:
            prop_def["description"] = f"Property {prop_name}"

```

## `strands.tools.thread_pool_executor`

Thread pool execution management for parallel tool calls.

### `ThreadPoolExecutorWrapper`

Bases: `ParallelToolExecutorInterface`

Wrapper around ThreadPoolExecutor to implement the strands.types.event_loop.ParallelToolExecutorInterface.

This class adapts Python's standard ThreadPoolExecutor to conform to the SDK's ParallelToolExecutorInterface, allowing it to be used for parallel tool execution within the agent event loop. It provides methods for submitting tasks, monitoring their completion, and shutting down the executor.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `thread_pool` | | The underlying ThreadPoolExecutor instance. |

Source code in `strands/tools/thread_pool_executor.py`

```
class ThreadPoolExecutorWrapper(ParallelToolExecutorInterface):
    """Wrapper around ThreadPoolExecutor to implement the strands.types.event_loop.ParallelToolExecutorInterface.

    This class adapts Python's standard ThreadPoolExecutor to conform to the SDK's ParallelToolExecutorInterface,
    allowing it to be used for parallel tool execution within the agent event loop. It provides methods for submitting
    tasks, monitoring their completion, and shutting down the executor.

    Attributes:
        thread_pool: The underlying ThreadPoolExecutor instance.
    """

    def __init__(self, thread_pool: ThreadPoolExecutor):
        """Initialize with a ThreadPoolExecutor instance.

        Args:
            thread_pool: The ThreadPoolExecutor to wrap.
        """
        self.thread_pool = thread_pool

    def submit(self, fn: Callable[..., Any], /, *args: Any, **kwargs: Any) -> Future:
        """Submit a callable to be executed with the given arguments.

        This method schedules the callable to be executed as fn(*args, **kwargs)
        and returns a Future instance representing the execution of the callable.

        Args:
            fn: The callable to execute.
            *args: Positional arguments for the callable.
            **kwargs: Keyword arguments for the callable.

        Returns:
            A Future instance representing the execution of the callable.
        """
        return self.thread_pool.submit(fn, *args, **kwargs)

    def as_completed(self, futures: Iterable[Future], timeout: Optional[int] = None) -> Iterator[Future]:
        """Return an iterator over the futures as they complete.

        The returned iterator yields futures as they complete (finished or cancelled).

        Args:
            futures: The futures to iterate over.
            timeout: The maximum number of seconds to wait.
                None means no limit.

        Returns:
            An iterator yielding futures as they complete.

        Raises:
            concurrent.futures.TimeoutError: If the timeout is reached.
        """
        return concurrent.futures.as_completed(futures, timeout=timeout)  # type: ignore

    def shutdown(self, wait: bool = True) -> None:
        """Shutdown the thread pool executor.

        Args:
            wait: If True, waits until all running futures have finished executing.
        """
        self.thread_pool.shutdown(wait=wait)

```

#### `__init__(thread_pool)`

Initialize with a ThreadPoolExecutor instance.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `thread_pool` | `ThreadPoolExecutor` | The ThreadPoolExecutor to wrap. | *required* |

Source code in `strands/tools/thread_pool_executor.py`

```
def __init__(self, thread_pool: ThreadPoolExecutor):
    """Initialize with a ThreadPoolExecutor instance.

    Args:
        thread_pool: The ThreadPoolExecutor to wrap.
    """
    self.thread_pool = thread_pool

```

#### `as_completed(futures, timeout=None)`

Return an iterator over the futures as they complete.

The returned iterator yields futures as they complete (finished or cancelled).

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `futures` | `Iterable[Future]` | The futures to iterate over. | *required* | | `timeout` | `Optional[int]` | The maximum number of seconds to wait. None means no limit. | `None` |

Returns:

| Type | Description | | --- | --- | | `Iterator[Future]` | An iterator yielding futures as they complete. |

Raises:

| Type | Description | | --- | --- | | `TimeoutError` | If the timeout is reached. |

Source code in `strands/tools/thread_pool_executor.py`

```
def as_completed(self, futures: Iterable[Future], timeout: Optional[int] = None) -> Iterator[Future]:
    """Return an iterator over the futures as they complete.

    The returned iterator yields futures as they complete (finished or cancelled).

    Args:
        futures: The futures to iterate over.
        timeout: The maximum number of seconds to wait.
            None means no limit.

    Returns:
        An iterator yielding futures as they complete.

    Raises:
        concurrent.futures.TimeoutError: If the timeout is reached.
    """
    return concurrent.futures.as_completed(futures, timeout=timeout)  # type: ignore

```

#### `shutdown(wait=True)`

Shutdown the thread pool executor.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `wait` | `bool` | If True, waits until all running futures have finished executing. | `True` |

Source code in `strands/tools/thread_pool_executor.py`

```
def shutdown(self, wait: bool = True) -> None:
    """Shutdown the thread pool executor.

    Args:
        wait: If True, waits until all running futures have finished executing.
    """
    self.thread_pool.shutdown(wait=wait)

```

#### `submit(fn, /, *args, **kwargs)`

Submit a callable to be executed with the given arguments.

This method schedules the callable to be executed as fn(*args,* \*kwargs) and returns a Future instance representing the execution of the callable.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `fn` | `Callable[..., Any]` | The callable to execute. | *required* | | `*args` | `Any` | Positional arguments for the callable. | `()` | | `**kwargs` | `Any` | Keyword arguments for the callable. | `{}` |

Returns:

| Type | Description | | --- | --- | | `Future` | A Future instance representing the execution of the callable. |

Source code in `strands/tools/thread_pool_executor.py`

```
def submit(self, fn: Callable[..., Any], /, *args: Any, **kwargs: Any) -> Future:
    """Submit a callable to be executed with the given arguments.

    This method schedules the callable to be executed as fn(*args, **kwargs)
    and returns a Future instance representing the execution of the callable.

    Args:
        fn: The callable to execute.
        *args: Positional arguments for the callable.
        **kwargs: Keyword arguments for the callable.

    Returns:
        A Future instance representing the execution of the callable.
    """
    return self.thread_pool.submit(fn, *args, **kwargs)

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

    def invoke(self, tool: ToolUse, *args: Any, **kwargs: dict[str, Any]) -> ToolResult:
        """Invoke the MCP tool.

        This method delegates the tool invocation to the MCP server connection,
        passing the tool use ID, tool name, and input arguments.
        """
        logger.debug("invoking MCP tool '%s' with tool_use_id=%s", self.tool_name, tool["toolUseId"])
        return self.mcp_client.call_tool_sync(
            tool_use_id=tool["toolUseId"], name=self.tool_name, arguments=tool["input"]
        )

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

##### `invoke(tool, *args, **kwargs)`

Invoke the MCP tool.

This method delegates the tool invocation to the MCP server connection, passing the tool use ID, tool name, and input arguments.

Source code in `strands/tools/mcp/mcp_agent_tool.py`

```
def invoke(self, tool: ToolUse, *args: Any, **kwargs: dict[str, Any]) -> ToolResult:
    """Invoke the MCP tool.

    This method delegates the tool invocation to the MCP server connection,
    passing the tool use ID, tool name, and input arguments.
    """
    logger.debug("invoking MCP tool '%s' with tool_use_id=%s", self.tool_name, tool["toolUseId"])
    return self.mcp_client.call_tool_sync(
        tool_use_id=tool["toolUseId"], name=self.tool_name, arguments=tool["input"]
    )

```

### `strands.tools.mcp.mcp_client`

Model Context Protocol (MCP) server connection management module.

This module provides the MCPClient class which handles connections to MCP servers. It manages the lifecycle of MCP connections, including initialization, tool discovery, tool invocation, and proper cleanup of resources. The connection runs in a background thread to avoid blocking the main application thread while maintaining communication with the MCP service.

#### `MCPClient`

Represents a connection to a Model Context Protocol (MCP) server.

This class implements a context manager pattern for efficient connection management, allowing reuse of the same connection for multiple tool calls to reduce latency. It handles the creation, initialization, and cleanup of MCP connections.

The connection runs in a background thread to avoid blocking the main application thread while maintaining communication with the MCP service.

Source code in `strands/tools/mcp/mcp_client.py`

```
class MCPClient:
    """Represents a connection to a Model Context Protocol (MCP) server.

    This class implements a context manager pattern for efficient connection management,
    allowing reuse of the same connection for multiple tool calls to reduce latency.
    It handles the creation, initialization, and cleanup of MCP connections.

    The connection runs in a background thread to avoid blocking the main application thread
    while maintaining communication with the MCP service.
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

        self._invoke_on_background_thread(_set_close_event())
        self._log_debug_with_thread("waiting for background thread to join")
        if self._background_thread is not None:
            self._background_thread.join()
        self._log_debug_with_thread("background thread joined, MCPClient context exited")

        # Reset fields to allow instance reuse
        self._init_future = futures.Future()
        self._close_event = asyncio.Event()
        self._background_thread = None
        self._session_id = uuid.uuid4()

    def list_tools_sync(self) -> List[MCPAgentTool]:
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
            return await self._background_thread_session.list_tools()

        list_tools_response: ListToolsResult = self._invoke_on_background_thread(_list_tools_async())
        self._log_debug_with_thread("received %d tools from MCP server", len(list_tools_response.tools))

        mcp_tools = [MCPAgentTool(tool, self) for tool in list_tools_response.tools]
        self._log_debug_with_thread("successfully adapted %d MCP tools", len(mcp_tools))
        return mcp_tools

    def call_tool_sync(
        self,
        tool_use_id: str,
        name: str,
        arguments: dict[str, Any] | None = None,
        read_timeout_seconds: timedelta | None = None,
    ) -> ToolResult:
        """Synchronously calls a tool on the MCP server.

        This method calls the asynchronous call_tool method on the MCP session
        and converts the result to the ToolResult format.

        Args:
            tool_use_id: Unique identifier for this tool use
            name: Name of the tool to call
            arguments: Optional arguments to pass to the tool
            read_timeout_seconds: Optional timeout for the tool call

        Returns:
            ToolResult: The result of the tool call
        """
        self._log_debug_with_thread("calling MCP tool '%s' synchronously with tool_use_id=%s", name, tool_use_id)
        if not self._is_session_active():
            raise MCPClientInitializationError(CLIENT_SESSION_NOT_RUNNING_ERROR_MESSAGE)

        async def _call_tool_async() -> MCPCallToolResult:
            return await self._background_thread_session.call_tool(name, arguments, read_timeout_seconds)

        try:
            call_tool_result: MCPCallToolResult = self._invoke_on_background_thread(_call_tool_async())
            self._log_debug_with_thread("received tool result with %d content items", len(call_tool_result.content))

            mapped_content = [
                mapped_content
                for content in call_tool_result.content
                if (mapped_content := self._map_mcp_content_to_tool_result_content(content)) is not None
            ]

            status: ToolResultStatus = "error" if call_tool_result.isError else "success"
            self._log_debug_with_thread("tool execution completed with status: %s", status)
            return ToolResult(status=status, toolUseId=tool_use_id, content=mapped_content)
        except Exception as e:
            logger.warning("tool execution failed: %s", str(e), exc_info=True)
            return ToolResult(
                status="error",
                toolUseId=tool_use_id,
                content=[{"text": f"Tool execution failed: {str(e)}"}],
            )

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

    def _invoke_on_background_thread(self, coro: Coroutine[Any, Any, T]) -> T:
        if self._background_thread_session is None or self._background_thread_event_loop is None:
            raise MCPClientInitializationError("the client session was not initialized")

        future = asyncio.run_coroutine_threadsafe(coro=coro, loop=self._background_thread_event_loop)
        return future.result()

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

##### `call_tool_sync(tool_use_id, name, arguments=None, read_timeout_seconds=None)`

Synchronously calls a tool on the MCP server.

This method calls the asynchronous call_tool method on the MCP session and converts the result to the ToolResult format.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_use_id` | `str` | Unique identifier for this tool use | *required* | | `name` | `str` | Name of the tool to call | *required* | | `arguments` | `dict[str, Any] | None` | Optional arguments to pass to the tool | `None` | | `read_timeout_seconds` | `timedelta | None` | Optional timeout for the tool call | `None` |

Returns:

| Name | Type | Description | | --- | --- | --- | | `ToolResult` | `ToolResult` | The result of the tool call |

Source code in `strands/tools/mcp/mcp_client.py`

```
def call_tool_sync(
    self,
    tool_use_id: str,
    name: str,
    arguments: dict[str, Any] | None = None,
    read_timeout_seconds: timedelta | None = None,
) -> ToolResult:
    """Synchronously calls a tool on the MCP server.

    This method calls the asynchronous call_tool method on the MCP session
    and converts the result to the ToolResult format.

    Args:
        tool_use_id: Unique identifier for this tool use
        name: Name of the tool to call
        arguments: Optional arguments to pass to the tool
        read_timeout_seconds: Optional timeout for the tool call

    Returns:
        ToolResult: The result of the tool call
    """
    self._log_debug_with_thread("calling MCP tool '%s' synchronously with tool_use_id=%s", name, tool_use_id)
    if not self._is_session_active():
        raise MCPClientInitializationError(CLIENT_SESSION_NOT_RUNNING_ERROR_MESSAGE)

    async def _call_tool_async() -> MCPCallToolResult:
        return await self._background_thread_session.call_tool(name, arguments, read_timeout_seconds)

    try:
        call_tool_result: MCPCallToolResult = self._invoke_on_background_thread(_call_tool_async())
        self._log_debug_with_thread("received tool result with %d content items", len(call_tool_result.content))

        mapped_content = [
            mapped_content
            for content in call_tool_result.content
            if (mapped_content := self._map_mcp_content_to_tool_result_content(content)) is not None
        ]

        status: ToolResultStatus = "error" if call_tool_result.isError else "success"
        self._log_debug_with_thread("tool execution completed with status: %s", status)
        return ToolResult(status=status, toolUseId=tool_use_id, content=mapped_content)
    except Exception as e:
        logger.warning("tool execution failed: %s", str(e), exc_info=True)
        return ToolResult(
            status="error",
            toolUseId=tool_use_id,
            content=[{"text": f"Tool execution failed: {str(e)}"}],
        )

```

##### `list_tools_sync()`

Synchronously retrieves the list of available tools from the MCP server.

This method calls the asynchronous list_tools method on the MCP session and adapts the returned tools to the AgentTool interface.

Returns:

| Type | Description | | --- | --- | | `List[MCPAgentTool]` | List\[AgentTool\]: A list of available tools adapted to the AgentTool interface |

Source code in `strands/tools/mcp/mcp_client.py`

```
def list_tools_sync(self) -> List[MCPAgentTool]:
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
        return await self._background_thread_session.list_tools()

    list_tools_response: ListToolsResult = self._invoke_on_background_thread(_list_tools_async())
    self._log_debug_with_thread("received %d tools from MCP server", len(list_tools_response.tools))

    mcp_tools = [MCPAgentTool(tool, self) for tool in list_tools_response.tools]
    self._log_debug_with_thread("successfully adapted %d MCP tools", len(mcp_tools))
    return mcp_tools

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

    self._invoke_on_background_thread(_set_close_event())
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
