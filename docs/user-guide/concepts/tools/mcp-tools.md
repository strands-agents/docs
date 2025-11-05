# Model Context Protocol (MCP) Tools

!!! warning "New: Experimental Managed MCP Integration"
    The `MCPClient` now implements the experimental `ToolProvider` interface, enabling direct usage in Agent constructors. The agent handles MCP connection startup, tool discovery, and cleanup without requiring explicit with statements or manual resource management. This feature is experimental and may change in future versions. For production applications, use the manual context management approach.

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). Strands Agents integrates with MCP to extend agent capabilities through external tools and services.

MCP enables communication between agents and MCP servers that provide additional tools. Strands includes built-in support for connecting to MCP servers and using their tools.

## Integration Approaches

Strands provides two approaches for integrating MCP tools:

### Manual Context Management

The standard approach requires explicit context management using `with` statements:

```python
from mcp import stdio_client, StdioServerParameters
from strands import Agent
from strands.tools.mcp import MCPClient

# Connect to an MCP server using stdio transport
# Note: uvx command syntax differs by platform

# Create MCP client
mcp_client = MCPClient(lambda: stdio_client(
    StdioServerParameters(
        command="uvx", 
        args=["awslabs.aws-documentation-mcp-server@latest"]
    )
))

# Manual lifecycle management
with mcp_client:
    # Get the tools from the MCP server
    tools = mcp_client.list_tools_sync()
    
    # Create an agent with these tools
    agent = Agent(tools=tools)
    agent("What is AWS Lambda?")  # Must be within context
```

This approach provides direct control over the MCP session lifecycle but requires careful management to avoid connection errors.

### Managed Integration (Experimental)

The `MCPClient` implements the experimental `ToolProvider` interface, enabling direct usage in the Agent constructor with automatic lifecycle management:

```python
# Direct usage - connection lifecycle managed automatically
agent = Agent(tools=[mcp_client])
response = agent("What is AWS Lambda?")
```

Automatic lifecycle management means the agent handles MCP connection startup, tool discovery, and cleanup without requiring explicit with statements or manual resource management. This feature is experimental and may change in future versions. For production applications, use the manual context management approach.


## MCP Server Connection Options

Strands provides several transport mechanisms for connecting to MCP servers:

### 1. Standard I/O (stdio)

For command-line tools and local processes that implement the MCP protocol:

```python
from mcp import stdio_client, StdioServerParameters
from strands import Agent
from strands.tools.mcp import MCPClient

# For macOS/Linux:
stdio_mcp_client = MCPClient(lambda: stdio_client(
    StdioServerParameters(
        command="uvx", 
        args=["awslabs.aws-documentation-mcp-server@latest"]
    )
))

# For Windows:
stdio_mcp_client = MCPClient(lambda: stdio_client(
    StdioServerParameters(
        command="uvx", 
        args=[
            "--from", 
            "awslabs.aws-documentation-mcp-server@latest", 
            "awslabs.aws-documentation-mcp-server.exe"
        ]
    )
))

# Manual approach - explicit context management
with stdio_mcp_client:
    tools = stdio_mcp_client.list_tools_sync()
    agent = Agent(tools=tools)
    response = agent("What is AWS Lambda?")

# Managed approach - automatic lifecycle (experimental)
agent = Agent(tools=[stdio_mcp_client])
response = agent("What is AWS Lambda?")
```

### 2. Streamable HTTP

For HTTP-based MCP servers that use Streamable-HTTP Events transport:

```python
from mcp.client.streamable_http import streamablehttp_client
from strands import Agent
from strands.tools.mcp import MCPClient

streamable_http_mcp_client = MCPClient(lambda: streamablehttp_client("http://localhost:8000/mcp"))

# Manual approach
with streamable_http_mcp_client:
    tools = streamable_http_mcp_client.list_tools_sync()
    agent = Agent(tools=tools)

# Managed approach (experimental)
agent = Agent(tools=[streamable_http_mcp_client])
```

