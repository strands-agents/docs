# GraphConfigLoader

The GraphConfigLoader enables serialization and deserialization of Strands `Graph` instances to/from dictionary configurations, supporting persistence, version control, and dynamic graph construction. This implementation allows complex multi-agent workflows to be defined programmatically and managed as configuration.

**Note**: This is an experimental feature that provides programmatic graph configuration loading through dictionaries. For file-based configuration, use the main Graph constructor's `config` parameter.

## Overview

The GraphConfigLoader provides functionality to:
- Load graphs from dictionary configurations
- Serialize existing graphs to dictionary configurations
- Support all graph elements: nodes, edges, entry points, and conditions
- Maintain referential integrity between graph components
- Enable dynamic graph construction from configuration
- Support all condition types through a unified `type` field discriminator

## Quick Start

### Using GraphConfigLoader

```python
from strands.experimental.config_loader.graph import GraphConfigLoader

# Define graph configuration
config = {
    "graph": {
        "graph_id": "research_workflow",
        "name": "Research Team Workflow",
        "description": "Processes research requests through specialized team members",
        "nodes": [
            {
                "node_id": "classifier",
                "type": "agent",
                "config": {
                    "name": "classifier",
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "You are a request classifier.",
                    "tools": []
                }
            },
            {
                "node_id": "processor",
                "type": "agent",
                "config": {
                    "name": "processor",
                    "model": "us.amazon.nova-pro-v1:0",
                    "system_prompt": "You are a request processor.",
                    "tools": []
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
        "entry_points": ["classifier"],
        "max_node_executions": 100,
        "execution_timeout": 300.0,
        "node_timeout": 30.0,
        "reset_on_revisit": False
    }
}

loader = GraphConfigLoader()
graph = loader.load_graph(config)

# Execute the graph
result = graph("Analyze the impact of remote work on productivity")
```

### File-Based Configuration (Use Main Constructors)

For loading from YAML/JSON files, use the main constructors instead:

```python
from strands.multiagent import GraphBuilder

# Load from YAML file and customize (not GraphConfigLoader)
builder = GraphBuilder.from_config('workflow.yml')

# Add custom nodes or modify configuration
builder.add_node(custom_agent, "custom_processor")
builder.set_max_node_executions(100)

# Build final graph
graph = builder.build()
```

## Schema Validation

The ConfigLoader includes comprehensive schema validation for graphs:

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

### Basic Graph Structure

```python
config = {
    "graph": {
        "nodes": [
            {
                "node_id": "agent1",
                "type": "agent",
                "config": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "You are a helpful agent."
                }
            }
        ],
        "edges": [],
        "entry_points": ["agent1"]
    }
}
```

### Complete Graph Configuration

