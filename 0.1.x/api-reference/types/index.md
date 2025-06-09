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

### `Future`

Bases: `Protocol`

Interface representing the result of an asynchronous computation.

Source code in `strands/types/event_loop.py`

```
@runtime_checkable
class Future(Protocol):
    """Interface representing the result of an asynchronous computation."""

    def result(self, timeout: Optional[int] = None) -> Any:
        """Return the result of the call that the future represents.

        This method will block until the asynchronous operation completes or until the specified timeout is reached.

        Args:
            timeout: The number of seconds to wait for the result.
                If None, then there is no limit on the wait time.

        Returns:
            Any: The result of the asynchronous operation.
        """

```

#### `result(timeout=None)`

Return the result of the call that the future represents.

This method will block until the asynchronous operation completes or until the specified timeout is reached.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `timeout` | `Optional[int]` | The number of seconds to wait for the result. If None, then there is no limit on the wait time. | `None` |

Returns:

| Name | Type | Description | | --- | --- | --- | | `Any` | `Any` | The result of the asynchronous operation. |

Source code in `strands/types/event_loop.py`

```
def result(self, timeout: Optional[int] = None) -> Any:
    """Return the result of the call that the future represents.

    This method will block until the asynchronous operation completes or until the specified timeout is reached.

    Args:
        timeout: The number of seconds to wait for the result.
            If None, then there is no limit on the wait time.

    Returns:
        Any: The result of the asynchronous operation.
    """

```

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

### `ParallelToolExecutorInterface`

Bases: `Protocol`

Interface for parallel tool execution.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `timeout` | `int` | Default timeout in seconds for futures. |

Source code in `strands/types/event_loop.py`

```
@runtime_checkable
class ParallelToolExecutorInterface(Protocol):
    """Interface for parallel tool execution.

    Attributes:
        timeout: Default timeout in seconds for futures.
    """

    timeout: int = 900  # default 15 minute timeout for futures

    def submit(self, fn: Callable[..., Any], /, *args: Any, **kwargs: Any) -> Future:
        """Submit a callable to be executed with the given arguments.

        Schedules the callable to be executed as fn(*args, **kwargs) and returns a Future instance representing the
        execution of the callable.

        Args:
            fn: The callable to execute.
            *args: Positional arguments to pass to the callable.
            **kwargs: Keyword arguments to pass to the callable.

        Returns:
            Future: A Future representing the given call.
        """

    def as_completed(self, futures: Iterable[Future], timeout: Optional[int] = timeout) -> Iterator[Future]:
        """Iterate over the given futures, yielding each as it completes.

        Args:
            futures: The sequence of Futures to iterate over.
            timeout: The maximum number of seconds to wait.
                If None, then there is no limit on the wait time.

        Returns:
            An iterator that yields the given Futures as they complete (finished or cancelled).
        """

    def shutdown(self, wait: bool = True) -> None:
        """Shutdown the executor and free associated resources.

        Args:
            wait: If True, shutdown will not return until all running futures have finished executing.
        """

```

#### `as_completed(futures, timeout=timeout)`

Iterate over the given futures, yielding each as it completes.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `futures` | `Iterable[Future]` | The sequence of Futures to iterate over. | *required* | | `timeout` | `Optional[int]` | The maximum number of seconds to wait. If None, then there is no limit on the wait time. | `timeout` |

Returns:

| Type | Description | | --- | --- | | `Iterator[Future]` | An iterator that yields the given Futures as they complete (finished or cancelled). |

Source code in `strands/types/event_loop.py`

```
def as_completed(self, futures: Iterable[Future], timeout: Optional[int] = timeout) -> Iterator[Future]:
    """Iterate over the given futures, yielding each as it completes.

    Args:
        futures: The sequence of Futures to iterate over.
        timeout: The maximum number of seconds to wait.
            If None, then there is no limit on the wait time.

    Returns:
        An iterator that yields the given Futures as they complete (finished or cancelled).
    """

```

#### `shutdown(wait=True)`

Shutdown the executor and free associated resources.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `wait` | `bool` | If True, shutdown will not return until all running futures have finished executing. | `True` |

Source code in `strands/types/event_loop.py`

```
def shutdown(self, wait: bool = True) -> None:
    """Shutdown the executor and free associated resources.

    Args:
        wait: If True, shutdown will not return until all running futures have finished executing.
    """

```

#### `submit(fn, /, *args, **kwargs)`

