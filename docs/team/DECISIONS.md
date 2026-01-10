# Decision Record

A record of design and API decisions with their rationale, enabling prior decisions to guide future ones.

## Hooks as Low-Level Primitives, Not High-Level Abstractions

**Date**: Jan 6, 2026

### Decision

Hooks serve as low-level extensibility primitives for the agent loop. High-level constructs SHOULD be built on top of hooks but MUST NOT expose `HookProvider` as the developer-facing interface.

### Rationale

Exposing `HookProvider` directly to consumers adds complexity to the implementor while offering no guidance on implementation requirements or type safety for specific use cases.

For example, an Agent-provided `retry_strategy` should not be implemented as:

```python
def Agent.__init__(
    ...
    retry_strategy: HookProvider
)
```

This is too low-level and gives no guidance on how a retry strategy should be implemented. Instead, a specific interface or base class should be built on top of hooks, providing additional scaffolding:

```python
class RetryStrategy(HookProvider):
  
    def register_hooks(registry):
        ...
    
    @abstractmethod
    def should_retry_model(e: Exception) -> bool:
        """Return true if the model call should be retried based on this exception"""
        ...
    
    def calculate_retry_delay(attempt: int) -> int:
        ...
```

Higher-level abstractions require additional interface definitions, but this tradeoff provides an improved developer experience through explicit contracts. Developers with edge cases can still drop to raw `HookProvider` (and `agent.hooks`) when needed — optimizing for the common path is worth that escape hatch.