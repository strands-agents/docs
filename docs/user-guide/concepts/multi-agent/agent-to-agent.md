# Agent-to-Agent (A2A) Protocol

Strands Agents supports the [Agent-to-Agent (A2A) protocol](https://a2aproject.github.io/A2A/latest/), enabling seamless communication between AI agents across different platforms and implementations.

## What is Agent-to-Agent (A2A)?

The Agent-to-Agent protocol is an open standard that defines how AI agents can discover, communicate, and collaborate with each other.

### Use Cases

A2A protocol support enables several powerful use cases:

- **Multi-Agent Workflows**: Chain multiple specialized agents together
- **Agent Marketplaces**: Discover and use agents from different providers
- **Cross-Platform Integration**: Connect Strands agents with other A2A-compatible systems
- **Distributed AI Systems**: Build scalable, distributed agent architectures

Learn more about the A2A protocol:

- [A2A GitHub Organization](https://github.com/a2aproject/A2A)
- [A2A Python SDK](https://github.com/a2aproject/a2a-python)
- [A2A Documentation](https://a2aproject.github.io/A2A/latest/)

!!! tip "Complete Examples Available"
    Check out the [Native A2A Support samples](https://github.com/strands-agents/samples/tree/main/03-integrations/Native-A2A-Support) for complete, ready-to-run client, server and tool implementations.

## Installation

To use A2A functionality with Strands, install the package with the A2A extra:

```bash
pip install 'strands-agents[a2a]'
```

This installs the core Strands SDK along with the necessary A2A protocol dependencies.

## Creating an A2A Server

### Basic Server Setup

Create a Strands agent and expose it as an A2A server:

```python
import logging
from strands_tools.calculator import calculator
from strands import Agent
from strands.multiagent.a2a import A2AServer

logging.basicConfig(level=logging.INFO)

# Create a Strands agent
strands_agent = Agent(
    name="Calculator Agent",
    description="A calculator agent that can perform basic arithmetic operations.",
    tools=[calculator],
    callback_handler=None
)

# Create A2A server (streaming enabled by default)
a2a_server = A2AServer(agent=strands_agent)

# Start the server
a2a_server.serve()
```

> NOTE: the server supports both `SendMessageRequest` and `SendStreamingMessageRequest` client requests!

### Server Configuration Options

The `A2AServer` constructor accepts several configuration options:

- `agent`: The Strands Agent to wrap with A2A compatibility
- `host`: Hostname or IP address to bind to (default: "0.0.0.0")
- `port`: Port to bind to (default: 9000)
- `version`: Version of the agent (default: "0.0.1")
- `skills`: Custom list of agent skills (default: auto-generated from tools)
- `http_url`: Public HTTP URL where this agent will be accessible (optional, enables path-based mounting)
- `serve_at_root`: Forces server to serve at root path regardless of http_url path (default: False)

### Advanced Server Customization

The `A2AServer` provides access to the underlying FastAPI or Starlette application objects allowing you to further customize server behavior.

```python
from strands import Agent
from strands.multiagent.a2a import A2AServer
import uvicorn

# Create your agent and A2A server
agent = Agent(name="My Agent", description="A customizable agent", callback_handler=None)
a2a_server = A2AServer(agent=agent)

# Access the underlying FastAPI app
fastapi_app = a2a_server.to_fastapi_app()
# Add custom middleware, routes, or configuration
fastapi_app.add_middleware(...)

# Or access the Starlette app
starlette_app = a2a_server.to_starlette_app()
# Customize as needed

# You can then serve the customized app directly
uvicorn.run(fastapi_app, host="0.0.0.0", port=9000)
```

#### Path-Based Mounting for Containerized Deployments

The `A2AServer` supports automatic path-based mounting for deployment scenarios involving load balancers or reverse proxies. This allows you to deploy agents behind load balancers with different path prefixes.

```python
from strands import Agent
from strands.multiagent.a2a import A2AServer

# Create an agent
agent = Agent(
    name="Calculator Agent",
    description="A calculator agent",
    callback_handler=None
)

# Deploy with path-based mounting
# The agent will be accessible at http://my-alb.amazonaws.com/calculator/
a2a_server = A2AServer(
    agent=agent,
    http_url="http://my-alb.amazonaws.com/calculator"
)

# For load balancers that strip path prefixes, use serve_at_root=True
a2a_server_with_root = A2AServer(
    agent=agent,
    http_url="http://my-alb.amazonaws.com/calculator",
    serve_at_root=True  # Serves at root even though URL has /calculator path
)
```

This flexibility allows you to:

- Add custom middleware
- Implement additional API endpoints
- Deploy agents behind load balancers with different path prefixes

## A2A Client Examples

### Synchronous Client

Here's how to create a client that communicates with an A2A server synchronously:

```python
import asyncio
import logging
from uuid import uuid4

import httpx
from a2a.client import A2ACardResolver, ClientConfig, ClientFactory
from a2a.types import Message, Part, Role, TextPart

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DEFAULT_TIMEOUT = 300 # set request timeout to 5 minutes

def create_message(*, role: Role = Role.user, text: str) -> Message:
    return Message(
        kind="message",
        role=role,
        parts=[Part(TextPart(kind="text", text=text))],
        message_id=uuid4().hex,
    )

async def send_sync_message(message: str, base_url: str = "http://localhost:9000"):
    async with httpx.AsyncClient(timeout=DEFAULT_TIMEOUT) as httpx_client:
        # Get agent card
        resolver = A2ACardResolver(httpx_client=httpx_client, base_url=base_url)
        agent_card = await resolver.get_agent_card()

        # Create client using factory
        config = ClientConfig(
            httpx_client=httpx_client,
            streaming=False,  # Use non-streaming mode for sync response
        )
        factory = ClientFactory(config)
        client = factory.create(agent_card)

        # Create and send message
        msg = create_message(text=message)

        # With streaming=False, this will yield exactly one result
        async for event in client.send_message(msg):
            if isinstance(event, Message):
                logger.info(event.model_dump_json(exclude_none=True, indent=2))
                return event
            elif isinstance(event, tuple) and len(event) == 2:
                # (Task, UpdateEvent) tuple
                task, update_event = event
                logger.info(f"Task: {task.model_dump_json(exclude_none=True, indent=2)}")
                if update_event:
                    logger.info(f"Update: {update_event.model_dump_json(exclude_none=True, indent=2)}")
                return task
            else:
                # Fallback for other response types
                logger.info(f"Response: {str(event)}")
                return event

# Usage
asyncio.run(send_sync_message("what is 101 * 11"))
```

### Streaming Client

For streaming responses, use the streaming client:

```python
import asyncio
import logging
from uuid import uuid4

import httpx
from a2a.client import A2ACardResolver, ClientConfig, ClientFactory
from a2a.types import Message, Part, Role, TextPart

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DEFAULT_TIMEOUT = 300 # set request timeout to 5 minutes

def create_message(*, role: Role = Role.user, text: str) -> Message:
    return Message(
        kind="message",
        role=role,
        parts=[Part(TextPart(kind="text", text=text))],
        message_id=uuid4().hex,
    )

async def send_streaming_message(message: str, base_url: str = "http://localhost:9000"):
    async with httpx.AsyncClient(timeout=DEFAULT_TIMEOUT) as httpx_client:
        # Get agent card
        resolver = A2ACardResolver(httpx_client=httpx_client, base_url=base_url)
        agent_card = await resolver.get_agent_card()

        # Create client using factory
        config = ClientConfig(
            httpx_client=httpx_client,
            streaming=True,  # Use streaming mode
        )
        factory = ClientFactory(config)
        client = factory.create(agent_card)

        # Create and send message
        msg = create_message(text=message)

        async for event in client.send_message(msg):
            if isinstance(event, Message):
                logger.info(event.model_dump_json(exclude_none=True, indent=2))
            elif isinstance(event, tuple) and len(event) == 2:
                # (Task, UpdateEvent) tuple
                task, update_event = event
                logger.info(f"Task: {task.model_dump_json(exclude_none=True, indent=2)}")
                if update_event:
                    logger.info(f"Update: {update_event.model_dump_json(exclude_none=True, indent=2)}")
            else:
                # Fallback for other response types
                logger.info(f"Response: {str(event)}")

# Usage
asyncio.run(send_streaming_message("what is 101 * 11"))
```

## Strands A2A Tool

### Installation

To use the A2A client tool, install strands-agents-tools with the A2A extra:

```bash
pip install 'strands-agents-tools[a2a_client]'
```

Strands provides this tool for discovering and interacting with A2A agents without manually writing client code:

```python
import asyncio
import logging
from strands import Agent
from strands_tools.a2a_client import A2AClientToolProvider

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create A2A client tool provider with known agent URLs
# Assuming you have an A2A server running on localhost:9000
# known_agent_urls is optional
provider = A2AClientToolProvider(known_agent_urls=["http://localhost:9000"])

# Create agent with A2A client tools
agent = Agent(tools=provider.tools)

# The agent can now discover and interact with A2A servers
# Standard usage
response = agent("pick an agent and make a sample call")
logger.info(response)

# Alternative Async usage
# async def main():
#     response = await agent.invoke_async("pick an agent and make a sample call")
#     logger.info(response)
# asyncio.run(main())
```

This approach allows your Strands agent to:

- Automatically discover available A2A agents
- Interact with them using natural language
- Chain multiple agent interactions together

## Troubleshooting

If you encounter bugs or need to request features for A2A support:

1. Check the [A2A documentation](https://a2aproject.github.io/A2A/latest/) for protocol-specific issues
2. Report Strands-specific issues on [GitHub](https://github.com/strands-agents/sdk-python/issues/new/choose)
3. Include relevant error messages and code samples in your reports