Submit a callable to be executed with the given arguments.

Schedules the callable to be executed as fn(*args,* \*kwargs) and returns a Future instance representing the execution of the callable.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `fn` | `Callable[..., Any]` | The callable to execute. | *required* | | `*args` | `Any` | Positional arguments to pass to the callable. | `()` | | `**kwargs` | `Any` | Keyword arguments to pass to the callable. | `{}` |

Returns:

| Name | Type | Description | | --- | --- | --- | | `Future` | `Future` | A Future representing the given call. |

Source code in `strands/types/event_loop.py`

```
def submit(self, fn: Callable[..., Any], /, *args: Any, **kwargs: Any) -> Future:
    """Submit a callable to be executed with the given arguments.

    Schedules the callable to be executed as fn(*args, **kwargs) and returns a Future instance representing the
    execution of the callable.

    Args:
        fn: The callable to execute.
        *args: Positional arguments to pass to the callable.
        **kwargs: Keyword arguments to pass to the callable.

    Returns:
        Future: A Future representing the given call.
    """

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

## `strands.types.models`

Model-related type definitions for the SDK.

### `Model`

Bases: `ABC`

Abstract base class for AI model implementations.

This class defines the interface for all model implementations in the Strands Agents SDK. It provides a standardized way to configure, format, and process requests for different AI model providers.

Source code in `strands/types/models/model.py`

```
class Model(abc.ABC):
    """Abstract base class for AI model implementations.

    This class defines the interface for all model implementations in the Strands Agents SDK. It provides a
    standardized way to configure, format, and process requests for different AI model providers.
    """

    @abc.abstractmethod
    # pragma: no cover
    def update_config(self, **model_config: Any) -> None:
        """Update the model configuration with the provided arguments.

        Args:
            **model_config: Configuration overrides.
        """
        pass

    @abc.abstractmethod
    # pragma: no cover
    def get_config(self) -> Any:
        """Return the model configuration.

        Returns:
            The model's configuration.
        """
        pass

    @abc.abstractmethod
    # pragma: no cover
    def format_request(
        self, messages: Messages, tool_specs: Optional[list[ToolSpec]] = None, system_prompt: Optional[str] = None
    ) -> Any:
        """Format a streaming request to the underlying model.

        Args:
            messages: List of message objects to be processed by the model.
            tool_specs: List of tool specifications to make available to the model.
            system_prompt: System prompt to provide context to the model.

        Returns:
            The formatted request.
        """
        pass

    @abc.abstractmethod
    # pragma: no cover
    def format_chunk(self, event: Any) -> StreamEvent:
        """Format the model response events into standardized message chunks.

        Args:
            event: A response event from the model.

        Returns:
            The formatted chunk.
        """
        pass

    @abc.abstractmethod
    # pragma: no cover
    def stream(self, request: Any) -> Iterable[Any]:
        """Send the request to the model and get a streaming response.

        Args:
            request: The formatted request to send to the model.

        Returns:
            The model's response.

        Raises:
            ModelThrottledException: When the model service is throttling requests from the client.
        """
        pass

    def converse(
        self, messages: Messages, tool_specs: Optional[list[ToolSpec]] = None, system_prompt: Optional[str] = None
    ) -> Iterable[StreamEvent]:
        """Converse with the model.

        This method handles the full lifecycle of conversing with the model:
        1. Format the messages, tool specs, and configuration into a streaming request
        2. Send the request to the model
        3. Yield the formatted message chunks

        Args:
            messages: List of message objects to be processed by the model.
            tool_specs: List of tool specifications to make available to the model.
            system_prompt: System prompt to provide context to the model.

        Yields:
            Formatted message chunks from the model.

        Raises:
            ModelThrottledException: When the model service is throttling requests from the client.
        """
        logger.debug("formatting request")
        request = self.format_request(messages, tool_specs, system_prompt)

        logger.debug("invoking model")
        response = self.stream(request)

        logger.debug("got response from model")
        for event in response:
            yield self.format_chunk(event)

        logger.debug("finished streaming response from model")

