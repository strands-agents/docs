# `strands.models`

SDK model providers.

This package includes an abstract base Model class along with concrete implementations for specific providers.

## `strands.models.bedrock`

AWS Bedrock model provider.

- Docs: https://aws.amazon.com/bedrock/

### `BedrockModel`

Bases: `Model`

AWS Bedrock model provider implementation.

The implementation handles Bedrock-specific features such as:

- Tool configuration for function calling
- Guardrails integration
- Caching points for system prompts and tools
- Streaming responses
- Context window overflow detection

Source code in `strands/models/bedrock.py`

```
class BedrockModel(Model):
    """AWS Bedrock model provider implementation.

    The implementation handles Bedrock-specific features such as:

    - Tool configuration for function calling
    - Guardrails integration
    - Caching points for system prompts and tools
    - Streaming responses
    - Context window overflow detection
    """

    class BedrockConfig(TypedDict, total=False):
        """Configuration options for Bedrock models.

        Attributes:
            additional_args: Any additional arguments to include in the request
            additional_request_fields: Additional fields to include in the Bedrock request
            additional_response_field_paths: Additional response field paths to extract
            cache_prompt: Cache point type for the system prompt
            cache_tools: Cache point type for tools
            guardrail_id: ID of the guardrail to apply
            guardrail_trace: Guardrail trace mode. Defaults to enabled.
            guardrail_version: Version of the guardrail to apply
            guardrail_stream_processing_mode: The guardrail processing mode
            guardrail_redact_input: Flag to redact input if a guardrail is triggered. Defaults to True.
            guardrail_redact_input_message: If a Bedrock Input guardrail triggers, replace the input with this message.
            guardrail_redact_output: Flag to redact output if guardrail is triggered. Defaults to False.
            guardrail_redact_output_message: If a Bedrock Output guardrail triggers, replace output with this message.
            max_tokens: Maximum number of tokens to generate in the response
            model_id: The Bedrock model ID (e.g., "us.anthropic.claude-3-7-sonnet-20250219-v1:0")
            stop_sequences: List of sequences that will stop generation when encountered
            streaming: Flag to enable/disable streaming. Defaults to True.
            temperature: Controls randomness in generation (higher = more random)
            top_p: Controls diversity via nucleus sampling (alternative to temperature)
        """

        additional_args: Optional[dict[str, Any]]
        additional_request_fields: Optional[dict[str, Any]]
        additional_response_field_paths: Optional[list[str]]
        cache_prompt: Optional[str]
        cache_tools: Optional[str]
        guardrail_id: Optional[str]
        guardrail_trace: Optional[Literal["enabled", "disabled", "enabled_full"]]
        guardrail_stream_processing_mode: Optional[Literal["sync", "async"]]
        guardrail_version: Optional[str]
        guardrail_redact_input: Optional[bool]
        guardrail_redact_input_message: Optional[str]
        guardrail_redact_output: Optional[bool]
        guardrail_redact_output_message: Optional[str]
        max_tokens: Optional[int]
        model_id: str
        stop_sequences: Optional[list[str]]
        streaming: Optional[bool]
        temperature: Optional[float]
        top_p: Optional[float]

    def __init__(
        self,
        *,
        boto_session: Optional[boto3.Session] = None,
        boto_client_config: Optional[BotocoreConfig] = None,
        region_name: Optional[str] = None,
        **model_config: Unpack[BedrockConfig],
    ):
        """Initialize provider instance.

        Args:
            boto_session: Boto Session to use when calling the Bedrock Model.
            boto_client_config: Configuration to use when creating the Bedrock-Runtime Boto Client.
            region_name: AWS region to use for the Bedrock service.
                Defaults to the AWS_REGION environment variable if set, or "us-west-2" if not set.
            **model_config: Configuration options for the Bedrock model.
        """
        if region_name and boto_session:
            raise ValueError("Cannot specify both `region_name` and `boto_session`.")

        self.config = BedrockModel.BedrockConfig(model_id=DEFAULT_BEDROCK_MODEL_ID)
        self.update_config(**model_config)

        logger.debug("config=<%s> | initializing", self.config)

        session = boto_session or boto3.Session(
            region_name=region_name or os.getenv("AWS_REGION") or "us-west-2",
        )

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

        self.client = session.client(
            service_name="bedrock-runtime",
            config=client_config,
        )

    @override
    def update_config(self, **model_config: Unpack[BedrockConfig]) -> None:  # type: ignore
        """Update the Bedrock Model configuration with the provided arguments.

        Args:
            **model_config: Configuration overrides.
        """
        self.config.update(model_config)

    @override
    def get_config(self) -> BedrockConfig:
        """Get the current Bedrock Model configuration.

        Returns:
            The Bedrock model configuration.
        """
        return self.config

    @override
    def format_request(
        self,
        messages: Messages,
        tool_specs: Optional[list[ToolSpec]] = None,
        system_prompt: Optional[str] = None,
    ) -> dict[str, Any]:
        """Format a Bedrock converse stream request.

        Args:
            messages: List of message objects to be processed by the model.
            tool_specs: List of tool specifications to make available to the model.
            system_prompt: System prompt to provide context to the model.

        Returns:
            A Bedrock converse stream request.
        """
        return {
            "modelId": self.config["model_id"],
            "messages": messages,
            "system": [
                *([{"text": system_prompt}] if system_prompt else []),
                *([{"cachePoint": {"type": self.config["cache_prompt"]}}] if self.config.get("cache_prompt") else []),
            ],
            **(
                {
                    "toolConfig": {
                        "tools": [
                            *[{"toolSpec": tool_spec} for tool_spec in tool_specs],
                            *(
                                [{"cachePoint": {"type": self.config["cache_tools"]}}]
                                if self.config.get("cache_tools")
                                else []
                            ),
                        ],
                        "toolChoice": {"auto": {}},
                    }
                }
                if tool_specs
                else {}
            ),
            **(
                {"additionalModelRequestFields": self.config["additional_request_fields"]}
                if self.config.get("additional_request_fields")
                else {}
            ),
            **(
                {"additionalModelResponseFieldPaths": self.config["additional_response_field_paths"]}
                if self.config.get("additional_response_field_paths")
                else {}
            ),
            **(
                {
                    "guardrailConfig": {
                        "guardrailIdentifier": self.config["guardrail_id"],
                        "guardrailVersion": self.config["guardrail_version"],
                        "trace": self.config.get("guardrail_trace", "enabled"),
                        **(
                            {"streamProcessingMode": self.config.get("guardrail_stream_processing_mode")}
                            if self.config.get("guardrail_stream_processing_mode")
                            else {}
                        ),
                    }
                }
                if self.config.get("guardrail_id") and self.config.get("guardrail_version")
                else {}
            ),
            "inferenceConfig": {
                key: value
                for key, value in [
                    ("maxTokens", self.config.get("max_tokens")),
                    ("temperature", self.config.get("temperature")),
                    ("topP", self.config.get("top_p")),
                    ("stopSequences", self.config.get("stop_sequences")),
                ]
                if value is not None
            },
            **(
                self.config["additional_args"]
                if "additional_args" in self.config and self.config["additional_args"] is not None
                else {}
            ),
        }

    @override
    def format_chunk(self, event: dict[str, Any]) -> StreamEvent:
        """Format the Bedrock response events into standardized message chunks.

        Args:
            event: A response event from the Bedrock model.

        Returns:
            The formatted chunk.
        """
        return cast(StreamEvent, event)

    def _has_blocked_guardrail(self, guardrail_data: dict[str, Any]) -> bool:
        """Check if guardrail data contains any blocked policies.

        Args:
            guardrail_data: Guardrail data from trace information.

        Returns:
            True if any blocked guardrail is detected, False otherwise.
        """
        input_assessment = guardrail_data.get("inputAssessment", {})
        output_assessments = guardrail_data.get("outputAssessments", {})

        # Check input assessments
        if any(self._find_detected_and_blocked_policy(assessment) for assessment in input_assessment.values()):
            return True

        # Check output assessments
        if any(self._find_detected_and_blocked_policy(assessment) for assessment in output_assessments.values()):
            return True

        return False

    def _generate_redaction_events(self) -> list[StreamEvent]:
        """Generate redaction events based on configuration.

        Returns:
            List of redaction events to yield.
        """
        events: List[StreamEvent] = []

        if self.config.get("guardrail_redact_input", True):
            logger.debug("Redacting user input due to guardrail.")
            events.append(
                {
                    "redactContent": {
                        "redactUserContentMessage": self.config.get(
                            "guardrail_redact_input_message", "[User input redacted.]"
                        )
                    }
                }
            )

        if self.config.get("guardrail_redact_output", False):
            logger.debug("Redacting assistant output due to guardrail.")
            events.append(
                {
                    "redactContent": {
                        "redactAssistantContentMessage": self.config.get(
                            "guardrail_redact_output_message", "[Assistant output redacted.]"
                        )
                    }
                }
            )

        return events

    @override
    def stream(self, request: dict[str, Any]) -> Iterable[StreamEvent]:
        """Send the request to the Bedrock model and get the response.

        This method calls either the Bedrock converse_stream API or the converse API
        based on the streaming parameter in the configuration.

        Args:
            request: The formatted request to send to the Bedrock model

        Returns:
            An iterable of response events from the Bedrock model

        Raises:
            ContextWindowOverflowException: If the input exceeds the model's context window.
            ModelThrottledException: If the model service is throttling requests.
        """
        streaming = self.config.get("streaming", True)

        try:
            if streaming:
                # Streaming implementation
                response = self.client.converse_stream(**request)
                for chunk in response["stream"]:
                    if (
                        "metadata" in chunk
                        and "trace" in chunk["metadata"]
                        and "guardrail" in chunk["metadata"]["trace"]
                    ):
                        guardrail_data = chunk["metadata"]["trace"]["guardrail"]
                        if self._has_blocked_guardrail(guardrail_data):
                            yield from self._generate_redaction_events()
                    yield chunk
            else:
                # Non-streaming implementation
                response = self.client.converse(**request)

                # Convert and yield from the response
                yield from self._convert_non_streaming_to_streaming(response)

                # Check for guardrail triggers after yielding any events (same as streaming path)
                if (
                    "trace" in response
                    and "guardrail" in response["trace"]
                    and self._has_blocked_guardrail(response["trace"]["guardrail"])
                ):
                    yield from self._generate_redaction_events()

        except ClientError as e:
            error_message = str(e)

            # Handle throttling error
            if e.response["Error"]["Code"] == "ThrottlingException":
                raise ModelThrottledException(error_message) from e

            # Handle context window overflow
            if any(overflow_message in error_message for overflow_message in BEDROCK_CONTEXT_WINDOW_OVERFLOW_MESSAGES):
                logger.warning("bedrock threw context window overflow error")
                raise ContextWindowOverflowException(e) from e

            # Otherwise raise the error
            raise e

    def _convert_non_streaming_to_streaming(self, response: dict[str, Any]) -> Iterable[StreamEvent]:
        """Convert a non-streaming response to the streaming format.

        Args:
            response: The non-streaming response from the Bedrock model.

        Returns:
            An iterable of response events in the streaming format.
        """
        # Yield messageStart event
        yield {"messageStart": {"role": response["output"]["message"]["role"]}}

        # Process content blocks
        for content in response["output"]["message"]["content"]:
            # Yield contentBlockStart event if needed
            if "toolUse" in content:
                yield {
                    "contentBlockStart": {
                        "start": {
                            "toolUse": {
                                "toolUseId": content["toolUse"]["toolUseId"],
                                "name": content["toolUse"]["name"],
                            }
                        },
                    }
                }

                # For tool use, we need to yield the input as a delta
                input_value = json.dumps(content["toolUse"]["input"])

                yield {"contentBlockDelta": {"delta": {"toolUse": {"input": input_value}}}}
            elif "text" in content:
                # Then yield the text as a delta
                yield {
                    "contentBlockDelta": {
                        "delta": {"text": content["text"]},
                    }
                }
            elif "reasoningContent" in content:
                # Then yield the reasoning content as a delta
                yield {
                    "contentBlockDelta": {
                        "delta": {"reasoningContent": {"text": content["reasoningContent"]["reasoningText"]["text"]}}
                    }
                }

                if "signature" in content["reasoningContent"]["reasoningText"]:
                    yield {
                        "contentBlockDelta": {
                            "delta": {
                                "reasoningContent": {
                                    "signature": content["reasoningContent"]["reasoningText"]["signature"]
                                }
                            }
                        }
                    }

            # Yield contentBlockStop event
            yield {"contentBlockStop": {}}

        # Yield messageStop event
        yield {
            "messageStop": {
                "stopReason": response["stopReason"],
                "additionalModelResponseFields": response.get("additionalModelResponseFields"),
            }
        }

        # Yield metadata event
        if "usage" in response or "metrics" in response or "trace" in response:
            metadata: StreamEvent = {"metadata": {}}
            if "usage" in response:
                metadata["metadata"]["usage"] = response["usage"]
            if "metrics" in response:
                metadata["metadata"]["metrics"] = response["metrics"]
            if "trace" in response:
                metadata["metadata"]["trace"] = response["trace"]
            yield metadata

    def _find_detected_and_blocked_policy(self, input: Any) -> bool:
        """Recursively checks if the assessment contains a detected and blocked guardrail.

        Args:
            input: The assessment to check.

        Returns:
            True if the input contains a detected and blocked guardrail, False otherwise.

        """
        # Check if input is a dictionary
        if isinstance(input, dict):
            # Check if current dictionary has action: BLOCKED and detected: true
            if input.get("action") == "BLOCKED" and input.get("detected") and isinstance(input.get("detected"), bool):
                return True

            # Recursively check all values in the dictionary
            for value in input.values():
                if isinstance(value, dict):
                    return self._find_detected_and_blocked_policy(value)
                # Handle case where value is a list of dictionaries
                elif isinstance(value, list):
                    for item in value:
                        return self._find_detected_and_blocked_policy(item)
        elif isinstance(input, list):
            # Handle case where input is a list of dictionaries
            for item in input:
                return self._find_detected_and_blocked_policy(item)
        # Otherwise return False
        return False

```

