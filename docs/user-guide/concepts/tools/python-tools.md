# Python Tools

There are three approaches to defining python-based tools in Strands:

* **Python functions with the [`@tool`](../../../api-reference/tools.md#strands.tools.decorator.tool) decorator**: Transform regular Python functions into tools by adding a simple decorator. This approach leverages Python's docstrings and type hints to automatically generate tool specifications.

* **Class-based tools with the [`@tool`](../../../api-reference/tools.md#strands.tools.decorator.tool) decorator**: Create tools within classes to maintain state and leverage object-oriented programming patterns.

* **Python modules following a specific format**: Define tools by creating Python modules that contain a tool specification and a matching function. This approach gives you more control over the tool's definition and is useful for dependency-free implementations of tools.

## Python Tool Decorators

The [`@tool`](../../../api-reference/tools.md#strands.tools.decorator.tool) decorator provides a straightforward way to transform regular Python functions into tools that agents can use.

### Basic Example

Here's a simple example of a function decorated as a tool:

```python
from strands import tool

@tool
def weather_forecast(city: str, days: int = 3) -> str:
    """Get weather forecast for a city.

    Args:
        city: The name of the city
        days: Number of days for the forecast
    """
    return f"Weather forecast for {city} for the next {days} days..."
```

The decorator extracts information from your function's docstring to create the tool specification. The first paragraph becomes the tool's description, and the "Args" section provides parameter descriptions. These are combined with the function's type hints to create a complete tool specification.

### Loading Function-Decorated tools

To use function-based tool, simply pass the function to the agent:

```python
agent = Agent(
    tools=[weather_forecast]
)
```

### Overriding Tool Name, Description, and Schema

You can override the tool name, description, and input schema by providing them as arguments to the decorator:

```python
@tool(name="get_weather", description="Retrieves weather forecast for a specified location")
def weather_forecast(city: str, days: int = 3) -> str:
    """Implementation function for weather forecasting.

    Args:
        city: The name of the city
        days: Number of days for the forecast
    """
    return f"Weather forecast for {city} for the next {days} days..."
```

#### Overriding Input Schema

You can provide a custom JSON schema to override the automatically generated one:

```python
@tool(
    inputSchema={
        "json": {
            "type": "object",
            "properties": {
                "shape": {
                    "type": "string",
                    "enum": ["circle", "rectangle"],
                    "description": "The shape type"
                },
                "radius": {"type": "number", "description": "Radius for circle"},
                "width": {"type": "number", "description": "Width for rectangle"},
                "height": {"type": "number", "description": "Height for rectangle"}
            },
            "required": ["shape"]
        }
    }
)
def calculate_area(shape: str, radius: float = None, width: float = None, height: float = None) -> float:
    """Calculate area of a shape."""
    if shape == "circle":
        return 3.14159 * radius ** 2
    elif shape == "rectangle":
        return width * height
    return 0.0
```

### Dictionary Return Type

By default, your function's return value is automatically formatted as a text response. However, if you need more control over the response format, you can return a dictionary with a specific structure:

```python
@tool
def fetch_data(source_id: str) -> dict:
    """Fetch data from a specified source.

    Args:
        source_id: Identifier for the data source
    """
    try:
        data = some_other_function(source_id)
        return {
            "status": "success",
            "content": [ {
                "json": data,
            }]
        }
    except Exception as e:
        return {
            "status": "error",
             "content": [
                {"text": f"Error:{e}"}
            ]
        }
```

For more details, see the [Tool Response Format](#tool-response-format) section below.

### Async Invocation

Decorated tools may also be defined async. Strands will invoke all async tools concurrently.

```Python
import asyncio
from strands import Agent, tool


@tool
async def call_api() -> str:
    """Call API asynchronously."""

    await asyncio.sleep(5)  # simulated api call
    return "API result"


async def async_example():
    agent = Agent(tools=[call_api])
    await agent.invoke_async("Can you call my API?")


asyncio.run(async_example())
```

### ToolContext

Tools can access their execution context by setting `context=True` and including a `tool_context` parameter. The [`ToolContext`](../../../api-reference/types.md#strands.types.tools.ToolContext) provides access to the invoking agent, current tool use data, and invocation state:

```python
from strands import tool, Agent, ToolContext

@tool(context=True)
def get_self_name(tool_context: ToolContext) -> str:
    return f"The agent name is {tool_context.agent.name}"

@tool(context=True)
def get_tool_use_id(tool_context: ToolContext) -> str:
    return f"Tool use is {tool_context.tool_use["toolUseId"]}"

@tool(context=True)
def get_invocation_state(tool_context: ToolContext) -> str:
    return f"Invocation state: {tool_context.invocation_state["custom_data"]}"

agent = Agent(tools=[get_self_name, get_tool_use_id, get_invocation_state], name="Best agent")

agent("What is your name?")
agent("What is the tool use id?")
agent("What is the invocation state?", custom_data="You're the best agent ;)")
```

### Tool Streaming

Async tools can yield intermediate results to provide real-time progress updates. Each yielded value becomes a [streaming event](../streaming/overview.md), with the final value serving as the tool's return result:

```python
from datetime import datetime
import asyncio
from strands import tool

@tool
async def process_dataset(records: int) -> str:
    """Process records with progress updates."""
    start = datetime.now()
    
    for i in range(records):
        await asyncio.sleep(0.1)
        if i % 10 == 0:
            elapsed = datetime.now() - start
            yield f"Processed {i}/{records} records in {elapsed.total_seconds():.1f}s"
    
    yield f"Completed {records} records in {(datetime.now() - start).total_seconds():.1f}s"
```

Stream events contain a `tool_stream_event` dictionary with `tool_use` (invocation info) and `data` (yielded value) fields:

```python
async def tool_stream_example():
    agent = Agent(tools=[process_dataset])

    async for event in agent.stream_async("Process 50 records"):
        if tool_stream := event.get("tool_stream_event"):
            if update := tool_stream.get("data"):
                print(f"Progress: {update}")

asyncio.run(tool_stream_example())
```

## Class-Based Tools

Class-based tools allow you to create tools that maintain state and leverage object-oriented programming patterns. This approach is useful when your tools need to share resources, maintain context between invocations, follow object-oriented design principles, customize tools before passing them to an agent, or create different tool configurations for different agents.

### Example with Multiple Tools in a Class

You can define multiple tools within the same class to create a cohesive set of related functionality:

```python
from strands import Agent, tool

class DatabaseTools:
    def __init__(self, connection_string):
        self.connection = self._establish_connection(connection_string)
        
    def _establish_connection(self, connection_string):
        # Set up database connection
        return {"connected": True, "db": "example_db"}
    
    @tool
    def query_database(self, sql: str) -> dict:
        """Run a SQL query against the database.
        
        Args:
            sql: The SQL query to execute
        """
        # Uses the shared connection
        return {"results": f"Query results for: {sql}", "connection": self.connection}
    
    @tool
    def insert_record(self, table: str, data: dict) -> str:
        """Insert a new record into the database.
        
        Args:
            table: The table name
            data: The data to insert as a dictionary
        """
        # Also uses the shared connection
        return f"Inserted data into {table}: {data}"

# Usage
db_tools = DatabaseTools("example_connection_string")
agent = Agent(
    tools=[db_tools.query_database, db_tools.insert_record]
)
```

When you use the [`@tool`](../../../api-reference/tools.md#strands.tools.decorator.tool) decorator on a class method, the method becomes bound to the class instance when instantiated. This means the tool function has access to the instance's attributes and can maintain state between invocations.

## Python Modules as Tools

An alternative approach is to define a tool as a Python module with a specific structure. This enables creating tools that don't depend on the SDK directly.

A Python module tool requires two key components:

1. A `TOOL_SPEC` variable that defines the tool's name, description, and input schema
2. A function with the same name as specified in the tool spec that implements the tool's functionality

### Basic Example

Here's how you would implement the same weather forecast tool as a module:

```python
# weather_forecast.py

# 1. Tool Specification
TOOL_SPEC = {
    "name": "weather_forecast",
    "description": "Get weather forecast for a city.",
    "inputSchema": {
        "json": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "The name of the city"
                },
                "days": {
                    "type": "integer",
                    "description": "Number of days for the forecast",
                    "default": 3
                }
            },
            "required": ["city"]
        }
    }
}

# 2. Tool Function
def weather_forecast(tool, **kwargs: Any):
    # Extract tool parameters
    tool_use_id = tool["toolUseId"]
    tool_input = tool["input"]

    # Get parameter values
    city = tool_input.get("city", "")
    days = tool_input.get("days", 3)

    # Tool implementation
    result = f"Weather forecast for {city} for the next {days} days..."

    # Return structured response
    return {
        "toolUseId": tool_use_id,
        "status": "success",
        "content": [{"text": result}]
    }
```

### Loading Module Tools

To use a module-based tool, import the module and pass it to the agent:

```python
from strands import Agent
import weather_forecast

agent = Agent(
    tools=[weather_forecast]
)
```

Alternatively, you can load a tool by passing in a path:

```python
from strands import Agent

agent = Agent(
    tools=["./weather_forecast.py"]
)
```

### Async Invocation

Similar to decorated tools, users may define their module tools async.

```Python
TOOL_SPEC = {
    "name": "call_api",
    "description": "Call my API asynchronously.",
    "inputSchema": {
        "json": {
            "type": "object",
            "properties": {},
            "required": []
        }
    }
}

async def call_api(tool, **kwargs):
    await asyncio.sleep(5)  # simulated api call
    result = "API result"

    return {
        "toolUseId": tool["toolUseId"],
        "status": "success",
        "content": [{"text": result}],
    }
```

### Tool Response Format

Tools can return responses in various formats using the [`ToolResult`](../../../api-reference/types.md#strands.types.tools.ToolResult) structure. This structure provides flexibility for returning different types of content while maintaining a consistent interface.

#### ToolResult Structure

The [`ToolResult`](../../../api-reference/types.md#strands.types.tools.ToolResult) dictionary has the following structure:

```python
{
    "toolUseId": str,       # The ID of the tool use request (should match the incoming request).  Optional
    "status": str,          # Either "success" or "error"
    "content": List[dict]   # A list of content items with different possible formats
}
```

#### Content Types

The `content` field is a list of dictionaries, where each dictionary can contain one of the following keys:

- `text`: A string containing text output
- `json`: Any JSON-serializable data structure
- `image`: An image object with format and source
- `document`: A document object with format, name, and source

#### Success Response Example

```python
{
    "toolUseId": "tool-123",
    "status": "success",
    "content": [
        {"text": "Operation completed successfully"},
        {"json": {"results": [1, 2, 3], "total": 3}}
    ]
}
```

#### Error Response Example

```python
{
    "toolUseId": "tool-123",
    "status": "error",
    "content": [
        {"text": "Error: Unable to process request due to invalid parameters"}
    ]
}
```

#### Automatic Conversion

When using the [`@tool`](../../../api-reference/tools.md#strands.tools.decorator.tool) decorator, your function's return value is automatically converted to a proper [`ToolResult`](../../../api-reference/types.md#strands.types.tools.ToolResult):

1. If you return a string or other simple value, it's wrapped as `{"text": str(result)}`
2. If you return a dictionary with the proper [`ToolResult`](../../../api-reference/types.md#strands.types.tools.ToolResult) structure, it's used directly
3. If an exception occurs, it's converted to an error response
