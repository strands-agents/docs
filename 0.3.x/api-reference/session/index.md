# `strands.session`

Session module.

This module provides session management functionality.

## `strands.session.file_session_manager`

File-based session manager for local filesystem storage.

### `FileSessionManager`

Bases: `RepositorySessionManager`, `SessionRepository`

File-based session manager for local filesystem storage.

Creates the following filesystem structure for the session storage: // └── session\_/ ├── session.json # Session metadata └── agents/ └── agent\_/ ├── agent.json # Agent metadata └── messages/ ├── message\_.json └── message\_.json

Source code in `strands/session/file_session_manager.py`

```
class FileSessionManager(RepositorySessionManager, SessionRepository):
    """File-based session manager for local filesystem storage.

    Creates the following filesystem structure for the session storage:
    /<sessions_dir>/
    └── session_<session_id>/
        ├── session.json                # Session metadata
        └── agents/
            └── agent_<agent_id>/
                ├── agent.json          # Agent metadata
                └── messages/
                    ├── message_<id1>.json
                    └── message_<id2>.json

    """

    def __init__(self, session_id: str, storage_dir: Optional[str] = None, **kwargs: Any):
        """Initialize FileSession with filesystem storage.

        Args:
            session_id: ID for the session
            storage_dir: Directory for local filesystem storage (defaults to temp dir)
            **kwargs: Additional keyword arguments for future extensibility.
        """
        self.storage_dir = storage_dir or os.path.join(tempfile.gettempdir(), "strands/sessions")
        os.makedirs(self.storage_dir, exist_ok=True)

        super().__init__(session_id=session_id, session_repository=self)

    def _get_session_path(self, session_id: str) -> str:
        """Get session directory path."""
        return os.path.join(self.storage_dir, f"{SESSION_PREFIX}{session_id}")

    def _get_agent_path(self, session_id: str, agent_id: str) -> str:
        """Get agent directory path."""
        session_path = self._get_session_path(session_id)
        return os.path.join(session_path, "agents", f"{AGENT_PREFIX}{agent_id}")

    def _get_message_path(self, session_id: str, agent_id: str, message_id: int) -> str:
        """Get message file path.

        Args:
            session_id: ID of the session
            agent_id: ID of the agent
            message_id: Index of the message
        Returns:
            The filename for the message
        """
        agent_path = self._get_agent_path(session_id, agent_id)
        return os.path.join(agent_path, "messages", f"{MESSAGE_PREFIX}{message_id}.json")

    def _read_file(self, path: str) -> dict[str, Any]:
        """Read JSON file."""
        try:
            with open(path, "r", encoding="utf-8") as f:
                return cast(dict[str, Any], json.load(f))
        except json.JSONDecodeError as e:
            raise SessionException(f"Invalid JSON in file {path}: {str(e)}") from e

    def _write_file(self, path: str, data: dict[str, Any]) -> None:
        """Write JSON file."""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def create_session(self, session: Session, **kwargs: Any) -> Session:
        """Create a new session."""
        session_dir = self._get_session_path(session.session_id)
        if os.path.exists(session_dir):
            raise SessionException(f"Session {session.session_id} already exists")

        # Create directory structure
        os.makedirs(session_dir, exist_ok=True)
        os.makedirs(os.path.join(session_dir, "agents"), exist_ok=True)

        # Write session file
        session_file = os.path.join(session_dir, "session.json")
        session_dict = session.to_dict()
        self._write_file(session_file, session_dict)

        return session

    def read_session(self, session_id: str, **kwargs: Any) -> Optional[Session]:
        """Read session data."""
        session_file = os.path.join(self._get_session_path(session_id), "session.json")
        if not os.path.exists(session_file):
            return None

        session_data = self._read_file(session_file)
        return Session.from_dict(session_data)

    def delete_session(self, session_id: str, **kwargs: Any) -> None:
        """Delete session and all associated data."""
        session_dir = self._get_session_path(session_id)
        if not os.path.exists(session_dir):
            raise SessionException(f"Session {session_id} does not exist")

        shutil.rmtree(session_dir)

    def create_agent(self, session_id: str, session_agent: SessionAgent, **kwargs: Any) -> None:
        """Create a new agent in the session."""
        agent_id = session_agent.agent_id

        agent_dir = self._get_agent_path(session_id, agent_id)
        os.makedirs(agent_dir, exist_ok=True)
        os.makedirs(os.path.join(agent_dir, "messages"), exist_ok=True)

        agent_file = os.path.join(agent_dir, "agent.json")
        session_data = session_agent.to_dict()
        self._write_file(agent_file, session_data)

    def read_agent(self, session_id: str, agent_id: str, **kwargs: Any) -> Optional[SessionAgent]:
        """Read agent data."""
        agent_file = os.path.join(self._get_agent_path(session_id, agent_id), "agent.json")
        if not os.path.exists(agent_file):
            return None

        agent_data = self._read_file(agent_file)
        return SessionAgent.from_dict(agent_data)

    def update_agent(self, session_id: str, session_agent: SessionAgent, **kwargs: Any) -> None:
        """Update agent data."""
        agent_id = session_agent.agent_id
        previous_agent = self.read_agent(session_id=session_id, agent_id=agent_id)
        if previous_agent is None:
            raise SessionException(f"Agent {agent_id} in session {session_id} does not exist")

        session_agent.created_at = previous_agent.created_at
        agent_file = os.path.join(self._get_agent_path(session_id, agent_id), "agent.json")
        self._write_file(agent_file, session_agent.to_dict())

    def create_message(self, session_id: str, agent_id: str, session_message: SessionMessage, **kwargs: Any) -> None:
        """Create a new message for the agent."""
        message_file = self._get_message_path(
            session_id,
            agent_id,
            session_message.message_id,
        )
        session_dict = session_message.to_dict()
        self._write_file(message_file, session_dict)

    def read_message(self, session_id: str, agent_id: str, message_id: int, **kwargs: Any) -> Optional[SessionMessage]:
        """Read message data."""
        message_path = self._get_message_path(session_id, agent_id, message_id)
        if not os.path.exists(message_path):
            return None
        message_data = self._read_file(message_path)
        return SessionMessage.from_dict(message_data)

    def update_message(self, session_id: str, agent_id: str, session_message: SessionMessage, **kwargs: Any) -> None:
        """Update message data."""
        message_id = session_message.message_id
        previous_message = self.read_message(session_id=session_id, agent_id=agent_id, message_id=message_id)
        if previous_message is None:
            raise SessionException(f"Message {message_id} does not exist")

        # Preserve the original created_at timestamp
        session_message.created_at = previous_message.created_at
        message_file = self._get_message_path(session_id, agent_id, message_id)
        self._write_file(message_file, session_message.to_dict())

    def list_messages(
        self, session_id: str, agent_id: str, limit: Optional[int] = None, offset: int = 0, **kwargs: Any
    ) -> list[SessionMessage]:
        """List messages for an agent with pagination."""
        messages_dir = os.path.join(self._get_agent_path(session_id, agent_id), "messages")
        if not os.path.exists(messages_dir):
            raise SessionException(f"Messages directory missing from agent: {agent_id} in session {session_id}")

        # Read all message files, and record the index
        message_index_files: list[tuple[int, str]] = []
        for filename in os.listdir(messages_dir):
            if filename.startswith(MESSAGE_PREFIX) and filename.endswith(".json"):
                # Extract index from message_<index>.json format
                index = int(filename[len(MESSAGE_PREFIX) : -5])  # Remove prefix and .json suffix
                message_index_files.append((index, filename))

        # Sort by index and extract just the filenames
        message_files = [f for _, f in sorted(message_index_files)]

        # Apply pagination to filenames
        if limit is not None:
            message_files = message_files[offset : offset + limit]
        else:
            message_files = message_files[offset:]

        # Load only the message files
        messages: list[SessionMessage] = []
        for filename in message_files:
            file_path = os.path.join(messages_dir, filename)
            message_data = self._read_file(file_path)
            messages.append(SessionMessage.from_dict(message_data))

        return messages

```

