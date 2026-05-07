Strands Agent executor for the A2A protocol.

This module provides the StrandsA2AExecutor class, which adapts a Strands Agent to be used as an executor in the A2A protocol. It handles the execution of agent requests and the conversion of Strands Agent streamed responses to A2A events.

The A2A AgentExecutor ensures clients receive responses for synchronous and streamed requests to the A2AServer.

## StrandsA2AExecutor

```python
class StrandsA2AExecutor(AgentExecutor)
```

Defined in: [src/strands/multiagent/a2a/executor.py:42](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/a2a/executor.py#L42)

Executor that adapts a Strands Agent to the A2A protocol.

This executor uses streaming mode to handle the execution of agent requests and converts Strands Agent responses to A2A protocol events. It supports the full A2A task lifecycle including error handling (failed state), cancellation, and interrupt-based input\_required flows.

#### \_\_init\_\_

```python
def __init__(agent: SAAgent, *, enable_a2a_compliant_streaming: bool = False)
```

Defined in: [src/strands/multiagent/a2a/executor.py:61](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/a2a/executor.py#L61)

Initialize a StrandsA2AExecutor.

**Arguments**:

-   `agent` - The Strands Agent instance to adapt to the A2A protocol.
-   `enable_a2a_compliant_streaming` - If True, uses A2A-compliant streaming with artifact updates. If False, uses legacy status updates streaming behavior for backwards compatibility. Defaults to False.

#### execute

```python
async def execute(context: RequestContext, event_queue: EventQueue) -> None
```

Defined in: [src/strands/multiagent/a2a/executor.py:73](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/a2a/executor.py#L73)

Execute a request using the Strands Agent and send the response as A2A events.

This method executes the user’s input using the Strands Agent in streaming mode and converts the agent’s response to A2A events. If the agent raises an exception, the task transitions to the `failed` state. If the agent returns with interrupts, the task transitions to the `input_required` state.

**Arguments**:

-   `context` - The A2A request context, containing the user’s input and task metadata.
-   `event_queue` - The A2A event queue used to send response events back to the client.

**Raises**:

-   `ServerError` - If an unrecoverable error occurs during agent execution setup (e.g., missing input). Agent execution errors are handled gracefully by transitioning the task to the failed state.

#### cancel

```python
async def cancel(context: RequestContext, event_queue: EventQueue) -> None
```

Defined in: [src/strands/multiagent/a2a/executor.py:295](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/a2a/executor.py#L295)

Cancel an ongoing execution.

Transitions the task to the canceled state and attempts to stop the agent. The agent’s cancel() method is called to signal cooperative cancellation of in-flight execution.

Note: This transitions the A2A task state. The underlying agent execution may still complete its current model call before stopping.

**Arguments**:

-   `context` - The A2A request context.
-   `event_queue` - The A2A event queue.

**Raises**:

-   `ServerError` - If no current task exists or the task is already in a terminal state.