#### `BedrockConfig`

Bases: `TypedDict`

Configuration options for Bedrock models.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `additional_args` | `Optional[dict[str, Any]]` | Any additional arguments to include in the request | | `additional_request_fields` | `Optional[dict[str, Any]]` | Additional fields to include in the Bedrock request | | `additional_response_field_paths` | `Optional[list[str]]` | Additional response field paths to extract | | `cache_prompt` | `Optional[str]` | Cache point type for the system prompt | | `cache_tools` | `Optional[str]` | Cache point type for tools | | `guardrail_id` | `Optional[str]` | ID of the guardrail to apply | | `guardrail_trace` | `Optional[Literal['enabled', 'disabled', 'enabled_full']]` | Guardrail trace mode. Defaults to enabled. | | `guardrail_version` | `Optional[str]` | Version of the guardrail to apply | | `guardrail_stream_processing_mode` | `Optional[Literal['sync', 'async']]` | The guardrail processing mode | | `guardrail_redact_input` | `Optional[bool]` | Flag to redact input if a guardrail is triggered. Defaults to True. | | `guardrail_redact_input_message` | `Optional[str]` | If a Bedrock Input guardrail triggers, replace the input with this message. | | `guardrail_redact_output` | `Optional[bool]` | Flag to redact output if guardrail is triggered. Defaults to False. | | `guardrail_redact_output_message` | `Optional[str]` | If a Bedrock Output guardrail triggers, replace output with this message. | | `max_tokens` | `Optional[int]` | Maximum number of tokens to generate in the response | | `model_id` | `str` | The Bedrock model ID (e.g., "us.anthropic.claude-3-7-sonnet-20250219-v1:0") | | `stop_sequences` | `Optional[list[str]]` | List of sequences that will stop generation when encountered | | `streaming` | `Optional[bool]` | Flag to enable/disable streaming. Defaults to True. | | `temperature` | `Optional[float]` | Controls randomness in generation (higher = more random) | | `top_p` | `Optional[float]` | Controls diversity via nucleus sampling (alternative to temperature) |

Source code in `strands/models/bedrock.py`

```
class BedrockConfig(TypedDict, total=False):
    """Configuration options for Bedrock models.

    Attributes:
        additional_args: Any additional arguments to include in the request
        additional_request_fields: Additional fields to include in the Bedrock request
        additional_response_field_paths: Additional response field paths to extract
        cache_prompt: Cache point type for the system prompt
        cache_tools: Cache point type for tools
        guardrail_id: ID of the guardrail to apply
        guardrail_trace: Guardrail trace mode. Defaults to enabled.
        guardrail_version: Version of the guardrail to apply
        guardrail_stream_processing_mode: The guardrail processing mode
        guardrail_redact_input: Flag to redact input if a guardrail is triggered. Defaults to True.
        guardrail_redact_input_message: If a Bedrock Input guardrail triggers, replace the input with this message.
        guardrail_redact_output: Flag to redact output if guardrail is triggered. Defaults to False.
        guardrail_redact_output_message: If a Bedrock Output guardrail triggers, replace output with this message.
        max_tokens: Maximum number of tokens to generate in the response
        model_id: The Bedrock model ID (e.g., "us.anthropic.claude-3-7-sonnet-20250219-v1:0")
        stop_sequences: List of sequences that will stop generation when encountered
        streaming: Flag to enable/disable streaming. Defaults to True.
        temperature: Controls randomness in generation (higher = more random)
        top_p: Controls diversity via nucleus sampling (alternative to temperature)
    """

    additional_args: Optional[dict[str, Any]]
    additional_request_fields: Optional[dict[str, Any]]
    additional_response_field_paths: Optional[list[str]]
    cache_prompt: Optional[str]
    cache_tools: Optional[str]
    guardrail_id: Optional[str]
    guardrail_trace: Optional[Literal["enabled", "disabled", "enabled_full"]]
    guardrail_stream_processing_mode: Optional[Literal["sync", "async"]]
    guardrail_version: Optional[str]
    guardrail_redact_input: Optional[bool]
    guardrail_redact_input_message: Optional[str]
    guardrail_redact_output: Optional[bool]
    guardrail_redact_output_message: Optional[str]
    max_tokens: Optional[int]
    model_id: str
    stop_sequences: Optional[list[str]]
    streaming: Optional[bool]
    temperature: Optional[float]
    top_p: Optional[float]

```

#### `__init__(*, boto_session=None, boto_client_config=None, region_name=None, **model_config)`

Initialize provider instance.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `boto_session` | `Optional[Session]` | Boto Session to use when calling the Bedrock Model. | `None` | | `boto_client_config` | `Optional[Config]` | Configuration to use when creating the Bedrock-Runtime Boto Client. | `None` | | `region_name` | `Optional[str]` | AWS region to use for the Bedrock service. Defaults to the AWS_REGION environment variable if set, or "us-west-2" if not set. | `None` | | `**model_config` | `Unpack[BedrockConfig]` | Configuration options for the Bedrock model. | `{}` |

Source code in `strands/models/bedrock.py`

```
def __init__(
    self,
    *,
    boto_session: Optional[boto3.Session] = None,
    boto_client_config: Optional[BotocoreConfig] = None,
    region_name: Optional[str] = None,
    **model_config: Unpack[BedrockConfig],
):
    """Initialize provider instance.

    Args:
        boto_session: Boto Session to use when calling the Bedrock Model.
        boto_client_config: Configuration to use when creating the Bedrock-Runtime Boto Client.
        region_name: AWS region to use for the Bedrock service.
            Defaults to the AWS_REGION environment variable if set, or "us-west-2" if not set.
        **model_config: Configuration options for the Bedrock model.
    """
    if region_name and boto_session:
        raise ValueError("Cannot specify both `region_name` and `boto_session`.")

    self.config = BedrockModel.BedrockConfig(model_id=DEFAULT_BEDROCK_MODEL_ID)
    self.update_config(**model_config)

    logger.debug("config=<%s> | initializing", self.config)

    session = boto_session or boto3.Session(
        region_name=region_name or os.getenv("AWS_REGION") or "us-west-2",
    )

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

    self.client = session.client(
        service_name="bedrock-runtime",
        config=client_config,
    )

```

#### `format_chunk(event)`

Format the Bedrock response events into standardized message chunks.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `dict[str, Any]` | A response event from the Bedrock model. | *required* |

Returns:

| Type | Description | | --- | --- | | `StreamEvent` | The formatted chunk. |

Source code in `strands/models/bedrock.py`

```
@override
def format_chunk(self, event: dict[str, Any]) -> StreamEvent:
    """Format the Bedrock response events into standardized message chunks.

    Args:
        event: A response event from the Bedrock model.

    Returns:
        The formatted chunk.
    """
    return cast(StreamEvent, event)

```

#### `format_request(messages, tool_specs=None, system_prompt=None)`

Format a Bedrock converse stream request.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `messages` | `Messages` | List of message objects to be processed by the model. | *required* | | `tool_specs` | `Optional[list[ToolSpec]]` | List of tool specifications to make available to the model. | `None` | | `system_prompt` | `Optional[str]` | System prompt to provide context to the model. | `None` |

Returns:

| Type | Description | | --- | --- | | `dict[str, Any]` | A Bedrock converse stream request. |

Source code in `strands/models/bedrock.py`

```
@override
def format_request(
    self,
    messages: Messages,
    tool_specs: Optional[list[ToolSpec]] = None,
    system_prompt: Optional[str] = None,
) -> dict[str, Any]:
    """Format a Bedrock converse stream request.

    Args:
        messages: List of message objects to be processed by the model.
        tool_specs: List of tool specifications to make available to the model.
        system_prompt: System prompt to provide context to the model.

    Returns:
        A Bedrock converse stream request.
    """
    return {
        "modelId": self.config["model_id"],
        "messages": messages,
        "system": [
            *([{"text": system_prompt}] if system_prompt else []),
            *([{"cachePoint": {"type": self.config["cache_prompt"]}}] if self.config.get("cache_prompt") else []),
        ],
        **(
            {
                "toolConfig": {
                    "tools": [
                        *[{"toolSpec": tool_spec} for tool_spec in tool_specs],
                        *(
                            [{"cachePoint": {"type": self.config["cache_tools"]}}]
                            if self.config.get("cache_tools")
                            else []
                        ),
                    ],
                    "toolChoice": {"auto": {}},
                }
            }
            if tool_specs
            else {}
        ),
        **(
            {"additionalModelRequestFields": self.config["additional_request_fields"]}
            if self.config.get("additional_request_fields")
            else {}
        ),
        **(
            {"additionalModelResponseFieldPaths": self.config["additional_response_field_paths"]}
            if self.config.get("additional_response_field_paths")
            else {}
        ),
        **(
            {
                "guardrailConfig": {
                    "guardrailIdentifier": self.config["guardrail_id"],
                    "guardrailVersion": self.config["guardrail_version"],
                    "trace": self.config.get("guardrail_trace", "enabled"),
                    **(
                        {"streamProcessingMode": self.config.get("guardrail_stream_processing_mode")}
                        if self.config.get("guardrail_stream_processing_mode")
                        else {}
                    ),
                }
            }
            if self.config.get("guardrail_id") and self.config.get("guardrail_version")
            else {}
        ),
        "inferenceConfig": {
            key: value
            for key, value in [
                ("maxTokens", self.config.get("max_tokens")),
                ("temperature", self.config.get("temperature")),
                ("topP", self.config.get("top_p")),
                ("stopSequences", self.config.get("stop_sequences")),
            ]
            if value is not None
        },
        **(
            self.config["additional_args"]
            if "additional_args" in self.config and self.config["additional_args"] is not None
            else {}
        ),
    }

```

#### `get_config()`

Get the current Bedrock Model configuration.

Returns:

| Type | Description | | --- | --- | | `BedrockConfig` | The Bedrock model configuration. |

Source code in `strands/models/bedrock.py`

```
@override
def get_config(self) -> BedrockConfig:
    """Get the current Bedrock Model configuration.

    Returns:
        The Bedrock model configuration.
    """
    return self.config

```

#### `stream(request)`

Send the request to the Bedrock model and get the response.

This method calls either the Bedrock converse_stream API or the converse API based on the streaming parameter in the configuration.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `request` | `dict[str, Any]` | The formatted request to send to the Bedrock model | *required* |

Returns:

| Type | Description | | --- | --- | | `Iterable[StreamEvent]` | An iterable of response events from the Bedrock model |

Raises:

| Type | Description | | --- | --- | | `ContextWindowOverflowException` | If the input exceeds the model's context window. | | `ModelThrottledException` | If the model service is throttling requests. |

Source code in `strands/models/bedrock.py`

