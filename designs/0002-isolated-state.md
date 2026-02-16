# Isolated State

**Status**: Proposed

**Date**: 2026-02-16

**Issue**: N/A

## Context

Today, the `Agent` class stores all mutable per-invocation state as instance fields. A few examples include:

- `messages` — conversation history
- `state` (AgentState) — user-facing key-value state
- `event_loop_metrics` — token usage and performance metrics
- `trace_span` — the current OpenTelemetry trace span
- `_interrupt_state` — interrupt tracking

Because this state lives directly on the agent instance, two concurrent invocations would corrupt each other's data. The SDK prevents this with a `threading.Lock` that raises `ConcurrencyException` if a second call arrives while the first is still running:

```python
# From agent.py stream_async
acquired = self._invocation_lock.acquire(blocking=False)
if not acquired:
    raise ConcurrencyException(
        "Agent is already processing a request. Concurrent invocations are not supported."
    )
```

### The problem in practice

A simple concurrent use case fails today:

```python
import asyncio
from strands import Agent

agent = Agent(system_prompt="You are a helpful assistant.")

async def main():
    # This raises ConcurrencyException on the second call
    results = await asyncio.gather(
        agent.invoke_async("Summarize the Python GIL"),
        agent.invoke_async("Summarize the Rust borrow checker"),
    )

asyncio.run(main())
```

### The workaround is verbose and limiting

To get around this today, users must create separate agent instances:

```python
import asyncio
from strands import Agent

def make_agent():
    return Agent(
        model=my_model,
        tools=[tool_a, tool_b],
        system_prompt="You are a helpful assistant.",
    )

async def main():
    results = await asyncio.gather(
        make_agent().invoke_async("Summarize the Python GIL"),
        make_agent().invoke_async("Summarize the Rust borrow checker"),
    )

asyncio.run(main())
```

This works for simple scripts, but breaks down anywhere a function accepts an agent instance directly. The factory-function pattern can't help when the caller expects a pre-configured agent. `Graph.add_node` is one example — it takes an agent instance, and it validates that each node has a unique instance:

```python
# From graph.py _validate_node_executor
if id(executor) in seen_instances:
    raise ValueError("Duplicate node instance detected. Each node must have a unique object instance.")
```

If you have a generic agent (e.g., a summarizer) that you want to reuse across multiple graph nodes, you can't. You must create separate instances with identical configuration:

```python
from strands import Agent
from strands.multiagent.graph import GraphBuilder

summarizer_config = dict(
    model=my_model,
    tools=[summarize_tool],
    system_prompt="You are a summarizer.",
)

graph = GraphBuilder()
# Must create separate instances even though they're identical
graph.add_node(Agent(**summarizer_config), node_id="summarize_a")
graph.add_node(Agent(**summarizer_config), node_id="summarize_b")
```

This goes against the SDK's goal of building agents in just a few lines of code.

### State reset is fragile

Any code that needs to reset an agent to a clean state must manually reach into its internals and know which fields to clear. This is error-prone — if the agent gains new stateful fields in the future, every reset site must be updated or it silently leaks state between executions.

The graph implementation is a good example of this:

```python
# From graph.py GraphNode.reset_executor_state
def reset_executor_state(self) -> None:
    if hasattr(self.executor, "messages"):
        self.executor.messages = copy.deepcopy(self._initial_messages)

    if hasattr(self.executor, "state"):
        self.executor.state = AgentState(self._initial_state.get())

    self.execution_status = Status.PENDING
    self.result = None
```

It deep-copies initial state at construction time and manually resets specific fields. This pattern would need to be replicated anywhere else that needs to reset agent state.

## Decision

Consider making `Agent` stateless by extracting all per-invocation mutable state into an isolated state object, managed through a session manager and keyed by an invocation key.

### Isolated invocation state

One approach would be to move all mutable state out of the agent instance and into a per-invocation state object:

```python
class InvocationState:
    """All mutable state for a single agent invocation."""
    messages: Messages
    agent_state: AgentState
    event_loop_metrics: EventLoopMetrics
    trace_span: trace_api.Span | None
    interrupt_state: _InterruptState
```

The agent instance would retain only configuration: model, tools, system prompt, hooks, callback handler, conversation manager, etc. In the future, configuration could also be extracted into its own isolated object to allow per-invocation overrides, but this document focuses on invocation state to highlight the core problem and start the discussion.

### Session manager provides state

At invocation time, the agent could read state from a session manager using an invocation key:

```python
# Pseudo-code for agent.stream_async
async def stream_async(self, prompt, *, invocation_key=None, **kwargs):
    # Resolve the invocation key
    key = invocation_key or self._default_invocation_key

    # Load isolated state from session manager
    invocation_state = await self.session_manager.load(key)

    # Run the event loop against the isolated state (not self)
    async for event in self._run_loop(invocation_state, prompt, **kwargs):
        yield event

    # Persist state back
    await self.session_manager.save(key, invocation_state)
```

Because each invocation would operate on its own state object, there would be no shared mutable state on the agent. The `threading.Lock` and `ConcurrencyException` would no longer be needed.

### Default behavior could preserve backwards compatibility

One idea is to introduce a default in-memory session manager. Each agent instance would get a default invocation key that is stable across calls:

```python
class InMemorySessionManager(SessionManager):
    """Stores state in memory, keyed by invocation key."""

    def __init__(self):
        self._store: dict[str, InvocationState] = {}

    async def load(self, key: str) -> InvocationState:
        if key not in self._store:
            self._store[key] = InvocationState()
        return self._store[key]

    async def save(self, key: str, state: InvocationState) -> None:
        self._store[key] = state
```

When no invocation key is supplied, the agent would use a default key tied to the instance. This would mean:

- Sequential calls accumulate conversation history, just like today.
- A single agent instance with no invocation key behaves identically to the current implementation.
- No code changes required for existing users.

### Concurrent usage with invocation keys

Users who want concurrency could supply distinct invocation keys:

```python
import asyncio
from strands import Agent

agent = Agent(system_prompt="You are a helpful assistant.")

async def main():
    results = await asyncio.gather(
        agent.invoke_async("Summarize the Python GIL", invocation_key="task-1"),
        agent.invoke_async("Summarize the Rust borrow checker", invocation_key="task-2"),
    )

asyncio.run(main())
```

Each key would get its own isolated messages, agent state, metrics, and trace span. No lock contention, no `ConcurrencyException`.

### Graph could become simpler

With isolated state, graph nodes could reuse the same agent instance. The graph would pass a unique invocation key per node execution:

```python
from strands import Agent
from strands.multiagent.graph import GraphBuilder

summarizer = Agent(
    model=my_model,
    tools=[summarize_tool],
    system_prompt="You are a summarizer.",
)

graph = GraphBuilder()
# Same instance, different invocation keys per execution
graph.add_node(summarizer, node_id="summarize_a")
graph.add_node(summarizer, node_id="summarize_b")
```

The `_validate_node_executor` duplicate-instance check would no longer be needed. `GraphNode.reset_executor_state` could be removed — each execution would start with a fresh invocation state loaded from the session manager. No more deep-copying initial state, no more manually resetting fields, and no risk of missing new stateful fields in the future.

## Developer Experience

### Basic usage (unchanged)

```python
from strands import Agent

agent = Agent(system_prompt="You are a helpful assistant.")
result = agent("Hello!")        # Uses default invocation key
result = agent("Follow up")    # Same key, conversation continues
```

### Concurrent usage

```python
import asyncio
from strands import Agent

agent = Agent(system_prompt="You are a helpful assistant.")

async def handle_request(user_id: str, message: str):
    return await agent.invoke_async(message, invocation_key=user_id)

async def main():
    results = await asyncio.gather(
        handle_request("user-1", "What is Python?"),
        handle_request("user-2", "What is Rust?"),
    )
```

### State reset

Rather than reaching into agent internals:

```python
# Today: manually reset individual fields
agent.messages = []
agent.state = AgentState()
```

State could be cleared through the session manager:

```python
# Proposed: clear state for a given invocation key
await agent.session_manager.clear(invocation_key)
```

## Consequences

### What could become easier

- Concurrent agent usage with a single instance
- Resetting or clearing agent state without reaching into internals
- Adding new stateful fields without updating reset logic in graph or other consumers
- Serving multiple users/conversations from a single agent instance

### What could become harder or change

- Internal code that currently reads `self.messages` or `self.state` would need to be updated to read from the invocation state object
  - For example, hook callbacks that receive the agent and access `agent.messages` would need to be adapted
- Session manager becomes a required concept (though a default in-memory implementation could make it invisible for simple use cases)
- The `threading.Lock` and `CurrencyException` would be removed, which means users who relied on the exception as a signal would need to adapt

### Backwards compatibility is the biggest concern

Today, users directly read and write instance fields like `agent.messages` and `agent.state`. Moving these into an isolated invocation state object would break that public API surface. Community tools, custom hooks, and user code that accesses these fields would all need updating. Providing a smooth migration path — whether through proxy accessors, a compatibility layer, or clear deprecation — is the most significant challenge with this proposal.

Given the scope of this change, it may be worth considering this as part of a v2 of the Python SDK rather than attempting it as a backwards-compatible evolution of v1.
