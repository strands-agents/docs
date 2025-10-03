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

## Event Loop Lifecycle Example

This example demonstrates how to track the complete event loop lifecycle using a shared processing function that works with both streaming approaches:

```python
from strands import Agent
from strands_tools import calculator

def process_event(event):
    """Shared event processor for both async iterators and callback handlers"""
    # Track event loop lifecycle
    if event.get("init_event_loop", False):
        print("🔄 Event loop initialized")
    elif event.get("start_event_loop", False):
        print("▶️ Event loop cycle starting")
    elif "message" in event:
        print(f"📬 New message created: {event['message']['role']}")
    elif event.get("complete", False):
        print("✅ Cycle completed")
    elif event.get("force_stop", False):
        print(f"🛑 Event loop force-stopped: {event.get('force_stop_reason', 'unknown reason')}")

    # Track tool usage
    if "current_tool_use" in event and event["current_tool_use"].get("name"):
        tool_name = event["current_tool_use"]["name"]
        print(f"🔧 Using tool: {tool_name}")

    # Show text snippets
    if "data" in event:
        data_snippet = event["data"][:20] + ("..." if len(event["data"]) > 20 else "")
        print(f"📟 Text: {data_snippet}")
```
        
Usage with async-iterators:

```python
agent = Agent(tools=[calculator], callback_handler=None)
async for event in agent.stream_async("What is the capital of France and what is 42+7?"):
    process_event(event)

```

Using with callback handlers:
    
```python
def handle_events(**kwargs):
    process_event(kwargs)

agent = Agent(tools=[calculator], callback_handler=handle_events)
agent("What is the capital of France and what is 42+7?")
```

## Sub-Agent Streaming Example

Utilizing both [agents as a tool](../multi-agent/agents-as-tools.md) and [tool streaming](../tools/python-tools.md#tool-streaming), this example shows how to stream events from sub-agents:

```python
from typing import AsyncIterator
from dataclasses import dataclass
from strands import Agent, tool
from strands_tools import calculator

@dataclass
class SubAgentResult:
    agent: Agent
    event: dict

@tool
async def math_agent(query: str) -> AsyncIterator:
    """Solve math problems using the calculator tool."""
    agent = Agent(
        name="Math Expert",
        system_prompt="You are a math expert. Use the calculator tool for calculations.",
        callback_handler=None,
        tools=[calculator]
    )
    
    result = None
    async for event in agent.stream_async(query):
        yield SubAgentResult(agent=agent, event=event)
        if "result" in event:
            result = event["result"]
    
    yield str(result)

def process_sub_agent_events(event):
    """Shared processor for sub-agent streaming events"""
    tool_stream = event.get("tool_stream_event", {}).get("data")
    
    if isinstance(tool_stream, SubAgentResult):
        current_tool = tool_stream.event.get("current_tool_use", {})
        tool_name = current_tool.get("name")
        
        if tool_name:
            print(f"Agent '{tool_stream.agent.name}' using tool '{tool_name}'")
    
    # Also show regular text output
    if "data" in event:
        print(event["data"], end="")

# Using with async iterators
orchestrator = Agent(
    system_prompt="Route math questions to the math_agent tool.",
    callback_handler=None,
    tools=[math_agent]
)
```

Usage with async-iterators:

```python
async for event in orchestrator.stream_async("What is 3+3?"):
    process_sub_agent_events(event)
```

Using with callback handlers:
    
```python
def handle_events(**kwargs):
    process_sub_agent_events(kwargs)

orchestrator = Agent(
    system_prompt="Route math questions to the math_agent tool.",
    callback_handler=handle_events,
    tools=[math_agent]
)

orchestrator("What is 3+3?")
```

## Next Steps

- Learn about [Async Iterators](async-iterators.md) for asynchronous streaming
- Explore [Callback Handlers](callback-handlers.md) for synchronous event processing
- See the [Agent API Reference](../../../api-reference/agent.md) for complete method documentation