```

#### `converse(messages, tool_specs=None, system_prompt=None)`

Converse with the model.

This method handles the full lifecycle of conversing with the model:

1. Format the messages, tool specs, and configuration into a streaming request
1. Send the request to the model
1. Yield the formatted message chunks

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `messages` | `Messages` | List of message objects to be processed by the model. | *required* | | `tool_specs` | `Optional[list[ToolSpec]]` | List of tool specifications to make available to the model. | `None` | | `system_prompt` | `Optional[str]` | System prompt to provide context to the model. | `None` |

Yields:

| Type | Description | | --- | --- | | `Iterable[StreamEvent]` | Formatted message chunks from the model. |

Raises:

| Type | Description | | --- | --- | | `ModelThrottledException` | When the model service is throttling requests from the client. |

Source code in `strands/types/models/model.py`

```
def converse(
    self, messages: Messages, tool_specs: Optional[list[ToolSpec]] = None, system_prompt: Optional[str] = None
) -> Iterable[StreamEvent]:
    """Converse with the model.

    This method handles the full lifecycle of conversing with the model:
    1. Format the messages, tool specs, and configuration into a streaming request
    2. Send the request to the model
    3. Yield the formatted message chunks

    Args:
        messages: List of message objects to be processed by the model.
        tool_specs: List of tool specifications to make available to the model.
        system_prompt: System prompt to provide context to the model.

    Yields:
        Formatted message chunks from the model.

    Raises:
        ModelThrottledException: When the model service is throttling requests from the client.
    """
    logger.debug("formatting request")
    request = self.format_request(messages, tool_specs, system_prompt)

    logger.debug("invoking model")
    response = self.stream(request)

    logger.debug("got response from model")
    for event in response:
        yield self.format_chunk(event)

    logger.debug("finished streaming response from model")

```

#### `format_chunk(event)`

Format the model response events into standardized message chunks.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `Any` | A response event from the model. | *required* |

Returns:

| Type | Description | | --- | --- | | `StreamEvent` | The formatted chunk. |

Source code in `strands/types/models/model.py`

```
@abc.abstractmethod
# pragma: no cover
def format_chunk(self, event: Any) -> StreamEvent:
    """Format the model response events into standardized message chunks.

    Args:
        event: A response event from the model.

    Returns:
        The formatted chunk.
    """
    pass

```

#### `format_request(messages, tool_specs=None, system_prompt=None)`

Format a streaming request to the underlying model.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `messages` | `Messages` | List of message objects to be processed by the model. | *required* | | `tool_specs` | `Optional[list[ToolSpec]]` | List of tool specifications to make available to the model. | `None` | | `system_prompt` | `Optional[str]` | System prompt to provide context to the model. | `None` |

Returns:

| Type | Description | | --- | --- | | `Any` | The formatted request. |

Source code in `strands/types/models/model.py`

```
@abc.abstractmethod
# pragma: no cover
def format_request(
    self, messages: Messages, tool_specs: Optional[list[ToolSpec]] = None, system_prompt: Optional[str] = None
) -> Any:
    """Format a streaming request to the underlying model.

    Args:
        messages: List of message objects to be processed by the model.
        tool_specs: List of tool specifications to make available to the model.
        system_prompt: System prompt to provide context to the model.

    Returns:
        The formatted request.
    """
    pass

```

#### `get_config()`

Return the model configuration.

Returns:

| Type | Description | | --- | --- | | `Any` | The model's configuration. |

Source code in `strands/types/models/model.py`

```
@abc.abstractmethod
# pragma: no cover
def get_config(self) -> Any:
    """Return the model configuration.

    Returns:
        The model's configuration.
    """
    pass

```

#### `stream(request)`

Send the request to the model and get a streaming response.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `request` | `Any` | The formatted request to send to the model. | *required* |

Returns:

| Type | Description | | --- | --- | | `Iterable[Any]` | The model's response. |

Raises:

| Type | Description | | --- | --- | | `ModelThrottledException` | When the model service is throttling requests from the client. |

Source code in `strands/types/models/model.py`

```
@abc.abstractmethod
# pragma: no cover
def stream(self, request: Any) -> Iterable[Any]:
    """Send the request to the model and get a streaming response.

    Args:
        request: The formatted request to send to the model.

    Returns:
        The model's response.

    Raises:
        ModelThrottledException: When the model service is throttling requests from the client.
    """
    pass

```

#### `update_config(**model_config)`

Update the model configuration with the provided arguments.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `**model_config` | `Any` | Configuration overrides. | `{}` |

Source code in `strands/types/models/model.py`

```
@abc.abstractmethod
# pragma: no cover
def update_config(self, **model_config: Any) -> None:
    """Update the model configuration with the provided arguments.

    Args:
        **model_config: Configuration overrides.
    """
    pass

