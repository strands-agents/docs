# `strands.hooks`

Typed hook system for extending agent functionality.

This module provides a composable mechanism for building objects that can hook into specific events during the agent lifecycle. The hook system enables both built-in SDK components and user code to react to or modify agent behavior through strongly-typed event callbacks.

Example Usage

```
from strands.hooks import HookProvider, HookRegistry
from strands.hooks.events import StartRequestEvent, EndRequestEvent

class LoggingHooks(HookProvider):
    def register_hooks(self, registry: HookRegistry) -> None:
        registry.add_callback(StartRequestEvent, self.log_start)
        registry.add_callback(EndRequestEvent, self.log_end)

    def log_start(self, event: StartRequestEvent) -> None:
        print(f"Request started for {event.agent.name}")

    def log_end(self, event: EndRequestEvent) -> None:
        print(f"Request completed for {event.agent.name}")

# Use with agent
agent = Agent(hooks=[LoggingHooks()])

```

This replaces the older callback_handler approach with a more composable, type-safe system that supports multiple subscribers per event type.

## `strands.hooks.events`

Hook events emitted as part of invoking Agents.

This module defines the events that are emitted as Agents run through the lifecycle of a request.

### `AfterInvocationEvent`

Bases: `HookEvent`

Event triggered at the end of an agent request.

This event is fired after the agent has completed processing a request, regardless of whether it completed successfully or encountered an error. Hook providers can use this event for cleanup, logging, or state persistence.

Note: This event uses reverse callback ordering, meaning callbacks registered later will be invoked first during cleanup.

This event is triggered at the end of the following api calls

- Agent.**call**
- Agent.stream_async
- Agent.structured_output

Source code in `strands/hooks/events.py`

```
@dataclass
class AfterInvocationEvent(HookEvent):
    """Event triggered at the end of an agent request.

    This event is fired after the agent has completed processing a request,
    regardless of whether it completed successfully or encountered an error.
    Hook providers can use this event for cleanup, logging, or state persistence.

    Note: This event uses reverse callback ordering, meaning callbacks registered
    later will be invoked first during cleanup.

    This event is triggered at the end of the following api calls:
      - Agent.__call__
      - Agent.stream_async
      - Agent.structured_output
    """

    @property
    def should_reverse_callbacks(self) -> bool:
        """True to invoke callbacks in reverse order."""
        return True

```

#### `should_reverse_callbacks`

True to invoke callbacks in reverse order.

### `AgentInitializedEvent`

Bases: `HookEvent`

Event triggered when an agent has finished initialization.

This event is fired after the agent has been fully constructed and all built-in components have been initialized. Hook providers can use this event to perform setup tasks that require a fully initialized agent.

Source code in `strands/hooks/events.py`

```
@dataclass
class AgentInitializedEvent(HookEvent):
    """Event triggered when an agent has finished initialization.

    This event is fired after the agent has been fully constructed and all
    built-in components have been initialized. Hook providers can use this
    event to perform setup tasks that require a fully initialized agent.
    """

    pass

```

### `BeforeInvocationEvent`

Bases: `HookEvent`

Event triggered at the beginning of a new agent request.

This event is fired before the agent begins processing a new user request, before any model inference or tool execution occurs. Hook providers can use this event to perform request-level setup, logging, or validation.

This event is triggered at the beginning of the following api calls

- Agent.**call**
- Agent.stream_async
- Agent.structured_output

Source code in `strands/hooks/events.py`

```
@dataclass
class BeforeInvocationEvent(HookEvent):
    """Event triggered at the beginning of a new agent request.

    This event is fired before the agent begins processing a new user request,
    before any model inference or tool execution occurs. Hook providers can
    use this event to perform request-level setup, logging, or validation.

    This event is triggered at the beginning of the following api calls:
      - Agent.__call__
      - Agent.stream_async
      - Agent.structured_output
    """

    pass

```

### `MessageAddedEvent`

Bases: `HookEvent`

Event triggered when a message is added to the agent's conversation.

This event is fired whenever the agent adds a new message to its internal message history, including user messages, assistant responses, and tool results. Hook providers can use this event for logging, monitoring, or implementing custom message processing logic.

Note: This event is only triggered for messages added by the framework itself, not for messages manually added by tools or external code.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `message` | `Message` | The message that was added to the conversation history. |