#### `__init__(session_id, storage_dir=None, **kwargs)`

Initialize FileSession with filesystem storage.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `session_id` | `str` | ID for the session | *required* | | `storage_dir` | `Optional[str]` | Directory for local filesystem storage (defaults to temp dir) | `None` | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Source code in `strands/session/file_session_manager.py`

```
def __init__(self, session_id: str, storage_dir: Optional[str] = None, **kwargs: Any):
    """Initialize FileSession with filesystem storage.

    Args:
        session_id: ID for the session
        storage_dir: Directory for local filesystem storage (defaults to temp dir)
        **kwargs: Additional keyword arguments for future extensibility.
    """
    self.storage_dir = storage_dir or os.path.join(tempfile.gettempdir(), "strands/sessions")
    os.makedirs(self.storage_dir, exist_ok=True)

    super().__init__(session_id=session_id, session_repository=self)

```

#### `create_agent(session_id, session_agent, **kwargs)`

Create a new agent in the session.

Source code in `strands/session/file_session_manager.py`

```
def create_agent(self, session_id: str, session_agent: SessionAgent, **kwargs: Any) -> None:
    """Create a new agent in the session."""
    agent_id = session_agent.agent_id

    agent_dir = self._get_agent_path(session_id, agent_id)
    os.makedirs(agent_dir, exist_ok=True)
    os.makedirs(os.path.join(agent_dir, "messages"), exist_ok=True)

    agent_file = os.path.join(agent_dir, "agent.json")
    session_data = session_agent.to_dict()
    self._write_file(agent_file, session_data)

```

#### `create_message(session_id, agent_id, session_message, **kwargs)`

Create a new message for the agent.

Source code in `strands/session/file_session_manager.py`

```
def create_message(self, session_id: str, agent_id: str, session_message: SessionMessage, **kwargs: Any) -> None:
    """Create a new message for the agent."""
    message_file = self._get_message_path(
        session_id,
        agent_id,
        session_message.message_id,
    )
    session_dict = session_message.to_dict()
    self._write_file(message_file, session_dict)

```

#### `create_session(session, **kwargs)`

Create a new session.

Source code in `strands/session/file_session_manager.py`

```
def create_session(self, session: Session, **kwargs: Any) -> Session:
    """Create a new session."""
    session_dir = self._get_session_path(session.session_id)
    if os.path.exists(session_dir):
        raise SessionException(f"Session {session.session_id} already exists")

    # Create directory structure
    os.makedirs(session_dir, exist_ok=True)
    os.makedirs(os.path.join(session_dir, "agents"), exist_ok=True)

    # Write session file
    session_file = os.path.join(session_dir, "session.json")
    session_dict = session.to_dict()
    self._write_file(session_file, session_dict)

    return session

```

#### `delete_session(session_id, **kwargs)`

Delete session and all associated data.

Source code in `strands/session/file_session_manager.py`

```
def delete_session(self, session_id: str, **kwargs: Any) -> None:
    """Delete session and all associated data."""
    session_dir = self._get_session_path(session_id)
    if not os.path.exists(session_dir):
        raise SessionException(f"Session {session_id} does not exist")

    shutil.rmtree(session_dir)

```

#### `list_messages(session_id, agent_id, limit=None, offset=0, **kwargs)`

List messages for an agent with pagination.

Source code in `strands/session/file_session_manager.py`

```
def list_messages(
    self, session_id: str, agent_id: str, limit: Optional[int] = None, offset: int = 0, **kwargs: Any
) -> list[SessionMessage]:
    """List messages for an agent with pagination."""
    messages_dir = os.path.join(self._get_agent_path(session_id, agent_id), "messages")
    if not os.path.exists(messages_dir):
        raise SessionException(f"Messages directory missing from agent: {agent_id} in session {session_id}")

    # Read all message files, and record the index
    message_index_files: list[tuple[int, str]] = []
    for filename in os.listdir(messages_dir):
        if filename.startswith(MESSAGE_PREFIX) and filename.endswith(".json"):
            # Extract index from message_<index>.json format
            index = int(filename[len(MESSAGE_PREFIX) : -5])  # Remove prefix and .json suffix
            message_index_files.append((index, filename))

    # Sort by index and extract just the filenames
    message_files = [f for _, f in sorted(message_index_files)]

    # Apply pagination to filenames
    if limit is not None:
        message_files = message_files[offset : offset + limit]
    else:
        message_files = message_files[offset:]

    # Load only the message files
    messages: list[SessionMessage] = []
    for filename in message_files:
        file_path = os.path.join(messages_dir, filename)
        message_data = self._read_file(file_path)
        messages.append(SessionMessage.from_dict(message_data))

    return messages

```

#### `read_agent(session_id, agent_id, **kwargs)`

