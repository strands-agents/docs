# SwarmConfigLoader

The SwarmConfigLoader enables serialization and deserialization of Strands `Swarm` instances to/from dictionary configurations, supporting persistence and dynamic loading scenarios. This implementation leverages the existing `AgentConfigLoader` for agent serialization and adds swarm-specific configuration management.

**Note**: This is an experimental feature that provides programmatic swarm configuration loading through dictionaries. For file-based configuration, use the main Swarm constructor's `config` parameter.

## Overview

The SwarmConfigLoader provides functionality to:
- Load swarms from dictionary configurations
- Serialize existing swarms to dictionary configurations
- Cache swarms for performance optimization
- Integrate seamlessly with AgentConfigLoader for agent management
- Support both programmatic and configuration-based swarm creation

## Quick Start

### Using SwarmConfigLoader

```python
from strands.experimental.config_loader.swarm import SwarmConfigLoader

# Define swarm configuration
config = {
    "swarm": {
        "max_handoffs": 20,
        "agents": [
            {
                "name": "research_agent",
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "You are a research agent.",
                "tools": []
            },
            {
                "name": "creative_agent",
                "model": "us.amazon.nova-lite-v1:0", 
                "system_prompt": "You are a creative agent.",
                "tools": []
            }
        ]
    }
}

loader = SwarmConfigLoader()
swarm = loader.load_swarm(config)

# Execute the swarm
result = swarm("Create a blog post explaining Agentic AI")
```

### File-Based Configuration (Use Main Constructors)

For loading from YAML/JSON files, use the main constructors instead:

```python
from strands.multiagent import Swarm

# Load from YAML file path (not SwarmConfigLoader)
swarm = Swarm(config='swarm_config.yml')

# Load from dictionary configuration (not SwarmConfigLoader)
config = {
    "max_handoffs": 20,
    "agents": [
        {
            "name": "research_agent",
            "model": "us.amazon.nova-lite-v1:0",
            "system_prompt": "You are a research agent.",
            "tools": []
        }
    ]
}
swarm = Swarm(config=config)

# Override config values with individual parameters
swarm = Swarm(
    config='swarm_config.yml',
    max_handoffs=15,  # Override config value
    execution_timeout=1200.0  # Override config value
)
```

### Traditional Constructor

```python
from strands import Agent
from strands.multiagent import Swarm

agents = [Agent(name="agent1", model="us.amazon.nova-lite-v1:0")]
swarm = Swarm(nodes=agents)
```

## Schema Validation

The ConfigLoader includes comprehensive schema validation for swarms:

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

### Basic Structure

```python
config = {
    "swarm": {
        # Core swarm parameters (matching Swarm constructor)
        "max_handoffs": 20,                    # Maximum handoffs to agents and users
        "max_iterations": 20,                  # Maximum node executions within the swarm
        "execution_timeout": 900.0,            # Total execution timeout in seconds (15 minutes)
        "node_timeout": 300.0,                 # Individual node timeout in seconds (5 minutes)
        "repetitive_handoff_detection_window": 8,  # Number of recent nodes to check for repetitive handoffs
        "repetitive_handoff_min_unique_agents": 3, # Minimum unique agents required in recent sequence
        
        # Specialized agents for collaboration
        "agents": [
            {
                "name": "research_agent",
                "description": "Research Agent specializing in gathering and analyzing information",
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "You are a Research Agent specializing in gathering and analyzing information.",
                "tools": []
            },
            {
                "name": "creative_agent", 
                "description": "Creative Agent specializing in generating innovative solutions",
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "You are a Creative Agent specializing in generating innovative solutions.",
                "tools": []
            }
        ]
    }
}
```

### Complete Swarm Configuration

