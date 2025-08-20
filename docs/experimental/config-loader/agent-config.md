# Agent Configuration Loading

The Agent Configuration Loader enables you to create and configure Strands Agents using Python dictionaries. This approach provides a programmatic way to define agent behavior, making it easier to manage complex agent configurations, build configuration management systems, and dynamically create agents at runtime.

**Note**: This is an experimental feature that provides programmatic configuration loading through dictionaries. For file-based configuration (YAML/JSON), use the main Agent constructor's `config` parameter.

## Quick Start

### Using Dictionary Configuration

```python
from strands.experimental.config_loader.agent import AgentConfigLoader

# Create configuration dictionary
config = {
    "agent": {
        "model": {
            "type": "bedrock",
            "model_id": "us.amazon.nova-pro-v1:0",
            "temperature": 0.7,
            "streaming": True
        },
        "system_prompt": "You are a helpful AI assistant specialized in data analysis.",
        "tools": [
            {"name": "calculator"},
            {"name": "web_search", "module": "my_tools.search"}
        ],
        "agent_id": "data_analyst",
        "name": "Data Analysis Assistant",
        "description": "An AI assistant that helps with data analysis tasks"
    }
}

# Load the agent using AgentConfigLoader
loader = AgentConfigLoader()
agent = loader.load_agent(config)

# Use the agent
response = agent("What is 15 * 23?")
```

### Simple Configuration