Read agent data.

Source code in `strands/session/file_session_manager.py`

```
def read_agent(self, session_id: str, agent_id: str, **kwargs: Any) -> Optional[SessionAgent]:
    """Read agent data."""
    agent_file = os.path.join(self._get_agent_path(session_id, agent_id), "agent.json")
    if not os.path.exists(agent_file):
        return None

    agent_data = self._read_file(agent_file)
    return SessionAgent.from_dict(agent_data)

```

#### `read_message(session_id, agent_id, message_id, **kwargs)`

Read message data.

Source code in `strands/session/file_session_manager.py`

```
def read_message(self, session_id: str, agent_id: str, message_id: int, **kwargs: Any) -> Optional[SessionMessage]:
    """Read message data."""
    message_path = self._get_message_path(session_id, agent_id, message_id)
    if not os.path.exists(message_path):
        return None
    message_data = self._read_file(message_path)
    return SessionMessage.from_dict(message_data)

```

#### `read_session(session_id, **kwargs)`

Read session data.

Source code in `strands/session/file_session_manager.py`

```
def read_session(self, session_id: str, **kwargs: Any) -> Optional[Session]:
    """Read session data."""
    session_file = os.path.join(self._get_session_path(session_id), "session.json")
    if not os.path.exists(session_file):
        return None

    session_data = self._read_file(session_file)
    return Session.from_dict(session_data)

```

#### `update_agent(session_id, session_agent, **kwargs)`

Update agent data.

Source code in `strands/session/file_session_manager.py`

```
def update_agent(self, session_id: str, session_agent: SessionAgent, **kwargs: Any) -> None:
    """Update agent data."""
    agent_id = session_agent.agent_id
    previous_agent = self.read_agent(session_id=session_id, agent_id=agent_id)
    if previous_agent is None:
        raise SessionException(f"Agent {agent_id} in session {session_id} does not exist")

    session_agent.created_at = previous_agent.created_at
    agent_file = os.path.join(self._get_agent_path(session_id, agent_id), "agent.json")
    self._write_file(agent_file, session_agent.to_dict())

```

#### `update_message(session_id, agent_id, session_message, **kwargs)`

Update message data.

Source code in `strands/session/file_session_manager.py`

```
def update_message(self, session_id: str, agent_id: str, session_message: SessionMessage, **kwargs: Any) -> None:
    """Update message data."""
    message_id = session_message.message_id
    previous_message = self.read_message(session_id=session_id, agent_id=agent_id, message_id=message_id)
    if previous_message is None:
        raise SessionException(f"Message {message_id} does not exist")

    # Preserve the original created_at timestamp
    session_message.created_at = previous_message.created_at
    message_file = self._get_message_path(session_id, agent_id, message_id)
    self._write_file(message_file, session_message.to_dict())

```

## `strands.session.repository_session_manager`

Repository session manager implementation.

### `RepositorySessionManager`

Bases: `SessionManager`

Session manager for persisting agents in a SessionRepository.

Source code in `strands/session/repository_session_manager.py`

```
class RepositorySessionManager(SessionManager):
    """Session manager for persisting agents in a SessionRepository."""

    def __init__(self, session_id: str, session_repository: SessionRepository, **kwargs: Any):
        """Initialize the RepositorySessionManager.

        If no session with the specified session_id exists yet, it will be created
        in the session_repository.

        Args:
            session_id: ID to use for the session. A new session with this id will be created if it does
                not exist in the repository yet
            session_repository: Underlying session repository to use to store the sessions state.
            **kwargs: Additional keyword arguments for future extensibility.

        """
        self.session_repository = session_repository
        self.session_id = session_id
        session = session_repository.read_session(session_id)
        # Create a session if it does not exist yet
        if session is None:
            logger.debug("session_id=<%s> | session not found, creating new session", self.session_id)
            session = Session(session_id=session_id, session_type=SessionType.AGENT)
            session_repository.create_session(session)

        self.session = session

        # Keep track of the latest message of each agent in case we need to redact it.
        self._latest_agent_message: dict[str, Optional[SessionMessage]] = {}

    def append_message(self, message: Message, agent: "Agent", **kwargs: Any) -> None:
        """Append a message to the agent's session.

        Args:
            message: Message to add to the agent in the session
            agent: Agent to append the message to
            **kwargs: Additional keyword arguments for future extensibility.
        """
        # Calculate the next index (0 if this is the first message, otherwise increment the previous index)
        latest_agent_message = self._latest_agent_message[agent.agent_id]
        if latest_agent_message:
            next_index = latest_agent_message.message_id + 1
        else:
            next_index = 0

        session_message = SessionMessage.from_message(message, next_index)
        self._latest_agent_message[agent.agent_id] = session_message
        self.session_repository.create_message(self.session_id, agent.agent_id, session_message)

    def redact_latest_message(self, redact_message: Message, agent: "Agent", **kwargs: Any) -> None:
        """Redact the latest message appended to the session.

        Args:
            redact_message: New message to use that contains the redact content
            agent: Agent to apply the message redaction to
            **kwargs: Additional keyword arguments for future extensibility.
        """
        latest_agent_message = self._latest_agent_message[agent.agent_id]
        if latest_agent_message is None:
            raise SessionException("No message to redact.")
        latest_agent_message.redact_message = redact_message
        return self.session_repository.update_message(self.session_id, agent.agent_id, latest_agent_message)

    def sync_agent(self, agent: "Agent", **kwargs: Any) -> None:
        """Serialize and update the agent into the session repository.

        Args:
            agent: Agent to sync to the session.
            **kwargs: Additional keyword arguments for future extensibility.
        """
        self.session_repository.update_agent(
            self.session_id,
            SessionAgent.from_agent(agent),
        )

    def initialize(self, agent: "Agent", **kwargs: Any) -> None:
        """Initialize an agent with a session.

        Args:
            agent: Agent to initialize from the session
            **kwargs: Additional keyword arguments for future extensibility.
        """
        if agent.agent_id in self._latest_agent_message:
            raise SessionException("The `agent_id` of an agent must be unique in a session.")
        self._latest_agent_message[agent.agent_id] = None

        session_agent = self.session_repository.read_agent(self.session_id, agent.agent_id)

        if session_agent is None:
            logger.debug(
                "agent_id=<%s> | session_id=<%s> | creating agent",
                agent.agent_id,
                self.session_id,
            )

            session_agent = SessionAgent.from_agent(agent)
            self.session_repository.create_agent(self.session_id, session_agent)
            # Initialize messages with sequential indices
            session_message = None
            for i, message in enumerate(agent.messages):
                session_message = SessionMessage.from_message(message, i)
                self.session_repository.create_message(self.session_id, agent.agent_id, session_message)
            self._latest_agent_message[agent.agent_id] = session_message
        else:
            logger.debug(
                "agent_id=<%s> | session_id=<%s> | restoring agent",
                agent.agent_id,
                self.session_id,
            )
            agent.state = AgentState(session_agent.state)

            # Restore the conversation manager to its previous state, and get the optional prepend messages
            prepend_messages = agent.conversation_manager.restore_from_session(session_agent.conversation_manager_state)

            if prepend_messages is None:
                prepend_messages = []

            # List the messages currently in the session, using an offset of the messages previously removed
            # by the conversation manager.
            session_messages = self.session_repository.list_messages(
                session_id=self.session_id,
                agent_id=agent.agent_id,
                offset=agent.conversation_manager.removed_message_count,
            )
            if len(session_messages) > 0:
                self._latest_agent_message[agent.agent_id] = session_messages[-1]

            # Restore the agents messages array including the optional prepend messages
            agent.messages = prepend_messages + [session_message.to_message() for session_message in session_messages]

```