```
@override
def stream(self, request: dict[str, Any]) -> Iterable[StreamEvent]:
    """Send the request to the Bedrock model and get the response.

    This method calls either the Bedrock converse_stream API or the converse API
    based on the streaming parameter in the configuration.

    Args:
        request: The formatted request to send to the Bedrock model

    Returns:
        An iterable of response events from the Bedrock model

    Raises:
        ContextWindowOverflowException: If the input exceeds the model's context window.
        ModelThrottledException: If the model service is throttling requests.
    """
    streaming = self.config.get("streaming", True)

    try:
        if streaming:
            # Streaming implementation
            response = self.client.converse_stream(**request)
            for chunk in response["stream"]:
                if (
                    "metadata" in chunk
                    and "trace" in chunk["metadata"]
                    and "guardrail" in chunk["metadata"]["trace"]
                ):
                    guardrail_data = chunk["metadata"]["trace"]["guardrail"]
                    if self._has_blocked_guardrail(guardrail_data):
                        yield from self._generate_redaction_events()
                yield chunk
        else:
            # Non-streaming implementation
            response = self.client.converse(**request)

            # Convert and yield from the response
            yield from self._convert_non_streaming_to_streaming(response)

            # Check for guardrail triggers after yielding any events (same as streaming path)
            if (
                "trace" in response
                and "guardrail" in response["trace"]
                and self._has_blocked_guardrail(response["trace"]["guardrail"])
            ):
                yield from self._generate_redaction_events()

    except ClientError as e:
        error_message = str(e)

        # Handle throttling error
        if e.response["Error"]["Code"] == "ThrottlingException":
            raise ModelThrottledException(error_message) from e

        # Handle context window overflow
        if any(overflow_message in error_message for overflow_message in BEDROCK_CONTEXT_WINDOW_OVERFLOW_MESSAGES):
            logger.warning("bedrock threw context window overflow error")
            raise ContextWindowOverflowException(e) from e

        # Otherwise raise the error
        raise e

```

#### `update_config(**model_config)`

Update the Bedrock Model configuration with the provided arguments.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `**model_config` | `Unpack[BedrockConfig]` | Configuration overrides. | `{}` |

Source code in `strands/models/bedrock.py`

```
@override
def update_config(self, **model_config: Unpack[BedrockConfig]) -> None:  # type: ignore
    """Update the Bedrock Model configuration with the provided arguments.

    Args:
        **model_config: Configuration overrides.
    """
    self.config.update(model_config)

```

## `strands.models.anthropic`

Anthropic Claude model provider.

- Docs: https://docs.anthropic.com/claude/reference/getting-started-with-the-api

### `AnthropicModel`

Bases: `Model`

Anthropic model provider implementation.

Source code in `strands/models/anthropic.py`

```
class AnthropicModel(Model):
    """Anthropic model provider implementation."""

    EVENT_TYPES = {
        "message_start",
        "content_block_start",
        "content_block_delta",
        "content_block_stop",
        "message_stop",
    }

    OVERFLOW_MESSAGES = {
        "input is too long",
        "input length exceeds context window",
        "input and output tokens exceed your context limit",
    }

    class AnthropicConfig(TypedDict, total=False):
        """Configuration options for Anthropic models.

        Attributes:
            max_tokens: Maximum number of tokens to generate.
            model_id: Calude model ID (e.g., "claude-3-7-sonnet-latest").
                For a complete list of supported models, see
                https://docs.anthropic.com/en/docs/about-claude/models/all-models.
            params: Additional model parameters (e.g., temperature).
                For a complete list of supported parameters, see https://docs.anthropic.com/en/api/messages.
        """

        max_tokens: Required[str]
        model_id: Required[str]
        params: Optional[dict[str, Any]]

    def __init__(self, *, client_args: Optional[dict[str, Any]] = None, **model_config: Unpack[AnthropicConfig]):
        """Initialize provider instance.

        Args:
            client_args: Arguments for the underlying Anthropic client (e.g., api_key).
                For a complete list of supported arguments, see https://docs.anthropic.com/en/api/client-sdks.
            **model_config: Configuration options for the Anthropic model.
        """
        self.config = AnthropicModel.AnthropicConfig(**model_config)

        logger.debug("config=<%s> | initializing", self.config)

        client_args = client_args or {}
        self.client = anthropic.Anthropic(**client_args)

    @override
    def update_config(self, **model_config: Unpack[AnthropicConfig]) -> None:  # type: ignore[override]
        """Update the Anthropic model configuration with the provided arguments.

        Args:
            **model_config: Configuration overrides.
        """
        self.config.update(model_config)

    @override
    def get_config(self) -> AnthropicConfig:
        """Get the Anthropic model configuration.

        Returns:
            The Anthropic model configuration.
        """
        return self.config

    def _format_request_message_content(self, content: ContentBlock) -> dict[str, Any]:
        """Format an Anthropic content block.

        Args:
            content: Message content.

        Returns:
            Anthropic formatted content block.

        Raises:
            TypeError: If the content block type cannot be converted to an Anthropic-compatible format.
        """
        if "document" in content:
            mime_type = mimetypes.types_map.get(f".{content['document']['format']}", "application/octet-stream")
            return {
                "source": {
                    "data": (
                        content["document"]["source"]["bytes"].decode("utf-8")
                        if mime_type == "text/plain"
                        else base64.b64encode(content["document"]["source"]["bytes"]).decode("utf-8")
                    ),
                    "media_type": mime_type,
                    "type": "text" if mime_type == "text/plain" else "base64",
                },
                "title": content["document"]["name"],
                "type": "document",
            }

        if "image" in content:
            return {
                "source": {
                    "data": base64.b64encode(content["image"]["source"]["bytes"]).decode("utf-8"),
                    "media_type": mimetypes.types_map.get(f".{content['image']['format']}", "application/octet-stream"),
                    "type": "base64",
                },
                "type": "image",
            }

        if "reasoningContent" in content:
            return {
                "signature": content["reasoningContent"]["reasoningText"]["signature"],
                "thinking": content["reasoningContent"]["reasoningText"]["text"],
                "type": "thinking",
            }

        if "text" in content:
            return {"text": content["text"], "type": "text"}

        if "toolUse" in content:
            return {
                "id": content["toolUse"]["toolUseId"],
                "input": content["toolUse"]["input"],
                "name": content["toolUse"]["name"],
                "type": "tool_use",
            }

        if "toolResult" in content:
            return {
                "content": [
                    self._format_request_message_content(
                        {"text": json.dumps(tool_result_content["json"])}
                        if "json" in tool_result_content
                        else cast(ContentBlock, tool_result_content)
                    )
                    for tool_result_content in content["toolResult"]["content"]
                ],
                "is_error": content["toolResult"]["status"] == "error",
                "tool_use_id": content["toolResult"]["toolUseId"],
                "type": "tool_result",
            }

        raise TypeError(f"content_type=<{next(iter(content))}> | unsupported type")

    def _format_request_messages(self, messages: Messages) -> list[dict[str, Any]]:
        """Format an Anthropic messages array.

        Args:
            messages: List of message objects to be processed by the model.

        Returns:
            An Anthropic messages array.
        """
        formatted_messages = []

        for message in messages:
            formatted_contents: list[dict[str, Any]] = []

            for content in message["content"]:
                if "cachePoint" in content:
                    formatted_contents[-1]["cache_control"] = {"type": "ephemeral"}
                    continue

                formatted_contents.append(self._format_request_message_content(content))

            if formatted_contents:
                formatted_messages.append({"content": formatted_contents, "role": message["role"]})

        return formatted_messages

    @override
    def format_request(
        self, messages: Messages, tool_specs: Optional[list[ToolSpec]] = None, system_prompt: Optional[str] = None
    ) -> dict[str, Any]:
        """Format an Anthropic streaming request.

        Args:
            messages: List of message objects to be processed by the model.
            tool_specs: List of tool specifications to make available to the model.
            system_prompt: System prompt to provide context to the model.

        Returns:
            An Anthropic streaming request.

        Raises:
            TypeError: If a message contains a content block type that cannot be converted to an Anthropic-compatible
                format.
        """
        return {
            "max_tokens": self.config["max_tokens"],
            "messages": self._format_request_messages(messages),
            "model": self.config["model_id"],
            "tools": [
                {
                    "name": tool_spec["name"],
                    "description": tool_spec["description"],
                    "input_schema": tool_spec["inputSchema"]["json"],
                }
                for tool_spec in tool_specs or []
            ],
            **({"system": system_prompt} if system_prompt else {}),
            **(self.config.get("params") or {}),
        }

    @override
    def format_chunk(self, event: dict[str, Any]) -> StreamEvent:
        """Format the Anthropic response events into standardized message chunks.

        Args:
            event: A response event from the Anthropic model.

        Returns:
            The formatted chunk.

        Raises:
            RuntimeError: If chunk_type is not recognized.
                This error should never be encountered as we control chunk_type in the stream method.
        """
        match event["type"]:
            case "message_start":
                return {"messageStart": {"role": "assistant"}}

            case "content_block_start":
                content = event["content_block"]

                if content["type"] == "tool_use":
                    return {
                        "contentBlockStart": {
                            "contentBlockIndex": event["index"],
                            "start": {
                                "toolUse": {
                                    "name": content["name"],
                                    "toolUseId": content["id"],
                                }
                            },
                        }
                    }

                return {"contentBlockStart": {"contentBlockIndex": event["index"], "start": {}}}

            case "content_block_delta":
                delta = event["delta"]

                match delta["type"]:
                    case "signature_delta":
                        return {
                            "contentBlockDelta": {
                                "contentBlockIndex": event["index"],
                                "delta": {
                                    "reasoningContent": {
                                        "signature": delta["signature"],
                                    },
                                },
                            },
                        }

                    case "thinking_delta":
                        return {
                            "contentBlockDelta": {
                                "contentBlockIndex": event["index"],
                                "delta": {
                                    "reasoningContent": {
                                        "text": delta["thinking"],
                                    },
                                },
                            },
                        }

                    case "input_json_delta":
                        return {
                            "contentBlockDelta": {
                                "contentBlockIndex": event["index"],
                                "delta": {
                                    "toolUse": {
                                        "input": delta["partial_json"],
                                    },
                                },
                            },
                        }

                    case "text_delta":
                        return {
                            "contentBlockDelta": {
                                "contentBlockIndex": event["index"],
                                "delta": {
                                    "text": delta["text"],
                                },
                            },
                        }

                    case _:
                        raise RuntimeError(
                            f"event_type=<content_block_delta>, delta_type=<{delta['type']}> | unknown type"
                        )

            case "content_block_stop":
                return {"contentBlockStop": {"contentBlockIndex": event["index"]}}

            case "message_stop":
                message = event["message"]

                return {"messageStop": {"stopReason": message["stop_reason"]}}

            case "metadata":
                usage = event["usage"]

                return {
                    "metadata": {
                        "usage": {
                            "inputTokens": usage["input_tokens"],
                            "outputTokens": usage["output_tokens"],
                            "totalTokens": usage["input_tokens"] + usage["output_tokens"],
                        },
                        "metrics": {
                            "latencyMs": 0,  # TODO
                        },
                    }
                }

            case _:
                raise RuntimeError(f"event_type=<{event['type']} | unknown type")

    @override
    def stream(self, request: dict[str, Any]) -> Iterable[dict[str, Any]]:
        """Send the request to the Anthropic model and get the streaming response.

        Args:
            request: The formatted request to send to the Anthropic model.

        Returns:
            An iterable of response events from the Anthropic model.

        Raises:
            ContextWindowOverflowException: If the input exceeds the model's context window.
            ModelThrottledException: If the request is throttled by Anthropic.
        """
        try:
            with self.client.messages.stream(**request) as stream:
                for event in stream:
                    if event.type in AnthropicModel.EVENT_TYPES:
                        yield event.dict()

                usage = event.message.usage  # type: ignore
                yield {"type": "metadata", "usage": usage.dict()}

        except anthropic.RateLimitError as error:
            raise ModelThrottledException(str(error)) from error

        except anthropic.BadRequestError as error:
            if any(overflow_message in str(error).lower() for overflow_message in AnthropicModel.OVERFLOW_MESSAGES):
                raise ContextWindowOverflowException(str(error)) from error

            raise error

```

#### `AnthropicConfig`

Bases: `TypedDict`

Configuration options for Anthropic models.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `max_tokens` | `Required[str]` | Maximum number of tokens to generate. | | `model_id` | `Required[str]` | Calude model ID (e.g., "claude-3-7-sonnet-latest"). For a complete list of supported models, see https://docs.anthropic.com/en/docs/about-claude/models/all-models. | | `params` | `Optional[dict[str, Any]]` | Additional model parameters (e.g., temperature). For a complete list of supported parameters, see https://docs.anthropic.com/en/api/messages. |

Source code in `strands/models/anthropic.py`

