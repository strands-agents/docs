# Tool Configuration Loading

The Tool Configuration Loader provides flexible mechanisms for loading and managing tools in Strands Agents. It supports traditional `@tool` decorated functions, module-based tools, custom tool classes, and a powerful **Agent-as-Tool** feature that allows entire agents to be used as tools within other agents.

**Note**: This is an experimental feature that provides programmatic tool configuration loading through dictionaries. For file-based configuration, use the main constructors' `config` parameter.

## Overview

The `ToolConfigLoader` enables:

1. **String-based tool loading**: Load tools by identifier from modules or registries
2. **Module-based tool loading**: Support for tools that follow the TOOL_SPEC pattern
3. **Agent-as-Tool**: Configure complete agents as reusable tools with parameter substitution
4. **Swarm-as-Tool**: Configure swarms as tools for complex multi-agent operations
5. **Graph-as-Tool**: Configure graphs as tools for workflow-based operations
6. **Dynamic tool resolution**: Automatic discovery and loading from various sources
7. **Caching**: Efficient tool reuse across multiple agent instances

## Schema Validation

The ConfigLoader includes comprehensive schema validation for tools:

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

## Agent-as-Tool Configuration

The most powerful feature is the ability to define specialized agents as tools that can be used by other agents. This enables hierarchical agent architectures and specialized sub-agents.

### Basic Agent-as-Tool Example

```python
from strands.experimental.config_loader.tools import ToolConfigLoader

# Define an agent-as-tool configuration
research_tool_config = {
    "name": "research_assistant",
    "description": "Specialized research agent that can investigate topics",
    "agent": {
        "model": "us.amazon.nova-lite-v1:0",
        "system_prompt": "Research the topic '{topic}' and provide {detail_level} information.",
        "tools": []  # This agent doesn't need additional tools
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
                "description": "Level of detail (brief, detailed, comprehensive)",
                "default": "detailed"
            }
        },
        "required": ["topic"]
    }
}

# Load the agent-as-tool
loader = ToolConfigLoader()
research_tool = loader.load_tool(research_tool_config)

# Use with an agent
from strands.experimental.config_loader.agent import AgentConfigLoader
agent_config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a coordinator that uses specialized tools.",
        "tools": [research_tool_config]  # Pass the config directly
    }
}

agent_loader = AgentConfigLoader()
agent = agent_loader.load_agent(agent_config)

# The agent can now use the research tool
response = agent("Please research quantum computing and provide comprehensive information")
```

### Template Variable Substitution with Prompt Field

Agent-as-Tool configurations support template variable substitution using `{variable_name}` syntax. You can use either the `system_prompt` field in the agent configuration or a separate `prompt` field:

```python
code_reviewer_config = {
    "name": "code_reviewer",
    "description": "Reviews code and provides detailed feedback",
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a code review expert.",
        "tools": []
    },
    "input_schema": {
        "type": "object",
        "properties": {
            "language": {
                "type": "string",
                "description": "Programming language (Python, JavaScript, etc.)"
            },
            "code": {
                "type": "string",
                "description": "The code to review"
            },
            "focus_area": {
                "type": "string",
                "description": "Primary focus area for review",
                "default": "general quality"
            }
        },
        "required": ["language", "code"]
    },
    # Use prompt field for template substitution
    "prompt": "Review this {language} code focusing on {focus_area}: {code}"
}

# Use in agent configuration
agent_config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a development team lead with access to specialized reviewers.",
        "tools": [code_reviewer_config]
    }
}
```

### Advanced Agent-as-Tool with Multiple Capabilities

```python
documentation_agent_config = {
    "name": "documentation_writer",
    "description": "Specialized agent for writing technical documentation",
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a technical documentation specialist.",
        "tools": [
            {"name": "code_analyzer", "module": "dev_tools.analyzer"},
            {"name": "style_checker", "module": "writing_tools.style"}
        ],
        "conversation_manager": {
            "type": "sliding_window",
            "window_size": 30
        }
    },
    "input_schema": {
        "type": "object",
        "properties": {
            "code_snippet": {
                "type": "string",
                "description": "Code to document"
            },
            "documentation_type": {
                "type": "string",
                "enum": ["api", "tutorial", "reference", "guide"],
                "description": "Type of documentation to create"
            },
            "audience": {
                "type": "string",
                "enum": ["beginner", "intermediate", "advanced"],
                "default": "intermediate"
            }
        },
        "required": ["code_snippet", "documentation_type"]
    },
    "prompt": "Create {documentation_type} documentation for {audience} level audience: {code_snippet}"
}
```