#### `__init__(session_id, session_repository, **kwargs)`

Initialize the RepositorySessionManager.

If no session with the specified session_id exists yet, it will be created in the session_repository.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `session_id` | `str` | ID to use for the session. A new session with this id will be created if it does not exist in the repository yet | *required* | | `session_repository` | `SessionRepository` | Underlying session repository to use to store the sessions state. | *required* | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Source code in `strands/session/repository_session_manager.py`

```
def __init__(self, session_id: str, session_repository: SessionRepository, **kwargs: Any):
    """Initialize the RepositorySessionManager.

    If no session with the specified session_id exists yet, it will be created
    in the session_repository.

    Args:
        session_id: ID to use for the session. A new session with this id will be created if it does
            not exist in the repository yet
        session_repository: Underlying session repository to use to store the sessions state.
        **kwargs: Additional keyword arguments for future extensibility.

    """
    self.session_repository = session_repository
    self.session_id = session_id
    session = session_repository.read_session(session_id)
    # Create a session if it does not exist yet
    if session is None:
        logger.debug("session_id=<%s> | session not found, creating new session", self.session_id)
        session = Session(session_id=session_id, session_type=SessionType.AGENT)
        session_repository.create_session(session)

    self.session = session

    # Keep track of the latest message of each agent in case we need to redact it.
    self._latest_agent_message: dict[str, Optional[SessionMessage]] = {}

```

#### `append_message(message, agent, **kwargs)`

Append a message to the agent's session.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `message` | `Message` | Message to add to the agent in the session | *required* | | `agent` | `Agent` | Agent to append the message to | *required* | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Source code in `strands/session/repository_session_manager.py`

```
def append_message(self, message: Message, agent: "Agent", **kwargs: Any) -> None:
    """Append a message to the agent's session.

    Args:
        message: Message to add to the agent in the session
        agent: Agent to append the message to
        **kwargs: Additional keyword arguments for future extensibility.
    """
    # Calculate the next index (0 if this is the first message, otherwise increment the previous index)
    latest_agent_message = self._latest_agent_message[agent.agent_id]
    if latest_agent_message:
        next_index = latest_agent_message.message_id + 1
    else:
        next_index = 0

    session_message = SessionMessage.from_message(message, next_index)
    self._latest_agent_message[agent.agent_id] = session_message
    self.session_repository.create_message(self.session_id, agent.agent_id, session_message)

```

#### `initialize(agent, **kwargs)`

Initialize an agent with a session.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | Agent to initialize from the session | *required* | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Source code in `strands/session/repository_session_manager.py`

```
def initialize(self, agent: "Agent", **kwargs: Any) -> None:
    """Initialize an agent with a session.

    Args:
        agent: Agent to initialize from the session
        **kwargs: Additional keyword arguments for future extensibility.
    """
    if agent.agent_id in self._latest_agent_message:
        raise SessionException("The `agent_id` of an agent must be unique in a session.")
    self._latest_agent_message[agent.agent_id] = None

    session_agent = self.session_repository.read_agent(self.session_id, agent.agent_id)

    if session_agent is None:
        logger.debug(
            "agent_id=<%s> | session_id=<%s> | creating agent",
            agent.agent_id,
            self.session_id,
        )

        session_agent = SessionAgent.from_agent(agent)
        self.session_repository.create_agent(self.session_id, session_agent)
        # Initialize messages with sequential indices
        session_message = None
        for i, message in enumerate(agent.messages):
            session_message = SessionMessage.from_message(message, i)
            self.session_repository.create_message(self.session_id, agent.agent_id, session_message)
        self._latest_agent_message[agent.agent_id] = session_message
    else:
        logger.debug(
            "agent_id=<%s> | session_id=<%s> | restoring agent",
            agent.agent_id,
            self.session_id,
        )
        agent.state = AgentState(session_agent.state)

        # Restore the conversation manager to its previous state, and get the optional prepend messages
        prepend_messages = agent.conversation_manager.restore_from_session(session_agent.conversation_manager_state)

        if prepend_messages is None:
            prepend_messages = []

        # List the messages currently in the session, using an offset of the messages previously removed
        # by the conversation manager.
        session_messages = self.session_repository.list_messages(
            session_id=self.session_id,
            agent_id=agent.agent_id,
            offset=agent.conversation_manager.removed_message_count,
        )
        if len(session_messages) > 0:
            self._latest_agent_message[agent.agent_id] = session_messages[-1]

        # Restore the agents messages array including the optional prepend messages
        agent.messages = prepend_messages + [session_message.to_message() for session_message in session_messages]

```

#### `redact_latest_message(redact_message, agent, **kwargs)`

Redact the latest message appended to the session.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `redact_message` | `Message` | New message to use that contains the redact content | *required* | | `agent` | `Agent` | Agent to apply the message redaction to | *required* | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Source code in `strands/session/repository_session_manager.py`

