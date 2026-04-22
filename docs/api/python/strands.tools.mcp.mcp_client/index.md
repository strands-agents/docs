Model Context Protocol (MCP) server connection management module.

This module provides the MCPClient class which handles connections to MCP servers. It manages the lifecycle of MCP connections, including initialization, tool discovery, tool invocation, and proper cleanup of resources. The connection runs in a background thread to avoid blocking the main application thread while maintaining communication with the MCP service.

## ToolFilters

```python
class ToolFilters(TypedDict)
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:69](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L69)

Filters for controlling which MCP tools are loaded and available.

Tools are filtered in this order:

1.  If ‘allowed’ is specified, only tools matching these patterns are included
2.  Tools matching ‘rejected’ patterns are then excluded

## MCPClient

```python
class MCPClient(ToolProvider)
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:104](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L104)

Represents a connection to a Model Context Protocol (MCP) server.

This class implements a context manager pattern for efficient connection management, allowing reuse of the same connection for multiple tool calls to reduce latency. It handles the creation, initialization, and cleanup of MCP connections.

The connection runs in a background thread to avoid blocking the main application thread while maintaining communication with the MCP service. When structured content is available from MCP tools, it will be returned as the last item in the content array of the ToolResult.

#### \_\_init\_\_

```python
def __init__(transport_callable: Callable[[], MCPTransport],
             *,
             startup_timeout: int = 30,
             tool_filters: ToolFilters | None = None,
             prefix: str | None = None,
             elicitation_callback: ElicitationFnT | None = None,
             tasks_config: TasksConfig | None = None) -> None
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:116](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L116)

Initialize a new MCP Server connection.

**Arguments**:

-   `transport_callable` - A callable that returns an MCPTransport (read\_stream, write\_stream) tuple.
-   `startup_timeout` - Timeout after which MCP server initialization should be cancelled. Defaults to 30.
-   `tool_filters` - Optional filters to apply to tools.
-   `prefix` - Optional prefix for tool names.
-   `elicitation_callback` - Optional callback function to handle elicitation requests from the MCP server.
-   `tasks_config` - Configuration for MCP task-augmented execution for long-running tools. If provided (not None), enables task-augmented execution for tools that support it. See TasksConfig for details. This feature is experimental and subject to change.

#### \_\_enter\_\_

```python
def __enter__() -> "MCPClient"
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:173](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L173)

Context manager entry point which initializes the MCP server connection.

TODO: Refactor to lazy initialization pattern following idiomatic Python. Heavy work in **enter** is non-idiomatic - should move connection logic to first method call instead.

#### \_\_exit\_\_

```python
def __exit__(exc_type: BaseException, exc_val: BaseException,
             exc_tb: TracebackType) -> None
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:181](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L181)

Context manager exit point that cleans up resources.

#### start

```python
def start() -> "MCPClient"
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:185](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L185)

Starts the background thread and waits for initialization.

This method starts the background thread that manages the MCP connection and blocks until the connection is ready or times out.

**Returns**:

-   `self` - The MCPClient instance

**Raises**:

-   `Exception` - If the MCP connection fails to initialize within the timeout period

#### load\_tools

```python
async def load_tools(**kwargs: Any) -> Sequence[AgentTool]
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:227](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L227)

Load and return tools from the MCP server.

This method implements the ToolProvider interface by loading tools from the MCP server and caching them for reuse.

**Arguments**:

-   `**kwargs` - Additional arguments for future compatibility.

**Returns**:

List of AgentTool instances from the MCP server.

#### add\_consumer

```python
def add_consumer(consumer_id: Any, **kwargs: Any) -> None
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:289](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L289)

Add a consumer to this tool provider.

Synchronous to prevent GC deadlocks when called from Agent finalizers.

#### remove\_consumer

```python
def remove_consumer(consumer_id: Any, **kwargs: Any) -> None
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:297](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L297)

Remove a consumer from this tool provider.

This method is idempotent - calling it multiple times with the same ID has no additional effect after the first call.

Synchronous to prevent GC deadlocks when called from Agent finalizers. Uses existing synchronous stop() method for safe cleanup.

#### stop

```python
def stop(exc_type: BaseException | None, exc_val: BaseException | None,
         exc_tb: TracebackType | None) -> None
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:321](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L321)

Signals the background thread to stop and waits for it to complete, ensuring proper cleanup of all resources.

This method is defensive and can handle partial initialization states that may occur if start() fails partway through initialization.

Resources to cleanup:

-   \_background\_thread: Thread running the async event loop
-   \_background\_thread\_session: MCP ClientSession (auto-closed by context manager)
-   \_background\_thread\_event\_loop: AsyncIO event loop in background thread
-   \_close\_future: AsyncIO future to signal thread shutdown
-   \_close\_exception: Exception that caused the background thread shutdown; None if a normal shutdown occurred.
-   \_init\_future: Future for initialization synchronization

Cleanup order:

1.  Signal close future to background thread (if session initialized)
2.  Wait for background thread to complete
3.  Reset all state for reuse

