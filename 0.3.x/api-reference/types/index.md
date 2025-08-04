# `strands.types`

SDK type definitions.

## `strands.types.content`

Content-related type definitions for the SDK.

This module defines the types used to represent messages, content blocks, and other content-related structures in the SDK. These types are modeled after the Bedrock API.

- Bedrock docs: https://docs.aws.amazon.com/bedrock/latest/APIReference/API_Types_Amazon_Bedrock_Runtime.html

### `Messages = List[Message]`

A list of messages representing a conversation.

### `Role = Literal['user', 'assistant']`

Role of a message sender.

- "user": Messages from the user to the assistant
- "assistant": Messages from the assistant to the user

### `CachePoint`

Bases: `TypedDict`

A cache point configuration for optimizing conversation history.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `type` | `str` | The type of cache point, typically "default". |

Source code in `strands/types/content.py`

```
class CachePoint(TypedDict):
    """A cache point configuration for optimizing conversation history.

    Attributes:
        type: The type of cache point, typically "default".
    """

    type: str

```

### `ContentBlock`

Bases: `TypedDict`

A block of content for a message that you pass to, or receive from, a model.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `cachePoint` | `CachePoint` | A cache point configuration to optimize conversation history. | | `document` | `DocumentContent` | A document to include in the message. | | `guardContent` | `GuardContent` | Contains the content to assess with the guardrail. | | `image` | `ImageContent` | Image to include in the message. | | `reasoningContent` | `ReasoningContentBlock` | Contains content regarding the reasoning that is carried out by the model. | | `text` | `str` | Text to include in the message. | | `toolResult` | `ToolResult` | The result for a tool request that a model makes. | | `toolUse` | `ToolUse` | Information about a tool use request from a model. | | `video` | `VideoContent` | Video to include in the message. |

Source code in `strands/types/content.py`

```
class ContentBlock(TypedDict, total=False):
    """A block of content for a message that you pass to, or receive from, a model.

    Attributes:
        cachePoint: A cache point configuration to optimize conversation history.
        document: A document to include in the message.
        guardContent: Contains the content to assess with the guardrail.
        image: Image to include in the message.
        reasoningContent: Contains content regarding the reasoning that is carried out by the model.
        text: Text to include in the message.
        toolResult: The result for a tool request that a model makes.
        toolUse: Information about a tool use request from a model.
        video: Video to include in the message.
    """

    cachePoint: CachePoint
    document: DocumentContent
    guardContent: GuardContent
    image: ImageContent
    reasoningContent: ReasoningContentBlock
    text: str
    toolResult: ToolResult
    toolUse: ToolUse
    video: VideoContent

```

### `ContentBlockDelta`

Bases: `TypedDict`

The content block delta event.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `contentBlockIndex` | `int` | The block index for a content block delta event. | | `delta` | `DeltaContent` | The delta for a content block delta event. |

Source code in `strands/types/content.py`

```
class ContentBlockDelta(TypedDict):
    """The content block delta event.

    Attributes:
        contentBlockIndex: The block index for a content block delta event.
        delta: The delta for a content block delta event.
    """

    contentBlockIndex: int
    delta: DeltaContent

```

### `ContentBlockStart`

Bases: `TypedDict`

Content block start information.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `toolUse` | `Optional[ContentBlockStartToolUse]` | Information about a tool that the model is requesting to use. |

Source code in `strands/types/content.py`

```
class ContentBlockStart(TypedDict, total=False):
    """Content block start information.

    Attributes:
        toolUse: Information about a tool that the model is requesting to use.
    """

    toolUse: Optional[ContentBlockStartToolUse]

```

### `ContentBlockStartToolUse`

Bases: `TypedDict`

The start of a tool use block.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `name` | `str` | The name of the tool that the model is requesting to use. | | `toolUseId` | `str` | The ID for the tool request. |

Source code in `strands/types/content.py`

```
class ContentBlockStartToolUse(TypedDict):
    """The start of a tool use block.

    Attributes:
        name: The name of the tool that the model is requesting to use.
        toolUseId: The ID for the tool request.
    """

    name: str
    toolUseId: str

```

### `ContentBlockStop`

Bases: `TypedDict`

A content block stop event.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `contentBlockIndex` | `int` | The index for a content block. |

Source code in `strands/types/content.py`

```
class ContentBlockStop(TypedDict):
    """A content block stop event.

    Attributes:
        contentBlockIndex: The index for a content block.
    """

    contentBlockIndex: int

```

### `DeltaContent`

Bases: `TypedDict`

A block of content in a streaming response.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `text` | `str` | The content text. | | `toolUse` | `Dict[Literal['input'], str]` | Information about a tool that the model is requesting to use. |

Source code in `strands/types/content.py`

```
class DeltaContent(TypedDict, total=False):
    """A block of content in a streaming response.

    Attributes:
        text: The content text.
        toolUse: Information about a tool that the model is requesting to use.
    """

    text: str
    toolUse: Dict[Literal["input"], str]

```

### `GuardContent`

Bases: `TypedDict`

Content block to be evaluated by guardrails.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `text` | `GuardContentText` | Text within content block to be evaluated by the guardrail. |

Source code in `strands/types/content.py`

```
class GuardContent(TypedDict):
    """Content block to be evaluated by guardrails.

    Attributes:
        text: Text within content block to be evaluated by the guardrail.
    """

    text: GuardContentText

```

### `GuardContentText`

Bases: `TypedDict`

Text content to be evaluated by guardrails.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `qualifiers` | `List[Literal['grounding_source', 'query', 'guard_content']]` | The qualifiers describing the text block. | | `text` | `str` | The input text details to be evaluated by the guardrail. |

Source code in `strands/types/content.py`

```
class GuardContentText(TypedDict):
    """Text content to be evaluated by guardrails.

    Attributes:
        qualifiers: The qualifiers describing the text block.
        text: The input text details to be evaluated by the guardrail.
    """

    qualifiers: List[Literal["grounding_source", "query", "guard_content"]]
    text: str

```

### `Message`

Bases: `TypedDict`

A message in a conversation with the agent.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `content` | `List[ContentBlock]` | The message content. | | `role` | `Role` | The role of the message sender. |

Source code in `strands/types/content.py`

```
class Message(TypedDict):
    """A message in a conversation with the agent.

    Attributes:
        content: The message content.
        role: The role of the message sender.
    """

    content: List[ContentBlock]
    role: Role

```

### `ReasoningContentBlock`

Bases: `TypedDict`

Contains content regarding the reasoning that is carried out by the model.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `reasoningText` | `ReasoningTextBlock` | The reasoning that the model used to return the output. | | `redactedContent` | `bytes` | The content in the reasoning that was encrypted by the model provider for safety reasons. |

Source code in `strands/types/content.py`

```
class ReasoningContentBlock(TypedDict, total=False):
    """Contains content regarding the reasoning that is carried out by the model.

    Attributes:
        reasoningText: The reasoning that the model used to return the output.
        redactedContent: The content in the reasoning that was encrypted by the model provider for safety reasons.
    """

    reasoningText: ReasoningTextBlock
    redactedContent: bytes

```

### `ReasoningTextBlock`

Bases: `TypedDict`

Contains the reasoning that the model used to return the output.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `signature` | `Optional[str]` | A token that verifies that the reasoning text was generated by the model. | | `text` | `str` | The reasoning that the model used to return the output. |

Source code in `strands/types/content.py`

```
class ReasoningTextBlock(TypedDict, total=False):
    """Contains the reasoning that the model used to return the output.

    Attributes:
        signature: A token that verifies that the reasoning text was generated by the model.
        text: The reasoning that the model used to return the output.
    """

    signature: Optional[str]
    text: str

```

### `SystemContentBlock`

Bases: `TypedDict`

Contains configurations for instructions to provide the model for how to handle input.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `guardContent` | `GuardContent` | A content block to assess with the guardrail. | | `text` | `str` | A system prompt for the model. |