Source code in `strands/hooks/events.py`

```
@dataclass
class MessageAddedEvent(HookEvent):
    """Event triggered when a message is added to the agent's conversation.

    This event is fired whenever the agent adds a new message to its internal
    message history, including user messages, assistant responses, and tool
    results. Hook providers can use this event for logging, monitoring, or
    implementing custom message processing logic.

    Note: This event is only triggered for messages added by the framework
    itself, not for messages manually added by tools or external code.

    Attributes:
        message: The message that was added to the conversation history.
    """

    message: Message

```

## `strands.hooks.registry`

Hook registry system for managing event callbacks in the Strands Agent SDK.

This module provides the core infrastructure for the typed hook system, enabling composable extension of agent functionality through strongly-typed event callbacks. The registry manages the mapping between event types and their associated callback functions, supporting both individual callback registration and bulk registration via hook provider objects.

### `TEvent = TypeVar('TEvent', bound=HookEvent, contravariant=True)`

Generic for adding callback handlers - contravariant to allow adding handlers which take in base classes.

### `TInvokeEvent = TypeVar('TInvokeEvent', bound=HookEvent)`

Generic for invoking events - non-contravariant to enable returning events.

### `HookCallback`

Bases: `Protocol`, `Generic[TEvent]`

Protocol for callback functions that handle hook events.

Hook callbacks are functions that receive a single strongly-typed event argument and perform some action in response. They should not return values and any exceptions they raise will propagate to the caller.

Example

```
def my_callback(event: StartRequestEvent) -> None:
    print(f"Request started for agent: {event.agent.name}")

```

Source code in `strands/hooks/registry.py`

````
class HookCallback(Protocol, Generic[TEvent]):
    """Protocol for callback functions that handle hook events.

    Hook callbacks are functions that receive a single strongly-typed event
    argument and perform some action in response. They should not return
    values and any exceptions they raise will propagate to the caller.

    Example:
        ```python
        def my_callback(event: StartRequestEvent) -> None:
            print(f"Request started for agent: {event.agent.name}")
        ```
    """

    def __call__(self, event: TEvent) -> None:
        """Handle a hook event.

        Args:
            event: The strongly-typed event to handle.
        """
        ...

````

#### `__call__(event)`

Handle a hook event.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `TEvent` | The strongly-typed event to handle. | *required* |

Source code in `strands/hooks/registry.py`

```
def __call__(self, event: TEvent) -> None:
    """Handle a hook event.

    Args:
        event: The strongly-typed event to handle.
    """
    ...

```

### `HookEvent`

Base class for all hook events.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `agent` | `Agent` | The agent instance that triggered this event. |

Source code in `strands/hooks/registry.py`

```
@dataclass
class HookEvent:
    """Base class for all hook events.

    Attributes:
        agent: The agent instance that triggered this event.
    """

    agent: "Agent"

    @property
    def should_reverse_callbacks(self) -> bool:
        """Determine if callbacks for this event should be invoked in reverse order.

        Returns:
            False by default. Override to return True for events that should
            invoke callbacks in reverse order (e.g., cleanup/teardown events).
        """
        return False

    def _can_write(self, name: str) -> bool:
        """Check if the given property can be written to.

        Args:
            name: The name of the property to check.

        Returns:
            True if the property can be written to, False otherwise.
        """
        return False

    def __post_init__(self) -> None:
        """Disallow writes to non-approved properties."""
        # This is needed as otherwise the class can't be initialized at all, so we trigger
        # this after class initialization
        super().__setattr__("_disallow_writes", True)

    def __setattr__(self, name: str, value: Any) -> None:
        """Prevent setting attributes on hook events.

        Raises:
            AttributeError: Always raised to prevent setting attributes on hook events.
        """
        #  Allow setting attributes:
        #    - during init (when __dict__) doesn't exist
        #    - if the subclass specifically said the property is writable
        if not hasattr(self, "_disallow_writes") or self._can_write(name):
            return super().__setattr__(name, value)

        raise AttributeError(f"Property {name} is not writable")

```

#### `should_reverse_callbacks`

Determine if callbacks for this event should be invoked in reverse order.

Returns:

