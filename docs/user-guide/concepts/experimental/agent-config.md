# Agent Configuration [Experimental]

!!! warning "Experimental Feature"
    This feature is experimental and may change in future versions. Use with caution in production environments.

The experimental `config_to_agent` function provides a simple way to create agents from configuration files or dictionaries.

## Overview

`config_to_agent` allows you to:

- Create agents from JSON files or dictionaries
- Use a simple functional interface for agent instantiation
- Support both file paths and dictionary configurations
- Leverage the Agent class's built-in tool loading capabilities

!!! note "Tool Loading Limitations"
    Configuration-based agent setup only works for tools that don't require code-based instantiation. For tools that need constructor arguments or complex setup, use the programmatic approach after creating the agent:
    
    ```python
    import http.client
    from sample_module import ToolWithConfigArg
    
    agent = config_to_agent("config.json")
    # Add tools that need code-based instantiation
    agent.process_tools([ToolWithConfigArg(http.client.HTTPSConnection("localhost"))])
    ```

## Basic Usage

### Dictionary Configuration

```python
from strands.experimental import config_to_agent

# Create agent from dictionary
agent = config_to_agent({
    "model": "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
    "prompt": "You are a helpful assistant"
})
```

### File Configuration

```python
from strands.experimental import config_to_agent

# Load from JSON file (with or without file:// prefix)
agent = config_to_agent("/path/to/config.json")
# or
agent = config_to_agent("file:///path/to/config.json")
```

#### Simple Agent Example

```json
{
    "prompt": "You are a helpful assistant."
}
```

#### Coding Assistant Example

```json
{
  "model": "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
  "prompt": "You are a coding assistant. Help users write, debug, and improve their code. You have access to file operations and can execute shell commands when needed.",
  "tools": ["strands_tools.file_read", "strands_tools.editor", "strands_tools.shell"]
}
```

## Configuration Options

### Supported Keys

- `model`: Model identifier (string) - see [model provider documentation](https://strandsagents.com/latest/user-guide/quickstart/#using-a-string-model-id)
- `prompt`: System prompt for the agent (string)
- `tools`: List of tool specifications (list of strings)
- `name`: Agent name (string)

### Tool Loading

The `tools` configuration supports Python-specific tool loading formats:

```json
{
  "tools": [
    "strands_tools.file_read",           // Python module path
    "my_app.tools.cake_tool",            // Custom module path  
    "/path/to/another_tool.py",          // File path
    "my_module.my_tool_function"         // @tool annotated function
  ]
}
```

!!! important "Python Tool Support Only"
    Currently, tool loading is Python-specific and supports:
    
    - **File paths**: Python files containing @tool annotated functions
    - **Module names**: Python modules with @tool annotated functions
    - **Function references**: Specific @tool annotated functions in modules
    
    Support for tools in other languages will be added when MCP server support is introduced to this feature.

The Agent class handles all tool loading internally, including:
- Loading from module paths
- Loading from file paths
- Error handling for missing tools
- Tool validation

## Function Parameters

The `config_to_agent` function accepts:

- `config`: Either a file path (string) or configuration dictionary
- `**kwargs`: Additional [Agent constructor parameters](https://strandsagents.com/latest/api-reference/agent/#strands.agent.agent.Agent.__init__) that override config values

```python
# Override config values with valid Agent parameters
agent = config_to_agent(
    "/path/to/config.json",
    name="Data Analyst"
)
```

## Error Handling

### Configuration Validation

The `config_to_agent` function validates configuration against a JSON schema and provides detailed error messages:

```python
from strands.experimental import config_to_agent

# Invalid field
try:
    agent = config_to_agent({"model": "test-model", "invalid_field": "value"})
except ValueError as e:
    print(f"Error: {e}")  # Configuration validation error at root: Additional properties are not allowed ('invalid_field' was unexpected)

# Wrong field type
try:
    agent = config_to_agent({"model": "test-model", "tools": "not-a-list"})
except ValueError as e:
    print(f"Error: {e}")  # Configuration validation error at tools: 'not-a-list' is not of type 'array'

# Invalid tool item
try:
    agent = config_to_agent({"model": "test-model", "tools": ["valid-tool", 123]})
except ValueError as e:
    print(f"Error: {e}")  # Configuration validation error at tools -> 1: 123 is not of type 'string'
```

### Tool Validation Errors

The function validates that tools can be loaded and provides helpful error messages:

```python
# Tool not found
try:
    agent = config_to_agent({"model": "test-model", "tools": ["nonexistent_tool"]})
except ValueError as e:
    print(f"Error: {e}")  
    # Tool 'nonexistent_tool' not found. The configured tool is not annotated with @tool, 
    # and is not a module or file. To properly import this tool, you must annotate it with @tool.
```

### File Not Found
```python
from strands.experimental import config_to_agent

try:
    agent = config_to_agent("/nonexistent/config.json")
except FileNotFoundError as e:
    print(f"Error: {e}")  # Configuration file not found
```

### Invalid JSON
```python
try:
    agent = config_to_agent("/path/to/invalid.json")
except json.JSONDecodeError as e:
    print(f"Error: {e}")  # Invalid JSON format
```

### Invalid Configuration Type
```python
try:
    agent = config_to_agent(123)  # Invalid type
except ValueError as e:
    print(f"Error: {e}")  # Config must be a file path string or dictionary
```

### Tool Loading Errors

Tool loading errors are handled by the Agent class according to its standard behavior:

```python
# If tools cannot be loaded, Agent will raise appropriate errors
agent = config_to_agent({
    "model": "test-model",
    "tools": ["nonexistent_tool"]
})
# This will raise an error from the Agent class during tool loading
```

## Best Practices

1. **Use absolute paths**: Prefer absolute file paths for configuration files
2. **Handle errors gracefully**: Catch FileNotFoundError and JSONDecodeError for robust applications
3. **Override when needed**: Use kwargs to override configuration values dynamically
4. **Leverage Agent defaults**: Only specify configuration values you want to override
5. **Use standard tool formats**: Follow Agent class conventions for tool specifications

## Migration from AgentConfig Class

If you were using the previous `AgentConfig` class, here's how to migrate:

### Before (AgentConfig class)
```python
from strands.experimental.agent_config import AgentConfig

config = AgentConfig("/path/to/config.json")
agent = config.to_agent()
```

### After (config_to_agent function)
```python
from strands.experimental import config_to_agent

agent = config_to_agent("/path/to/config.json")
```

The new interface is simpler and delegates all complexity to the existing Agent class, providing a more consistent experience.

This experimental feature provides a foundation for more advanced agent configuration patterns while maintaining full compatibility with the existing Agent API.
