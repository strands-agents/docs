"""
Database Session Manager Example

This example demonstrates how to use DatabaseSessionManager to persist agent sessions
in SQL databases (PostgreSQL, MySQL, or SQLite).

Prerequisites:
1. Install Strands with database support:
   pip install strands-agents[database]

2. Set up the database schema using Alembic:
   - Copy the Alembic configuration from the SDK repository
   - Configure your database connection in alembic.ini
   - Run: alembic upgrade head

Environment Variables:
- DATABASE_URL: Database connection string (default: sqlite:///./strands_sessions.db)

Supported Connection Strings:
- PostgreSQL: postgresql://user:pass@localhost:5432/strands_db
- MySQL: mysql+pymysql://user:pass@localhost:3306/strands_db
- SQLite: sqlite:///./strands_sessions.db
"""

import os
from strands import Agent
from strands.models import OpenAIModel
from strands.session.database_session_manager import DatabaseSessionManager


def basic_usage_example():
    """Basic usage with a connection string."""
    print("\n=== Basic Database Session Manager Example ===\n")
    
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
    print(f"Agent: {response}")
    
    print("\n--- Creating a new agent instance with the same session ---\n")
    
    # Create a new agent instance with the same session_id
    # This demonstrates persistence - the agent will remember the previous conversation
    new_session_manager = DatabaseSessionManager(
        session_id="user-123",
        connection_string=connection_string
    )
    
    new_agent = Agent(
        agent_id="assistant",
        model=OpenAIModel(model_id="gpt-4"),
        session_manager=new_session_manager,
        system_prompt="You are a helpful assistant that remembers previous conversations."
    )
    
    # The agent should remember Alice and her interest in Python
    response = new_agent("What's my name and what do I like?")
    print(f"Agent: {response}")


def production_usage_example():
    """Production usage with a shared SQLAlchemy engine for connection pooling."""
    print("\n=== Production Example with Shared Engine ===\n")
    
    from sqlalchemy import create_engine
    
    # Get database connection string from environment
    connection_string = os.environ.get(
        "DATABASE_URL",
        "sqlite:///./strands_sessions.db"
    )
    
    # Create a shared engine with connection pooling
    # In a real application, this would be created once at startup
    engine = create_engine(
        connection_string,
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
    
    # Create agents for different users
    session_manager_1 = get_session_manager("001")
    session_manager_2 = get_session_manager("002")
    
    agent_1 = Agent(
        agent_id="assistant",
        model=OpenAIModel(model_id="gpt-4"),
        session_manager=session_manager_1,
        system_prompt="You are a helpful assistant."
    )
    
    agent_2 = Agent(
        agent_id="assistant",
        model=OpenAIModel(model_id="gpt-4"),
        session_manager=session_manager_2,
        system_prompt="You are a helpful assistant."
    )
    
    # Each agent has its own isolated session
    response_1 = agent_1("I'm user 001. Remember that I prefer technical explanations.")
    print(f"User 001 - Agent: {response_1}")
    
    response_2 = agent_2("I'm user 002. Remember that I prefer simple explanations.")
    print(f"User 002 - Agent: {response_2}")
    
    print("\nBoth sessions are persisted independently in the database.")


if __name__ == "__main__":
    print("Database Session Manager Examples")
    print("=" * 50)
    
    # Run the examples
    try:
        basic_usage_example()
    except Exception as e:
        print(f"Error in basic usage example: {e}")
    
    try:
        production_usage_example()
    except Exception as e:
        print(f"Error in production example: {e}")
    
    print("\n" + "=" * 50)
    print("Examples completed!")
    print("\nNote: Make sure you have:")
    print("1. Installed strands-agents[database]")
    print("2. Set up the database schema with Alembic migrations")
    print("3. Set DATABASE_URL environment variable (optional)")