```python
config = {
    "swarm": {
        # Swarm execution parameters
        "max_handoffs": 25,
        "max_iterations": 30,
        "execution_timeout": 1200.0,  # 20 minutes
        "node_timeout": 180.0,        # 3 minutes per agent
        "repetitive_handoff_detection_window": 10,
        "repetitive_handoff_min_unique_agents": 4,
        
        # Specialized agents for blog writing collaboration
        "agents": [
            {
                "name": "research_agent",
                "description": "Research Agent specializing in gathering and analyzing information",
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": """You are a Research Agent specializing in gathering and analyzing information.
Your role in the swarm is to provide factual information and research insights on the topic.
You should focus on providing accurate data and identifying key aspects of the problem.
When receiving input from other agents, evaluate if their information aligns with your research.

When you need help from other specialists or have completed your research, use the available tools to coordinate with other agents.""",
                "tools": [
                    {"name": "web_search", "module": "research_tools.search"},
                    {"name": "fact_checker", "module": "research_tools.verify"}
                ],
                "handoff_conditions": [
                    {
                        "condition": "research_complete",
                        "target_agent": "creative_agent"
                    }
                ]
            },
            {
                "name": "creative_agent", 
                "description": "Creative Agent specializing in generating innovative solutions",
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": """You are a Creative Agent specializing in generating innovative solutions.
Your role in the swarm is to think outside the box and propose creative approaches.
You should build upon information from other agents while adding your unique creative perspective.
Focus on novel approaches that others might not have considered.""",
                "tools": [
                    {"name": "brainstorm_generator", "module": "creative_tools.brainstorm"},
                    {"name": "analogy_finder", "module": "creative_tools.analogies"}
                ],
                "handoff_conditions": [
                    {
                        "condition": "creative_ideas_generated",
                        "target_agent": "critical_agent"
                    }
                ]
            },
            {
                "name": "critical_agent",
                "description": "Critical Agent specializing in analyzing proposals and finding flaws",
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": """You are a Critical Agent specializing in analyzing proposals and finding flaws.
Your role in the swarm is to evaluate solutions proposed by other agents and identify potential issues.
You should carefully examine proposed solutions, find weaknesses or oversights, and suggest improvements.""",
                "tools": [
                    {"name": "logic_checker", "module": "analysis_tools.logic"},
                    {"name": "risk_assessor", "module": "analysis_tools.risk"}
                ],
                "handoff_conditions": [
                    {
                        "condition": "analysis_complete",
                        "target_agent": "synthesis_agent"
                    }
                ]
            },
            {
                "name": "synthesis_agent",
                "description": "Synthesis Agent specializing in combining insights from all agents",
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": """You are a Synthesis Agent specializing in combining insights from all agents.
Your role is to take the research, creative ideas, and critical analysis from other agents and synthesize them into a coherent final output.
You should balance all perspectives and create a comprehensive solution.""",
                "tools": [
                    {"name": "content_synthesizer", "module": "synthesis_tools.combine"},
                    {"name": "quality_checker", "module": "synthesis_tools.quality"}
                ]
            }
        ]
    }
}
```

## Agent Configuration

### Basic Agent in Swarm

```python
{
    "name": "specialist_agent",
    "description": "A specialized agent within the swarm",
    "model": "us.amazon.nova-lite-v1:0",
    "system_prompt": "You are a specialist in your domain.",
    "tools": [
        {"name": "domain_tool", "module": "specialist_tools.domain"}
    ]
}
```

### Agent with Handoff Conditions

```python
{
    "name": "coordinator_agent",
    "description": "Coordinates work and hands off to specialists",
    "model": "us.amazon.nova-pro-v1:0",
    "system_prompt": "You coordinate work and delegate to appropriate specialists.",
    "tools": [
        {"name": "task_analyzer", "module": "coordination_tools.analyze"}
    ],
    "handoff_conditions": [
        {
            "condition": "technical_task_identified",
            "target_agent": "technical_specialist"
        },
        {
            "condition": "creative_task_identified", 
            "target_agent": "creative_specialist"
        }
    ]
}
```