Source code in `strands/types/content.py`

```
class SystemContentBlock(TypedDict, total=False):
    """Contains configurations for instructions to provide the model for how to handle input.

    Attributes:
        guardContent: A content block to assess with the guardrail.
        text: A system prompt for the model.
    """

    guardContent: GuardContent
    text: str

```

## `strands.types.event_loop`

Event loop-related type definitions for the SDK.

### `StopReason = Literal['content_filtered', 'end_turn', 'guardrail_intervened', 'max_tokens', 'stop_sequence', 'tool_use']`

Reason for the model ending its response generation.

- "content_filtered": Content was filtered due to policy violation
- "end_turn": Normal completion of the response
- "guardrail_intervened": Guardrail system intervened
- "max_tokens": Maximum token limit reached
- "stop_sequence": Stop sequence encountered
- "tool_use": Model requested to use a tool

### `Metrics`

Bases: `TypedDict`

Performance metrics for model interactions.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `latencyMs` | `int` | Latency of the model request in milliseconds. |

Source code in `strands/types/event_loop.py`

```
class Metrics(TypedDict):
    """Performance metrics for model interactions.

    Attributes:
        latencyMs (int): Latency of the model request in milliseconds.
    """

    latencyMs: int

```

### `Usage`

Bases: `TypedDict`

Token usage information for model interactions.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `inputTokens` | `int` | Number of tokens sent in the request to the model.. | | `outputTokens` | `int` | Number of tokens that the model generated for the request. | | `totalTokens` | `int` | Total number of tokens (input + output). |

Source code in `strands/types/event_loop.py`

```
class Usage(TypedDict):
    """Token usage information for model interactions.

    Attributes:
        inputTokens: Number of tokens sent in the request to the model..
        outputTokens: Number of tokens that the model generated for the request.
        totalTokens: Total number of tokens (input + output).
    """

    inputTokens: int
    outputTokens: int
    totalTokens: int

```

## `strands.types.exceptions`

Exception-related type definitions for the SDK.

### `ContextWindowOverflowException`

Bases: `Exception`

Exception raised when the context window is exceeded.

This exception is raised when the input to a model exceeds the maximum context window size that the model can handle. This typically occurs when the combined length of the conversation history, system prompt, and current message is too large for the model to process.

Source code in `strands/types/exceptions.py`

```
class ContextWindowOverflowException(Exception):
    """Exception raised when the context window is exceeded.

    This exception is raised when the input to a model exceeds the maximum context window size that the model can
    handle. This typically occurs when the combined length of the conversation history, system prompt, and current
    message is too large for the model to process.
    """

    pass

```

### `EventLoopException`

Bases: `Exception`

Exception raised by the event loop.

Source code in `strands/types/exceptions.py`

```
class EventLoopException(Exception):
    """Exception raised by the event loop."""

    def __init__(self, original_exception: Exception, request_state: Any = None) -> None:
        """Initialize exception.

        Args:
            original_exception: The original exception that was raised.
            request_state: The state of the request at the time of the exception.
        """
        self.original_exception = original_exception
        self.request_state = request_state if request_state is not None else {}
        super().__init__(str(original_exception))

```

#### `__init__(original_exception, request_state=None)`

Initialize exception.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `original_exception` | `Exception` | The original exception that was raised. | *required* | | `request_state` | `Any` | The state of the request at the time of the exception. | `None` |

Source code in `strands/types/exceptions.py`

```
def __init__(self, original_exception: Exception, request_state: Any = None) -> None:
    """Initialize exception.

    Args:
        original_exception: The original exception that was raised.
        request_state: The state of the request at the time of the exception.
    """
    self.original_exception = original_exception
    self.request_state = request_state if request_state is not None else {}
    super().__init__(str(original_exception))

```

### `MCPClientInitializationError`

Bases: `Exception`

Raised when the MCP server fails to initialize properly.

Source code in `strands/types/exceptions.py`

```
class MCPClientInitializationError(Exception):
    """Raised when the MCP server fails to initialize properly."""

    pass

```

### `MaxTokensReachedException`

Bases: `Exception`

Exception raised when the model reaches its maximum token generation limit.

This exception is raised when the model stops generating tokens because it has reached the maximum number of tokens allowed for output generation. This can occur when the model's max_tokens parameter is set too low for the complexity of the response, or when the model naturally reaches its configured output limit during generation.

Source code in `strands/types/exceptions.py`

```
class MaxTokensReachedException(Exception):
    """Exception raised when the model reaches its maximum token generation limit.

    This exception is raised when the model stops generating tokens because it has reached the maximum number of
    tokens allowed for output generation. This can occur when the model's max_tokens parameter is set too low for
    the complexity of the response, or when the model naturally reaches its configured output limit during generation.
    """

    def __init__(self, message: str, incomplete_message: Message):
        """Initialize the exception with an error message and the incomplete message object.

        Args:
            message: The error message describing the token limit issue
            incomplete_message: The valid Message object with incomplete content due to token limits
        """
        self.incomplete_message = incomplete_message
        super().__init__(message)

```

#### `__init__(message, incomplete_message)`

Initialize the exception with an error message and the incomplete message object.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `message` | `str` | The error message describing the token limit issue | *required* | | `incomplete_message` | `Message` | The valid Message object with incomplete content due to token limits | *required* |

Source code in `strands/types/exceptions.py`

```
def __init__(self, message: str, incomplete_message: Message):
    """Initialize the exception with an error message and the incomplete message object.

    Args:
        message: The error message describing the token limit issue
        incomplete_message: The valid Message object with incomplete content due to token limits
    """
    self.incomplete_message = incomplete_message
    super().__init__(message)

```

### `ModelThrottledException`

Bases: `Exception`

Exception raised when the model is throttled.

This exception is raised when the model is throttled by the service. This typically occurs when the service is throttling the requests from the client.

Source code in `strands/types/exceptions.py`

```
class ModelThrottledException(Exception):
    """Exception raised when the model is throttled.

    This exception is raised when the model is throttled by the service. This typically occurs when the service is
    throttling the requests from the client.
    """

    def __init__(self, message: str) -> None:
        """Initialize exception.

        Args:
            message: The message from the service that describes the throttling.
        """
        self.message = message
        super().__init__(message)

    pass

```

#### `__init__(message)`

Initialize exception.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `message` | `str` | The message from the service that describes the throttling. | *required* |

Source code in `strands/types/exceptions.py`

```
def __init__(self, message: str) -> None:
    """Initialize exception.

    Args:
        message: The message from the service that describes the throttling.
    """
    self.message = message
    super().__init__(message)

```

### `SessionException`

Bases: `Exception`

Exception raised when session operations fail.

Source code in `strands/types/exceptions.py`

```
class SessionException(Exception):
    """Exception raised when session operations fail."""

    pass

```

## `strands.types.guardrails`

Guardrail-related type definitions for the SDK.

These types are modeled after the Bedrock API.

- Bedrock docs: https://docs.aws.amazon.com/bedrock/latest/APIReference/API_Types_Amazon_Bedrock_Runtime.html

### `ContentFilter`

Bases: `TypedDict`

The content filter for a guardrail.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `action` | `Literal['BLOCKED']` | Action to take when content is detected. | | `confidence` | `Literal['NONE', 'LOW', 'MEDIUM', 'HIGH']` | Confidence level of the detection. | | `type` | `Literal['INSULTS', 'HATE', 'SEXUAL', 'VIOLENCE', 'MISCONDUCT', 'PROMPT_ATTACK']` | The type of content to filter. |

Source code in `strands/types/guardrails.py`

```
class ContentFilter(TypedDict):
    """The content filter for a guardrail.

    Attributes:
        action: Action to take when content is detected.
        confidence: Confidence level of the detection.
        type: The type of content to filter.
    """

    action: Literal["BLOCKED"]
    confidence: Literal["NONE", "LOW", "MEDIUM", "HIGH"]
    type: Literal["INSULTS", "HATE", "SEXUAL", "VIOLENCE", "MISCONDUCT", "PROMPT_ATTACK"]

```