| Type | Description | | --- | --- | | `bool` | False by default. Override to return True for events that should | | `bool` | invoke callbacks in reverse order (e.g., cleanup/teardown events). |

#### `__post_init__()`

Disallow writes to non-approved properties.

Source code in `strands/hooks/registry.py`

```
def __post_init__(self) -> None:
    """Disallow writes to non-approved properties."""
    # This is needed as otherwise the class can't be initialized at all, so we trigger
    # this after class initialization
    super().__setattr__("_disallow_writes", True)

```

#### `__setattr__(name, value)`

Prevent setting attributes on hook events.

Raises:

| Type | Description | | --- | --- | | `AttributeError` | Always raised to prevent setting attributes on hook events. |

Source code in `strands/hooks/registry.py`

```
def __setattr__(self, name: str, value: Any) -> None:
    """Prevent setting attributes on hook events.

    Raises:
        AttributeError: Always raised to prevent setting attributes on hook events.
    """
    #  Allow setting attributes:
    #    - during init (when __dict__) doesn't exist
    #    - if the subclass specifically said the property is writable
    if not hasattr(self, "_disallow_writes") or self._can_write(name):
        return super().__setattr__(name, value)

    raise AttributeError(f"Property {name} is not writable")

```

### `HookProvider`

Bases: `Protocol`

Protocol for objects that provide hook callbacks to an agent.

Hook providers offer a composable way to extend agent functionality by subscribing to various events in the agent lifecycle. This protocol enables building reusable components that can hook into agent events.

Example

```
class MyHookProvider(HookProvider):
    def register_hooks(self, registry: HookRegistry) -> None:
        registry.add_callback(StartRequestEvent, self.on_request_start)
        registry.add_callback(EndRequestEvent, self.on_request_end)

agent = Agent(hooks=[MyHookProvider()])

```

Source code in `strands/hooks/registry.py`

````
class HookProvider(Protocol):
    """Protocol for objects that provide hook callbacks to an agent.

    Hook providers offer a composable way to extend agent functionality by
    subscribing to various events in the agent lifecycle. This protocol enables
    building reusable components that can hook into agent events.

    Example:
        ```python
        class MyHookProvider(HookProvider):
            def register_hooks(self, registry: HookRegistry) -> None:
                registry.add_callback(StartRequestEvent, self.on_request_start)
                registry.add_callback(EndRequestEvent, self.on_request_end)

        agent = Agent(hooks=[MyHookProvider()])
        ```
    """

    def register_hooks(self, registry: "HookRegistry", **kwargs: Any) -> None:
        """Register callback functions for specific event types.

        Args:
            registry: The hook registry to register callbacks with.
            **kwargs: Additional keyword arguments for future extensibility.
        """
        ...

````

#### `register_hooks(registry, **kwargs)`

Register callback functions for specific event types.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `registry` | `HookRegistry` | The hook registry to register callbacks with. | *required* | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Source code in `strands/hooks/registry.py`

```
def register_hooks(self, registry: "HookRegistry", **kwargs: Any) -> None:
    """Register callback functions for specific event types.

    Args:
        registry: The hook registry to register callbacks with.
        **kwargs: Additional keyword arguments for future extensibility.
    """
    ...

```

### `HookRegistry`

Registry for managing hook callbacks associated with event types.

The HookRegistry maintains a mapping of event types to callback functions and provides methods for registering callbacks and invoking them when events occur.

The registry handles callback ordering, including reverse ordering for cleanup events, and provides type-safe event dispatching.

Source code in `strands/hooks/registry.py`