### Agent with Full Configuration

```python
{
    "name": "advanced_agent",
    "description": "An agent with full configuration options",
    "model": {
        "type": "bedrock",
        "model_id": "us.amazon.nova-pro-v1:0",
        "temperature": 0.7,
        "max_tokens": 4096
    },
    "system_prompt": "You are an advanced agent with sophisticated capabilities.",
    "tools": [
        {"name": "advanced_analyzer", "module": "advanced_tools.analyzer"},
        {
            "name": "sub_agent",
            "agent": {
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "You are a sub-agent helping with specific tasks."
            },
            "input_schema": {
                "type": "object",
                "properties": {
                    "task": {"type": "string", "description": "Task to perform"}
                },
                "required": ["task"]
            }
        }
    ],
    "conversation_manager": {
        "type": "sliding_window",
        "window_size": 25
    },
    "state": {
        "expertise_level": "advanced",
        "specialization": "multi_domain"
    },
    "handoff_conditions": [
        {
            "condition": "task_complete",
            "target_agent": "reviewer_agent"
        }
    ]
}
```

## Swarm Execution Parameters

### Timeout and Iteration Control

```python
config = {
    "swarm": {
        "max_handoffs": 30,           # Maximum handoffs between agents
        "max_iterations": 25,         # Maximum total iterations
        "execution_timeout": 1800.0,  # 30 minutes total timeout
        "node_timeout": 240.0,        # 4 minutes per agent execution
        # ... agents configuration
    }
}
```

### Repetitive Handoff Detection

```python
config = {
    "swarm": {
        "repetitive_handoff_detection_window": 8,  # Look at last 8 handoffs
        "repetitive_handoff_min_unique_agents": 3, # Need at least 3 unique agents
        # ... rest of configuration
    }
}
```

### Using Cache Keys

```python
loader = SwarmConfigLoader()

# Load with cache key
swarm1 = loader.load_swarm(config)
swarm2 = loader.load_swarm(config)  # Returns cached instance

```

### Serialization

```python
# Load from config
swarm = loader.load_swarm(config)

# Serialize back to config
serialized_config = loader.serialize_swarm(swarm)
```

## Error Handling

The SwarmConfigLoader provides comprehensive error handling:

```python
try:
    swarm = loader.load_swarm(invalid_config)
except ValueError as e:
    print(f"Configuration error: {e}")
except ImportError as e:
    print(f"Missing dependency: {e}")
```

Common error scenarios:
- **Missing required fields**: Clear messages about required swarm components
- **Invalid agent configurations**: Specific guidance for agent setup
- **Tool loading errors**: Helpful messages for missing or invalid tools
- **Handoff condition errors**: Validation of handoff target agents

## Advanced Examples

### Research and Analysis Swarm

```python
config = {
    "swarm": {
        "max_handoffs": 20,
        "execution_timeout": 900.0,
        "agents": [
            {
                "name": "data_collector",
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "Collect and organize relevant data for analysis.",
                "tools": [
                    {"name": "web_scraper", "module": "data_tools.scraper"},
                    {"name": "database_query", "module": "data_tools.db"}
                ],
                "handoff_conditions": [
                    {
                        "condition": "data_collection_complete",
                        "target_agent": "data_analyst"
                    }
                ]
            },
            {
                "name": "data_analyst",
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": "Analyze collected data and identify patterns and insights.",
                "tools": [
                    {"name": "statistical_analyzer", "module": "analysis_tools.stats"},
                    {"name": "pattern_detector", "module": "analysis_tools.patterns"}
                ],
                "handoff_conditions": [
                    {
                        "condition": "analysis_complete",
                        "target_agent": "report_writer"
                    }
                ]
            },
            {
                "name": "report_writer",
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": "Create comprehensive reports based on data analysis.",
                "tools": [
                    {"name": "report_generator", "module": "reporting_tools.generator"},
                    {"name": "chart_creator", "module": "reporting_tools.charts"}
                ]
            }
        ]
    }
}
```