## Swarm-as-Tool Configuration

Configure entire swarms as tools for complex multi-agent operations:

```python
research_swarm_tool_config = {
    "name": "research_team",
    "description": "Multi-agent research team for comprehensive analysis",
    "swarm": {
        "max_handoffs": 15,
        "agents": [
            {
                "name": "data_collector",
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "Collect relevant data and sources on the research topic."
            },
            {
                "name": "analyst",
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": "Analyze collected data and identify key insights."
            },
            {
                "name": "synthesizer",
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": "Synthesize analysis into comprehensive research report."
            }
        ]
    },
    "input_schema": {
        "type": "object",
        "properties": {
            "research_topic": {
                "type": "string",
                "description": "Topic to research"
            },
            "depth": {
                "type": "string",
                "enum": ["surface", "detailed", "comprehensive"],
                "default": "detailed"
            }
        },
        "required": ["research_topic"]
    },
    "entry_agent": "data_collector"  # Specify which agent receives the initial input
}

# Use in agent configuration
coordinator_config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You coordinate research projects using specialized teams.",
        "tools": [research_swarm_tool_config]
    }
}
```

## Graph-as-Tool Configuration

Configure graph workflows as tools for complex processing pipelines:

```python
content_pipeline_tool_config = {
    "name": "content_pipeline",
    "description": "Multi-stage content creation and review pipeline",
    "graph": {
        "nodes": [
            {
                "node_id": "writer",
                "type": "agent",
                "config": {
                    "model": "us.amazon.nova-pro-v1:0",
                    "system_prompt": "Create engaging content based on the brief."
                }
            },
            {
                "node_id": "editor",
                "type": "agent",
                "config": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "Edit content for clarity and engagement."
                }
            },
            {
                "node_id": "reviewer",
                "type": "agent",
                "config": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "Final review for quality and accuracy."
                }
            }
        ],
        "edges": [
            {
                "from_node": "writer",
                "to_node": "editor",
                "condition": {
                    "type": "expression",
                    "expression": "state.results.get('writer', {}).get('status') == 'complete'"
                }
            },
            {
                "from_node": "editor",
                "to_node": "reviewer",
                "condition": {
                    "type": "expression",
                    "expression": "state.results.get('editor', {}).get('status') == 'complete'"
                }
            }
        ],
        "entry_points": ["writer"]
    },
    "input_schema": {
        "type": "object",
        "properties": {
            "content_brief": {
                "type": "string",
                "description": "Brief describing the content to create"
            },
            "target_audience": {
                "type": "string",
                "description": "Target audience for the content"
            },
            "content_type": {
                "type": "string",
                "enum": ["blog_post", "article", "social_media", "email"],
                "description": "Type of content to create"
            }
        },
        "required": ["content_brief", "target_audience", "content_type"]
    },
    "entry_point": "writer"  # Specify which node receives the initial input
}

# Use in agent configuration
content_manager_config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You manage content creation using specialized pipelines.",
        "tools": [content_pipeline_tool_config]
    }
}
```

## Simple Tool Configuration

### String-based Tool Loading

```python
# Simple tool references
tools_config = {
    "tools": [
        "calculator",
        "web_search",
        "file_reader"
    ]
}
```

### Module-based Tool Loading

```python
# Tools with module paths
tools_config = {
    "tools": [
        {"name": "custom_calculator", "module": "math_tools.calculator"},
        {"name": "advanced_search", "module": "search_tools.advanced"},
        {"name": "data_processor", "module": "data_tools.processor"}
    ]
}
```

### Mixed Tool Configuration

```python
tools_config = {
    "tools": [
        # Simple string reference
        "calculator",
        
        # Module-based tool
        {"name": "web_search", "module": "search_tools.web"},
        
        # Agent-as-tool
        {
            "name": "research_assistant",
            "description": "Specialized research agent",
            "agent": {
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "Research the topic: {topic}"
            },
            "input_schema": {
                "type": "object",
                "properties": {
                    "topic": {"type": "string", "description": "Research topic"}
                },
                "required": ["topic"]
            }
        },
        
        # Swarm-as-tool
        {
            "name": "analysis_team",
            "description": "Multi-agent analysis team",
            "swarm": {
                "max_handoffs": 10,
                "agents": [
                    {
                        "name": "data_analyst",
                        "model": "us.amazon.nova-lite-v1:0",
                        "system_prompt": "Analyze data patterns and trends."
                    },
                    {
                        "name": "report_writer",
                        "model": "us.amazon.nova-lite-v1:0",
                        "system_prompt": "Create analysis reports."
                    }
                ]
            },
            "input_schema": {
                "type": "object",
                "properties": {
                    "data": {"type": "string", "description": "Data to analyze"}
                },
                "required": ["data"]
            }
        }
    ]
}
```

