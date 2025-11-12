# OVHcloud AI Endpoints

[OVHcloud AI Endpoints](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/) provides access to a variety of AI models through OpenAI-compatible API endpoints. 

OVHcloud is a French Cloud Provider, leading in Europe. Our key values are data sovereignty and privacy, while being GDPR compliant. Your data will never be used to train or improve our AI models; this is one of our many security guarantees.

## Installation

The Strands Agents SDK provides access to OVHcloud AI Endpoints models through our custom model. To install, run:

```bash
pip install 'strands-agents[ovhcloud]' strands-agents-tools
```

## Usage

After installing the `ovhcloud` package, you can import and initialize OVHcloud AI Endpoints provider as follows:

```python
from strands import Agent
from strands.models.ovhcloud import OpenAIModel
from strands_tools import calculator

model = OVHcloudModel(
    client_args={
        "api_key": "<OVHCLOUD_API_KEY>",  # Optional: can be empty string or omitted for free tier
    },
    model_id="<MODEL_ID>",  # See https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/
    params={
        "max_tokens": 1000,
        "temperature": 0.7,
    }
)

agent = Agent(model=model, tools=[calculator])
agent("What is 2+2?")
```

### Free Tier Usage

OVHcloud AI Endpoints can be used for free with rate limits if you don't provide an API key or provide an empty string:

```python
model = OpenAIModel(
    client_args={
        "api_key": "",  # Empty string for free tier
    },
    model_id="<MODEL_ID>",
)
```

## Configuration

### Client Configuration

The `client_args` configure the underlying client. When using OVHcloud AI Endpoints, you must set:

* `api_key`: Your OVHcloud AI Endpoints API key (optional for free tier). To generate an API key:
  1. Go to [OVHcloud Manager](https://ovh.com/manager)
  2. Navigate to **Public Cloud** section
  3. Select **AI & Machine Learning** → **AI Endpoints and API keys**
  4. Create a new API key

### Model Configuration

The `model_config` specifies which OVHcloud AI Endpoints model to use and any additional parameters.

| Parameter  | Description               | Example                                                           | Options                                                            |
| ---------- | ------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| `model_id` | Model name                | Varies by model                                                   | See [OVHcloud AI Endpoints Catalog](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/) |
| `params`   | Model-specific parameters | `{"max_tokens": 1000, "temperature": 0.7, "top_p": 0.9}`         | Standard OpenAI API parameters                                     |

## Troubleshooting

### `ModuleNotFoundError: No module named 'ovhcloud'`

You must install the `ovhcloud` dependency to use this provider:

```bash
pip install 'strands-agents[ovhcloud]'
```

### Unexpected model behavior?

Ensure you're using a valid model ID from the [OVHcloud AI Endpoints Catalog](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/). We are available on [Discord](https://discord.gg/ovhcloud) in the `#ai-endpoints` channel to help you with any issues!

### Rate limiting on free tier

If you're using the free tier (no API key or empty string), you may encounter rate limits. To remove rate limits, generate an API key from the OVHcloud Manager and use it in the `client_args`.

## References

* [OVHcloud AI Endpoints](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/)
* [OVHcloud AI Endpoints Catalog](https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/)
* [OVHcloud Manager](https://ovh.com/manager)
* [Strands Agents API](../../../api-reference/models.md)