```
def redact_latest_message(self, redact_message: Message, agent: "Agent", **kwargs: Any) -> None:
    """Redact the latest message appended to the session.

    Args:
        redact_message: New message to use that contains the redact content
        agent: Agent to apply the message redaction to
        **kwargs: Additional keyword arguments for future extensibility.
    """
    latest_agent_message = self._latest_agent_message[agent.agent_id]
    if latest_agent_message is None:
        raise SessionException("No message to redact.")
    latest_agent_message.redact_message = redact_message
    return self.session_repository.update_message(self.session_id, agent.agent_id, latest_agent_message)

```

#### `sync_agent(agent, **kwargs)`

Serialize and update the agent into the session repository.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `agent` | `Agent` | Agent to sync to the session. | *required* | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Source code in `strands/session/repository_session_manager.py`

```
def sync_agent(self, agent: "Agent", **kwargs: Any) -> None:
    """Serialize and update the agent into the session repository.

    Args:
        agent: Agent to sync to the session.
        **kwargs: Additional keyword arguments for future extensibility.
    """
    self.session_repository.update_agent(
        self.session_id,
        SessionAgent.from_agent(agent),
    )

```

## `strands.session.s3_session_manager`

S3-based session manager for cloud storage.

### `S3SessionManager`

Bases: `RepositorySessionManager`, `SessionRepository`

S3-based session manager for cloud storage.

Creates the following filesystem structure for the session storage: // └── session\_/ ├── session.json # Session metadata └── agents/ └── agent\_/ ├── agent.json # Agent metadata └── messages/ ├── message\_.json └── message\_.json

Source code in `strands/session/s3_session_manager.py`

```
class S3SessionManager(RepositorySessionManager, SessionRepository):
    """S3-based session manager for cloud storage.

    Creates the following filesystem structure for the session storage:
    /<sessions_dir>/
    └── session_<session_id>/
        ├── session.json                # Session metadata
        └── agents/
            └── agent_<agent_id>/
                ├── agent.json          # Agent metadata
                └── messages/
                    ├── message_<id1>.json
                    └── message_<id2>.json

    """

    def __init__(
        self,
        session_id: str,
        bucket: str,
        prefix: str = "",
        boto_session: Optional[boto3.Session] = None,
        boto_client_config: Optional[BotocoreConfig] = None,
        region_name: Optional[str] = None,
        **kwargs: Any,
    ):
        """Initialize S3SessionManager with S3 storage.

        Args:
            session_id: ID for the session
            bucket: S3 bucket name (required)
            prefix: S3 key prefix for storage organization
            boto_session: Optional boto3 session
            boto_client_config: Optional boto3 client configuration
            region_name: AWS region for S3 storage
            **kwargs: Additional keyword arguments for future extensibility.
        """
        self.bucket = bucket
        self.prefix = prefix

        session = boto_session or boto3.Session(region_name=region_name)

        # Add strands-agents to the request user agent
        if boto_client_config:
            existing_user_agent = getattr(boto_client_config, "user_agent_extra", None)
            # Append 'strands-agents' to existing user_agent_extra or set it if not present
            if existing_user_agent:
                new_user_agent = f"{existing_user_agent} strands-agents"
            else:
                new_user_agent = "strands-agents"
            client_config = boto_client_config.merge(BotocoreConfig(user_agent_extra=new_user_agent))
        else:
            client_config = BotocoreConfig(user_agent_extra="strands-agents")

        self.client = session.client(service_name="s3", config=client_config)
        super().__init__(session_id=session_id, session_repository=self)

    def _get_session_path(self, session_id: str) -> str:
        """Get session S3 prefix."""
        return f"{self.prefix}/{SESSION_PREFIX}{session_id}/"

    def _get_agent_path(self, session_id: str, agent_id: str) -> str:
        """Get agent S3 prefix."""
        session_path = self._get_session_path(session_id)
        return f"{session_path}agents/{AGENT_PREFIX}{agent_id}/"

    def _get_message_path(self, session_id: str, agent_id: str, message_id: int) -> str:
        """Get message S3 key.

        Args:
            session_id: ID of the session
            agent_id: ID of the agent
            message_id: Index of the message
            **kwargs: Additional keyword arguments for future extensibility.

        Returns:
            The key for the message
        """
        agent_path = self._get_agent_path(session_id, agent_id)
        return f"{agent_path}messages/{MESSAGE_PREFIX}{message_id}.json"

    def _read_s3_object(self, key: str) -> Optional[Dict[str, Any]]:
        """Read JSON object from S3."""
        try:
            response = self.client.get_object(Bucket=self.bucket, Key=key)
            content = response["Body"].read().decode("utf-8")
            return cast(dict[str, Any], json.loads(content))
        except ClientError as e:
            if e.response["Error"]["Code"] == "NoSuchKey":
                return None
            else:
                raise SessionException(f"S3 error reading {key}: {e}") from e
        except json.JSONDecodeError as e:
            raise SessionException(f"Invalid JSON in S3 object {key}: {e}") from e

    def _write_s3_object(self, key: str, data: Dict[str, Any]) -> None:
        """Write JSON object to S3."""
        try:
            content = json.dumps(data, indent=2, ensure_ascii=False)
            self.client.put_object(
                Bucket=self.bucket, Key=key, Body=content.encode("utf-8"), ContentType="application/json"
            )
        except ClientError as e:
            raise SessionException(f"Failed to write S3 object {key}: {e}") from e

    def create_session(self, session: Session, **kwargs: Any) -> Session:
        """Create a new session in S3."""
        session_key = f"{self._get_session_path(session.session_id)}session.json"

        # Check if session already exists
        try:
            self.client.head_object(Bucket=self.bucket, Key=session_key)
            raise SessionException(f"Session {session.session_id} already exists")
        except ClientError as e:
            if e.response["Error"]["Code"] != "404":
                raise SessionException(f"S3 error checking session existence: {e}") from e

        # Write session object
        session_dict = session.to_dict()
        self._write_s3_object(session_key, session_dict)
        return session

    def read_session(self, session_id: str, **kwargs: Any) -> Optional[Session]:
        """Read session data from S3."""
        session_key = f"{self._get_session_path(session_id)}session.json"
        session_data = self._read_s3_object(session_key)
        if session_data is None:
            return None
        return Session.from_dict(session_data)

    def delete_session(self, session_id: str, **kwargs: Any) -> None:
        """Delete session and all associated data from S3."""
        session_prefix = self._get_session_path(session_id)
        try:
            paginator = self.client.get_paginator("list_objects_v2")
            pages = paginator.paginate(Bucket=self.bucket, Prefix=session_prefix)

            objects_to_delete = []
            for page in pages:
                if "Contents" in page:
                    objects_to_delete.extend([{"Key": obj["Key"]} for obj in page["Contents"]])

            if not objects_to_delete:
                raise SessionException(f"Session {session_id} does not exist")

            # Delete objects in batches
            for i in range(0, len(objects_to_delete), 1000):
                batch = objects_to_delete[i : i + 1000]
                self.client.delete_objects(Bucket=self.bucket, Delete={"Objects": batch})

        except ClientError as e:
            raise SessionException(f"S3 error deleting session {session_id}: {e}") from e

    def create_agent(self, session_id: str, session_agent: SessionAgent, **kwargs: Any) -> None:
        """Create a new agent in S3."""
        agent_id = session_agent.agent_id
        agent_dict = session_agent.to_dict()
        agent_key = f"{self._get_agent_path(session_id, agent_id)}agent.json"
        self._write_s3_object(agent_key, agent_dict)

    def read_agent(self, session_id: str, agent_id: str, **kwargs: Any) -> Optional[SessionAgent]:
        """Read agent data from S3."""
        agent_key = f"{self._get_agent_path(session_id, agent_id)}agent.json"
        agent_data = self._read_s3_object(agent_key)
        if agent_data is None:
            return None
        return SessionAgent.from_dict(agent_data)

    def update_agent(self, session_id: str, session_agent: SessionAgent, **kwargs: Any) -> None:
        """Update agent data in S3."""
        agent_id = session_agent.agent_id
        previous_agent = self.read_agent(session_id=session_id, agent_id=agent_id)
        if previous_agent is None:
            raise SessionException(f"Agent {agent_id} in session {session_id} does not exist")

        # Preserve creation timestamp
        session_agent.created_at = previous_agent.created_at
        agent_key = f"{self._get_agent_path(session_id, agent_id)}agent.json"
        self._write_s3_object(agent_key, session_agent.to_dict())

    def create_message(self, session_id: str, agent_id: str, session_message: SessionMessage, **kwargs: Any) -> None:
        """Create a new message in S3."""
        message_id = session_message.message_id
        message_dict = session_message.to_dict()
        message_key = self._get_message_path(session_id, agent_id, message_id)
        self._write_s3_object(message_key, message_dict)

    def read_message(self, session_id: str, agent_id: str, message_id: int, **kwargs: Any) -> Optional[SessionMessage]:
        """Read message data from S3."""
        message_key = self._get_message_path(session_id, agent_id, message_id)
        message_data = self._read_s3_object(message_key)
        if message_data is None:
            return None
        return SessionMessage.from_dict(message_data)

    def update_message(self, session_id: str, agent_id: str, session_message: SessionMessage, **kwargs: Any) -> None:
        """Update message data in S3."""
        message_id = session_message.message_id
        previous_message = self.read_message(session_id=session_id, agent_id=agent_id, message_id=message_id)
        if previous_message is None:
            raise SessionException(f"Message {message_id} does not exist")

        # Preserve creation timestamp
        session_message.created_at = previous_message.created_at
        message_key = self._get_message_path(session_id, agent_id, message_id)
        self._write_s3_object(message_key, session_message.to_dict())

    def list_messages(
        self, session_id: str, agent_id: str, limit: Optional[int] = None, offset: int = 0, **kwargs: Any
    ) -> List[SessionMessage]:
        """List messages for an agent with pagination from S3."""
        messages_prefix = f"{self._get_agent_path(session_id, agent_id)}messages/"
        try:
            paginator = self.client.get_paginator("list_objects_v2")
            pages = paginator.paginate(Bucket=self.bucket, Prefix=messages_prefix)

            # Collect all message keys and extract their indices
            message_index_keys: list[tuple[int, str]] = []
            for page in pages:
                if "Contents" in page:
                    for obj in page["Contents"]:
                        key = obj["Key"]
                        if key.endswith(".json") and MESSAGE_PREFIX in key:
                            # Extract the filename part from the full S3 key
                            filename = key.split("/")[-1]
                            # Extract index from message_<index>.json format
                            index = int(filename[len(MESSAGE_PREFIX) : -5])  # Remove prefix and .json suffix
                            message_index_keys.append((index, key))

            # Sort by index and extract just the keys
            message_keys = [k for _, k in sorted(message_index_keys)]

            # Apply pagination to keys before loading content
            if limit is not None:
                message_keys = message_keys[offset : offset + limit]
            else:
                message_keys = message_keys[offset:]

            # Load only the required message objects
            messages: List[SessionMessage] = []
            for key in message_keys:
                message_data = self._read_s3_object(key)
                if message_data:
                    messages.append(SessionMessage.from_dict(message_data))

            return messages

        except ClientError as e:
            raise SessionException(f"S3 error reading messages: {e}") from e

```

