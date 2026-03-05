# Plugins

Plugins allow you to change the typical behavior of an agent. They enable you to introduce concepts like [Skills](https://agentskills.io/specification), [steering](../experimental/steering.md), or other behavioral modifications into the agentic loop. Plugins work by taking advantage of the low-level primitives exposed by the Agent class—`model`, `system_prompt`, `messages`, `tools`, and `hooks`—and executing logic to improve an agent's behavior.

## Overview

The Strands SDK provides built-in plugins that you can use out of the box:

- **[Steering](../experimental/steering.md)** - Modular prompting for complex agent tasks through context-aware guidance

You can also create your own plugins to extend agent functionality with custom behavior.

## Using Plugins

Plugins are passed to agents during initialization via the `plugins` parameter:

=== "Python"

    ```python
    from strands import Agent
    from strands.experimental.steering import LLMSteeringHandler

    # Create an agent with plugins
    agent = Agent(
        tools=[my_tool],
        plugins=[LLMSteeringHandler(system_prompt="Guide the agent...")]
    )
    ```

{{ ts_not_supported_code("Plugins are not yet available in TypeScript SDK") }}

## Building Plugins

This section walks through how to build a custom plugin step by step.

### Basic Plugin Structure

A plugin is a class that extends the `Plugin` base class and defines a `name` property. Here's a simple logging plugin:

=== "Python"

    ```python
    from strands import Agent, tool
    from strands.plugins import Plugin, hook
    from strands.hooks import BeforeToolCallEvent, AfterToolCallEvent

    class LoggingPlugin(Plugin):
        """A plugin that logs all tool calls and provides a utility tool."""

        name = "logging-plugin"

        @hook
        def log_before_tool(self, event: BeforeToolCallEvent) -> None:
            """Called before each tool execution."""
            print(f"[LOG] Calling tool: {event.tool_use['name']}")
            print(f"[LOG] Input: {event.tool_use['input']}")

        @hook
        def log_after_tool(self, event: AfterToolCallEvent) -> None:
            """Called after each tool execution."""
            print(f"[LOG] Tool completed: {event.tool_use['name']}")

        @tool
        def debug_print(self, message: str) -> str:
            """Print a debug message.

            Args:
                message: The message to print
            """
            print(f"[DEBUG] {message}")
            return f"Printed: {message}"

    # Using the plugin
    agent = Agent(plugins=[LoggingPlugin()])
    agent("Calculate 2 + 2 and print the result")
    ```

{{ ts_not_supported_code("Plugins are not yet available in TypeScript SDK") }}

### How It Works Under the Hood

When you attach a plugin to an agent, the following happens:

1. **Discovery**: The `Plugin` base class scans for methods decorated with `@hook` and `@tool`
2. **Hook Registration**: Each `@hook` method is registered with the agent's hook registry based on its event type hint
3. **Tool Registration**: Each `@tool` method is added to the agent's tools list
4. **Initialization**: The `init_plugin(agent)` method is called for any custom setup

```mermaid
flowchart TD
    A[Plugin Attached] --> B[Scan for @hook methods]
    A --> C[Scan for @tool methods]
    B --> D[Register hooks with agent]
    C --> E[Add tools to agent]
    D --> F[init_plugin called]
    E --> F
    F --> G[Plugin Ready]
```

### The `@hook` Decorator

The `@hook` decorator marks methods as hook callbacks. The event type is automatically inferred from the type hint:

=== "Python"

    ```python
    from strands.plugins import Plugin, hook
    from strands.hooks import BeforeModelCallEvent, AfterModelCallEvent

    class ModelMonitorPlugin(Plugin):
        name = "model-monitor"

        @hook
        def before_model(self, event: BeforeModelCallEvent) -> None:
            """Event type inferred from type hint."""
            print("Model call starting...")

        @hook
        def on_model_event(self, event: BeforeModelCallEvent | AfterModelCallEvent) -> None:
            """Handle multiple event types with a union."""
            print(f"Model event: {type(event).__name__}")
    ```

{{ ts_not_supported_code("Plugins are not yet available in TypeScript SDK") }}

### Manual Hook and Tool Registration

For more control, you can manually register hooks and tools in the `init_plugin` method:

=== "Python"

    ```python
    from strands.plugins import Plugin
    from strands.hooks import BeforeToolCallEvent

    class ManualPlugin(Plugin):
        name = "manual-plugin"

        def __init__(self, verbose: bool = False):
            super().__init__()
            self.verbose = verbose

        def init_plugin(self, agent: "Agent") -> None:
            # Call super to auto-register any @hook/@tool decorated methods
            super().init_plugin(agent)

            # Conditionally register additional hooks
            if self.verbose:
                agent.add_hook(self.verbose_log, BeforeToolCallEvent)

            # Access agent properties
            print(f"Attached to agent with {len(agent.tool_names)} tools")

        def verbose_log(self, event: BeforeToolCallEvent) -> None:
            print(f"[VERBOSE] {event.tool_use}")
    ```

{{ ts_not_supported_code("Plugins are not yet available in TypeScript SDK") }}

### Managing Plugin State

Plugins can maintain state across hook invocations:

=== "Python"

    ```python
    from strands.plugins import Plugin, hook
    from strands.hooks import BeforeToolCallEvent, AfterToolCallEvent
    import time

    class MetricsPlugin(Plugin):
        """Track tool execution metrics."""

        name = "metrics-plugin"

        def __init__(self):
            super().__init__()
            self.call_count = 0
            self.total_duration = 0.0
            self._start_times = {}

        @hook
        def start_timer(self, event: BeforeToolCallEvent) -> None:
            tool_use_id = event.tool_use.get("toolUseId")
            self._start_times[tool_use_id] = time.time()
            self.call_count += 1

        @hook
        def stop_timer(self, event: AfterToolCallEvent) -> None:
            tool_use_id = event.tool_use.get("toolUseId")
            if tool_use_id in self._start_times:
                duration = time.time() - self._start_times.pop(tool_use_id)
                self.total_duration += duration

        def get_stats(self) -> dict:
            return {
                "call_count": self.call_count,
                "total_duration": self.total_duration,
                "avg_duration": self.total_duration / self.call_count if self.call_count > 0 else 0
            }

    # Usage
    metrics = MetricsPlugin()
    agent = Agent(plugins=[metrics])
    agent("Do some work")
    print(metrics.get_stats())
    ```

{{ ts_not_supported_code("Plugins are not yet available in TypeScript SDK") }}

### Async Plugin Initialization

Plugins can perform asynchronous initialization:

=== "Python"

    ```python
    import asyncio
    from strands.plugins import Plugin, hook
    from strands.hooks import BeforeToolCallEvent

    class AsyncConfigPlugin(Plugin):
        name = "async-config"

        async def init_plugin(self, agent: "Agent") -> None:
            # Call super for auto-discovery
            await super().init_plugin(agent)

            # Async initialization
            self.config = await self.load_config()

        async def load_config(self) -> dict:
            await asyncio.sleep(0.1)  # Simulate async operation
            return {"setting": "value"}

        @hook
        def use_config(self, event: BeforeToolCallEvent) -> None:
            print(f"Config: {self.config}")
    ```

{{ ts_not_supported_code("Plugins are not yet available in TypeScript SDK") }}

## Distributing Plugins

### Package Structure

To distribute your plugin via PyPI:

```
my-strands-plugin/
├── pyproject.toml
├── README.md
└── src/
    └── my_plugin/
        ├── __init__.py
        └── plugin.py
```

### Example `pyproject.toml`

```toml
[project]
name = "my-strands-plugin"
version = "0.1.0"
dependencies = ["strands-agents>=0.1.0"]

[project.optional-dependencies]
dev = ["pytest"]
```

### Publishing

```bash
pip install build twine
python -m build
twine upload dist/*
```

Want to share your plugin with the community? See [Get Featured](../../../community/get-featured.md) for guidelines on contributing to the Strands ecosystem.

## Best Practices

### Naming

- Use descriptive, unique names: `"myorg-feature-plugin"`
- Keep names stable across versions

### Design

- **Single responsibility**: Each plugin should have one clear purpose
- **Use `@hook` decorator**: Prefer declarative registration when possible
- **Call `super().init_plugin(agent)`**: Preserve auto-discovery when overriding
- **Handle errors gracefully**: Don't let plugin failures crash the agent

### Performance

- Keep hook callbacks fast to avoid slowing down the agent loop
- Use async hooks for I/O-bound operations
- Avoid storing large amounts of data in plugin state

## Next Steps

- [Hooks](../agents/hooks.md) - Learn about the underlying hook system
- [Steering](../experimental/steering.md) - Explore the built-in steering plugin
- [Get Featured](../../../community/get-featured.md) - Share your plugins with the community