```python
config = {
    "graph": {
        "graph_id": "complex_workflow",
        "name": "Complex Multi-Agent Workflow",
        "description": "A sophisticated workflow with multiple agent types and conditions",
        "max_node_executions": 100,
        "execution_timeout": 600.0,
        "node_timeout": 60.0,
        "reset_on_revisit": False,
        "nodes": [
            {
                "node_id": "classifier",
                "type": "agent",
                "config": {
                    "name": "classifier",
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "You are a request classifier. Analyze the input and categorize it.",
                    "tools": [
                        {"name": "text_analyzer", "module": "analysis_tools.text"}
                    ]
                }
            },
            {
                "node_id": "technical_processor",
                "type": "agent",
                "config": {
                    "name": "technical_processor",
                    "model": "us.amazon.nova-pro-v1:0",
                    "system_prompt": "You are a technical specialist. Handle technical queries with expertise.",
                    "tools": [
                        {"name": "code_analyzer", "module": "dev_tools.analyzer"},
                        {"name": "documentation_search", "module": "search_tools.docs"}
                    ]
                }
            },
            {
                "node_id": "general_processor",
                "type": "agent",
                "config": {
                    "name": "general_processor",
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "You are a general assistant. Handle general queries helpfully.",
                    "tools": [
                        {"name": "web_search", "module": "search_tools.web"}
                    ]
                }
            },
            {
                "node_id": "quality_checker",
                "type": "agent",
                "config": {
                    "name": "quality_checker",
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "You are a quality checker. Review responses for accuracy and completeness."
                }
            }
        ],
        "edges": [
            {
                "from_node": "classifier",
                "to_node": "technical_processor",
                "condition": {
                    "type": "expression",
                    "expression": "state.results.get('classifier', {}).get('category') == 'technical'"
                }
            },
            {
                "from_node": "classifier",
                "to_node": "general_processor",
                "condition": {
                    "type": "expression",
                    "expression": "state.results.get('classifier', {}).get('category') == 'general'"
                }
            },
            {
                "from_node": "technical_processor",
                "to_node": "quality_checker",
                "condition": {
                    "type": "expression",
                    "expression": "state.results.get('technical_processor', {}).get('status') == 'completed'"
                }
            },
            {
                "from_node": "general_processor",
                "to_node": "quality_checker",
                "condition": {
                    "type": "expression",
                    "expression": "state.results.get('general_processor', {}).get('status') == 'completed'"
                }
            }
        ],
        "entry_points": ["classifier"],
        "metadata": {
            "version": "1.0.0",
            "created_by": "workflow_designer",
            "tags": ["classification", "processing", "quality_control"]
        }
    }
}
```

## Node Configuration

### Agent Nodes

```python
{
    "node_id": "data_processor",
    "type": "agent",
    "config": {
        # Full agent configuration (as supported by AgentConfigLoader)
        "model": "us.amazon.nova-pro-v1:0",
        "system_prompt": "You are a data processing expert.",
        "tools": [
            {"name": "pandas_analyzer", "module": "data_tools.pandas"}
        ],
        "conversation_manager": {
            "type": "sliding_window",
            "window_size": 20
        }
    }
}
```

### Swarm Nodes

```python
{
    "node_id": "research_team",
    "type": "swarm",
    "config": {
        # Full swarm configuration (as supported by SwarmConfigLoader)
        "max_handoffs": 15,
        "agents": [
            {
                "name": "researcher",
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "You are a research specialist."
            },
            {
                "name": "analyst",
                "model": "us.amazon.nova-lite-v1:0",
                "system_prompt": "You are a data analyst."
            }
        ]
    }
}
```

### Graph Nodes (Nested Graphs)

```python
{
    "node_id": "sub_workflow",
    "type": "graph",
    "config": {
        # Full graph configuration (nested GraphConfigLoader)
        "nodes": [
            {
                "node_id": "sub_agent1",
                "type": "agent",
                "config": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "You are a sub-workflow agent."
                }
            }
        ],
        "edges": [],
        "entry_points": ["sub_agent1"]
    }
}
```

## Edge Conditions

### Expression Conditions

```python
{
    "from_node": "classifier",
    "to_node": "processor",
    "condition": {
        "type": "expression",
        "expression": "state.results.get('classifier', {}).get('confidence') > 0.8",
        "description": "Route to processor if classification confidence is high"
    }
}
```

### Rule Conditions

```python
{
    "from_node": "validator",
    "to_node": "processor",
    "condition": {
        "type": "rule",
        "rules": [
            {
                "field": "results.validator.status",
                "operator": "equals",
                "value": "valid"
            },
            {
                "field": "results.validator.confidence",
                "operator": "greater_than",
                "value": 0.7
            }
        ],
        "logic": "and",
        "description": "Route if validation passes with high confidence"
    }
}
```

### Function Conditions

```python
{
    "from_node": "analyzer",
    "to_node": "processor",
    "condition": {
        "type": "function",
        "module": "workflow_conditions",
        "function": "should_process",
        "timeout": 5.0,
        "default": False,
        "description": "Custom function to determine processing eligibility"
    }
}
```

