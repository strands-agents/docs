Steering context protocols for contextual guidance.

Defines protocols for context callbacks and providers that populate steering context data used by handlers to make guidance decisions.

Architecture: SteeringContextCallback → Handler.steering\_context → SteeringHandler.steer() ↓ ↓ ↓ Update local context Store in handler Access via self.steering\_context

Context lifecycle:

1.  Handler registers context callbacks for hook events
2.  Callbacks update handler’s local steering\_context on events
3.  Handler accesses self.steering\_context in steer() method
4.  Context persists across calls within handler instance

Implementation: Each handler maintains its own JSONSerializableDict context. Callbacks are registered per handler instance for isolation. Providers can supply multiple callbacks for different events.

## SteeringContext

```python
@dataclass
class SteeringContext()
```

Defined in: [src/strands/vended\_plugins/steering/core/context.py:35](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/core/context.py#L35)

Container for steering context data.

## SteeringContextCallback

```python
class SteeringContextCallback(ABC, Generic[EventType])
```

Defined in: [src/strands/vended\_plugins/steering/core/context.py:49](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/core/context.py#L49)

Abstract base class for steering context update callbacks.

#### event\_type

```python
@property
def event_type() -> type[HookEvent]
```

Defined in: [src/strands/vended\_plugins/steering/core/context.py:53](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/core/context.py#L53)

Return the event type this callback handles.

#### \_\_call\_\_

```python
def __call__(event: EventType, steering_context: "SteeringContext",
             **kwargs: Any) -> None
```

Defined in: [src/strands/vended\_plugins/steering/core/context.py:60](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/core/context.py#L60)

Update steering context based on hook event.

**Arguments**:

-   `event` - The hook event that triggered the callback
-   `steering_context` - The steering context to update
-   `**kwargs` - Additional keyword arguments for context updates

## SteeringContextProvider

```python
class SteeringContextProvider(ABC)
```

Defined in: [src/strands/vended\_plugins/steering/core/context.py:71](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/core/context.py#L71)

Abstract base class for context providers that handle multiple event types.

#### context\_providers

```python
@abstractmethod
def context_providers(**kwargs: Any) -> list[SteeringContextCallback]
```

Defined in: [src/strands/vended\_plugins/steering/core/context.py:75](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/steering/core/context.py#L75)

Return list of context callbacks with event types extracted from generics.