```

### `OpenAIModel`

Bases: `Model`, `ABC`

Base OpenAI model provider implementation.

Implements shared logic for formatting requests and responses to and from the OpenAI specification.

Source code in `strands/types/models/openai.py`

```
class OpenAIModel(Model, abc.ABC):
    """Base OpenAI model provider implementation.

    Implements shared logic for formatting requests and responses to and from the OpenAI specification.
    """

    config: dict[str, Any]

    @classmethod
    def format_request_message_content(cls, content: ContentBlock) -> dict[str, Any]:
        """Format an OpenAI compatible content block.

        Args:
            content: Message content.

        Returns:
            OpenAI compatible content block.

        Raises:
            TypeError: If the content block type cannot be converted to an OpenAI-compatible format.
        """
        if "document" in content:
            mime_type = mimetypes.types_map.get(f".{content['document']['format']}", "application/octet-stream")
            file_data = base64.b64encode(content["document"]["source"]["bytes"]).decode("utf-8")
            return {
                "file": {
                    "file_data": f"data:{mime_type};base64,{file_data}",
                    "filename": content["document"]["name"],
                },
                "type": "file",
            }

        if "image" in content:
            mime_type = mimetypes.types_map.get(f".{content['image']['format']}", "application/octet-stream")
            image_data = content["image"]["source"]["bytes"].decode("utf-8")
            return {
                "image_url": {
                    "detail": "auto",
                    "format": mime_type,
                    "url": f"data:{mime_type};base64,{image_data}",
                },
                "type": "image_url",
            }

        if "text" in content:
            return {"text": content["text"], "type": "text"}

        raise TypeError(f"content_type=<{next(iter(content))}> | unsupported type")

    @classmethod
    def format_request_message_tool_call(cls, tool_use: ToolUse) -> dict[str, Any]:
        """Format an OpenAI compatible tool call.

        Args:
            tool_use: Tool use requested by the model.

        Returns:
            OpenAI compatible tool call.
        """
        return {
            "function": {
                "arguments": json.dumps(tool_use["input"]),
                "name": tool_use["name"],
            },
            "id": tool_use["toolUseId"],
            "type": "function",
        }

    @classmethod
    def format_request_tool_message(cls, tool_result: ToolResult) -> dict[str, Any]:
        """Format an OpenAI compatible tool message.

        Args:
            tool_result: Tool result collected from a tool execution.

        Returns:
            OpenAI compatible tool message.
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
            "content": [cls.format_request_message_content(content) for content in contents],
        }

    @classmethod
    def format_request_messages(cls, messages: Messages, system_prompt: Optional[str] = None) -> list[dict[str, Any]]:
        """Format an OpenAI compatible messages array.

        Args:
            messages: List of message objects to be processed by the model.
            system_prompt: System prompt to provide context to the model.

        Returns:
            An OpenAI compatible messages array.
        """
        formatted_messages: list[dict[str, Any]]
        formatted_messages = [{"role": "system", "content": system_prompt}] if system_prompt else []

        for message in messages:
            contents = message["content"]

            formatted_contents = [
                cls.format_request_message_content(content)
                for content in contents
                if not any(block_type in content for block_type in ["toolResult", "toolUse"])
            ]
            formatted_tool_calls = [
                cls.format_request_message_tool_call(content["toolUse"]) for content in contents if "toolUse" in content
            ]
            formatted_tool_messages = [
                cls.format_request_tool_message(content["toolResult"])
                for content in contents
                if "toolResult" in content
            ]

            formatted_message = {
                "role": message["role"],
                "content": formatted_contents,
                **({"tool_calls": formatted_tool_calls} if formatted_tool_calls else {}),
            }
            formatted_messages.append(formatted_message)
            formatted_messages.extend(formatted_tool_messages)

        return [message for message in formatted_messages if message["content"] or "tool_calls" in message]

    @override
    def format_request(
        self, messages: Messages, tool_specs: Optional[list[ToolSpec]] = None, system_prompt: Optional[str] = None
    ) -> dict[str, Any]:
        """Format an OpenAI compatible chat streaming request.

        Args:
            messages: List of message objects to be processed by the model.
            tool_specs: List of tool specifications to make available to the model.
            system_prompt: System prompt to provide context to the model.

        Returns:
            An OpenAI compatible chat streaming request.

        Raises:
            TypeError: If a message contains a content block type that cannot be converted to an OpenAI-compatible
                format.
        """
        return {
            "messages": self.format_request_messages(messages, system_prompt),
            "model": self.config["model_id"],
            "stream": True,
            "stream_options": {"include_usage": True},
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
            **(self.config.get("params") or {}),
        }

    @override
    def format_chunk(self, event: dict[str, Any]) -> StreamEvent:
        """Format an OpenAI response event into a standardized message chunk.

        Args:
            event: A response event from the OpenAI compatible model.

        Returns:
            The formatted chunk.

        Raises:
            RuntimeError: If chunk_type is not recognized.
                This error should never be encountered as chunk_type is controlled in the stream method.
        """
        match event["chunk_type"]:
            case "message_start":
                return {"messageStart": {"role": "assistant"}}

            case "content_start":
                if event["data_type"] == "tool":
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

                return {"contentBlockStart": {"start": {}}}

            case "content_delta":
                if event["data_type"] == "tool":
                    return {
                        "contentBlockDelta": {"delta": {"toolUse": {"input": event["data"].function.arguments or ""}}}
                    }

                return {"contentBlockDelta": {"delta": {"text": event["data"]}}}

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
                return {
                    "metadata": {
                        "usage": {
                            "inputTokens": event["data"].prompt_tokens,
                            "outputTokens": event["data"].completion_tokens,
                            "totalTokens": event["data"].total_tokens,
                        },
                        "metrics": {
                            "latencyMs": 0,  # TODO
                        },
                    },
                }

            case _:
                raise RuntimeError(f"chunk_type=<{event['chunk_type']} | unknown type")

```

#### `format_chunk(event)`

Format an OpenAI response event into a standardized message chunk.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `event` | `dict[str, Any]` | A response event from the OpenAI compatible model. | *required* |

Returns:

| Type | Description | | --- | --- | | `StreamEvent` | The formatted chunk. |

Raises:

| Type | Description | | --- | --- | | `RuntimeError` | If chunk_type is not recognized. This error should never be encountered as chunk_type is controlled in the stream method. |

Source code in `strands/types/models/openai.py`

```
@override
def format_chunk(self, event: dict[str, Any]) -> StreamEvent:
    """Format an OpenAI response event into a standardized message chunk.

    Args:
        event: A response event from the OpenAI compatible model.

    Returns:
        The formatted chunk.

    Raises:
        RuntimeError: If chunk_type is not recognized.
            This error should never be encountered as chunk_type is controlled in the stream method.
    """
    match event["chunk_type"]:
        case "message_start":
            return {"messageStart": {"role": "assistant"}}

        case "content_start":
            if event["data_type"] == "tool":
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

            return {"contentBlockStart": {"start": {}}}

        case "content_delta":
            if event["data_type"] == "tool":
                return {
                    "contentBlockDelta": {"delta": {"toolUse": {"input": event["data"].function.arguments or ""}}}
                }

            return {"contentBlockDelta": {"delta": {"text": event["data"]}}}

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
            return {
                "metadata": {
                    "usage": {
                        "inputTokens": event["data"].prompt_tokens,
                        "outputTokens": event["data"].completion_tokens,
                        "totalTokens": event["data"].total_tokens,
                    },
                    "metrics": {
                        "latencyMs": 0,  # TODO
                    },
                },
            }

        case _:
            raise RuntimeError(f"chunk_type=<{event['chunk_type']} | unknown type")

```

#### `format_request(messages, tool_specs=None, system_prompt=None)`

Format an OpenAI compatible chat streaming request.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `messages` | `Messages` | List of message objects to be processed by the model. | *required* | | `tool_specs` | `Optional[list[ToolSpec]]` | List of tool specifications to make available to the model. | `None` | | `system_prompt` | `Optional[str]` | System prompt to provide context to the model. | `None` |

Returns:

| Type | Description | | --- | --- | | `dict[str, Any]` | An OpenAI compatible chat streaming request. |

Raises:

| Type | Description | | --- | --- | | `TypeError` | If a message contains a content block type that cannot be converted to an OpenAI-compatible format. |

Source code in `strands/types/models/openai.py`

```
@override
def format_request(
    self, messages: Messages, tool_specs: Optional[list[ToolSpec]] = None, system_prompt: Optional[str] = None
) -> dict[str, Any]:
    """Format an OpenAI compatible chat streaming request.

    Args:
        messages: List of message objects to be processed by the model.
        tool_specs: List of tool specifications to make available to the model.
        system_prompt: System prompt to provide context to the model.

    Returns:
        An OpenAI compatible chat streaming request.

    Raises:
        TypeError: If a message contains a content block type that cannot be converted to an OpenAI-compatible
            format.
    """
    return {
        "messages": self.format_request_messages(messages, system_prompt),
        "model": self.config["model_id"],
        "stream": True,
        "stream_options": {"include_usage": True},
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
        **(self.config.get("params") or {}),
    }

```

#### `format_request_message_content(content)`

Format an OpenAI compatible content block.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `content` | `ContentBlock` | Message content. | *required* |

Returns:

| Type | Description | | --- | --- | | `dict[str, Any]` | OpenAI compatible content block. |

Raises:

| Type | Description | | --- | --- | | `TypeError` | If the content block type cannot be converted to an OpenAI-compatible format. |

Source code in `strands/types/models/openai.py`

```
@classmethod
def format_request_message_content(cls, content: ContentBlock) -> dict[str, Any]:
    """Format an OpenAI compatible content block.

    Args:
        content: Message content.

    Returns:
        OpenAI compatible content block.

    Raises:
        TypeError: If the content block type cannot be converted to an OpenAI-compatible format.
    """
    if "document" in content:
        mime_type = mimetypes.types_map.get(f".{content['document']['format']}", "application/octet-stream")
        file_data = base64.b64encode(content["document"]["source"]["bytes"]).decode("utf-8")
        return {
            "file": {
                "file_data": f"data:{mime_type};base64,{file_data}",
                "filename": content["document"]["name"],
            },
            "type": "file",
        }

    if "image" in content:
        mime_type = mimetypes.types_map.get(f".{content['image']['format']}", "application/octet-stream")
        image_data = content["image"]["source"]["bytes"].decode("utf-8")
        return {
            "image_url": {
                "detail": "auto",
                "format": mime_type,
                "url": f"data:{mime_type};base64,{image_data}",
            },
            "type": "image_url",
        }

    if "text" in content:
        return {"text": content["text"], "type": "text"}

    raise TypeError(f"content_type=<{next(iter(content))}> | unsupported type")

```

#### `format_request_message_tool_call(tool_use)`

Format an OpenAI compatible tool call.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_use` | `ToolUse` | Tool use requested by the model. | *required* |

Returns:

| Type | Description | | --- | --- | | `dict[str, Any]` | OpenAI compatible tool call. |

Source code in `strands/types/models/openai.py`

```
@classmethod
def format_request_message_tool_call(cls, tool_use: ToolUse) -> dict[str, Any]:
    """Format an OpenAI compatible tool call.

    Args:
        tool_use: Tool use requested by the model.

    Returns:
        OpenAI compatible tool call.
    """
    return {
        "function": {
            "arguments": json.dumps(tool_use["input"]),
            "name": tool_use["name"],
        },
        "id": tool_use["toolUseId"],
        "type": "function",
    }

```

#### `format_request_messages(messages, system_prompt=None)`

Format an OpenAI compatible messages array.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `messages` | `Messages` | List of message objects to be processed by the model. | *required* | | `system_prompt` | `Optional[str]` | System prompt to provide context to the model. | `None` |

Returns:

| Type | Description | | --- | --- | | `list[dict[str, Any]]` | An OpenAI compatible messages array. |

Source code in `strands/types/models/openai.py`

```
@classmethod
def format_request_messages(cls, messages: Messages, system_prompt: Optional[str] = None) -> list[dict[str, Any]]:
    """Format an OpenAI compatible messages array.

    Args:
        messages: List of message objects to be processed by the model.
        system_prompt: System prompt to provide context to the model.

    Returns:
        An OpenAI compatible messages array.
    """
    formatted_messages: list[dict[str, Any]]
    formatted_messages = [{"role": "system", "content": system_prompt}] if system_prompt else []

    for message in messages:
        contents = message["content"]

        formatted_contents = [
            cls.format_request_message_content(content)
            for content in contents
            if not any(block_type in content for block_type in ["toolResult", "toolUse"])
        ]
        formatted_tool_calls = [
            cls.format_request_message_tool_call(content["toolUse"]) for content in contents if "toolUse" in content
        ]
        formatted_tool_messages = [
            cls.format_request_tool_message(content["toolResult"])
            for content in contents
            if "toolResult" in content
        ]

        formatted_message = {
            "role": message["role"],
            "content": formatted_contents,
            **({"tool_calls": formatted_tool_calls} if formatted_tool_calls else {}),
        }
        formatted_messages.append(formatted_message)
        formatted_messages.extend(formatted_tool_messages)

    return [message for message in formatted_messages if message["content"] or "tool_calls" in message]

```

#### `format_request_tool_message(tool_result)`

Format an OpenAI compatible tool message.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool_result` | `ToolResult` | Tool result collected from a tool execution. | *required* |

Returns:

| Type | Description | | --- | --- | | `dict[str, Any]` | OpenAI compatible tool message. |

Source code in `strands/types/models/openai.py`

```
@classmethod
def format_request_tool_message(cls, tool_result: ToolResult) -> dict[str, Any]:
    """Format an OpenAI compatible tool message.

    Args:
        tool_result: Tool result collected from a tool execution.

    Returns:
        OpenAI compatible tool message.
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
        "content": [cls.format_request_message_content(content) for content in contents],
    }

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