### `ContentPolicy`

Bases: `TypedDict`

An assessment of a content policy for a guardrail.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `filters` | `List[ContentFilter]` | List of content filters to apply. |

Source code in `strands/types/guardrails.py`

```
class ContentPolicy(TypedDict):
    """An assessment of a content policy for a guardrail.

    Attributes:
        filters: List of content filters to apply.
    """

    filters: List[ContentFilter]

```

### `ContextualGroundingFilter`

Bases: `TypedDict`

Filter for ensuring responses are grounded in provided context.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `action` | `Literal['BLOCKED', 'NONE']` | Action to take when the threshold is not met. | | `score` | `float` | The score generated by contextual grounding filter (range [0, 1]). | | `threshold` | `float` | Threshold used by contextual grounding filter to determine whether the content is grounded or not. | | `type` | `Literal['GROUNDING', 'RELEVANCE']` | The contextual grounding filter type. |

Source code in `strands/types/guardrails.py`

```
class ContextualGroundingFilter(TypedDict):
    """Filter for ensuring responses are grounded in provided context.

    Attributes:
        action: Action to take when the threshold is not met.
        score: The score generated by contextual grounding filter (range [0, 1]).
        threshold: Threshold used by contextual grounding filter to determine whether the content is grounded or not.
        type: The contextual grounding filter type.
    """

    action: Literal["BLOCKED", "NONE"]
    score: float
    threshold: float
    type: Literal["GROUNDING", "RELEVANCE"]

```

### `ContextualGroundingPolicy`

Bases: `TypedDict`

The policy assessment details for the guardrails contextual grounding filter.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `filters` | `List[ContextualGroundingFilter]` | The filter details for the guardrails contextual grounding filter. |

Source code in `strands/types/guardrails.py`

```
class ContextualGroundingPolicy(TypedDict):
    """The policy assessment details for the guardrails contextual grounding filter.

    Attributes:
        filters: The filter details for the guardrails contextual grounding filter.
    """

    filters: List[ContextualGroundingFilter]

```

### `CustomWord`

Bases: `TypedDict`

Definition of a custom word to be filtered.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `action` | `Literal['BLOCKED']` | Action to take when the word is detected. | | `match` | `str` | The word or phrase to match. |

Source code in `strands/types/guardrails.py`

```
class CustomWord(TypedDict):
    """Definition of a custom word to be filtered.

    Attributes:
        action: Action to take when the word is detected.
        match: The word or phrase to match.
    """

    action: Literal["BLOCKED"]
    match: str

```

### `GuardrailAssessment`

Bases: `TypedDict`

A behavior assessment of the guardrail policies used in a call to the Converse API.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `contentPolicy` | `ContentPolicy` | The content policy. | | `contextualGroundingPolicy` | `ContextualGroundingPolicy` | The contextual grounding policy used for the guardrail assessment. | | `sensitiveInformationPolicy` | `SensitiveInformationPolicy` | The sensitive information policy. | | `topicPolicy` | `TopicPolicy` | The topic policy. | | `wordPolicy` | `WordPolicy` | The word policy. |

Source code in `strands/types/guardrails.py`

```
class GuardrailAssessment(TypedDict):
    """A behavior assessment of the guardrail policies used in a call to the Converse API.

    Attributes:
        contentPolicy: The content policy.
        contextualGroundingPolicy: The contextual grounding policy used for the guardrail assessment.
        sensitiveInformationPolicy: The sensitive information policy.
        topicPolicy: The topic policy.
        wordPolicy: The word policy.
    """

    contentPolicy: ContentPolicy
    contextualGroundingPolicy: ContextualGroundingPolicy
    sensitiveInformationPolicy: SensitiveInformationPolicy
    topicPolicy: TopicPolicy
    wordPolicy: WordPolicy

```

### `GuardrailConfig`

Bases: `TypedDict`

Configuration for content filtering guardrails.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `guardrailIdentifier` | `str` | Unique identifier for the guardrail. | | `guardrailVersion` | `str` | Version of the guardrail to apply. | | `streamProcessingMode` | `Optional[Literal['sync', 'async']]` | Processing mode. | | `trace` | `Literal['enabled', 'disabled']` | The trace behavior for the guardrail. |

Source code in `strands/types/guardrails.py`

```
class GuardrailConfig(TypedDict, total=False):
    """Configuration for content filtering guardrails.

    Attributes:
        guardrailIdentifier: Unique identifier for the guardrail.
        guardrailVersion: Version of the guardrail to apply.
        streamProcessingMode: Processing mode.
        trace: The trace behavior for the guardrail.
    """

    guardrailIdentifier: str
    guardrailVersion: str
    streamProcessingMode: Optional[Literal["sync", "async"]]
    trace: Literal["enabled", "disabled"]

```

### `GuardrailTrace`

Bases: `TypedDict`

Trace information from guardrail processing.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `inputAssessment` | `Dict[str, GuardrailAssessment]` | Assessment of input content against guardrail policies, keyed by input identifier. | | `modelOutput` | `List[str]` | The original output from the model before guardrail processing. | | `outputAssessments` | `Dict[str, List[GuardrailAssessment]]` | Assessments of output content against guardrail policies, keyed by output identifier. |

Source code in `strands/types/guardrails.py`

```
class GuardrailTrace(TypedDict):
    """Trace information from guardrail processing.

    Attributes:
        inputAssessment: Assessment of input content against guardrail policies, keyed by input identifier.
        modelOutput: The original output from the model before guardrail processing.
        outputAssessments: Assessments of output content against guardrail policies, keyed by output identifier.
    """

    inputAssessment: Dict[str, GuardrailAssessment]
    modelOutput: List[str]
    outputAssessments: Dict[str, List[GuardrailAssessment]]

```

### `ManagedWord`

Bases: `TypedDict`

Definition of a managed word to be filtered.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `action` | `Literal['BLOCKED']` | Action to take when the word is detected. | | `match` | `str` | The word or phrase to match. | | `type` | `Literal['PROFANITY']` | Type of the word. |

Source code in `strands/types/guardrails.py`

```
class ManagedWord(TypedDict):
    """Definition of a managed word to be filtered.

    Attributes:
        action: Action to take when the word is detected.
        match: The word or phrase to match.
        type: Type of the word.
    """

    action: Literal["BLOCKED"]
    match: str
    type: Literal["PROFANITY"]

```

### `PIIEntity`

Bases: `TypedDict`

Definition of a Personally Identifiable Information (PII) entity to be filtered.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `action` | `Literal['ANONYMIZED', 'BLOCKED']` | Action to take when PII is detected. | | `match` | `str` | The specific PII instance to match. | | `type` | `Literal['ADDRESS', 'AGE', 'AWS_ACCESS_KEY', 'AWS_SECRET_KEY', 'CA_HEALTH_NUMBER', 'CA_SOCIAL_INSURANCE_NUMBER', 'CREDIT_DEBIT_CARD_CVV', 'CREDIT_DEBIT_CARD_EXPIRY', 'CREDIT_DEBIT_CARD_NUMBER', 'DRIVER_ID', 'EMAIL', 'INTERNATIONAL_BANK_ACCOUNT_NUMBER', 'IP_ADDRESS', 'LICENSE_PLATE', 'MAC_ADDRESS', 'NAME', 'PASSWORD', 'PHONE', 'PIN', 'SWIFT_CODE', 'UK_NATIONAL_HEALTH_SERVICE_NUMBER', 'UK_NATIONAL_INSURANCE_NUMBER', 'UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER', 'URL', 'USERNAME', 'US_BANK_ACCOUNT_NUMBER', 'US_BANK_ROUTING_NUMBER', 'US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER', 'US_PASSPORT_NUMBER', 'US_SOCIAL_SECURITY_NUMBER', 'VEHICLE_IDENTIFICATION_NUMBER']` | The type of PII to detect. |

