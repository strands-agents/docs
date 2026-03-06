Exception-related type definitions for the SDK.

## EventLoopException

```python
class EventLoopException(Exception)
```

Defined in: [src/strands/types/exceptions.py:6](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/exceptions.py#L6)

Exception raised by the event loop.

#### \_\_init\_\_

```python
def __init__(original_exception: Exception, request_state: Any = None) -> None
```

Defined in: [src/strands/types/exceptions.py:9](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/exceptions.py#L9)

Initialize exception.

**Arguments**:

-   `original_exception` - The original exception that was raised.
-   `request_state` - The state of the request at the time of the exception.

## MaxTokensReachedException

```python
class MaxTokensReachedException(Exception)
```

Defined in: [src/strands/types/exceptions.py:21](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/exceptions.py#L21)

Exception raised when the model reaches its maximum token generation limit.

This exception is raised when the model stops generating tokens because it has reached the maximum number of tokens allowed for output generation. This can occur when the model’s max\_tokens parameter is set too low for the complexity of the response, or when the model naturally reaches its configured output limit during generation.

#### \_\_init\_\_

```python
def __init__(message: str)
```

Defined in: [src/strands/types/exceptions.py:29](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/exceptions.py#L29)

Initialize the exception with an error message and the incomplete message object.

**Arguments**:

-   `message` - The error message describing the token limit issue

## ContextWindowOverflowException

```python
class ContextWindowOverflowException(Exception)
```

Defined in: [src/strands/types/exceptions.py:38](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/exceptions.py#L38)

Exception raised when the context window is exceeded.

This exception is raised when the input to a model exceeds the maximum context window size that the model can handle. This typically occurs when the combined length of the conversation history, system prompt, and current message is too large for the model to process.

## MCPClientInitializationError

```python
class MCPClientInitializationError(Exception)
```

Defined in: [src/strands/types/exceptions.py:49](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/exceptions.py#L49)

Raised when the MCP server fails to initialize properly.

## ModelThrottledException

```python
class ModelThrottledException(Exception)
```

Defined in: [src/strands/types/exceptions.py:55](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/exceptions.py#L55)

Exception raised when the model is throttled.

This exception is raised when the model is throttled by the service. This typically occurs when the service is throttling the requests from the client.

#### \_\_init\_\_

```python
def __init__(message: str) -> None
```

Defined in: [src/strands/types/exceptions.py:62](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/exceptions.py#L62)

Initialize exception.

**Arguments**:

-   `message` - The message from the service that describes the throttling.

## SessionException

```python
class SessionException(Exception)
```

Defined in: [src/strands/types/exceptions.py:74](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/exceptions.py#L74)

Exception raised when session operations fail.

## ToolProviderException

```python
class ToolProviderException(Exception)
```

Defined in: [src/strands/types/exceptions.py:80](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/exceptions.py#L80)

Exception raised when a tool provider fails to load or cleanup tools.

## StructuredOutputException

```python
class StructuredOutputException(Exception)
```

Defined in: [src/strands/types/exceptions.py:86](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/exceptions.py#L86)

Exception raised when structured output validation fails after maximum retry attempts.

#### \_\_init\_\_

```python
def __init__(message: str)
```

Defined in: [src/strands/types/exceptions.py:89](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/exceptions.py#L89)

Initialize the exception with details about the failure.

**Arguments**:

-   `message` - The error message describing the structured output failure

## ConcurrencyException

```python
class ConcurrencyException(Exception)
```

Defined in: [src/strands/types/exceptions.py:99](https://github.com/strands-agents/sdk-python/blob/main/src/strands/types/exceptions.py#L99)

Exception raised when concurrent invocations are attempted on an agent instance.

Agent instances maintain internal state that cannot be safely accessed concurrently. This exception is raised when an invocation is attempted while another invocation is already in progress on the same agent instance.