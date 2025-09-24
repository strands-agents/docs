# Experimental ToolBox

!!! warning "Experimental Feature"
    This feature is experimental and may change in future versions. Use with caution in production environments.

The experimental `ToolBox` provides a clean, intuitive way to manage collections of tools with a natural constructor API, serving as a tool registry for a single Strands runtime.

## Overview

`ToolBox` is designed as a superset of tools available to the agent framework, providing an interface for customers to create their own agents by selecting from a curated list of available tools. Think of it as a tool registry that manages all tools within a single Strands runtime environment.

### Key Concepts

- **Tool Registry**: Centralized management of all available tools
- **Customer Interface**: Enable customers to select tools for their custom agents
- **Runtime Scope**: Manages tools within a single Strands runtime instance
- **Natural API**: Clean, intuitive constructor and method interfaces

### Use Cases

- **Platform Providers**: Offer a curated set of tools that customers can choose from
- **Multi-tenant Environments**: Manage tool availability per tenant or customer
- **Agent Marketplaces**: Allow users to build custom agents from available tools
- **Tool Governance**: Control which tools are available in different contexts

`ToolBox` allows you to:

- Manage collections of tools with a clean constructor API
- Pass tool functions directly: `ToolBox([calculator, current_time])`
- Import entire modules of tools with `ToolBox.from_module()`
- Integrate seamlessly with Agent instances
- Provide customers with tool selection interfaces

## Customer Interface Example

Here's how a platform provider might use ToolBox to offer tool selection to customers:

```python
from strands.experimental import ToolBox, AgentConfig
from strands_tools import calculator, web_search, file_operations, data_analysis

# Platform provider creates a comprehensive tool registry
platform_tools = ToolBox([
    calculator,
    web_search, 
    file_operations,
    data_analysis,
    # ... more tools
])

# Customer selects tools for their specific use case
def create_customer_agent(selected_tool_names: list[str], customer_config: dict):
    """Allow customers to create agents with selected tools."""
    
    # Filter tools based on customer selection
    customer_tools = ToolBox()
    all_tools = platform_tools.list_tools()
    
    for tool in all_tools:
        if tool.tool_name in selected_tool_names:
            customer_tools.add_tool(tool)
    
    # Create customer's agent configuration
    config = AgentConfig(customer_config)
    
    # Return configured agent with selected tools
    return config.toAgent(tools=customer_tools)

# Customer usage
my_agent = create_customer_agent(
    selected_tool_names=["calculator", "web_search"],
    customer_config={
        "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
        "prompt": "You are my research assistant"
    }
)
```

## Basic Usage

### Direct Tool Function Passing

```python
from strands.experimental import ToolBox
from strands_tools import calculator, current_time

# Create pool with tool functions directly
pool = ToolBox([calculator, current_time])

# Use with Agent
from strands import Agent
agent = Agent(tools=pool.list_tools())
```

### Empty Pool with Manual Addition

```python
from strands.experimental import ToolBox
from strands_tools import calculator

# Create empty pool
pool = ToolBox()

# Add tools manually
pool.add_tool_function(calculator)

# Get tool names
print(pool.list_tool_names())  # ['calculator']

# Get AgentTool instances
tools = pool.list_tools()
```

## Module Import

Import all `@tool` decorated functions from a module:

```python
from strands.experimental import ToolBox
import strands_tools

# Import all tools from module
pool = ToolBox.from_module(strands_tools)

# Or add to existing pool
pool = ToolBox()
pool.add_tools_from_module(strands_tools)
```

## API Reference

### Constructor

```python
ToolBox(tools: list[AgentTool | Callable] | None = None)
```

- `tools`: Optional list of AgentTool instances or `@tool` decorated functions

### Methods

#### `add_tool_function(tool_func: Callable) -> None`

Add a `@tool` decorated function to the pool.

```python
from strands import tool

@tool
def my_calculator(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b

pool = ToolBox()
pool.add_tool_function(my_calculator)
```

#### `add_tools_from_module(module: any) -> None`

Add all `@tool` decorated functions from a module.

```python
import my_tools_module

pool = ToolBox()
pool.add_tools_from_module(my_tools_module)
```

#### `list_tool_names() -> list[str]`

Get a list of all tool names in the pool.

```python
pool = ToolBox([calculator, current_time])
names = pool.list_tool_names()  # ['calculator', 'current_time']
```

#### `list_tools() -> list[AgentTool]`

Get all tools as AgentTool instances for use with Agent.

```python
pool = ToolBox([calculator, current_time])
agent_tools = pool.list_tools()

# Use with Agent
agent = Agent(tools=agent_tools)
```

#### `from_module(module: any) -> ToolBox` (Class Method)

Create a ToolBox from all `@tool` functions in a module.

```python
import strands_tools

# Create pool from entire module
pool = ToolBox.from_module(strands_tools)
```

## Integration with AgentConfig

ToolBox works seamlessly with the experimental AgentConfig:

```python
from strands.experimental import AgentConfig, ToolBox
from strands_tools import calculator, web_search

# Create tool pool
tools = ToolBox([calculator, web_search])

# Create agent config
config = AgentConfig({
    "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "prompt": "You are a helpful assistant with access to tools"
})

# Create agent with tools
agent = config.toAgent(tools=tools)
```

## Mixed Tool Types

ToolBox accepts both AgentTool instances and `@tool` decorated functions:

```python
from strands.experimental import ToolBox
from strands.types.tools import AgentTool
from strands_tools import calculator

# Custom AgentTool
class CustomTool(AgentTool):
    def __init__(self):
        super().__init__(tool_name="custom_tool")
    
    def invoke(self, input_data, context):
        return "Custom result"

# Mix different tool types
pool = ToolBox([
    calculator,        # @tool decorated function
    CustomTool()       # AgentTool instance
])
```

## Error Handling

```python
from strands.experimental import ToolBox

def not_a_tool():
    """This function is not decorated with @tool"""
    pass

try:
    pool = ToolBox([not_a_tool])
except ValueError as e:
    print(f"Error: {e}")  # Function not_a_tool is not decorated with @tool
```

## Best Practices

1. **Use direct function passing**: Pass `@tool` decorated functions directly to the constructor
2. **Module imports**: Use `from_module()` for importing entire tool modules
3. **Clear naming**: Tool names are automatically derived from function names
4. **Type safety**: ToolBox validates that functions are properly decorated
5. **Integration**: Use with AgentConfig for complete configuration management

## Example: Complete Workflow

```python
from strands.experimental import ToolBox, AgentConfig
from strands import tool
import strands_tools

# Define custom tool
@tool
def custom_calculator(expression: str) -> float:
    """Evaluate a mathematical expression safely."""
    # Safe evaluation logic here
    return eval(expression)  # Note: Use safe evaluation in production

# Create tool pool with mixed sources
pool = ToolBox([custom_calculator])
pool.add_tools_from_module(strands_tools)

# Create agent configuration
config = AgentConfig({
    "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "prompt": "You are a mathematical assistant with access to calculation tools"
})

# Create agent with all tools
agent = config.toAgent(tools=pool)

# Use the agent
response = agent("Calculate the compound interest on $1000 at 5% for 3 years")
```

This experimental feature provides a foundation for more intuitive tool management while maintaining compatibility with the existing Agent and tool infrastructure.