### Composite Conditions

```python
{
    "from_node": "multi_checker",
    "to_node": "final_processor",
    "condition": {
        "type": "composite",
        "logic": "and",
        "conditions": [
            {
                "type": "expression",
                "expression": "state.execution_count < 10"
            },
            {
                "type": "rule",
                "rules": [
                    {
                        "field": "results.multi_checker.status",
                        "operator": "equals",
                        "value": "ready"
                    }
                ]
            }
        ],
        "description": "Complex condition combining multiple checks"
    }
}
```

## Graph Execution Parameters

### Timeout Configuration

```python
config = {
    "graph": {
        "execution_timeout": 600.0,  # Total graph execution timeout (10 minutes)
        "node_timeout": 60.0,        # Individual node timeout (1 minute)
        "max_node_executions": 100,  # Maximum total node executions
        "reset_on_revisit": False,   # Whether to reset node state on revisit
        # ... rest of configuration
    }
}
```

### Entry Points

```python
config = {
    "graph": {
        "entry_points": ["classifier", "validator"],  # Multiple entry points
        # ... rest of configuration
    }
}
```

### Using Cache Keys

```python
loader = GraphConfigLoader()

# Load with cache key
graph1 = loader.load_graph(config)
graph2 = loader.load_graph(config)  # Returns cached instance

```

### Serialization

```python
# Load from config
graph = loader.load_graph(config)

# Serialize back to config
serialized_config = loader.serialize_graph(graph)
```

## Error Handling

The GraphConfigLoader provides comprehensive error handling:

```python
try:
    graph = loader.load_graph(invalid_config)
except ValueError as e:
    print(f"Configuration error: {e}")
except ImportError as e:
    print(f"Missing dependency: {e}")
```

Common error scenarios:
- **Missing required fields**: Clear messages about required graph components
- **Invalid node references**: Validation of edge node references
- **Circular dependencies**: Detection and reporting of circular graph structures
- **Condition validation errors**: Specific guidance for condition configuration

## Advanced Examples

### Multi-Stage Processing Pipeline

```python
config = {
    "graph": {
        "graph_id": "document_processing_pipeline",
        "name": "Document Processing Pipeline",
        "nodes": [
            {
                "node_id": "document_classifier",
                "type": "agent",
                "config": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "Classify documents by type and priority.",
                    "tools": [{"name": "document_analyzer"}]
                }
            },
            {
                "node_id": "high_priority_processor",
                "type": "swarm",
                "config": {
                    "max_handoffs": 10,
                    "agents": [
                        {
                            "name": "urgent_handler",
                            "model": "us.amazon.nova-pro-v1:0",
                            "system_prompt": "Handle urgent documents with priority."
                        },
                        {
                            "name": "quality_reviewer",
                            "model": "us.amazon.nova-lite-v1:0",
                            "system_prompt": "Review urgent document processing."
                        }
                    ]
                }
            },
            {
                "node_id": "standard_processor",
                "type": "agent",
                "config": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "Process standard documents efficiently."
                }
            },
            {
                "node_id": "final_reviewer",
                "type": "agent",
                "config": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "Final review and quality check."
                }
            }
        ],
        "edges": [
            {
                "from_node": "document_classifier",
                "to_node": "high_priority_processor",
                "condition": {
                    "type": "expression",
                    "expression": "state.results.get('document_classifier', {}).get('priority') == 'high'"
                }
            },
            {
                "from_node": "document_classifier",
                "to_node": "standard_processor",
                "condition": {
                    "type": "expression",
                    "expression": "state.results.get('document_classifier', {}).get('priority') == 'standard'"
                }
            },
            {
                "from_node": "high_priority_processor",
                "to_node": "final_reviewer"
            },
            {
                "from_node": "standard_processor",
                "to_node": "final_reviewer"
            }
        ],
        "entry_points": ["document_classifier"],
        "max_node_executions": 50,
        "execution_timeout": 900.0,
        "node_timeout": 120.0
    }
}
```

