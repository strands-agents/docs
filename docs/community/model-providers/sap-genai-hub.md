# SAP GenAI Hub

{{ community_contribution_banner }}

[SAP GenAI Hub](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/consume-generative-ai-models-using-sap-ai-core#aws-bedrock) provides access to various foundation models through SAP AI Core, including Amazon Bedrock models like Nova, Claude, and Titan. SAP GenAI Hub enables enterprise-grade AI model consumption with built-in governance, security, and compliance features.

## Installation

The Strands Agents SDK provides native access to SAP GenAI Hub models through a dedicated provider. To install, run:

```bash
pip install strands-agents 'sap-ai-sdk-gen[all]' strands-agents-tools
```

## Usage

After installing the SAP GenAI Hub SDK, you can import and initialize the Strands Agents' SAP GenAI Hub provider as follows:

```python
from strands import Agent
from strands.models.sap_genai_hub import SAPGenAIHubModel
from strands_tools import calculator

# Initialize SAP GenAI Hub model (requires ~/.aicore/config.json with credentials)
model = SAPGenAIHubModel(
    model_id="amazon--nova-lite",  # or see available models below
    temperature=0.7,
    max_tokens=1000,
    top_p=0.9
)

agent = Agent(model=model, tools=[calculator])
response = agent("What is 2+2?")
print(response.message)
```

## Prerequisites

Before using SAP GenAI Hub, you need to:

1. **Set up SAP AI Core credentials** in your `~/.aicore/config.json` file
2. **Configure access** to the desired foundation models through your SAP AI Core instance
3. **Install the SAP GenAI Hub SDK** with all dependencies

For detailed setup instructions, refer to the [SAP AI Core documentation](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/consume-generative-ai-models-using-sap-ai-core#aws-bedrock).

## Configuration

### Model Configuration

The `SAPGenAIHubModel` supports various configuration parameters:

| Parameter | Description | Example | Options |
| --------- | ----------- | ------- | ------- |
| `model_id` | SAP GenAI Hub model identifier | `"amazon--nova-lite"` | See available models below |
| `temperature` | Controls randomness in generation | `0.7` | 0.0 to 1.0 |
| `max_tokens` | Maximum tokens to generate | `1000` | Model-dependent |
| `top_p` | Controls diversity via nucleus sampling | `0.9` | 0.0 to 1.0 |
| `stop_sequences` | Sequences that stop generation | `["###", "END"]` | List of strings |
| `streaming` | Enable/disable streaming responses | `True` | `True` or `False` |
| `additional_args` | Extra model-specific parameters | `{"custom_param": "value"}` | Dictionary |

### Available Models

SAP GenAI Hub provides access to various foundation models through AWS Bedrock. For the most up-to-date list, refer to [SAP Note 3437766](https://me.sap.com/notes/0003437766).

#### Amazon Nova Models
- `amazon--nova-premier` - Most advanced multimodal model
- `amazon--nova-pro` - High-performance multimodal model
- `amazon--nova-lite` - Fast and cost-effective model  
- `amazon--nova-micro` - Ultra-fast model for simple tasks

#### Anthropic Claude Models
- `anthropic--claude-4.5-sonnet` - Latest generation Claude model
- `anthropic--claude-4-sonnet` - Advanced reasoning and analysis
- `anthropic--claude-4-opus` - Most capable model for complex tasks
- `anthropic--claude-3.7-sonnet` - Enhanced Claude 3.5 model
- `anthropic--claude-3.5-sonnet` - Balanced performance (versions 1 & 2)
- `anthropic--claude-3-opus` - Previous generation flagship model
- `anthropic--claude-3-haiku` - Fast model for simple tasks

#### Amazon Titan Models
- `amazon--titan-embed-text` - Text embeddings (versions 1.2 & 2)
- `amazon--titan-embed-image` - Image embeddings model

## Advanced Usage

### Using Tools with SAP GenAI Hub

```python
from strands import Agent, tool
from strands.models.sap_genai_hub import SAPGenAIHubModel

@tool
def web_search(query: str) -> str:
    """Search the web for information."""
    # Your search implementation
    return f"Search results for: {query}"

model = SAPGenAIHubModel(
    model_id="amazon--nova-pro",
    temperature=0.1,
    max_tokens=2000
)

agent = Agent(
    model=model,
    tools=[web_search],
    system_prompt="You are a helpful research assistant."
)

response = agent("Search for the latest AI developments")
print(response.message)
```

### Multi-Agent Workflows

```python
from strands import Agent
from strands.models.sap_genai_hub import SAPGenAIHubModel

# Research agent using Claude
research_model = SAPGenAIHubModel(model_id="anthropic--claude-3.5-sonnet")
research_agent = Agent(
    model=research_model,
    system_prompt="You are a research specialist focused on factual accuracy."
)

# Creative agent using Nova
creative_model = SAPGenAIHubModel(model_id="amazon--nova-pro")
creative_agent = Agent(
    model=creative_model,
    system_prompt="You are a creative writing specialist."
)

# Use agents in workflow
research_result = research_agent("What are the key features of quantum computing?")
creative_result = creative_agent(f"Write a story based on: {research_result.message}")
```

## Troubleshooting

### `ModuleNotFoundError: No module named 'gen_ai_hub'`

You must install the SAP GenAI Hub SDK:

```bash
pip install 'sap-ai-sdk-gen[all]'
```

### Authentication Errors

Ensure your `~/.aicore/config.json` file is properly configured with valid SAP AI Core credentials. The file should contain:

```json
{
  "AICORE_AUTH_URL": "https://your-auth-url.authentication.region.hana.ondemand.com",
  "AICORE_CLIENT_ID": "your-client-id",
  "AICORE_CLIENT_SECRET": "your-client-secret",
  "AICORE_RESOURCE_GROUP": "default",
  "AICORE_BASE_URL": "https://api.ai.prod.region.aws.ml.hana.ondemand.com"
}
```

Replace the placeholder values with your actual SAP AI Core service instance credentials.

#### Converting Service Keys

If you have an SAP AI Core service key in a different format, you can use the [transform_config.py utility](https://github.com/aws-samples/sample-sap-genai-hub-bedrock/blob/main/util/transform_config.py) to convert it to the required format:

```bash
# Download the utility script
curl -o transform_config.py https://raw.githubusercontent.com/aws-samples/sample-sap-genai-hub-bedrock/main/util/transform_config.py

# Run the transformation (replace with your service key file)
python transform_config.py your-service-key.json ~/.aicore/config.json
```

This utility will convert your SAP AI Core service key JSON to the correct configuration format expected by the SAP GenAI Hub SDK.

### Model Not Available

Verify that the requested model is available in your SAP AI Core instance and that you have proper access permissions. Some models may require specific entitlements or regional availability.

### Context Window Overflow

If you encounter context window errors, reduce the input size or use models with larger context windows like `amazon--nova-pro`.

## References

- [SAP AI Core Service Guide](https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/consume-generative-ai-models-using-sap-ai-core#aws-bedrock)
- [SAP GenAI Hub SDK](https://pypi.org/project/sap-ai-sdk-gen/)
- [Strands Agents API Reference](../../api-reference/models.md)
