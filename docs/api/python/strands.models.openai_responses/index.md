OpenAI model provider using the Responses API.

The Responses API is OpenAI’s newer API that differs from the Chat Completions API in several key ways:

1.  The Responses API can maintain conversation state server-side through “previous\_response\_id”, while Chat Completions is stateless and requires sending full conversation history each time. Note: This implementation currently only implements the stateless approach.
    
2.  Responses API uses “input” (list of items) instead of “messages”, and system prompts are passed as “instructions” rather than a system role message.
    
3.  Responses API supports built-in tools (web search, code interpreter, file search) Note: These are not yet implemented in this provider.
    

-   Docs: [https://platform.openai.com/docs/api-reference/responses](https://platform.openai.com/docs/api-reference/responses)

## Client

```python
class Client(Protocol)
```

Defined in: [src/strands/models/openai\_responses.py:105](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/openai_responses.py#L105)

Protocol defining the OpenAI Responses API interface for the underlying provider client.

#### responses

```python
@property
def responses() -> Any
```

Defined in: [src/strands/models/openai\_responses.py:110](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/openai_responses.py#L110)

Responses interface.

## OpenAIResponsesModel

```python
class OpenAIResponsesModel(Model)
```

Defined in: [src/strands/models/openai\_responses.py:115](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/openai_responses.py#L115)

OpenAI Responses API model provider implementation.

**Notes**:

This implementation currently only supports function tools (custom tools defined via tool\_specs). OpenAI’s built-in system tools are not yet supported.

## OpenAIResponsesConfig

```python
class OpenAIResponsesConfig(TypedDict)
```

Defined in: [src/strands/models/openai\_responses.py:126](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/openai_responses.py#L126)

Configuration options for OpenAI Responses API models.

**Attributes**:

-   `model_id` - Model ID (e.g., “gpt-4o”). For a complete list of supported models, see [https://platform.openai.com/docs/models](https://platform.openai.com/docs/models).
-   `params` - Model parameters (e.g., max\_output\_tokens, temperature, etc.). For a complete list of supported parameters, see [https://platform.openai.com/docs/api-reference/responses/create](https://platform.openai.com/docs/api-reference/responses/create).

#### \_\_init\_\_

```python
def __init__(client_args: dict[str, Any] | None = None,
             **model_config: Unpack[OpenAIResponsesConfig]) -> None
```

Defined in: [src/strands/models/openai\_responses.py:140](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/openai_responses.py#L140)

Initialize provider instance.

**Arguments**:

-   `client_args` - Arguments for the OpenAI client. For a complete list of supported arguments, see [https://pypi.org/project/openai/](https://pypi.org/project/openai/).
-   `**model_config` - Configuration options for the OpenAI Responses API model.

#### update\_config

```python
@override
def update_config(**model_config: Unpack[OpenAIResponsesConfig]) -> None
```

Defined in: [src/strands/models/openai\_responses.py:157](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/openai_responses.py#L157)

Update the OpenAI Responses API model configuration with the provided arguments.

**Arguments**:

-   `**model_config` - Configuration overrides.

#### get\_config

```python
@override
def get_config() -> OpenAIResponsesConfig
```

Defined in: [src/strands/models/openai\_responses.py:167](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/openai_responses.py#L167)

Get the OpenAI Responses API model configuration.

**Returns**:

The OpenAI Responses API model configuration.

#### stream

```python
@override
async def stream(messages: Messages,
                 tool_specs: list[ToolSpec] | None = None,
                 system_prompt: str | None = None,
                 *,
                 tool_choice: ToolChoice | None = None,
                 **kwargs: Any) -> AsyncGenerator[StreamEvent, None]
```

Defined in: [src/strands/models/openai\_responses.py:176](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/openai_responses.py#L176)

Stream conversation with the OpenAI Responses API model.

**Arguments**:

-   `messages` - List of message objects to be processed by the model.
-   `tool_specs` - List of tool specifications to make available to the model.
-   `system_prompt` - System prompt to provide context to the model.
-   `tool_choice` - Selection strategy for tool invocation.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Yields**:

Formatted message chunks from the model.

**Raises**:

-   `ContextWindowOverflowException` - If the input exceeds the model’s context window.
-   `ModelThrottledException` - If the request is throttled by OpenAI (rate limits).

#### structured\_output

```python
@override
async def structured_output(
        output_model: type[T],
        prompt: Messages,
        system_prompt: str | None = None,
        **kwargs: Any) -> AsyncGenerator[dict[str, T | Any], None]
```

Defined in: [src/strands/models/openai\_responses.py:341](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/openai_responses.py#L341)

Get structured output from the OpenAI Responses API model.

**Arguments**:

-   `output_model` - The output model to use for the agent.
-   `prompt` - The prompt messages to use for the agent.
-   `system_prompt` - System prompt to provide context to the model.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Yields**:

Model events with the last being the structured output.

**Raises**:

-   `ContextWindowOverflowException` - If the input exceeds the model’s context window.
-   `ModelThrottledException` - If the request is throttled by OpenAI (rate limits).