### Conditional Workflow with Loops

```python
config = {
    "graph": {
        "graph_id": "iterative_refinement",
        "name": "Iterative Content Refinement",
        "nodes": [
            {
                "node_id": "content_generator",
                "type": "agent",
                "config": {
                    "model": "us.amazon.nova-pro-v1:0",
                    "system_prompt": "Generate content based on requirements."
                }
            },
            {
                "node_id": "quality_evaluator",
                "type": "agent",
                "config": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "Evaluate content quality and suggest improvements."
                }
            },
            {
                "node_id": "content_refiner",
                "type": "agent",
                "config": {
                    "model": "us.amazon.nova-pro-v1:0",
                    "system_prompt": "Refine content based on feedback."
                }
            },
            {
                "node_id": "final_approver",
                "type": "agent",
                "config": {
                    "model": "us.amazon.nova-lite-v1:0",
                    "system_prompt": "Final approval and formatting."
                }
            }
        ],
        "edges": [
            {
                "from_node": "content_generator",
                "to_node": "quality_evaluator"
            },
            {
                "from_node": "quality_evaluator",
                "to_node": "content_refiner",
                "condition": {
                    "type": "composite",
                    "logic": "and",
                    "conditions": [
                        {
                            "type": "expression",
                            "expression": "state.results.get('quality_evaluator', {}).get('needs_refinement') == True"
                        },
                        {
                            "type": "expression",
                            "expression": "state.execution_count < 5"
                        }
                    ]
                }
            },
            {
                "from_node": "content_refiner",
                "to_node": "quality_evaluator"
            },
            {
                "from_node": "quality_evaluator",
                "to_node": "final_approver",
                "condition": {
                    "type": "expression",
                    "expression": "state.results.get('quality_evaluator', {}).get('approved') == True"
                }
            }
        ],
        "entry_points": ["content_generator"],
        "max_node_executions": 20,
        "reset_on_revisit": True
    }
}
```

## Best Practices

1. **Use Schema Validation**: Enable IDE integration for better development experience
2. **Design Clear Node IDs**: Use descriptive, unique identifiers for all nodes
3. **Structure Conditions**: Write clear, testable conditions with good descriptions
4. **Manage Complexity**: Break complex workflows into smaller, manageable graphs
5. **Test Workflows**: Validate graph configurations and test execution paths
6. **Document Workflows**: Use metadata and descriptions to document graph purpose

## Next Steps

- [Agent Configuration](agent-config.md) - Detailed agent configuration for graph nodes
- [Swarm Configuration](swarm-config.md) - Swarm configuration for graph nodes
- [Tool Configuration](tool-config.md) - Tool configuration for graph agents
- [Structured Output](structured-output.md) - Structured output for graph agents

#### Swarm Nodes

```yaml
nodes:
  - node_id: "research_team"
    type: "swarm"
    config:
      # Full swarm configuration (as supported by SwarmConfigLoader)
      max_handoffs: 10
      agents:
        - name: "researcher1"
          model: "us.amazon.nova-lite-v1:0"
          system_prompt: "You are a researcher."
        - name: "researcher2"
          model: "us.amazon.nova-lite-v1:0"
          system_prompt: "You are an analyst."
```

#### Nested Graph Nodes

```yaml
nodes:
  - node_id: "sub_workflow"
    type: "graph"
    config:
      nodes: [...]
      edges: [...]
      entry_points: [...]
```

#### Reference Nodes (Future Enhancement)

```yaml
nodes:
  - node_id: "data_processor"
    type: "agent"
    reference: "my_agents.data_processor"  # String identifier for lookup
```

### Condition Types

The GraphConfigLoader supports multiple condition types through a unified `type` field discriminator:

#### 1. Expression Conditions (`type: "expression"`)

Use string expressions evaluated against the GraphState:

```yaml
condition:
  type: "expression"
  expression: "state.results.get('validator', {}).get('status') == 'success'"
  description: "Check if validation was successful"
  default: false
```

#### 2. Rule-Based Conditions (`type: "rule"`)

Define conditions using structured rules for common patterns:

```yaml
condition:
  type: "rule"
  rules:
    - field: "results.validator.status"
      operator: "equals"
      value: "success"
    - field: "results.validator.confidence"
      operator: "greater_than"
      value: 0.8
  logic: "and"  # or "or"
  description: "Successful validation with high confidence"
```

**Supported Operators:**
- `equals`, `not_equals`
- `greater_than`, `less_than`, `greater_equal`, `less_equal`
- `contains`, `starts_with`, `ends_with`
- `regex_match`

#### 3. Function Reference Conditions (`type: "function"`)

Reference functions by module path and function name:

```yaml
condition:
  type: "function"
  module: "workflow.conditions"
  function: "is_technical"
  description: "Checks if request is technical"
  timeout: 5.0
  default: false
```

**Implementation Pattern:**
```python
# In workflow/conditions.py
def is_technical(state: GraphState) -> bool:
    classifier_result = state.results.get("classifier")
    if not classifier_result:
        return False
    result_text = str(classifier_result.result)
    return "technical" in result_text.lower()
```

#### 4. Lambda Conditions (`type: "lambda"`)

Simple lambda expressions for basic conditions:

```yaml
condition:
  type: "lambda"
  expression: "lambda state: 'technical' in str(state.results.get('classifier', {}).get('result', '')).lower()"
  description: "Check for technical classification"
  timeout: 2.0
```

#### 5. Template Conditions (`type: "template"`)

Pre-defined condition templates for common patterns:

```yaml
condition:
  type: "template"
  template: "node_result_contains"
  parameters:
    node_id: "classifier"
    search_text: "technical"
    case_sensitive: false
  description: "Check if classifier result contains 'technical'"
```

**Available Templates:**
- `node_result_contains`: Check if node result contains text
- `node_execution_time_under`: Check if node execution time is under threshold
- `node_status_equals`: Check if node status equals expected value
- `execution_count_under`: Check if execution count is under threshold

#### 6. Composite Conditions (`type: "composite"`)

Combine multiple conditions with logical operators:

```yaml
condition:
  type: "composite"
  logic: "and"  # "and", "or", "not"
  conditions:
    - type: "function"
      module: "conditions"
      function: "is_valid"
    - type: "expression"
      expression: "state.execution_count < 10"
  description: "Valid data and under execution limit"
```

## Complete Examples

### Example 1: Basic Sequential Processing

```yaml
# basic_processing_graph.yaml
graph_id: "research_team_workflow"
name: "Research Team Workflow"
description: "Processes research requests through specialized team members"

nodes:
  - node_id: "team_lead"
    type: "agent"
    config:
      name: "coordinator"
      system_prompt: "You are a research team leader coordinating specialists."
      model: "us.amazon.nova-pro-v1:0"

  - node_id: "analyst"
    type: "agent"
    config:
      name: "data_analyst"
      system_prompt: "You are a data analyst providing detailed analysis."
      model: "us.amazon.nova-lite-v1:0"

  - node_id: "expert"
    type: "agent"
    config:
      name: "domain_expert"
      system_prompt: "You are a domain expert providing specialized insights."
      model: "us.amazon.nova-lite-v1:0"

edges:
  - from_node: "team_lead"
    to_node: "analyst"
    condition: null

  - from_node: "team_lead"
    to_node: "expert"
    condition: null

entry_points:
  - "team_lead"

max_node_executions: null
execution_timeout: null
node_timeout: null
reset_on_revisit: false

metadata:
  version: "1.0.0"
  created_by: "tutorial_example"
  tags: ["research", "analysis", "coordination"]
```

### Example 2: Conditional Branching