````
class HookRegistry:
    """Registry for managing hook callbacks associated with event types.

    The HookRegistry maintains a mapping of event types to callback functions
    and provides methods for registering callbacks and invoking them when
    events occur.

    The registry handles callback ordering, including reverse ordering for
    cleanup events, and provides type-safe event dispatching.
    """

    def __init__(self) -> None:
        """Initialize an empty hook registry."""
        self._registered_callbacks: dict[Type, list[HookCallback]] = {}

    def add_callback(self, event_type: Type[TEvent], callback: HookCallback[TEvent]) -> None:
        """Register a callback function for a specific event type.

        Args:
            event_type: The class type of events this callback should handle.
            callback: The callback function to invoke when events of this type occur.

        Example:
            ```python
            def my_handler(event: StartRequestEvent):
                print("Request started")

            registry.add_callback(StartRequestEvent, my_handler)
            ```
        """
        callbacks = self._registered_callbacks.setdefault(event_type, [])
        callbacks.append(callback)

    def add_hook(self, hook: HookProvider) -> None:
        """Register all callbacks from a hook provider.

        This method allows bulk registration of callbacks by delegating to
        the hook provider's register_hooks method. This is the preferred
        way to register multiple related callbacks.

        Args:
            hook: The hook provider containing callbacks to register.

        Example:
            ```python
            class MyHooks(HookProvider):
                def register_hooks(self, registry: HookRegistry):
                    registry.add_callback(StartRequestEvent, self.on_start)
                    registry.add_callback(EndRequestEvent, self.on_end)

            registry.add_hook(MyHooks())
            ```
        """
        hook.register_hooks(self)

    def invoke_callbacks(self, event: TInvokeEvent) -> TInvokeEvent:
        """Invoke all registered callbacks for the given event.

        This method finds all callbacks registered for the event's type and
        invokes them in the appropriate order. For events with should_reverse_callbacks=True,
        callbacks are invoked in reverse registration order. Any exceptions raised by callback
        functions will propagate to the caller.

        Args:
            event: The event to dispatch to registered callbacks.

        Returns:
            The event dispatched to registered callbacks.

        Example:
            ```python
            event = StartRequestEvent(agent=my_agent)
            registry.invoke_callbacks(event)
            ```
        """
        for callback in self.get_callbacks_for(event):
            callback(event)

        return event

    def has_callbacks(self) -> bool:
        """Check if the registry has any registered callbacks.

        Returns:
            True if there are any registered callbacks, False otherwise.

        Example:
            ```python
            if registry.has_callbacks():
                print("Registry has callbacks registered")
            ```
        """
        return bool(self._registered_callbacks)

    def get_callbacks_for(self, event: TEvent) -> Generator[HookCallback[TEvent], None, None]:
        """Get callbacks registered for the given event in the appropriate order.

        This method returns callbacks in registration order for normal events,
        or reverse registration order for events that have should_reverse_callbacks=True.
        This enables proper cleanup ordering for teardown events.

        Args:
            event: The event to get callbacks for.

        Yields:
            Callback functions registered for this event type, in the appropriate order.

        Example:
            ```python
            event = EndRequestEvent(agent=my_agent)
            for callback in registry.get_callbacks_for(event):
                callback(event)
            ```
        """
        event_type = type(event)

        callbacks = self._registered_callbacks.get(event_type, [])
        if event.should_reverse_callbacks:
            yield from reversed(callbacks)
        else:
            yield from callbacks

````

#### `__init__()`

Initialize an empty hook registry.

Source code in `strands/hooks/registry.py`

```
def __init__(self) -> None:
    """Initialize an empty hook registry."""
    self._registered_callbacks: dict[Type, list[HookCallback]] = {}

```

#### `add_callback(event_type, callback)`

Register a callback function for a specific event type.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event_type` | `Type[TEvent]` | The class type of events this callback should handle. | *required* | | `callback` | `HookCallback[TEvent]` | The callback function to invoke when events of this type occur. | *required* |

Example

```
def my_handler(event: StartRequestEvent):
    print("Request started")

registry.add_callback(StartRequestEvent, my_handler)

```

Source code in `strands/hooks/registry.py`

````
def add_callback(self, event_type: Type[TEvent], callback: HookCallback[TEvent]) -> None:
    """Register a callback function for a specific event type.

    Args:
        event_type: The class type of events this callback should handle.
        callback: The callback function to invoke when events of this type occur.

    Example:
        ```python
        def my_handler(event: StartRequestEvent):
            print("Request started")

        registry.add_callback(StartRequestEvent, my_handler)
        ```
    """
    callbacks = self._registered_callbacks.setdefault(event_type, [])
    callbacks.append(callback)

````

#### `add_hook(hook)`

Register all callbacks from a hook provider.

This method allows bulk registration of callbacks by delegating to the hook provider's register_hooks method. This is the preferred way to register multiple related callbacks.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `hook` | `HookProvider` | The hook provider containing callbacks to register. | *required* |

Example

```
class MyHooks(HookProvider):
    def register_hooks(self, registry: HookRegistry):
        registry.add_callback(StartRequestEvent, self.on_start)
        registry.add_callback(EndRequestEvent, self.on_end)

