Structured output tool implementation.

This module provides a real tool implementation for structured output that integrates with the existing tool execution and error handling infrastructure.

## StructuredOutputTool

```python
class StructuredOutputTool(AgentTool)
```

Defined in: [src/strands/tools/structured\_output/structured\_output\_tool.py:26](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/structured_output/structured_output_tool.py#L26)

Tool implementation for structured output validation.

#### \_\_init\_\_

```python
def __init__(structured_output_model: type[BaseModel]) -> None
```

Defined in: [src/strands/tools/structured\_output/structured\_output\_tool.py:29](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/structured_output/structured_output_tool.py#L29)

Initialize a structured output tool.

**Arguments**:

-   `structured_output_model` - The Pydantic model class that defines the expected output structure.

#### tool\_name

```python
@property
def tool_name() -> str
```

Defined in: [src/strands/tools/structured\_output/structured\_output\_tool.py:60](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/structured_output/structured_output_tool.py#L60)

Get the name of the tool.

**Returns**:

The name of the tool (same as the Pydantic model class name).

#### tool\_spec

```python
@property
def tool_spec() -> ToolSpec
```

Defined in: [src/strands/tools/structured\_output/structured\_output\_tool.py:69](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/structured_output/structured_output_tool.py#L69)

Get the tool specification for this structured output tool.

**Returns**:

The tool specification generated from the Pydantic model.

#### tool\_type

```python
@property
def tool_type() -> str
```

Defined in: [src/strands/tools/structured\_output/structured\_output\_tool.py:78](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/structured_output/structured_output_tool.py#L78)

Identifies this as a structured output tool implementation.

**Returns**:

“structured\_output”.

#### structured\_output\_model

```python
@property
def structured_output_model() -> type[BaseModel]
```

Defined in: [src/strands/tools/structured\_output/structured\_output\_tool.py:87](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/structured_output/structured_output_tool.py#L87)

Get the Pydantic model type for this tool.

**Returns**:

The Pydantic model class.

#### stream

```python
@override
async def stream(tool_use: ToolUse, invocation_state: dict[str, Any],
                 **kwargs: Any) -> ToolGenerator
```

Defined in: [src/strands/tools/structured\_output/structured\_output\_tool.py:96](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/structured_output/structured_output_tool.py#L96)

Validate the structured output and return appropriate result.

**Arguments**:

-   `tool_use` - The tool use request containing the data to validate.
-   `invocation_state` - Context for the tool invocation (kept for compatibility).
-   `**kwargs` - Additional keyword arguments, including structured\_output\_context.

**Yields**:

Tool events with the last being the tool result (success or error).