Source code in `strands/types/guardrails.py`

```
class PIIEntity(TypedDict):
    """Definition of a Personally Identifiable Information (PII) entity to be filtered.

    Attributes:
        action: Action to take when PII is detected.
        match: The specific PII instance to match.
        type: The type of PII to detect.
    """

    action: Literal["ANONYMIZED", "BLOCKED"]
    match: str
    type: Literal[
        "ADDRESS",
        "AGE",
        "AWS_ACCESS_KEY",
        "AWS_SECRET_KEY",
        "CA_HEALTH_NUMBER",
        "CA_SOCIAL_INSURANCE_NUMBER",
        "CREDIT_DEBIT_CARD_CVV",
        "CREDIT_DEBIT_CARD_EXPIRY",
        "CREDIT_DEBIT_CARD_NUMBER",
        "DRIVER_ID",
        "EMAIL",
        "INTERNATIONAL_BANK_ACCOUNT_NUMBER",
        "IP_ADDRESS",
        "LICENSE_PLATE",
        "MAC_ADDRESS",
        "NAME",
        "PASSWORD",
        "PHONE",
        "PIN",
        "SWIFT_CODE",
        "UK_NATIONAL_HEALTH_SERVICE_NUMBER",
        "UK_NATIONAL_INSURANCE_NUMBER",
        "UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER",
        "URL",
        "USERNAME",
        "US_BANK_ACCOUNT_NUMBER",
        "US_BANK_ROUTING_NUMBER",
        "US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER",
        "US_PASSPORT_NUMBER",
        "US_SOCIAL_SECURITY_NUMBER",
        "VEHICLE_IDENTIFICATION_NUMBER",
    ]

```

### `Regex`

Bases: `TypedDict`

Definition of a custom regex pattern for filtering sensitive information.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `action` | `Literal['ANONYMIZED', 'BLOCKED']` | Action to take when the pattern is matched. | | `match` | `str` | The regex filter match. | | `name` | `str` | Name of the regex pattern for identification. | | `regex` | `str` | The regex query. |

Source code in `strands/types/guardrails.py`

```
class Regex(TypedDict):
    """Definition of a custom regex pattern for filtering sensitive information.

    Attributes:
        action: Action to take when the pattern is matched.
        match: The regex filter match.
        name: Name of the regex pattern for identification.
        regex: The regex query.
    """

    action: Literal["ANONYMIZED", "BLOCKED"]
    match: str
    name: str
    regex: str

```

### `SensitiveInformationPolicy`

Bases: `TypedDict`

Policy defining sensitive information filtering rules.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `piiEntities` | `List[PIIEntity]` | List of Personally Identifiable Information (PII) entities to detect and handle. | | `regexes` | `List[Regex]` | The regex queries in the assessment. |

Source code in `strands/types/guardrails.py`

```
class SensitiveInformationPolicy(TypedDict):
    """Policy defining sensitive information filtering rules.

    Attributes:
        piiEntities: List of Personally Identifiable Information (PII) entities to detect and handle.
        regexes: The regex queries in the assessment.
    """

    piiEntities: List[PIIEntity]
    regexes: List[Regex]

```

### `Topic`

Bases: `TypedDict`

Information about a topic guardrail.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `action` | `Literal['BLOCKED']` | The action the guardrail should take when it intervenes on a topic. | | `name` | `str` | The name for the guardrail. | | `type` | `Literal['DENY']` | The type behavior that the guardrail should perform when the model detects the topic. |

Source code in `strands/types/guardrails.py`

```
class Topic(TypedDict):
    """Information about a topic guardrail.

    Attributes:
        action: The action the guardrail should take when it intervenes on a topic.
        name: The name for the guardrail.
        type: The type behavior that the guardrail should perform when the model detects the topic.
    """

    action: Literal["BLOCKED"]
    name: str
    type: Literal["DENY"]

```

### `TopicPolicy`

Bases: `TypedDict`

A behavior assessment of a topic policy.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `topics` | `List[Topic]` | The topics in the assessment. |

Source code in `strands/types/guardrails.py`

```
class TopicPolicy(TypedDict):
    """A behavior assessment of a topic policy.

    Attributes:
        topics: The topics in the assessment.
    """

    topics: List[Topic]

```

### `Trace`

Bases: `TypedDict`

A Top level guardrail trace object.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `guardrail` | `GuardrailTrace` | Trace information from guardrail processing. |

Source code in `strands/types/guardrails.py`

```
class Trace(TypedDict):
    """A Top level guardrail trace object.

    Attributes:
        guardrail: Trace information from guardrail processing.
    """

    guardrail: GuardrailTrace

```

### `WordPolicy`

Bases: `TypedDict`

The word policy assessment.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `customWords` | `List[CustomWord]` | List of custom words to filter. | | `managedWordLists` | `List[ManagedWord]` | List of managed word lists to filter. |

Source code in `strands/types/guardrails.py`

```
class WordPolicy(TypedDict):
    """The word policy assessment.

    Attributes:
        customWords: List of custom words to filter.
        managedWordLists: List of managed word lists to filter.
    """

    customWords: List[CustomWord]
    managedWordLists: List[ManagedWord]

```

## `strands.types.media`

Media-related type definitions for the SDK.

These types are modeled after the Bedrock API.

- Bedrock docs: https://docs.aws.amazon.com/bedrock/latest/APIReference/API_Types_Amazon_Bedrock_Runtime.html

### `DocumentFormat = Literal['pdf', 'csv', 'doc', 'docx', 'xls', 'xlsx', 'html', 'txt', 'md']`

Supported document formats.

### `ImageFormat = Literal['png', 'jpeg', 'gif', 'webp']`

Supported image formats.

### `VideoFormat = Literal['flv', 'mkv', 'mov', 'mpeg', 'mpg', 'mp4', 'three_gp', 'webm', 'wmv']`

Supported video formats.

### `DocumentContent`

Bases: `TypedDict`

A document to include in a message.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `format` | `Literal['pdf', 'csv', 'doc', 'docx', 'xls', 'xlsx', 'html', 'txt', 'md']` | The format of the document (e.g., "pdf", "txt"). | | `name` | `str` | The name of the document. | | `source` | `DocumentSource` | The source containing the document's binary content. |

Source code in `strands/types/media.py`

```
class DocumentContent(TypedDict):
    """A document to include in a message.

    Attributes:
        format: The format of the document (e.g., "pdf", "txt").
        name: The name of the document.
        source: The source containing the document's binary content.
    """

    format: Literal["pdf", "csv", "doc", "docx", "xls", "xlsx", "html", "txt", "md"]
    name: str
    source: DocumentSource

```

### `DocumentSource`

Bases: `TypedDict`

Contains the content of a document.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `bytes` | `bytes` | The binary content of the document. |

Source code in `strands/types/media.py`

```
class DocumentSource(TypedDict):
    """Contains the content of a document.

    Attributes:
        bytes: The binary content of the document.
    """

    bytes: bytes

```

### `ImageContent`

Bases: `TypedDict`

An image to include in a message.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `format` | `ImageFormat` | The format of the image (e.g., "png", "jpeg"). | | `source` | `ImageSource` | The source containing the image's binary content. |

Source code in `strands/types/media.py`

```
class ImageContent(TypedDict):
    """An image to include in a message.

    Attributes:
        format: The format of the image (e.g., "png", "jpeg").
        source: The source containing the image's binary content.
    """

    format: ImageFormat
    source: ImageSource

```

### `ImageSource`

Bases: `TypedDict`

Contains the content of an image.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `bytes` | `bytes` | The binary content of the image. |

Source code in `strands/types/media.py`

```
class ImageSource(TypedDict):
    """Contains the content of an image.

    Attributes:
        bytes: The binary content of the image.
    """

    bytes: bytes

```

### `VideoContent`

Bases: `TypedDict`

