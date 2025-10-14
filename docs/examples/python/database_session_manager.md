# Database Session Manager - SQL Database Persistence for Agent Sessions

This [example](https://github.com/strands-agents/docs/blob/main/docs/examples/python/database_session_manager.py) demonstrates how to use `DatabaseSessionManager` to persist agent sessions in SQL databases (PostgreSQL, MySQL, or SQLite). It showcases cloud-agnostic stateless architecture patterns and cost-effective session management at scale.

## Overview

| Feature            | Description                            |
| ------------------ | -------------------------------------- |
| **Session Manager**| DatabaseSessionManager                 |
| **Databases**      | PostgreSQL, MySQL, SQLite              |
| **Complexity**     | Intermediate                           |
| **Key Focus**      | Database Persistence & Connection Pooling |

## Why Database Sessions?

1. **Cloud-Agnostic Stateless Architecture**: Run agents in fully stateless environments with horizontal scaling and container orchestration
2. **Cost-Effective at Scale**: More economical than S3 API calls for high-volume agents with frequent read/write operations

## Prerequisites

Install Strands with database support:

```bash
pip install strands-agents[database]
```

Set up the database schema using Alembic migrations:

```bash
# Copy Alembic configuration from SDK repository
cp -r alembic/ your-project/
cp alembic.ini your-project/

# Configure your database connection in alembic.ini
# Then run migrations
alembic upgrade head
```

## Basic Usage

```python
from strands import Agent
from strands.models import OpenAIModel
from strands.session.database_session_manager import DatabaseSessionManager

# Get database connection string from environment
connection_string = os.environ.get(
    "DATABASE_URL",
    "sqlite:///./strands_sessions.db"  # Default to SQLite for testing
)

# Create a session manager with a unique session ID
session_manager = DatabaseSessionManager(
    session_id="user-123",
    connection_string=connection_string
)

# Create an agent with the session manager
agent = Agent(
    agent_id="assistant",
    model=OpenAIModel(model_id="gpt-4"),
    session_manager=session_manager,
    system_prompt="You are a helpful assistant that remembers previous conversations."
)

# First interaction - this will be persisted to the database
response = agent("My name is Alice and I love Python programming.")
```

## Production Usage with Shared Engine

For production environments (e.g., FastAPI), use a shared SQLAlchemy engine:

```python
from sqlalchemy import create_engine
from strands.session.database_session_manager import DatabaseSessionManager

# Create a shared engine with connection pooling
# In a real application, this would be created once at startup
engine = create_engine(
    "postgresql://user:pass@localhost:5432/strands_db",
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True  # Verify connections before use
)

# Create session managers with the shared engine
def get_session_manager(user_id: str):
    return DatabaseSessionManager(
        session_id=f"user-{user_id}",
        engine=engine  # Reuse the shared engine
    )

# Use in your application
session_manager = get_session_manager("123")
agent = Agent(
    agent_id="assistant",
    model=OpenAIModel(model_id="gpt-4"),
    session_manager=session_manager
)
```

## Supported Databases

**PostgreSQL:**
```python
connection_string = "postgresql://user:pass@localhost:5432/strands_db"
```

**MySQL:**
```python
connection_string = "mysql+pymysql://user:pass@localhost:3306/strands_db"
```

**SQLite:**
```python
# File-based
connection_string = "sqlite:///./sessions.db"

# In-memory (testing)
connection_string = "sqlite:///:memory:"
```

## Run the Example

```bash
# Set database connection (optional, defaults to SQLite)
export DATABASE_URL="postgresql://user:pass@localhost:5432/strands_db"

python database_session_manager.py
```

