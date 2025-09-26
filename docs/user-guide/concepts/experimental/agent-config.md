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
- `tools`: List of tool names, module paths, or file paths (list of strings)
- `name`: Agent name (string)
- `agent_id`: Agent identifier (string)
- `session_manager`: Session manager instance
- `conversation_manager`: Conversation manager instance
- `hooks`: List of hook providers
- `callback_handler`: Callback handler instance
- `state`: Initial agent state (dict)
- `trace_attributes`: Tracing attributes (dict)

### Tool Loading

The `tools` configuration supports the same formats as the Agent class:

```json
{
  "tools": [
    "strands_tools.file_read",           // Module path
    "my_app.tools.cake_tool",            // Custom module path  
    "/path/to/another_tool.py"           // File path
  ]
}
```

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
    agent_id="my-agent-123",
    name="Data Analyst"
)
```

## Error Handling

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