A video to include in a message.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `format` | `VideoFormat` | The format of the video (e.g., "mp4", "avi"). | | `source` | `VideoSource` | The source containing the video's binary content. |

Source code in `strands/types/media.py`

```
class VideoContent(TypedDict):
    """A video to include in a message.

    Attributes:
        format: The format of the video (e.g., "mp4", "avi").
        source: The source containing the video's binary content.
    """

    format: VideoFormat
    source: VideoSource

```

### `VideoSource`

Bases: `TypedDict`

Contains the content of a video.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `bytes` | `bytes` | The binary content of the video. |

Source code in `strands/types/media.py`

```
class VideoSource(TypedDict):
    """Contains the content of a video.

    Attributes:
        bytes: The binary content of the video.
    """

    bytes: bytes

```

## `strands.types.session`

Data models for session management.

### `Session`

Session data model.

Source code in `strands/types/session.py`

```
@dataclass
class Session:
    """Session data model."""

    session_id: str
    session_type: SessionType
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    @classmethod
    def from_dict(cls, env: dict[str, Any]) -> "Session":
        """Initialize a Session from a dictionary, ignoring keys that are not class parameters."""
        return cls(**{k: v for k, v in env.items() if k in inspect.signature(cls).parameters})

    def to_dict(self) -> dict[str, Any]:
        """Convert the Session to a dictionary representation."""
        return asdict(self)

```

#### `from_dict(env)`

Initialize a Session from a dictionary, ignoring keys that are not class parameters.

Source code in `strands/types/session.py`

```
@classmethod
def from_dict(cls, env: dict[str, Any]) -> "Session":
    """Initialize a Session from a dictionary, ignoring keys that are not class parameters."""
    return cls(**{k: v for k, v in env.items() if k in inspect.signature(cls).parameters})

```

#### `to_dict()`

Convert the Session to a dictionary representation.

Source code in `strands/types/session.py`

```
def to_dict(self) -> dict[str, Any]:
    """Convert the Session to a dictionary representation."""
    return asdict(self)

```

### `SessionAgent`

Agent that belongs to a Session.

Source code in `strands/types/session.py`

```
@dataclass
class SessionAgent:
    """Agent that belongs to a Session."""

    agent_id: str
    state: Dict[str, Any]
    conversation_manager_state: Dict[str, Any]
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    @classmethod
    def from_agent(cls, agent: "Agent") -> "SessionAgent":
        """Convert an Agent to a SessionAgent."""
        if agent.agent_id is None:
            raise ValueError("agent_id needs to be defined.")
        return cls(
            agent_id=agent.agent_id,
            conversation_manager_state=agent.conversation_manager.get_state(),
            state=agent.state.get(),
        )

    @classmethod
    def from_dict(cls, env: dict[str, Any]) -> "SessionAgent":
        """Initialize a SessionAgent from a dictionary, ignoring keys that are not class parameters."""
        return cls(**{k: v for k, v in env.items() if k in inspect.signature(cls).parameters})

    def to_dict(self) -> dict[str, Any]:
        """Convert the SessionAgent to a dictionary representation."""
        return asdict(self)

```

#### `from_agent(agent)`

Convert an Agent to a SessionAgent.

Source code in `strands/types/session.py`

```
@classmethod
def from_agent(cls, agent: "Agent") -> "SessionAgent":
    """Convert an Agent to a SessionAgent."""
    if agent.agent_id is None:
        raise ValueError("agent_id needs to be defined.")
    return cls(
        agent_id=agent.agent_id,
        conversation_manager_state=agent.conversation_manager.get_state(),
        state=agent.state.get(),
    )

```

#### `from_dict(env)`

Initialize a SessionAgent from a dictionary, ignoring keys that are not class parameters.

Source code in `strands/types/session.py`

```
@classmethod
def from_dict(cls, env: dict[str, Any]) -> "SessionAgent":
    """Initialize a SessionAgent from a dictionary, ignoring keys that are not class parameters."""
    return cls(**{k: v for k, v in env.items() if k in inspect.signature(cls).parameters})

```

#### `to_dict()`

Convert the SessionAgent to a dictionary representation.

Source code in `strands/types/session.py`

```
def to_dict(self) -> dict[str, Any]:
    """Convert the SessionAgent to a dictionary representation."""
    return asdict(self)

```

### `SessionMessage`

Message within a SessionAgent.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `message` | `Message` | Message content | | `message_id` | `int` | Index of the message in the conversation history | | `redact_message` | `Optional[Message]` | If the original message is redacted, this is the new content to use | | `created_at` | `str` | ISO format timestamp for when this message was created | | `updated_at` | `str` | ISO format timestamp for when this message was last updated |

Source code in `strands/types/session.py`

```
@dataclass
class SessionMessage:
    """Message within a SessionAgent.

    Attributes:
        message: Message content
        message_id: Index of the message in the conversation history
        redact_message: If the original message is redacted, this is the new content to use
        created_at: ISO format timestamp for when this message was created
        updated_at: ISO format timestamp for when this message was last updated
    """

    message: Message
    message_id: int
    redact_message: Optional[Message] = None
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    @classmethod
    def from_message(cls, message: Message, index: int) -> "SessionMessage":
        """Convert from a Message, base64 encoding bytes values."""
        return cls(
            message=message,
            message_id=index,
            created_at=datetime.now(timezone.utc).isoformat(),
            updated_at=datetime.now(timezone.utc).isoformat(),
        )

    def to_message(self) -> Message:
        """Convert SessionMessage back to a Message, decoding any bytes values.

        If the message was redacted, return the redact content instead.
        """
        if self.redact_message is not None:
            return self.redact_message
        else:
            return self.message

    @classmethod
    def from_dict(cls, env: dict[str, Any]) -> "SessionMessage":
        """Initialize a SessionMessage from a dictionary, ignoring keys that are not class parameters."""
        extracted_relevant_parameters = {k: v for k, v in env.items() if k in inspect.signature(cls).parameters}
        return cls(**decode_bytes_values(extracted_relevant_parameters))

    def to_dict(self) -> dict[str, Any]:
        """Convert the SessionMessage to a dictionary representation."""
        return encode_bytes_values(asdict(self))  # type: ignore

```

#### `from_dict(env)`

Initialize a SessionMessage from a dictionary, ignoring keys that are not class parameters.

Source code in `strands/types/session.py`

```
@classmethod
def from_dict(cls, env: dict[str, Any]) -> "SessionMessage":
    """Initialize a SessionMessage from a dictionary, ignoring keys that are not class parameters."""
    extracted_relevant_parameters = {k: v for k, v in env.items() if k in inspect.signature(cls).parameters}
    return cls(**decode_bytes_values(extracted_relevant_parameters))

```

#### `from_message(message, index)`

Convert from a Message, base64 encoding bytes values.

Source code in `strands/types/session.py`

```
@classmethod
def from_message(cls, message: Message, index: int) -> "SessionMessage":
    """Convert from a Message, base64 encoding bytes values."""
    return cls(
        message=message,
        message_id=index,
        created_at=datetime.now(timezone.utc).isoformat(),
        updated_at=datetime.now(timezone.utc).isoformat(),
    )

```

#### `to_dict()`

Convert the SessionMessage to a dictionary representation.

Source code in `strands/types/session.py`

```
def to_dict(self) -> dict[str, Any]:
    """Convert the SessionMessage to a dictionary representation."""
    return encode_bytes_values(asdict(self))  # type: ignore

```

#### `to_message()`

Convert SessionMessage back to a Message, decoding any bytes values.

If the message was redacted, return the redact content instead.

Source code in `strands/types/session.py`

```
def to_message(self) -> Message:
    """Convert SessionMessage back to a Message, decoding any bytes values.

    If the message was redacted, return the redact content instead.
    """
    if self.redact_message is not None:
        return self.redact_message
    else:
        return self.message

```

### `SessionType`

Bases: `str`, `Enum`

Enumeration of session types.

