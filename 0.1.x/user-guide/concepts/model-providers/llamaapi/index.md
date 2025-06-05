# Llama API

[Llama API](https://llama.developer.meta.com?utm_source=partner-strandsagent&utm_medium=website) is a Meta-hosted API service that helps you integrate Llama models into your applications quickly and efficiently.

Llama API provides access to Llama models through a simple API interface, with inference provided by Meta, so you can focus on building AI-powered solutions without managing your own inference infrastructure.

With Llama API, you get access to state-of-the-art AI capabilities through a developer-friendly interface designed for simplicity and performance.

## Installation

Llama API is configured as an optional dependency in Strands Agents. To install, run:

```
pip install 'strands-agents[llamaapi]'

```

## Usage

After installing `llamaapi`, you can import and initialize Strands Agents' Llama API provider as follows:

```
from strands import Agent
from strands.models.llamaapi import LlamaAPIModel
from strands_tools import calculator

model = LlamaAPIModel(
    client_args={
        "api_key": "<KEY>",
    },
    # **model_config
    model_id="Llama-4-Maverick-17B-128E-Instruct-FP8",
)

agent = Agent(model=model, tools=[calculator])
response = agent("What is 2+2")
print(response)

```

## Configuration

### Client Configuration

The `client_args` configure the underlying LlamaAPI client. For a complete list of available arguments, please refer to the LlamaAPI [docs](https://llama.developer.meta.com/docs/).

### Model Configuration

The `model_config` configures the underlying model selected for inference. The supported configurations are:

| Parameter | Description | Example | Options | | --- | --- | --- | --- | | `model_id` | ID of a model to use | `Llama-4-Maverick-17B-128E-Instruct-FP8` | [reference](https://llama.developer.meta.com/docs/) | | `repetition_penalty` | Controls the likelihood and generating repetitive responses. (minimum: 1, maximum: 2, default: 1) | `1` | [reference](https://llama.developer.meta.com/docs/api/chat) | | `temperature` | Controls randomness of the response by setting a temperature. | `0.7` | [reference](https://llama.developer.meta.com/docs/api/chat) | | `top_p` | Controls diversity of the response by setting a probability threshold when choosing the next token. | `0.9` | [reference](https://llama.developer.meta.com/docs/api/chat) | | `max_completion_tokens` | The maximum number of tokens to generate. | `4096` | [reference](https://llama.developer.meta.com/docs/api/chat) | | `top_k` | Only sample from the top K options for each subsequent token. | `10` | [reference](https://llama.developer.meta.com/docs/api/chat) |

## Troubleshooting

### Module Not Found

If you encounter the error `ModuleNotFoundError: No module named 'llamaapi'`, this means you haven't installed the `llamaapi` dependency in your environment. To fix, run `pip install 'strands-agents[llamaapi]'`.

## References

- [API](../../../../api-reference/models/)
- [LlamaAPI](https://llama.developer.meta.com/docs/)
