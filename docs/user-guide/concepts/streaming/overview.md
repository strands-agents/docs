# Streaming Events

Strands Agents SDK provides real-time streaming capabilities that allow you to monitor and process events as they occur during agent execution. This enables responsive user interfaces, real-time monitoring, and custom output formatting.

Strands has two approaches for handling streaming events:

- **[Async Iterators](async-iterators.md)**: Ideal for asynchronous frameworks like FastAPI, aiohttp, or Django Channels
- **[Callback Handlers](callback-handlers.md)**: Perfect for synchronous applications and custom event processing

Both methods receive the same event types but differ in their execution model and use cases.

## Event Types

All streaming methods yield the same set of events:

### Lifecycle Events
- `init_event_loop`: True at the start of agent invocation initializing
- `start_event_loop`: True when the event loop is starting
- `message`: Present when a new message is created
- `event`: Raw event from the model stream
- `force_stop`: True if the event loop was forced to stop
  - `force_stop_reason`: Reason for forced stop
- `result`: The final [`AgentResult`](../../../api-reference/agent.md#strands.agent.agent_result.AgentResult)

### Text Generation Events
- `data`: Text chunk from the model's output
- `delta`: Raw delta content from the model

### Tool Events
- `current_tool_use`: Information about the current tool being used, including:
    - `toolUseId`: Unique ID for this tool use
    - `name`: Name of the tool
    - `input`: Tool input parameters (accumulated as streaming occurs)
- `tool_stream_event`: Information about [an event streamed from a tool](../../tools/python-tools/#tool-streaming), including:
    - `tool_use`: The [`ToolUse`](../../../api-reference/types#strands.types.tools.ToolUse) for the tool that streamed the event
    - `data`: The data streamed from the tool

### Reasoning Events
- `reasoning`: True for reasoning events
- `reasoningText`: Text from reasoning process
- `reasoning_signature`: Signature from reasoning process
- `redactedContent`: Reasoning content redacted by the model

## Quick Examples

### Async Iterator Pattern
```python
async for event in agent.stream_async("Calculate 2+2"):
    if "data" in event:
        print(event["data"], end="")
```

### Callback Handler Pattern
```python
def handle_events(**kwargs):
    if "data" in kwargs:
        print(kwargs["data"], end="")

agent = Agent(callback_handler=handle_events)
agent("Calculate 2+2")
```

## Next Steps

- Learn about [Async Iterators](async-iterators.md) for asynchronous streaming
- Explore [Callback Handlers](callback-handlers.md) for synchronous event processing
- See the [Agent API Reference](../../../api-reference/agent.md) for complete method documentation