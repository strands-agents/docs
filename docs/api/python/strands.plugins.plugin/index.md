Plugin base class for extending agent functionality.

This module defines the Plugin base class, which provides a composable way to add behavior changes to agents through automatic hook and tool registration.

## Plugin

```python
class Plugin(ABC)
```

Defined in: [src/strands/plugins/plugin.py:21](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/plugin.py#L21)

Base class for objects that extend agent functionality.

Plugins provide a composable way to add behavior changes to agents. They support automatic discovery and registration of methods decorated with @hook and @tool decorators.

**Attributes**:

-   `name` - A stable string identifier for the plugin (must be provided by subclass)
    
-   `hooks` - Hooks attached to the agent, auto-discovered from @hook decorated methods during **init**
    
-   `tools` - Tools attached to the agent, auto-discovered from @tool decorated methods during **init**
    
    Example using decorators (recommended):
    
    ```python
    from strands.plugins import Plugin, hook
    from strands.hooks import BeforeModelCallEvent
    from strands import tool
    
    class MyPlugin(Plugin):
        name = "my-plugin"
    
        @hook
        def on_model_call(self, event: BeforeModelCallEvent):
            print(f"Model called: \{event}")
    
        @tool
        def my_tool(self, param: str) -> str:
            '''A tool that does something.'''
            return f"Result: \{param}"
    ```
    
-   `Note` - Decorated methods are registered in declaration order, with parent class methods registered before child class methods. If a child overrides a parent’s decorated method, only the child’s version is registered.
    
    Example with custom initialization:
    
    ```python
    class MyPlugin(Plugin):
        name = "my-plugin"
    
        def init_agent(self, agent: Agent) -> None:
            # Custom initialization logic - no super() needed
            # Decorated hooks/tools are auto-registered by the plugin registry
            agent.add_hook(self.custom_hook)
    
        def custom_hook(self, event: BeforeModelCallEvent):
            print(event)
    ```
    

#### name

```python
@property
@abstractmethod
def name() -> str
```

Defined in: [src/strands/plugins/plugin.py:73](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/plugin.py#L73)

A stable string identifier for the plugin.

#### \_\_init\_\_

```python
def __init__() -> None
```

Defined in: [src/strands/plugins/plugin.py:77](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/plugin.py#L77)

Initialize the plugin and discover decorated methods.

Scans the class for methods decorated with @hook and @tool and stores references for later registration when the plugin is attached to an agent.

#### hooks

```python
@property
def hooks() -> list[HookCallback]
```

Defined in: [src/strands/plugins/plugin.py:88](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/plugin.py#L88)

List of hooks the plugin provides, auto-discovered from @hook decorated methods.

#### tools

```python
@property
def tools() -> list[DecoratedFunctionTool]
```

Defined in: [src/strands/plugins/plugin.py:93](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/plugin.py#L93)

List of tools the plugin provides, auto-discovered from @tool decorated methods.

#### init\_agent

```python
def init_agent(agent: "Agent") -> None | Awaitable[None]
```

Defined in: [src/strands/plugins/plugin.py:123](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/plugin.py#L123)

Initialize the agent instance.

Override this method to add custom initialization logic. Decorated hooks and tools are automatically registered by the plugin registry.

**Arguments**:

-   `agent` - The agent instance to initialize.