```
class AnthropicConfig(TypedDict, total=False):
    """Configuration options for Anthropic models.

    Attributes:
        max_tokens: Maximum number of tokens to generate.
        model_id: Calude model ID (e.g., "claude-3-7-sonnet-latest").
            For a complete list of supported models, see
            https://docs.anthropic.com/en/docs/about-claude/models/all-models.
        params: Additional model parameters (e.g., temperature).
            For a complete list of supported parameters, see https://docs.anthropic.com/en/api/messages.
    """

    max_tokens: Required[str]
    model_id: Required[str]
    params: Optional[dict[str, Any]]

```

#### `__init__(*, client_args=None, **model_config)`

Initialize provider instance.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `client_args` | `Optional[dict[str, Any]]` | Arguments for the underlying Anthropic client (e.g., api_key). For a complete list of supported arguments, see https://docs.anthropic.com/en/api/client-sdks. | `None` | | `**model_config` | `Unpack[AnthropicConfig]` | Configuration options for the Anthropic model. | `{}` |

Source code in `strands/models/anthropic.py`

```
def __init__(self, *, client_args: Optional[dict[str, Any]] = None, **model_config: Unpack[AnthropicConfig]):
    """Initialize provider instance.

    Args:
        client_args: Arguments for the underlying Anthropic client (e.g., api_key).
            For a complete list of supported arguments, see https://docs.anthropic.com/en/api/client-sdks.
        **model_config: Configuration options for the Anthropic model.
    """
    self.config = AnthropicModel.AnthropicConfig(**model_config)

    logger.debug("config=<%s> | initializing", self.config)

    client_args = client_args or {}
    self.client = anthropic.Anthropic(**client_args)

```

#### `format_chunk(event)`

Format the Anthropic response events into standardized message chunks.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `dict[str, Any]` | A response event from the Anthropic model. | *required* |

Returns:

| Type | Description | | --- | --- | | `StreamEvent` | The formatted chunk. |

Raises:

| Type | Description | | --- | --- | | `RuntimeError` | If chunk_type is not recognized. This error should never be encountered as we control chunk_type in the stream method. |

Source code in `strands/models/anthropic.py`

```
@override
def format_chunk(self, event: dict[str, Any]) -> StreamEvent:
    """Format the Anthropic response events into standardized message chunks.

    Args:
        event: A response event from the Anthropic model.

    Returns:
        The formatted chunk.

    Raises:
        RuntimeError: If chunk_type is not recognized.
            This error should never be encountered as we control chunk_type in the stream method.
    """
    match event["type"]:
        case "message_start":
            return {"messageStart": {"role": "assistant"}}

        case "content_block_start":
            content = event["content_block"]

            if content["type"] == "tool_use":
                return {
                    "contentBlockStart": {
                        "contentBlockIndex": event["index"],
                        "start": {
                            "toolUse": {
                                "name": content["name"],
                                "toolUseId": content["id"],
                            }
                        },
                    }
                }

            return {"contentBlockStart": {"contentBlockIndex": event["index"], "start": {}}}

        case "content_block_delta":
            delta = event["delta"]

            match delta["type"]:
                case "signature_delta":
                    return {
                        "contentBlockDelta": {
                            "contentBlockIndex": event["index"],
                            "delta": {
                                "reasoningContent": {
                                    "signature": delta["signature"],
                                },
                            },
                        },
                    }

                case "thinking_delta":
                    return {
                        "contentBlockDelta": {
                            "contentBlockIndex": event["index"],
                            "delta": {
                                "reasoningContent": {
                                    "text": delta["thinking"],
                                },
                            },
                        },
                    }

                case "input_json_delta":
                    return {
                        "contentBlockDelta": {
                            "contentBlockIndex": event["index"],
                            "delta": {
                                "toolUse": {
                                    "input": delta["partial_json"],
                                },
                            },
                        },
                    }

                case "text_delta":
                    return {
                        "contentBlockDelta": {
                            "contentBlockIndex": event["index"],
                            "delta": {
                                "text": delta["text"],
                            },
                        },
                    }

                case _:
                    raise RuntimeError(
                        f"event_type=<content_block_delta>, delta_type=<{delta['type']}> | unknown type"
                    )

        case "content_block_stop":
            return {"contentBlockStop": {"contentBlockIndex": event["index"]}}

        case "message_stop":
            message = event["message"]

            return {"messageStop": {"stopReason": message["stop_reason"]}}

        case "metadata":
            usage = event["usage"]

            return {
                "metadata": {
                    "usage": {
                        "inputTokens": usage["input_tokens"],
                        "outputTokens": usage["output_tokens"],
                        "totalTokens": usage["input_tokens"] + usage["output_tokens"],
                    },
                    "metrics": {
                        "latencyMs": 0,  # TODO
                    },
                }
            }

        case _:
            raise RuntimeError(f"event_type=<{event['type']} | unknown type")

```

#### `format_request(messages, tool_specs=None, system_prompt=None)`

Format an Anthropic streaming request.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `messages` | `Messages` | List of message objects to be processed by the model. | *required* | | `tool_specs` | `Optional[list[ToolSpec]]` | List of tool specifications to make available to the model. | `None` | | `system_prompt` | `Optional[str]` | System prompt to provide context to the model. | `None` |

Returns:

| Type | Description | | --- | --- | | `dict[str, Any]` | An Anthropic streaming request. |

Raises:

| Type | Description | | --- | --- | | `TypeError` | If a message contains a content block type that cannot be converted to an Anthropic-compatible format. |

Source code in `strands/models/anthropic.py`

```
@override
def format_request(
    self, messages: Messages, tool_specs: Optional[list[ToolSpec]] = None, system_prompt: Optional[str] = None
) -> dict[str, Any]:
    """Format an Anthropic streaming request.

    Args:
        messages: List of message objects to be processed by the model.
        tool_specs: List of tool specifications to make available to the model.
        system_prompt: System prompt to provide context to the model.

    Returns:
        An Anthropic streaming request.

    Raises:
        TypeError: If a message contains a content block type that cannot be converted to an Anthropic-compatible
            format.
    """
    return {
        "max_tokens": self.config["max_tokens"],
        "messages": self._format_request_messages(messages),
        "model": self.config["model_id"],
        "tools": [
            {
                "name": tool_spec["name"],
                "description": tool_spec["description"],
                "input_schema": tool_spec["inputSchema"]["json"],
            }
            for tool_spec in tool_specs or []
        ],
        **({"system": system_prompt} if system_prompt else {}),
        **(self.config.get("params") or {}),
    }

```

#### `get_config()`

Get the Anthropic model configuration.

Returns:

| Type | Description | | --- | --- | | `AnthropicConfig` | The Anthropic model configuration. |

Source code in `strands/models/anthropic.py`

```
@override
def get_config(self) -> AnthropicConfig:
    """Get the Anthropic model configuration.

    Returns:
        The Anthropic model configuration.
    """
    return self.config

```

#### `stream(request)`

Send the request to the Anthropic model and get the streaming response.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `request` | `dict[str, Any]` | The formatted request to send to the Anthropic model. | *required* |

Returns:

| Type | Description | | --- | --- | | `Iterable[dict[str, Any]]` | An iterable of response events from the Anthropic model. |

Raises:

| Type | Description | | --- | --- | | `ContextWindowOverflowException` | If the input exceeds the model's context window. | | `ModelThrottledException` | If the request is throttled by Anthropic. |

Source code in `strands/models/anthropic.py`

```
@override
def stream(self, request: dict[str, Any]) -> Iterable[dict[str, Any]]:
    """Send the request to the Anthropic model and get the streaming response.

    Args:
        request: The formatted request to send to the Anthropic model.

    Returns:
        An iterable of response events from the Anthropic model.

    Raises:
        ContextWindowOverflowException: If the input exceeds the model's context window.
        ModelThrottledException: If the request is throttled by Anthropic.
    """
    try:
        with self.client.messages.stream(**request) as stream:
            for event in stream:
                if event.type in AnthropicModel.EVENT_TYPES:
                    yield event.dict()

            usage = event.message.usage  # type: ignore
            yield {"type": "metadata", "usage": usage.dict()}

    except anthropic.RateLimitError as error:
        raise ModelThrottledException(str(error)) from error

    except anthropic.BadRequestError as error:
        if any(overflow_message in str(error).lower() for overflow_message in AnthropicModel.OVERFLOW_MESSAGES):
            raise ContextWindowOverflowException(str(error)) from error

        raise error

```

#### `update_config(**model_config)`

Update the Anthropic model configuration with the provided arguments.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `**model_config` | `Unpack[AnthropicConfig]` | Configuration overrides. | `{}` |

Source code in `strands/models/anthropic.py`

```
@override
def update_config(self, **model_config: Unpack[AnthropicConfig]) -> None:  # type: ignore[override]
    """Update the Anthropic model configuration with the provided arguments.

    Args:
        **model_config: Configuration overrides.
    """
    self.config.update(model_config)

```

## `strands.models.litellm`

LiteLLM model provider.

- Docs: https://docs.litellm.ai/

### `LiteLLMModel`

Bases: `OpenAIModel`

LiteLLM model provider implementation.

Source code in `strands/models/litellm.py`

```
class LiteLLMModel(OpenAIModel):
    """LiteLLM model provider implementation."""

    class LiteLLMConfig(TypedDict, total=False):
        """Configuration options for LiteLLM models.

        Attributes:
            model_id: Model ID (e.g., "openai/gpt-4o", "anthropic/claude-3-sonnet").
                For a complete list of supported models, see https://docs.litellm.ai/docs/providers.
            params: Model parameters (e.g., max_tokens).
                For a complete list of supported parameters, see
                https://docs.litellm.ai/docs/completion/input#input-params-1.
        """

        model_id: str
        params: Optional[dict[str, Any]]

    def __init__(self, client_args: Optional[dict[str, Any]] = None, **model_config: Unpack[LiteLLMConfig]) -> None:
        """Initialize provider instance.

        Args:
            client_args: Arguments for the LiteLLM client.
                For a complete list of supported arguments, see
                https://github.com/BerriAI/litellm/blob/main/litellm/main.py.
            **model_config: Configuration options for the LiteLLM model.
        """
        self.config = dict(model_config)

        logger.debug("config=<%s> | initializing", self.config)

        client_args = client_args or {}
        self.client = litellm.LiteLLM(**client_args)

    @override
    def update_config(self, **model_config: Unpack[LiteLLMConfig]) -> None:  # type: ignore[override]
        """Update the LiteLLM model configuration with the provided arguments.

        Args:
            **model_config: Configuration overrides.
        """
        self.config.update(model_config)

    @override
    def get_config(self) -> LiteLLMConfig:
        """Get the LiteLLM model configuration.

        Returns:
            The LiteLLM model configuration.
        """
        return cast(LiteLLMModel.LiteLLMConfig, self.config)

    @override
    @classmethod
    def format_request_message_content(cls, content: ContentBlock) -> dict[str, Any]:
        """Format a LiteLLM content block.

        Args:
            content: Message content.

        Returns:
            LiteLLM formatted content block.

        Raises:
            TypeError: If the content block type cannot be converted to a LiteLLM-compatible format.
        """
        if "reasoningContent" in content:
            return {
                "signature": content["reasoningContent"]["reasoningText"]["signature"],
                "thinking": content["reasoningContent"]["reasoningText"]["text"],
                "type": "thinking",
            }

        if "video" in content:
            return {
                "type": "video_url",
                "video_url": {
                    "detail": "auto",
                    "url": content["video"]["source"]["bytes"],
                },
            }

        return super().format_request_message_content(content)

```

#### `LiteLLMConfig`

Bases: `TypedDict`

Configuration options for LiteLLM models.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `model_id` | `str` | Model ID (e.g., "openai/gpt-4o", "anthropic/claude-3-sonnet"). For a complete list of supported models, see https://docs.litellm.ai/docs/providers. | | `params` | `Optional[dict[str, Any]]` | Model parameters (e.g., max_tokens). For a complete list of supported parameters, see https://docs.litellm.ai/docs/completion/input#input-params-1. |

Source code in `strands/models/litellm.py`

```
class LiteLLMConfig(TypedDict, total=False):
    """Configuration options for LiteLLM models.

    Attributes:
        model_id: Model ID (e.g., "openai/gpt-4o", "anthropic/claude-3-sonnet").
            For a complete list of supported models, see https://docs.litellm.ai/docs/providers.
        params: Model parameters (e.g., max_tokens).
            For a complete list of supported parameters, see
            https://docs.litellm.ai/docs/completion/input#input-params-1.
    """

    model_id: str
    params: Optional[dict[str, Any]]

```

#### `__init__(client_args=None, **model_config)`

Initialize provider instance.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `client_args` | `Optional[dict[str, Any]]` | Arguments for the LiteLLM client. For a complete list of supported arguments, see https://github.com/BerriAI/litellm/blob/main/litellm/main.py. | `None` | | `**model_config` | `Unpack[LiteLLMConfig]` | Configuration options for the LiteLLM model. | `{}` |