```yaml
# conditional_branching_graph.yaml
graph_id: "classification_workflow"
name: "Classification and Routing Workflow"
description: "Classifies requests and routes to appropriate specialists"

nodes:
  - node_id: "classifier"
    type: "agent"
    config:
      name: "classifier"
      system_prompt: "You are an agent responsible for classification of the report request, return only Technical or Business classification."
      model: "us.amazon.nova-lite-v1:0"

  - node_id: "technical_report"
    type: "agent"
    config:
      name: "technical_expert"
      system_prompt: "You are a technical expert that focuses on providing short summary from technical perspective"
      model: "us.amazon.nova-pro-v1:0"

  - node_id: "business_report"
    type: "agent"
    config:
      name: "business_expert"
      system_prompt: "You are a business expert that focuses on providing short summary from business perspective"
      model: "us.amazon.nova-pro-v1:0"

edges:
  - from_node: "classifier"
    to_node: "technical_report"
    condition:
      type: "function"
      module: "workflow.conditions"
      function: "is_technical"
      description: "Route to technical expert if classified as technical"

  - from_node: "classifier"
    to_node: "business_report"
    condition:
      type: "function"
      module: "workflow.conditions"
      function: "is_business"
      description: "Route to business expert if classified as business"

entry_points:
  - "classifier"

max_node_executions: 10
execution_timeout: 60.0
node_timeout: 30.0
reset_on_revisit: false
```

### Example 3: Complex Multi-Agent Pipeline

```yaml
# complex_pipeline_graph.yaml
graph_id: "data_processing_pipeline"
name: "Data Processing Pipeline"
description: "Comprehensive data processing through validation, analysis, and reporting"

nodes:
  - node_id: "input_validator"
    type: "agent"
    config:
      model: "us.amazon.nova-lite-v1:0"
      system_prompt: "Validate incoming data for completeness and format."
      tools:
        - name: "data_validator"

  - node_id: "data_analyzer"
    type: "agent"
    reference: "my_agents.analyzer"  # String reference to existing agent

  - node_id: "report_generator"
    type: "swarm"
    config:
      agents:
        - name: "summary_writer"
          config:
            system_prompt: "Generate executive summaries"
            model: "us.amazon.nova-lite-v1:0"
        - name: "chart_generator"
          config:
            system_prompt: "Create data visualizations"
            model: "us.amazon.nova-lite-v1:0"
            tools:
              - name: "matplotlib_tool"

  - node_id: "quality_checker"
    type: "agent"
    config:
      model: "us.amazon.nova-pro-v1:0"
      system_prompt: "Review and validate the quality of generated reports."

  - node_id: "error_handler"
    type: "agent"
    config:
      model: "us.amazon.nova-lite-v1:0"
      system_prompt: "Handle and log processing errors with recovery suggestions."

edges:
  # Validation flow
  - from_node: "input_validator"
    to_node: "data_analyzer"
    condition:
      type: "function"
      module: "workflow.conditions"
      function: "is_data_valid"
      description: "Proceed if data validation passes"

  - from_node: "input_validator"
    to_node: "error_handler"
    condition:
      type: "function"
      module: "workflow.conditions"
      function: "is_data_invalid"
      description: "Handle validation failures"

  # Analysis flow
  - from_node: "data_analyzer"
    to_node: "report_generator"
    condition:
      type: "expression"
      expression: "state.results.get('data_analyzer', {}).get('status') == 'completed'"
      description: "Generate report when analysis is complete"

  - from_node: "data_analyzer"
    to_node: "error_handler"
    condition:
      type: "rule"
      rules:
        - field: "results.data_analyzer.status"
          operator: "equals"
          value: "error"
      description: "Handle analysis errors"

  # Quality control flow
  - from_node: "report_generator"
    to_node: "quality_checker"
    condition:
      type: "composite"
      logic: "and"
      conditions:
        - type: "expression"
          expression: "state.results.get('report_generator', {}).get('status') == 'completed'"
        - type: "template"
          template: "node_execution_time_under"
          parameters:
            node_id: "report_generator"
            max_time_ms: 30000
      description: "Quality check if report generation completed successfully and quickly"

entry_points:
  - "input_validator"

# Execution limits
max_node_executions: 50
execution_timeout: 300.0
node_timeout: 60.0
reset_on_revisit: true

metadata:
  version: "2.1.0"
  created_by: "data_team"
  tags: ["data_processing", "validation", "reporting", "quality_control"]
  environment: "production"
```