## Tool Loading and Caching

### Using ToolConfigLoader Directly

```python
from strands.experimental.config_loader.tools import ToolConfigLoader

loader = ToolConfigLoader()

# Load individual tools
calculator_tool = loader.load_tool("calculator")
search_tool = loader.load_tool({"name": "web_search", "module": "search_tools.web"})

# Load agent-as-tool
research_tool = loader.load_tool({
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
})

# Load multiple tools
tools_list = loader.load_tools([
    "calculator",
    {"name": "custom_tool", "module": "my_tools.custom"},
    research_tool
])
```

### Caching

```python
# Tools are automatically cached by configuration
tool1 = loader.load_tool(config)
tool2 = loader.load_tool(config)  # Returns cached instance

```

## Error Handling

The ToolConfigLoader provides comprehensive error handling:

```python
try:
    tool = loader.load_tool(invalid_config)
except ValueError as e:
    print(f"Configuration error: {e}")
except ImportError as e:
    print(f"Missing tool module: {e}")
except Exception as e:
    print(f"Tool loading error: {e}")
```

Common error scenarios:
- **Missing tool modules**: Clear messages about missing dependencies
- **Invalid agent configurations**: Specific guidance for nested agent setup
- **Schema validation errors**: Validation of input schemas
- **Tool registration errors**: Issues with tool discovery and loading

## Advanced Examples

### Multi-Level Agent Hierarchy

```python
# Level 3: Specialized sub-agents
code_analyzer_config = {
    "name": "code_analyzer",
    "agent": {
        "model": "us.amazon.nova-lite-v1:0",
        "system_prompt": "Analyze code for: {analysis_type}"
    },
    "input_schema": {
        "type": "object",
        "properties": {
            "code": {"type": "string"},
            "analysis_type": {"type": "string", "enum": ["security", "performance", "style"]}
        },
        "required": ["code", "analysis_type"]
    }
}

# Level 2: Code reviewer using specialized analyzers
code_reviewer_config = {
    "name": "code_reviewer",
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "Review code comprehensively using available analysis tools.",
        "tools": [code_analyzer_config]
    },
    "input_schema": {
        "type": "object",
        "properties": {
            "code": {"type": "string"},
            "review_focus": {"type": "string", "default": "comprehensive"}
        },
        "required": ["code"]
    }
}

# Level 1: Senior developer using code reviewer
senior_dev_config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a senior developer who coordinates code reviews.",
        "tools": [code_reviewer_config]
    }
}
```

### Dynamic Tool Configuration

```python
def create_specialist_tool(domain, model_tier="lite"):
    """Factory function for creating domain specialist tools"""
    model_map = {
        "lite": "us.amazon.nova-lite-v1:0",
        "pro": "us.amazon.nova-pro-v1:0"
    }
    
    return {
        "name": f"{domain}_specialist",
        "description": f"Specialist agent for {domain} domain",
        "agent": {
            "model": model_map[model_tier],
            "system_prompt": f"You are a {domain} specialist. Help with: {{task}}",
            "tools": []
        },
        "input_schema": {
            "type": "object",
            "properties": {
                "task": {
                    "type": "string",
                    "description": f"Task requiring {domain} expertise"
                }
            },
            "required": ["task"]
        }
    }

# Create specialized tools
marketing_tool = create_specialist_tool("marketing", "pro")
finance_tool = create_specialist_tool("finance", "pro")
hr_tool = create_specialist_tool("human_resources", "lite")

# Use in agent configuration
business_advisor_config = {
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a business advisor with access to domain specialists.",
        "tools": [marketing_tool, finance_tool, hr_tool]
    }
}
```

### Conditional Tool Loading