#### `__init__(session_id, bucket, prefix='', boto_session=None, boto_client_config=None, region_name=None, **kwargs)`

Initialize S3SessionManager with S3 storage.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `session_id` | `str` | ID for the session | *required* | | `bucket` | `str` | S3 bucket name (required) | *required* | | `prefix` | `str` | S3 key prefix for storage organization | `''` | | `boto_session` | `Optional[Session]` | Optional boto3 session | `None` | | `boto_client_config` | `Optional[Config]` | Optional boto3 client configuration | `None` | | `region_name` | `Optional[str]` | AWS region for S3 storage | `None` | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Source code in `strands/session/s3_session_manager.py`

```
def __init__(
    self,
    session_id: str,
    bucket: str,
    prefix: str = "",
    boto_session: Optional[boto3.Session] = None,
    boto_client_config: Optional[BotocoreConfig] = None,
    region_name: Optional[str] = None,
    **kwargs: Any,
):
    """Initialize S3SessionManager with S3 storage.

    Args:
        session_id: ID for the session
        bucket: S3 bucket name (required)
        prefix: S3 key prefix for storage organization
        boto_session: Optional boto3 session
        boto_client_config: Optional boto3 client configuration
        region_name: AWS region for S3 storage
        **kwargs: Additional keyword arguments for future extensibility.
    """
    self.bucket = bucket
    self.prefix = prefix

    session = boto_session or boto3.Session(region_name=region_name)

    # Add strands-agents to the request user agent
    if boto_client_config:
        existing_user_agent = getattr(boto_client_config, "user_agent_extra", None)
        # Append 'strands-agents' to existing user_agent_extra or set it if not present
        if existing_user_agent:
            new_user_agent = f"{existing_user_agent} strands-agents"
        else:
            new_user_agent = "strands-agents"
        client_config = boto_client_config.merge(BotocoreConfig(user_agent_extra=new_user_agent))
    else:
        client_config = BotocoreConfig(user_agent_extra="strands-agents")

    self.client = session.client(service_name="s3", config=client_config)
    super().__init__(session_id=session_id, session_repository=self)

```

