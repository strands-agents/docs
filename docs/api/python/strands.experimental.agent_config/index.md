Experimental agent configuration utilities.

This module provides utilities for creating agents from configuration files or dictionaries.

Note: Configuration-based agent setup only works for tools that don’t require code-based instantiation. For tools that need constructor arguments or complex setup, use the programmatic approach after creating the agent:

agent = config\_to\_agent(“config.json”)

# Add tools that need code-based instantiation

agent.tool\_registry.process\_tools(\[ToolWithConfigArg(HttpsConnection(“localhost”))\])

#### config\_to\_agent

```python
def config_to_agent(config: str | dict[str, Any], **kwargs: dict[str,
                                                                 Any]) -> Any
```

Defined in: [src/strands/experimental/agent\_config.py:54](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/agent_config.py#L54)

Create an Agent from a configuration file or dictionary.

This function supports tools that can be loaded declaratively (file paths, module names, or @tool annotated functions). For tools requiring code-based instantiation with constructor arguments, add them programmatically after creating the agent:

agent = config\_to\_agent(“config.json”) agent.process\_tools(\[ToolWithConfigArg(HttpsConnection(“localhost”))\])

**Arguments**:

-   `config` - Either a file path (with optional file:// prefix) or a configuration dictionary
-   `**kwargs` - Additional keyword arguments to pass to the Agent constructor

**Returns**:

-   `Agent` - A configured Agent instance

**Raises**:

-   `FileNotFoundError` - If the configuration file doesn’t exist
-   `json.JSONDecodeError` - If the configuration file contains invalid JSON
-   `ValueError` - If the configuration is invalid or tools cannot be loaded

**Examples**:

Create agent from file:

> > > agent = config\_to\_agent(“/path/to/config.json”)

Create agent from file with file:// prefix:

> > > agent = config\_to\_agent(“file:///path/to/config.json”)

Create agent from dictionary:

> > > config = {“model”: “anthropic.claude-3-5-sonnet-20241022-v2:0”, “tools”: \[“calculator”\]} agent = config\_to\_agent(config)