### Customer Service Swarm

```python
config = {
    "swarm": {
        "max_handoffs": 15,
        "node_timeout": 120.0,
        "agents": [
            {
                "name": "intake_specialist",
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "Handle initial customer inquiries and route to appropriate specialists.",
                "tools": [
                    {"name": "customer_lookup", "module": "customer_tools.lookup"},
                    {"name": "issue_classifier", "module": "customer_tools.classify"}
                ],
                "handoff_conditions": [
                    {
                        "condition": "technical_issue_identified",
                        "target_agent": "technical_support"
                    },
                    {
                        "condition": "billing_issue_identified",
                        "target_agent": "billing_specialist"
                    },
                    {
                        "condition": "general_inquiry",
                        "target_agent": "general_support"
                    }
                ]
            },
            {
                "name": "technical_support",
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": "Provide technical support and troubleshooting assistance.",
                "tools": [
                    {"name": "diagnostic_tool", "module": "tech_tools.diagnostics"},
                    {"name": "solution_database", "module": "tech_tools.solutions"}
                ],
                "handoff_conditions": [
                    {
                        "condition": "escalation_needed",
                        "target_agent": "senior_technical"
                    }
                ]
            },
            {
                "name": "billing_specialist",
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "Handle billing inquiries and account management.",
                "tools": [
                    {"name": "billing_system", "module": "billing_tools.system"},
                    {"name": "payment_processor", "module": "billing_tools.payments"}
                ]
            },
            {
                "name": "general_support",
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "Provide general customer support and information.",
                "tools": [
                    {"name": "knowledge_base", "module": "support_tools.kb"},
                    {"name": "faq_search", "module": "support_tools.faq"}
                ]
            },
            {
                "name": "senior_technical",
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": "Handle complex technical issues requiring senior expertise.",
                "tools": [
                    {"name": "advanced_diagnostics", "module": "senior_tools.diagnostics"},
                    {"name": "escalation_manager", "module": "senior_tools.escalation"}
                ]
            }
        ]
    }
}
```

### Content Creation Swarm

```python
config = {
    "swarm": {
        "max_handoffs": 25,
        "execution_timeout": 1200.0,
        "repetitive_handoff_detection_window": 6,
        "agents": [
            {
                "name": "content_strategist",
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": "Develop content strategy and outline key messaging.",
                "tools": [
                    {"name": "audience_analyzer", "module": "strategy_tools.audience"},
                    {"name": "competitor_research", "module": "strategy_tools.competitors"}
                ],
                "handoff_conditions": [
                    {
                        "condition": "strategy_complete",
                        "target_agent": "content_writer"
                    }
                ]
            },
            {
                "name": "content_writer",
                "model": "us.amazon.nova-pro-v1:0",
                "system_prompt": "Create engaging content based on strategic direction.",
                "tools": [
                    {"name": "writing_assistant", "module": "writing_tools.assistant"},
                    {"name": "style_checker", "module": "writing_tools.style"}
                ],
                "handoff_conditions": [
                    {
                        "condition": "draft_complete",
                        "target_agent": "content_editor"
                    }
                ]
            },
            {
                "name": "content_editor",
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "Edit and refine content for clarity and impact.",
                "tools": [
                    {"name": "grammar_checker", "module": "editing_tools.grammar"},
                    {"name": "readability_analyzer", "module": "editing_tools.readability"}
                ],
                "handoff_conditions": [
                    {
                        "condition": "needs_revision",
                        "target_agent": "content_writer"
                    },
                    {
                        "condition": "ready_for_seo",
                        "target_agent": "seo_specialist"
                    }
                ]
            },
            {
                "name": "seo_specialist",
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "Optimize content for search engines and discoverability.",
                "tools": [
                    {"name": "keyword_optimizer", "module": "seo_tools.keywords"},
                    {"name": "meta_generator", "module": "seo_tools.meta"}
                ]
            }
        ]
    }
}
```

