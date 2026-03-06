Session manager interface for agent session management.

## SessionManager

```python
class SessionManager(HookProvider, ABC)
```

Defined in: [src/strands/session/session\_manager.py:31](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_manager.py#L31)

Abstract interface for managing sessions.

A session manager is in charge of persisting the conversation and state of an agent across its interaction. Changes made to the agents conversation, state, or other attributes should be persisted immediately after they are changed. The different methods introduced in this class are called at important lifecycle events for an agent, and should be persisted in the session.

#### register\_hooks

```python
def register_hooks(registry: HookRegistry, **kwargs: Any) -> None
```

Defined in: [src/strands/session/session\_manager.py:40](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_manager.py#L40)

Register hooks for persisting the agent to the session.

#### redact\_latest\_message

```python
@abstractmethod
def redact_latest_message(redact_message: Message, agent: "Agent",
                          **kwargs: Any) -> None
```

Defined in: [src/strands/session/session\_manager.py:65](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_manager.py#L65)

Redact the message most recently appended to the agent in the session.

**Arguments**:

-   `redact_message` - New message to use that contains the redact content
-   `agent` - Agent to apply the message redaction to
-   `**kwargs` - Additional keyword arguments for future extensibility.

#### append\_message

```python
@abstractmethod
def append_message(message: Message, agent: "Agent", **kwargs: Any) -> None
```

Defined in: [src/strands/session/session\_manager.py:75](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_manager.py#L75)

Append a message to the agent’s session.

**Arguments**:

-   `message` - Message to add to the agent in the session
-   `agent` - Agent to append the message to
-   `**kwargs` - Additional keyword arguments for future extensibility.

#### sync\_agent

```python
@abstractmethod
def sync_agent(agent: "Agent", **kwargs: Any) -> None
```

Defined in: [src/strands/session/session\_manager.py:85](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_manager.py#L85)

Serialize and sync the agent with the session storage.

**Arguments**:

-   `agent` - Agent who should be synchronized with the session storage
-   `**kwargs` - Additional keyword arguments for future extensibility.

#### initialize

```python
@abstractmethod
def initialize(agent: "Agent", **kwargs: Any) -> None
```

Defined in: [src/strands/session/session\_manager.py:94](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_manager.py#L94)

Initialize an agent with a session.

**Arguments**:

-   `agent` - Agent to initialize
-   `**kwargs` - Additional keyword arguments for future extensibility.

#### sync\_multi\_agent

```python
def sync_multi_agent(source: "MultiAgentBase", **kwargs: Any) -> None
```

Defined in: [src/strands/session/session\_manager.py:102](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_manager.py#L102)

Serialize and sync multi-agent with the session storage.

**Arguments**:

-   `source` - Multi-agent source object to persist
-   `**kwargs` - Additional keyword arguments for future extensibility.

#### initialize\_multi\_agent

```python
def initialize_multi_agent(source: "MultiAgentBase", **kwargs: Any) -> None
```

Defined in: [src/strands/session/session\_manager.py:115](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_manager.py#L115)

Read multi-agent state from persistent storage.

**Arguments**:

-   `**kwargs` - Additional keyword arguments for future extensibility.
-   `source` - Multi-agent state to initialize.

**Returns**:

Multi-agent state dictionary or empty dict if not found.

#### initialize\_bidi\_agent

```python
def initialize_bidi_agent(agent: "BidiAgent", **kwargs: Any) -> None
```

Defined in: [src/strands/session/session\_manager.py:132](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_manager.py#L132)

Initialize a bidirectional agent with a session.

**Arguments**:

-   `agent` - BidiAgent to initialize
-   `**kwargs` - Additional keyword arguments for future extensibility.

#### append\_bidi\_message

```python
def append_bidi_message(message: Message, agent: "BidiAgent",
                        **kwargs: Any) -> None
```

Defined in: [src/strands/session/session\_manager.py:145](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_manager.py#L145)

Append a message to the bidirectional agent’s session.

**Arguments**:

-   `message` - Message to add to the agent in the session
-   `agent` - BidiAgent to append the message to
-   `**kwargs` - Additional keyword arguments for future extensibility.

#### sync\_bidi\_agent

```python
def sync_bidi_agent(agent: "BidiAgent", **kwargs: Any) -> None
```

Defined in: [src/strands/session/session\_manager.py:159](https://github.com/strands-agents/sdk-python/blob/main/src/strands/session/session_manager.py#L159)

Serialize and sync the bidirectional agent with the session storage.

**Arguments**:

-   `agent` - BidiAgent who should be synchronized with the session storage
-   `**kwargs` - Additional keyword arguments for future extensibility.