```python
from strands.experimental.config_loader.agent import AgentConfigLoader

# Minimal configuration
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

## Schema Validation

The ConfigLoader includes comprehensive schema validation for agents:

- **IDE Integration**: VSCode, IntelliJ, Vim support with autocompletion
- **Error Prevention**: Catch configuration errors before runtime  
- **Type Safety**: Enforced structure and types
- **Documentation**: Schema serves as living documentation

### Global VSCode Settings
Add to your `settings.json`:
```json
{
  "yaml.schemas": {
    "https://strandsagents.com/schemas/config/v1": "*.strands.yml"
  }
}
```

## Configuration Schema

### Basic Configuration

```python
# Minimal configuration
config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a helpful assistant."
    }
}
```

### Complete Configuration

```python
# Complete agent configuration example
config = {
    "agent": {
        "model": {
            "type": "bedrock",
            "model_id": "us.amazon.nova-pro-v1:0",
            "region": "us-west-2",
            "temperature": 0.7,
            "max_tokens": 4096,
            "streaming": True
        },
        "system_prompt": """You are a specialized AI assistant for software development.
You help developers write, debug, and optimize code.""",
        "tools": [
            {"name": "file_reader"},
            {"name": "code_analyzer", "module": "dev_tools.analyzer"},
            {
                "name": "documentation_agent",
                "agent": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "Generate clear documentation for {code_type} code: {code_content}",
                    "tools": []
                },
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "code_type": {
                            "type": "string",
                            "description": "Type of code (Python, JavaScript, etc.)"
                        },
                        "code_content": {
                            "type": "string", 
                            "description": "The code to document"
                        }
                    },
                    "required": ["code_type", "code_content"]
                },
                "prompt": "Generate clear documentation for {code_type} code: {code_content}"
            }
        ],
        "messages": [
            {
                "role": "user",
                "content": [{"text": "Hello, I need help with my Python project."}]
            },
            {
                "role": "assistant", 
                "content": [{"text": "I'd be happy to help with your Python project! What specific aspect would you like assistance with?"}]
            }
        ],
        "agent_id": "dev_assistant",
        "name": "Development Assistant",
        "description": "AI assistant specialized in software development tasks",
        "callback_handler": "printing",
        "conversation_manager": {
            "type": "sliding_window",
            "window_size": 50,
            "should_truncate_results": True
        },
        "record_direct_tool_call": True,
        "load_tools_from_directory": False,
        "trace_attributes": {
            "environment": "production",
            "version": "1.0.0"
        },
        "state": {
            "current_project": None,
            "preferred_language": "python",
            "debug_mode": False
        }
    }
}
```

## Configuration Options

### Model Configuration

#### Simple Model (String)
```python
config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0"
    }
}
```

#### Detailed Model Configuration
```python
config = {
    "agent": {
        "model": {
            "type": "bedrock",  # Currently only 'bedrock' is supported
            "model_id": "us.amazon.nova-pro-v1:0",
            "region": "us-west-2",
            "temperature": 0.7,
            "max_tokens": 4096,
            "streaming": True
        }
    }
}
```

### Tools Configuration

#### Simple Tool References
```python
config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "tools": [
            {"name": "calculator"},
            {"name": "web_search"}
        ]
    }
}
```

#### Tools with Module Paths
```python
config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "tools": [
            {"name": "custom_tool", "module": "my_package.tools"},
            {"name": "file_processor", "module": "utils.file_tools"}
        ]
    }
}
```

#### Agent-as-Tool Configuration
```python
config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a coordinator that uses specialized tools.",
        "tools": [
            {
                "name": "research_assistant",
                "description": "Specialized agent for research tasks",
                "agent": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "Research the topic: {topic} and provide {detail_level} information",
                    "tools": []
                },
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "topic": {
                            "type": "string",
                            "description": "The research topic"
                        },
                        "detail_level": {
                            "type": "string",
                            "enum": ["brief", "detailed", "comprehensive"],
                            "default": "detailed"
                        }
                    },
                    "required": ["topic"]
                }
            }
        ]
    }
}
```

### Messages Configuration

```python
config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a helpful assistant.",
        "messages": [
            {
                "role": "user",
                "content": [{"text": "Hello!"}]
            },
            {
                "role": "assistant",
                "content": [{"text": "Hello! How can I help you today?"}]
            }
        ]
    }
}
```

### Advanced Configuration Options

#### Conversation Manager
```python
config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "conversation_manager": {
            "type": "sliding_window",
            "window_size": 20,
            "should_truncate_results": True
        }
    }
}
```

#### Callback Handler
```python
config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "callback_handler": "printing"  # or custom callback configuration
    }
}
```

#### State Management
```python
config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "state": {
            "user_preferences": {},
            "session_data": {},
            "context": {}
        }
    }
}
```

## Structured Output Configuration

Configure agents to return structured data using Pydantic models:

```python
config = {
    "schemas": [
        {
            "name": "UserProfile",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "User's full name"
                    },
                    "email": {
                        "type": "string",
                        "format": "email",
                        "description": "User's email address"
                    },
                    "age": {
                        "type": "integer",
                        "minimum": 0,
                        "description": "User's age"
                    }
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

# Load agent with structured output
loader = AgentConfigLoader()
agent = loader.load_agent(config)

# Use structured output
result = agent.structured_output("Extract info: John Doe, 30 years old, john@example.com")
print(f"Name: {result.name}")
print(f"Email: {result.email}")
print(f"Age: {result.age}")

# Or use the convenience method
result = agent.extract_userprofile("Extract info: Jane Smith, jane@example.com")
```

### Serialization
```python
# Load from config
agent = loader.load_agent(config)

# Serialize back to config
serialized_config = loader.serialize_agent(agent)
```

## Error Handling

The AgentConfigLoader provides comprehensive error handling:

```python
try:
    agent = loader.load_agent(invalid_config)
except ValueError as e:
    print(f"Configuration error: {e}")
except ImportError as e:
    print(f"Missing dependency: {e}")
```

Common error scenarios:
- **Missing required fields**: Clear messages about required configuration
- **Invalid model configuration**: Specific guidance for model setup
- **Tool loading errors**: Helpful messages for missing or invalid tools
- **Schema validation errors**: Real-time validation with IDE integration

## Best Practices

1. **Use Schema Validation**: Enable IDE integration for better development experience
2. **Structure Tools**: Organize complex tool configurations with clear naming
3. **Test Configurations**: Validate configurations against the schema before deployment
4. **Document Custom Agents**: Provide clear documentation for agent-as-tool configurations

## Advanced Examples

### Multi-Tool Agent with Nested Agents
```python
config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a project manager coordinating specialized team members.",
        "tools": [
            {
                "name": "code_reviewer",
                "agent": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "Review code for quality and best practices: {code}"
                },
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "code": {"type": "string", "description": "Code to review"}
                    },
                    "required": ["code"]
                }
            },
            {
                "name": "documentation_writer",
                "agent": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "Write documentation for: {feature}"
                },
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "feature": {"type": "string", "description": "Feature to document"}
                    },
                    "required": ["feature"]
                }
            }
        ]
    }
}
```

### Agent with Complex State Management
```python
config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a customer service agent with access to user history.",
        "state": {
            "user_id": None,
            "conversation_history": [],
            "user_preferences": {},
            "current_issue": None
        },
        "conversation_manager": {
            "type": "sliding_window",
            "window_size": 30,
            "should_truncate_results": False
        },
        "tools": [
            {"name": "user_lookup", "module": "customer_tools.lookup"},
            {"name": "order_status", "module": "customer_tools.orders"}
        ]
    }
}
```

## Next Steps

- [Structured Output Configuration](structured-output.md) - Detailed structured output setup
- [Tool Configuration](tool-config.md) - Advanced tool loading patterns
- [Graph Configuration](graph-config.md) - Multi-agent workflow configuration
- [Swarm Configuration](swarm-config.md) - Collaborative agent team configuration
                        "type": "string", 
                        "description": "The code to document"
                    }
                },
                "required": ["code_type", "code_content"]
            },
            "prompt": "Generate clear documentation for {code_type} code: {code_content}"
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": [{"text": "Hello, I need help with my Python project."}]
        },
        {
            "role": "assistant", 
            "content": [{"text": "I'd be happy to help with your Python project! What specific aspect would you like assistance with?"}]
        }
    ],
    "agent_id": "dev_assistant",
    "name": "Development Assistant",
    "description": "AI assistant specialized in software development tasks",
    "callback_handler": "printing",
    "conversation_manager": {
        "type": "sliding_window",
        "window_size": 50,
        "should_truncate_results": True
    },
    "record_direct_tool_call": True,
    "load_tools_from_directory": False,
    "trace_attributes": {
        "environment": "production",
        "version": "1.0.0"
    },
    "state": {
        "current_project": None,
        "preferred_language": "python",
        "debug_mode": False
    }
}
```

