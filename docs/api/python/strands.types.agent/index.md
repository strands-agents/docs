Agent-related type definitions for the SDK.

This module defines the types used for an Agent.

## ConcurrentInvocationMode

```python
class ConcurrentInvocationMode(str, Enum)
```

Defined in: [src/strands/types/agent.py:15](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/agent.py#L15)

Mode controlling concurrent invocation behavior.

Values: THROW: Raises ConcurrencyException if concurrent invocation is attempted (default). UNSAFE\_REENTRANT: Allows concurrent invocations without locking.

**Warnings**:

The `UNSAFE_REENTRANT` mode makes no guarantees about resulting behavior and is provided only for advanced use cases where the caller understands the risks.