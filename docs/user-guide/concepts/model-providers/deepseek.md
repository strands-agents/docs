# DeepSeek

[DeepSeek](https://platform.deepseek.com/) is an AI company that provides powerful language models including reasoning-capable models. The Strands Agents SDK implements a DeepSeek provider, allowing you to run agents against DeepSeek's chat and reasoning models.

## Installation

DeepSeek is configured as an optional dependency in Strands Agents. To install, run:

```bash
pip install 'strands-agents[deepseek]'
```

## Usage

After installing the DeepSeek dependencies, you can import and initialize the Strands Agents' DeepSeek provider as follows:

```python
from strands import Agent
from strands.models.deepseek import DeepSeekModel
from strands_tools import calculator

model = DeepSeekModel(
    api_key="<DEEPSEEK_API_KEY>",
    model_id="deepseek-chat",
    params={
        "max_tokens": 2000,
        "temperature": 0.7,
    }
)

agent = Agent(model=model, tools=[calculator])
response = agent("What is 2+2")
print(response)
```

### Using the Reasoning Model

DeepSeek's reasoning model provides enhanced problem-solving capabilities:

```python
reasoning_model = DeepSeekModel(
    api_key="<DEEPSEEK_API_KEY>",
    model_id="deepseek-reasoner",
    params={
        "max_tokens": 32000,  # Reasoning models typically need more tokens
    }
)

agent = Agent(model=reasoning_model)
response = agent("Solve this step by step: If a train travels 120 km in 2 hours, and then 180 km in the next 3 hours, what is its average speed for the entire journey?")
print(response)
```

### Using Beta Endpoint

To access beta features, enable the beta endpoint:

```python
beta_model = DeepSeekModel(
    api_key="<DEEPSEEK_API_KEY>",
    model_id="deepseek-chat",
    use_beta=True,
    params={
        "max_tokens": 1000,
    }
)
```

## Configuration

### Model Configuration

The `DeepSeekModel` supports the following configuration options:

| Parameter | Description | Example | Options |
|-----------|-------------|---------|---------|
| `api_key` | DeepSeek API key | `"sk-..."` | Required |
| `model_id` | ID of the model to use | `"deepseek-chat"` | `"deepseek-chat"`, `"deepseek-reasoner"` |
| `base_url` | Custom API base URL | `"https://api.deepseek.com"` | Optional |
| `use_beta` | Whether to use beta endpoint | `True` | `True`, `False` (default) |
| `params` | Model-specific parameters | `{"max_tokens": 2000, "temperature": 0.7}` | [API reference](https://platform.deepseek.com/api-docs/) |

### Available Models

- **deepseek-chat**: General-purpose conversational model
- **deepseek-reasoner**: Advanced reasoning model for complex problem-solving

## Advanced Features

### Structured Output

DeepSeek models support structured output through JSON mode:

```python
from pydantic import BaseModel, Field
from strands import Agent
from strands.models.deepseek import DeepSeekModel

class PersonInfo(BaseModel):
    """Extract person information from text."""
    name: str = Field(description="Full name of the person")
    age: int = Field(description="Age in years")
    occupation: str = Field(description="Job or profession")

model = DeepSeekModel(
    api_key="<DEEPSEEK_API_KEY>",
    model_id="deepseek-chat",
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

### Reasoning Content

When using the reasoning model, you can access both the reasoning process and the final answer:

```python
reasoning_model = DeepSeekModel(
    api_key="<DEEPSEEK_API_KEY>",
    model_id="deepseek-reasoner",
)

agent = Agent(model=reasoning_model)

# The model will show its reasoning process
response = agent("A farmer has 17 sheep. All but 9 die. How many are left?")
# Response will include reasoning steps and final answer
```

## Troubleshooting

### Module Not Found

If you encounter the error `ModuleNotFoundError: No module named 'openai'`, this means you haven't installed the required dependencies. DeepSeek uses OpenAI-compatible APIs, so run:

```bash
pip install 'strands-agents[deepseek]'
```

### API Key Issues

Make sure your DeepSeek API key is valid and has sufficient credits. You can obtain an API key from the [DeepSeek Platform](https://platform.deepseek.com/).

### Rate Limiting

DeepSeek has rate limits on API calls. If you encounter rate limiting errors, consider:
- Adding delays between requests
- Using exponential backoff
- Upgrading your API plan

## References

- [API](../../../api-reference/models.md)
- [DeepSeek Platform](https://platform.deepseek.com/)
- [DeepSeek API Documentation](https://platform.deepseek.com/api-docs/)