## Configuration Options

### Model Configuration

#### Simple Model (String)
```python
config = {
    "model": "us.amazon.nova-pro-v1:0"
}
```

#### Detailed Model Configuration
```python
config = {
    "model": {
        "type": "bedrock",  # Currently only 'bedrock' is supported
        "model_id": "us.amazon.nova-pro-v1:0",
        "region": "us-west-2",
        "temperature": 0.7,
        "max_tokens": 4096,
        "streaming": True
    }
}
```

### Tools Configuration

#### Simple Tool References
```python
config = {
    "tools": [
        {"name": "calculator"},
        {"name": "web_search"}
    ]
}
```

#### Tools with Module Paths
```python
config = {
    "tools": [
        {"name": "custom_tool", "module": "my_package.tools"},
        {"name": "file_processor", "module": "utils.file_tools"}
    ]
}
```

#### Agent-as-Tool Configuration
```python
config = {
    "tools": [
        {
            "name": "research_assistant",
            "description": "Specialized agent for research tasks",
            "agent": {
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "Research the topic: {topic} and provide {detail_level} information",
                "tools": []
            },
            "input_schema": {
                "type": "object",
                "properties": {
                    "topic": {
                        "type": "string",
                        "description": "Research topic"
                    },
                    "detail_level": {
                        "type": "string",
                        "description": "Level of detail (brief, detailed, comprehensive)",
                        "default": "detailed"
                    }
                },
                "required": ["topic"]
            },
            "prompt": "Research the topic: {topic} and provide {detail_level} information"
        }
    ]
}
```

### Messages Configuration

Pre-populate conversation history:

```python
config = {
    "messages": [
        {
            "role": "user",
            "content": [{"text": "What can you help me with?"}]
        },
        {
            "role": "assistant",
            "content": [{"text": "I can help you with data analysis, code review, and documentation."}]
        },
        {
            "role": "user", 
            "content": [{"text": "Great! Let's start with some data analysis."}]
        }
    ]
}
```

### Callback Handler Configuration

```python
# Default printing handler
config = {"callback_handler": "printing"}

# Null handler (no output)
config = {"callback_handler": "null"}

# Detailed configuration
config = {
    "callback_handler": {
        "type": "printing"  # or 'null'
    }
}
```

### Conversation Manager Configuration

```python
config = {
    "conversation_manager": {
        "type": "sliding_window",
        "window_size": 40,  # Number of messages to keep
        "should_truncate_results": True
    }
}
```

### Agent State Configuration

```python
config = {
    "state": {
        "user_preferences": {
            "language": "python",
            "verbosity": "detailed"
        },
        "session_data": {
            "project_context": "web_application",
            "last_action": "code_review"
        }
    }
}
```

## Using AgentConfigLoader

### Basic Usage

```python
from strands.experimental.config_loader.agent import AgentConfigLoader

# Create configuration
config = {
    "model": {
        "type": "bedrock",
        "model_id": "us.amazon.nova-pro-v1:0",
        "temperature": 0.8
    },
    "system_prompt": "You are a creative writing assistant.",
    "tools": [
        {"name": "thesaurus"},
        {"name": "grammar_check"}
    ],
    "agent_id": "writer_bot",
    "name": "Creative Writer"
}

# Load agent using AgentConfigLoader
loader = AgentConfigLoader()
agent = loader.load_agent(config)

# Use the agent
response = agent("Help me write a story about space exploration")
```

### Serializing Agents

```python
from strands import Agent
from strands.experimental.config_loader.agent import AgentConfigLoader

# Create agent programmatically
agent = Agent(
    model="us.amazon.nova-pro-v1:0",
    system_prompt="You are a helpful assistant.",
    tools=[calculator, web_search],
    agent_id="my_agent",
    name="Helper Bot"
)

# Serialize to configuration
loader = AgentConfigLoader()
config = loader.serialize_agent(agent)

# The config can now be saved, modified, or used to recreate the agent
print(config)
# Output:
# {
#     'model': 'us.amazon.nova-pro-v1:0',
#     'system_prompt': 'You are a helpful assistant.',
#     'tools': [{'name': 'calculator'}, {'name': 'web_search'}],
#     'agent_id': 'my_agent',
#     'name': 'Helper Bot'
# }
```

## Advanced Examples

### Multi-Agent System Configuration

```python
from strands.experimental.config_loader.agent import AgentConfigLoader

# Coordinator agent configuration
coordinator_config = {
    "model": "us.amazon.nova-pro-v1:0",
    "system_prompt": "You coordinate tasks between specialized agents.",
    "tools": [
        {
            "name": "data_analyst",
            "agent": {
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "Analyze the data: {data} and provide insights",
                "tools": [
                    {"name": "pandas_analyzer"},
                    {"name": "visualization_tool"}
                ]
            },
            "input_schema": {
                "type": "object",
                "properties": {
                    "data": {
                        "type": "string",
                        "description": "Data to analyze"
                    }
                },
                "required": ["data"]
            }
        },
        {
            "name": "report_writer",
            "agent": {
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "Write a {report_type} report based on: {analysis_results}",
                "tools": [{"name": "document_formatter"}]
            },
            "input_schema": {
                "type": "object",
                "properties": {
                    "report_type": {
                        "type": "string",
                        "description": "Type of report (summary, detailed, executive)",
                        "default": "summary"
                    },
                    "analysis_results": {
                        "type": "string",
                        "description": "Results from data analysis"
                    }
                },
                "required": ["analysis_results"]
            }
        }
    ],
    "agent_id": "coordinator",
    "name": "Task Coordinator"
}

loader = AgentConfigLoader()
coordinator_agent = loader.load_agent(coordinator_config)
```