Source code in `strands/models/litellm.py`

```
def __init__(self, client_args: Optional[dict[str, Any]] = None, **model_config: Unpack[LiteLLMConfig]) -> None:
    """Initialize provider instance.

    Args:
        client_args: Arguments for the LiteLLM client.
            For a complete list of supported arguments, see
            https://github.com/BerriAI/litellm/blob/main/litellm/main.py.
        **model_config: Configuration options for the LiteLLM model.
    """
    self.config = dict(model_config)

    logger.debug("config=<%s> | initializing", self.config)

    client_args = client_args or {}
    self.client = litellm.LiteLLM(**client_args)

```

#### `format_request_message_content(content)`

Format a LiteLLM content block.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `content` | `ContentBlock` | Message content. | *required* |

Returns:

| Type | Description | | --- | --- | | `dict[str, Any]` | LiteLLM formatted content block. |

Raises:

| Type | Description | | --- | --- | | `TypeError` | If the content block type cannot be converted to a LiteLLM-compatible format. |

Source code in `strands/models/litellm.py`

```
@override
@classmethod
def format_request_message_content(cls, content: ContentBlock) -> dict[str, Any]:
    """Format a LiteLLM content block.

    Args:
        content: Message content.

    Returns:
        LiteLLM formatted content block.

    Raises:
        TypeError: If the content block type cannot be converted to a LiteLLM-compatible format.
    """
    if "reasoningContent" in content:
        return {
            "signature": content["reasoningContent"]["reasoningText"]["signature"],
            "thinking": content["reasoningContent"]["reasoningText"]["text"],
            "type": "thinking",
        }

    if "video" in content:
        return {
            "type": "video_url",
            "video_url": {
                "detail": "auto",
                "url": content["video"]["source"]["bytes"],
            },
        }

    return super().format_request_message_content(content)

```

#### `get_config()`

Get the LiteLLM model configuration.

Returns:

| Type | Description | | --- | --- | | `LiteLLMConfig` | The LiteLLM model configuration. |

Source code in `strands/models/litellm.py`

```
@override
def get_config(self) -> LiteLLMConfig:
    """Get the LiteLLM model configuration.

    Returns:
        The LiteLLM model configuration.
    """
    return cast(LiteLLMModel.LiteLLMConfig, self.config)

```

#### `update_config(**model_config)`

Update the LiteLLM model configuration with the provided arguments.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `**model_config` | `Unpack[LiteLLMConfig]` | Configuration overrides. | `{}` |

Source code in `strands/models/litellm.py`

```
@override
def update_config(self, **model_config: Unpack[LiteLLMConfig]) -> None:  # type: ignore[override]
    """Update the LiteLLM model configuration with the provided arguments.

    Args:
        **model_config: Configuration overrides.
    """
    self.config.update(model_config)

```

## `strands.models.llamaapi`

Llama API model provider.

- Docs: https://llama.developer.meta.com/

### `LlamaAPIModel`

Bases: `Model`

Llama API model provider implementation.

Source code in `strands/models/llamaapi.py`

```
class LlamaAPIModel(Model):
    """Llama API model provider implementation."""

    class LlamaConfig(TypedDict, total=False):
        """Configuration options for Llama API models.

        Attributes:
            model_id: Model ID (e.g., "Llama-4-Maverick-17B-128E-Instruct-FP8").
            repetition_penalty: Repetition penalty.
            temperature: Temperature.
            top_p: Top-p.
            max_completion_tokens: Maximum completion tokens.
            top_k: Top-k.
        """

        model_id: str
        repetition_penalty: Optional[float]
        temperature: Optional[float]
        top_p: Optional[float]
        max_completion_tokens: Optional[int]
        top_k: Optional[int]

    def __init__(
        self,
        *,
        client_args: Optional[dict[str, Any]] = None,
        **model_config: Unpack[LlamaConfig],
    ) -> None:
        """Initialize provider instance.

        Args:
            client_args: Arguments for the Llama API client.
            **model_config: Configuration options for the Llama API model.
        """
        self.config = LlamaAPIModel.LlamaConfig(**model_config)
        logger.debug("config=<%s> | initializing", self.config)

        if not client_args:
            self.client = LlamaAPIClient()
        else:
            self.client = LlamaAPIClient(**client_args)

    @override
    def update_config(self, **model_config: Unpack[LlamaConfig]) -> None:  # type: ignore
        """Update the Llama API Model configuration with the provided arguments.

        Args:
            **model_config: Configuration overrides.
        """
        self.config.update(model_config)

    @override
    def get_config(self) -> LlamaConfig:
        """Get the Llama API model configuration.

        Returns:
            The Llama API model configuration.
        """
        return self.config

    def _format_request_message_content(self, content: ContentBlock) -> dict[str, Any]:
        """Format a LlamaAPI content block.

        - NOTE: "reasoningContent" and "video" are not supported currently.

        Args:
            content: Message content.

        Returns:
            LllamaAPI formatted content block.

        Raises:
            TypeError: If the content block type cannot be converted to a LlamaAPI-compatible format.
        """
        if "image" in content:
            mime_type = mimetypes.types_map.get(f".{content['image']['format']}", "application/octet-stream")
            image_data = base64.b64encode(content["image"]["source"]["bytes"]).decode("utf-8")

            return {
                "image_url": {
                    "url": f"data:{mime_type};base64,{image_data}",
                },
                "type": "image_url",
            }

        if "text" in content:
            return {"text": content["text"], "type": "text"}

        raise TypeError(f"content_type=<{next(iter(content))}> | unsupported type")

    def _format_request_message_tool_call(self, tool_use: ToolUse) -> dict[str, Any]:
        """Format a Llama API tool call.

        Args:
            tool_use: Tool use requested by the model.

        Returns:
            Llama API formatted tool call.
        """
        return {
            "function": {
                "arguments": json.dumps(tool_use["input"]),
                "name": tool_use["name"],
            },
            "id": tool_use["toolUseId"],
        }

    def _format_request_tool_message(self, tool_result: ToolResult) -> dict[str, Any]:
        """Format a Llama API tool message.

        Args:
            tool_result: Tool result collected from a tool execution.

        Returns:
            Llama API formatted tool message.
        """
        contents = cast(
            list[ContentBlock],
            [
                {"text": json.dumps(content["json"])} if "json" in content else content
                for content in tool_result["content"]
            ],
        )

        return {
            "role": "tool",
            "tool_call_id": tool_result["toolUseId"],
            "content": [self._format_request_message_content(content) for content in contents],
        }

    def _format_request_messages(self, messages: Messages, system_prompt: Optional[str] = None) -> list[dict[str, Any]]:
        """Format a LlamaAPI compatible messages array.

        Args:
            messages: List of message objects to be processed by the model.
            system_prompt: System prompt to provide context to the model.

        Returns:
            An LlamaAPI compatible messages array.
        """
        formatted_messages: list[dict[str, Any]]
        formatted_messages = [{"role": "system", "content": system_prompt}] if system_prompt else []

        for message in messages:
            contents = message["content"]

            formatted_contents: list[dict[str, Any]] | dict[str, Any] | str = ""
            formatted_contents = [
                self._format_request_message_content(content)
                for content in contents
                if not any(block_type in content for block_type in ["toolResult", "toolUse"])
            ]
            formatted_tool_calls = [
                self._format_request_message_tool_call(content["toolUse"])
                for content in contents
                if "toolUse" in content
            ]
            formatted_tool_messages = [
                self._format_request_tool_message(content["toolResult"])
                for content in contents
                if "toolResult" in content
            ]

            if message["role"] == "assistant":
                formatted_contents = formatted_contents[0] if formatted_contents else ""

            formatted_message = {
                "role": message["role"],
                "content": formatted_contents if len(formatted_contents) > 0 else "",
                **({"tool_calls": formatted_tool_calls} if formatted_tool_calls else {}),
            }
            formatted_messages.append(formatted_message)
            formatted_messages.extend(formatted_tool_messages)

        return [message for message in formatted_messages if message["content"] or "tool_calls" in message]

    @override
    def format_request(
        self, messages: Messages, tool_specs: Optional[list[ToolSpec]] = None, system_prompt: Optional[str] = None
    ) -> dict[str, Any]:
        """Format a Llama API chat streaming request.

        Args:
            messages: List of message objects to be processed by the model.
            tool_specs: List of tool specifications to make available to the model.
            system_prompt: System prompt to provide context to the model.

        Returns:
            An Llama API chat streaming request.

        Raises:
            TypeError: If a message contains a content block type that cannot be converted to a LlamaAPI-compatible
                format.
        """
        request = {
            "messages": self._format_request_messages(messages, system_prompt),
            "model": self.config["model_id"],
            "stream": True,
            "tools": [
                {
                    "type": "function",
                    "function": {
                        "name": tool_spec["name"],
                        "description": tool_spec["description"],
                        "parameters": tool_spec["inputSchema"]["json"],
                    },
                }
                for tool_spec in tool_specs or []
            ],
        }
        if "temperature" in self.config:
            request["temperature"] = self.config["temperature"]
        if "top_p" in self.config:
            request["top_p"] = self.config["top_p"]
        if "repetition_penalty" in self.config:
            request["repetition_penalty"] = self.config["repetition_penalty"]
        if "max_completion_tokens" in self.config:
            request["max_completion_tokens"] = self.config["max_completion_tokens"]
        if "top_k" in self.config:
            request["top_k"] = self.config["top_k"]

        return request

    @override
    def format_chunk(self, event: dict[str, Any]) -> StreamEvent:
        """Format the Llama API model response events into standardized message chunks.

        Args:
            event: A response event from the model.

        Returns:
            The formatted chunk.
        """
        match event["chunk_type"]:
            case "message_start":
                return {"messageStart": {"role": "assistant"}}

            case "content_start":
                if event["data_type"] == "text":
                    return {"contentBlockStart": {"start": {}}}

                return {
                    "contentBlockStart": {
                        "start": {
                            "toolUse": {
                                "name": event["data"].function.name,
                                "toolUseId": event["data"].id,
                            }
                        }
                    }
                }

            case "content_delta":
                if event["data_type"] == "text":
                    return {"contentBlockDelta": {"delta": {"text": event["data"]}}}

                return {"contentBlockDelta": {"delta": {"toolUse": {"input": event["data"].function.arguments}}}}

            case "content_stop":
                return {"contentBlockStop": {}}

            case "message_stop":
                match event["data"]:
                    case "tool_calls":
                        return {"messageStop": {"stopReason": "tool_use"}}
                    case "length":
                        return {"messageStop": {"stopReason": "max_tokens"}}
                    case _:
                        return {"messageStop": {"stopReason": "end_turn"}}

            case "metadata":
                usage = {}
                for metrics in event["data"]:
                    if metrics.metric == "num_prompt_tokens":
                        usage["inputTokens"] = metrics.value
                    elif metrics.metric == "num_completion_tokens":
                        usage["outputTokens"] = metrics.value
                    elif metrics.metric == "num_total_tokens":
                        usage["totalTokens"] = metrics.value

                usage_type = Usage(
                    inputTokens=usage["inputTokens"],
                    outputTokens=usage["outputTokens"],
                    totalTokens=usage["totalTokens"],
                )
                return {
                    "metadata": {
                        "usage": usage_type,
                        "metrics": {
                            "latencyMs": 0,  # TODO
                        },
                    },
                }

            case _:
                raise RuntimeError(f"chunk_type=<{event['chunk_type']} | unknown type")

    @override
    def stream(self, request: dict[str, Any]) -> Iterable[dict[str, Any]]:
        """Send the request to the model and get a streaming response.

        Args:
            request: The formatted request to send to the model.

        Returns:
            The model's response.

        Raises:
            ModelThrottledException: When the model service is throttling requests from the client.
        """
        try:
            response = self.client.chat.completions.create(**request)
        except llama_api_client.RateLimitError as e:
            raise ModelThrottledException(str(e)) from e

        yield {"chunk_type": "message_start"}

        stop_reason = None
        tool_calls: dict[Any, list[Any]] = {}
        curr_tool_call_id = None

        metrics_event = None
        for chunk in response:
            if chunk.event.event_type == "start":
                yield {"chunk_type": "content_start", "data_type": "text"}
            elif chunk.event.event_type in ["progress", "complete"] and chunk.event.delta.type == "text":
                yield {"chunk_type": "content_delta", "data_type": "text", "data": chunk.event.delta.text}
            else:
                if chunk.event.delta.type == "tool_call":
                    if chunk.event.delta.id:
                        curr_tool_call_id = chunk.event.delta.id

                    if curr_tool_call_id not in tool_calls:
                        tool_calls[curr_tool_call_id] = []
                    tool_calls[curr_tool_call_id].append(chunk.event.delta)
                elif chunk.event.event_type == "metrics":
                    metrics_event = chunk.event.metrics
                else:
                    yield chunk

            if stop_reason is None:
                stop_reason = chunk.event.stop_reason

            # stopped generation
            if stop_reason:
                yield {"chunk_type": "content_stop", "data_type": "text"}

        for tool_deltas in tool_calls.values():
            tool_start, tool_deltas = tool_deltas[0], tool_deltas[1:]
            yield {"chunk_type": "content_start", "data_type": "tool", "data": tool_start}

            for tool_delta in tool_deltas:
                yield {"chunk_type": "content_delta", "data_type": "tool", "data": tool_delta}

            yield {"chunk_type": "content_stop", "data_type": "tool"}

        yield {"chunk_type": "message_stop", "data": stop_reason}

        # we may have a metrics event here
        if metrics_event:
            yield {"chunk_type": "metadata", "data": metrics_event}

```

