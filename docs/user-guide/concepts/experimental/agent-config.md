# AgentConfig [Experimental]

!!! warning "Experimental Feature"
    This feature is experimental and may change in future versions. Use with caution in production environments.

The experimental `AgentConfig` provides a declarative way to create configuration-based agents with enhanced instantiation patterns.

## Overview

`AgentConfig` allows you to:

- Create configuration-based agents from JSON files or dictionaries
- Use the `to_agent()` method for clean agent instantiation
- Integrate with [ToolRegistry](https://strandsagents.com/latest/documentation/docs/api-reference/tools/#strands.tools.registry.ToolRegistry) for advanced tool management
- Use standardized configuration interfaces

## Basic Usage

### Dictionary Configuration

```python
from strands.experimental import AgentConfig

# Create config from dictionary
config = AgentConfig({
    "model": "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
    "prompt": "You are a helpful assistant"
})

# Create agent instance (uses default tools from strands_tools)
agent = config.to_agent()
```

### Using Default Tools

When no ToolRegistry is provided, AgentConfig automatically loads default tools from `strands_tools`:

```python
from strands.experimental import AgentConfig

# This will use the default tools: file_read, editor, http_request, shell, use_agent
config = AgentConfig({
    "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "prompt": "You are a helpful assistant with file and web capabilities"
})

agent = config.to_agent()

# Agent now has access to default tools
response = agent("Read the contents of README.md and summarize it")
```

### Selecting from Default Tools

You can also select specific tools from the default set:

```python
from strands.experimental import AgentConfig

# Select only specific default tools
config = AgentConfig({
    "model": "anthropic.claude-3-5-sonnet-20241022-v2:0", 
    "prompt": "You are a file management assistant",
    "tools": ["file_read", "editor"]  # Only file operations, no web/shell
})

agent = config.to_agent()
```

!!! warning "Requires strands_tools"
    Default tools require `pip install strands-agents-tools`. If not installed, you will have to configure your own ToolRegistry with your own tools.

### File Configuration

Configuration files must use the `file://` prefix:

```python
# Load from JSON file
config = AgentConfig("file:///path/to/config.json")
agent = config.to_agent()
```

Example `config.json`:
```json
{
    "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "prompt": "You are a helpful assistant specialized in data analysis"
}
```

## Integration with ToolRegistry

`AgentConfig` works seamlessly with `ToolRegistry` for advanced tool management:

```python
from strands.experimental import AgentConfig
from strands.tools.registry import ToolRegistry
from strands_tools import calculator, current_time

# Create tool registry
tool_registry = ToolRegistry()
tool_registry.process_tools([calculator, current_time])

# Create agent with tools
config = AgentConfig({
    "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "prompt": "You are a helpful assistant with access to tools"
})

agent = config.to_agent(tools=tools)
```

## Configuration Options

### Supported Keys

- `model`: Model identifier (string)
- `prompt`: System prompt for the agent (string)
- `tools`: List of tool names to select from the provided ToolRegistry (optional)

### Method Parameters

The `to_agent()` method accepts:

- `tools`: Optional ToolRegistry instance to override the configured tools
- `**kwargs`: Additional Agent constructor parameters that override config values

```python
# Override config values
agent = config.to_agent(
    tools=my_tools,
    temperature=0.7,
    max_tokens=1000
)
```

## Default Tools Behavior

When no ToolRegistry is provided, AgentConfig attempts to create a default ToolRegistry with these tools from `strands_tools`:

- `file_read` - File reading operations
- `editor` - Text editing capabilities  
- `http_request` - HTTP requests
- `shell` - Shell command execution
- `use_agent` - Agent delegation

!!! note "Experimental Tool List"
    This is a minimum viable list of tools to enable agent building. The list is experimental and will be revisited as tools evolve.

If `strands_tools` is not installed, you must provide your own ToolRegistry:

```python
from strands.experimental import AgentConfig
from strands.tools.registry import ToolRegistry
from strands import tool

@tool
def my_custom_tool(input: str) -> str:
    """My custom tool implementation."""
    return f"Processed: {input}"

# Create custom ToolRegistry
custom_tool_registry = ToolRegistry()
custom_tool_registry.process_tools([my_custom_tool])

# Use with AgentConfig
config = AgentConfig({
    "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "prompt": "You are a helpful assistant"
}, tool_registry=custom_tool_registry)
```

## Tool Selection

When `tools` is specified in the configuration, AgentConfig validates and selects only those tools from the provided ToolRegistry:

```python
# Platform provider creates comprehensive ToolRegistry
platform_tool_registry = ToolRegistry()
platform_tool_registry.process_tools([calculator, web_search, file_ops, data_analysis])

# Customer selects specific tools
config = AgentConfig({
    "model": "anthropic.claude-3-5-sonnet-20241022-v2:0", 
    "prompt": "You are a research assistant",
    "tools": ["calculator", "web_search"]  # Only these will be available
}, tool_registry=platform_tool_registry)

agent = config.to_agent()  # Agent has only calculator and web_search
```

## File Path Requirements

File paths must be prefixed with `file://` to maintain a standard interface:

```python
# ✅ Correct
config = AgentConfig("file:///absolute/path/to/config.json")

# ❌ Incorrect - will raise ValueError
config = AgentConfig("/absolute/path/to/config.json")
```

## Error Handling

### File Path Errors
```python
from strands.experimental import AgentConfig

try:
    # This will raise ValueError
    config = AgentConfig("/path/without/prefix.json")
except ValueError as e:
    print(f"Error: {e}")  # File paths must be prefixed with 'file://'
```

### Tool Validation Errors
```python
from strands.experimental import AgentConfig
from strands.tools.registry import ToolRegistry

# Tool not found in ToolRegistry
try:
    config = AgentConfig({
        "model": "test-model",
        "tools": ["nonexistent_tool"]
    }, tool_registry=ToolRegistry())
except ValueError as e:
    print(f"Error: {e}")  # Tool 'nonexistent_tool' not found in ToolRegistry
```

### Missing Dependencies
```python
# When strands_tools not installed and no ToolRegistry provided
try:
    config = AgentConfig({"model": "test-model"})
except ImportError as e:
    print(f"Error: {e}")  
    # strands_tools is not available and no ToolRegistry was specified. 
    # Either install strands_tools with 'pip install strands-agents-tools' 
    # or provide your own ToolRegistry with your own tools.
```

### Tool Configuration Without ToolRegistry
```python
# Specifying tools without providing ToolRegistry
try:
    config = AgentConfig({
        "model": "test-model",
        "tools": ["calculator"]
    })  # No tool_registry parameter
except ValueError as e:
    print(f"Error: {e}")  # Tool names specified in config but no ToolRegistry provided
```

## Best Practices

1. **Use file:// prefix**: Always prefix file paths with `file://`
2. **Install strands_tools**: Use `pip install strands-agents-tools` for default tools
3. **Provide custom ToolRegistry**: Create your own ToolRegistry if not using strands_tools
4. **Validate tool selection**: Ensure tool names exist in your ToolRegistry before configuration
5. **Tool registry pattern**: Use ToolRegistry as a registry for customer tool selection
6. **Override when needed**: Use kwargs to override config values dynamically
7. **Handle errors gracefully**: Catch ImportError and ValueError for robust applications

## Example: Complete Workflow

```python
from strands.experimental import AgentConfig
from strands.tools.registry import ToolRegistry
from strands import tool

# Define custom tools
@tool
def custom_calculator(expression: str) -> float:
    """Evaluate a mathematical expression safely."""
    # Safe evaluation logic here
    return eval(expression)  # Note: Use safe evaluation in production

@tool  
def data_processor(data: str) -> str:
    """Process data with custom logic."""
    return f"Processed: {data}"

try:
    # Create tool registry with custom tools
    tool_registry = ToolRegistry()
    tool_registry.process_tools([custom_calculator, data_processor])
    
    # Load configuration with tool selection
    config = AgentConfig({
        "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
        "prompt": "You are a data analysis assistant",
        "tools": ["custom_calculator"]  # Only calculator available to agent
    }, tool_registry=tool_registry)
    
    # Create agent with selected tools
    agent = config.to_agent(temperature=0.3)
    
    # Use the agent
    response = agent("Calculate the compound interest on $1000 at 5% for 3 years")
    
except ImportError as e:
    print(f"Missing dependencies: {e}")
    # Handle by installing strands_tools or providing custom ToolRegistry
    
except ValueError as e:
    print(f"Configuration error: {e}")
    # Handle tool validation or file path errors
```

This experimental feature provides a foundation for more advanced agent configuration patterns while maintaining compatibility with the existing Agent API.
