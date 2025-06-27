# Creating a Custom Model Provider

Strands Agents SDK provides an extensible interface for implementing custom model providers, allowing organizations to integrate their own LLM services while keeping implementation details private to their codebase.

## Model Provider Functionality

Custom model providers in Strands Agents support two primary interaction modes:

### Conversational Interaction
The standard conversational mode where agents exchange messages with the model. This is the default interaction pattern that is used when you call an agent directly:

```python
agent = Agent(model=your_custom_model)
response = agent("Hello, how can you help me today?")
```

This invokes the underlying model provided to the agent.

### Structured Output
A specialized mode that returns type-safe, validated responses using [Pydantic](https://docs.pydantic.dev/latest/concepts/models/) models instead of raw text. This enables reliable data extraction and processing:

```python
from pydantic import BaseModel

class PersonInfo(BaseModel):
    name: str
    age: int
    occupation: str

result = agent.structured_output(
    PersonInfo,
    "Extract info: John Smith is a 30-year-old software engineer"
)
# Returns a validated PersonInfo object
```

Both modes work through the same underlying model provider interface, with structured output using tool calling capabilities to ensure schema compliance.

## Model Provider Architecture

Strands Agents uses an abstract `Model` class that defines the standard interface all model providers must implement:

```mermaid
flowchart TD
    Base["Model (Base)"] --> Bedrock["Bedrock Model Provider"]
    Base --> Anthropic["Anthropic Model Provider"]
    Base --> LiteLLM["LiteLLM Model Provider"]
    Base --> Ollama["Ollama Model Provider"]
    Base --> Custom["Custom Model Provider"]
```

## Implementing a Custom Model Provider

### 1. Create Your Model Class

Create a new Python module in your private codebase that extends the Strands Agents `Model` class. In this case we also set up a `ModelConfig` to hold the configurations for invoking the model.

```python
# your_org/models/custom_model.py
import logging
import os
from typing import Any, Iterable, Optional, TypedDict
from typing_extensions import Unpack

from custom.model import CustomModelClient

from strands.types.models import Model
from strands.types.content import Messages
from strands.types.streaming import StreamEvent
from strands.types.tools import ToolSpec

logger = logging.getLogger(__name__)


class CustomModel(Model):
    """Your custom model provider implementation."""

    class ModelConfig(TypedDict):
        """
        Configuration your model.

        Attributes:
            model_id: ID of Custom model.
            params: Model parameters (e.g., max_tokens).
        """
        model_id: str
        params: Optional[dict[str, Any]]
        # Add any additional configuration parameters specific to your model

    def __init__(
        self,
        api_key: str,
        *,
        **model_config: Unpack[ModelConfig]
    ) -> None:
        """Initialize provider instance.

        Args:
            api_key: The API key for connecting to your Custom model.
            **model_config: Configuration options for Custom model.
        """
        self.config = CustomModel.ModelConfig(**model_config)
        logger.debug("config=<%s> | initializing", self.config)

        self.client = CustomModelClient(api_key)

    @override
    def update_config(self, **model_config: Unpack[ModelConfig]) -> None:
        """Update the Custom model configuration with the provided arguments.

        Can be invoked by tools to dynamically alter the model state for subsequent invocations by the agent.

        Args:
            **model_config: Configuration overrides.
        """
        self.config.update(model_config)


    @override
    def get_config(self) -> ModelConfig:
        """Get the Custom model configuration.

        Returns:
            The Custom model configuration.
        """
        return self.config

```

### 2. Implement `format_request`

Map the request parameters provided by Strands Agents to your Model Providers request shape:

- [`Messages`](../../../api-reference/types.md#strands.types.content.Messages): A list of Strands Agents messages, containing a [Role](../../../api-reference/types.md#strands.types.content.Role) and a list of [ContentBlocks](../../../api-reference/types.md#strands.types.content.ContentBlock).
  - This type is modeled after the [BedrockAPI](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Message.html).
- [`list[ToolSpec]`](../../../api-reference/types.md#strands.types.tools.ToolSpec): List of tool specifications that the model can decide to use.
- `SystemPrompt`: A system prompt string given to the Model to prompt it how to answer the user.

```python
    @override
    def format_request(
        self, messages: Messages, tool_specs: Optional[list[ToolSpec]] = None, system_prompt: Optional[str] = None
    ) -> dict[str, Any]:
        """Format a Custom model request.

        Args: ...

        Returns: Formatted Messages array, ToolSpecs, SystemPrompt, and additional ModelConfigs.
        """
        return {
            "messages": messages,
            "tools": tool_specs,
            "system_prompt": system_prompt,
            **self.config, # Unpack the remaining configurations needed to invoke the model
        }

```


### 3. Implement `format_chunk`:

Convert the event(s) returned by your model to the Strands Agents [StreamEvent](../../../api-reference/types.md#strands.types.streaming.StreamEvent) type (modeled after the [Bedrock API](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_Types_Amazon_Bedrock_Runtime.html)). The [StreamEvent](../../../api-reference/types.md#strands.types.streaming.StreamEvent) type is a dictionary that expects to have a single key, and whose value corresponds to one of the below types:

* [`messageStart`](../../../api-reference/types.md#strands.types.streaming.MessageStartEvent): Event signaling the start of a message in a streaming response. This should have the `role`: `assistant`
```python
{
    "messageStart": {
        "role": "assistant"
    }
}
```
* [`contentBlockStart`](../../../api-reference/types.md#strands.types.streaming.ContentBlockStartEvent): Event signaling the start of a content block. If this is the first event of a tool use request, then set the `toolUse` key to have the value [ContentBlockStartToolUse](../../../api-reference/types.md#strands.types.content.ContentBlockStartToolUse)
```python
{
    "contentBlockStart": {
        "start": {
            "name": "someToolName", # Only include name and toolUseId if this is the start of a ToolUseContentBlock
            "toolUseId": "uniqueToolUseId"
        }
    }
}
```
* [`contentBlockDelta`](../../../api-reference/types.md#strands.types.streaming.ContentBlockDeltaEvent): Event continuing a content block. This event can be sent several times, and each piece of content will be appended to the previously sent content.
```python
{
    "contentBlockDelta": {
        "delta": { # Only include one of the following keys in each event
            "text": "Some text", # String repsonse from a model
            "reasoningContent": { # Dictionary representing the reasoning of a model.
                "redactedContent": b"Some encryped bytes",
                "signature": "verification token",
                "text": "Some reasoning text"
            },
            "toolUse": { # Dictionary representing a toolUse request. This is a partial json string.
                "input": "Partial json serialized repsonse"
            }
        }
    }
}
```
* [`contentBlockStop`](../../../api-reference/types.md#strands.types.streaming.ContentBlockStopEvent): Event marking the end of a content block. Once this event is sent, all previous events between the previous [ContentBlockStartEvent](../../../api-reference/types.md#strands.types.streaming.ContentBlockStartEvent) and this one can be combined to create a [ContentBlock](../../../api-reference/types.md#strands.types.content.ContentBlock)
```python
{
    "contentBlockStop": {}
}
```
* [`messageStop`](../../../api-reference/types.md#strands.types.streaming.MessageStopEvent): Event marking the end of a streamed response, and the [StopReason](../../../api-reference/types.md#strands.types.event_loop.StopReason). No more content block events are expected after this event is returned.
```python
{
    "messageStop": {
        "stopReason": "end_turn"
    }
}
```
* [`metadata`](../../../api-reference/types.md#strands.types.streaming.MetadataEvent): Event representing the metadata of the response. This contains the input, output, and total token count, along with the latency of the request.
```python
{
    "metrics" {
        "latencyMs": 123 # Latency of the model request in milliseconds.
    },
    "usage": {
        "inputTokens": 234, # Number of tokens sent in the request to the model..
        "outputTokens": 234, # Number of tokens that the model generated for the request.
        "totalTokens": 468 # Total number of tokens (input + output).
    }
}
```
* [`redactContent`](../../../api-reference/types.md#strands.types.streaming.RedactContentEvent): Event that is used to redact the users input message, or the generated response of a model. This is useful for redacting content if a guardrail gets triggered.
```python
{
    "redactContent": {
        "redactUserContentMessage": "User input Redacted",
        "redactAssistantContentMessage": "Assitant output Redacted"
    }
}
```


```python
    @override
    def format_chunk(self, event: Any) -> StreamEvent:
        """Format the Custom model response event into Strands Agents stream event.

        Args:
            event: Custom model response event.

        Returns: Formatted chunks.
        """
        return {...}
```

### 4. Invoke your Model

Now that you have mapped the Strands Agents input to your models request, use this request to invoke your model. If your model does not follow the above EventStream sequence by default, you may need to yield additional events, or omit events that don't map to the Strands Agents SDK EventStream type. Be sure to map any of your model's exceptions to one of Strands Agents' expected exceptions:

- [`ContextWindowOverflowException`](../../../api-reference/types.md#strands.types.exceptions.ContextWindowOverflowException): This exception is raised when the input to a model exceeds the maximum context window size that the model can handle. This will trigger the Strands Agents SDK's [`ConversationManager.reduce_context`](../../../api-reference/agent.md#strands.agent.conversation_manager.conversation_manager.ConversationManager.reduce_context) function.

```python
    @override
    def stream(self, request: Any) -> Iterable[Any]:
        """Send the request to the Custom model and get the streaming response.

        The items returned from this Iterable will each be formatted with `format_chunk` (automatically), then sent
        through the Strands Agents SDK.

        Args:
            request: Custom model formatted request.

        Returns:
            Custom model events.
        """

        # Invoke your model with the response from your format_request implemented above
        try:
            response = self.client(**request)
        except OverflowException as e:
            raise ContextWindowOverflowException() from e

        # This model provider does not have return an event that maps to MessageStart, so we create and yield it here.
        yield {
            "messageStart": {
                "role": "assistant"
            }
        }

        # The rest of these events are mapped in the format_chunk method above.
        for chunk in response["stream"]:
            yield chunk
```

### 5. Structured Output Support

To support structured output in your custom model provider, you need to implement a `structured_output()` method that invokes your model, and has it return a json output. Below is an example of what this might look like for a Bedrock model, where we invoke the model with a tool spec, and check if the response contains a `toolUse` response.

```python

    T = TypeVar('T', bound=BaseModel)

    @override
    def structured_output(
        self, output_model: Type[T], prompt: Messages, callback_handler: Optional[Callable] = None
    ) -> T:
        """Get structured output using tool calling."""
    
        # Convert Pydantic model to tool specification
        tool_spec = convert_pydantic_to_tool_spec(output_model)
        
        # Use existing converse method with tool specification
        response = self.converse(messages=prompt, tool_specs=[tool_spec])
    
        # Process streaming response
        for event in process_stream(response, prompt):
            if callback_handler and "callback" in event:
                callback_handler(**event["callback"])
        else:
            stop_reason, messages, _, _ = event["stop"]
    
        # Validate tool use response
        if stop_reason != "tool_use":
            raise ValueError("No valid tool use found in the model response.")
        
        # Extract tool use output
        content = messages["content"]
        for block in content:
            if block.get("toolUse") and block["toolUse"]["name"] == tool_spec["name"]:
                return output_model(**block["toolUse"]["input"])
        
        raise ValueError("No valid tool use input found in the response.")
```

**Implementation Suggestions:**

1. **Tool Integration**: Use your existing `converse()` method with tool specifications to invoke your model
2. **Response Validation**: Use `output_model(**data)` to validate the response
3. **Error Handling**: Provide clear error messages for parsing and validation failures


For detailed structured output usage patterns, see the [Structured Output documentation](../agents/structured-output.md).

### 6. Use Your Custom Model Provider

Once implemented, you can use your custom model provider in your applications for regular agent invocation:

```python
from strands import Agent
from your_org.models.custom_model import Model as CustomModel

# Initialize your custom model provider
custom_model = CustomModel(
    api_key="your-api-key",
    model_id="your-model-id",
    params={
        "max_tokens": 2000,
        "temperature": 0.7,

    },
)

# Create a Strands agent using your model
agent = Agent(model=custom_model)

# Use the agent as usual
response = agent("Hello, how are you today?")
```

Or you can use the `structured_output` feature to generate structured output:

```python
from strands import Agent
from your_org.models.custom_model import Model as CustomModel
from pydantic import BaseModel, Field

class PersonInfo(BaseModel):
    name: str = Field(description="Full name")
    age: int = Field(description="Age in years")
    occupation: str = Field(description="Job title")

model = CustomModel(api_key="key", model_id="model")

agent = Agent(model=model)

result = agent.structured_output(PersonInfo, "John Smith is a 30-year-old engineer.")

print(f"Name: {result.name}")
print(f"Age: {result.age}")
print(f"Occupation: {result.occupation}")
```

## Key Implementation Considerations

### 1. Message Formatting

Strands Agents' internal `Message`, `ToolSpec`, and `SystemPrompt` types must be converted to your model API's expected format:

- Strands Agents uses a structured message format with role and content fields
- Your model API might expect a different structure
- Map the message content appropriately in `format_request()`

### 2. Streaming Response Handling

Strands Agents expects streaming responses to be formatted according to its `StreamEvent` protocol:

- `messageStart`: Indicates the start of a response message
- `contentBlockStart`: Indicates the start of a content block
- `contentBlockDelta`: Contains incremental content updates
- `contentBlockStop`: Indicates the end of a content block
- `messageStop`: Indicates the end of the response message with a stop reason
- `metadata`: Indicates information about the response like input_token count, output_token count, and latency
- `redactContent`: Used to redact either the users input, or the model's response
  - Useful when a guardrail is triggered

Your `format_chunk()` method must transform your API's streaming format to match these expectations.

### 3. Tool Support

If your model API supports tools or function calling:

- Format tool specifications appropriately in `format_request()`
- Handle tool-related events in `format_chunk()`
- Ensure proper message formatting for tool calls and results

### 4. Error Handling

Implement robust error handling for API communication:

- Context window overflows
- Connection errors
- Authentication failures
- Rate limits and quotas
- Malformed responses

### 5. Configuration Management

The build in `get_config` and `update_config` methods allow for the model's configuration to be changed at runtime.

- `get_config` exposes the current model config
- `update_config` allows for at-runtime updates to the model config
  - For example, changing model_id with a tool call
