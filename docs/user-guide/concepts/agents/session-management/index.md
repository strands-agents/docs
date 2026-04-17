Session management in Strands Agents provides a robust mechanism for persisting agent state and conversation history across multiple interactions. This enables agents to maintain context and continuity even when the application restarts or when deployed in distributed environments.

## Overview

A session represents all of stateful information that is needed by agents and multi-agent systems to function, including:

**Single Agent Sessions**:

-   Conversation history (messages)
-   Agent state (key-value storage)
-   Other stateful information (like [Conversation Manager](/docs/user-guide/concepts/agents/state/index.md#conversation-manager))

**Multi-Agent Sessions**:

-   Orchestrator state and configuration
-   Individual agent states and result within the orchestrator
-   Cross-agent shared state and context
-   Execution flow and node transition history

Strands provides built-in session persistence capabilities that automatically capture and restore this information, allowing agents to seamlessly continue conversations where they left off.

Beyond the built-in options, [third-party session managers](#third-party-session-managers) provide additional storage and memory capabilities.

## Basic Usage

### Single Agent Sessions

Simply create an agent with a session manager and use it:

(( tab "Python" ))
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
(( /tab "Python" ))

(( tab "TypeScript" ))
`SessionManager` implements both [Plugin](/docs/user-guide/concepts/plugins/index.md) (for agents) and `MultiAgentPlugin` (for orchestrators). The `sessionManager` constructor field is a convenience shorthand — you can also pass it directly in the `plugins` array:

```typescript
const session = new SessionManager({
  sessionId: 'test-session',
  storage: { snapshot: new FileStorage('./sessions') },
})

const agent = new Agent({ sessionManager: session })

// Use the agent - all messages and state are automatically persisted
await agent.invoke('Hello!') // This conversation is persisted
```

```typescript
const session = new SessionManager({
  sessionId: 'test-session',
  storage: { snapshot: new FileStorage('./sessions') },
})

// Equivalent to passing via sessionManager field
const agent = new Agent({ plugins: [session] })
await agent.invoke('Hello!')
```
(( /tab "TypeScript" ))

The conversation, and associated state, is persisted to the underlying storage backend.

### Multi-Agent Sessions

Multi-agent systems (Graph/Swarm) can also use session management to persist their state.

(( tab "Python" ))
Caution

Agents inside a multi-agent system must not have their own session manager — only the orchestrator should have one. Python will raise a `ValueError` if an agent with a session manager is added to a Graph or Swarm.

```python
from strands.multiagent import GraphBuilder
from strands.session.file_session_manager import FileSessionManager

# Create agents
agent1 = Agent(name="researcher")
agent2 = Agent(name="writer")

# Create a session manager for the graph
session_manager = FileSessionManager(session_id="multi-agent-session")

# Create graph with session management
graph = Graph(
    agents={"researcher": agent1, "writer": agent2},
    session_manager=session_manager
)

# Use the graph - all orchestrator state is persisted
result = graph("Research and write about AI")
```
(( /tab "Python" ))

(( tab "TypeScript" ))
Caution

Agents inside a multi-agent system must not have their own session manager — only the orchestrator should have one. The orchestrator snapshots and restores each agent node’s state on every execution, so an agent-level session manager would conflict with the orchestrator’s persistence.

```typescript
const session = new SessionManager({
  sessionId: 'graph-session',
  storage: { snapshot: new FileStorage('./sessions') },
})

const researcher = new Agent({
  id: 'researcher',
  systemPrompt: 'You are a research specialist.',
})
const writer = new Agent({
  id: 'writer',
  systemPrompt: 'You are a writing specialist.',
})

const graph = new Graph({
  nodes: [researcher, writer],
  edges: [['researcher', 'writer']],
  sessionManager: session,
})

// Orchestrator state is automatically persisted after each node completes
const result = await graph.invoke('Research and write about AI')
```

Swarm works the same way:

```typescript
const session = new SessionManager({
  sessionId: 'swarm-session',
  storage: { snapshot: new FileStorage('./sessions') },
})

const researcher = new Agent({
  id: 'researcher',
  description: 'Researches a topic and gathers key facts.',
  systemPrompt: 'Research the answer, then hand off to the writer.',
})

const writer = new Agent({
  id: 'writer',
  description: 'Writes a polished final answer.',
  systemPrompt: 'Write the final answer. Do not hand off.',
})

const swarm = new Swarm({
  nodes: [researcher, writer],
  start: 'researcher',
  sessionManager: session,
})

const result = await swarm.invoke('Explain quantum computing')
```
(( /tab "TypeScript" ))

Multi-agent session managers only track the current state of the Graph/Swarm execution and do not persist individual agent conversation histories.

## Built-in Session Managers

(( tab "Python" ))
Strands offers two built-in session managers for persisting agent sessions:

1.  [**FileSessionManager**](/docs/api/python/strands.session.file_session_manager#FileSessionManager): Stores sessions in the local filesystem
2.  [**S3SessionManager**](/docs/api/python/strands.session.s3_session_manager#S3SessionManager): Stores sessions in Amazon S3 buckets
(( /tab "Python" ))

(( tab "TypeScript" ))
The TypeScript SDK uses a single `SessionManager` class paired with a pluggable storage backend:

1.  **`FileStorage`**: Stores snapshots on the local filesystem
2.  **`S3Storage`**: Stores snapshots in Amazon S3
(( /tab "TypeScript" ))

### FileSessionManager / FileStorage

(( tab "Python" ))
The [`FileSessionManager`](/docs/api/python/strands.session.file_session_manager#FileSessionManager) provides a simple way to persist both single agent and multi-agent sessions to the local filesystem:

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

# Multi-agent usage
multi_session_manager = FileSessionManager(
    session_id="orchestrator-456",
    storage_dir="/path/to/sessions"
)
graph = Graph(
    agents={"agent1": agent1, "agent2": agent2},
    session_manager=multi_session_manager
)
```
(( /tab "Python" ))

(( tab "TypeScript" ))
`FileStorage` persists snapshots to the local filesystem. Pass it to `SessionManager` via the `storage.snapshot` config:

```typescript
const session = new SessionManager({
  sessionId: 'user-123',
  storage: { snapshot: new FileStorage('./sessions') },
})

const agent = new Agent({ sessionManager: session })
await agent.invoke("Hello, I'm a new user!")
```
(( /tab "TypeScript" ))

#### File Storage Structure

(( tab "Python" ))
When using [`FileSessionManager`](/docs/api/python/strands.session.file_session_manager#FileSessionManager), sessions are stored in the following directory structure:

```plaintext
/<sessions_dir>/
└── session_<session_id>/
    ├── session.json                # Session metadata
    ├── agents/                     # Single agent storage
    │   └── agent_<agent_id>/
    │       ├── agent.json          # Agent metadata and state
    │       └── messages/
    │           ├── message_<message_id>.json
    │           └── message_<message_id>.json
    └── multi_agents/               # Multi-agent  storage
        └── multi_agent_<orchestrator_id>/
            └── multi_agent.json    # Orchestrator state and configuration
```
(( /tab "Python" ))

(( tab "TypeScript" ))
```plaintext
<baseDir>/
└── <sessionId>/
    └── scopes/
        ├── agent/
        │   └── <agentId>/
        │       └── snapshots/
        │           ├── snapshot_latest.json        # Latest mutable snapshot
        │           └── immutable_history/
        │               ├── snapshot_<uuid7>.json   # Immutable checkpoint
        │               └── snapshot_<uuid7>.json
        └── multiAgent/
            └── <orchestratorId>/
                └── snapshots/
                    └── snapshot_latest.json   # Multi-agent only saves latest (no immutable history)
```
(( /tab "TypeScript" ))

### S3SessionManager / S3Storage

(( tab "Python" ))
For cloud-based persistence, especially in distributed environments, use the [`S3SessionManager`](/docs/api/python/strands.session.s3_session_manager#S3SessionManager):

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

# Use with multi-agent orchestrator
swarm = Swarm(
    agents=[agent1, agent2, agent3],
    session_manager=session_manager
)

result = swarm("Coordinate the task across agents")
```
(( /tab "Python" ))

(( tab "TypeScript" ))
`S3Storage` persists snapshots to an S3 bucket. You can provide a pre-configured `S3Client` or let the SDK create one from a `region`:

```typescript
const session = new SessionManager({
  sessionId: 'user-456',
  storage: {
    snapshot: new S3Storage({
      bucket: 'my-agent-sessions',
      prefix: 'production', // Optional key prefix
      s3Client: new S3Client({
        // Optional pre-configured client
        region: 'us-west-2',
      }),
      // Alternatively, use region directly (cannot be combined with s3Client):
      // region: 'us-west-2',
    }),
  },
})

const agent = new Agent({ sessionManager: session })
await agent.invoke('Tell me about AWS S3')
```
(( /tab "TypeScript" ))

#### S3 Storage Structure

(( tab "Python" ))
```plaintext
<s3_key_prefix>/
└── session_<session_id>/
    ├── session.json                # Session metadata
    ├── agents/                     # Single agent storage
    │   └── agent_<agent_id>/
    │       ├── agent.json          # Agent metadata and state
    │       └── messages/
    │           ├── message_<message_id>.json
    │           └── message_<message_id>.json
    └── multi_agents/               # Multi-agent storage
        └── multi_agent_<orchestrator_id>/
            └── multi_agent.json    # Orchestrator state and configuration
```
(( /tab "Python" ))

(( tab "TypeScript" ))
```plaintext
[<prefix>/]<sessionId>/
└── scopes/
    ├── agent/
    │   └── <agentId>/
    │       └── snapshots/
    │           ├── snapshot_latest.json
    │           └── immutable_history/
    │               └── snapshot_<uuid7>.json
    └── multiAgent/
        └── <orchestratorId>/
            └── snapshots/
                └── snapshot_latest.json   # Multi-agent only saves latest (no immutable history)
```
(( /tab "TypeScript" ))

#### Required S3 Permissions

To use S3-backed session storage, your AWS credentials must have the following permissions:

-   `s3:PutObject` - To create and update session data
-   `s3:GetObject` - To retrieve session data
-   `s3:DeleteObject` - To delete session data
-   `s3:ListBucket` - To list objects in the bucket

Here’s a sample IAM policy that grants these permissions for a specific bucket:

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

## How Session Management Works

### Session Persistence Triggers

Session persistence is automatically triggered by lifecycle events in the agent:

**Single Agent Events**

(( tab "Python" ))
-   **Agent Initialization**: When an agent is created with a session manager, it automatically restores any existing state and messages from the session.
-   **Message Addition**: When a new message is added to the conversation, it’s automatically persisted to the session.
-   **Agent Invocation**: After each agent invocation, the agent state is synchronized with the session to capture any updates.
-   **Message Redaction**: When sensitive information needs to be redacted, the session manager can replace the original message with a redacted version while maintaining conversation flow.
(( /tab "Python" ))

(( tab "TypeScript" ))
-   **Agent Initialization**: Restores state from `snapshot_latest` if it exists.
-   **Message Addition** (`saveLatestOn: 'message'`): Saves after every message and after model calls with guardrail redactions.
-   **Agent Invocation** (`saveLatestOn: 'invocation'`, default): Saves after each invocation completes.
-   **Snapshot Trigger**: Creates an immutable checkpoint when the `snapshotTrigger` callback returns `true`.

See [Basic Usage](#basic-usage) for configuration examples.
(( /tab "TypeScript" ))

**Multi-Agent Events**:

(( tab "Python" ))
-   **Multi-Agent Initialization**: Restores orchestrator state from the session.
-   **Node Execution**: Synchronizes orchestrator state after node transitions.
-   **Multi-Agent Invocation**: Captures final orchestrator state after execution.
(( /tab "Python" ))

(( tab "TypeScript" ))
-   **Before Multi-Agent Invocation**: Restores orchestrator state from `snapshot_latest` on first invocation.
-   **After Node Call** (`multiAgentSaveLatestOn: 'node'`, default): Saves after each node completes, enabling resume from the last completed node after a crash.
-   **After Multi-Agent Invocation** (`multiAgentSaveLatestOn: 'invocation'`): Saves after the full orchestrator invocation completes (lower I/O, but only captures state at invocation boundaries).

```typescript
const session = new SessionManager({
  sessionId: 'my-session',
  storage: { snapshot: new FileStorage('./sessions') },
  // Save orchestrator state after each node completes (default)
  multiAgentSaveLatestOn: 'node',
  // Or save only after the full orchestrator invocation completes:
  // multiAgentSaveLatestOn: 'invocation',
})
```
(( /tab "TypeScript" ))

Direct Message Modifications Not Persisted

After initializing the agent, direct modifications to `agent.messages` will not be persisted. Utilize the [Conversation Manager](/docs/user-guide/concepts/agents/conversation-management/index.md) to help manage context of the agent in a way that can be persisted.

## Immutable Snapshots *(TypeScript only)*

In addition to `snapshot_latest`, the TypeScript SDK supports **immutable snapshots** — append-only checkpoints identified by UUID v7. These enable time-travel restore: you can restore the agent to any prior checkpoint, not just the latest state.

### Creating Immutable Snapshots

Use the `snapshotTrigger` callback to control when an immutable snapshot is created. The callback receives the current agent data and returns `true` to trigger a snapshot:

```typescript
const session = new SessionManager({
  sessionId: 'my-session',
  storage: { snapshot: new FileStorage('./sessions') },
  // Create an immutable snapshot after every 4 messages
  snapshotTrigger: ({ agentData }) => agentData.messages.length % 4 === 0,
})

const agent = new Agent({ sessionManager: session })
await agent.invoke('First message') // 2 messages — no snapshot
await agent.invoke('Second message') // 4 messages — immutable snapshot created
```

### Listing and Restoring Snapshots

Snapshot IDs are UUID v7, so they sort lexicographically in chronological order. Use `listSnapshotIds` on the storage backend to retrieve them, then pass a `snapshotId` to `restoreSnapshot` on the `SessionManager`:

```typescript
const storage = new FileStorage('./sessions')
const location = {
  sessionId: 'my-session',
  scope: 'agent' as const,
  scopeId: 'default',
}

// List all immutable snapshot IDs (chronological order)
const snapshotIds = await storage.listSnapshotIds({ location })

// Paginate: get the next 10 snapshots after a cursor
const page2 = await storage.listSnapshotIds({
  location,
  limit: 10,
  startAfter: snapshotIds.at(-1),
})

// Restore agent to a specific checkpoint
const session = new SessionManager({
  sessionId: 'my-session',
  storage: { snapshot: storage },
})
const agent = new Agent({ sessionManager: session })
await agent.initialize()
await session.restoreSnapshot({ target: agent, snapshotId: snapshotIds[0]! })
```

## Deleting Sessions *(TypeScript only)*

To remove all snapshots and manifests for a session, call `deleteSession()` on the `SessionManager`. This removes the entire session root directory (filesystem) or all objects under the session prefix (S3):

```typescript
const session = new SessionManager({
  sessionId: 'my-session',
  storage: { snapshot: new FileStorage('./sessions') },
})

// Remove all snapshots and manifests for this session
await session.deleteSession()
```

## Data Models

(( tab "Python" ))
Session data is stored using these key data models:

**Session**

The [`Session`](/docs/api/python/strands.types.session#Session) model is the top-level container for session data:

-   **Purpose**: Provides a namespace for organizing multiple agents and their interactions
-   **Key Fields**:
    -   `session_id`: Unique identifier for the session
    -   `session_type`: Type of session (currently `"AGENT"` for both agent & multiagent in order to keep backward compatibility)
    -   `created_at`: ISO format timestamp of when the session was created
    -   `updated_at`: ISO format timestamp of when the session was last updated

**SessionAgent**

The [`SessionAgent`](/docs/api/python/strands.types.session#SessionAgent) model stores agent-specific data:

-   **Purpose**: Maintains the state and configuration of a specific agent within a session
-   **Key Fields**:
    -   `agent_id`: Unique identifier for the agent within the session
    -   `state`: Dictionary containing the agent’s state data (key-value pairs)
    -   `conversation_manager_state`: Dictionary containing the state of the conversation manager
    -   `created_at`: ISO format timestamp of when the agent was created
    -   `updated_at`: ISO format timestamp of when the agent was last updated

**SessionMessage**

The [`SessionMessage`](/docs/api/python/strands.types.session#SessionMessage) model stores individual messages in the conversation:

-   **Purpose**: Preserves the conversation history with support for message redaction
-   **Key Fields**:
    -   `message`: The original message content (role, content blocks)
    -   `redact_message`: Optional redacted version of the message (used when sensitive information is detected)
    -   `message_id`: Index of the message in the agent’s messages array
    -   `created_at`: ISO format timestamp of when the message was created
    -   `updated_at`: ISO format timestamp of when the message was last updated

These data models work together to provide a complete representation of an agent’s state and conversation history. The session management system handles serialization and deserialization of these models, including special handling for binary data using base64 encoding.

**Multi-Agent State**

Multi-agent systems serialize their state as JSON objects containing:

-   **Orchestrator Configuration**: Settings, parameters, and execution preferences
-   **Node State**: Current execution state and node transition history
-   **Shared Context**: Cross-agent shared state and variables
(( /tab "Python" ))

(( tab "TypeScript" ))
The TypeScript SDK stores session state as a `Snapshot` object written to JSON. Each snapshot contains:

-   `data.messages`: The full conversation history
-   `data.state`: Agent key-value state
-   `data.systemPrompt`: The agent’s system prompt
-   `schemaVersion`: Schema version for forward compatibility
-   `createdAt`: ISO 8601 timestamp

There are two kinds of snapshots:

-   **`snapshot_latest.json`**: A single mutable file overwritten on each save. Used to resume the most recent state after a restart.
-   **Immutable snapshots** (`immutable_history/snapshot_<uuid7>.json`): Append-only checkpoints created when `snapshotTrigger` fires. Used for time-travel restore.
(( /tab "TypeScript" ))

## Third-Party Session Managers

The following third-party session managers extend Strands with additional storage and memory capabilities:

| Session Manager | Provider | Description | Documentation |
| --- | --- | --- | --- |
| AgentCoreMemorySessionManager | Amazon | Advanced memory with intelligent retrieval using Amazon Bedrock AgentCore Memory. Supports both short-term memory (STM) and long-term memory (LTM) with strategies for user preferences, facts, and session summaries. | [View Documentation](/docs/community/session-managers/agentcore-memory/index.md) |
| **Contribute Your Own** | Community | Have you built a session manager? Share it with the community! | [Learn How](/docs/community/community-packages/index.md) |

## Custom Session Repositories

For advanced use cases, you can implement your own session storage backend.

(( tab "Python" ))
Create a custom session repository by implementing the `SessionRepository` interface:

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
(( /tab "Python" ))

(( tab "TypeScript" ))
Create a custom storage backend by implementing the `SnapshotStorage` interface:

```typescript
// Implement SnapshotStorage to plug in any backend (database, Redis, etc.)
class MyStorage implements SnapshotStorage {
  async saveSnapshot({
    location,
    snapshotId,
    snapshot,
  }: {
    location: SnapshotLocation
    snapshotId: string
    isLatest: boolean
    snapshot: Snapshot
  }) {
    // Store the snapshot JSON keyed by location + snapshotId
  }

  async loadSnapshot({
    location,
    snapshotId,
  }: {
    location: SnapshotLocation
    snapshotId?: string
  }) {
    // Return the snapshot for the given location, or null if not found
    return null
  }

  async listSnapshotIds({
    location,
  }: {
    location: SnapshotLocation
    limit?: number
    startAfter?: string
  }) {
    // Return immutable snapshot IDs sorted chronologically
    return []
  }

  async deleteSession({ sessionId }: { sessionId: string }) {
    // Remove all stored data for this session
  }

  async loadManifest({
    location,
  }: {
    location: SnapshotLocation
  }): Promise<SnapshotManifest> {
    // Return the manifest for the given location
    return { schemaVersion: '1', updatedAt: new Date().toISOString() }
  }

  async saveManifest({
    location,
    manifest,
  }: {
    location: SnapshotLocation
    manifest: SnapshotManifest
  }) {
    // Persist the manifest
  }
}

const agent = new Agent({
  sessionManager: new SessionManager({
    sessionId: 'user-789',
    storage: { snapshot: new MyStorage() },
  }),
})
```
(( /tab "TypeScript" ))

This approach allows you to store session data in any backend system while leveraging the built-in session management logic.

## Session Persistence Best Practices

When implementing session persistence in your applications, consider these best practices:

-   **Use Unique Session IDs**: Generate unique session IDs for each user or conversation context to prevent data overlap.
-   **Session Cleanup**: Implement a strategy for cleaning up old or inactive sessions. Consider adding TTL (Time To Live) for sessions in production environments.
-   **Understand Persistence Triggers**: Remember that changes to agent state or messages are only persisted during specific lifecycle events.
-   **Concurrent Access**: Session managers are not thread-safe; use appropriate locking for concurrent access.
-   **Secure Storage Directories**: The session storage directory is a trusted data store. Restrict filesystem permissions so that only the agent process can read and write to it. In shared or multi-tenant environments (shared volumes, containers), be aware that the SDK does not block symlinks in the session storage directory. If an attacker with write access to the storage directory creates a symlink (e.g., `message_0.json` pointing to an arbitrary file), the SDK will follow it, which could cause sensitive file contents to be loaded into the agent’s conversation history.