You can configure additional properties - like authentication and headers - when creating the `streamablehttp_client`. All configuration options from the [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk) are supported:

```python
import os
from strands.tools.mcp.mcp_client import MCPClient
from mcp.client.streamable_http import streamablehttp_client

github_http_mcp_client = MCPClient(
    lambda: streamablehttp_client(
        url="https://api.githubcopilot.com/mcp/", 
        # Get pat token from here: https://github.com/settings/personal-access-tokens
        headers={"Authorization": f"Bearer {os.getenv('MCP_PAT')}"}
    )
)
```

### 3. Server-Sent Events (SSE)

For HTTP-based MCP servers that use Server-Sent Events transport:

```python
from mcp.client.sse import sse_client
from strands import Agent
from strands.tools.mcp import MCPClient

sse_mcp_client = MCPClient(lambda: sse_client("http://localhost:8000/sse"))

# Manual approach
with sse_mcp_client:
    tools = sse_mcp_client.list_tools_sync()
    agent = Agent(tools=tools)

# Managed approach (experimental)
agent = Agent(tools=[sse_mcp_client])
```

### 4. Custom Transport

For advanced use cases, implement a custom transport mechanism using the `MCPTransport` protocol:

```python
from typing import Callable
from strands import Agent
from strands.tools.mcp import MCPClient
from strands.tools.mcp.mcp_types import MCPTransport

def custom_transport_factory() -> MCPTransport:
    # Must return a tuple of (read_stream, write_stream)
    # Both must implement AsyncIterable and AsyncIterator protocols
    return read_stream, write_stream

custom_mcp_client = MCPClient(transport_callable=custom_transport_factory)

# Manual approach
with custom_mcp_client:
    tools = custom_mcp_client.list_tools_sync()
    agent = Agent(tools=tools)

# Managed approach (experimental)
agent = Agent(tools=[custom_mcp_client])
```

## Tool Management

### Tool Filtering

Control which tools are loaded from MCP servers using the `tool_filters` parameter. The AWS documentation MCP server provides these tools: `read_documentation`, `search_documentation`, `recommend`, and `get_available_services`.

```python
from mcp import stdio_client, StdioServerParameters
from strands.tools.mcp import MCPClient, ToolFilters
import re

# String matching - loads only specified tools
# Result: ['search_documentation', 'read_documentation']
filtered_client = MCPClient(
    lambda: stdio_client(StdioServerParameters(
        command="uvx", 
        args=["awslabs.aws-documentation-mcp-server@latest"]
    )),
    tool_filters={"allowed": ["search_documentation", "read_documentation"]}
)

# Regex patterns - loads tools matching pattern
# Result: ['search_documentation']
regex_client = MCPClient(
    lambda: stdio_client(StdioServerParameters(
        command="uvx", 
        args=["awslabs.aws-documentation-mcp-server@latest"]
    )),
    tool_filters={"allowed": [re.compile(r"^search_.*")]}
)

# Custom functions - loads tools based on custom logic
# Result: ['recommend'] (only tool with <= 10 characters)
def short_tool_names(tool) -> bool:
    return len(tool.tool_name) <= 10

custom_client = MCPClient(
    lambda: stdio_client(StdioServerParameters(
        command="uvx", 
        args=["awslabs.aws-documentation-mcp-server@latest"]
    )),
    tool_filters={"allowed": [short_tool_names]}
)

# Combined filters - applies allowed first, then rejected
# Result: ['search_documentation'] (matches pattern, not rejected)
combined_client = MCPClient(
    lambda: stdio_client(StdioServerParameters(
        command="uvx", 
        args=["awslabs.aws-documentation-mcp-server@latest"]
    )),
    tool_filters={
        "allowed": [re.compile(r".*documentation$")],
        "rejected": ["read_documentation"]
    }
)
```

### Tool Name Prefixing

Prevent name conflicts when using multiple MCP servers:

```python
# Add prefixes to distinguish tools from different servers
aws_docs_client = MCPClient(
    lambda: stdio_client(StdioServerParameters(
        command="uvx", 
        args=["awslabs.aws-documentation-mcp-server@latest"]
    )),
    prefix="aws_docs"
)

other_client = MCPClient(
    lambda: stdio_client(StdioServerParameters(
        command="uvx", 
        args=["other-mcp-server@latest"]
    )),
    prefix="other"
)

# Tools will be named: aws_docs_search_documentation, other_search, etc.
agent = Agent(tools=[aws_docs_client, other_client])
```

### Runtime Parameter Overrides

Override client-level prefix and tool filtering when calling `list_tools_sync`:

```python
client = MCPClient(
    lambda: stdio_client(StdioServerParameters(command="uvx", args=["server"])),
    prefix="default",
    tool_filters={"allowed": ["echo", "calc"]}
)

with client:
    # Override prefix and filters at runtime
    tools = client.list_tools_sync(
        prefix="runtime",
        tool_filters={"rejected": ["unwanted_tool"]}
    )
```

## Using Multiple MCP Servers

Combine tools from multiple MCP servers:

```python
from mcp import stdio_client, StdioServerParameters
from mcp.client.sse import sse_client
from strands import Agent
from strands.tools.mcp import MCPClient

# Create multiple clients
sse_client = MCPClient(lambda: sse_client("http://localhost:8000/sse"))
stdio_client = MCPClient(lambda: stdio_client(
    StdioServerParameters(command="python", args=["path/to/mcp_server.py"])
))

# Manual approach - explicit context management
with sse_client, stdio_client:
    tools = sse_client.list_tools_sync() + stdio_client.list_tools_sync()
    agent = Agent(tools=tools)

# Managed approach - automatic lifecycle for all clients (experimental)
agent = Agent(tools=[sse_client, stdio_client])
```

## MCP Tool Response Format

MCP tools can return responses in two primary content formats:

1. **Text Content**: Simple text responses
2. **Image Content**: Binary image data with associated MIME type

Strands automatically maps these MCP content types to the appropriate `ToolResultContent` format used by the agent framework:

```python
def _map_mcp_content_to_tool_result_content(content):
    if isinstance(content, MCPTextContent):
        return {"text": content.text}
    elif isinstance(content, MCPImageContent):
        return {
            "image": {
                "format": map_mime_type_to_image_format(content.mimeType),
                "source": {"bytes": base64.b64decode(content.data)},
            }
        }
    else:
        # Unsupported content type
        return None
```

### Tool Result Structure

When an MCP tool is called, the result is converted to a `ToolResult` with the following structure:

```python
{
    "status": str,          # "success" or "error" based on the MCP call result
    "toolUseId": str,       # The ID of the tool use request
    "content": List[dict]   # A list of content items (text or image)
}
```

## Implementing an MCP Server

You can create your own MCP server to extend agent capabilities. Here's a simple example of a calculator MCP server:

```python
from mcp.server import FastMCP

# Create an MCP server
mcp = FastMCP("Calculator Server")

# Define a tool
@mcp.tool(description="Calculator tool which performs calculations")
def calculator(x: int, y: int) -> int:
    return x + y

# Run the server with SSE transport
mcp.run(transport="sse")
```

### MCP Server Implementation Details

The MCP server connection in Strands is managed by the `MCPClient` class, which:

1. Establishes a connection to the MCP server using the provided transport
2. Initializes the MCP session
3. Discovers available tools
4. Handles tool invocation and result conversion
5. Manages the connection lifecycle

The connection runs in a background thread to avoid blocking the main application thread while maintaining communication with the MCP service.

## Advanced Usage

### Direct Tool Invocation

While tools are typically invoked by the agent based on user requests, you can also call MCP tools directly:

```python
# Directly invoke an MCP tool
result = mcp_client.call_tool_sync(
    tool_use_id="tool-123",
    name="calculator",
    arguments={"x": 10, "y": 20}
)

# Process the result
print(f"Calculation result: {result['content'][0]['text']}")
```