## Best Practices

1. **Use Schema Validation**: Enable IDE integration for better development experience
2. **Design Clear Agent Roles**: Define specific, non-overlapping responsibilities for each agent
3. **Structure Handoff Conditions**: Create clear, testable conditions for agent transitions
4. **Manage Swarm Size**: Keep swarms focused with 3-7 agents for optimal coordination
5. **Test Handoff Flows**: Validate that handoff conditions work as expected
6. **Monitor Performance**: Use appropriate timeouts and iteration limits

## Next Steps

- [Agent Configuration](agent-config.md) - Detailed agent configuration for swarm members
- [Tool Configuration](tool-config.md) - Tool configuration for swarm agents
- [Graph Configuration](graph-config.md) - Using swarms within graph workflows
- [Structured Output](structured-output.md) - Structured output for swarm agents
  repetitive_handoff_min_unique_agents: 3 # Minimum unique agents required in recent sequence
  
  # Agents configuration (list of specialized agent configurations)
  agents:
    - name: "research_agent"
      description: "Research Agent specializing in gathering and analyzing information"
      model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
      system_prompt: |
        You are a Research Agent specializing in gathering and analyzing information.
        Your role in the swarm is to provide factual information and research insights on the topic.
        You should focus on providing accurate data and identifying key aspects of the problem.
        When receiving input from other agents, evaluate if their information aligns with your research.
      tools: []
      
    - name: "creative_agent" 
      description: "Creative Agent specializing in generating innovative solutions"
      model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
      system_prompt: |
        You are a Creative Agent specializing in generating innovative solutions.
        Your role in the swarm is to think outside the box and propose creative approaches.
        You should build upon information from other agents while adding your unique creative perspective.
        Focus on novel approaches that others might not have considered.
      tools: []
```

### Agent Configuration

Each agent in the `agents` list follows the same configuration format as the `AgentConfigLoader`:

```yaml
- name: "agent_name"                    # Required: Unique agent name
  description: "Agent description"      # Optional: Agent description
  model: "model_id"                     # Required: Model identifier
  system_prompt: "System prompt"       # Optional: Agent system prompt
  tools: []                            # Optional: List of tools
  messages: []                         # Optional: Initial messages
  agent_id: "custom_id"                # Optional: Custom agent ID
  # ... other AgentConfigLoader supported fields
```

### Advanced Options

```yaml
swarm:
  # Performance tuning
  max_handoffs: 30
  max_iterations: 25
  execution_timeout: 1200.0  # 20 minutes
  node_timeout: 400.0        # 6.67 minutes per agent
  
  # Repetitive handoff detection (prevents ping-pong behavior)
  repetitive_handoff_detection_window: 10
  repetitive_handoff_min_unique_agents: 4
  
  # Complex agents with tools
  agents:
    - name: "research_agent"
      model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
      system_prompt: "Research specialist with web search capabilities"
      tools:
        - name: "web_search"
        - name: "file_reader"
      conversation_manager:
        type: "sliding_window"
        window_size: 30
```

## API Reference

### SwarmConfigLoader Class

```python
class SwarmConfigLoader:
    def __init__(self, agent_config_loader: Optional[AgentConfigLoader] = None)
    def load_swarm(self, config: Dict[str, Any], cache_key: Optional[str] = None) -> Swarm
    def serialize_swarm(self, swarm: Swarm) -> Dict[str, Any]
    def clear_cache(self) -> None
    def get_available_swarms(self) -> List[str]