### Environment-Specific Configuration

```python
import os
from strands.experimental.config_loader.agent import AgentConfigLoader

def get_environment_config():
    env = os.getenv("ENVIRONMENT", "development")
    
    base_config = {
        "system_prompt": "You are a helpful assistant.",
        "tools": [{"name": "calculator"}]
    }
    
    if env == "development":
        return {
            **base_config,
            "model": {
                "type": "bedrock",
                "model_id": "us.amazon.nova-lite-v1:0",  # Faster, cheaper model for dev
                "temperature": 0.5
            },
            "callback_handler": "printing",  # Verbose output for debugging
            "trace_attributes": {
                "environment": "development",
                "debug": True
            },
            "load_tools_from_directory": True  # Auto-reload tools during development
        }
    elif env == "production":
        return {
            **base_config,
            "model": {
                "type": "bedrock", 
                "model_id": "us.amazon.nova-pro-v1:0",  # More capable model for production
                "temperature": 0.3
            },
            "callback_handler": "null",  # Minimal output in production
            "trace_attributes": {
                "environment": "production",
                "version": "2.1.0"
            },
            "conversation_manager": {
                "type": "sliding_window",
                "window_size": 100  # Larger context window for production
            }
        }
    else:
        raise ValueError(f"Unknown environment: {env}")

# Load environment-specific configuration
config = get_environment_config()
loader = AgentConfigLoader()
agent = loader.load_agent(config)
```

### Template-Based Agent Tools

```python
code_reviewer_config = {
    "model": "us.amazon.nova-pro-v1:0",
    "system_prompt": "You are a code review coordinator.",
    "tools": [
        {
            "name": "code_reviewer",
            "description": "Reviews code and provides feedback",
            "agent": {
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": """Review the following {language} code for:
- Code quality and best practices
- Potential bugs or issues
- Performance considerations
- Security concerns

Focus level: {focus_level}

Code to review:
{code}""",
                "tools": []
            },
            "input_schema": {
                "type": "object",
                "properties": {
                    "language": {
                        "type": "string",
                        "description": "Programming language"
                    },
                    "code": {
                        "type": "string", 
                        "description": "Code to review"
                    },
                    "focus_level": {
                        "type": "string",
                        "description": "Review focus (quick, thorough, security)",
                        "default": "thorough"
                    }
                },
                "required": ["language", "code"]
            }
        }
    ]
}

loader = AgentConfigLoader()
agent = loader.load_agent(code_reviewer_config)
```

## Error Handling

The AgentConfigLoader provides clear error messages for common issues:

```python
from strands.experimental.config_loader.agent import AgentConfigLoader

loader = AgentConfigLoader()

try:
    # Invalid configuration
    invalid_config = {
        "model": {"type": "unsupported_model"},  # Invalid model type
        "tools": [{"name": "nonexistent_tool"}]  # Tool that doesn't exist
    }
    agent = loader.load_agent(invalid_config)
except ValueError as e:
    print(f"Configuration error: {e}")
except ImportError as e:
    print(f"Tool import error: {e}")

try:
    # Missing required configuration
    incomplete_config = {
        "tools": [{"module": "some_module"}]  # Missing 'name' field
    }
    agent = loader.load_agent(incomplete_config)
except ValueError as e:
    print(f"Missing required field: {e}")
```

Common configuration errors:
- Missing required fields (tool names, agent configurations)
- Invalid model types or configurations  
- Tool loading failures (missing modules, invalid tool definitions)
- Invalid agent-as-tool configurations (missing agent config, invalid input schemas)
- Circular dependencies in agent-as-tool hierarchies

## Best Practices

### 1. Use Descriptive Configuration Structure

```python
# Good: Clear, well-structured configuration
config = {
    "model": {
        "type": "bedrock",
        "model_id": "us.amazon.nova-pro-v1:0",
        "temperature": 0.7
    },
    "system_prompt": "You are a specialized data analysis assistant.",
    "tools": [
        {"name": "pandas_analyzer", "module": "data_tools.pandas"},
        {"name": "visualization_tool", "module": "data_tools.viz"}
    ],
    "agent_id": "data_analyst_v2",
    "name": "Data Analysis Assistant",
    "description": "Specialized agent for data analysis tasks"
}
```

