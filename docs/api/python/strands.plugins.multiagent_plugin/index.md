MultiAgentPlugin base class for extending multi-agent orchestrator functionality.

This module defines the MultiAgentPlugin base class, which provides a composable way to add behavior changes to multi-agent orchestrators (Swarm, Graph) through automatic hook registration and custom initialization.

MultiAgentPlugin is the orchestrator-level counterpart to Plugin (which targets individual agents). A class can implement both Plugin and MultiAgentPlugin to provide functionality at both levels.

## MultiAgentPlugin

```python
class MultiAgentPlugin(ABC)
```

Defined in: [src/strands/plugins/multiagent\_plugin.py:22](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/multiagent_plugin.py#L22)

Base class for objects that extend multi-agent orchestrator functionality.

MultiAgentPlugins provide a composable way to add behavior changes to orchestrators (Swarm, Graph). They support automatic discovery and registration of methods decorated with @hook.

Unlike agent-level Plugin, MultiAgentPlugin does not support @tool decorated methods since orchestrators do not have tool registries.

**Attributes**:

-   `name` - A stable string identifier for the plugin (must be provided by subclass)
    
-   `hooks` - Hooks attached to the orchestrator, auto-discovered from @hook decorated methods
    
    Example using decorators (recommended):
    
    ```python
    from strands.plugins import MultiAgentPlugin, hook
    from strands.hooks import BeforeNodeCallEvent, AfterNodeCallEvent
    
    class MonitoringPlugin(MultiAgentPlugin):
        name = "monitoring"
    
        @hook
        def on_before_node(self, event: BeforeNodeCallEvent):
            print(f"Node \{event.node_id} starting")
    
        @hook
        def on_after_node(self, event: AfterNodeCallEvent):
            print(f"Node \{event.node_id} completed")
    ```
    
    Example with custom initialization:
    
    ```python
    class MyPlugin(MultiAgentPlugin):
        name = "my-plugin"
    
        def init_multi_agent(self, orchestrator: MultiAgentBase) -> None:
            # Custom initialization logic
            pass
    ```
    
    Dual-use example (both agent and orchestrator):
    
    ```python
    from strands.plugins import Plugin, MultiAgentPlugin, hook
    from strands.hooks import BeforeInvocationEvent, BeforeNodeCallEvent
    
    class ObservabilityPlugin(Plugin, MultiAgentPlugin):
        name = "observability"
    
        @hook
        def on_agent_invocation(self, event: BeforeInvocationEvent):
            print("Agent invocation started")
    
        @hook
        def on_node_call(self, event: BeforeNodeCallEvent):
            print(f"Node \{event.node_id} starting")
    
        def init_agent(self, agent):
            pass  # Agent-level setup
    
        def init_multi_agent(self, orchestrator):
            pass  # Orchestrator-level setup
    ```
    

#### name

```python
@property
@abstractmethod
def name() -> str
```

Defined in: [src/strands/plugins/multiagent\_plugin.py:89](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/multiagent_plugin.py#L89)

A stable string identifier for the plugin.

#### \_\_init\_\_

```python
def __init__() -> None
```

Defined in: [src/strands/plugins/multiagent\_plugin.py:93](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/multiagent_plugin.py#L93)

Initialize the plugin and discover decorated hook methods.

Scans the class for methods decorated with @hook and stores references for later registration when the plugin is attached to an orchestrator.

Uses a guard to prevent double-discovery when used with multiple inheritance (e.g., a class that inherits from both Plugin and MultiAgentPlugin).

#### hooks

```python
@property
def hooks() -> list[HookCallback]
```

Defined in: [src/strands/plugins/multiagent\_plugin.py:106](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/multiagent_plugin.py#L106)

List of hooks the plugin provides, auto-discovered from @hook decorated methods.

#### init\_multi\_agent

```python
def init_multi_agent(orchestrator: "MultiAgentBase") -> None | Awaitable[None]
```

Defined in: [src/strands/plugins/multiagent\_plugin.py:110](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/multiagent_plugin.py#L110)

Initialize the plugin with the orchestrator instance.

Override this method to add custom initialization logic. Decorated hooks are automatically registered by the plugin registry.

**Arguments**:

-   `orchestrator` - The multi-agent orchestrator instance to initialize with.