#### `LlamaConfig`

Bases: `TypedDict`

Configuration options for Llama API models.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `model_id` | `str` | Model ID (e.g., "Llama-4-Maverick-17B-128E-Instruct-FP8"). | | `repetition_penalty` | `Optional[float]` | Repetition penalty. | | `temperature` | `Optional[float]` | Temperature. | | `top_p` | `Optional[float]` | Top-p. | | `max_completion_tokens` | `Optional[int]` | Maximum completion tokens. | | `top_k` | `Optional[int]` | Top-k. |

Source code in `strands/models/llamaapi.py`

```
class LlamaConfig(TypedDict, total=False):
    """Configuration options for Llama API models.

    Attributes:
        model_id: Model ID (e.g., "Llama-4-Maverick-17B-128E-Instruct-FP8").
        repetition_penalty: Repetition penalty.
        temperature: Temperature.
        top_p: Top-p.
        max_completion_tokens: Maximum completion tokens.
        top_k: Top-k.
    """

    model_id: str
    repetition_penalty: Optional[float]
    temperature: Optional[float]
    top_p: Optional[float]
    max_completion_tokens: Optional[int]
    top_k: Optional[int]

```

#### `__init__(*, client_args=None, **model_config)`

Initialize provider instance.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `client_args` | `Optional[dict[str, Any]]` | Arguments for the Llama API client. | `None` | | `**model_config` | `Unpack[LlamaConfig]` | Configuration options for the Llama API model. | `{}` |

Source code in `strands/models/llamaapi.py`

```
def __init__(
    self,
    *,
    client_args: Optional[dict[str, Any]] = None,
    **model_config: Unpack[LlamaConfig],
) -> None:
    """Initialize provider instance.

    Args:
        client_args: Arguments for the Llama API client.
        **model_config: Configuration options for the Llama API model.
    """
    self.config = LlamaAPIModel.LlamaConfig(**model_config)
    logger.debug("config=<%s> | initializing", self.config)

    if not client_args:
        self.client = LlamaAPIClient()
    else:
        self.client = LlamaAPIClient(**client_args)

```

#### `format_chunk(event)`

Format the Llama API model response events into standardized message chunks.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `dict[str, Any]` | A response event from the model. | *required* |

Returns:

| Type | Description | | --- | --- | | `StreamEvent` | The formatted chunk. |

Source code in `strands/models/llamaapi.py`

```
@override
def format_chunk(self, event: dict[str, Any]) -> StreamEvent:
    """Format the Llama API model response events into standardized message chunks.

    Args:
        event: A response event from the model.

    Returns:
        The formatted chunk.
    """
    match event["chunk_type"]:
        case "message_start":
            return {"messageStart": {"role": "assistant"}}

        case "content_start":
            if event["data_type"] == "text":
                return {"contentBlockStart": {"start": {}}}

            return {
                "contentBlockStart": {
                    "start": {
                        "toolUse": {
                            "name": event["data"].function.name,
                            "toolUseId": event["data"].id,
                        }
                    }
                }
            }

        case "content_delta":
            if event["data_type"] == "text":
                return {"contentBlockDelta": {"delta": {"text": event["data"]}}}

            return {"contentBlockDelta": {"delta": {"toolUse": {"input": event["data"].function.arguments}}}}

        case "content_stop":
            return {"contentBlockStop": {}}

        case "message_stop":
            match event["data"]:
                case "tool_calls":
                    return {"messageStop": {"stopReason": "tool_use"}}
                case "length":
                    return {"messageStop": {"stopReason": "max_tokens"}}
                case _:
                    return {"messageStop": {"stopReason": "end_turn"}}

        case "metadata":
            usage = {}
            for metrics in event["data"]:
                if metrics.metric == "num_prompt_tokens":
                    usage["inputTokens"] = metrics.value
                elif metrics.metric == "num_completion_tokens":
                    usage["outputTokens"] = metrics.value
                elif metrics.metric == "num_total_tokens":
                    usage["totalTokens"] = metrics.value

            usage_type = Usage(
                inputTokens=usage["inputTokens"],
                outputTokens=usage["outputTokens"],
                totalTokens=usage["totalTokens"],
            )
            return {
                "metadata": {
                    "usage": usage_type,
                    "metrics": {
                        "latencyMs": 0,  # TODO
                    },
                },
            }

        case _:
            raise RuntimeError(f"chunk_type=<{event['chunk_type']} | unknown type")

```

#### `format_request(messages, tool_specs=None, system_prompt=None)`

Format a Llama API chat streaming request.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `messages` | `Messages` | List of message objects to be processed by the model. | *required* | | `tool_specs` | `Optional[list[ToolSpec]]` | List of tool specifications to make available to the model. | `None` | | `system_prompt` | `Optional[str]` | System prompt to provide context to the model. | `None` |

Returns:

| Type | Description | | --- | --- | | `dict[str, Any]` | An Llama API chat streaming request. |

Raises:

| Type | Description | | --- | --- | | `TypeError` | If a message contains a content block type that cannot be converted to a LlamaAPI-compatible format. |

Source code in `strands/models/llamaapi.py`

```
@override
def format_request(
    self, messages: Messages, tool_specs: Optional[list[ToolSpec]] = None, system_prompt: Optional[str] = None
) -> dict[str, Any]:
    """Format a Llama API chat streaming request.

    Args:
        messages: List of message objects to be processed by the model.
        tool_specs: List of tool specifications to make available to the model.
        system_prompt: System prompt to provide context to the model.

    Returns:
        An Llama API chat streaming request.

    Raises:
        TypeError: If a message contains a content block type that cannot be converted to a LlamaAPI-compatible
            format.
    """
    request = {
        "messages": self._format_request_messages(messages, system_prompt),
        "model": self.config["model_id"],
        "stream": True,
        "tools": [
            {
                "type": "function",
                "function": {
                    "name": tool_spec["name"],
                    "description": tool_spec["description"],
                    "parameters": tool_spec["inputSchema"]["json"],
                },
            }
            for tool_spec in tool_specs or []
        ],
    }
    if "temperature" in self.config:
        request["temperature"] = self.config["temperature"]
    if "top_p" in self.config:
        request["top_p"] = self.config["top_p"]
    if "repetition_penalty" in self.config:
        request["repetition_penalty"] = self.config["repetition_penalty"]
    if "max_completion_tokens" in self.config:
        request["max_completion_tokens"] = self.config["max_completion_tokens"]
    if "top_k" in self.config:
        request["top_k"] = self.config["top_k"]

    return request

```

#### `get_config()`

Get the Llama API model configuration.

Returns:

| Type | Description | | --- | --- | | `LlamaConfig` | The Llama API model configuration. |

Source code in `strands/models/llamaapi.py`

```
@override
def get_config(self) -> LlamaConfig:
    """Get the Llama API model configuration.

    Returns:
        The Llama API model configuration.
    """
    return self.config

```

#### `stream(request)`

Send the request to the model and get a streaming response.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `request` | `dict[str, Any]` | The formatted request to send to the model. | *required* |

Returns:

| Type | Description | | --- | --- | | `Iterable[dict[str, Any]]` | The model's response. |

Raises:

| Type | Description | | --- | --- | | `ModelThrottledException` | When the model service is throttling requests from the client. |

Source code in `strands/models/llamaapi.py`

```
@override
def stream(self, request: dict[str, Any]) -> Iterable[dict[str, Any]]:
    """Send the request to the model and get a streaming response.

    Args:
        request: The formatted request to send to the model.

    Returns:
        The model's response.

    Raises:
        ModelThrottledException: When the model service is throttling requests from the client.
    """
    try:
        response = self.client.chat.completions.create(**request)
    except llama_api_client.RateLimitError as e:
        raise ModelThrottledException(str(e)) from e

    yield {"chunk_type": "message_start"}

    stop_reason = None
    tool_calls: dict[Any, list[Any]] = {}
    curr_tool_call_id = None

    metrics_event = None
    for chunk in response:
        if chunk.event.event_type == "start":
            yield {"chunk_type": "content_start", "data_type": "text"}
        elif chunk.event.event_type in ["progress", "complete"] and chunk.event.delta.type == "text":
            yield {"chunk_type": "content_delta", "data_type": "text", "data": chunk.event.delta.text}
        else:
            if chunk.event.delta.type == "tool_call":
                if chunk.event.delta.id:
                    curr_tool_call_id = chunk.event.delta.id

                if curr_tool_call_id not in tool_calls:
                    tool_calls[curr_tool_call_id] = []
                tool_calls[curr_tool_call_id].append(chunk.event.delta)
            elif chunk.event.event_type == "metrics":
                metrics_event = chunk.event.metrics
            else:
                yield chunk

        if stop_reason is None:
            stop_reason = chunk.event.stop_reason

        # stopped generation
        if stop_reason:
            yield {"chunk_type": "content_stop", "data_type": "text"}

    for tool_deltas in tool_calls.values():
        tool_start, tool_deltas = tool_deltas[0], tool_deltas[1:]
        yield {"chunk_type": "content_start", "data_type": "tool", "data": tool_start}

        for tool_delta in tool_deltas:
            yield {"chunk_type": "content_delta", "data_type": "tool", "data": tool_delta}

        yield {"chunk_type": "content_stop", "data_type": "tool"}

    yield {"chunk_type": "message_stop", "data": stop_reason}

    # we may have a metrics event here
    if metrics_event:
        yield {"chunk_type": "metadata", "data": metrics_event}

```

#### `update_config(**model_config)`

Update the Llama API Model configuration with the provided arguments.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `**model_config` | `Unpack[LlamaConfig]` | Configuration overrides. | `{}` |

Source code in `strands/models/llamaapi.py`

```
@override
def update_config(self, **model_config: Unpack[LlamaConfig]) -> None:  # type: ignore
    """Update the Llama API Model configuration with the provided arguments.

    Args:
        **model_config: Configuration overrides.
    """
    self.config.update(model_config)

```

## `strands.models.ollama`

Ollama model provider.

- Docs: https://ollama.com/

### `OllamaModel`

Bases: `Model`

Ollama model provider implementation.

The implementation handles Ollama-specific features such as:

- Local model invocation
- Streaming responses
- Tool/function calling

Source code in `strands/models/ollama.py`

