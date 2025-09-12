# Agent Configuration

The Strands SDK supports loading agent configuration from JSON files following the [agent-format.md specification](https://github.com/aws/amazon-q-developer-cli/blob/main/docs/agent-format.md) used by Amazon Q Developer CLI.

## Basic Usage

You can initialize an Agent using a configuration file:

```python
from strands import Agent

# Load from configuration file
agent = Agent(config="/path/to/agent-config.json")

# Or from a configuration dictionary
config = {
    "tools": ["shell", "calculator"],
    "model": "us.anthropic.claude-sonnet-4-20250514-v1:0",
    "prompt": "You are a helpful coding assistant"
}
agent = Agent(config=config)
```

## Supported Configuration Fields

Currently, the following fields from the agent-format.md specification are supported:

### `tools`
List of tools available to the agent. Tools can be specified as:

1. **Tool names from strands_tools** (recommended):
```json
{
    "tools": ["calculator", "shell", "current_time"]
}
```

2. **File paths** to custom tool files:
```json
{
    "tools": ["./tools/my_custom_tool.py", "/path/to/another_tool.py"]
}
```

3. **Tool objects** (when using Python dict config):
```python
from strands_tools import calculator, shell

config = {
    "tools": [calculator, shell],
    "model": "us.anthropic.claude-sonnet-4-20250514-v1:0",
    "prompt": "You are a helpful assistant"
}
```

### `model`
Model ID to use for the agent (must be full Bedrock model ID):

```json
{
    "model": "us.anthropic.claude-sonnet-4-20250514-v1:0"
}
```

### `prompt`
System prompt for the agent (maps to `system_prompt` parameter):

```json
{
    "prompt": "You are a helpful assistant specialized in Python development"
}
```

## Example Configuration File

Create a file named `my-agent.json`:

```json
{
    "tools": [
        "calculator",
        "shell",
        "current_time"
    ],
    "model": "us.anthropic.claude-sonnet-4-20250514-v1:0",
    "prompt": "You are an expert Python developer. Help users write clean, efficient code."
}
```

Then load it in your Python code:

```python
from strands import Agent

agent = Agent(config="my-agent.json")
result = agent("Help me write a function to parse JSON files")
print(result.message)
```

## Parameter Precedence

Constructor parameters take precedence over configuration file values:

```python
# Config file has model: "us.anthropic.claude-3-haiku-20240307-v1:0"
# But constructor parameter overrides it
agent = Agent(
    config="my-agent.json",
    model="us.anthropic.claude-sonnet-4-20250514-v1:0"  # This takes precedence
)
```

## Backward Compatibility

The configuration feature is fully backward compatible. Existing Agent initialization continues to work unchanged:

```python
# This still works exactly as before
from strands_tools import shell

agent = Agent(
    model="us.anthropic.claude-sonnet-4-20250514-v1:0",
    tools=[shell],
    system_prompt="You are helpful"
)
```

## Error Handling

The SDK provides clear error messages for configuration issues:

```python
try:
    agent = Agent(config="/nonexistent/config.json")
except ValueError as e:
    print(f"Configuration error: {e}")
    # Output: Configuration error: Failed to load agent configuration: Agent config file not found: /nonexistent/config.json
```

## Future Enhancements

Additional fields from the agent-format.md specification may be supported in future releases, including:

- `mcpServers` - MCP server configurations
- `allowedTools` - Tool permission settings  
- `resources` - File and resource access
- `hooks` - Lifecycle event handlers

For the complete specification, see the [agent-format.md documentation](https://github.com/aws/amazon-q-developer-cli/blob/main/docs/agent-format.md).
