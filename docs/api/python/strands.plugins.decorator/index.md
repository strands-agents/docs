Hook decorator for Plugin methods.

Marks methods as hook callbacks for automatic registration when the plugin is attached to an agent. Infers event types from type hints and supports union types for multiple events.

**Example**:

```python
class MyPlugin(Plugin):
    @hook
    def on_model_call(self, event: BeforeModelCallEvent):
        print(event)
```

#### hook

```python
def hook(
    func: HookCallback | None = None
) -> _WrappedHookCallable | Callable[[HookCallback], _WrappedHookCallable]
```

Defined in: [src/strands/plugins/decorator.py:39](https://github.com/strands-agents/sdk-python/blob/main/src/strands/plugins/decorator.py#L39)

Mark a method as a hook callback for automatic registration.

Infers event type from the callback’s type hint. Supports union types for multiple events. Can be used as @hook or @hook().

**Arguments**:

-   `func` - The function to decorate.

**Returns**:

The decorated function with hook metadata.

**Raises**:

-   `ValueError` - If event type cannot be inferred from type hints.