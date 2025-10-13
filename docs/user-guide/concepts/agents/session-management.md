# Session Management

Session management in Strands Agents provides a robust mechanism for persisting agent state and conversation history across multiple interactions. This enables agents to maintain context and continuity even when the application restarts or when deployed in distributed environments.

## Overview

A session represents all of the stateful information that is needed by an agent to function, including:

- Conversation history (messages)
- Agent state (key-value storage)
- Other stateful information (like [Conversation Manager](./state.md#conversation-manager))

Strands provides built-in session persistence capabilities that automatically capture and restore this information, allowing agents to seamlessly continue conversations where they left off.

## Basic Usage

Simply create an agent with a session manager and use it:

```python
from strands import Agent
from strands.session.file_session_manager import FileSessionManager

# Create a session manager with a unique session ID
session_manager = FileSessionManager(session_id="test-session")

# Create an agent with the session manager
agent = Agent(session_manager=session_manager)

# Use the agent - all messages and state are automatically persisted
agent("Hello!")  # This conversation is persisted
```

The conversation, and associated state, is persisted to the underlying filesystem.

## Built-in Session Managers

Strands offers three built-in session managers for persisting agent sessions:

1. [**FileSessionManager**](../../../api-reference/session.md#strands.session.file_session_manager.FileSessionManager): Stores sessions in the local filesystem
2. [**S3SessionManager**](../../../api-reference/session.md#strands.session.s3_session_manager.S3SessionManager): Stores sessions in Amazon S3 buckets
3. [**DynamoDBSessionManager**](../../../api-reference/session.md#strands.session.dynamodb_session_manager.DynamoDBSessionManager): Stores sessions in Amazon DynamoDB tables

### FileSessionManager

The [`FileSessionManager`](../../../api-reference/session.md#strands.session.file_session_manager.FileSessionManager) provides a simple way to persist agent sessions to the local filesystem:

```python
from strands import Agent
from strands.session.file_session_manager import FileSessionManager

# Create a session manager with a unique session ID
session_manager = FileSessionManager(
    session_id="user-123",
    storage_dir="/path/to/sessions"  # Optional, defaults to a temp directory
)

# Create an agent with the session manager
agent = Agent(session_manager=session_manager)

# Use the agent normally - state and messages will be persisted automatically
agent("Hello, I'm a new user!")
```

#### File Storage Structure

When using [`FileSessionManager`](../../../api-reference/session.md#strands.session.file_session_manager.FileSessionManager), sessions are stored in the following directory structure:

```
/<sessions_dir>/
└── session_<session_id>/
    ├── session.json                # Session metadata
    └── agents/
        └── agent_<agent_id>/
            ├── agent.json          # Agent metadata and state
            └── messages/
                ├── message_<message_id>.json
                └── message_<message_id>.json
```

### S3SessionManager

For cloud-based persistence, especially in distributed environments, use the [`S3SessionManager`](../../../api-reference/session.md#strands.session.s3_session_manager.S3SessionManager):

```python
from strands import Agent
from strands.session.s3_session_manager import S3SessionManager
import boto3

# Optional: Create a custom boto3 session
boto_session = boto3.Session(region_name="us-west-2")

# Create a session manager that stores data in S3
session_manager = S3SessionManager(
    session_id="user-456",
    bucket="my-agent-sessions",
    prefix="production/",  # Optional key prefix
    boto_session=boto_session,  # Optional boto3 session
    region_name="us-west-2"  # Optional AWS region (if boto_session not provided)
)

# Create an agent with the session manager
agent = Agent(session_manager=session_manager)

# Use the agent normally - state and messages will be persisted to S3
agent("Tell me about AWS S3")
```
#### S3 Storage Structure

Just like in the [`FileSessionManager`](../../../api-reference/session.md#strands.session.file_session_manager.FileSessionManager), sessions are stored with the following structure in the s3 bucket:

```
<s3_key_prefix>/
└── session_<session_id>/
    ├── session.json                # Session metadata
    └── agents/
        └── agent_<agent_id>/
            ├── agent.json          # Agent metadata and state
            └── messages/
                ├── message_<message_id>.json
                └── message_<message_id>.json
```

#### Required S3 Permissions

To use the [`S3SessionManager`](../../../api-reference/session.md#strands.session.s3_session_manager.S3SessionManager), your AWS credentials must have the following S3 permissions:

- `s3:PutObject` - To create and update session data
- `s3:GetObject` - To retrieve session data
- `s3:DeleteObject` - To delete session data
- `s3:ListBucket` - To list objects in the bucket

Here's a sample IAM policy that grants these permissions for a specific bucket:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::my-agent-sessions/*"
        },
        {
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::my-agent-sessions"
        }
    ]
}
```

### DynamoDBSessionManager

For high-performance, scalable session storage with low latency, use the [`DynamoDBSessionManager`](../../../api-reference/session.md#strands.session.dynamodb_session_manager.DynamoDBSessionManager):

```python
from strands import Agent
from strands.session import DynamoDBSessionManager
import boto3

# Optional: Create a custom boto3 session
boto_session = boto3.Session(region_name="us-east-1")

# Create a session manager that stores data in DynamoDB
session_manager = DynamoDBSessionManager(
    session_id="user-789",
    table_name="agent-sessions",
    boto_session=boto_session,  # Optional boto3 session
    region_name="us-east-1"  # Optional AWS region (if boto_session not provided)
)

# Create an agent with the session manager
agent = Agent(session_manager=session_manager)

# Use the agent normally - state and messages will be persisted to DynamoDB
agent("What are the benefits of DynamoDB?")
```

#### DynamoDB Table Structure

The [`DynamoDBSessionManager`](../../../api-reference/session.md#strands.session.dynamodb_session_manager.DynamoDBSessionManager) uses a single-table design optimized for efficient queries:

**Table Schema:**

- **PK (Partition Key)**: `session_<session_id>`
- **SK (Sort Key)**: `session` | `agent_<agent_id>` | `agent_<agent_id>#message_<message_id>`
- **entity_type**: `SESSION` | `AGENT` | `MESSAGE`
- **data**: Serialized entity data

**Example Table Contents:**

| PK             | SK                     | entity_type | data           |
|----------------|------------------------|-------------|----------------|
| session_abc123 | session                | SESSION     | {session_json} |
| session_abc123 | agent_agent1           | AGENT       | {agent_json}   |
| session_abc123 | agent_agent1#message_0 | MESSAGE     | {message_json} |
| session_abc123 | agent_agent1#message_1 | MESSAGE     | {message_json} |

#### Required DynamoDB Permissions

To use the [`DynamoDBSessionManager`](../../../api-reference/session.md#strands.session.dynamodb_session_manager.DynamoDBSessionManager), your AWS credentials must have the following DynamoDB permissions:

- `dynamodb:PutItem` - To create and update session data
- `dynamodb:GetItem` - To retrieve individual items
- `dynamodb:Query` - To list messages and query session data
- `dynamodb:BatchWriteItem` - To delete sessions efficiently

Here's a sample IAM policy that grants these permissions for a specific table:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:Query",
                "dynamodb:BatchWriteItem"
            ],
            "Resource": "arn:aws:dynamodb:us-east-1:123456789012:table/agent-sessions"
        }
    ]
}
```

#### Creating the DynamoDB Table

You need to create a DynamoDB table with the following configuration:

```bash
# Using AWS CLI
aws dynamodb create-table \
    --table-name agent-sessions \
    --attribute-definitions \
        AttributeName=PK,AttributeType=S \
        AttributeName=SK,AttributeType=S \
    --key-schema \
        AttributeName=PK,KeyType=HASH \
        AttributeName=SK,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST
```

Or using AWS CDK:

```typescript
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

new dynamodb.Table(this, 'AgentSessionMessageTable', {
      partitionKey: {
        name: 'PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
});
```

## How Session Management Works

The session management system in Strands Agents works through a combination of events, repositories, and data models:

### 1. Session Persistence Triggers

Session persistence is automatically triggered by several key events in the agent lifecycle:

- **Agent Initialization**: When an agent is created with a session manager, it automatically restores any existing state and messages from the session.
- **Message Addition**: When a new message is added to the conversation, it's automatically persisted to the session.
- **Agent Invocation**: After each agent invocation, the agent state is synchronized with the session to capture any updates.
- **Message Redaction**: When sensitive information needs to be redacted, the session manager can replace the original message with a redacted version while maintaining conversation flow.

!!! warning "After initializing the agent, direct modifications to `agent.messages` will not be persisted. Utilize the [Conversation Manager](./conversation-management.md) to help manage context of the agent in a way that can be persisted."


### 2. Data Models

Session data is stored using these key data models:

**Session**

The [`Session`](../../../api-reference/types.md#strands.types.session.Session) model is the top-level container for session data:

- **Purpose**: Provides a namespace for organizing multiple agents and their interactions
- **Key Fields**:
    - `session_id`: Unique identifier for the session
    - `session_type`: Type of session (currently "AGENT")
    - `created_at`: ISO format timestamp of when the session was created
    - `updated_at`: ISO format timestamp of when the session was last updated

**SessionAgent**

The [`SessionAgent`](../../../api-reference/types.md#strands.types.session.SessionAgent) model stores agent-specific data:

- **Purpose**: Maintains the state and configuration of a specific agent within a session
- **Key Fields**:
    - `agent_id`: Unique identifier for the agent within the session
    - `state`: Dictionary containing the agent's state data (key-value pairs)
    - `conversation_manager_state`: Dictionary containing the state of the conversation manager
    - `created_at`: ISO format timestamp of when the agent was created
    - `updated_at`: ISO format timestamp of when the agent was last updated

**SessionMessage**

The [`SessionMessage`](../../../api-reference/types.md#strands.types.session.SessionMessage) model stores individual messages in the conversation:

- **Purpose**: Preserves the conversation history with support for message redaction
- **Key Fields**:
    - `message`: The original message content (role, content blocks)
    - `redact_message`: Optional redacted version of the message (used when sensitive information is detected)
    - `message_id`: Index of the message in the agent's messages array
    - `created_at`: ISO format timestamp of when the message was created
    - `updated_at`: ISO format timestamp of when the message was last updated

These data models work together to provide a complete representation of an agent's state and conversation history. The session management system handles serialization and deserialization of these models, including special handling for binary data using base64 encoding.

## Custom Session Repositories

For advanced use cases, you can implement your own session storage backend by creating a custom session repository:

```python
from typing import Optional
from strands import Agent
from strands.session.repository_session_manager import RepositorySessionManager
from strands.session.session_repository import SessionRepository
from strands.types.session import Session, SessionAgent, SessionMessage

class CustomSessionRepository(SessionRepository):
    """Custom session repository implementation."""
    
    def __init__(self):
        """Initialize with your custom storage backend."""
        # Initialize your storage backend (e.g., database connection)
        self.db = YourDatabaseClient()
    
    def create_session(self, session: Session) -> Session:
        """Create a new session."""
        self.db.sessions.insert(asdict(session))
        return session
    
    def read_session(self, session_id: str) -> Optional[Session]:
        """Read a session by ID."""
        data = self.db.sessions.find_one({"session_id": session_id})
        if data:
            return Session.from_dict(data)
        return None
    
    # Implement other required methods...
    # create_agent, read_agent, update_agent
    # create_message, read_message, update_message, list_messages

# Use your custom repository with RepositorySessionManager
custom_repo = CustomSessionRepository()
session_manager = RepositorySessionManager(
    session_id="user-789",
    session_repository=custom_repo
)

agent = Agent(session_manager=session_manager)
```

This approach allows you to store session data in any backend system while leveraging the built-in session management logic.

## Session Persistence Best Practices

When implementing session persistence in your applications, consider these best practices:

- **Use Unique Session IDs**: Generate unique session IDs for each user or conversation context to prevent data overlap.

- **Session Cleanup**: Implement a strategy for cleaning up old or inactive sessions. Consider adding TTL (Time To Live) for sessions in production environments

- **Understand Persistence Triggers**: Remember that changes to agent state or messages are only persisted during specific lifecycle events

