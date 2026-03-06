# OpenAI Responses API

!!! info "Language Support"
    This provider is only supported in Python.

The [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses/create) is OpenAI's latest API for interacting with their models. The Strands Agents SDK provides a dedicated `OpenAIResponsesModel` provider that uses this API, supporting streaming, tool calling, and structured output.

!!! note "Looking for the Chat Completions API?"
    If you want to use OpenAI's Chat Completions API instead, see the [OpenAI (Chat Completions)](openai.md) provider.

## Installation

OpenAI is configured as an optional dependency in Strands Agents. The Responses API provider requires the OpenAI Python SDK **v2.0.0 or later**. To install, run:

```bash
pip install 'strands-agents[openai]' strands-agents-tools
```

## Usage

After installing dependencies, you can import and initialize the OpenAI Responses API provider as follows:

```python
from strands import Agent
from strands.models.openai_responses import OpenAIResponsesModel
from strands_tools import calculator

model = OpenAIResponsesModel(
    client_args={
        "api_key": "<KEY>",
    },
    model_id="gpt-4o",
    params={
        "max_output_tokens": 1000,
        "temperature": 0.7,
    }
)

agent = Agent(model=model, tools=[calculator])
response = agent("What is 2+2")
print(response)
```

To connect to a custom OpenAI-compatible server:

```python
model = OpenAIResponsesModel(
    client_args={
        "api_key": "<KEY>",
        "base_url": "<URL>",
    },
    ...
)
```

## Configuration

### Client Configuration

The `client_args` configure the underlying `AsyncOpenAI` client. For a complete list of available arguments, please refer to the OpenAI [source](https://github.com/openai/openai-python).

### Model Configuration

The model configuration sets parameters for inference:

| Parameter | Description | Example | Options |
|-----------|-------------|---------|---------|
| `model_id` | ID of a model to use | `gpt-4o` | [reference](https://platform.openai.com/docs/models) |
| `params` | Model specific parameters | `{"max_output_tokens": 1000, "temperature": 0.7}` | [reference](https://platform.openai.com/docs/api-reference/responses/create) |

## Troubleshooting

**Module Not Found**

If you encounter the error `ModuleNotFoundError: No module named 'openai'`, this means you haven't installed the `openai` dependency in your environment. To fix, run `pip install 'strands-agents[openai]'`.

**OpenAI SDK Version**

The Responses API provider requires the OpenAI Python SDK v2.0.0 or later. If you encounter an `ImportError` about the SDK version, upgrade with `pip install --upgrade openai`.

## Advanced Features

### Structured Output

The OpenAI Responses API provider supports structured output through the `responses.parse(...)` endpoint. When you use `Agent.structured_output()`, the Strands SDK uses this to return typed results conforming to your Pydantic model.

```python
from pydantic import BaseModel, Field
from strands import Agent
from strands.models.openai_responses import OpenAIResponsesModel

class PersonInfo(BaseModel):
    """Extract person information from text."""
    name: str = Field(description="Full name of the person")
    age: int = Field(description="Age in years")
    occupation: str = Field(description="Job or profession")

model = OpenAIResponsesModel(
    client_args={"api_key": "<KEY>"},
    model_id="gpt-4o",
)

agent = Agent(model=model)

result = agent.structured_output(
    PersonInfo,
    "John Smith is a 30-year-old software engineer working at a tech startup."
)

print(f"Name: {result.name}")      # "John Smith"
print(f"Age: {result.age}")        # 30
print(f"Job: {result.occupation}") # "software engineer"
```

### Reasoning Models

The Responses API provider supports reasoning models (such as o1 and o3) that include chain-of-thought reasoning in their responses. Reasoning content is automatically captured and streamed as `reasoningContent` events.

## References

- [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses/create)
- [OpenAI (Chat Completions) Provider](openai.md)