```
class OllamaModel(Model):
    """Ollama model provider implementation.

    The implementation handles Ollama-specific features such as:

    - Local model invocation
    - Streaming responses
    - Tool/function calling
    """

    class OllamaConfig(TypedDict, total=False):
        """Configuration parameters for Ollama models.

        Attributes:
            additional_args: Any additional arguments to include in the request.
            keep_alive: Controls how long the model will stay loaded into memory following the request (default: "5m").
            max_tokens: Maximum number of tokens to generate in the response.
            model_id: Ollama model ID (e.g., "llama3", "mistral", "phi3").
            options: Additional model parameters (e.g., top_k).
            stop_sequences: List of sequences that will stop generation when encountered.
            temperature: Controls randomness in generation (higher = more random).
            top_p: Controls diversity via nucleus sampling (alternative to temperature).
        """

        additional_args: Optional[dict[str, Any]]
        keep_alive: Optional[str]
        max_tokens: Optional[int]
        model_id: str
        options: Optional[dict[str, Any]]
        stop_sequences: Optional[list[str]]
        temperature: Optional[float]
        top_p: Optional[float]

    def __init__(
        self,
        host: Optional[str],
        *,
        ollama_client_args: Optional[dict[str, Any]] = None,
        **model_config: Unpack[OllamaConfig],
    ) -> None:
        """Initialize provider instance.

        Args:
            host: The address of the Ollama server hosting the model.
            ollama_client_args: Additional arguments for the Ollama client.
            **model_config: Configuration options for the Ollama model.
        """
        self.config = OllamaModel.OllamaConfig(**model_config)

        logger.debug("config=<%s> | initializing", self.config)

        ollama_client_args = ollama_client_args if ollama_client_args is not None else {}

        self.client = OllamaClient(host, **ollama_client_args)

    @override
    def update_config(self, **model_config: Unpack[OllamaConfig]) -> None:  # type: ignore
        """Update the Ollama Model configuration with the provided arguments.

        Args:
            **model_config: Configuration overrides.
        """
        self.config.update(model_config)

    @override
    def get_config(self) -> OllamaConfig:
        """Get the Ollama model configuration.

        Returns:
            The Ollama model configuration.
        """
        return self.config

    def _format_request_message_contents(self, role: str, content: ContentBlock) -> list[dict[str, Any]]:
        """Format Ollama compatible message contents.

        Ollama doesn't support an array of contents, so we must flatten everything into separate message blocks.

        Args:
            role: E.g., user.
            content: Content block to format.

        Returns:
            Ollama formatted message contents.

        Raises:
            TypeError: If the content block type cannot be converted to an Ollama-compatible format.
        """
        if "text" in content:
            return [{"role": role, "content": content["text"]}]

        if "image" in content:
            return [{"role": role, "images": [content["image"]["source"]["bytes"]]}]

        if "toolUse" in content:
            return [
                {
                    "role": role,
                    "tool_calls": [
                        {
                            "function": {
                                "name": content["toolUse"]["toolUseId"],
                                "arguments": content["toolUse"]["input"],
                            }
                        }
                    ],
                }
            ]

        if "toolResult" in content:
            return [
                formatted_tool_result_content
                for tool_result_content in content["toolResult"]["content"]
                for formatted_tool_result_content in self._format_request_message_contents(
                    "tool",
                    (
                        {"text": json.dumps(tool_result_content["json"])}
                        if "json" in tool_result_content
                        else cast(ContentBlock, tool_result_content)
                    ),
                )
            ]

        raise TypeError(f"content_type=<{next(iter(content))}> | unsupported type")

    def _format_request_messages(self, messages: Messages, system_prompt: Optional[str] = None) -> list[dict[str, Any]]:
        """Format an Ollama compatible messages array.

        Args:
            messages: List of message objects to be processed by the model.
            system_prompt: System prompt to provide context to the model.

        Returns:
            An Ollama compatible messages array.
        """
        system_message = [{"role": "system", "content": system_prompt}] if system_prompt else []

        return system_message + [
            formatted_message
            for message in messages
            for content in message["content"]
            for formatted_message in self._format_request_message_contents(message["role"], content)
        ]

    @override
    def format_request(
        self, messages: Messages, tool_specs: Optional[list[ToolSpec]] = None, system_prompt: Optional[str] = None
    ) -> dict[str, Any]:
        """Format an Ollama chat streaming request.

        Args:
            messages: List of message objects to be processed by the model.
            tool_specs: List of tool specifications to make available to the model.
            system_prompt: System prompt to provide context to the model.

        Returns:
            An Ollama chat streaming request.

        Raises:
            TypeError: If a message contains a content block type that cannot be converted to an Ollama-compatible
                format.
        """
        return {
            "messages": self._format_request_messages(messages, system_prompt),
            "model": self.config["model_id"],
            "options": {
                **(self.config.get("options") or {}),
                **{
                    key: value
                    for key, value in [
                        ("num_predict", self.config.get("max_tokens")),
                        ("temperature", self.config.get("temperature")),
                        ("top_p", self.config.get("top_p")),
                        ("stop", self.config.get("stop_sequences")),
                    ]
                    if value is not None
                },
            },
            "stream": True,
            "tools": [
                {
                    "type": "function",
                    "function": {
                        "name": tool_spec["name"],
                        "description": tool_spec["description"],
                        "parameters": tool_spec["inputSchema"]["json"],
                    },
                }
                for tool_spec in tool_specs or []
            ],
            **({"keep_alive": self.config["keep_alive"]} if self.config.get("keep_alive") else {}),
            **(
                self.config["additional_args"]
                if "additional_args" in self.config and self.config["additional_args"] is not None
                else {}
            ),
        }

    @override
    def format_chunk(self, event: dict[str, Any]) -> StreamEvent:
        """Format the Ollama response events into standardized message chunks.

        Args:
            event: A response event from the Ollama model.

        Returns:
            The formatted chunk.

        Raises:
            RuntimeError: If chunk_type is not recognized.
                This error should never be encountered as we control chunk_type in the stream method.
        """
        match event["chunk_type"]:
            case "message_start":
                return {"messageStart": {"role": "assistant"}}

            case "content_start":
                if event["data_type"] == "text":
                    return {"contentBlockStart": {"start": {}}}

                tool_name = event["data"].function.name
                return {"contentBlockStart": {"start": {"toolUse": {"name": tool_name, "toolUseId": tool_name}}}}

            case "content_delta":
                if event["data_type"] == "text":
                    return {"contentBlockDelta": {"delta": {"text": event["data"]}}}

                tool_arguments = event["data"].function.arguments
                return {"contentBlockDelta": {"delta": {"toolUse": {"input": json.dumps(tool_arguments)}}}}

            case "content_stop":
                return {"contentBlockStop": {}}

            case "message_stop":
                reason: StopReason
                if event["data"] == "tool_use":
                    reason = "tool_use"
                elif event["data"] == "length":
                    reason = "max_tokens"
                else:
                    reason = "end_turn"

                return {"messageStop": {"stopReason": reason}}

            case "metadata":
                return {
                    "metadata": {
                        "usage": {
                            "inputTokens": event["data"].eval_count,
                            "outputTokens": event["data"].prompt_eval_count,
                            "totalTokens": event["data"].eval_count + event["data"].prompt_eval_count,
                        },
                        "metrics": {
                            "latencyMs": event["data"].total_duration / 1e6,
                        },
                    },
                }

            case _:
                raise RuntimeError(f"chunk_type=<{event['chunk_type']} | unknown type")

    @override
    def stream(self, request: dict[str, Any]) -> Iterable[dict[str, Any]]:
        """Send the request to the Ollama model and get the streaming response.

        This method calls the Ollama chat API and returns the stream of response events.

        Args:
            request: The formatted request to send to the Ollama model.

        Returns:
            An iterable of response events from the Ollama model.
        """
        tool_requested = False

        response = self.client.chat(**request)

        yield {"chunk_type": "message_start"}
        yield {"chunk_type": "content_start", "data_type": "text"}

        for event in response:
            for tool_call in event.message.tool_calls or []:
                yield {"chunk_type": "content_start", "data_type": "tool", "data": tool_call}
                yield {"chunk_type": "content_delta", "data_type": "tool", "data": tool_call}
                yield {"chunk_type": "content_stop", "data_type": "tool", "data": tool_call}
                tool_requested = True

            yield {"chunk_type": "content_delta", "data_type": "text", "data": event.message.content}

        yield {"chunk_type": "content_stop", "data_type": "text"}
        yield {"chunk_type": "message_stop", "data": "tool_use" if tool_requested else event.done_reason}
        yield {"chunk_type": "metadata", "data": event}

```

#### `OllamaConfig`

Bases: `TypedDict`

Configuration parameters for Ollama models.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `additional_args` | `Optional[dict[str, Any]]` | Any additional arguments to include in the request. | | `keep_alive` | `Optional[str]` | Controls how long the model will stay loaded into memory following the request (default: "5m"). | | `max_tokens` | `Optional[int]` | Maximum number of tokens to generate in the response. | | `model_id` | `str` | Ollama model ID (e.g., "llama3", "mistral", "phi3"). | | `options` | `Optional[dict[str, Any]]` | Additional model parameters (e.g., top_k). | | `stop_sequences` | `Optional[list[str]]` | List of sequences that will stop generation when encountered. | | `temperature` | `Optional[float]` | Controls randomness in generation (higher = more random). | | `top_p` | `Optional[float]` | Controls diversity via nucleus sampling (alternative to temperature). |

Source code in `strands/models/ollama.py`

```
class OllamaConfig(TypedDict, total=False):
    """Configuration parameters for Ollama models.

    Attributes:
        additional_args: Any additional arguments to include in the request.
        keep_alive: Controls how long the model will stay loaded into memory following the request (default: "5m").
        max_tokens: Maximum number of tokens to generate in the response.
        model_id: Ollama model ID (e.g., "llama3", "mistral", "phi3").
        options: Additional model parameters (e.g., top_k).
        stop_sequences: List of sequences that will stop generation when encountered.
        temperature: Controls randomness in generation (higher = more random).
        top_p: Controls diversity via nucleus sampling (alternative to temperature).
    """

    additional_args: Optional[dict[str, Any]]
    keep_alive: Optional[str]
    max_tokens: Optional[int]
    model_id: str
    options: Optional[dict[str, Any]]
    stop_sequences: Optional[list[str]]
    temperature: Optional[float]
    top_p: Optional[float]

```

#### `__init__(host, *, ollama_client_args=None, **model_config)`

Initialize provider instance.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `host` | `Optional[str]` | The address of the Ollama server hosting the model. | *required* | | `ollama_client_args` | `Optional[dict[str, Any]]` | Additional arguments for the Ollama client. | `None` | | `**model_config` | `Unpack[OllamaConfig]` | Configuration options for the Ollama model. | `{}` |

Source code in `strands/models/ollama.py`

```
def __init__(
    self,
    host: Optional[str],
    *,
    ollama_client_args: Optional[dict[str, Any]] = None,
    **model_config: Unpack[OllamaConfig],
) -> None:
    """Initialize provider instance.

    Args:
        host: The address of the Ollama server hosting the model.
        ollama_client_args: Additional arguments for the Ollama client.
        **model_config: Configuration options for the Ollama model.
    """
    self.config = OllamaModel.OllamaConfig(**model_config)

    logger.debug("config=<%s> | initializing", self.config)

    ollama_client_args = ollama_client_args if ollama_client_args is not None else {}

    self.client = OllamaClient(host, **ollama_client_args)

```

#### `format_chunk(event)`

Format the Ollama response events into standardized message chunks.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `dict[str, Any]` | A response event from the Ollama model. | *required* |

Returns:

| Type | Description | | --- | --- | | `StreamEvent` | The formatted chunk. |

Raises:

| Type | Description | | --- | --- | | `RuntimeError` | If chunk_type is not recognized. This error should never be encountered as we control chunk_type in the stream method. |

Source code in `strands/models/ollama.py`

```
@override
def format_chunk(self, event: dict[str, Any]) -> StreamEvent:
    """Format the Ollama response events into standardized message chunks.

    Args:
        event: A response event from the Ollama model.

    Returns:
        The formatted chunk.

    Raises:
        RuntimeError: If chunk_type is not recognized.
            This error should never be encountered as we control chunk_type in the stream method.
    """
    match event["chunk_type"]:
        case "message_start":
            return {"messageStart": {"role": "assistant"}}

        case "content_start":
            if event["data_type"] == "text":
                return {"contentBlockStart": {"start": {}}}

            tool_name = event["data"].function.name
            return {"contentBlockStart": {"start": {"toolUse": {"name": tool_name, "toolUseId": tool_name}}}}

        case "content_delta":
            if event["data_type"] == "text":
                return {"contentBlockDelta": {"delta": {"text": event["data"]}}}

            tool_arguments = event["data"].function.arguments
            return {"contentBlockDelta": {"delta": {"toolUse": {"input": json.dumps(tool_arguments)}}}}

        case "content_stop":
            return {"contentBlockStop": {}}

        case "message_stop":
            reason: StopReason
            if event["data"] == "tool_use":
                reason = "tool_use"
            elif event["data"] == "length":
                reason = "max_tokens"
            else:
                reason = "end_turn"

            return {"messageStop": {"stopReason": reason}}

        case "metadata":
            return {
                "metadata": {
                    "usage": {
                        "inputTokens": event["data"].eval_count,
                        "outputTokens": event["data"].prompt_eval_count,
                        "totalTokens": event["data"].eval_count + event["data"].prompt_eval_count,
                    },
                    "metrics": {
                        "latencyMs": event["data"].total_duration / 1e6,
                    },
                },
            }

        case _:
            raise RuntimeError(f"chunk_type=<{event['chunk_type']} | unknown type")

```

#### `format_request(messages, tool_specs=None, system_prompt=None)`

Format an Ollama chat streaming request.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `messages` | `Messages` | List of message objects to be processed by the model. | *required* | | `tool_specs` | `Optional[list[ToolSpec]]` | List of tool specifications to make available to the model. | `None` | | `system_prompt` | `Optional[str]` | System prompt to provide context to the model. | `None` |

