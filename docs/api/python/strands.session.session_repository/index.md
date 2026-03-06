Session repository interface for agent session management.

## SessionRepository

```python
class SessionRepository(ABC)
```

Defined in: [src/strands/session/session\_repository.py:12](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_repository.py#L12)

Abstract repository for creating, reading, and updating Sessions, AgentSessions, and AgentMessages.

#### create\_session

```python
@abstractmethod
def create_session(session: Session, **kwargs: Any) -> Session
```

Defined in: [src/strands/session/session\_repository.py:16](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_repository.py#L16)

Create a new Session.

#### read\_session

```python
@abstractmethod
def read_session(session_id: str, **kwargs: Any) -> Session | None
```

Defined in: [src/strands/session/session\_repository.py:20](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_repository.py#L20)

Read a Session.

#### create\_agent

```python
@abstractmethod
def create_agent(session_id: str, session_agent: SessionAgent,
                 **kwargs: Any) -> None
```

Defined in: [src/strands/session/session\_repository.py:24](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_repository.py#L24)

Create a new Agent in a Session.

#### read\_agent

```python
@abstractmethod
def read_agent(session_id: str, agent_id: str,
               **kwargs: Any) -> SessionAgent | None
```

Defined in: [src/strands/session/session\_repository.py:28](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_repository.py#L28)

Read an Agent.

#### update\_agent

```python
@abstractmethod
def update_agent(session_id: str, session_agent: SessionAgent,
                 **kwargs: Any) -> None
```

Defined in: [src/strands/session/session\_repository.py:32](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_repository.py#L32)

Update an Agent.

#### create\_message

```python
@abstractmethod
def create_message(session_id: str, agent_id: str,
                   session_message: SessionMessage, **kwargs: Any) -> None
```

Defined in: [src/strands/session/session\_repository.py:36](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_repository.py#L36)

Create a new Message for the Agent.

#### read\_message

```python
@abstractmethod
def read_message(session_id: str, agent_id: str, message_id: int,
                 **kwargs: Any) -> SessionMessage | None
```

Defined in: [src/strands/session/session\_repository.py:40](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_repository.py#L40)

Read a Message.

#### update\_message

```python
@abstractmethod
def update_message(session_id: str, agent_id: str,
                   session_message: SessionMessage, **kwargs: Any) -> None
```

Defined in: [src/strands/session/session\_repository.py:44](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_repository.py#L44)

Update a Message.

A message is usually only updated when some content is redacted due to a guardrail.

#### list\_messages

```python
@abstractmethod
def list_messages(session_id: str,
                  agent_id: str,
                  limit: int | None = None,
                  offset: int = 0,
                  **kwargs: Any) -> list[SessionMessage]
```

Defined in: [src/strands/session/session\_repository.py:51](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_repository.py#L51)

List Messages from an Agent with pagination.

#### create\_multi\_agent

```python
def create_multi_agent(session_id: str, multi_agent: "MultiAgentBase",
                       **kwargs: Any) -> None
```

Defined in: [src/strands/session/session\_repository.py:56](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_repository.py#L56)

Create a new MultiAgent state for the Session.

#### read\_multi\_agent

```python
def read_multi_agent(session_id: str, multi_agent_id: str,
                     **kwargs: Any) -> dict[str, Any] | None
```

Defined in: [src/strands/session/session\_repository.py:60](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_repository.py#L60)

Read the MultiAgent state for the Session.

#### update\_multi\_agent

```python
def update_multi_agent(session_id: str, multi_agent: "MultiAgentBase",
                       **kwargs: Any) -> None
```

Defined in: [src/strands/session/session\_repository.py:64](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_repository.py#L64)

Update the MultiAgent state for the Session.