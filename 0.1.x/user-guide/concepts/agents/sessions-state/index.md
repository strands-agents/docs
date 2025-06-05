# Sessions & State

This document explains how Strands agents maintain conversation context, handle state management, and support persistent sessions across interactions.

Strands agents maintain state in several forms:

1. **Conversation History**: The sequence of messages between the user and the agent
1. **Tool State**: Information about tool executions and results
1. **Request State**: Contextual information maintained within a single request

Understanding how state works in Strands is essential for building agents that can maintain context across multi-turn interactions and workflows.

## Conversation History

The primary form of state in a Strands agent is the conversation history, directly accessible through the `agent.messages` property:

```
from strands import Agent

# Create an agent
agent = Agent()

# Send a message and get a response
agent("Hello!")

# Access the conversation history
print(agent.messages)  # Shows all messages exchanged so far

```

The `agent.messages` list contains all user and assistant messages, including tool calls and tool results. This is the primary way to inspect what's happening in your agent's conversation.

You can initialize an agent with existing messages to continue a conversation or pre-fill your Agent's context with information:

```
from strands import Agent

# Create an agent with initial messages
agent = Agent(messages=[
    {"role": "user", "content": [{"text": "Hello, my name is Strands!"}]},
    {"role": "assistant", "content": [{"text": "Hi there! How can I help you today?"}]}
])

# Continue the conversation
agent("What's my name?")

```

Conversation history is automatically:

- Maintained between calls to the agent
- Passed to the model during each inference
- Used for tool execution context
- Managed to prevent context window overflow

## Conversation Manager

Strands uses a conversation manager to handle conversation history effectively. The default is the [`SlidingWindowConversationManager`](../../../../api-reference/agent/#strands.agent.conversation_manager.sliding_window_conversation_manager.SlidingWindowConversationManager), which keeps recent messages and removes older ones when needed:

```
from strands import Agent
from strands.agent.conversation_manager import SlidingWindowConversationManager

# Create a conversation manager with custom window size
# By default, SlidingWindowConversationManager is used even if not specified
conversation_manager = SlidingWindowConversationManager(
    window_size=10,  # Maximum number of message pairs to keep
)

# Use the conversation manager with your agent
agent = Agent(conversation_manager=conversation_manager)

```

The sliding window conversation manager:

- Keeps the most recent N message pairs
- Removes the oldest messages when the window size is exceeded
- Handles context window overflow exceptions by reducing context
- Ensures conversations don't exceed model context limits

## Tool State

When an agent uses tools, the tool executions and results become part of the conversation state:

```
from strands import Agent
from strands_tools import calculator

agent = Agent(tools=[calculator])

# Tool use is recorded in the conversation history
agent("What is 123 × 456?")  # Uses calculator tool and records result

# You can examine the tool interactions in the conversation history
print(agent.messages)  # Shows tool calls and results

```

Tool state includes:

- Tool use requests from the model
- Tool execution parameters
- Tool execution results
- Any errors or exceptions that occurred

Direct tool calls can also be recorded in the conversation history:

```
from strands import Agent
from strands_tools import calculator

agent = Agent(tools=[calculator])

# Direct tool call with recording (default behavior)
agent.tool.calculator(expression="123 * 456")

# Direct tool call without recording
agent.tool.calculator(expression="765 / 987", record_direct_tool_call=False)

print(agent.messages)

```

In this example we can see that the first `agent.tool.calculator()` call is recorded in the agent's conversation history.

The second `agent.tool.calculator()` call is **not** recorded in the history because we specified the `record_direct_tool_call=False` argument.

## Request State

Each agent interaction maintains a request state dictionary that persists throughout the event loop cycles and is **not** included in the agent's context:

```
from strands import Agent

def custom_callback_handler(**kwargs):
    # Access request state
    if "request_state" in kwargs:
        state = kwargs["request_state"]
        # Use or modify state as needed
        if "counter" not in state:
            state["counter"] = 0
        state["counter"] += 1
        print(f"Callback handler event count: {state['counter']}")

agent = Agent(callback_handler=custom_callback_handler)

result = agent("Hi there!")

print(result.state)

```

The request state:

- Is initialized at the beginning of each agent call
- Persists through recursive event loop cycles
- Can be modified by tools and handlers
- Is returned in the AgentResult object

## Session Management

For applications requiring persistent sessions across separate interactions, Strands provides several approaches:

### 1. Object Persistence

The simplest approach is to maintain the Agent object across requests:

```
from strands import Agent

# Create agent once
agent = Agent()

# Use in multiple requests
def handle_request(user_message):
    return agent(user_message)

handle_request("Tell me a fun fact")
handle_request("Tell me a related fact")

```

### 2. Serialization and Restoration

For distributed systems or applications that can't maintain object references:

```
import json
import os
import uuid
from strands import Agent

# Save agent state
def save_agent_state(agent, session_id):
    os.makedirs("sessions", exist_ok=True)

    state = {
        "messages": agent.messages,
        "system_prompt": agent.system_prompt
    }
    # Store state (e.g., database, file system, cache)
    with open(f"sessions/{session_id}.json", "w") as f:
        json.dump(state, f)

# Restore agent state
def restore_agent_state(session_id):
    # Retrieve state
    with open(f"sessions/{session_id}.json", "r") as f:
        state = json.load(f)

    # Create agent with restored state
    return Agent(
        messages=state["messages"],
        system_prompt=state["system_prompt"]
    )

agent = Agent(system_prompt="Talk like a pirate")
agent_id = uuid.uuid4()

print("Initial agent:")
agent("Where are Octopus found? 🐙")
save_agent_state(agent, agent_id)

# Create a new Agent object with the previous agent's saved state
restored_agent = restore_agent_state(agent_id)
print("\n\nRestored agent:")
restored_agent("What did we just talk about?")

print("\n\n")
print(restored_agent.messages)  # Both messages and responses are in the restored agent's conversation history

```

### 3. Integrating with Web Frameworks

Strands agents can be integrated with web framework session management:

```
from flask import Flask, request, session
from strands import Agent

app = Flask(__name__)
app.secret_key = "your-secret-key"

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json["message"]

    # Initialize or restore agent conversation history from session
    if "messages" not in session:
        session["messages"] = []

    # Create agent with session state
    agent = Agent(messages=session["messages"])

    # Process message
    result = agent(user_message)

    # Update session with new messages
    session["messages"] = agent.messages

    # Return the agent's final message
    return {"response": result.message}

```

## Custom Conversation Management

For specialized requirements, you can implement your own conversation manager:

```
from strands.agent.conversation_manager import ConversationManager
from strands.types.content import Messages
from typing import Optional

class CustomConversationManager(ConversationManager):
    def apply_management(self, messages: Messages) -> None:
        """Apply management strategies to the messages list."""
        # Implement your management strategy
        pass

    def reduce_context(self, messages: Messages, e: Optional[Exception] = None) -> None:
        """Reduce context to handle overflow exceptions."""
        # Implement your reduction strategy
        pass

```
