LiteLLM model provider.

-   Docs: [https://docs.litellm.ai/](https://docs.litellm.ai/)

## LiteLLMModel

```python
class LiteLLMModel(OpenAIModel)
```

Defined in: [src/strands/models/litellm.py:31](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/litellm.py#L31)

LiteLLM model provider implementation.

## LiteLLMConfig

```python
class LiteLLMConfig(TypedDict)
```

Defined in: [src/strands/models/litellm.py:34](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/litellm.py#L34)

Configuration options for LiteLLM models.

**Attributes**:

-   `model_id` - Model ID (e.g., “openai/gpt-4o”, “anthropic/claude-3-sonnet”). For a complete list of supported models, see [https://docs.litellm.ai/docs/providers](https://docs.litellm.ai/docs/providers).
-   `params` - Model parameters (e.g., max\_tokens). For a complete list of supported parameters, see [https://docs.litellm.ai/docs/completion/input#input-params-1](https://docs.litellm.ai/docs/completion/input#input-params-1).

#### \_\_init\_\_

```python
def __init__(client_args: dict[str, Any] | None = None,
             **model_config: Unpack[LiteLLMConfig]) -> None
```

Defined in: [src/strands/models/litellm.py:48](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/litellm.py#L48)

Initialize provider instance.

**Arguments**:

-   `client_args` - Arguments for the LiteLLM client. For a complete list of supported arguments, see [https://github.com/BerriAI/litellm/blob/main/litellm/main.py](https://github.com/BerriAI/litellm/blob/main/litellm/main.py).
-   `**model_config` - Configuration options for the LiteLLM model.

#### update\_config

```python
@override
def update_config(**model_config: Unpack[LiteLLMConfig]) -> None
```

Defined in: [src/strands/models/litellm.py:65](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/litellm.py#L65)

Update the LiteLLM model configuration with the provided arguments.

**Arguments**:

-   `**model_config` - Configuration overrides.

#### get\_config

```python
@override
def get_config() -> LiteLLMConfig
```

Defined in: [src/strands/models/litellm.py:76](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/litellm.py#L76)

Get the LiteLLM model configuration.

**Returns**:

The LiteLLM model configuration.

#### format\_request\_message\_content

```python
@override
@classmethod
def format_request_message_content(cls, content: ContentBlock,
                                   **kwargs: Any) -> dict[str, Any]
```

Defined in: [src/strands/models/litellm.py:86](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/litellm.py#L86)

Format a LiteLLM content block.

**Arguments**:

-   `content` - Message content.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Returns**:

LiteLLM formatted content block.

**Raises**:

-   `TypeError` - If the content block type cannot be converted to a LiteLLM-compatible format.

#### format\_request\_messages

```python
@override
@classmethod
def format_request_messages(cls,
                            messages: Messages,
                            system_prompt: str | None = None,
                            *,
                            system_prompt_content: list[SystemContentBlock]
                            | None = None,
                            **kwargs: Any) -> list[dict[str, Any]]
```

Defined in: [src/strands/models/litellm.py:175](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/litellm.py#L175)

Format a LiteLLM compatible messages array with cache point support.

**Arguments**:

-   `messages` - List of message objects to be processed by the model.
-   `system_prompt` - System prompt to provide context to the model (for legacy compatibility).
-   `system_prompt_content` - System prompt content blocks to provide context to the model.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Returns**:

A LiteLLM compatible messages array.

#### format\_chunk

```python
@override
def format_chunk(event: dict[str, Any], **kwargs: Any) -> StreamEvent
```

Defined in: [src/strands/models/litellm.py:200](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/litellm.py#L200)

Format a LiteLLM response event into a standardized message chunk.

This method overrides OpenAI’s format\_chunk to handle the metadata case with prompt caching support. All other chunk types use the parent implementation.

**Arguments**:

-   `event` - A response event from the LiteLLM model.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Returns**:

The formatted chunk.

**Raises**:

-   `RuntimeError` - If chunk\_type is not recognized.

#### stream

```python
@override
async def stream(messages: Messages,
                 tool_specs: list[ToolSpec] | None = None,
                 system_prompt: str | None = None,
                 *,
                 tool_choice: ToolChoice | None = None,
                 system_prompt_content: list[SystemContentBlock] | None = None,
                 **kwargs: Any) -> AsyncGenerator[StreamEvent, None]
```

Defined in: [src/strands/models/litellm.py:244](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/litellm.py#L244)

Stream conversation with the LiteLLM model.

**Arguments**:

-   `messages` - List of message objects to be processed by the model.
-   `tool_specs` - List of tool specifications to make available to the model.
-   `system_prompt` - System prompt to provide context to the model.
-   `tool_choice` - Selection strategy for tool invocation.
-   `system_prompt_content` - System prompt content blocks to provide context to the model.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Yields**:

Formatted message chunks from the model.

#### structured\_output

```python
@override
async def structured_output(
        output_model: type[T],
        prompt: Messages,
        system_prompt: str | None = None,
        **kwargs: Any) -> AsyncGenerator[dict[str, T | Any], None]
```

Defined in: [src/strands/models/litellm.py:298](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/litellm.py#L298)

Get structured output from the model.

Some models do not support native structured output via response\_format. In cases of proxies, we may not have a way to determine support, so we fallback to using tool calling to achieve structured output.

**Arguments**:

-   `output_model` - The output model to use for the agent.
-   `prompt` - The prompt messages to use for the agent.
-   `system_prompt` - System prompt to provide context to the model.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Yields**:

Model events with the last being the structured output.