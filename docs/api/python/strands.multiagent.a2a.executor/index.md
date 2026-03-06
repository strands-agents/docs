Strands Agent executor for the A2A protocol.

This module provides the StrandsA2AExecutor class, which adapts a Strands Agent to be used as an executor in the A2A protocol. It handles the execution of agent requests and the conversion of Strands Agent streamed responses to A2A events.

The A2A AgentExecutor ensures clients receive responses for synchronous and streamed requests to the A2AServer.

## StrandsA2AExecutor

```python
class StrandsA2AExecutor(AgentExecutor)
```

Defined in: [src/strands/multiagent/a2a/executor.py:41](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/a2a/executor.py#L41)

Executor that adapts a Strands Agent to the A2A protocol.

This executor uses streaming mode to handle the execution of agent requests and converts Strands Agent responses to A2A protocol events.

#### \_\_init\_\_

```python
def __init__(agent: SAAgent, *, enable_a2a_compliant_streaming: bool = False)
```

Defined in: [src/strands/multiagent/a2a/executor.py:58](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/a2a/executor.py#L58)

Initialize a StrandsA2AExecutor.

**Arguments**:

-   `agent` - The Strands Agent instance to adapt to the A2A protocol.
-   `enable_a2a_compliant_streaming` - If True, uses A2A-compliant streaming with artifact updates. If False, uses legacy status updates streaming behavior for backwards compatibility. Defaults to False.

#### execute

```python
async def execute(context: RequestContext, event_queue: EventQueue) -> None
```

Defined in: [src/strands/multiagent/a2a/executor.py:70](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/a2a/executor.py#L70)

Execute a request using the Strands Agent and send the response as A2A events.

This method executes the user’s input using the Strands Agent in streaming mode and converts the agent’s response to A2A events.

**Arguments**:

-   `context` - The A2A request context, containing the user’s input and task metadata.
-   `event_queue` - The A2A event queue used to send response events back to the client.

**Raises**:

-   `ServerError` - If an error occurs during agent execution

#### cancel

```python
async def cancel(context: RequestContext, event_queue: EventQueue) -> None
```

Defined in: [src/strands/multiagent/a2a/executor.py:215](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/a2a/executor.py#L215)

Cancel an ongoing execution.

This method is called when a request cancellation is requested. Currently, cancellation is not supported by the Strands Agent executor, so this method always raises an UnsupportedOperationError.

**Arguments**:

-   `context` - The A2A request context.
-   `event_queue` - The A2A event queue.

**Raises**:

-   `ServerError` - Always raised with an UnsupportedOperationError, as cancellation is not currently supported.