As sessions are expanded to support new usecases like multi-agent patterns, new types will be added here.

Source code in `strands/types/session.py`

```
class SessionType(str, Enum):
    """Enumeration of session types.

    As sessions are expanded to support new usecases like multi-agent patterns,
    new types will be added here.
    """

    AGENT = "AGENT"

```

### `decode_bytes_values(obj)`

Recursively decode any base64-encoded bytes values in an object.

Handles dictionaries, lists, and nested structures.

Source code in `strands/types/session.py`

```
def decode_bytes_values(obj: Any) -> Any:
    """Recursively decode any base64-encoded bytes values in an object.

    Handles dictionaries, lists, and nested structures.
    """
    if isinstance(obj, dict):
        if obj.get("__bytes_encoded__") is True and "data" in obj:
            return base64.b64decode(obj["data"])
        return {k: decode_bytes_values(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [decode_bytes_values(item) for item in obj]
    else:
        return obj

```

### `encode_bytes_values(obj)`

Recursively encode any bytes values in an object to base64.

Handles dictionaries, lists, and nested structures.

Source code in `strands/types/session.py`

```
def encode_bytes_values(obj: Any) -> Any:
    """Recursively encode any bytes values in an object to base64.

    Handles dictionaries, lists, and nested structures.
    """
    if isinstance(obj, bytes):
        return {"__bytes_encoded__": True, "data": base64.b64encode(obj).decode()}
    elif isinstance(obj, dict):
        return {k: encode_bytes_values(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [encode_bytes_values(item) for item in obj]
    else:
        return obj

```

## `strands.types.streaming`

Streaming-related type definitions for the SDK.

These types are modeled after the Bedrock API.

- Bedrock docs: https://docs.aws.amazon.com/bedrock/latest/APIReference/API_Types_Amazon_Bedrock_Runtime.html

### `ContentBlockDelta`

Bases: `TypedDict`

A block of content in a streaming response.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `reasoningContent` | `ReasoningContentBlockDelta` | Contains content regarding the reasoning that is carried out by the model. | | `text` | `str` | Text fragment being streamed. | | `toolUse` | `ContentBlockDeltaToolUse` | Tool use input fragment being streamed. |

Source code in `strands/types/streaming.py`

```
class ContentBlockDelta(TypedDict, total=False):
    """A block of content in a streaming response.

    Attributes:
        reasoningContent: Contains content regarding the reasoning that is carried out by the model.
        text: Text fragment being streamed.
        toolUse: Tool use input fragment being streamed.
    """

    reasoningContent: ReasoningContentBlockDelta
    text: str
    toolUse: ContentBlockDeltaToolUse

```

### `ContentBlockDeltaEvent`

Bases: `TypedDict`

Event containing a delta update for a content block in a streaming response.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `contentBlockIndex` | `Optional[int]` | Index of the content block within the message. This is optional to accommodate different model providers. | | `delta` | `ContentBlockDelta` | The incremental content update for the content block. |

Source code in `strands/types/streaming.py`

```
class ContentBlockDeltaEvent(TypedDict, total=False):
    """Event containing a delta update for a content block in a streaming response.

    Attributes:
        contentBlockIndex: Index of the content block within the message.
            This is optional to accommodate different model providers.
        delta: The incremental content update for the content block.
    """

    contentBlockIndex: Optional[int]
    delta: ContentBlockDelta

```

### `ContentBlockDeltaText`

Bases: `TypedDict`

Text content delta in a streaming response.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `text` | `str` | The text fragment being streamed. |

Source code in `strands/types/streaming.py`

```
class ContentBlockDeltaText(TypedDict):
    """Text content delta in a streaming response.

    Attributes:
        text: The text fragment being streamed.
    """

    text: str

```

### `ContentBlockDeltaToolUse`

Bases: `TypedDict`

Tool use input delta in a streaming response.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `input` | `str` | The tool input fragment being streamed. |

Source code in `strands/types/streaming.py`

```
class ContentBlockDeltaToolUse(TypedDict):
    """Tool use input delta in a streaming response.

    Attributes:
        input: The tool input fragment being streamed.
    """

    input: str

```

### `ContentBlockStartEvent`

Bases: `TypedDict`

Event signaling the start of a content block in a streaming response.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `contentBlockIndex` | `Optional[int]` | Index of the content block within the message. This is optional to accommodate different model providers. | | `start` | `ContentBlockStart` | Information about the content block being started. |

Source code in `strands/types/streaming.py`

```
class ContentBlockStartEvent(TypedDict, total=False):
    """Event signaling the start of a content block in a streaming response.

    Attributes:
        contentBlockIndex: Index of the content block within the message.
            This is optional to accommodate different model providers.
        start: Information about the content block being started.
    """

    contentBlockIndex: Optional[int]
    start: ContentBlockStart

```

### `ContentBlockStopEvent`

Bases: `TypedDict`

Event signaling the end of a content block in a streaming response.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `contentBlockIndex` | `Optional[int]` | Index of the content block within the message. This is optional to accommodate different model providers. |

Source code in `strands/types/streaming.py`

```
class ContentBlockStopEvent(TypedDict, total=False):
    """Event signaling the end of a content block in a streaming response.

    Attributes:
        contentBlockIndex: Index of the content block within the message.
            This is optional to accommodate different model providers.
    """

    contentBlockIndex: Optional[int]

```

### `ExceptionEvent`

Bases: `TypedDict`

Base event for exceptions in a streaming response.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `message` | `str` | The error message describing what went wrong. |

Source code in `strands/types/streaming.py`

```
class ExceptionEvent(TypedDict):
    """Base event for exceptions in a streaming response.

    Attributes:
        message: The error message describing what went wrong.
    """

    message: str

```

### `MessageStartEvent`

Bases: `TypedDict`

Event signaling the start of a message in a streaming response.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `role` | `Role` | The role of the message sender (e.g., "assistant", "user"). |

Source code in `strands/types/streaming.py`

```
class MessageStartEvent(TypedDict):
    """Event signaling the start of a message in a streaming response.

    Attributes:
        role: The role of the message sender (e.g., "assistant", "user").
    """

    role: Role

```

### `MessageStopEvent`

Bases: `TypedDict`

Event signaling the end of a message in a streaming response.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `additionalModelResponseFields` | `Optional[Union[dict, list, int, float, str, bool, None]]` | Additional fields to include in model response. | | `stopReason` | `StopReason` | The reason why the model stopped generating content. |

Source code in `strands/types/streaming.py`

```
class MessageStopEvent(TypedDict, total=False):
    """Event signaling the end of a message in a streaming response.

    Attributes:
        additionalModelResponseFields: Additional fields to include in model response.
        stopReason: The reason why the model stopped generating content.
    """

    additionalModelResponseFields: Optional[Union[dict, list, int, float, str, bool, None]]
    stopReason: StopReason

```

### `MetadataEvent`

Bases: `TypedDict`

Event containing metadata about the streaming response.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `metrics` | `Metrics` | Performance metrics related to the model invocation. | | `trace` | `Optional[Trace]` | Trace information for debugging and monitoring. | | `usage` | `Usage` | Resource usage information for the model invocation. |

Source code in `strands/types/streaming.py`

```
class MetadataEvent(TypedDict, total=False):
    """Event containing metadata about the streaming response.

    Attributes:
        metrics: Performance metrics related to the model invocation.
        trace: Trace information for debugging and monitoring.
        usage: Resource usage information for the model invocation.
    """

    metrics: Metrics
    trace: Optional[Trace]
    usage: Usage

```

### `ModelStreamErrorEvent`

Bases: `ExceptionEvent`

Event for model streaming errors.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `originalMessage` | `str` | The original error message from the model provider. | | `originalStatusCode` | `int` | The HTTP status code returned by the model provider. |

Source code in `strands/types/streaming.py`

