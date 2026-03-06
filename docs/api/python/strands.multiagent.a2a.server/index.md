A2A-compatible wrapper for Strands Agent.

This module provides the A2AAgent class, which adapts a Strands Agent to the A2A protocol, allowing it to be used in A2A-compatible systems.

## A2AServer

```python
class A2AServer()
```

Defined in: [src/strands/multiagent/a2a/server.py:26](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/a2a/server.py#L26)

A2A-compatible wrapper for Strands Agent.

#### \_\_init\_\_

```python
def __init__(agent: SAAgent,
             *,
             host: str = "127.0.0.1",
             port: int = 9000,
             http_url: str | None = None,
             serve_at_root: bool = False,
             version: str = "0.0.1",
             skills: list[AgentSkill] | None = None,
             task_store: TaskStore | None = None,
             queue_manager: QueueManager | None = None,
             push_config_store: PushNotificationConfigStore | None = None,
             push_sender: PushNotificationSender | None = None,
             enable_a2a_compliant_streaming: bool = False)
```

Defined in: [src/strands/multiagent/a2a/server.py:29](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/a2a/server.py#L29)

Initialize an A2A-compatible server from a Strands agent.

**Arguments**:

-   `agent` - The Strands Agent to wrap with A2A compatibility.
-   `host` - The hostname or IP address to bind the A2A server to. Defaults to “127.0.0.1”.
-   `port` - The port to bind the A2A server to. Defaults to 9000.
-   `http_url` - The public HTTP URL where this agent will be accessible. If provided, this overrides the generated URL from host/port and enables automatic path-based mounting for load balancer scenarios.
-   `Example` - “[http://my-alb.amazonaws.com/agent1](http://my-alb.amazonaws.com/agent1)”
-   `serve_at_root` - If True, forces the server to serve at root path regardless of http\_url path component. Use this when your load balancer strips path prefixes. Defaults to False.
-   `version` - The version of the agent. Defaults to “0.0.1”.
-   `skills` - The list of capabilities or functions the agent can perform.
-   `task_store` - Custom task store implementation for managing agent tasks. If None, uses InMemoryTaskStore.
-   `queue_manager` - Custom queue manager for handling message queues. If None, no queue management is used.
-   `push_config_store` - Custom store for push notification configurations. If None, no push notification configuration is used.
-   `push_sender` - Custom push notification sender implementation. If None, no push notifications are sent.
-   `enable_a2a_compliant_streaming` - If True, uses A2A-compliant streaming with artifact updates. If False, uses legacy status updates streaming behavior for backwards compatibility. Defaults to False.

#### public\_agent\_card

```python
@property
def public_agent_card() -> AgentCard
```

Defined in: [src/strands/multiagent/a2a/server.py:130](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/a2a/server.py#L130)

Get the public AgentCard for this agent.

The AgentCard contains metadata about the agent, including its name, description, URL, version, skills, and capabilities. This information is used by other agents and systems to discover and interact with this agent.

**Returns**:

-   `AgentCard` - The public agent card containing metadata about this agent.

**Raises**:

-   `ValueError` - If name or description is None or empty.

#### agent\_skills

```python
@property
def agent_skills() -> list[AgentSkill]
```

Defined in: [src/strands/multiagent/a2a/server.py:174](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/a2a/server.py#L174)

Get the list of skills this agent provides.

#### agent\_skills

```python
@agent_skills.setter
def agent_skills(skills: list[AgentSkill]) -> None
```

Defined in: [src/strands/multiagent/a2a/server.py:179](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/a2a/server.py#L179)

Set the list of skills this agent provides.

**Arguments**:

-   `skills` - A list of AgentSkill objects to set for this agent.

#### to\_starlette\_app

```python
def to_starlette_app(*, app_kwargs: dict[str, Any] | None = None) -> Starlette
```

Defined in: [src/strands/multiagent/a2a/server.py:187](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/a2a/server.py#L187)

Create a Starlette application for serving this agent via HTTP.

Automatically handles path-based mounting if a mount path was derived from the http\_url parameter.

**Arguments**:

-   `app_kwargs` - Additional keyword arguments to pass to the Starlette constructor.

**Returns**:

-   `Starlette` - A Starlette application configured to serve this agent.

#### to\_fastapi\_app

```python
def to_fastapi_app(*, app_kwargs: dict[str, Any] | None = None) -> FastAPI
```

Defined in: [src/strands/multiagent/a2a/server.py:212](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/a2a/server.py#L212)

Create a FastAPI application for serving this agent via HTTP.

Automatically handles path-based mounting if a mount path was derived from the http\_url parameter.

**Arguments**:

-   `app_kwargs` - Additional keyword arguments to pass to the FastAPI constructor.

**Returns**:

-   `FastAPI` - A FastAPI application configured to serve this agent.

#### serve

```python
def serve(app_type: Literal["fastapi", "starlette"] = "starlette",
          *,
          host: str | None = None,
          port: int | None = None,
          **kwargs: Any) -> None
```

Defined in: [src/strands/multiagent/a2a/server.py:237](https://github.com/strands-agents/sdk-python/blob/main/src/strands/multiagent/a2a/server.py#L237)

Start the A2A server with the specified application type.

This method starts an HTTP server that exposes the agent via the A2A protocol. The server can be implemented using either FastAPI or Starlette, depending on the specified app\_type.

**Arguments**:

-   `app_type` - The type of application to serve, either “fastapi” or “starlette”. Defaults to “starlette”.
-   `host` - The host address to bind the server to. Defaults to “0.0.0.0”.
-   `port` - The port number to bind the server to. Defaults to 9000.
-   `**kwargs` - Additional keyword arguments to pass to uvicorn.run.