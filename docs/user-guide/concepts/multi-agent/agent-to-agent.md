# Agent-to-Agent (A2A) Protocol

Strands Agents provides experimental support for the [Agent-to-Agent (A2A) protocol](https://a2aproject.github.io/A2A/latest/), enabling seamless communication between AI agents across different platforms and implementations.

!!! warning "Experimental Feature"
    A2A support in Strands is currently **EXPERIMENTAL**. APIs may change, and additional functionality will be added in future releases. If you encounter bugs or have feature requests, please [report them on GitHub](https://github.com/strands-agents/sdk-python/issues/new/choose).

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

## Installation

To use A2A functionality with Strands, install the package with the A2A extra:

```bash
pip install strands-agents[a2a]
```

This installs the core Strands SDK along with the necessary A2A protocol dependencies.

## Basic Example

Here's a simple example to get started with A2A communication:

### Step 1: Install Dependencies

```bash
pip install strands-agents[a2a]
```

### Step 2: Create and Run the Server

Create `server.py`:

```python
from strands import Agent
from strands.multiagent.a2a import A2AAgent

# Create a basic agent
agent = Agent(name="AI assistant", description="A helpful AI assistant")

# Wrap it with A2A capabilities
a2a_agent = A2AAgent(agent=agent)

# Start the A2A server
print("Starting A2A server on http://localhost:9000")
a2a_agent.serve()
```

Run the server:

```bash
python server.py
```

### Step 3: Create and Run the Client

Create `client.py`:

```python
import asyncio
from uuid import uuid4

import httpx
from a2a.client import A2ACardResolver, A2AClient
from a2a.types import MessageSendParams, SendMessageRequest


async def ask_agent(message: str):
    async with httpx.AsyncClient() as httpx_client:
        # Connect to the agent
        resolver = A2ACardResolver(httpx_client=httpx_client, base_url="http://localhost:9000")

        agent_card = await resolver.get_agent_card()
        print(agent_card)
        client = A2AClient(httpx_client=httpx_client, agent_card=agent_card)

        # Send the message
        request = SendMessageRequest(
            id=str(uuid4()),
            params=MessageSendParams(
                message={
                    "role": "user",
                    "parts": [{"kind": "text", "text": message}],
                    "messageId": uuid4().hex,
                }
            ),
        )

        return await client.send_message(request)


# Example usage
async def main():
    message = "Tell me about agentic AI"
    response = await ask_agent(message)
    print(response.model_dump(mode="json", exclude_none=True))


if __name__ == "__main__":
    asyncio.run(main())

```

Run the client (make sure your server is running first):

```bash
python client.py
```

## Troubleshooting

If you encounter bugs or need to request features for A2A support:

1. Check the [A2A documentation](https://a2aproject.github.io/A2A/latest/) for protocol-specific issues
2. Report Strands-specific issues on [GitHub](https://github.com/strands-agents/sdk-python/issues/new/choose)
3. Include relevant error messages and code samples in your reports
