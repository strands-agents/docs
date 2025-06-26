# Cohere

[Cohere](https://cohere.com/) brings you cutting-edge multilingual models, advanced retrieval, and an AI workspace tailored for the modern enterprise — all within a single, secure platform. 

## Installation

The Strands Agents SDK provides access to Cohere models through the OpenAI compatiblity layer, configured as an optional dependency. To install, run:

```bash
pip install 'strands-agents[openai]'
```

## Usage

After installing `openai`, you can import and initialize Cohere models as follows:

```python
from strands import Agent
from strands.models.openai import OpenAIModel
from strands_tools import calculator

model = OpenAIModel(
    client_args={
        "base_url": "https://api.cohere.com/compatibility/v1",
        "api_key": "<YOUR_KEY>",
    },
    model_id="command-a-03-2025",
    stream=False,
    params={
        "stream_options": None
    }
)

agent = Agent(model=model, tools=[calculator])
agent("What is 2+2")
```

## Configuration

### Client Configuration

The `client_args` and `params` configure the underlying OpenAI client. For a complete list of available arguments, please refer to the [OpenAI](https://github.com/openai/openai-python) and [Cohere](https://docs.cohere.com/docs/compatibility-api#supported-parameters) sources.

## Troubleshooting

### Module Not Found

If you encounter the error `ModuleNotFoundError: No module named 'openai'`, this means you haven't installed the `openai` dependency in your environment. To fix, run `pip install 'strands-agents[openai]'`.

## References

- [API](../../../api-reference/models.md)
- [OpenAI](https://platform.openai.com/docs/overview)
- [Cohere](https://docs.cohere.com/v2/cohere-documentation)