### `ToolChoice = Union[Dict[Literal['auto'], ToolChoiceAuto], Dict[Literal['any'], ToolChoiceAny], Dict[Literal['tool'], ToolChoiceTool]]`

Configuration for how the model should choose tools.

- "auto": The model decides whether to use tools based on the context
- "any": The model must use at least one tool (any tool)
- "tool": The model must use the specified tool

### `ToolResultStatus = Literal['success', 'error']`

Status of a tool execution result.

### `AgentTool`

Bases: `ABC`

Abstract base class for all SDK tools.

This class defines the interface that all tool implementations must follow. Each tool must provide its name, specification, and implement an invoke method that executes the tool's functionality.

Source code in `strands/types/tools.py`

```
class AgentTool(ABC):
    """Abstract base class for all SDK tools.

    This class defines the interface that all tool implementations must follow. Each tool must provide its name,
    specification, and implement an invoke method that executes the tool's functionality.
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
    def invoke(self, tool: ToolUse, *args: Any, **kwargs: dict[str, Any]) -> ToolResult:
        """Execute the tool's functionality with the given tool use request.

        Args:
            tool: The tool use request containing tool ID and parameters.
            *args: Positional arguments to pass to the tool.
            **kwargs: Keyword arguments to pass to the tool.

        Returns:
            The result of the tool execution.
        """
        pass

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

#### `invoke(tool, *args, **kwargs)`

Execute the tool's functionality with the given tool use request.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool` | `ToolUse` | The tool use request containing tool ID and parameters. | *required* | | `*args` | `Any` | Positional arguments to pass to the tool. | `()` | | `**kwargs` | `dict[str, Any]` | Keyword arguments to pass to the tool. | `{}` |