#### `create_agent(session_id, session_agent, **kwargs)`

Create a new agent in S3.

Source code in `strands/session/s3_session_manager.py`

```
def create_agent(self, session_id: str, session_agent: SessionAgent, **kwargs: Any) -> None:
    """Create a new agent in S3."""
    agent_id = session_agent.agent_id
    agent_dict = session_agent.to_dict()
    agent_key = f"{self._get_agent_path(session_id, agent_id)}agent.json"
    self._write_s3_object(agent_key, agent_dict)

```

#### `create_message(session_id, agent_id, session_message, **kwargs)`

Create a new message in S3.

Source code in `strands/session/s3_session_manager.py`

```
def create_message(self, session_id: str, agent_id: str, session_message: SessionMessage, **kwargs: Any) -> None:
    """Create a new message in S3."""
    message_id = session_message.message_id
    message_dict = session_message.to_dict()
    message_key = self._get_message_path(session_id, agent_id, message_id)
    self._write_s3_object(message_key, message_dict)

```

#### `create_session(session, **kwargs)`

Create a new session in S3.

Source code in `strands/session/s3_session_manager.py`

```
def create_session(self, session: Session, **kwargs: Any) -> Session:
    """Create a new session in S3."""
    session_key = f"{self._get_session_path(session.session_id)}session.json"

    # Check if session already exists
    try:
        self.client.head_object(Bucket=self.bucket, Key=session_key)
        raise SessionException(f"Session {session.session_id} already exists")
    except ClientError as e:
        if e.response["Error"]["Code"] != "404":
            raise SessionException(f"S3 error checking session existence: {e}") from e

    # Write session object
    session_dict = session.to_dict()
    self._write_s3_object(session_key, session_dict)
    return session

```

#### `delete_session(session_id, **kwargs)`

Delete session and all associated data from S3.

Source code in `strands/session/s3_session_manager.py`

```
def delete_session(self, session_id: str, **kwargs: Any) -> None:
    """Delete session and all associated data from S3."""
    session_prefix = self._get_session_path(session_id)
    try:
        paginator = self.client.get_paginator("list_objects_v2")
        pages = paginator.paginate(Bucket=self.bucket, Prefix=session_prefix)

        objects_to_delete = []
        for page in pages:
            if "Contents" in page:
                objects_to_delete.extend([{"Key": obj["Key"]} for obj in page["Contents"]])

        if not objects_to_delete:
            raise SessionException(f"Session {session_id} does not exist")

        # Delete objects in batches
        for i in range(0, len(objects_to_delete), 1000):
            batch = objects_to_delete[i : i + 1000]
            self.client.delete_objects(Bucket=self.bucket, Delete={"Objects": batch})

    except ClientError as e:
        raise SessionException(f"S3 error deleting session {session_id}: {e}") from e

```

#### `list_messages(session_id, agent_id, limit=None, offset=0, **kwargs)`

List messages for an agent with pagination from S3.

Source code in `strands/session/s3_session_manager.py`

```
def list_messages(
    self, session_id: str, agent_id: str, limit: Optional[int] = None, offset: int = 0, **kwargs: Any
) -> List[SessionMessage]:
    """List messages for an agent with pagination from S3."""
    messages_prefix = f"{self._get_agent_path(session_id, agent_id)}messages/"
    try:
        paginator = self.client.get_paginator("list_objects_v2")
        pages = paginator.paginate(Bucket=self.bucket, Prefix=messages_prefix)

        # Collect all message keys and extract their indices
        message_index_keys: list[tuple[int, str]] = []
        for page in pages:
            if "Contents" in page:
                for obj in page["Contents"]:
                    key = obj["Key"]
                    if key.endswith(".json") and MESSAGE_PREFIX in key:
                        # Extract the filename part from the full S3 key
                        filename = key.split("/")[-1]
                        # Extract index from message_<index>.json format
                        index = int(filename[len(MESSAGE_PREFIX) : -5])  # Remove prefix and .json suffix
                        message_index_keys.append((index, key))

        # Sort by index and extract just the keys
        message_keys = [k for _, k in sorted(message_index_keys)]

        # Apply pagination to keys before loading content
        if limit is not None:
            message_keys = message_keys[offset : offset + limit]
        else:
            message_keys = message_keys[offset:]

        # Load only the required message objects
        messages: List[SessionMessage] = []
        for key in message_keys:
            message_data = self._read_s3_object(key)
            if message_data:
                messages.append(SessionMessage.from_dict(message_data))

        return messages

    except ClientError as e:
        raise SessionException(f"S3 error reading messages: {e}") from e

```

#### `read_agent(session_id, agent_id, **kwargs)`

Read agent data from S3.

Source code in `strands/session/s3_session_manager.py`

```
def read_agent(self, session_id: str, agent_id: str, **kwargs: Any) -> Optional[SessionAgent]:
    """Read agent data from S3."""
    agent_key = f"{self._get_agent_path(session_id, agent_id)}agent.json"
    agent_data = self._read_s3_object(agent_key)
    if agent_data is None:
        return None
    return SessionAgent.from_dict(agent_data)

```

#### `read_message(session_id, agent_id, message_id, **kwargs)`

Read message data from S3.

Source code in `strands/session/s3_session_manager.py`

```
def read_message(self, session_id: str, agent_id: str, message_id: int, **kwargs: Any) -> Optional[SessionMessage]:
    """Read message data from S3."""
    message_key = self._get_message_path(session_id, agent_id, message_id)
    message_data = self._read_s3_object(message_key)
    if message_data is None:
        return None
    return SessionMessage.from_dict(message_data)

```

#### `read_session(session_id, **kwargs)`

Read session data from S3.

Source code in `strands/session/s3_session_manager.py`

```
def read_session(self, session_id: str, **kwargs: Any) -> Optional[Session]:
    """Read session data from S3."""
    session_key = f"{self._get_session_path(session_id)}session.json"
    session_data = self._read_s3_object(session_key)
    if session_data is None:
        return None
    return Session.from_dict(session_data)

```

