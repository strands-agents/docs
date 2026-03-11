Plugin registry for managing plugins attached to an agent.

This module provides the \_PluginRegistry class for tracking and managing plugins that have been initialized with an agent instance.

## \_PluginRegistry

```python
class _PluginRegistry()
```

Defined in: [src/strands/plugins/registry.py:22](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/registry.py#L22)

Registry for managing plugins attached to an agent.

The \_PluginRegistry tracks plugins that have been initialized with an agent, providing methods to add plugins and invoke their initialization.

The registry handles:

1.  Calling the plugin’s init\_agent() method for custom initialization
2.  Auto-registering discovered @hook decorated methods with the agent
3.  Auto-registering discovered @tool decorated methods with the agent

**Example**:

```python
registry = _PluginRegistry(agent)

class MyPlugin(Plugin):
    name = "my-plugin"

    @hook
    def on_event(self, event: BeforeModelCallEvent):
        pass  # Auto-registered by registry

    def init_agent(self, agent: Agent) -> None:
        # Custom logic only - no super() needed
        pass

plugin = MyPlugin()
registry.add_and_init(plugin)
```

#### \_\_init\_\_

```python
def __init__(agent: "Agent") -> None
```

Defined in: [src/strands/plugins/registry.py:53](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/registry.py#L53)

Initialize a plugin registry with an agent reference.

**Arguments**:

-   `agent` - The agent instance that plugins will be initialized with.

#### add\_and\_init

```python
def add_and_init(plugin: Plugin) -> None
```

Defined in: [src/strands/plugins/registry.py:70](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/registry.py#L70)

Add and initialize a plugin with the agent.

This method:

1.  Registers the plugin in the registry
2.  Calls the plugin’s init\_agent method for custom initialization
3.  Auto-registers all discovered @hook methods with the agent’s hook registry
4.  Auto-registers all discovered @tool methods with the agent’s tool registry

Handles both sync and async init\_agent implementations automatically.

**Arguments**:

-   `plugin` - The plugin to add and initialize.

**Raises**:

-   `ValueError` - If a plugin with the same name is already registered.