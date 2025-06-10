# Portkey 

[Portkey](https://docs.portkey.ai) is a gateway platform that enables seamless integration with multiple language model providers such as OpenAI, Anthropic, and Amazon Bedrock. The Strands Agents SDK includes a Portkey-based provider, allowing you to run agents across OpenAI-compatible models (i.e., those using OpenAI’s API schema) and other supported models via a unified interface.

## Installation

Portkey is configured as an optional dependency in Strands Agents. To install, run:

```bash
pip install 'strands-agents[portkey]'
```

## Usage

After installing `portkey`, you can import and initialize the Strands Agents' Portkey provider as follows:

```python
from strands import Agent
from strands.models.portkey import PortkeyModel
from strands_tools import calculator

# Portkey for all models
model = PortkeyModel(
    api_key="<PORTKEY_API_KEY>",
    model_id="anthropic.claude-3-5-sonnet-20241022-v2:0", #Example
    virtual_key="<BEDROCK_VIRTUAL_KEY>",  # Required for providers like Bedrock. See https://docs.portkey.ai for other provider-specific notes.
    provider="bedrock",  # You can set the provider to 'anthropic', 'bedrock', 'openai' depending on your model and API setup.
    base_url="http://portkey-service-gateway.service.prod.example.com/v1",
)

agent = Agent(model=model, tools=[calculator])
# You can also add tools like web_search, code_interpreter, etc.
response = agent("What is 2+2")
print(response)
```


## Configuration

### Client Configuration

The `client_args` configure the underlying OpenAI client. For a complete list of available arguments, please refer to the OpenAI [source](https://github.com/openai/openai-python).

### Model Configuration

The `model_config` configures the underlying model selected for inference. The supported configurations are:

| Parameter         | Description                          | Example                                    | Options                                                                 |
|-------------------|--------------------------------------|--------------------------------------------|------------------------------------------------------------------------|
| `model_id`        | ID of a model to use                | `anthropic.claude-3-5-sonnet-20241022-v2:0` | [reference](https://docs.portkey.ai/docs/llm-routing/overview)              |
| `base_url`        | Base URL for Portkey service         | `http://portkey-service-gateway.service.prod.example.com/v1` | [reference](https://portkey-ai.com/docs)                               |
| `provider`        | Model provider                      | `bedrock`                                  | `openai`, `bedrock`, `anthropic`, etc.                                 |
| `virtual_key`     | Virtual key for authentication       | `<BEDROCK_VIRTUAL_KEY>`                   | [reference](https://portkey-ai.com/docs/authentication)                |

## Troubleshooting

### Module Not Found

If you encounter the error `ModuleNotFoundError: No module named 'portkey'`, this means you haven't installed the `portkey` dependency in your environment. To fix, run `pip install 'strands-agents[portkey]'`.

## References

- [API](../../../api-reference/models.md)
- [PortkeyAI](https://docs.portkey.ai)
