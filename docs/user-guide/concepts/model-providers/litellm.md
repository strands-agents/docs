# LiteLLM

[LiteLLM](https://docs.litellm.ai/docs/) is a unified interface for various LLM providers that allows you to interact with models from Amazon, Anthropic, OpenAI, and many others through a single API. The Strands Agents SDK implements a LiteLLM provider, allowing you to run agents against any model LiteLLM supports.

## Installation

LiteLLM is configured as an optional dependency in Strands Agents. To install, run:

```bash
pip install 'strands-agents[litellm]'
```

## Usage

After installing `litellm`, you can import and initialize Strands Agents' LiteLLM provider as follows:

```python
from strands import Agent
from strands.models.litellm import LiteLLMModel
from strands_tools import calculator

model = LiteLLMModel(
    client_args={
        "api_key": "<KEY>",
    },
    # **model_config
    model_id="anthropic/claude-3-7-sonnet-20250219",
    params={
        "max_tokens": 1000,
        "temperature": 0.7,
    }
)

agent = Agent(model=model, tools=[calculator])
response = agent("What is 2+2")
print(response)
```

## Configuration

### Client Configuration

The `client_args` configure the underlying LiteLLM client. For a complete list of available arguments, please refer to the LiteLLM [source](https://github.com/BerriAI/litellm/blob/main/litellm/main.py) and [docs](https://docs.litellm.ai/docs/completion/input).

### Model Configuration

The `model_config` configures the underlying model selected for inference. The supported configurations are:

|  Parameter | Description | Example | Options |
|------------|-------------|---------|---------|
| `model_id` | ID of a model to use | `anthropic/claude-3-7-sonnet-20250219` | [reference](https://docs.litellm.ai/docs/providers)
| `params` | Model specific parameters | `{"max_tokens": 1000, "temperature": 0.7}` | [reference](https://docs.litellm.ai/docs/completion/input)

## Troubleshooting

### Module Not Found

If you encounter the error `ModuleNotFoundError: No module named 'litellm'`, this means you haven't installed the `litellm` dependency in your environment. To fix, run `pip install 'strands-agents[litellm]'`.

## Advanced Features

### Structured Output

LiteLLM supports structured output by proxying requests to underlying model providers that support tool calling. The availability of structured output depends on the specific model and provider you're using through LiteLLM.

```python
from pydantic import BaseModel, Field
from strands import Agent
from strands.models.litellm import LiteLLMModel

class TaskAnalysis(BaseModel):
    """Analyze a task or project."""
    title: str = Field(description="Task title")
    priority: str = Field(description="Priority level: low, medium, high")
    estimated_hours: float = Field(description="Estimated completion time in hours")
    dependencies: List[str] = Field(description="Task dependencies")
    status: str = Field(description="Current status")

model = LiteLLMModel(
    model_id="gpt-4o",  # OpenAI model through LiteLLM
    params={
        "temperature": 0.1,
        "max_tokens": 1000
    }
)

agent = Agent(model=model)

# Extract structured task information
result = agent.structured_output(
    TaskAnalysis,
    """
    Analyze this project task: "Implement user authentication system"
    This is a high-priority task that requires database setup and security review.
    Estimated to take 16 hours. Currently in planning phase.
    Depends on database schema design and security policy approval.
    """
)

print(f"Task: {result.title}")
print(f"Priority: {result.priority}")
print(f"Hours: {result.estimated_hours}")
print(f"Dependencies: {result.dependencies}")
```

## References

- [API](../../../api-reference/models.md)
- [LiteLLM](https://docs.litellm.ai/docs/)
