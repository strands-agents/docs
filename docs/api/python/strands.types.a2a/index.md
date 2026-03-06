Additional A2A types.

## A2AStreamEvent

```python
class A2AStreamEvent(TypedEvent)
```

Defined in: [src/strands/types/a2a.py:12](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/a2a.py#L12)

Event emitted for every update received from the remote A2A server.

This event wraps all A2A response types during streaming, including:

-   Partial task updates (TaskArtifactUpdateEvent)
-   Status updates (TaskStatusUpdateEvent)
-   Complete messages (Message)
-   Final task completions

The event is emitted for EVERY update from the server, regardless of whether it represents a complete or partial response. When streaming completes, an AgentResultEvent containing the final AgentResult is also emitted after all A2AStreamEvents.

#### \_\_init\_\_

```python
def __init__(a2a_event: A2AResponse) -> None
```

Defined in: [src/strands/types/a2a.py:27](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/a2a.py#L27)

Initialize with A2A event.

**Arguments**:

-   `a2a_event` - The original A2A event (Task tuple or Message)