## API Reference

### GraphConfigLoader Class

```python
class GraphConfigLoader:
    def __init__(self, 
                 agent_loader: Optional[AgentConfigLoader] = None,
                 swarm_loader: Optional[SwarmConfigLoader] = None)
    def load_graph(self, config: Dict[str, Any], cache_key: Optional[str] = None) -> Graph
    def serialize_graph(self, graph: Graph) -> Dict[str, Any]
    def clear_cache(self) -> None
    def get_available_graphs(self) -> List[str]
```

#### Methods

**`load_graph(config)`**
- Load a Graph from YAML configuration (loaded as dictionary)
- `config`: Dictionary containing graph configuration
- `cache_key`: Optional key for caching the loaded graph
- Returns: Graph instance configured according to the provided dictionary
- Raises: `ValueError` if configuration is invalid, `ImportError` if models/tools cannot be imported

**`serialize_graph(graph)`**
- Serialize a Graph instance to YAML-compatible dictionary configuration
- `graph`: Graph instance to serialize
- Returns: Dictionary containing the graph's configuration that can be saved as YAML
- Note: Condition serialization is complex and may require manual reconstruction

**`clear_cache()`**
- Clear the internal graph cache
- Useful for memory management in long-running applications

**`get_available_graphs()`**
- Get list of cached graph keys
- Returns: List of cached graph keys

### ConditionRegistry Class

```python
class ConditionRegistry:
    def load_condition(self, config: Dict[str, Any]) -> Callable[[GraphState], bool]
```

The ConditionRegistry handles all condition types through type-based dispatch and provides security features like expression sanitization and module access validation.

## Usage Examples

### Loading from YAML File

```python
from strands.experimental.config_loader.graph import GraphConfigLoader
import yaml

# Load configuration
with open('workflow.yml', 'r') as f:
    config = yaml.safe_load(f)

loader = GraphConfigLoader()
graph = loader.load_graph(config)

# Execute the graph
result = graph("Analyze the impact of remote work on employee productivity")

# Access results
print(f"Total nodes: {result.total_nodes}")
print(f"Completed nodes: {result.completed_nodes}")
print(f"Execution order: {[node.node_id for node in result.execution_order]}")
```

### Dynamic Graph Construction

```python
def create_classification_workflow(enable_technical: bool = True, enable_business: bool = True):
    """Create a classification workflow with configurable branches."""
    
    base_config = {
        "graph_id": "dynamic_classifier",
        "nodes": [
            {
                "node_id": "classifier",
                "type": "agent",
                "config": {
                    "system_prompt": "Classify the request as Technical or Business",
                    "model": "us.amazon.nova-lite-v1:0"
                }
            }
        ],
        "edges": [],
        "entry_points": ["classifier"]
    }
    
    # Add technical branch if enabled
    if enable_technical:
        base_config["nodes"].append({
            "node_id": "technical_processor",
            "type": "agent",
            "config": {
                "system_prompt": "Process technical requests",
                "model": "us.amazon.nova-pro-v1:0"
            }
        })
        base_config["edges"].append({
            "from_node": "classifier",
            "to_node": "technical_processor",
            "condition": {
                "type": "function",
                "module": "conditions",
                "function": "is_technical"
            }
        })
    
    # Add business branch if enabled
    if enable_business:
        base_config["nodes"].append({
            "node_id": "business_processor",
            "type": "agent",
            "config": {
                "system_prompt": "Process business requests",
                "model": "us.amazon.nova-pro-v1:0"
            }
        })
        base_config["edges"].append({
            "from_node": "classifier",
            "to_node": "business_processor",
            "condition": {
                "type": "function",
                "module": "conditions",
                "function": "is_business"
            }
        })
    
    return GraphConfigLoader().load_graph(base_config)

# Create different workflow variants
tech_only_workflow = create_classification_workflow(enable_business=False)
full_workflow = create_classification_workflow()
```

