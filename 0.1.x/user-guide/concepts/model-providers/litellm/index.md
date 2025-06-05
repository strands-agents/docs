# LiteLLM

[LiteLLM](https://docs.litellm.ai/docs/) is a unified interface for various LLM providers that allows you to interact with models from Amazon, Anthropic, OpenAI, and many others through a single API. The Strands Agents SDK implements a LiteLLM provider, allowing you to run agents against any model LiteLLM supports.

## Installation

LiteLLM is configured as an optional dependency in Strands Agents. To install, run:

```
pip install 'strands-agents[litellm]'

```

## Usage

After installing `litellm`, you can import and initialize Strands Agents' LiteLLM provider as follows:

```
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

| Parameter | Description | Example | Options | | --- | --- | --- | --- | | `model_id` | ID of a model to use | `anthropic/claude-3-7-sonnet-20250219` | [reference](https://docs.litellm.ai/docs/providers) | | `params` | Model specific parameters | `{"max_tokens": 1000, "temperature": 0.7}` | [reference](https://docs.litellm.ai/docs/completion/input) |

## Troubleshooting

### Module Not Found

If you encounter the error `ModuleNotFoundError: No module named 'litellm'`, this means you haven't installed the `litellm` dependency in your environment. To fix, run `pip install 'strands-agents[litellm]'`.

## References

- [API](../../../../api-reference/models/)
- [LiteLLM](https://docs.litellm.ai/docs/)