Returns:

| Type | Description | | --- | --- | | `ToolResult` | The result of the tool execution. |

Source code in `strands/types/tools.py`

```
@abstractmethod
# pragma: no cover
def invoke(self, tool: ToolUse, *args: Any, **kwargs: dict[str, Any]) -> ToolResult:
    """Execute the tool's functionality with the given tool use request.

    Args:
        tool: The tool use request containing tool ID and parameters.
        *args: Positional arguments to pass to the tool.
        **kwargs: Keyword arguments to pass to the tool.

    Returns:
        The result of the tool execution.
    """
    pass

```

#### `mark_dynamic()`

Mark this tool as dynamically loaded.

Source code in `strands/types/tools.py`

```
def mark_dynamic(self) -> None:
    """Mark this tool as dynamically loaded."""
    self._is_dynamic = True

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

| Name | Type | Description | | --- | --- | --- | | `tools` | `List[Tool]` | List of tools available to the model. | | `toolChoice` | `ToolChoice` | Configuration for how the model should choose tools. |

Source code in `strands/types/tools.py`

```
class ToolConfig(TypedDict):
    """Configuration for tools in a model request.

    Attributes:
        tools: List of tools available to the model.
        toolChoice: Configuration for how the model should choose tools.
    """

    tools: List[Tool]
    toolChoice: ToolChoice

