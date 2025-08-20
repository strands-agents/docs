# Experimental Features

## What are Experimental Features?

Experimental features in Strands Agents are cutting-edge capabilities that are:
- In active development and testing
- Subject to breaking changes
- Available for early feedback and evaluation
- Not recommended for production use without careful consideration

## Current Experimental Features

### Configuration Loaders
Declarative configuration for agents, tools, swarms, and graphs with comprehensive schema validation and IDE integration support.

**Key Features:**
- **Schema Validation**: Comprehensive JSON Schema validation with IDE integration
- **IDE Support**: VSCode, IntelliJ, Vim autocompletion and real-time validation
- **Type Safety**: Enforced structure and types without restrictive constraints
- **Nested Configurations**: Support for agents-as-tools, graphs-as-tools, swarms-as-tools
- **Error Prevention**: Catch configuration errors before runtime

**Configuration Types:**
- **Agent Configuration**: Single agents with tools, structured output, and advanced features
- **Graph Configuration**: Multi-agent workflows with nodes, edges, and conditions
- **Swarm Configuration**: Collaborative agent teams with autonomous coordination
- **Tool Configuration**: Standalone tool definitions and agent-as-tool patterns

## Using Experimental Features

### Installation
```bash
# Experimental features are included in the main SDK
pip install strands-agents
```

### Enabling Experimental Features
```python
from strands.experimental.config_loader import AgentConfigLoader

# All configurations require top-level keys for schema validation
config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a helpful assistant.",
        "tools": [{"name": "calculator"}]
    }
}

loader = AgentConfigLoader()
agent = loader.load_agent(config)
```

### IDE Integration Setup

**Global VSCode Settings:**
```json
{
  "yaml.schemas": {
    "https://strandsagents.com/schemas/config/v1": "*.strands.yml"
  }
}
```

## Configuration Examples

### Agent Configuration
```python
config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a helpful assistant.",
        "tools": [
            {"name": "calculator"},
            {
                "name": "research_assistant",
                "agent": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "Research: {topic}"
                },
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "topic": {"type": "string"}
                    },
                    "required": ["topic"]
                }
            }
        ]
    }
}
```

### Graph Configuration
```python
config = {
    "graph": {
        "nodes": [
            {
                "node_id": "classifier",
                "type": "agent",
                "config": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "Classify the input."
                }
            },
            {
                "node_id": "processor",
                "type": "agent",
                "config": {
                    "model": "us.amazon.nova-pro-v1:0",
                    "system_prompt": "Process the classified input."
                }
            }
        ],
        "edges": [
            {
                "from_node": "classifier",
                "to_node": "processor",
                "condition": {
                    "type": "expression",
                    "expression": "state.results.get('classifier', {}).get('status') == 'complete'"
                }
            }
        ],
        "entry_points": ["classifier"]
    }
}
```

### Swarm Configuration
```python
config = {
    "swarm": {
        "max_handoffs": 20,
        "agents": [
            {
                "name": "researcher",
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "You are a research specialist."
            },
            {
                "name": "writer",
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": "You are a writing specialist."
            }
        ]
    }
}
```

## Schema Validation Benefits

### For Developers
- **Real-time Validation**: Catch errors as you type in your IDE
- **Autocompletion**: Get suggestions for configuration properties
- **Type Safety**: Ensure correct data types and structure
- **Documentation**: Schema serves as living documentation

### For Teams
- **Consistency**: Enforced structure across all configurations
- **Error Prevention**: Reduce runtime configuration errors
- **Collaboration**: Clear configuration contracts between team members
- **Maintenance**: Easier to update and maintain complex configurations

## Stability and Support

- **API Stability**: Experimental APIs may change between releases
- **Documentation**: May be incomplete or subject to updates
- **Support**: Community support through GitHub issues
- **Schema Validation**: Production-ready validation system with comprehensive IDE support

## Feedback and Contributions

We encourage feedback on experimental features:
- [GitHub Issues](https://github.com/strands-agents/sdk-python/issues)
- [Discussions](https://github.com/strands-agents/sdk-python/discussions)
- [Contributing Guide](https://github.com/strands-agents/sdk-python/blob/main/CONTRIBUTING.md)

## Next Steps

- [Configuration Loaders Overview](config-loader/overview.md) - Comprehensive guide to configuration loaders
- [Agent Configuration](config-loader/agent-config.md) - Detailed agent configuration options
- [Graph Configuration](config-loader/graph-config.md) - Multi-agent workflow configuration
- [Swarm Configuration](config-loader/swarm-config.md) - Collaborative agent team configuration
- [Tool Configuration](config-loader/tool-config.md) - Tool loading and agent-as-tool patterns
- [Structured Output](config-loader/structured-output.md) - Structured data extraction configuration
