Amazon SageMaker model provider.

## UsageMetadata

```python
@dataclass
class UsageMetadata()
```

Defined in: [src/strands/models/sagemaker.py:28](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/sagemaker.py#L28)

Usage metadata for the model.

**Attributes**:

-   `total_tokens` - Total number of tokens used in the request
-   `completion_tokens` - Number of tokens used in the completion
-   `prompt_tokens` - Number of tokens used in the prompt
-   `prompt_tokens_details` - Additional information about the prompt tokens (optional)

## FunctionCall

```python
@dataclass
class FunctionCall()
```

Defined in: [src/strands/models/sagemaker.py:45](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/sagemaker.py#L45)

Function call for the model.

**Attributes**:

-   `name` - Name of the function to call
-   `arguments` - Arguments to pass to the function

#### \_\_init\_\_

```python
def __init__(**kwargs: dict[str, str])
```

Defined in: [src/strands/models/sagemaker.py:56](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/sagemaker.py#L56)

Initialize function call.

**Arguments**:

-   `**kwargs` - Keyword arguments for the function call.

## ToolCall

```python
@dataclass
class ToolCall()
```

Defined in: [src/strands/models/sagemaker.py:67](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/sagemaker.py#L67)

Tool call for the model object.

**Attributes**:

-   `id` - Tool call ID
-   `type` - Tool call type
-   `function` - Tool call function

#### \_\_init\_\_

```python
def __init__(**kwargs: dict)
```

Defined in: [src/strands/models/sagemaker.py:80](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/sagemaker.py#L80)

Initialize tool call object.

**Arguments**:

-   `**kwargs` - Keyword arguments for the tool call.

## SageMakerAIModel

```python
class SageMakerAIModel(OpenAIModel)
```

Defined in: [src/strands/models/sagemaker.py:91](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/sagemaker.py#L91)

Amazon SageMaker model provider implementation.

#### client

type: ignore\[assignment\]

## SageMakerAIPayloadSchema

```python
class SageMakerAIPayloadSchema(TypedDict)
```

Defined in: [src/strands/models/sagemaker.py:96](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/sagemaker.py#L96)

Payload schema for the Amazon SageMaker AI model.

**Attributes**:

-   `max_tokens` - Maximum number of tokens to generate in the completion
-   `stream` - Whether to stream the response
-   `temperature` - Sampling temperature to use for the model (optional)
-   `top_p` - Nucleus sampling parameter (optional)
-   `top_k` - Top-k sampling parameter (optional)
-   `stop` - List of stop sequences to use for the model (optional)
-   `tool_results_as_user_messages` - Convert tool result to user messages (optional)
-   `additional_args` - Additional request parameters, as supported by [https://bit.ly/djl-lmi-request-schema](https://bit.ly/djl-lmi-request-schema)

## SageMakerAIEndpointConfig

```python
class SageMakerAIEndpointConfig(TypedDict)
```

Defined in: [src/strands/models/sagemaker.py:119](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/sagemaker.py#L119)

Configuration options for SageMaker models.

**Attributes**:

-   `endpoint_name` - The name of the SageMaker endpoint to invoke
    
-   `inference_component_name` - The name of the inference component to use
    
-   `additional_args` - Other request parameters, as supported by [https://bit.ly/sagemaker-invoke-endpoint-params](https://bit.ly/sagemaker-invoke-endpoint-params)
    

#### \_\_init\_\_

```python
def __init__(endpoint_config: SageMakerAIEndpointConfig,
             payload_config: SageMakerAIPayloadSchema,
             boto_session: boto3.Session | None = None,
             boto_client_config: BotocoreConfig | None = None)
```

Defined in: [src/strands/models/sagemaker.py:136](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/sagemaker.py#L136)

Initialize provider instance.

**Arguments**:

-   `endpoint_config` - Endpoint configuration for SageMaker.
-   `payload_config` - Payload configuration for the model.
-   `boto_session` - Boto Session to use when calling the SageMaker Runtime.
-   `boto_client_config` - Configuration to use when creating the SageMaker-Runtime Boto Client.

#### update\_config

```python
@override
def update_config(**endpoint_config: Unpack[SageMakerAIEndpointConfig]
                  ) -> None
```

Defined in: [src/strands/models/sagemaker.py:181](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/sagemaker.py#L181)

Update the Amazon SageMaker model configuration with the provided arguments.

**Arguments**:

-   `**endpoint_config` - Configuration overrides.

#### get\_config

```python
@override
def get_config() -> "SageMakerAIModel.SageMakerAIEndpointConfig"
```

Defined in: [src/strands/models/sagemaker.py:191](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/sagemaker.py#L191)

Get the Amazon SageMaker model configuration.

**Returns**:

The Amazon SageMaker model configuration.

#### format\_request

```python
@override
def format_request(messages: Messages,
                   tool_specs: list[ToolSpec] | None = None,
                   system_prompt: str | None = None,
                   tool_choice: ToolChoice | None = None,
                   **kwargs: Any) -> dict[str, Any]
```

Defined in: [src/strands/models/sagemaker.py:200](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/sagemaker.py#L200)

Format an Amazon SageMaker chat streaming request.

**Arguments**:

-   `messages` - List of message objects to be processed by the model.
-   `tool_specs` - List of tool specifications to make available to the model.
-   `system_prompt` - System prompt to provide context to the model.
-   `tool_choice` - Selection strategy for tool invocation. **Note: This parameter is accepted for interface consistency but is currently ignored for this model provider.**
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Returns**:

An Amazon SageMaker chat streaming request.

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

Defined in: [src/strands/models/sagemaker.py:301](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/sagemaker.py#L301)

Stream conversation with the SageMaker model.

**Arguments**:

-   `messages` - List of message objects to be processed by the model.
-   `tool_specs` - List of tool specifications to make available to the model.
-   `system_prompt` - System prompt to provide context to the model.
-   `tool_choice` - Selection strategy for tool invocation. **Note: This parameter is accepted for interface consistency but is currently ignored for this model provider.**
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Yields**:

Formatted message chunks from the model.

#### format\_request\_tool\_message

```python
@override
@classmethod
def format_request_tool_message(cls, tool_result: ToolResult,
                                **kwargs: Any) -> dict[str, Any]
```

Defined in: [src/strands/models/sagemaker.py:507](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/sagemaker.py#L507)

Format a SageMaker compatible tool message.

**Arguments**:

-   `tool_result` - Tool result collected from a tool execution.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Returns**:

SageMaker compatible tool message with content as a string.

#### format\_request\_message\_content

```python
@override
@classmethod
def format_request_message_content(cls, content: ContentBlock,
                                   **kwargs: Any) -> dict[str, Any]
```

Defined in: [src/strands/models/sagemaker.py:538](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/sagemaker.py#L538)

Format a content block.

**Arguments**:

-   `content` - Message content.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Returns**:

Formatted content block.

**Raises**:

-   `TypeError` - If the content block type cannot be converted to a SageMaker-compatible format.

#### structured\_output

```python
@override
async def structured_output(
        output_model: type[T],
        prompt: Messages,
        system_prompt: str | None = None,
        **kwargs: Any) -> AsyncGenerator[dict[str, T | Any], None]
```

Defined in: [src/strands/models/sagemaker.py:575](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/sagemaker.py#L575)

Get structured output from the model.

**Arguments**:

-   `output_model` - The output model to use for the agent.
-   `prompt` - The prompt messages to use for the agent.
-   `system_prompt` - System prompt to provide context to the model.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Yields**:

Model events with the last being the structured output.