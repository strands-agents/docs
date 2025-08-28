# Configuration Loaders Overview

## Introduction

**Note**: This is an experimental feature that provides programmatic configuration loading through Python dictionaries. For file-based configuration (YAML/JSON), use the main constructors' `config` parameter.

Configuration loaders enable programmatic, dictionary-driven definition of agents, tools, swarms, and graphs. This approach provides:

- **Dynamic Configuration**: Create configurations programmatically at runtime
- **Configuration Management**: Build configuration management systems
- **Serialization/Deserialization**: Convert between objects and dictionary representations
- **Caching**: Efficient reuse of configured components
- **Schema Validation**: Comprehensive validation with IDE integration support

## Supported Configuration Format

Configuration loaders work exclusively with Python dictionaries with required top-level keys for programmatic use:

### Python Dictionary Configuration

```python
from strands.experimental.config_loader.agent import AgentConfigLoader

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

### File-Based Configuration (Use Main Constructors)

For loading from YAML/JSON files, use the main constructors instead:

```python
from strands import Agent
from strands.multiagent import Swarm

# File-based loading (not config loaders)
agent = Agent(config="config.yml")
swarm = Swarm(config="swarm.yml")
```

## Schema Validation

The ConfigLoader includes comprehensive schema validation:

- **IDE Integration**: VSCode, IntelliJ, Vim support with autocompletion
- **Error Prevention**: Catch configuration errors before runtime  
- **Type Safety**: Enforced structure and types
- **Documentation**: Schema serves as living documentation

## IDE Integration

### Global VSCode Settings
Add to your `settings.json`:
```json
{
  "yaml.schemas": {
    "https://strandsagents.com/schemas/config/v1": "*.strands.yml"
  }
}
```

### Other IDEs
- **IntelliJ/PyCharm**: Built-in YAML plugin with schema support
- **Vim/Neovim**: Use `coc-yaml` or similar LSP plugins

## Configuration Schema

All configuration loaders follow consistent patterns:
- Dictionary-based configuration with required top-level keys
- Comprehensive schema validation
- Validation and error handling
- Caching and performance optimization
- Programmatic configuration management

## Supported Configuration Types

### Agent Configuration
Define individual agents with models, prompts, tools, and behavior settings using `AgentConfigLoader`.

### Tool Configuration  
Configure tools from Python functions, external modules, or multi-agent configurations using `ToolConfigLoader`.

### Swarm Configuration
Define multi-agent swarms with specialized roles and coordination patterns using `SwarmConfigLoader`.

### Graph Configuration
Create complex multi-agent workflows with conditional routing and dependencies using `GraphConfigLoader`.

## Quick Start Examples

### Basic Agent Configuration

```python
from strands.experimental.config_loader.agent import AgentConfigLoader

config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a helpful customer service agent.",
        "tools": [
            {"name": "calculator"},
            {"name": "web_search", "module": "my_tools.search"}
        ]
    }
}

loader = AgentConfigLoader()
agent = loader.load_agent(config)
response = agent("Help me calculate my order total")
```

### Multi-Agent Swarm Configuration

```python
from strands.experimental.config_loader.swarm import SwarmConfigLoader

config = {
    "swarm": {
        "max_handoffs": 20,
        "agents": [
            {
                "name": "research_agent",
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "You are a research specialist."
            },
            {
                "name": "creative_agent", 
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "You are a creative writing specialist."
            }
        ]
    }
}

loader = SwarmConfigLoader()
swarm = loader.load_swarm(config)
result = swarm("Create a blog post about AI")
```

### Graph Workflow Configuration

```python
from strands.experimental.config_loader.graph import GraphConfigLoader

config = {
    "graph": {
        "nodes": [
            {
                "node_id": "classifier",
                "type": "agent",
                "config": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "You are a request classifier."
                }
            },
            {
                "node_id": "processor",
                "type": "agent", 
                "config": {
                    "model": "us.amazon.nova-pro-v1:0",
                    "system_prompt": "You are a request processor."
                }
            }
        ],
        "edges": [
            {
                "from_node": "classifier",
                "to_node": "processor",
                "condition": {
                    "type": "expression",
                    "expression": "state.results.get('classifier', {}).get('status') == 'completed'"
                }
            }
        ],
        "entry_points": ["classifier"]
    }
}

