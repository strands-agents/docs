A2A Agent client for Strands Agents.

This module provides the A2AAgent class, which acts as a client wrapper for remote A2A agents, allowing them to be used standalone or as part of multi-agent patterns.

A2AAgent can be used to get the Agent Card and interact with the agent.

## A2AAgent

```python
class A2AAgent(AgentBase)
```

Defined in: [src/strands/agent/a2a\_agent.py:31](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/a2a_agent.py#L31)

Client wrapper for remote A2A agents.

#### \_\_init\_\_

```python
def __init__(endpoint: str,
             *,
             name: str | None = None,
             description: str | None = None,
             timeout: int = _DEFAULT_TIMEOUT,
             a2a_client_factory: ClientFactory | None = None)
```

Defined in: [src/strands/agent/a2a\_agent.py:34](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/a2a_agent.py#L34)

Initialize A2A agent.

**Arguments**:

-   `endpoint` - The base URL of the remote A2A agent.
-   `name` - Agent name. If not provided, will be populated from agent card.
-   `description` - Agent description. If not provided, will be populated from agent card.
-   `timeout` - Timeout for HTTP operations in seconds (defaults to 300).
-   `a2a_client_factory` - Optional pre-configured A2A ClientFactory. If provided, it will be used to create the A2A client after discovering the agent card.
-   `Note` - When providing a custom factory, you are responsible for managing the lifecycle of any httpx client it uses.

#### \_\_call\_\_

```python
def __call__(prompt: AgentInput = None, **kwargs: Any) -> AgentResult
```

Defined in: [src/strands/agent/a2a\_agent.py:62](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/a2a_agent.py#L62)

Synchronously invoke the remote A2A agent.

**Arguments**:

-   `prompt` - Input to the agent (string, message list, or content blocks).
-   `**kwargs` - Additional arguments (ignored).

**Returns**:

AgentResult containing the agent’s response.

**Raises**:

-   `ValueError` - If prompt is None.
-   `RuntimeError` - If no response received from agent.

#### invoke\_async

```python
async def invoke_async(prompt: AgentInput = None,
                       **kwargs: Any) -> AgentResult
```

Defined in: [src/strands/agent/a2a\_agent.py:82](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/a2a_agent.py#L82)

Asynchronously invoke the remote A2A agent.

**Arguments**:

-   `prompt` - Input to the agent (string, message list, or content blocks).
-   `**kwargs` - Additional arguments (ignored).

**Returns**:

AgentResult containing the agent’s response.

**Raises**:

-   `ValueError` - If prompt is None.
-   `RuntimeError` - If no response received from agent.

#### stream\_async

```python
async def stream_async(prompt: AgentInput = None,
                       **kwargs: Any) -> AsyncIterator[Any]
```

Defined in: [src/strands/agent/a2a\_agent.py:110](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/a2a_agent.py#L110)

Stream remote agent execution asynchronously.

This method provides an asynchronous interface for streaming A2A protocol events. Unlike Agent.stream\_async() which yields text deltas and tool events, this method yields raw A2A protocol events wrapped in A2AStreamEvent dictionaries.

**Arguments**:

-   `prompt` - Input to the agent (string, message list, or content blocks).
-   `**kwargs` - Additional arguments (ignored).

**Yields**:

An async iterator that yields events. Each event is a dictionary:

-   A2AStreamEvent: {“type”: “a2a\_stream”, “event”: >A2A object>} where the A2A object can be a Message, or a tuple of (Task, TaskStatusUpdateEvent) or (Task, TaskArtifactUpdateEvent).
-   AgentResultEvent: {“result”: AgentResult} - always emitted last.

**Raises**:

-   `ValueError` - If prompt is None.

**Example**:

```python
async for event in a2a_agent.stream_async("Hello"):
    if event.get("type") == "a2a_stream":
        print(f"A2A event: \{event['event']}")
    elif "result" in event:
        print(f"Final result: \{event['result'].message}")
```

#### get\_agent\_card

```python
async def get_agent_card() -> AgentCard
```

Defined in: [src/strands/agent/a2a\_agent.py:160](https://github.com/strands-agents/sdk-python/blob/main/src/strands/agent/a2a_agent.py#L160)

Fetch and return the remote agent’s card.

This method eagerly fetches the agent card from the remote endpoint, populating name and description if not already set. The card is cached after the first fetch.

**Returns**:

The remote agent’s AgentCard containing name, description, capabilities, skills, etc.