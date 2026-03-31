Abstract base class for Agent model providers.

## CacheConfig

```python
@dataclass
class CacheConfig()
```

Defined in: [src/strands/models/model.py:26](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/model.py#L26)

Configuration for prompt caching.

**Attributes**:

-   `strategy` - Caching strategy to use.
    -   “auto”: Automatically detect model support and inject cachePoint to maximize cache coverage
    -   “anthropic”: Inject cachePoint in Anthropic-compatible format without model support check

## Model

```python
class Model(abc.ABC)
```

Defined in: [src/strands/models/model.py:38](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/model.py#L38)

Abstract base class for Agent model providers.

This class defines the interface for all model implementations in the Strands Agents SDK. It provides a standardized way to configure and process requests for different AI model providers.

#### stateful

```python
@property
def stateful() -> bool
```

Defined in: [src/strands/models/model.py:46](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/model.py#L46)

Whether the model manages conversation state server-side.

**Returns**:

False by default. Model providers that support server-side state should override this.

#### update\_config

```python
@abc.abstractmethod
def update_config(**model_config: Any) -> None
```

Defined in: [src/strands/models/model.py:56](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/model.py#L56)

Update the model configuration with the provided arguments.

**Arguments**:

-   `**model_config` - Configuration overrides.

#### get\_config

```python
@abc.abstractmethod
def get_config() -> Any
```

Defined in: [src/strands/models/model.py:66](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/model.py#L66)

Return the model configuration.

**Returns**:

The model’s configuration.

#### structured\_output

```python
@abc.abstractmethod
def structured_output(
        output_model: type[T],
        prompt: Messages,
        system_prompt: str | None = None,
        **kwargs: Any) -> AsyncGenerator[dict[str, T | Any], None]
```

Defined in: [src/strands/models/model.py:76](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/model.py#L76)

Get structured output from the model.

**Arguments**:

-   `output_model` - The output model to use for the agent.
-   `prompt` - The prompt messages to use for the agent.
-   `system_prompt` - System prompt to provide context to the model.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Yields**:

Model events with the last being the structured output.

**Raises**:

-   `ValidationException` - The response format from the model does not match the output\_model

#### stream

```python
@abc.abstractmethod
def stream(messages: Messages,
           tool_specs: list[ToolSpec] | None = None,
           system_prompt: str | None = None,
           *,
           tool_choice: ToolChoice | None = None,
           system_prompt_content: list[SystemContentBlock] | None = None,
           invocation_state: dict[str, Any] | None = None,
           **kwargs: Any) -> AsyncIterable[StreamEvent]
```

Defined in: [src/strands/models/model.py:97](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/model.py#L97)

Stream conversation with the model.

This method handles the full lifecycle of conversing with the model:

1.  Format the messages, tool specs, and configuration into a streaming request
2.  Send the request to the model
3.  Yield the formatted message chunks

**Arguments**:

-   `messages` - List of message objects to be processed by the model.
-   `tool_specs` - List of tool specifications to make available to the model.
-   `system_prompt` - System prompt to provide context to the model.
-   `tool_choice` - Selection strategy for tool invocation.
-   `system_prompt_content` - System prompt content blocks for advanced features like caching.
-   `invocation_state` - Caller-provided state/context that was passed to the agent when it was invoked.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Yields**:

Formatted message chunks from the model.

**Raises**:

-   `ModelThrottledException` - When the model service is throttling requests from the client.

## \_ModelPlugin

```python
class _ModelPlugin(Plugin)
```

Defined in: [src/strands/models/model.py:134](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/model.py#L134)

Plugin that manages model-related lifecycle hooks.

#### name

```python
@property
def name() -> str
```

Defined in: [src/strands/models/model.py:138](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/model.py#L138)

A stable string identifier for this plugin.

#### init\_agent

```python
def init_agent(agent: "Agent") -> None
```

Defined in: [src/strands/models/model.py:156](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/model.py#L156)

Register model lifecycle hooks with the agent.

**Arguments**:

-   `agent` - The agent instance to register hooks with.