### Elicitation

An MCP server can request additional information from the user by sending an elicitation request to the connecting client. The user can respond to the request by setting up an elicitation callback:

```Python
"""server.py"""

from mcp.server import FastMCP
from mcp.types import ElicitRequest, ElicitRequestParams, ElicitResult

server = FastMCP("mytools")

@server.tool()
async def delete_files(paths: list[str]) -> str:
    request = ElicitRequest(
        params=ElicitRequestParams(
            message=f"Do you want to delete {paths}",
            requestedSchema={
                "type": "object",
                "properties": {
                    "username": {"type": "string", "description": "Who is approving?"},
                },
                "required": ["username"]
            }
        )
    )
    result = await server.get_context().session.send_request(request, ElicitResult)

    action = result.action
    username = result.content["username"]

    if action != "accept":
        return f"User {username} rejected deletion"

    # Implementation details

    return f"User {username} approved deletion"

server.run()
```

```Python
"""client.py"""

from mcp import stdio_client, StdioServerParameters
from mcp.types import ElicitResult

from strands import Agent
from strands.tools.mcp import MCPClient

async def elicitation_callback(context, params):
    print(f"ELICITATION: {params.message}")

    # Implementation details

    return ElicitResult(
        action="accept",  # or "decline" or "cancel"
        content={"username": "myname"}
    )

client = MCPClient(
    lambda: stdio_client(
        StdioServerParameters(command="python", args=["/path/to/server.py"])
    ),
    elicitation_callback=elicitation_callback,
)
with client:
    agent = Agent(tools=client.list_tools_sync(), callback_handler=None)

    result = agent("Delete 'a/b/c.txt' and share the name of the approver")
    print(f"RESULT: {result.message['content'][0]['text']}")
```

For more information on elicitation, please refer to the docs at [modelcontextprotocol.io](https://modelcontextprotocol.io/specification/draft/client/elicitation).

## Best Practices

- **Tool Descriptions**: Provide clear descriptions for your tools to help the agent understand when and how to use them
- **Parameter Types**: Use appropriate parameter types and descriptions to ensure correct tool usage
- **Error Handling**: Return informative error messages when tools fail to execute properly
- **Security**: Consider security implications when exposing tools via MCP, especially for network-accessible servers
- **Connection Management**: Always use context managers (`with` statements) to ensure proper cleanup of MCP connections
- **Timeouts**: Set appropriate timeouts for tool calls to prevent hanging on long-running operations

## Troubleshooting

### **MCPClientInitializationError**

AgentTools relying on an MCP connection must always be used within a context manager. When you create or use an agent outside a with statement, operations will fail because the MCP session is automatically closed once you exit the context manager block. The MCP connection must remain active throughout the agent's operations to maintain access to the tools and services it provides.

Correct usage:
```python
with mcp_client:
    agent = Agent(tools=mcp_client.list_tools_sync())
    response = agent("Your prompt")  # Works
```

Incorrect usage:
```python
with mcp_client:
    agent = Agent(tools=mcp_client.list_tools_sync())
response = agent("Your prompt")  # Will fail with MCPClientInitializationError
```
### **Connection Failures**
   Connection failures occur when there are problems establishing a connection with the MCP server. To resolve these issues, first ensure that the MCP server is running and accessible from your network environment. You should also verify your network connectivity and check if any firewall settings are blocking the connection. Additionally, make sure that the URL or command you're using to connect to the server is correct and properly formatted.

### **Tool Discovery Issues**
   When encountering tool discovery problems, first confirm that the MCP server has properly implemented the list_tools method as this is essential for tool discovery to function. It's also important to verify that all tools have been correctly registered with the server.

### **Tool Execution Errors**
   Tool execution errors can arise during the actual operation of MCP tools. To resolve these errors, verify that all tool arguments being passed match the expected schema for that particular tool. When errors occur, consulting the server logs can provide detailed information about what went wrong during the execution process.