```

### `ToolHandler`

Bases: `ABC`

Abstract base class for handling tool execution within the agent framework.

Source code in `strands/types/tools.py`

```
class ToolHandler(ABC):
    """Abstract base class for handling tool execution within the agent framework."""

    @abstractmethod
    # pragma: no cover
    def preprocess(
        self,
        tool: ToolUse,
        tool_config: ToolConfig,
        **kwargs: Any,
    ) -> Optional[ToolResult]:
        """Preprocess a tool use request before execution.

        Args:
            tool: The tool use request to preprocess.
            tool_config: The tool configuration for the current session.
            **kwargs: Additional context-specific arguments.

        Returns:
            A preprocessed tool result object.
        """
        ...

    @abstractmethod
    # pragma: no cover
    def process(
        self,
        tool: ToolUse,
        *,
        messages: "Messages",
        model: "Model",
        system_prompt: Optional[str],
        tool_config: ToolConfig,
        callback_handler: Any,
        **kwargs: Any,
    ) -> ToolResult:
        """Process a tool use request and execute the tool.

        Args:
            tool: The tool use request to process.
            messages: The current conversation history.
            model: The model being used for the conversation.
            system_prompt: The system prompt for the conversation.
            tool_config: The tool configuration for the current session.
            callback_handler: Callback for processing events as they happen.
            **kwargs: Additional context-specific arguments.

        Returns:
            The result of the tool execution.
        """
        ...

