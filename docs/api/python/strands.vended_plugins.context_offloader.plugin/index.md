ContextOffloader plugin for managing large tool outputs.

This module provides the ContextOffloader plugin that intercepts oversized tool results, persists each content block to a storage backend, and replaces the in-context result with a truncated preview and per-block references.

**Example**:

```python
from strands import Agent
from strands.vended_plugins.context_offloader import (
    ContextOffloader,
    InMemoryStorage,
    FileStorage,
)

# In-memory storage
agent = Agent(plugins=[
    ContextOffloader(storage=InMemoryStorage())
])

# File storage with custom thresholds and retrieval tool enabled
agent = Agent(plugins=[
    ContextOffloader(
        storage=FileStorage("./artifacts"),
        max_result_tokens=5_000,
        preview_tokens=2_000,
        include_retrieval_tool=True,
    )
])
```

## ContextOffloader

```python
class ContextOffloader(Plugin)
```

Defined in: [src/strands/vended\_plugins/context\_offloader/plugin.py:62](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/plugin.py#L62)

Plugin that offloads oversized tool results to reduce context consumption.

When a tool result exceeds the configured token threshold, this plugin stores each content block individually to a storage backend and replaces the in-context result with a truncated text preview plus per-block references.

Token estimation uses the agent’s model `count_tokens` method, which leverages tiktoken when available and falls back to character-based heuristics.

Content type handling:

-   **Text**: stored as `text/plain`, replaced with a preview
-   **JSON**: stored as `application/json`, replaced with a preview
-   **Image**: stored in its native format (e.g., `image/png`), replaced with a placeholder showing format and size
-   **Document**: stored in its native format (e.g., `application/pdf`), replaced with a placeholder showing format, name, and size
-   **Unknown types**: passed through unchanged

This operates proactively at tool execution time via `AfterToolCallEvent`, before the result enters the conversation — unlike `SlidingWindowConversationManager` which truncates reactively after context overflow.

**Arguments**:

-   `storage` - Backend for storing offloaded content (required).
-   `max_result_tokens` - Offload results whose estimated token count exceeds this threshold.
-   `preview_tokens` - Number of tokens to keep as a text preview in context.
-   `include_retrieval_tool` - Whether to register the `retrieve_offloaded_content` tool. Defaults to True.

**Example**:

```python
from strands import Agent
from strands.vended_plugins.context_offloader import ContextOffloader, InMemoryStorage

agent = Agent(plugins=[
    ContextOffloader(storage=InMemoryStorage())
])
```

#### \_\_init\_\_

```python
def __init__(storage: Storage,
             max_result_tokens: int = _DEFAULT_MAX_RESULT_TOKENS,
             preview_tokens: int = _DEFAULT_PREVIEW_TOKENS,
             *,
             include_retrieval_tool: bool = True) -> None
```

Defined in: [src/strands/vended\_plugins/context\_offloader/plugin.py:106](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/plugin.py#L106)

Initialize the ContextOffloader plugin.

**Arguments**:

-   `storage` - Backend for storing offloaded content.
-   `max_result_tokens` - Offload results whose estimated token count exceeds this threshold. Defaults to `_DEFAULT_MAX_RESULT_TOKENS` (2,500).
-   `preview_tokens` - Number of tokens to keep as a text preview in context. Uses tiktoken for exact slicing when available, falls back to chars/4 heuristic. Defaults to `_DEFAULT_PREVIEW_TOKENS` (1,000).
-   `include_retrieval_tool` - Whether to register the `retrieve_offloaded_content` tool so the agent can fetch offloaded content. Defaults to True.

**Raises**:

-   `ValueError` - If max\_result\_tokens is not positive, preview\_tokens is negative, or preview\_tokens >= max\_result\_tokens.

#### init\_agent

```python
def init_agent(agent: Agent) -> None
```

Defined in: [src/strands/vended\_plugins/context\_offloader/plugin.py:143](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/plugin.py#L143)

Conditionally register the retrieval tool.

#### retrieve\_offloaded\_content

```python
@tool(context=True)
def retrieve_offloaded_content(reference: str,
                               tool_context: ToolContext) -> dict | str
```

Defined in: [src/strands/vended\_plugins/context\_offloader/plugin.py:150](https://github.com/strands-agents/sdk-python/blob/main/src/strands/vended_plugins/context_offloader/plugin.py#L150)

Retrieve offloaded content by reference.

Use this tool when you see a placeholder with a reference (ref: …) and need the full content. Only use this as a fallback if the data cannot be accessed using your existing tools.

**Arguments**:

-   `reference` - The reference string from the offload placeholder.
-   `tool_context` - Injected by the framework. Not user-facing.