#### `update_agent(session_id, session_agent, **kwargs)`

Update agent data in S3.

Source code in `strands/session/s3_session_manager.py`

```
def update_agent(self, session_id: str, session_agent: SessionAgent, **kwargs: Any) -> None:
    """Update agent data in S3."""
    agent_id = session_agent.agent_id
    previous_agent = self.read_agent(session_id=session_id, agent_id=agent_id)
    if previous_agent is None:
        raise SessionException(f"Agent {agent_id} in session {session_id} does not exist")

    # Preserve creation timestamp
    session_agent.created_at = previous_agent.created_at
    agent_key = f"{self._get_agent_path(session_id, agent_id)}agent.json"
    self._write_s3_object(agent_key, session_agent.to_dict())

```

#### `update_message(session_id, agent_id, session_message, **kwargs)`

Update message data in S3.

Source code in `strands/session/s3_session_manager.py`

```
def update_message(self, session_id: str, agent_id: str, session_message: SessionMessage, **kwargs: Any) -> None:
    """Update message data in S3."""
    message_id = session_message.message_id
    previous_message = self.read_message(session_id=session_id, agent_id=agent_id, message_id=message_id)
    if previous_message is None:
        raise SessionException(f"Message {message_id} does not exist")

    # Preserve creation timestamp
    session_message.created_at = previous_message.created_at
    message_key = self._get_message_path(session_id, agent_id, message_id)
    self._write_s3_object(message_key, session_message.to_dict())

```

## `strands.session.session_manager`

Session manager interface for agent session management.

## `strands.session.session_repository`

Session repository interface for agent session management.

### `SessionRepository`

Bases: `ABC`

Abstract repository for creating, reading, and updating Sessions, AgentSessions, and AgentMessages.

Source code in `strands/session/session_repository.py`

```
class SessionRepository(ABC):
    """Abstract repository for creating, reading, and updating Sessions, AgentSessions, and AgentMessages."""

    @abstractmethod
    def create_session(self, session: Session, **kwargs: Any) -> Session:
        """Create a new Session."""

    @abstractmethod
    def read_session(self, session_id: str, **kwargs: Any) -> Optional[Session]:
        """Read a Session."""

    @abstractmethod
    def create_agent(self, session_id: str, session_agent: SessionAgent, **kwargs: Any) -> None:
        """Create a new Agent in a Session."""

    @abstractmethod
    def read_agent(self, session_id: str, agent_id: str, **kwargs: Any) -> Optional[SessionAgent]:
        """Read an Agent."""

    @abstractmethod
    def update_agent(self, session_id: str, session_agent: SessionAgent, **kwargs: Any) -> None:
        """Update an Agent."""

    @abstractmethod
    def create_message(self, session_id: str, agent_id: str, session_message: SessionMessage, **kwargs: Any) -> None:
        """Create a new Message for the Agent."""

    @abstractmethod
    def read_message(self, session_id: str, agent_id: str, message_id: int, **kwargs: Any) -> Optional[SessionMessage]:
        """Read a Message."""

    @abstractmethod
    def update_message(self, session_id: str, agent_id: str, session_message: SessionMessage, **kwargs: Any) -> None:
        """Update a Message.

        A message is usually only updated when some content is redacted due to a guardrail.
        """

    @abstractmethod
    def list_messages(
        self, session_id: str, agent_id: str, limit: Optional[int] = None, offset: int = 0, **kwargs: Any
    ) -> list[SessionMessage]:
        """List Messages from an Agent with pagination."""

```

#### `create_agent(session_id, session_agent, **kwargs)`

Create a new Agent in a Session.

Source code in `strands/session/session_repository.py`

```
@abstractmethod
def create_agent(self, session_id: str, session_agent: SessionAgent, **kwargs: Any) -> None:
    """Create a new Agent in a Session."""

```

#### `create_message(session_id, agent_id, session_message, **kwargs)`

Create a new Message for the Agent.

Source code in `strands/session/session_repository.py`

```
@abstractmethod
def create_message(self, session_id: str, agent_id: str, session_message: SessionMessage, **kwargs: Any) -> None:
    """Create a new Message for the Agent."""

```

#### `create_session(session, **kwargs)`

Create a new Session.

Source code in `strands/session/session_repository.py`

```
@abstractmethod
def create_session(self, session: Session, **kwargs: Any) -> Session:
    """Create a new Session."""

```

#### `list_messages(session_id, agent_id, limit=None, offset=0, **kwargs)`

List Messages from an Agent with pagination.

Source code in `strands/session/session_repository.py`

```
@abstractmethod
def list_messages(
    self, session_id: str, agent_id: str, limit: Optional[int] = None, offset: int = 0, **kwargs: Any
) -> list[SessionMessage]:
    """List Messages from an Agent with pagination."""

```

#### `read_agent(session_id, agent_id, **kwargs)`

Read an Agent.

Source code in `strands/session/session_repository.py`

```
@abstractmethod
def read_agent(self, session_id: str, agent_id: str, **kwargs: Any) -> Optional[SessionAgent]:
    """Read an Agent."""

```

#### `read_message(session_id, agent_id, message_id, **kwargs)`

Read a Message.

Source code in `strands/session/session_repository.py`

```
@abstractmethod
def read_message(self, session_id: str, agent_id: str, message_id: int, **kwargs: Any) -> Optional[SessionMessage]:
    """Read a Message."""

```

#### `read_session(session_id, **kwargs)`

Read a Session.

Source code in `strands/session/session_repository.py`

```
@abstractmethod
def read_session(self, session_id: str, **kwargs: Any) -> Optional[Session]:
    """Read a Session."""

```

#### `update_agent(session_id, session_agent, **kwargs)`

Update an Agent.

Source code in `strands/session/session_repository.py`

```
@abstractmethod
def update_agent(self, session_id: str, session_agent: SessionAgent, **kwargs: Any) -> None:
    """Update an Agent."""

```

#### `update_message(session_id, agent_id, session_message, **kwargs)`

Update a Message.

A message is usually only updated when some content is redacted due to a guardrail.

Source code in `strands/session/session_repository.py`

```
@abstractmethod
def update_message(self, session_id: str, agent_id: str, session_message: SessionMessage, **kwargs: Any) -> None:
    """Update a Message.

    A message is usually only updated when some content is redacted due to a guardrail.
    """

```
