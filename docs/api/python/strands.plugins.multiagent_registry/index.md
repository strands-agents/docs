MultiAgentPlugin registry for managing plugins attached to a multi-agent orchestrator.

This module provides the \_MultiAgentPluginRegistry class for tracking and managing plugins that have been initialized with an orchestrator instance.

## \_MultiAgentPluginRegistry

```python
class _MultiAgentPluginRegistry()
```

Defined in: [src/strands/plugins/multiagent\_registry.py:20](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/multiagent_registry.py#L20)

Registry for managing plugins attached to a multi-agent orchestrator.

The \_MultiAgentPluginRegistry tracks plugins that have been initialized with an orchestrator, providing methods to add plugins and invoke their initialization.

The registry handles:

1.  Calling the plugin’s init\_multi\_agent() method for custom initialization
2.  Auto-registering discovered @hook decorated methods with the orchestrator

**Example**:

```python
registry = _MultiAgentPluginRegistry(orchestrator)

class MyPlugin(MultiAgentPlugin):
    name = "my-plugin"

    @hook
    def on_event(self, event: BeforeNodeCallEvent):
        pass  # Auto-registered by registry

    def init_multi_agent(self, orchestrator: MultiAgentBase) -> None:
        # Custom logic
        pass

plugin = MyPlugin()
registry.add_and_init(plugin)
```

#### \_\_init\_\_

```python
def __init__(orchestrator: "MultiAgentBase") -> None
```

Defined in: [src/strands/plugins/multiagent\_registry.py:50](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/multiagent_registry.py#L50)

Initialize a plugin registry with an orchestrator reference.

**Arguments**:

-   `orchestrator` - The orchestrator instance that plugins will be initialized with.

#### add\_and\_init

```python
def add_and_init(plugin: MultiAgentPlugin) -> None
```

Defined in: [src/strands/plugins/multiagent\_registry.py:67](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/multiagent_registry.py#L67)

Add and initialize a plugin with the orchestrator.

This method:

1.  Registers the plugin in the registry
2.  Calls the plugin’s init\_multi\_agent method for custom initialization
3.  Auto-registers all discovered @hook methods with the orchestrator’s hook registry

Handles both sync and async init\_multi\_agent implementations automatically.

**Arguments**:

-   `plugin` - The plugin to add and initialize.

**Raises**:

-   `ValueError` - If a plugin with the same name is already registered.