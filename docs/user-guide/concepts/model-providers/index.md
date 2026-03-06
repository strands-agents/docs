## What are Model Providers?

A model provider is a service or platform that hosts and serves large language models through an API. The Strands Agents SDK abstracts away the complexity of working with different providers, offering a unified interface that makes it easy to switch between models or use multiple providers in the same application.

## Supported Providers

The following table shows all model providers supported by Strands Agents SDK and their availability in Python and TypeScript:

| Provider | Python Support | TypeScript Support |
| --- | --- | --- |
| [Custom Providers](/docs/user-guide/concepts/model-providers/custom_model_provider/index.md) | ✅ | ✅ |
| [Amazon Bedrock](/docs/user-guide/concepts/model-providers/amazon-bedrock/index.md) | ✅ | ✅ |
| [Amazon Nova](/docs/user-guide/concepts/model-providers/amazon-nova/index.md) | ✅ | ❌ |
| [OpenAI](/docs/user-guide/concepts/model-providers/openai/index.md) | ✅ | ✅ |
| [Anthropic](/docs/user-guide/concepts/model-providers/anthropic/index.md) | ✅ | ❌ |
| [Gemini](/docs/user-guide/concepts/model-providers/gemini/index.md) | ✅ | ✅ |
| [LiteLLM](/docs/user-guide/concepts/model-providers/litellm/index.md) | ✅ | ❌ |
| [llama.cpp](/docs/user-guide/concepts/model-providers/llamacpp/index.md) | ✅ | ❌ |
| [LlamaAPI](/docs/user-guide/concepts/model-providers/llamaapi/index.md) | ✅ | ❌ |
| [MistralAI](/docs/user-guide/concepts/model-providers/mistral/index.md) | ✅ | ❌ |
| [Ollama](/docs/user-guide/concepts/model-providers/ollama/index.md) | ✅ | ❌ |
| [SageMaker](/docs/user-guide/concepts/model-providers/sagemaker/index.md) | ✅ | ❌ |
| [Writer](/docs/user-guide/concepts/model-providers/writer/index.md) | ✅ | ❌ |
| [Cohere](/docs/user-guide/concepts/model-providers/cohere/index.md) | ✅ | ❌ |
| [CLOVA Studio](/docs/user-guide/concepts/model-providers/clova-studio/index.md) | ✅ | ❌ |
| [FireworksAI](/docs/user-guide/concepts/model-providers/fireworksai/index.md) | ✅ | ❌ |
| [xAI](/docs/user-guide/concepts/model-providers/xai/index.md) | ✅ | ❌ |

## Getting Started

### Installation

Most providers are available as optional dependencies. Install the provider you need:

(( tab "Python" ))
```bash
# Install with specific provider
pip install 'strands-agents[bedrock]'
pip install 'strands-agents[openai]'
pip install 'strands-agents[anthropic]'

# Or install with all providers
pip install 'strands-agents[all]'
```
(( /tab "Python" ))

(( tab "TypeScript" ))
```bash
# Core SDK includes BedrockModel by default
npm install @strands-agents/sdk

# To use OpenAI, install the openai package
npm install openai
```

> **Note:** All model providers except Bedrock are listed as optional dependencies in the SDK. This means npm will attempt to install them automatically, but won’t fail if they’re unavailable. You can explicitly install them when needed.
(( /tab "TypeScript" ))

### Basic Usage

Each provider follows a similar pattern for initialization and usage. Models are interchangeable - you can easily switch between providers by changing the model instance:

(( tab "Python" ))
```python
from strands import Agent
from strands.models.bedrock import BedrockModel
from strands.models.openai import OpenAIModel

# Use Bedrock
bedrock_model = BedrockModel(
    model_id="anthropic.claude-sonnet-4-20250514-v1:0"
)
agent = Agent(model=bedrock_model)
response = agent("What can you help me with?")

# Alternatively, use OpenAI by just switching model provider
openai_model = OpenAIModel(
    client_args={"api_key": "<KEY>"},
    model_id="gpt-4o"
)
agent = Agent(model=openai_model)
response = agent("What can you help me with?")
```
(( /tab "Python" ))

(( tab "TypeScript" ))
```typescript
import { Agent } from '@strands-agents/sdk'
import { BedrockModel } from '@strands-agents/sdk/bedrock'
import { OpenAIModel } from '@strands-agents/sdk/openai'

// Use Bedrock
const bedrockModel = new BedrockModel({
  modelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
})
let agent = new Agent({ model: bedrockModel })
let response = await agent.invoke('What can you help me with?')

// Alternatively, use OpenAI by just switching model provider
const openaiModel = new OpenAIModel({
  apiKey: process.env.OPENAI_API_KEY,
  modelId: 'gpt-4o',
})
agent = new Agent({ model: openaiModel })
response = await agent.invoke('What can you help me with?')
```
(( /tab "TypeScript" ))

## Next Steps

### Explore Model Providers

-   **[Amazon Bedrock](/docs/user-guide/concepts/model-providers/amazon-bedrock/index.md)** - Default provider with wide model selection, enterprise features, and full Python/TypeScript support
-   **[OpenAI](/docs/user-guide/concepts/model-providers/openai/index.md)** - GPT models with streaming support
-   **[Gemini](/docs/user-guide/concepts/model-providers/gemini/index.md)** - Google’s Gemini models with tool calling support
-   **[Custom Providers](/docs/user-guide/concepts/model-providers/custom_model_provider/index.md)** - Build your own model integration
-   **[Anthropic](/docs/user-guide/concepts/model-providers/anthropic/index.md)** - Direct Claude API access (Python only)