```

#### Methods

**`load_swarm(config)`**
- Load a Swarm from YAML configuration (loaded as dictionary)
- `config`: Dictionary containing swarm configuration
- `cache_key`: Optional key for caching the loaded swarm
- Returns: Swarm instance configured according to the provided dictionary
- Raises: `ValueError` if configuration is invalid, `ImportError` if models/tools cannot be imported

**`serialize_swarm(swarm)`**
- Serialize a Swarm instance to YAML-compatible dictionary configuration
- `swarm`: Swarm instance to serialize
- Returns: Dictionary containing the swarm's configuration that can be saved as YAML
- Note: Only includes non-default values to keep configuration clean

**`clear_cache()`**
- Clear the internal swarm cache
- Useful for memory management in long-running applications

**`get_available_swarms()`**
- Get list of cached swarm keys
- Returns: List of cached swarm keys

### Swarm Constructor Enhancement

The `Swarm` constructor now accepts an optional `config` parameter:

```python
def __init__(
    self,
    nodes: Optional[list[Agent]] = None,
    *,
    max_handoffs: int = 20,
    max_iterations: int = 20,
    execution_timeout: float = 900.0,
    node_timeout: float = 300.0,
    repetitive_handoff_detection_window: int = 0,
    repetitive_handoff_min_unique_agents: int = 0,
    config: Optional[Union[str, Path, Dict[str, Any]]] = None,
) -> None
```

The `config` parameter can be:
- **String**: Path to a YAML (.yaml, .yml) or JSON (.json) configuration file
- **Path**: Path object to a YAML (.yaml, .yml) or JSON (.json) configuration file  
- **Dict**: Configuration dictionary with swarm parameters

## Examples

### Loading from YAML File

```python
from strands.multiagent import Swarm

# Create swarm_config.yml
config_content = """
swarm:
  max_handoffs: 20
  max_iterations: 20
  execution_timeout: 900.0
  node_timeout: 300.0
  repetitive_handoff_detection_window: 8
  repetitive_handoff_min_unique_agents: 3
  
  agents:
    - name: "research_agent"
      description: "Research specialist"
      model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
      system_prompt: |
        You are a Research Agent specializing in gathering and analyzing information.
        Your role in the swarm is to provide factual information and research insights.
      tools: []
      
    - name: "creative_agent"
      description: "Creative specialist"
      model: "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
      system_prompt: |
        You are a Creative Agent specializing in generating innovative solutions.
        Your role in the swarm is to think outside the box and propose creative approaches.
      tools: []
"""

# Load and execute
swarm = Swarm(config='swarm_config.yml')
result = swarm("Create a blog post explaining Agentic AI then create a summary for a social media post.")

# Access results
print(f"Status: {result.status}")
for node in result.node_history:
    print(f"Agent: {node.node_id}")
print(f"Total iterations: {result.execution_count}")
print(f"Execution time: {result.execution_time}ms")
```

### Serializing Existing Swarms

```python
from strands import Agent
from strands.multiagent import Swarm
from strands.experimental.config_loader.swarm import SwarmConfigLoader
import yaml

# Create swarm programmatically
research_agent = Agent(
    system_prompt="You are a research agent.",
    name="research_agent",
    model="us.anthropic.claude-3-7-sonnet-20250219-v1:0"
)

creative_agent = Agent(
    system_prompt="You are a creative agent.",
    name="creative_agent", 
    model="us.anthropic.claude-3-7-sonnet-20250219-v1:0"
)

swarm = Swarm(
    [research_agent, creative_agent],
    max_handoffs=20,
    max_iterations=20,
    execution_timeout=900.0,
    node_timeout=300.0,
    repetitive_handoff_detection_window=8,
    repetitive_handoff_min_unique_agents=3
)

# Serialize swarm configuration
loader = SwarmConfigLoader()
swarm_config = loader.serialize_swarm(swarm)

# Save to YAML file
with open('saved_swarm.yml', 'w') as f:
    yaml.dump({'swarm': swarm_config}, f)

# Load saved swarm
with open('saved_swarm.yml', 'r') as f:
    config = yaml.safe_load(f)
restored_swarm = Swarm(config=config['swarm'])
```

### Integration with Persistence

```python
import yaml
from strands.experimental.config_loader.swarm import SwarmConfigLoader

