# Experimental Features

!!! warning "Experimental Features"
    The features in this section are experimental and may change in future versions. Use with caution in production environments.

Strands Agents includes experimental features that provide enhanced functionality and improved developer experience. These features are designed to be forward-compatible but may undergo changes based on user feedback and evolving requirements.

## Available Experimental Features

### [AgentConfig](agent-config.md)
Declarative configuration-based agent creation with enhanced instantiation patterns.

- Create configuration-based agents from JSON files or dictionaries
- Use the `toAgent()` method for clean agent instantiation
- Standardized configuration interfaces with `file://` prefix support
- Integration with ToolBox for advanced tool management

### [ToolBox](tool-box.md)
Tool registry and management system with natural constructor API.

- Centralized tool registry for single Strands runtime environments
- Customer interface for tool selection and custom agent creation
- Direct tool function passing: `ToolBox([calculator, current_time])`
- Module imports with `ToolBox.from_module()`
- Platform provider capabilities for multi-tenant tool management

## Getting Started

Import experimental features from the `strands.experimental` namespace:

```python
from strands.experimental import AgentConfig, ToolBox
```

## Quick Example

```python
from strands.experimental import AgentConfig, ToolBox
from strands_tools import calculator, current_time

# Create tool pool
tools = ToolBox([calculator, current_time])

# Create agent configuration
config = AgentConfig({
    "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "prompt": "You are a helpful assistant with access to tools"
})

# Create agent
agent = config.toAgent(tools=tools)

# Use the agent
response = agent("What time is it and what's 15 * 24?")
```

## Design Principles

The experimental features follow these design principles:

1. **Natural APIs**: Intuitive interfaces that feel natural to Python developers
2. **Backward Compatibility**: Work alongside existing Strands Agent features
3. **Type Safety**: Full type hints with modern Python typing syntax
4. **Composability**: Features work together seamlessly
5. **Standards Compliance**: Follow established patterns and conventions

## Feedback and Evolution

These experimental features are actively developed based on user feedback. If you have suggestions or encounter issues, please:

1. Check the existing documentation and examples
2. Review the test cases in the SDK for additional usage patterns
3. Provide feedback through the appropriate channels

## Migration Path

When experimental features graduate to stable status:

1. They will be moved to the main API namespace
2. Backward compatibility will be maintained during transition periods
3. Clear migration guides will be provided
4. Deprecation warnings will be issued for experimental namespaces

The experimental namespace provides a safe space to iterate on new features while maintaining stability in the core API.
