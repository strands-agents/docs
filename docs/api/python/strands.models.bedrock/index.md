AWS Bedrock model provider.

-   Docs: [https://aws.amazon.com/bedrock/](https://aws.amazon.com/bedrock/)

## BedrockModel

```python
class BedrockModel(Model)
```

Defined in: [src/strands/models/bedrock.py:62](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/bedrock.py#L62)

AWS Bedrock model provider implementation.

The implementation handles Bedrock-specific features such as:

-   Tool configuration for function calling
-   Guardrails integration
-   Caching points for system prompts and tools
-   Streaming responses
-   Context window overflow detection

## BedrockConfig

```python
class BedrockConfig(BaseModelConfig)
```

Defined in: [src/strands/models/bedrock.py:74](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/bedrock.py#L74)

Configuration options for Bedrock models.

**Attributes**:

-   `additional_args` - Any additional arguments to include in the request
-   `additional_request_fields` - Additional fields to include in the Bedrock request
-   `additional_response_field_paths` - Additional response field paths to extract
-   `cache_prompt` - Cache point type for the system prompt (deprecated, use cache\_config)
-   `cache_config` - Configuration for prompt caching. Use CacheConfig(strategy=“auto”) for automatic caching.
-   `cache_tools` - Cache point type for tools
-   `guardrail_id` - ID of the guardrail to apply
-   `guardrail_trace` - Guardrail trace mode. Defaults to enabled.
-   `guardrail_version` - Version of the guardrail to apply
-   `guardrail_stream_processing_mode` - The guardrail processing mode
-   `guardrail_redact_input` - Flag to redact input if a guardrail is triggered. Defaults to True.
-   `guardrail_redact_input_message` - If a Bedrock Input guardrail triggers, replace the input with this message.
-   `guardrail_redact_output` - Flag to redact output if guardrail is triggered. Defaults to False.
-   `guardrail_redact_output_message` - If a Bedrock Output guardrail triggers, replace output with this message.
-   `guardrail_latest_message` - Flag to send only the lastest user message to guardrails. Defaults to False.
-   `max_tokens` - Maximum number of tokens to generate in the response
-   `model_id` - The Bedrock model ID (e.g., “global.anthropic.claude-sonnet-4-6”)
-   `include_tool_result_status` - Flag to include status field in tool results. True includes status, False removes status, “auto” determines based on model\_id. Defaults to “auto”.
-   `service_tier` - Service tier for the request, controlling the trade-off between latency and cost. Valid values: “default” (standard), “priority” (faster, premium), “flex” (cheaper, slower). Please check [https://docs.aws.amazon.com/bedrock/latest/userguide/service-tiers-inference.html](https://docs.aws.amazon.com/bedrock/latest/userguide/service-tiers-inference.html) for supported service tiers, models, and regions
-   `stop_sequences` - List of sequences that will stop generation when encountered
-   `streaming` - Flag to enable/disable streaming. Defaults to True.
-   `strict_tools` - Flag to enable structured output enforcement on tool definitions. When True, adds strict: true to each tool spec and automatically injects
-   `"additionalProperties"` - false into all object types in tool input schemas. See [https://docs.aws.amazon.com/bedrock/latest/userguide/structured-output.html](https://docs.aws.amazon.com/bedrock/latest/userguide/structured-output.html)
-   `temperature` - Controls randomness in generation (higher = more random)
-   `top_p` - Controls diversity via nucleus sampling (alternative to temperature)

#### \_\_init\_\_

```python
def __init__(*,
             boto_session: boto3.Session | None = None,
             boto_client_config: BotocoreConfig | None = None,
             region_name: str | None = None,
             endpoint_url: str | None = None,
             **model_config: Unpack[BedrockConfig])
```

Defined in: [src/strands/models/bedrock.py:137](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/bedrock.py#L137)

Initialize provider instance.

**Arguments**:

-   `boto_session` - Boto Session to use when calling the Bedrock Model.
-   `boto_client_config` - Configuration to use when creating the Bedrock-Runtime Boto Client.
-   `region_name` - AWS region to use for the Bedrock service. Defaults to the AWS\_REGION environment variable if set, or “us-west-2” if not set.
-   `endpoint_url` - Custom endpoint URL for VPC endpoints (PrivateLink)
-   `**model_config` - Configuration options for the Bedrock model.

#### update\_config

```python
@override
def update_config(**model_config: Unpack[BedrockConfig]) -> None
```

Defined in: [src/strands/models/bedrock.py:204](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/bedrock.py#L204)

Update the Bedrock Model configuration with the provided arguments.

**Arguments**:

-   `**model_config` - Configuration overrides.

#### get\_config

```python
@override
def get_config() -> BedrockConfig
```

Defined in: [src/strands/models/bedrock.py:214](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/bedrock.py#L214)

Get the current Bedrock Model configuration.

**Returns**:

The Bedrock model configuration.

#### count\_tokens

```python
@override
async def count_tokens(
        messages: Messages,
        tool_specs: list[ToolSpec] | None = None,
        system_prompt: str | None = None,
        system_prompt_content: list[SystemContentBlock] | None = None) -> int
```

Defined in: [src/strands/models/bedrock.py:766](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/bedrock.py#L766)

Count tokens using Bedrock’s native CountTokens API.

Uses the same message format as the Converse API to get accurate token counts directly from the Bedrock service.

**Arguments**:

-   `messages` - List of message objects to count tokens for.
-   `tool_specs` - List of tool specifications to include in the count.
-   `system_prompt` - Plain string system prompt. Ignored if system\_prompt\_content is provided.
-   `system_prompt_content` - Structured system prompt content blocks.

**Returns**:

Total input token count.

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

Defined in: [src/strands/models/bedrock.py:821](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/bedrock.py#L821)

Stream conversation with the Bedrock model.

This method calls either the Bedrock converse\_stream API or the converse API based on the streaming parameter in the configuration.

**Arguments**:

-   `messages` - List of message objects to be processed by the model.
-   `tool_specs` - List of tool specifications to make available to the model.
-   `system_prompt` - System prompt to provide context to the model.
-   `tool_choice` - Selection strategy for tool invocation.
-   `system_prompt_content` - System prompt content blocks to provide context to the model.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Yields**:

Model events.

**Raises**:

-   `ContextWindowOverflowException` - If the input exceeds the model’s context window.
-   `ModelThrottledException` - If the model service is throttling requests.

#### structured\_output

```python
@override
async def structured_output(
        output_model: type[T],
        prompt: Messages,
        system_prompt: str | None = None,
        **kwargs: Any) -> AsyncGenerator[dict[str, T | Any], None]
```

Defined in: [src/strands/models/bedrock.py:1107](https://github.com/strands-agents/sdk-python/blob/main/src/strands/models/bedrock.py#L1107)

Get structured output from the model.

**Arguments**:

-   `output_model` - The output model to use for the agent.
-   `prompt` - The prompt messages to use for the agent.
-   `system_prompt` - System prompt to provide context to the model.
-   `**kwargs` - Additional keyword arguments for future extensibility.

**Yields**:

Model events with the last being the structured output.