class SwarmManager:
    def __init__(self):
        self.loader = SwarmConfigLoader()
    
    def save_swarm(self, swarm, filename):
        """Save swarm to YAML file."""
        config = self.loader.serialize_swarm(swarm)
        with open(filename, 'w') as f:
            yaml.dump({'swarm': config}, f)
    
    def load_swarm(self, filename):
        """Load swarm from YAML file."""
        with open(filename, 'r') as f:
            config = yaml.safe_load(f)
        return self.loader.load_swarm(config['swarm'])
    
    def clone_swarm(self, swarm):
        """Create a copy of a swarm via serialization."""
        config = self.loader.serialize_swarm(swarm)
        return self.loader.load_swarm(config)

# Usage
manager = SwarmManager()
swarm = manager.load_swarm('my_swarm.yml')
result = swarm("Process this task")
manager.save_swarm(swarm, 'updated_swarm.yml')
```

## Best Practices

1. **Use Descriptive Agent Names**: Agent names should reflect their specialty and role in the swarm
2. **Set Appropriate Timeouts**: Adjust timeouts based on task complexity and expected runtime
3. **Enable Repetitive Handoff Detection**: Set appropriate values for `repetitive_handoff_detection_window` and `repetitive_handoff_min_unique_agents` to prevent ping-pong behavior
4. **Include Agent Descriptions**: Add descriptions to help other agents understand capabilities
5. **Use Multi-line System Prompts**: Use YAML `|` syntax for readable, detailed system prompts
6. **Cache Frequently Used Swarms**: Use cache keys for swarms that are loaded multiple times
7. **Validate Configurations**: Test configurations with simple tasks before production use
8. **Version Control Configurations**: Store YAML configurations in version control for reproducibility
9. **Use Parameter Overrides**: Override config values with constructor parameters for dynamic adjustments
10. **Monitor Performance**: Use execution metrics to optimize timeout values and agent configurations

## Troubleshooting

### Common Issues

**Configuration Validation Errors**
```python
# Error: Swarm configuration must include 'agents' field
# Solution: Ensure your config has an 'agents' list
config = {
    "agents": [  # Required field
        {"name": "agent1", "model": "model_id"}
    ]
}
```

**Agent Loading Failures**
```python
# Error: Agent configuration must include 'model' field
# Solution: Ensure each agent has required fields
agents = [
    {
        "name": "agent1",     # Required
        "model": "model_id",  # Required
        "system_prompt": "...", # Optional but recommended
        "tools": []           # Optional
    }
]
```

**File Loading Issues**
```python
# Error: Configuration file not found
# Solution: Check file path and ensure file exists
swarm = Swarm(config='path/to/swarm_config.yml')

# Error: Unsupported config file format
# Solution: Use .yml, .yaml, or .json files
swarm = Swarm(config='config.yml')  # ✓ Supported
swarm = Swarm(config='config.txt')  # ✗ Not supported
```

**Parameter Override Issues**
```python
# Individual parameters override config values
swarm = Swarm(
    config={'max_handoffs': 10},
    max_handoffs=20  # This overrides the config value
)
assert swarm.max_handoffs == 20  # Uses override value
```

### Performance Tips

2. **Optimize Timeouts**: Set appropriate timeout values based on your use case
3. **Clear Cache**: Periodically clear cache in long-running applications
4. **Minimize Config Size**: Only include non-default values in configurations
5. **Batch Operations**: Load multiple swarms with the same SwarmConfigLoader instance

### Integration Notes

- **AgentConfigLoader Integration**: SwarmConfigLoader automatically uses AgentConfigLoader for agent management
- **Circular Import Avoidance**: Uses lazy loading to prevent circular import issues
- **Error Handling**: Provides clear error messages for debugging configuration issues
- **Backward Compatibility**: Existing Swarm usage patterns continue to work unchanged