registry.add_hook(MyHooks())

```

Source code in `strands/hooks/registry.py`

````
def add_hook(self, hook: HookProvider) -> None:
    """Register all callbacks from a hook provider.

    This method allows bulk registration of callbacks by delegating to
    the hook provider's register_hooks method. This is the preferred
    way to register multiple related callbacks.

    Args:
        hook: The hook provider containing callbacks to register.

    Example:
        ```python
        class MyHooks(HookProvider):
            def register_hooks(self, registry: HookRegistry):
                registry.add_callback(StartRequestEvent, self.on_start)
                registry.add_callback(EndRequestEvent, self.on_end)

        registry.add_hook(MyHooks())
        ```
    """
    hook.register_hooks(self)

````

#### `get_callbacks_for(event)`

Get callbacks registered for the given event in the appropriate order.

This method returns callbacks in registration order for normal events, or reverse registration order for events that have should_reverse_callbacks=True. This enables proper cleanup ordering for teardown events.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `TEvent` | The event to get callbacks for. | *required* |

Yields:

| Type | Description | | --- | --- | | `HookCallback[TEvent]` | Callback functions registered for this event type, in the appropriate order. |

Example

```
event = EndRequestEvent(agent=my_agent)
for callback in registry.get_callbacks_for(event):
    callback(event)

```

Source code in `strands/hooks/registry.py`

````
def get_callbacks_for(self, event: TEvent) -> Generator[HookCallback[TEvent], None, None]:
    """Get callbacks registered for the given event in the appropriate order.

    This method returns callbacks in registration order for normal events,
    or reverse registration order for events that have should_reverse_callbacks=True.
    This enables proper cleanup ordering for teardown events.

    Args:
        event: The event to get callbacks for.

    Yields:
        Callback functions registered for this event type, in the appropriate order.

    Example:
        ```python
        event = EndRequestEvent(agent=my_agent)
        for callback in registry.get_callbacks_for(event):
            callback(event)
        ```
    """
    event_type = type(event)

    callbacks = self._registered_callbacks.get(event_type, [])
    if event.should_reverse_callbacks:
        yield from reversed(callbacks)
    else:
        yield from callbacks

````

#### `has_callbacks()`

Check if the registry has any registered callbacks.

Returns:

| Type | Description | | --- | --- | | `bool` | True if there are any registered callbacks, False otherwise. |

Example

```
if registry.has_callbacks():
    print("Registry has callbacks registered")

```

Source code in `strands/hooks/registry.py`

````
def has_callbacks(self) -> bool:
    """Check if the registry has any registered callbacks.

    Returns:
        True if there are any registered callbacks, False otherwise.

    Example:
        ```python
        if registry.has_callbacks():
            print("Registry has callbacks registered")
        ```
    """
    return bool(self._registered_callbacks)

````

#### `invoke_callbacks(event)`

Invoke all registered callbacks for the given event.

This method finds all callbacks registered for the event's type and invokes them in the appropriate order. For events with should_reverse_callbacks=True, callbacks are invoked in reverse registration order. Any exceptions raised by callback functions will propagate to the caller.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `TInvokeEvent` | The event to dispatch to registered callbacks. | *required* |

Returns:

| Type | Description | | --- | --- | | `TInvokeEvent` | The event dispatched to registered callbacks. |

Example

```
event = StartRequestEvent(agent=my_agent)
registry.invoke_callbacks(event)

```

Source code in `strands/hooks/registry.py`

````
def invoke_callbacks(self, event: TInvokeEvent) -> TInvokeEvent:
    """Invoke all registered callbacks for the given event.

    This method finds all callbacks registered for the event's type and
    invokes them in the appropriate order. For events with should_reverse_callbacks=True,
    callbacks are invoked in reverse registration order. Any exceptions raised by callback
    functions will propagate to the caller.

    Args:
        event: The event to dispatch to registered callbacks.

    Returns:
        The event dispatched to registered callbacks.

    Example:
        ```python
        event = StartRequestEvent(agent=my_agent)
        registry.invoke_callbacks(event)
        ```
    """
    for callback in self.get_callbacks_for(event):
        callback(event)

    return event

````
