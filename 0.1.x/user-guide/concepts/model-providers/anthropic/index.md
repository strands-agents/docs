# Anthropic

[Anthropic](https://docs.anthropic.com/en/home) is an AI safety and research company focused on building reliable, interpretable, and steerable AI systems. Included in their offerings is the Claude AI family of models, which are known for their conversational abilities, careful reasoning, and capacity to follow complex instructions. The Strands Agents SDK implements an Anthropic provider, allowing users to run agents against Claude models directly.

## Installation

Anthropic is configured as an optional dependency in Strands. To install, run:

```
pip install 'strands-agents[anthropic]'

```

## Usage

After installing `anthropic`, you can import and initialize Strands' Anthropic provider as follows:

```
from strands import Agent
from strands.models.anthropic import AnthropicModel
from strands_tools import calculator

model = AnthropicModel(
    client_args={
        "api_key": "<KEY>",
    },
    # **model_config
    max_tokens=1028,
    model_id="claude-3-7-sonnet-20250219",
    params={
        "temperature": 0.7,
    }
)

agent = Agent(model=model, tools=[calculator])
response = agent("What is 2+2")
print(response)

```

## Configuration

### Client Configuration

The `client_args` configure the underlying Anthropic client. For a complete list of available arguments, please refer to the Anthropic [docs](https://docs.anthropic.com/en/api/client-sdks).

### Model Configuration

The `model_config` configures the underlying model selected for inference. The supported configurations are:

| Parameter | Description | Example | Options | | --- | --- | --- | --- | | `max_tokens` | Maximum number of tokens to generate before stopping | `1028` | [reference](https://docs.anthropic.com/en/api/messages#body-max-tokens) | | `model_id` | ID of a model to use | `claude-3-7-sonnet-20250219` | [reference](https://docs.anthropic.com/en/api/messages#body-model) | | `params` | Model specific parameters | `{"max_tokens": 1000, "temperature": 0.7}` | [reference](https://docs.anthropic.com/en/api/messages) |

## Troubleshooting

### Module Not Found

If you encounter the error `ModuleNotFoundError: No module named 'anthropic'`, this means you haven't installed the `anthropic` dependency in your environment. To fix, run `pip install 'strands-agents[anthropic]'`.

## References

- [API](../../../../api-reference/models/)
- [Anthropic](https://docs.anthropic.com/en/home)