loader = GraphConfigLoader()
graph = loader.load_graph(config)
result = graph("Process this request")
```

## Configuration Structure Requirements

### Top-Level Keys
All configurations must use the appropriate top-level key:

- **Agent configurations**: `{"agent": {...}}`
- **Graph configurations**: `{"graph": {...}}`
- **Swarm configurations**: `{"swarm": {...}}`
- **Tool configurations**: `{"tools": [...]}`

### Nested Configurations
When using agents, graphs, or swarms as tools, they maintain their required structure:

```python
config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a coordinator.",
        "tools": [
            {
                "name": "research_assistant",
                "agent": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "You are a research specialist."
                }
            }
        ]
    }
}
```

## Advanced Features

### Structured Output
Configure agents to return structured data using Pydantic models:

```python
config = {
    "schemas": [
        {
            "name": "UserProfile",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "email": {"type": "string"}
                },
                "required": ["name", "email"]
            }
        }
    ],
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "Extract user information from text.",
        "structured_output": "UserProfile"
    }
}
```

### Serialization
Convert existing objects back to configuration dictionaries:

```python
# Load from config
agent = loader.load_agent(config)

# Serialize back to config
serialized_config = loader.serialize_agent(agent)
```

## Error Handling

The configuration loaders provide comprehensive error handling:

- **Validation Errors**: Clear messages for invalid configurations
- **Type Errors**: Specific guidance for incorrect data types
- **Missing Dependencies**: Helpful messages for missing tools or models
- **Schema Validation**: Real-time validation with IDE integration

## Best Practices

1. **Use Schema Validation**: Enable IDE integration for better development experience
2. **Structure Configurations**: Organize complex configurations with clear naming
3. **Test Configurations**: Validate configurations against the schema before deployment
4. **Document Custom Tools**: Provide clear documentation for custom tool configurations

## Next Steps

- [Agent Configuration](agent-config.md) - Detailed agent configuration options
- [Graph Configuration](graph-config.md) - Multi-agent workflow configuration
- [Swarm Configuration](swarm-config.md) - Collaborative agent team configuration
- [Tool Configuration](tool-config.md) - Tool loading and agent-as-tool patterns
- [Structured Output](structured-output.md) - Structured data extraction configuration
        },
        {
            "name": "creative_agent",
            "model": "us.amazon.nova-lite-v1:0",
            "system_prompt": "You are a creative solution generator."
        }
    ]
}

loader = SwarmConfigLoader()
swarm = loader.load_swarm(config)
result = swarm("Create a blog post about AI")
```

## Migration from Programmatic Approach

### Before (Direct Instantiation)
```python
from strands import Agent
from strands_tools import calculator, web_search

agent = Agent(
    model="us.amazon.nova-pro-v1:0",
    system_prompt="You are a helpful assistant.",
    tools=[calculator, web_search]
)
```

### After (Configuration-Driven)
```python
from strands.experimental.config_loader.agent import AgentConfigLoader

config = {
    "model": "us.amazon.nova-pro-v1:0",
    "system_prompt": "You are a helpful assistant.",
    "tools": [
        {"name": "calculator"},
        {"name": "web_search"}
    ]
}

loader = AgentConfigLoader()
agent = loader.load_agent(config)
```

---

## Available Configuration Loaders

### AgentConfigLoader
Loads and serializes Strands Agent instances via dictionary configurations. Supports model configuration, tool loading, structured output, and advanced agent features.

**Key Methods:**
- `load_agent(config)` - Load agent from dictionary configuration
- `serialize_agent(agent)` - Serialize agent to dictionary configuration

### ToolConfigLoader
Loads AgentTool instances via string identifiers or multi-agent configurations. Supports @tool decorated functions, module-based tools, and Agent-as-Tool functionality.

**Key Methods:**
- `load_tool(tool, module_path=None)` - Load tool by identifier or configuration
- `load_tools(identifiers)` - Load multiple tools
- `get_available_tools(module_path=None)` - Get list of available tool identifiers

### SwarmConfigLoader
Loads and serializes Strands Swarm instances via dictionary configurations. Leverages AgentConfigLoader for agent management and adds swarm-specific configuration.

**Key Methods:**
- `load_swarm(config)` - Load swarm from dictionary configuration
- `serialize_swarm(swarm)` - Serialize swarm to dictionary configuration
- `load_agents(agents_config)` - Load multiple agents from configuration

