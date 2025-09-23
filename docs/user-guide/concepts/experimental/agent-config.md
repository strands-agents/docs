# Experimental AgentConfig

!!! warning "Experimental Feature"
    This feature is experimental and may change in future versions. Use with caution in production environments.

The experimental `AgentConfig` provides a declarative way to configure and create Agent instances with enhanced instantiation patterns.

## Overview

`AgentConfig` allows you to:

- Load agent configurations from JSON files or dictionaries
- Create Agent instances with the `toAgent()` method
- Integrate with ToolPool for advanced tool management
- Use standardized configuration interfaces

## Basic Usage

### Dictionary Configuration

```python
from strands.experimental import AgentConfig

# Create config from dictionary
config = AgentConfig({
    "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "prompt": "You are a helpful assistant"
})

# Create agent instance
agent = config.toAgent()
```

### File Configuration

Configuration files must use the `file://` prefix:

```python
# Load from JSON file
config = AgentConfig("file:///path/to/config.json")
agent = config.toAgent()
```

Example `config.json`:
```json
{
    "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "prompt": "You are a helpful assistant specialized in data analysis"
}
```

## Integration with ToolPool

`AgentConfig` works seamlessly with `ToolPool` for advanced tool management:

```python
from strands.experimental import AgentConfig, ToolPool
from strands_tools import calculator, current_time

# Create tool pool
tools = ToolPool([calculator, current_time])

# Create agent with tools
config = AgentConfig({
    "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "prompt": "You are a helpful assistant with access to tools"
})

agent = config.toAgent(tools=tools)
```

## Configuration Options

### Supported Keys

- `model`: Model identifier (string)
- `prompt`: System prompt for the agent (string)

### Method Parameters

The `toAgent()` method accepts:

- `tools`: Optional ToolPool instance
- `**kwargs`: Additional Agent constructor parameters that override config values

```python
# Override config values
agent = config.toAgent(
    tools=my_tools,
    temperature=0.7,
    max_tokens=1000
)
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

```python
from strands.experimental import AgentConfig

try:
    # This will raise ValueError
    config = AgentConfig("/path/without/prefix.json")
except ValueError as e:
    print(f"Error: {e}")  # File paths must be prefixed with 'file://'
```

## Best Practices

1. **Use file:// prefix**: Always prefix file paths with `file://`
2. **Validate configurations**: Test your JSON configurations before deployment
3. **Combine with ToolPool**: Use ToolPool for advanced tool management
4. **Override when needed**: Use kwargs to override config values dynamically

## Example: Complete Workflow

```python
from strands.experimental import AgentConfig, ToolPool
from strands_tools import calculator, web_search

# Create tool pool
tools = ToolPool([calculator, web_search])

# Load configuration
config = AgentConfig("file:///app/configs/research-agent.json")

# Create specialized agent
agent = config.toAgent(
    tools=tools,
    temperature=0.3  # Override default temperature
)

# Use the agent
response = agent("Calculate the ROI of a $10,000 investment with 7% annual return over 5 years")
```

This experimental feature provides a foundation for more advanced agent configuration patterns while maintaining compatibility with the existing Agent API.
