# AgentCore Memory Session Manager

{{ community_contribution_banner }}

The [AgentCore Memory Session Manager](https://github.com/aws/bedrock-agentcore-sdk-python/tree/main/src/bedrock_agentcore/memory/integrations/strands) leverages Amazon Bedrock AgentCore Memory to provide advanced memory capabilities with intelligent retrieval for Strands Agents. It supports both short-term memory (STM) for conversation persistence and long-term memory (LTM) with multiple strategies for learning user preferences, facts, and session summaries.

## Installation

```bash
pip install 'bedrock-agentcore[strands-agents]'
```

## Usage

### Basic Setup (Short-Term Memory)

```python
from strands import Agent
from bedrock_agentcore.memory import MemoryClient
from bedrock_agentcore.memory.integrations.strands.config import AgentCoreMemoryConfig
from bedrock_agentcore.memory.integrations.strands.session_manager import AgentCoreMemorySessionManager
from datetime import datetime

# Create a basic memory for short-term functionality
client = MemoryClient(region_name="us-east-1")
basic_memory = client.create_memory(
    name="BasicTestMemory",
    description="Basic memory for testing short-term functionality"
)

# Configure memory
agentcore_memory_config = AgentCoreMemoryConfig(
    memory_id=basic_memory.get('id'),
    session_id=f"session_{datetime.now().strftime('%Y%m%d%H%M%S')}",
    actor_id=f"user_{datetime.now().strftime('%Y%m%d%H%M%S')}"
)

# Create session manager
session_manager = AgentCoreMemorySessionManager(
    agentcore_memory_config=agentcore_memory_config,
    region_name="us-east-1"
)

# Create agent
agent = Agent(
    system_prompt="You are a helpful assistant. Use all you know about the user to provide helpful responses.",
    session_manager=session_manager,
)

# Use the agent - conversations are persisted with intelligent retrieval
agent("I like sushi with tuna")
agent("What should I buy for lunch today?")  # Agent remembers preferences
```

### Advanced Setup (Long-Term Memory)

For more sophisticated memory capabilities, create a memory with multiple strategies:

```python
from bedrock_agentcore.memory.integrations.strands.config import RetrievalConfig

# Create comprehensive memory with all built-in strategies
comprehensive_memory = client.create_memory_and_wait(
    name="ComprehensiveAgentMemory",
    description="Full-featured memory with all built-in strategies",
    strategies=[
        {
            "summaryMemoryStrategy": {
                "name": "SessionSummarizer",
                "namespaces": ["/summaries/{actorId}/{sessionId}"]
            }
        },
        {
            "userPreferenceMemoryStrategy": {
                "name": "PreferenceLearner",
                "namespaces": ["/preferences/{actorId}"]
            }
        },
        {
            "semanticMemoryStrategy": {
                "name": "FactExtractor",
                "namespaces": ["/facts/{actorId}"]
            }
        }
    ]
)

# Configure with multiple namespace retrieval
config = AgentCoreMemoryConfig(
    memory_id=comprehensive_memory.get('id'),
    session_id=f"session_{datetime.now().strftime('%Y%m%d%H%M%S')}",
    actor_id=f"user_{datetime.now().strftime('%Y%m%d%H%M%S')}",
    retrieval_config={
        "/preferences/{actorId}": RetrievalConfig(
            top_k=5,
            relevance_score=0.7
        ),
        "/facts/{actorId}": RetrievalConfig(
            top_k=10,
            relevance_score=0.3
        ),
        "/summaries/{actorId}/{sessionId}": RetrievalConfig(
            top_k=5,
            relevance_score=0.5
        )
    }
)

session_manager = AgentCoreMemorySessionManager(config, region_name='us-east-1')
agent = Agent(session_manager=session_manager)
```

## Configuration

### Memory Strategies

AgentCore Memory supports three built-in strategies:

1. **summaryMemoryStrategy**: Automatically summarizes conversation sessions for efficient context retrieval
2. **userPreferenceMemoryStrategy**: Learns and stores user preferences across sessions
3. **semanticMemoryStrategy**: Extracts and stores factual information from conversations

### AgentCoreMemoryConfig Parameters

- `memory_id`: ID of the Bedrock AgentCore Memory resource
- `session_id`: Unique identifier for the conversation session
- `actor_id`: Unique identifier for the user/actor
- `retrieval_config`: Dictionary mapping namespaces to RetrievalConfig objects

### RetrievalConfig Parameters

- `top_k`: Number of top results to retrieve (default: 5)
- `relevance_score`: Minimum relevance threshold (0.0-1.0)

### Namespace Patterns

- `/preferences/{actorId}`: User-specific preferences across sessions
- `/facts/{actorId}`: User-specific factual information
- `/summaries/{actorId}/{sessionId}`: Session-specific conversation summaries

## Important Notes

> **Session Limitations:** Currently, only **one** agent per session is supported when using AgentCoreMemorySessionManager. Creating multiple agents with the same session will show a warning.

## Resources

- **GitHub**: [bedrock-agentcore-sdk-python](https://github.com/aws/bedrock-agentcore-sdk-python/)
- **Documentation**: [Strands Integration Examples](https://github.com/aws/bedrock-agentcore-sdk-python/tree/main/src/bedrock_agentcore/memory/integrations/strands)
- **Issues**: Report bugs and feature requests in the [bedrock-agentcore-sdk-python repository](https://github.com/aws/bedrock-agentcore-sdk-python/issues/new/choose)