### GraphConfigLoader
Loads and serializes Strands Graph instances via dictionary configurations. Supports nodes, edges, entry points, and condition configurations.

**Key Methods:**
- `load_graph(config)` - Load graph from dictionary configuration
- `serialize_graph(graph)` - Serialize graph to dictionary configuration

---

## Future: Constructor Integration

**Note**: This section documents a future enhancement that would integrate configuration loading directly into the main constructors for improved API fluidity and developer experience.

### Enhanced Constructor Interface

The future implementation would extend the main constructors (`Agent()`, `Graph()`, and `Swarm()`) with a `config` parameter, enabling seamless configuration-driven initialization alongside traditional programmatic instantiation.

#### Agent Constructor Enhancement

```python
from strands import Agent

# File-based configuration
agent = Agent(config="agent_config.yaml")
agent = Agent(config="agent_config.json")

# Dictionary-based configuration
agent = Agent(config={
    "model": "us.amazon.nova-pro-v1:0",
    "system_prompt": "You are a helpful assistant.",
    "tools": [{"name": "calculator"}]
})

# Hybrid approach - config with parameter overrides
agent = Agent(
    config="base_config.yaml",
    model="us.amazon.nova-lite-v1:0",  # Override config model
    system_prompt="Custom prompt"      # Override config prompt
)
```

#### Swarm Constructor Enhancement

```python
from strands.multiagent import Swarm

# File-based configuration
swarm = Swarm(config="swarm_config.yaml")

# Dictionary-based configuration
swarm = Swarm(config={
    "max_handoffs": 15,
    "agents": [
        {
            "name": "researcher",
            "model": "us.amazon.nova-pro-v1:0",
            "system_prompt": "You are a research specialist."
        }
    ]
})

# Parameter override capability
swarm = Swarm(
    config="base_swarm.yaml",
    max_handoffs=25,  # Override config value
    execution_timeout=1200.0
)
```

#### Graph Constructor Enhancement

```python
from strands.multiagent import Graph

# File-based configuration via GraphBuilder
graph = Graph.from_config("graph_config.yaml").build()

# Dictionary-based configuration
graph = Graph.from_config({
    "nodes": [
        {
            "id": "analyzer",
            "agent": {
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": "Analyze the input data."
            }
        }
    ],
    "edges": [
        {"from": "analyzer", "to": "reporter"}
    ],
    "entry_points": ["analyzer"]
}).build()
```

### API Fluidity Advantages

#### Unified Interface
- **Consistent Experience**: Single constructor interface supports both programmatic and configuration-driven approaches
- **Seamless Migration**: Easy transition from code-based to config-based initialization without changing the fundamental API
- **Reduced Learning Curve**: Developers familiar with the main constructors can immediately use configuration features

#### Flexible Configuration Management
- **Parameter Override**: Config provides defaults while explicit parameters override specific values
- **Environment Adaptation**: Same codebase can use different configurations for development, staging, and production
- **Dynamic Configuration**: Runtime configuration selection based on conditions or user input

#### Enhanced Developer Experience
- **Reduced Boilerplate**: Configuration files eliminate repetitive parameter specification
- **Better Maintainability**: Centralized configuration management separate from application logic
- **Version Control Friendly**: Configuration changes tracked separately from code changes
- **IDE Support**: Full IntelliSense and type checking for both config and parameter approaches

#### Backward Compatibility
- **Zero Breaking Changes**: Existing code continues to work unchanged
- **Gradual Adoption**: Teams can migrate to configuration-driven approach incrementally
- **Interoperability**: Mix and match approaches within the same application

### Implementation Benefits

The enhanced constructor approach provides superior API fluidity by:

1. **Eliminating Context Switching**: Developers stay within familiar constructor patterns rather than learning separate loader classes
2. **Reducing Import Complexity**: No need to import and manage separate config loader classes
3. **Maintaining Type Safety**: Full type hints and validation for both configuration and parameter approaches
4. **Enabling Hybrid Workflows**: Seamless combination of configuration defaults with runtime parameter overrides
5. **Preserving Existing Patterns**: All current usage patterns remain valid while adding new capabilities

This approach represents the natural evolution of the Strands Agents API, providing maximum flexibility while maintaining the simplicity and elegance that developers expect from the framework.
