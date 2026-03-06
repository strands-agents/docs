Ledger context provider for comprehensive agent activity tracking.

Tracks complete agent activity ledger including tool calls, conversation history, and timing information. This comprehensive audit trail enables steering handlers to make informed guidance decisions based on agent behavior patterns and history.

Data captured:

-   Tool call history with inputs, outputs, timing, success/failure
-   Conversation messages and agent responses
-   Session metadata and timing information
-   Error patterns and recovery attempts

Usage: Use as context provider functions or mix into steering handlers.

## LedgerBeforeToolCall

```python
class LedgerBeforeToolCall(SteeringContextCallback[BeforeToolCallEvent])
```

Defined in: [src/strands/experimental/steering/context\_providers/ledger\_provider.py:28](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/steering/context_providers/ledger_provider.py#L28)

Context provider for ledger tracking before tool calls.

#### \_\_init\_\_

```python
def __init__() -> None
```

Defined in: [src/strands/experimental/steering/context\_providers/ledger\_provider.py:31](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/steering/context_providers/ledger_provider.py#L31)

Initialize the ledger provider.

#### \_\_call\_\_

```python
def __call__(event: BeforeToolCallEvent, steering_context: SteeringContext,
             **kwargs: Any) -> None
```

Defined in: [src/strands/experimental/steering/context\_providers/ledger\_provider.py:35](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/steering/context_providers/ledger_provider.py#L35)

Update ledger before tool call.

## LedgerAfterToolCall

```python
class LedgerAfterToolCall(SteeringContextCallback[AfterToolCallEvent])
```

Defined in: [src/strands/experimental/steering/context\_providers/ledger\_provider.py:58](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/steering/context_providers/ledger_provider.py#L58)

Context provider for ledger tracking after tool calls.

#### \_\_call\_\_

```python
def __call__(event: AfterToolCallEvent, steering_context: SteeringContext,
             **kwargs: Any) -> None
```

Defined in: [src/strands/experimental/steering/context\_providers/ledger\_provider.py:61](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/steering/context_providers/ledger_provider.py#L61)

Update ledger after tool call.

## LedgerProvider

```python
class LedgerProvider(SteeringContextProvider)
```

Defined in: [src/strands/experimental/steering/context\_providers/ledger\_provider.py:83](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/steering/context_providers/ledger_provider.py#L83)

Combined ledger context provider for both before and after tool calls.

#### context\_providers

```python
def context_providers(**kwargs: Any) -> list[SteeringContextCallback]
```

Defined in: [src/strands/experimental/steering/context\_providers/ledger\_provider.py:86](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/steering/context_providers/ledger_provider.py#L86)

Return ledger context providers with shared state.