# Decision Record

A record of design and API decisions with their rationale, enabling prior decisions to guide future ones.

## Hooks as Low-Level Primitives, Not High-Level Abstractions

**Date**: Jan 6, 2026

### Decision

Hooks serve as low-level extensibility primitives for the agent loop. High-level constructs SHOULD be built on top of hooks rather than exposing `HookProvider` as the sole developer-facing interface. These higher-level constructs should define their own interface with domain-specific methods and type signatures beyond what `HookProvider` alone provides.

### Rationale

Exposing only `HookProvider` directly to consumers adds complexity to the implementor while offering no guidance on implementation requirements or type safety for specific use cases.

For example, an Agent-provided `retry_strategy` should **not** be implemented as:

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

Higher-level abstractions require additional interface definitions, but this tradeoff provides an improved developer experience through explicit contracts. Developers with edge cases can still drop to raw `HookProvider` (and `agent.hooks`) when needed — optimizing for the common path while preserving that escape hatch.


## Prefer Flat Namespaces Over Nested Modules

**Date**: Jan 16, 2026

### Decision

Public APIs should expose commonly-used functionality through flat, top-level namespaces rather than requiring users to import from deeply nested module paths.

### Rationale

Fewer imports are simpler to use and more discoverable when using IDE autocompletion & documentation. While inspired by Python's "Flat is better than nested" (PEP 20 - The Zen of Python), this principle applies across SDK languages.

We don't want users continually importing additional modules for common functionality. The goal is to optimize for the 80% case where users need standard features, while still allowing advanced users to import from specific submodules when needed.

For example, we prefer exporting all hook events from a single module:

```python
from strands.hooks import MultiAgentInitializedEvent
```

instead of categorizing them based on their purpose

```python
from strands.hooks.multiagent import MultiAgentInitializedEvent
```

this is even more important when the event names already indicate their grouping (**MultiAgent**InitializeEvent). 

Internal module organization can remain nested for code maintainability — the key is re-exporting public symbols at common locations.