```python
def create_adaptive_agent_config(user_tier="basic"):
    """Create agent config with tools based on user tier"""
    
    base_tools = [
        "calculator",
        {"name": "web_search", "module": "search_tools.basic"}
    ]
    
    if user_tier in ["premium", "enterprise"]:
        base_tools.append({
            "name": "advanced_analyst",
            "agent": {
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": "Provide advanced analysis for: {query}"
            },
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"}
                },
                "required": ["query"]
            }
        })
    
    if user_tier == "enterprise":
        base_tools.append({
            "name": "enterprise_research_team",
            "swarm": {
                "max_handoffs": 20,
                "agents": [
                    {
                        "name": "senior_researcher",
                        "model": "us.amazon.nova-pro-v1:0",
                        "system_prompt": "Lead comprehensive research projects."
                    },
                    {
                        "name": "data_scientist",
                        "model": "us.amazon.nova-pro-v1:0",
                        "system_prompt": "Perform advanced data analysis."
                    },
                    {
                        "name": "report_specialist",
                        "model": "us.amazon.nova-pro-v1:0",
                        "system_prompt": "Create executive-level reports."
                    }
                ]
            },
            "input_schema": {
                "type": "object",
                "properties": {
                    "research_brief": {"type": "string"}
                },
                "required": ["research_brief"]
            }
        })
    
    return {
        "agent": {
            "model": "us.amazon.nova-pro-v1:0",
            "system_prompt": f"You are a {user_tier} tier assistant with specialized capabilities.",
            "tools": base_tools
        }
    }

# Create different configurations based on user tier
basic_config = create_adaptive_agent_config("basic")
premium_config = create_adaptive_agent_config("premium")
enterprise_config = create_adaptive_agent_config("enterprise")
```

## Best Practices

1. **Use Schema Validation**: Enable IDE integration for better development experience
2. **Design Clear Tool Interfaces**: Define specific, well-documented input schemas
3. **Leverage Tool Hierarchy**: Use agents-as-tools for complex, specialized operations
4. **Cache Expensive Tools**: Use cache keys for frequently loaded tool configurations
5. **Test Tool Interactions**: Validate that tools work correctly within agent contexts
6. **Document Tool Capabilities**: Provide clear descriptions and usage examples

## Next Steps

- [Agent Configuration](agent-config.md) - Using tools within agent configurations
- [Swarm Configuration](swarm-config.md) - Tools for swarm agents
- [Graph Configuration](graph-config.md) - Tools for graph node agents
- [Structured Output](structured-output.md) - Structured output for tool agents
            }
        },
        "required": ["language", "code"]
    },
    "prompt": """Review the following {language} code for:
- Code quality and best practices
- Potential bugs or issues  
- Performance considerations
- Security concerns

Focus on {focus_area} aspects.

Code to review:
{code}"""
}
```

**Note**: The `prompt` field is specific to Agent-as-Tool configurations and provides a template that gets sent to the agent with parameter substitution. This is different from the agent's `system_prompt` which sets the agent's overall behavior.

### Complex Multi-Agent Tool Example

```python
data_analysis_pipeline = {
    "name": "data_analyzer",
    "description": "Complete data analysis pipeline",
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a data analysis coordinator.",
        "tools": [
            {
                "name": "statistical_analyzer",
                "agent": {
                    "model": "us.amazon.nova-lite-v1:0", 
                    "system_prompt": "You are a statistical analysis expert.",
                    "tools": []
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
                },
                "prompt": "Perform statistical analysis on: {data}"
            },
            {
                "name": "visualization_generator", 
                "agent": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "You are a data visualization expert.",
                    "tools": []
                },
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "data": {
                            "type": "string",
                            "description": "Data to visualize"
                        },
                        "chart_type": {
                            "type": "string",
                            "description": "Type of chart to generate",
                            "default": "bar chart"
                        }
                    },
                    "required": ["data"]
                },
                "prompt": "Generate {chart_type} visualization for: {data}"
            }
        ]
    },
    "input_schema": {
        "type": "object",
        "properties": {
            "dataset_description": {
                "type": "string",
                "description": "Description of the dataset to analyze"
            },
            "analysis_type": {
                "type": "string",
                "description": "Type of analysis (descriptive, predictive, diagnostic)",
                "default": "descriptive"
            },
            "output_format": {
                "type": "string",
                "description": "Desired output format (summary, detailed, presentation)",
                "default": "summary"
            }
        },
        "required": ["dataset_description"]
    },
    "prompt": """Analyze the dataset: {dataset_description}

Analysis type: {analysis_type}
Output format: {output_format}

Provide insights, patterns, and recommendations based on the data."""
}
```

## Swarm-as-Tool Configuration

Configure entire swarms as tools for complex multi-agent operations:

```python
# Swarm-as-tool configuration
research_swarm_tool = {
    "name": "research_team",
    "description": "Multi-agent research team for comprehensive analysis",
    "input_schema": {
        "type": "object",
        "properties": {
            "research_topic": {
                "type": "string",
                "description": "Topic to research"
            },
            "depth": {
                "type": "string",
                "description": "Research depth (surface, detailed, comprehensive)",
                "default": "detailed"
            },
            "focus_areas": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Specific areas to focus on",
                "default": []
            }
        },
        "required": ["research_topic"]
    },
    "prompt": "Research '{research_topic}' with {depth} analysis, focusing on: {focus_areas}",
    "entry_agent": "coordinator",  # Optional: specify which agent receives the initial prompt
    "swarm": {
        "max_handoffs": 15,
        "agents": [
            {
                "name": "coordinator",
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": "You coordinate research tasks between specialists.",
                "tools": []
            },
            {
                "name": "data_researcher",
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "You specialize in finding and analyzing data sources.",
                "tools": [{"name": "web_search"}]
            },
            {
                "name": "academic_researcher", 
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "You specialize in academic and scientific research.",
                "tools": [{"name": "academic_search"}]
            }
        ]
    }
}