```
class ModelStreamErrorEvent(ExceptionEvent):
    """Event for model streaming errors.

    Attributes:
        originalMessage: The original error message from the model provider.
        originalStatusCode: The HTTP status code returned by the model provider.
    """

    originalMessage: str
    originalStatusCode: int

```

### `ReasoningContentBlockDelta`

Bases: `TypedDict`

Delta for reasoning content block in a streaming response.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `redactedContent` | `Optional[bytes]` | The content in the reasoning that was encrypted by the model provider for safety reasons. | | `signature` | `Optional[str]` | A token that verifies that the reasoning text was generated by the model. | | `text` | `Optional[str]` | The reasoning that the model used to return the output. |

Source code in `strands/types/streaming.py`

```
class ReasoningContentBlockDelta(TypedDict, total=False):
    """Delta for reasoning content block in a streaming response.

    Attributes:
        redactedContent: The content in the reasoning that was encrypted by the model provider for safety reasons.
        signature: A token that verifies that the reasoning text was generated by the model.
        text: The reasoning that the model used to return the output.
    """

    redactedContent: Optional[bytes]
    signature: Optional[str]
    text: Optional[str]

```

### `RedactContentEvent`

Bases: `TypedDict`

Event for redacting content.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `redactUserContentMessage` | `Optional[str]` | The string to overwrite the users input with. | | `redactAssistantContentMessage` | `Optional[str]` | The string to overwrite the assistants output with. |

Source code in `strands/types/streaming.py`

```
class RedactContentEvent(TypedDict, total=False):
    """Event for redacting content.

    Attributes:
        redactUserContentMessage: The string to overwrite the users input with.
        redactAssistantContentMessage: The string to overwrite the assistants output with.

    """

    redactUserContentMessage: Optional[str]
    redactAssistantContentMessage: Optional[str]

```

### `StreamEvent`

Bases: `TypedDict`

The messages output stream.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `contentBlockDelta` | `ContentBlockDeltaEvent` | Delta content for a content block. | | `contentBlockStart` | `ContentBlockStartEvent` | Start of a content block. | | `contentBlockStop` | `ContentBlockStopEvent` | End of a content block. | | `internalServerException` | `ExceptionEvent` | Internal server error information. | | `messageStart` | `MessageStartEvent` | Start of a message. | | `messageStop` | `MessageStopEvent` | End of a message. | | `metadata` | `MetadataEvent` | Metadata about the streaming response. | | `modelStreamErrorException` | `ModelStreamErrorEvent` | Model streaming error information. | | `serviceUnavailableException` | `ExceptionEvent` | Service unavailable error information. | | `throttlingException` | `ExceptionEvent` | Throttling error information. | | `validationException` | `ExceptionEvent` | Validation error information. |

Source code in `strands/types/streaming.py`

```
class StreamEvent(TypedDict, total=False):
    """The messages output stream.

    Attributes:
        contentBlockDelta: Delta content for a content block.
        contentBlockStart: Start of a content block.
        contentBlockStop: End of a content block.
        internalServerException: Internal server error information.
        messageStart: Start of a message.
        messageStop: End of a message.
        metadata: Metadata about the streaming response.
        modelStreamErrorException: Model streaming error information.
        serviceUnavailableException: Service unavailable error information.
        throttlingException: Throttling error information.
        validationException: Validation error information.
    """

    contentBlockDelta: ContentBlockDeltaEvent
    contentBlockStart: ContentBlockStartEvent
    contentBlockStop: ContentBlockStopEvent
    internalServerException: ExceptionEvent
    messageStart: MessageStartEvent
    messageStop: MessageStopEvent
    metadata: MetadataEvent
    redactContent: RedactContentEvent
    modelStreamErrorException: ModelStreamErrorEvent
    serviceUnavailableException: ExceptionEvent
    throttlingException: ExceptionEvent
    validationException: ExceptionEvent

```

## `strands.types.tools`

Tool-related type definitions for the SDK.

These types are modeled after the Bedrock API.

- Bedrock docs: https://docs.aws.amazon.com/bedrock/latest/APIReference/API_Types_Amazon_Bedrock_Runtime.html

### `JSONSchema = dict`

Type alias for JSON Schema dictionaries.

### `RunToolHandler = Callable[[ToolUse], AsyncGenerator[dict[str, Any], None]]`

Callback that runs a single tool and streams back results.

### `ToolChoice = Union[dict[Literal['auto'], ToolChoiceAuto], dict[Literal['any'], ToolChoiceAny], dict[Literal['tool'], ToolChoiceTool]]`

Configuration for how the model should choose tools.

- "auto": The model decides whether to use tools based on the context
- "any": The model must use at least one tool (any tool)
- "tool": The model must use the specified tool

### `ToolGenerator = AsyncGenerator[Any, None]`

Generator of tool events with the last being the tool result.

### `ToolResultStatus = Literal['success', 'error']`

Status of a tool execution result.

### `AgentTool`

Bases: `ABC`

Abstract base class for all SDK tools.

This class defines the interface that all tool implementations must follow. Each tool must provide its name, specification, and implement a stream method that executes the tool's functionality.

Source code in `strands/types/tools.py`

```
class AgentTool(ABC):
    """Abstract base class for all SDK tools.

    This class defines the interface that all tool implementations must follow. Each tool must provide its name,
    specification, and implement a stream method that executes the tool's functionality.
    """

    _is_dynamic: bool

    def __init__(self) -> None:
        """Initialize the base agent tool with default dynamic state."""
        self._is_dynamic = False

    @property
    @abstractmethod
    # pragma: no cover
    def tool_name(self) -> str:
        """The unique name of the tool used for identification and invocation."""
        pass

    @property
    @abstractmethod
    # pragma: no cover
    def tool_spec(self) -> ToolSpec:
        """Tool specification that describes its functionality and parameters."""
        pass

    @property
    @abstractmethod
    # pragma: no cover
    def tool_type(self) -> str:
        """The type of the tool implementation (e.g., 'python', 'javascript', 'lambda').

        Used for categorization and appropriate handling.
        """
        pass

    @property
    def supports_hot_reload(self) -> bool:
        """Whether the tool supports automatic reloading when modified.

        Returns:
            False by default.
        """
        return False

    @abstractmethod
    # pragma: no cover
    def stream(self, tool_use: ToolUse, invocation_state: dict[str, Any], **kwargs: Any) -> ToolGenerator:
        """Stream tool events and return the final result.

        Args:
            tool_use: The tool use request containing tool ID and parameters.
            invocation_state: Context for the tool invocation, including agent state.
            **kwargs: Additional keyword arguments for future extensibility.

        Yields:
            Tool events with the last being the tool result.
        """
        ...

    @property
    def is_dynamic(self) -> bool:
        """Whether the tool was dynamically loaded during runtime.

        Dynamic tools may have different lifecycle management.

        Returns:
            True if loaded dynamically, False otherwise.
        """
        return self._is_dynamic

    def mark_dynamic(self) -> None:
        """Mark this tool as dynamically loaded."""
        self._is_dynamic = True

    def get_display_properties(self) -> dict[str, str]:
        """Get properties to display in UI representations of this tool.

        Subclasses can extend this to include additional properties.

        Returns:
            Dictionary of property names and their string values.
        """
        return {
            "Name": self.tool_name,
            "Type": self.tool_type,
        }

```

#### `is_dynamic`

Whether the tool was dynamically loaded during runtime.

Dynamic tools may have different lifecycle management.

Returns:

| Type | Description | | --- | --- | | `bool` | True if loaded dynamically, False otherwise. |

#### `supports_hot_reload`

Whether the tool supports automatic reloading when modified.

Returns:

| Type | Description | | --- | --- | | `bool` | False by default. |

#### `tool_name`

The unique name of the tool used for identification and invocation.

#### `tool_spec`

Tool specification that describes its functionality and parameters.

#### `tool_type`

The type of the tool implementation (e.g., 'python', 'javascript', 'lambda').

Used for categorization and appropriate handling.

#### `__init__()`

Initialize the base agent tool with default dynamic state.