### Integration with GraphBuilder

```python
from strands.multiagent import GraphBuilder

# Load base configuration and customize
builder = GraphBuilder.from_config("base_workflow.yaml")

# Add custom nodes or modify configuration
builder.add_node(custom_agent, "custom_processor")
builder.add_edge("data_analyzer", "custom_processor")
builder.set_max_node_executions(50)

# Build final graph
graph = builder.build()
```

## Security Considerations

The GraphConfigLoader implements several security measures:

1. **Module Access Control**: Only allowed modules can be imported for function conditions
2. **Expression Sanitization**: Dangerous patterns are blocked in expressions and lambdas
3. **Length Limits**: Expressions have maximum length limits to prevent abuse
4. **Timeout Protection**: Condition evaluation can be wrapped with timeouts
5. **Safe Evaluation**: Restricted execution environments with limited builtins

```python
# Security configuration
registry = ConditionRegistry()
registry.allowed_modules = ["conditions", "workflow.conditions"]
registry.max_expression_length = 500
registry.evaluation_timeout = 5.0
```

## Best Practices

1. **Use Descriptive Node IDs**: Node IDs should clearly indicate their purpose
2. **Organize Conditions**: Group related condition functions in dedicated modules
3. **Validate Configurations**: Test configurations with simple inputs before production
4. **Use Templates**: Leverage condition templates for common patterns
5. **Document Conditions**: Include descriptions for all conditions
6. **Version Control**: Store YAML configurations in version control
7. **Environment-Specific Configs**: Use different configurations for different environments
8. **Monitor Performance**: Set appropriate timeouts and execution limits
9. **Cache Frequently Used Graphs**: Use cache keys for graphs loaded multiple times
10. **Security First**: Validate all condition functions and expressions

## Troubleshooting

### Common Issues

**Configuration Validation Errors**
```python
# Error: Graph configuration must include 'nodes' field
# Solution: Ensure your config has required fields
config = {
    "nodes": [...],     # Required
    "edges": [...],     # Required
    "entry_points": [...] # Required
}
```

**Condition Loading Failures**
```python
# Error: Cannot load condition function module.function
# Solution: Ensure module is in allowed list and function exists
condition = {
    "type": "function",
    "module": "conditions",  # Must be in allowed_modules
    "function": "is_valid"   # Must exist in module
}
```

**Node Reference Issues**
```python
# Error: Edge references unknown from_node
# Solution: Ensure all edge references point to existing nodes
edges = [
    {
        "from_node": "classifier",  # Must exist in nodes
        "to_node": "processor"      # Must exist in nodes
    }
]
```

### Performance Tips

2. **Optimize Conditions**: Use simple expressions and avoid complex computations
3. **Set Timeouts**: Configure appropriate timeouts for condition evaluation
4. **Minimize Config Size**: Only include non-default values in configurations
5. **Batch Operations**: Load multiple graphs with the same GraphConfigLoader instance

### Integration Notes

- **AgentConfigLoader Integration**: GraphConfigLoader automatically uses AgentConfigLoader for agent nodes
- **SwarmConfigLoader Integration**: GraphConfigLoader automatically uses SwarmConfigLoader for swarm nodes
- **Circular Import Avoidance**: Uses lazy loading to prevent circular import issues
- **Error Handling**: Provides clear error messages for debugging configuration issues
- **Backward Compatibility**: Designed to work with existing Graph and GraphBuilder patterns