# Load and use the swarm tool
loader = ToolConfigLoader()
research_swarm = loader.load_tool(research_swarm_tool)
```

## Graph-as-Tool Configuration

Configure workflow graphs as tools for complex multi-step processes:

```python
# Graph-as-tool configuration
analysis_workflow_tool = {
    "name": "data_analysis_workflow",
    "description": "Complete data analysis workflow with validation and reporting",
    "input_schema": {
        "type": "object",
        "properties": {
            "dataset_description": {
                "type": "string",
                "description": "Description of the dataset"
            },
            "analysis_goals": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Analysis objectives"
            },
            "output_format": {
                "type": "string",
                "description": "Report format (summary, detailed, presentation)",
                "default": "summary"
            }
        },
        "required": ["dataset_description"]
    },
    "prompt": "Analyze dataset: {dataset_description}. Goals: {analysis_goals}. Format: {output_format}",
    "entry_point": "data_validator",  # Optional: specify entry node
    "graph": {
        "nodes": [
            {
                "node_id": "data_validator",
                "type": "agent",
                "config": {
                    "name": "data_validator",
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "Validate data quality and structure.",
                    "tools": [{"name": "data_profiler"}]
                }
            },
            {
                "node_id": "statistical_analyzer",
                "type": "agent", 
                "config": {
                    "name": "statistical_analyzer",
                    "model": "us.amazon.nova-pro-v1:0",
                    "system_prompt": "Perform statistical analysis on validated data.",
                    "tools": [{"name": "statistics_calculator"}]
                }
            },
            {
                "node_id": "report_generator",
                "type": "agent",
                "config": {
                    "name": "report_generator",
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "Generate analysis reports.",
                    "tools": [{"name": "report_formatter"}]
                }
            }
        ],
        "edges": [
            {
                "from_node": "data_validator",
                "to_node": "statistical_analyzer",
                "condition": {
                    "type": "expression",
                    "expression": "state.results.get('data_validator', {}).get('status') == 'valid'"
                }
            },
            {
                "from_node": "statistical_analyzer", 
                "to_node": "report_generator",
                "condition": {
                    "type": "expression",
                    "expression": "state.results.get('statistical_analyzer', {}).get('status') == 'completed'"
                }
            }
        ],
        "entry_points": ["data_validator"]
    }
}

# Load and use the graph tool
loader = ToolConfigLoader()
analysis_workflow = loader.load_tool(analysis_workflow_tool)
```
```

## Traditional Tool Loading

### String Identifier Loading

```python
from strands.experimental.config_loader.tools import ToolConfigLoader

loader = ToolConfigLoader()

# Load by function name (searches common locations)
calculator = loader.load_tool("calculator")

# Load with module specification
web_search = loader.load_tool("web_search", "my_tools.search")

# Load by fully qualified name
custom_tool = loader.load_tool("my_package.tools.custom_analyzer")

# Load from strands_tools package
file_write = loader.load_tool("strands_tools.file_write")
```

### Module-Based Tool Loading

The loader supports tools that follow the module-based pattern used by packages like `strands_tools`:

```python
# These tools have a TOOL_SPEC dictionary and a function with the same name
# Example: strands_tools.calculator has both TOOL_SPEC and calculator() function

loader = ToolConfigLoader()

# Load module-based tools
calculator = loader.load_tool("calculator")  # Finds strands_tools.calculator
file_reader = loader.load_tool("file_read")  # Finds strands_tools.file_read

# The loader automatically wraps these in ModuleFunctionTool instances
```

### Batch Tool Loading

```python
# Load multiple tools at once
tool_specs = [
    "calculator",  # String identifier
    {"name": "web_search", "module": "my_tools.search"},  # Tool with module
    {
        # Agent-as-tool configuration
        "name": "research_agent",
        "agent": {
            "model": "us.amazon.nova-lite-v1:0",
            "system_prompt": "You are a research assistant.",
            "tools": []
        },
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Research query"
                }
            },
            "required": ["query"]
        },
        "prompt": "Research: {query}"
    }
]

tools = loader.load_tools(tool_specs)
```