**Arguments**:

-   `exc_type` - Exception type if an exception was raised in the context
-   `exc_val` - Exception value if an exception was raised in the context
-   `exc_tb` - Exception traceback if an exception was raised in the context

#### list\_tools\_sync

```python
def list_tools_sync(
        pagination_token: str | None = None,
        prefix: str | None = None,
        tool_filters: ToolFilters | None = None
) -> PaginatedList[MCPAgentTool]
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:394](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L394)

Synchronously retrieves the list of available tools from the MCP server.

This method calls the asynchronous list\_tools method on the MCP session and adapts the returned tools to the AgentTool interface.

**Arguments**:

-   `pagination_token` - Optional token for pagination
-   `prefix` - Optional prefix to apply to tool names. If None, uses constructor default. If explicitly provided (including empty string), overrides constructor default.
-   `tool_filters` - Optional filters to apply to tools. If None, uses constructor default. If explicitly provided (including empty dict), overrides constructor default.

**Returns**:

-   `List[AgentTool]` - A list of available tools adapted to the AgentTool interface

#### list\_prompts\_sync

```python
def list_prompts_sync(
        pagination_token: str | None = None) -> ListPromptsResult
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:452](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L452)

Synchronously retrieves the list of available prompts from the MCP server.

This method calls the asynchronous list\_prompts method on the MCP session and returns the raw ListPromptsResult with pagination support.

**Arguments**:

-   `pagination_token` - Optional token for pagination

**Returns**:

-   `ListPromptsResult` - The raw MCP response containing prompts and pagination info

#### get\_prompt\_sync

```python
def get_prompt_sync(prompt_id: str, args: dict[str, Any]) -> GetPromptResult
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:478](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L478)

Synchronously retrieves a prompt from the MCP server.

**Arguments**:

-   `prompt_id` - The ID of the prompt to retrieve
-   `args` - Optional arguments to pass to the prompt

**Returns**:

-   `GetPromptResult` - The prompt response from the MCP server

#### list\_resources\_sync

```python
def list_resources_sync(
        pagination_token: str | None = None) -> ListResourcesResult
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:500](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L500)

Synchronously retrieves the list of available resources from the MCP server.

This method calls the asynchronous list\_resources method on the MCP session and returns the raw ListResourcesResult with pagination support.

**Arguments**:

-   `pagination_token` - Optional token for pagination

**Returns**:

-   `ListResourcesResult` - The raw MCP response containing resources and pagination info

#### read\_resource\_sync

```python
def read_resource_sync(uri: AnyUrl | str) -> ReadResourceResult
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:524](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L524)

Synchronously reads a resource from the MCP server.

**Arguments**:

-   `uri` - The URI of the resource to read

**Returns**:

-   `ReadResourceResult` - The resource content from the MCP server

#### list\_resource\_templates\_sync

```python
def list_resource_templates_sync(
        pagination_token: str | None = None) -> ListResourceTemplatesResult
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:547](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L547)

Synchronously retrieves the list of available resource templates from the MCP server.

Resource templates define URI patterns that can be used to access resources dynamically.

**Arguments**:

-   `pagination_token` - Optional token for pagination

**Returns**:

-   `ListResourceTemplatesResult` - The raw MCP response containing resource templates and pagination info

#### call\_tool\_sync

```python
def call_tool_sync(tool_use_id: str,
                   name: str,
                   arguments: dict[str, Any] | None = None,
                   read_timeout_seconds: timedelta | None = None,
                   meta: dict[str, Any] | None = None) -> MCPToolResult
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:620](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L620)

Synchronously calls a tool on the MCP server.

This method automatically uses task-augmented execution when appropriate, based on server capabilities and tool-level taskSupport settings.

**Arguments**:

-   `tool_use_id` - Unique identifier for this tool use
-   `name` - Name of the tool to call
-   `arguments` - Optional arguments to pass to the tool
-   `read_timeout_seconds` - Optional timeout for the tool call
-   `meta` - Optional metadata to pass to the tool call per MCP spec (\_meta)

**Returns**:

-   `MCPToolResult` - The result of the tool call

#### call\_tool\_async

```python
async def call_tool_async(tool_use_id: str,
                          name: str,
                          arguments: dict[str, Any] | None = None,
                          read_timeout_seconds: timedelta | None = None,
                          meta: dict[str, Any] | None = None) -> MCPToolResult
```

Defined in: [src/strands/tools/mcp/mcp\_client.py:655](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_client.py#L655)

Asynchronously calls a tool on the MCP server.

This method automatically uses task-augmented execution when appropriate, based on server capabilities and tool-level taskSupport settings.

**Arguments**:

-   `tool_use_id` - Unique identifier for this tool use
-   `name` - Name of the tool to call
-   `arguments` - Optional arguments to pass to the tool
-   `read_timeout_seconds` - Optional timeout for the tool call
-   `meta` - Optional metadata to pass to the tool call per MCP spec (\_meta)

**Returns**:

-   `MCPToolResult` - The result of the tool call