Source code in `strands/types/tools.py`

```
def __init__(self) -> None:
    """Initialize the base agent tool with default dynamic state."""
    self._is_dynamic = False

```

#### `get_display_properties()`

Get properties to display in UI representations of this tool.

Subclasses can extend this to include additional properties.

Returns:

| Type | Description | | --- | --- | | `dict[str, str]` | Dictionary of property names and their string values. |

Source code in `strands/types/tools.py`

```
def get_display_properties(self) -> dict[str, str]:
    """Get properties to display in UI representations of this tool.

    Subclasses can extend this to include additional properties.

    Returns:
        Dictionary of property names and their string values.
    """
    return {
        "Name": self.tool_name,
        "Type": self.tool_type,
    }

```

#### `mark_dynamic()`

Mark this tool as dynamically loaded.

Source code in `strands/types/tools.py`

```
def mark_dynamic(self) -> None:
    """Mark this tool as dynamically loaded."""
    self._is_dynamic = True

```

#### `stream(tool_use, invocation_state, **kwargs)`

Stream tool events and return the final result.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_use` | `ToolUse` | The tool use request containing tool ID and parameters. | *required* | | `invocation_state` | `dict[str, Any]` | Context for the tool invocation, including agent state. | *required* | | `**kwargs` | `Any` | Additional keyword arguments for future extensibility. | `{}` |

Yields:

| Type | Description | | --- | --- | | `ToolGenerator` | Tool events with the last being the tool result. |

Source code in `strands/types/tools.py`

```
@abstractmethod
# pragma: no cover
def stream(self, tool_use: ToolUse, invocation_state: dict[str, Any], **kwargs: Any) -> ToolGenerator:
    """Stream tool events and return the final result.

    Args:
        tool_use: The tool use request containing tool ID and parameters.
        invocation_state: Context for the tool invocation, including agent state.
        **kwargs: Additional keyword arguments for future extensibility.

    Yields:
        Tool events with the last being the tool result.
    """
    ...

```

### `Tool`

Bases: `TypedDict`

A tool that can be provided to a model.

This type wraps a tool specification for inclusion in a model request.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `toolSpec` | `ToolSpec` | The specification of the tool. |

Source code in `strands/types/tools.py`

```
class Tool(TypedDict):
    """A tool that can be provided to a model.

    This type wraps a tool specification for inclusion in a model request.

    Attributes:
        toolSpec: The specification of the tool.
    """

    toolSpec: ToolSpec

```

### `ToolChoiceAny`

Bases: `TypedDict`

Configuration indicating that the model must request at least one tool.

Source code in `strands/types/tools.py`

```
class ToolChoiceAny(TypedDict):
    """Configuration indicating that the model must request at least one tool."""

    pass

```

### `ToolChoiceAuto`

Bases: `TypedDict`

Configuration for automatic tool selection.

This represents the configuration for automatic tool selection, where the model decides whether and which tool to use based on the context.

Source code in `strands/types/tools.py`

```
class ToolChoiceAuto(TypedDict):
    """Configuration for automatic tool selection.

    This represents the configuration for automatic tool selection, where the model decides whether and which tool to
    use based on the context.
    """

    pass

```

### `ToolChoiceTool`

Bases: `TypedDict`

Configuration for forcing the use of a specific tool.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `name` | `str` | The name of the tool that the model must use. |

Source code in `strands/types/tools.py`

```
class ToolChoiceTool(TypedDict):
    """Configuration for forcing the use of a specific tool.

    Attributes:
        name: The name of the tool that the model must use.
    """

    name: str

```

### `ToolConfig`

Bases: `TypedDict`

Configuration for tools in a model request.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `tools` | `list[Tool]` | List of tools available to the model. | | `toolChoice` | `ToolChoice` | Configuration for how the model should choose tools. |

Source code in `strands/types/tools.py`

```
class ToolConfig(TypedDict):
    """Configuration for tools in a model request.

    Attributes:
        tools: List of tools available to the model.
        toolChoice: Configuration for how the model should choose tools.
    """

    tools: list[Tool]
    toolChoice: ToolChoice

```

### `ToolFunc`

Bases: `Protocol`

Function signature for Python decorated and module based tools.

Source code in `strands/types/tools.py`

```
class ToolFunc(Protocol):
    """Function signature for Python decorated and module based tools."""

    __name__: str

    def __call__(
        self, *args: Any, **kwargs: Any
    ) -> Union[
        ToolResult,
        Awaitable[ToolResult],
    ]:
        """Function signature for Python decorated and module based tools.

        Returns:
            Tool result or awaitable tool result.
        """
        ...

```

#### `__call__(*args, **kwargs)`

Function signature for Python decorated and module based tools.

Returns:

| Type | Description | | --- | --- | | `Union[ToolResult, Awaitable[ToolResult]]` | Tool result or awaitable tool result. |

Source code in `strands/types/tools.py`

```
def __call__(
    self, *args: Any, **kwargs: Any
) -> Union[
    ToolResult,
    Awaitable[ToolResult],
]:
    """Function signature for Python decorated and module based tools.

    Returns:
        Tool result or awaitable tool result.
    """
    ...

```

### `ToolResult`

Bases: `TypedDict`

Result of a tool execution.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `content` | `list[ToolResultContent]` | List of result content returned by the tool. | | `status` | `ToolResultStatus` | The status of the tool execution ("success" or "error"). | | `toolUseId` | `str` | The unique identifier of the tool use request that produced this result. |

Source code in `strands/types/tools.py`

```
class ToolResult(TypedDict):
    """Result of a tool execution.

    Attributes:
        content: List of result content returned by the tool.
        status: The status of the tool execution ("success" or "error").
        toolUseId: The unique identifier of the tool use request that produced this result.
    """

    content: list[ToolResultContent]
    status: ToolResultStatus
    toolUseId: str

```

### `ToolResultContent`

Bases: `TypedDict`

Content returned by a tool execution.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `document` | `DocumentContent` | Document content returned by the tool. | | `image` | `ImageContent` | Image content returned by the tool. | | `json` | `Any` | JSON-serializable data returned by the tool. | | `text` | `str` | Text content returned by the tool. |

Source code in `strands/types/tools.py`

```
class ToolResultContent(TypedDict, total=False):
    """Content returned by a tool execution.

    Attributes:
        document: Document content returned by the tool.
        image: Image content returned by the tool.
        json: JSON-serializable data returned by the tool.
        text: Text content returned by the tool.
    """

    document: DocumentContent
    image: ImageContent
    json: Any
    text: str

```

### `ToolSpec`

Bases: `TypedDict`

Specification for a tool that can be used by an agent.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `description` | `str` | A human-readable description of what the tool does. | | `inputSchema` | `JSONSchema` | JSON Schema defining the expected input parameters. | | `name` | `str` | The unique name of the tool. |

Source code in `strands/types/tools.py`

```
class ToolSpec(TypedDict):
    """Specification for a tool that can be used by an agent.

    Attributes:
        description: A human-readable description of what the tool does.
        inputSchema: JSON Schema defining the expected input parameters.
        name: The unique name of the tool.
    """

    description: str
    inputSchema: JSONSchema
    name: str

```

### `ToolUse`

Bases: `TypedDict`

A request from the model to use a specific tool with the provided input.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `input` | `Any` | The input parameters for the tool. Can be any JSON-serializable type. | | `name` | `str` | The name of the tool to invoke. | | `toolUseId` | `str` | A unique identifier for this specific tool use request. |

Source code in `strands/types/tools.py`

```
class ToolUse(TypedDict):
    """A request from the model to use a specific tool with the provided input.

    Attributes:
        input: The input parameters for the tool.
            Can be any JSON-serializable type.
        name: The name of the tool to invoke.
        toolUseId: A unique identifier for this specific tool use request.
    """

    input: Any
    name: str
    toolUseId: str

```

## `strands.types.traces`

Tracing type definitions for the SDK.