### 2. Environment Separation

```python
def create_agent_config(environment="development"):
    base_config = {
        "system_prompt": "You are a helpful assistant.",
        "tools": [{"name": "calculator"}]
    }
    
    env_configs = {
        "development": {
            "model": "us.amazon.nova-lite-v1:0",
            "callback_handler": "printing",
            "load_tools_from_directory": True
        },
        "production": {
            "model": "us.amazon.nova-pro-v1:0", 
            "callback_handler": "null",
            "conversation_manager": {
                "type": "sliding_window",
                "window_size": 100
            }
        }
    }
    
    return {**base_config, **env_configs.get(environment, {})}
```

### 3. Modular Tool Definitions

```python
# Define reusable tool configurations
COMMON_TOOLS = {
    "calculator": {"name": "calculator"},
    "web_search": {"name": "web_search", "module": "search_tools"},
    "file_reader": {"name": "file_reader", "module": "file_tools"}
}

ANALYSIS_TOOLS = {
    "data_analyzer": {
        "name": "data_analyzer",
        "agent": {
            "model": "us.amazon.nova-lite-v1:0",
            "system_prompt": "Analyze: {data}",
            "tools": []
        },
        "input_schema": {
            "type": "object",
            "properties": {
                "data": {"type": "string", "description": "Data to analyze"}
            },
            "required": ["data"]
        }
    }
}

# Compose configurations
analyst_config = {
    "model": "us.amazon.nova-pro-v1:0",
    "system_prompt": "You are a data analyst.",
    "tools": [
        COMMON_TOOLS["calculator"],
        COMMON_TOOLS["file_reader"], 
        ANALYSIS_TOOLS["data_analyzer"]
    ]
}
```

### 4. Configuration Validation

```python
def validate_agent_config(config):
    """Validate agent configuration before loading."""
    required_fields = ["model", "system_prompt"]
    
    for field in required_fields:
        if field not in config:
            raise ValueError(f"Missing required field: {field}")
    
    # Validate tools configuration
    if "tools" in config:
        for tool in config["tools"]:
            if isinstance(tool, dict):
                if "name" not in tool:
                    raise ValueError("Tool configuration must include 'name' field")
                if "agent" in tool and "input_schema" not in tool:
                    print(f"Warning: Agent tool '{tool['name']}' missing input_schema")
    
    return True

# Use validation
config = {...}
if validate_agent_config(config):
    loader = AgentConfigLoader()
    agent = loader.load_agent(config)
```

### 5. Caching Strategy

```python
from strands.experimental.config_loader.agent import AgentConfigLoader

# Use a single loader instance with caching
loader = AgentConfigLoader()

# Cache frequently used agents
common_configs = {
    "analyst": {...},
    "writer": {...},
    "reviewer": {...}
}

agents = {}
for name, config in common_configs.items():
    agents[name] = loader.load_agent(config)
```

## Migration from Direct Agent Construction

If you have existing agents created directly, you can serialize them to configuration format:

```python
from strands import Agent
from strands.experimental.config_loader.agent import AgentConfigLoader

# Existing agent
agent = Agent(
    model="us.amazon.nova-pro-v1:0",
    system_prompt="You are a helpful assistant.",
    tools=[calculator, web_search],
    agent_id="helper_bot",
    name="Helper Assistant"
)

# Serialize to configuration
loader = AgentConfigLoader()
config = loader.serialize_agent(agent)

# Save configuration for later use
import json
with open("agent_config.json", "w") as f:
    json.dump(config, f, indent=2)

# Later, load from configuration
with open("agent_config.json", "r") as f:
    saved_config = json.load(f)

recreated_agent = loader.load_agent(saved_config)
```

This enables a gradual migration from direct agent construction to configuration-based agent definitions, providing better maintainability and version control for complex agent systems.
