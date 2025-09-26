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

When no ToolRegistry is provided, AgentConfig automatically instantiates a default ToolRegistry with a subset of the strands_tools from which you can select for your agent:

- [`file_read`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/file_read.py) - File reading operations
- [`editor`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/editor.py) - Text editing capabilities  
- [`http_request`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/http_request.py) - HTTP requests
- [`shell`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/shell.py) - Shell command execution
- [`use_agent`](https://github.com/strands-agents/tools/blob/main/src/strands_tools/use_agent.py) - Agent delegation

!!! note "Experimental Tool List"
    This is a minimal list of tools to get you started with building your own agent. The list is experimental and will be revisited as tools evolve.

```python
from strands.experimental import AgentConfig

# Agent with file_read tool
config = AgentConfig({
    "prompt": "You are a helpful assistant that can help answer questions about your file system.",
    "tools": ["file_read"]
})

agent = config.to_agent()

# Agent can read files and answer questions about the file system
response = agent("What's in my README.md file?")
```

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
    "prompt": "You are a helpful assistant",
    "tools": ["my_custom_tool"]
}, tool_registry=custom_tool_registry)
```

### File Configuration

Configuration files must use the `file://` prefix:

```python
# Load from JSON file
config = AgentConfig("file:///path/to/config.json")
agent = config.to_agent()
```

#### Simple Agent Example

```json
{
    "model": "us.anthropic.claude-3-haiku-20240307-v1:0",
    "prompt": "You are a helpful assistant."
}
```

#### Coding Assistant Example

```json
{
  "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
  "prompt": "You are a coding assistant. Help users write, debug, and improve their code. You have access to file operations and can execute shell commands when needed.",
  "tools": ["shell", "file_read", "editor"]
}
```

## Integration with ToolRegistry

`AgentConfig` works seamlessly with `ToolRegistry` for advanced tool management:

```python

# Create agent with tools
config = AgentConfig({
    "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "prompt": "You are a helpful assistant with access to tools",
    "tools": ["file_read", "editor"]
})
```

## Configuration Options

### Supported Keys

- `model`: Model identifier (string) - see [model provider documentation](https://strandsagents.com/latest/user-guide/quickstart/#using-a-string-model-id)
- `prompt`: System prompt for the agent (string)
- `tools`: List of tool names to select from the provided ToolRegistry (optional)

### Method Parameters

The `to_agent()` method accepts:

- `tools`: Optional ToolRegistry instance to override the configured tools
- `**kwargs`: Additional Agent constructor parameters that override config values

```python
# Override config values with valid Agent parameters
agent = config.to_agent(
    agent_id="my-agent-123",
    name="Data Analyst",
    description="Specialized data analysis agent"
)
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

# Tool not found in ToolRegistry (with raise_exception_on_missing_tool=True, default behavior)
try:
    config = AgentConfig({
        "model": "test-model",
        "tools": ["nonexistent_tool"]
    }, tool_registry=ToolRegistry(), raise_exception_on_missing_tool=True)
except ValueError as e:
    print(f"Error: {e}")  # Tool(s) 'nonexistent_tool' not found in ToolRegistry

# Skip missing tools instead of raising errors
config = AgentConfig({
    "model": "test-model",
    "tools": ["existing_tool", "nonexistent_tool"]
}, tool_registry=my_tool_registry, raise_exception_on_missing_tool=False)
# Only existing_tool will be available, nonexistent_tool is silently skipped
```

### Missing Dependencies
```python
# When strands_tools not installed and no ToolRegistry provided (with raise_exception_on_missing_tool=True)
try:
    config = AgentConfig({"model": "test-model", "tools": ["file_read"]}, raise_exception_on_missing_tool=True)
except ImportError as e:
    print(f"Error: {e}")  
    # strands_tools is not available and no ToolRegistry was specified. 
    # Either install strands_tools with 'pip install strands-agents-tools' 
    # or provide your own ToolRegistry with your own tools.

# Skip missing tools when strands_tools not available
config = AgentConfig({"model": "test-model", "tools": ["file_read"]}, raise_exception_on_missing_tool=False)
# Will create agent without any tools since strands_tools is not available
```

### Tool Configuration Without ToolRegistry
```python
# Specifying tools without providing ToolRegistry (with raise_exception_on_missing_tool=True)
try:
    config = AgentConfig({
        "model": "test-model",
        "tools": ["calculator"]
    }, raise_exception_on_missing_tool=True)  # No tool_registry parameter
except ValueError as e:
    print(f"Error: {e}")  # Tool(s) not found in ToolRegistry

# Skip missing tools when no ToolRegistry provided
config = AgentConfig({
    "model": "test-model",
    "tools": ["calculator"]
}, raise_exception_on_missing_tool=False)  # No tool_registry parameter
# Will attempt to use default ToolRegistry, skip unavailable tools
```

## Best Practices

1. **Use file:// prefix**: Always prefix file paths with `file://`
2. **Install strands_tools**: Use `pip install strands-agents-tools` for default tools
3. **Provide custom ToolRegistry**: Create your own ToolRegistry if not using strands_tools
4. **Validate tool selection**: Ensure tool names exist in your ToolRegistry before configuration
5. **Override when needed**: Use kwargs in `to_agent` to override Agent parameters values dynamically
6. **Handle errors gracefully**: Catch ImportError and ValueError for robust applications
7. **Control error behavior**: Use `raise_exception_on_missing_tool=False` to skip missing tools instead of failing

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
    
    # Create agent with selected tools and override parameters
    agent = config.to_agent(agent_id="data-analyst-001", name="Data Analyst")
    
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