## Input Schema Configuration Format

Agent-as-Tool configurations use JSONSchema format for defining input parameters:

### JSONSchema Format (Recommended)

```python
input_schema = {
    "type": "object",
    "properties": {
        "input_text": {
            "type": "string",
            "description": "Text to process"
        },
        "output_format": {
            "type": "string",
            "description": "Desired output format",
            "default": "json"
        },
        "max_length": {
            "type": "integer", 
            "description": "Maximum output length",
            "default": 1000
        }
    },
    "required": ["input_text"]
}
```

### Automatic Query Parameter

If no `prompt` field is provided and no `query` parameter exists in the input schema, the system automatically adds a default `query` parameter:

```python
# This configuration...
agent_tool_config = {
    "name": "simple_agent",
    "agent": {
        "model": "us.amazon.nova-lite-v1:0",
        "system_prompt": "You are a helpful assistant.",
        "tools": []
    },
    "input_schema": {
        "type": "object",
        "properties": {},
        "required": []
    }
}

# ...automatically becomes equivalent to:
agent_tool_config = {
    "name": "simple_agent",
    "agent": {
        "model": "us.amazon.nova-lite-v1:0",
        "system_prompt": "You are a helpful assistant.",
        "tools": []
    },
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The query or input to send to the agent"
            }
        },
        "required": ["query"]
    }
}
```

### Parameter Defaults and Substitution

Default values from the input schema are used for template substitution:

```python
config = {
    "name": "formatter",
    "agent": {
        "model": "us.amazon.nova-lite-v1:0",
        "system_prompt": "You are a text formatter.",
        "tools": []
    },
    "input_schema": {
        "type": "object",
        "properties": {
            "text": {
                "type": "string",
                "description": "Text to format"
            },
            "style": {
                "type": "string",
                "description": "Formatting style",
                "default": "professional"
            }
        },
        "required": ["text"]
    },
    "prompt": "Format this text in {style} style: {text}"
}

# When called with {"text": "Hello world"}, the prompt becomes:
# "Format this text in professional style: Hello world"
```

## Tool Resolution Strategies

The `ToolConfigLoader` uses multiple strategies to find tools:

1. **Registry lookup**: Check already loaded tools in the registry
2. **Module path loading**: Load from specified module paths
3. **Fully qualified names**: Resolve `module.tool_name` patterns (e.g., `strands_tools.calculator`)
4. **Directory scanning**: Search in `./tools/` and current directory
5. **Module-based tools**: Support for TOOL_SPEC pattern (like `strands_tools`)
6. **Agent configuration**: Load agent-as-tool from configuration

### Tool Discovery Example

```python
from strands.experimental.config_loader.tools import ToolConfigLoader

loader = ToolConfigLoader()

# Get available tools from registry
available_tools = 
# Scan specific module for tools
module_tools = loader.get_available_tools("./my_tools/analysis.py")

```

### Module-Based Tool Support

The loader automatically detects and wraps module-based tools that follow the pattern:
- A function with the tool name (e.g., `calculator`)
- A `TOOL_SPEC` dictionary defining the tool specification
- Function signature: `(tool: ToolUse, **kwargs) -> ToolResult`

```python
# Example module-based tool (like in strands_tools)
# my_tools/calculator.py

TOOL_SPEC = {
    "name": "calculator",
    "description": "Performs mathematical calculations",
    "inputSchema": {
        "type": "object",
        "properties": {
            "expression": {
                "type": "string",
                "description": "Mathematical expression to evaluate"
            }
        },
        "required": ["expression"]
    }
}

def calculator(tool, **kwargs):
    """Calculate mathematical expressions."""
    expression = tool.get("input", {}).get("expression", "")
    try:
        result = eval(expression)  # Note: Use safe evaluation in production
        return {
            "status": "success",
            "content": [{"text": str(result)}]
        }
    except Exception as e:
        return {
            "status": "error", 
            "content": [{"text": f"Error: {str(e)}"}]
        }

# The loader automatically wraps this in ModuleFunctionTool
```

## Integration with Agent Configuration

Agent-as-Tool configurations work seamlessly with the Agent Configuration Loader:

```python
from strands.experimental.config_loader.agent import AgentConfigLoader

# Agent configuration with mixed tool types
agent_config = {
    "model": "us.amazon.nova-pro-v1:0",
    "system_prompt": "You are a multi-modal assistant with specialized tools.",
    "tools": [
        # Traditional tool
        {"name": "calculator"},
        
        # Module-based tool
        {"name": "file_write", "module": "strands_tools"},
        
        # Agent-as-tool
        {
            "name": "text_analyzer",
            "agent": {
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "You are a text analysis expert.",
                "tools": []
            },
            "input_schema": {
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string",
                        "description": "Text to analyze"
                    },
                    "analysis_type": {
                        "type": "string",
                        "description": "Type of analysis (sentiment, readability, complexity)",
                        "default": "sentiment"
                    }
                },
                "required": ["text"]
            },
            "prompt": "Analyze the text '{text}' for {analysis_type} characteristics."
        },
        
        # Complex agent-as-tool with sub-tools
        {
            "name": "code_generator",
            "agent": {
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": "You are a code generation expert.",
                "tools": [{"name": "syntax_validator"}]
            },
            "input_schema": {
                "type": "object",
                "properties": {
                    "language": {
                        "type": "string",
                        "description": "Programming language"
                    },
                    "task_description": {
                        "type": "string",
                        "description": "Description of what the code should do"
                    },
                    "constraints": {
                        "type": "string",
                        "description": "Additional constraints or requirements",
                        "default": "None"
                    }
                },
                "required": ["language", "task_description"]
            },
            "prompt": """Generate {language} code that {task_description}.

Requirements:
- Follow best practices
- Include comments
- Handle edge cases

Additional constraints: {constraints}"""
        }
    ]
}

# Load the agent
loader = AgentConfigLoader()
agent = loader.load_agent(agent_config)
```

## Error Handling and Debugging

```python
from strands.experimental.config_loader.tools import ToolConfigLoader

loader = ToolConfigLoader()

try:
    # Tool not found
    tool = loader.load_tool("nonexistent_tool")
except ValueError as e:
    print(f"Tool loading failed: {e}")

try:
    # Invalid agent-as-tool configuration
    agent_tool = loader.load_tool({
        "name": "invalid_agent",
        "agent": {}  # Missing required configuration
    })
except ValueError as e:
    print(f"Agent tool configuration error: {e}")

try:
    # Invalid input schema
    agent_tool = loader.load_tool({
        "name": "bad_schema",
        "agent": {"model": "us.amazon.nova-lite-v1:0", "system_prompt": "Test"},
        "input_schema": {"type": "array"}  # Must be "object"
    })
except ValueError as e:
    print(f"Input schema error: {e}")
```

Common errors:
- Tool not found in any resolution strategy
- Missing required fields in agent-as-tool configurations
- Invalid input schema format (must be JSONSchema with type "object")
- Circular dependencies in agent tool hierarchies
- Module import failures

## Performance Considerations

### Caching

The `ToolConfigLoader` automatically caches loaded tools and modules:

```python
loader = ToolConfigLoader()

# First load - reads from disk/imports module
tool1 = loader.load_tool("my_tool")

# Second load - returns cached instance
tool2 = loader.load_tool("my_tool")  # Fast!

# Agent tools are cached based on configuration hash
agent_tool1 = loader.load_tool(agent_config)
agent_tool2 = loader.load_tool(agent_config)  # Returns cached instance

```

### Agent-as-Tool Performance

- Agent-as-Tool instances are cached based on configuration hash
- Template substitution is performed at runtime for flexibility
- Consider using lighter models (e.g., `nova-lite`) for simple agent tools
- Complex agent tools with many sub-tools may have higher latency

## Best Practices

### 1. Design Focused Agent Tools

```python
# Good: Focused, single-purpose agent tool
email_composer = {
    "name": "email_composer",
    "description": "Composes professional emails",
    "agent": {
        "model": "us.amazon.nova-lite-v1:0",
        "system_prompt": "You are a professional email writing assistant.",
        "tools": []
    },
    "input_schema": {
        "type": "object",
        "properties": {
            "subject": {
                "type": "string",
                "description": "Email subject"
            },
            "tone": {
                "type": "string",
                "description": "Email tone",
                "default": "professional"
            },
            "recipient_type": {
                "type": "string",
                "description": "Type of recipient",
                "default": "colleague"
            }
        },
        "required": ["subject"]
    },
    "prompt": "Compose a {tone} email about {subject} to {recipient_type}."
}
```

### 2. Use Appropriate Model Sizes