Returns:

| Type | Description | | --- | --- | | `dict[str, Any]` | An Ollama chat streaming request. |

Raises:

| Type | Description | | --- | --- | | `TypeError` | If a message contains a content block type that cannot be converted to an Ollama-compatible format. |

Source code in `strands/models/ollama.py`

```
@override
def format_request(
    self, messages: Messages, tool_specs: Optional[list[ToolSpec]] = None, system_prompt: Optional[str] = None
) -> dict[str, Any]:
    """Format an Ollama chat streaming request.

    Args:
        messages: List of message objects to be processed by the model.
        tool_specs: List of tool specifications to make available to the model.
        system_prompt: System prompt to provide context to the model.

    Returns:
        An Ollama chat streaming request.

    Raises:
        TypeError: If a message contains a content block type that cannot be converted to an Ollama-compatible
            format.
    """
    return {
        "messages": self._format_request_messages(messages, system_prompt),
        "model": self.config["model_id"],
        "options": {
            **(self.config.get("options") or {}),
            **{
                key: value
                for key, value in [
                    ("num_predict", self.config.get("max_tokens")),
                    ("temperature", self.config.get("temperature")),
                    ("top_p", self.config.get("top_p")),
                    ("stop", self.config.get("stop_sequences")),
                ]
                if value is not None
            },
        },
        "stream": True,
        "tools": [
            {
                "type": "function",
                "function": {
                    "name": tool_spec["name"],
                    "description": tool_spec["description"],
                    "parameters": tool_spec["inputSchema"]["json"],
                },
            }
            for tool_spec in tool_specs or []
        ],
        **({"keep_alive": self.config["keep_alive"]} if self.config.get("keep_alive") else {}),
        **(
            self.config["additional_args"]
            if "additional_args" in self.config and self.config["additional_args"] is not None
            else {}
        ),
    }

```

#### `get_config()`

Get the Ollama model configuration.

Returns:

| Type | Description | | --- | --- | | `OllamaConfig` | The Ollama model configuration. |

Source code in `strands/models/ollama.py`

```
@override
def get_config(self) -> OllamaConfig:
    """Get the Ollama model configuration.

    Returns:
        The Ollama model configuration.
    """
    return self.config

```

#### `stream(request)`

Send the request to the Ollama model and get the streaming response.

This method calls the Ollama chat API and returns the stream of response events.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `request` | `dict[str, Any]` | The formatted request to send to the Ollama model. | *required* |

Returns:

| Type | Description | | --- | --- | | `Iterable[dict[str, Any]]` | An iterable of response events from the Ollama model. |

Source code in `strands/models/ollama.py`

```
@override
def stream(self, request: dict[str, Any]) -> Iterable[dict[str, Any]]:
    """Send the request to the Ollama model and get the streaming response.

    This method calls the Ollama chat API and returns the stream of response events.

    Args:
        request: The formatted request to send to the Ollama model.

    Returns:
        An iterable of response events from the Ollama model.
    """
    tool_requested = False

    response = self.client.chat(**request)

    yield {"chunk_type": "message_start"}
    yield {"chunk_type": "content_start", "data_type": "text"}

    for event in response:
        for tool_call in event.message.tool_calls or []:
            yield {"chunk_type": "content_start", "data_type": "tool", "data": tool_call}
            yield {"chunk_type": "content_delta", "data_type": "tool", "data": tool_call}
            yield {"chunk_type": "content_stop", "data_type": "tool", "data": tool_call}
            tool_requested = True

        yield {"chunk_type": "content_delta", "data_type": "text", "data": event.message.content}

    yield {"chunk_type": "content_stop", "data_type": "text"}
    yield {"chunk_type": "message_stop", "data": "tool_use" if tool_requested else event.done_reason}
    yield {"chunk_type": "metadata", "data": event}

```

#### `update_config(**model_config)`

Update the Ollama Model configuration with the provided arguments.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `**model_config` | `Unpack[OllamaConfig]` | Configuration overrides. | `{}` |

Source code in `strands/models/ollama.py`

```
@override
def update_config(self, **model_config: Unpack[OllamaConfig]) -> None:  # type: ignore
    """Update the Ollama Model configuration with the provided arguments.

    Args:
        **model_config: Configuration overrides.
    """
    self.config.update(model_config)

```

## `strands.models.openai`

OpenAI model provider.

- Docs: https://platform.openai.com/docs/overview

### `Client`

Bases: `Protocol`

Protocol defining the OpenAI-compatible interface for the underlying provider client.

Source code in `strands/models/openai.py`

```
class Client(Protocol):
    """Protocol defining the OpenAI-compatible interface for the underlying provider client."""

    @property
    # pragma: no cover
    def chat(self) -> Any:
        """Chat completions interface."""
        ...

```

#### `chat`

Chat completions interface.

### `OpenAIModel`

Bases: `OpenAIModel`

OpenAI model provider implementation.

Source code in `strands/models/openai.py`

```
class OpenAIModel(SAOpenAIModel):
    """OpenAI model provider implementation."""

    client: Client

    class OpenAIConfig(TypedDict, total=False):
        """Configuration options for OpenAI models.

        Attributes:
            model_id: Model ID (e.g., "gpt-4o").
                For a complete list of supported models, see https://platform.openai.com/docs/models.
            params: Model parameters (e.g., max_tokens).
                For a complete list of supported parameters, see
                https://platform.openai.com/docs/api-reference/chat/create.
        """

        model_id: str
        params: Optional[dict[str, Any]]

    def __init__(self, client_args: Optional[dict[str, Any]] = None, **model_config: Unpack[OpenAIConfig]) -> None:
        """Initialize provider instance.

        Args:
            client_args: Arguments for the OpenAI client.
                For a complete list of supported arguments, see https://pypi.org/project/openai/.
            **model_config: Configuration options for the OpenAI model.
        """
        self.config = dict(model_config)

        logger.debug("config=<%s> | initializing", self.config)

        client_args = client_args or {}
        self.client = openai.OpenAI(**client_args)

    @override
    def update_config(self, **model_config: Unpack[OpenAIConfig]) -> None:  # type: ignore[override]
        """Update the OpenAI model configuration with the provided arguments.

        Args:
            **model_config: Configuration overrides.
        """
        self.config.update(model_config)

    @override
    def get_config(self) -> OpenAIConfig:
        """Get the OpenAI model configuration.

        Returns:
            The OpenAI model configuration.
        """
        return cast(OpenAIModel.OpenAIConfig, self.config)

    @override
    def stream(self, request: dict[str, Any]) -> Iterable[dict[str, Any]]:
        """Send the request to the OpenAI model and get the streaming response.

        Args:
            request: The formatted request to send to the OpenAI model.

        Returns:
            An iterable of response events from the OpenAI model.
        """
        response = self.client.chat.completions.create(**request)

        yield {"chunk_type": "message_start"}
        yield {"chunk_type": "content_start", "data_type": "text"}

        tool_calls: dict[int, list[Any]] = {}

        for event in response:
            # Defensive: skip events with empty or missing choices
            if not getattr(event, "choices", None):
                continue
            choice = event.choices[0]

            if choice.delta.content:
                yield {"chunk_type": "content_delta", "data_type": "text", "data": choice.delta.content}

            for tool_call in choice.delta.tool_calls or []:
                tool_calls.setdefault(tool_call.index, []).append(tool_call)

            if choice.finish_reason:
                break

        yield {"chunk_type": "content_stop", "data_type": "text"}

        for tool_deltas in tool_calls.values():
            yield {"chunk_type": "content_start", "data_type": "tool", "data": tool_deltas[0]}

            for tool_delta in tool_deltas:
                yield {"chunk_type": "content_delta", "data_type": "tool", "data": tool_delta}

            yield {"chunk_type": "content_stop", "data_type": "tool"}

        yield {"chunk_type": "message_stop", "data": choice.finish_reason}

        # Skip remaining events as we don't have use for anything except the final usage payload
        for event in response:
            _ = event

        yield {"chunk_type": "metadata", "data": event.usage}

```

#### `OpenAIConfig`

Bases: `TypedDict`

Configuration options for OpenAI models.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `model_id` | `str` | Model ID (e.g., "gpt-4o"). For a complete list of supported models, see https://platform.openai.com/docs/models. | | `params` | `Optional[dict[str, Any]]` | Model parameters (e.g., max_tokens). For a complete list of supported parameters, see https://platform.openai.com/docs/api-reference/chat/create. |

Source code in `strands/models/openai.py`

```
class OpenAIConfig(TypedDict, total=False):
    """Configuration options for OpenAI models.

    Attributes:
        model_id: Model ID (e.g., "gpt-4o").
            For a complete list of supported models, see https://platform.openai.com/docs/models.
        params: Model parameters (e.g., max_tokens).
            For a complete list of supported parameters, see
            https://platform.openai.com/docs/api-reference/chat/create.
    """

    model_id: str
    params: Optional[dict[str, Any]]

```

#### `__init__(client_args=None, **model_config)`

Initialize provider instance.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `client_args` | `Optional[dict[str, Any]]` | Arguments for the OpenAI client. For a complete list of supported arguments, see https://pypi.org/project/openai/. | `None` | | `**model_config` | `Unpack[OpenAIConfig]` | Configuration options for the OpenAI model. | `{}` |

Source code in `strands/models/openai.py`

```
def __init__(self, client_args: Optional[dict[str, Any]] = None, **model_config: Unpack[OpenAIConfig]) -> None:
    """Initialize provider instance.

    Args:
        client_args: Arguments for the OpenAI client.
            For a complete list of supported arguments, see https://pypi.org/project/openai/.
        **model_config: Configuration options for the OpenAI model.
    """
    self.config = dict(model_config)

    logger.debug("config=<%s> | initializing", self.config)

    client_args = client_args or {}
    self.client = openai.OpenAI(**client_args)

```

#### `get_config()`

Get the OpenAI model configuration.

Returns:

| Type | Description | | --- | --- | | `OpenAIConfig` | The OpenAI model configuration. |

Source code in `strands/models/openai.py`

```
@override
def get_config(self) -> OpenAIConfig:
    """Get the OpenAI model configuration.

    Returns:
        The OpenAI model configuration.
    """
    return cast(OpenAIModel.OpenAIConfig, self.config)

```

#### `stream(request)`

Send the request to the OpenAI model and get the streaming response.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `request` | `dict[str, Any]` | The formatted request to send to the OpenAI model. | *required* |

Returns:

| Type | Description | | --- | --- | | `Iterable[dict[str, Any]]` | An iterable of response events from the OpenAI model. |

Source code in `strands/models/openai.py`

```
@override
def stream(self, request: dict[str, Any]) -> Iterable[dict[str, Any]]:
    """Send the request to the OpenAI model and get the streaming response.

    Args:
        request: The formatted request to send to the OpenAI model.

    Returns:
        An iterable of response events from the OpenAI model.
    """
    response = self.client.chat.completions.create(**request)

    yield {"chunk_type": "message_start"}
    yield {"chunk_type": "content_start", "data_type": "text"}

    tool_calls: dict[int, list[Any]] = {}

    for event in response:
        # Defensive: skip events with empty or missing choices
        if not getattr(event, "choices", None):
            continue
        choice = event.choices[0]

        if choice.delta.content:
            yield {"chunk_type": "content_delta", "data_type": "text", "data": choice.delta.content}

        for tool_call in choice.delta.tool_calls or []:
            tool_calls.setdefault(tool_call.index, []).append(tool_call)

        if choice.finish_reason:
            break

    yield {"chunk_type": "content_stop", "data_type": "text"}

    for tool_deltas in tool_calls.values():
        yield {"chunk_type": "content_start", "data_type": "tool", "data": tool_deltas[0]}

        for tool_delta in tool_deltas:
            yield {"chunk_type": "content_delta", "data_type": "tool", "data": tool_delta}

        yield {"chunk_type": "content_stop", "data_type": "tool"}

    yield {"chunk_type": "message_stop", "data": choice.finish_reason}

    # Skip remaining events as we don't have use for anything except the final usage payload
    for event in response:
        _ = event

    yield {"chunk_type": "metadata", "data": event.usage}

```

#### `update_config(**model_config)`

Update the OpenAI model configuration with the provided arguments.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `**model_config` | `Unpack[OpenAIConfig]` | Configuration overrides. | `{}` |

Source code in `strands/models/openai.py`

```
@override
def update_config(self, **model_config: Unpack[OpenAIConfig]) -> None:  # type: ignore[override]
    """Update the OpenAI model configuration with the provided arguments.

    Args:
        **model_config: Configuration overrides.
    """
    self.config.update(model_config)

```
