File-based session manager for local filesystem storage.

## FileSessionManager

```python
class FileSessionManager(RepositorySessionManager, SessionRepository)
```

Defined in: [src/strands/session/file\_session\_manager.py:27](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/file_session_manager.py#L27)

File-based session manager for local filesystem storage.

Creates the following filesystem structure for the session storage:

```bash
/<sessions_dir>/
└── session_<session_id>/
    ├── session.json                # Session metadata
    └── agents/
        └── agent_<agent_id>/
            ├── agent.json          # Agent metadata
            └── messages/
                ├── message_<id1>.json
                └── message_<id2>.json
```

#### \_\_init\_\_

```python
def __init__(session_id: str, storage_dir: str | None = None, **kwargs: Any)
```

Defined in: [src/strands/session/file\_session\_manager.py:44](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/file_session_manager.py#L44)

Initialize FileSession with filesystem storage.

**Arguments**:

-   `session_id` - ID for the session. ID is not allowed to contain path separators (e.g., a/b).
-   `storage_dir` - Directory for local filesystem storage (defaults to temp dir).
-   `**kwargs` - Additional keyword arguments for future extensibility.

#### create\_session

```python
def create_session(session: Session, **kwargs: Any) -> Session
```

Defined in: [src/strands/session/file\_session\_manager.py:125](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/file_session_manager.py#L125)

Create a new session.

#### read\_session

```python
def read_session(session_id: str, **kwargs: Any) -> Session | None
```

Defined in: [src/strands/session/file\_session\_manager.py:143](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/file_session_manager.py#L143)

Read session data.

#### delete\_session

```python
def delete_session(session_id: str, **kwargs: Any) -> None
```

Defined in: [src/strands/session/file\_session\_manager.py:152](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/file_session_manager.py#L152)

Delete session and all associated data.

#### create\_agent

```python
def create_agent(session_id: str, session_agent: SessionAgent,
                 **kwargs: Any) -> None
```

Defined in: [src/strands/session/file\_session\_manager.py:160](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/file_session_manager.py#L160)

Create a new agent in the session.

#### read\_agent

```python
def read_agent(session_id: str, agent_id: str,
               **kwargs: Any) -> SessionAgent | None
```

Defined in: [src/strands/session/file\_session\_manager.py:172](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/file_session_manager.py#L172)

Read agent data.

#### update\_agent

```python
def update_agent(session_id: str, session_agent: SessionAgent,
                 **kwargs: Any) -> None
```

Defined in: [src/strands/session/file\_session\_manager.py:181](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/file_session_manager.py#L181)

Update agent data.

#### create\_message

```python
def create_message(session_id: str, agent_id: str,
                   session_message: SessionMessage, **kwargs: Any) -> None
```

Defined in: [src/strands/session/file\_session\_manager.py:192](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/file_session_manager.py#L192)

Create a new message for the agent.

#### read\_message

```python
def read_message(session_id: str, agent_id: str, message_id: int,
                 **kwargs: Any) -> SessionMessage | None
```

Defined in: [src/strands/session/file\_session\_manager.py:202](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/file_session_manager.py#L202)

Read message data.

#### update\_message

```python
def update_message(session_id: str, agent_id: str,
                   session_message: SessionMessage, **kwargs: Any) -> None
```

Defined in: [src/strands/session/file\_session\_manager.py:210](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/file_session_manager.py#L210)

Update message data.

#### list\_messages

```python
def list_messages(session_id: str,
                  agent_id: str,
                  limit: int | None = None,
                  offset: int = 0,
                  **kwargs: Any) -> list[SessionMessage]
```

Defined in: [src/strands/session/file\_session\_manager.py:222](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/file_session_manager.py#L222)

List messages for an agent with pagination.

#### create\_multi\_agent

```python
def create_multi_agent(session_id: str, multi_agent: "MultiAgentBase",
                       **kwargs: Any) -> None
```

Defined in: [src/strands/session/file\_session\_manager.py:262](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/file_session_manager.py#L262)

Create a new multiagent state in the session.

#### read\_multi\_agent

```python
def read_multi_agent(session_id: str, multi_agent_id: str,
                     **kwargs: Any) -> dict[str, Any] | None
```

Defined in: [src/strands/session/file\_session\_manager.py:272](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/file_session_manager.py#L272)

Read multi-agent state from filesystem.

#### update\_multi\_agent

```python
def update_multi_agent(session_id: str, multi_agent: "MultiAgentBase",
                       **kwargs: Any) -> None
```

Defined in: [src/strands/session/file\_session\_manager.py:279](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/file_session_manager.py#L279)

Update multi-agent state from filesystem.