```

#### `preprocess(tool, tool_config, **kwargs)`

Preprocess a tool use request before execution.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool` | `ToolUse` | The tool use request to preprocess. | *required* | | `tool_config` | `ToolConfig` | The tool configuration for the current session. | *required* | | `**kwargs` | `Any` | Additional context-specific arguments. | `{}` |

Returns:

| Type | Description | | --- | --- | | `Optional[ToolResult]` | A preprocessed tool result object. |

Source code in `strands/types/tools.py`

```
@abstractmethod
# pragma: no cover
def preprocess(
    self,
    tool: ToolUse,
    tool_config: ToolConfig,
    **kwargs: Any,
) -> Optional[ToolResult]:
    """Preprocess a tool use request before execution.

    Args:
        tool: The tool use request to preprocess.
        tool_config: The tool configuration for the current session.
        **kwargs: Additional context-specific arguments.

    Returns:
        A preprocessed tool result object.
    """
    ...

```

#### `process(tool, *, messages, model, system_prompt, tool_config, callback_handler, **kwargs)`

Process a tool use request and execute the tool.

Parameters:

| Name | Type | Description | Default | | --- | --- | --- | --- | | `tool` | `ToolUse` | The tool use request to process. | *required* | | `messages` | `Messages` | The current conversation history. | *required* | | `model` | `Model` | The model being used for the conversation. | *required* | | `system_prompt` | `Optional[str]` | The system prompt for the conversation. | *required* | | `tool_config` | `ToolConfig` | The tool configuration for the current session. | *required* | | `callback_handler` | `Any` | Callback for processing events as they happen. | *required* | | `**kwargs` | `Any` | Additional context-specific arguments. | `{}` |

Returns:

| Type | Description | | --- | --- | | `ToolResult` | The result of the tool execution. |

Source code in `strands/types/tools.py`

```
@abstractmethod
# pragma: no cover
def process(
    self,
    tool: ToolUse,
    *,
    messages: "Messages",
    model: "Model",
    system_prompt: Optional[str],
    tool_config: ToolConfig,
    callback_handler: Any,
    **kwargs: Any,
) -> ToolResult:
    """Process a tool use request and execute the tool.

    Args:
        tool: The tool use request to process.
        messages: The current conversation history.
        model: The model being used for the conversation.
        system_prompt: The system prompt for the conversation.
        tool_config: The tool configuration for the current session.
        callback_handler: Callback for processing events as they happen.
        **kwargs: Additional context-specific arguments.

    Returns:
        The result of the tool execution.
    """
    ...

```

### `ToolResult`

Bases: `TypedDict`

Result of a tool execution.

Attributes:

| Name | Type | Description | | --- | --- | --- | | `content` | `List[ToolResultContent]` | List of result content returned by the tool. | | `status` | `ToolResultStatus` | The status of the tool execution ("success" or "error"). | | `toolUseId` | `str` | The unique identifier of the tool use request that produced this result. |

Source code in `strands/types/tools.py`

```
class ToolResult(TypedDict):
    """Result of a tool execution.

    Attributes:
        content: List of result content returned by the tool.
        status: The status of the tool execution ("success" or "error").
        toolUseId: The unique identifier of the tool use request that produced this result.
    """

    content: List[ToolResultContent]
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