```python
# Use lighter models for simple tasks
simple_formatter = {
    "name": "text_formatter", 
    "agent": {
        "model": "us.amazon.nova-lite-v1:0",  # Faster, cheaper
        "system_prompt": "You are a text formatting assistant.",
        "tools": []
    },
    "input_schema": {
        "type": "object",
        "properties": {
            "text": {"type": "string", "description": "Text to format"},
            "format_type": {"type": "string", "description": "Format type"}
        },
        "required": ["text", "format_type"]
    },
    "prompt": "Format the text: {text} as {format_type}"
}

# Use more capable models for complex reasoning
complex_analyzer = {
    "name": "business_analyzer",
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",  # More capable
        "system_prompt": "You are a business analysis expert.",
        "tools": [{"name": "financial_calculator"}, {"name": "market_research"}]
    },
    "input_schema": {
        "type": "object",
        "properties": {
            "scenario": {"type": "string", "description": "Business scenario to analyze"}
        },
        "required": ["scenario"]
    },
    "prompt": "Analyze business scenario: {scenario}"
}
```

### 3. Template Design Patterns

```python
# Pattern: Context + Task + Output specification
analysis_template = """Context: {context}

Task: Analyze the {data_type} data for {analysis_goal}.

Output Requirements:
- Format: {output_format}
- Detail Level: {detail_level}
- Include: {include_sections}

Data: {data}"""

analysis_tool = {
    "name": "data_analyzer",
    "agent": {
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a data analysis expert.",
        "tools": []
    },
    "input_schema": {
        "type": "object",
        "properties": {
            "context": {"type": "string", "description": "Analysis context"},
            "data_type": {"type": "string", "description": "Type of data"},
            "analysis_goal": {"type": "string", "description": "Analysis objective"},
            "output_format": {"type": "string", "default": "structured"},
            "detail_level": {"type": "string", "default": "detailed"},
            "include_sections": {"type": "string", "default": "summary, insights, recommendations"},
            "data": {"type": "string", "description": "The data to analyze"}
        },
        "required": ["context", "data_type", "analysis_goal", "data"]
    },
    "prompt": analysis_template
}
```

### 4. Hierarchical Tool Organization

```python
# Main coordinator agent
coordinator_tools = [
    {
        "name": "data_processor",
        "agent": {
            "model": "us.amazon.nova-lite-v1:0",
            "system_prompt": "You coordinate data processing tasks.",
            "tools": [
                {"name": "validator"},
                {"name": "transformer"},
                {"name": "enricher"}
            ]
        },
        "input_schema": {
            "type": "object",
            "properties": {
                "data": {"type": "string", "description": "Data to process"}
            },
            "required": ["data"]
        },
        "prompt": "Process this data: {data}"
    },
    {
        "name": "report_generator", 
        "agent": {
            "model": "us.amazon.nova-pro-v1:0",
            "system_prompt": "You generate comprehensive reports.",
            "tools": [{"name": "formatter"}, {"name": "chart_generator"}]
        },
        "input_schema": {
            "type": "object",
            "properties": {
                "processed_data": {"type": "string", "description": "Processed data for reporting"}
            },
            "required": ["processed_data"]
        },
        "prompt": "Generate report from: {processed_data}"
    }
]

# Each level handles appropriate complexity and specialization
```

### 5. Tool Configuration Management

```python
from strands.experimental.config_loader.tools import ToolConfigLoader

class ToolConfigManager:
    """Manages tool configurations and loading."""
    
    def __init__(self):
        self.loader = ToolConfigLoader()
        self.tool_configs = {}
    
    def register_tool_config(self, name: str, config: dict):
        """Register a reusable tool configuration."""
        self.tool_configs[name] = config
    
    def get_tool(self, name: str):
        """Get a tool by name."""
        if name in self.tool_configs:
            return self.loader.load_tool(self.tool_configs[name])
        return self.loader.load_tool(name)
    
    def create_agent_tool(self, name: str, model: str, prompt: str, input_schema: dict):
        """Helper to create simple agent tools."""
        config = {
            "name": name,
            "agent": {
                "model": model,
                "system_prompt": "You are a helpful assistant.",
                "tools": []
            },
            "input_schema": input_schema,
            "prompt": prompt
        }
        return self.loader.load_tool(config)

# Usage
manager = ToolConfigManager()

# Register common configurations
manager.register_tool_config("email_writer", email_composer)
manager.register_tool_config("code_reviewer", code_reviewer_config)

# Use registered tools
email_tool = manager.get_tool("email_writer")
review_tool = manager.get_tool("code_reviewer")
```

This hierarchical and modular approach enables building sophisticated multi-agent systems where each level handles appropriate complexity and specialization, while maintaining clean separation of concerns and reusability.
