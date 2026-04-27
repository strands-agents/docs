# Redis Session Manager

{{ community_contribution_banner }}

The [Redis Session Manager](https://github.com/lekhnath/strands-redis-session-manager) is a Redis-backed `SessionManager` implementation for Strands Agents. It persists agent conversation history and session state to Redis, enabling durable, stateful conversations across restarts and across multiple app instances in distributed deployments.

## Features

- Redis-backed persistence for Strands agent sessions
- Optional TTL support for auto-expiring sessions
- Simple integration with Strands Agents SDK

## Requirements

- Python 3.12+
- Strands Agents SDK 1.16.0+
- Redis 7.0.1+

## Installation

```bash
pip install strands-agents strands-redis-session-manager
```

## Usage

```python
from redis_session_manager import RedisSessionManager
from strands import Agent

# Initialize Redis session manager
session_manager = RedisSessionManager(
    session_id="my-session-id",
    redis_client=get_redis_client(),
    ttl_seconds=600,  # Optional: auto-expire sessions after 10 minutes
)

# Create your agent with session management
agent = Agent(
    agent_id="my-agent",
    model=your_model,
    session_manager=session_manager,
)

# Conversations are automatically persisted to Redis
agent("Hello, remember my name is Alice.")
agent("What is my name?")
```

## Resources

- **PyPI**: [strands-redis-session-manager](https://pypi.org/project/strands-redis-session-manager/)
- **GitHub**: [lekhnath/strands-redis-session-manager](https://github.com/lekhnath/strands-redis-session-manager)
- **Issues**: Report bugs and feature requests in the [GitHub repository](https://github.com/lekhnath/strands-redis-session-manager/issues)
