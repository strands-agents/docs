# NVIDIA NIM

{{ community_contribution_banner }}

!!! info "Language Support"
    This provider is only supported in Python.

[NVIDIA NIM](https://www.nvidia.com/en-us/ai/) provides optimized inference for AI models. The `strands-nvidia-nim` provider enables seamless integration between Strands Agents SDK and NVIDIA NIM endpoints.

## Installation

To use NVIDIA NIM models with Strands Agents, install the community provider:

```bash
pip install strands-nvidia-nim
```

## Usage

### Basic Usage with API Key

```python
from strands import Agent
from strands_nvidia_nim import NvidiaNIM
from strands_tools import calculator

# Create the provider
model = NvidiaNIM(
    api_key="your-nvidia-nim-api-key",
    model_id="meta/llama-3.1-70b-instruct",
    params={
        "max_tokens": 1000,
        "temperature": 0.7,
    }
)

# Use with standard Strands Agent
agent = Agent(model=model, tools=[calculator])
agent("What is 123.456 * 789.012?")
```

### Using Environment Variables (Recommended)

```bash
# Set your API key as an environment variable
export NVIDIA_NIM_API_KEY=your-nvidia-nim-api-key
```

```python
import os
from strands import Agent
from strands_nvidia_nim import NvidiaNIM
from strands_tools import calculator

model = NvidiaNIM(
    api_key=os.getenv("NVIDIA_NIM_API_KEY"),
    model_id="meta/llama-3.1-70b-instruct",
    params={"max_tokens": 1000, "temperature": 0.7}
)

agent = Agent(model=model, tools=[calculator])
agent("What is 123.456 * 789.012?")
```

## Configuration

### Model Configuration

| Parameter  | Description               | Example                                    |
| ---------- | ------------------------- | ------------------------------------------ |
| `api_key` | Your NVIDIA API key | `nvapi-...` |
| `model_id` | Model identifier | `meta/llama-3.1-70b-instruct` |
| `params`   | Model-specific parameters | `{"max_tokens": 1500, "temperature": 0.7, "top_p": 0.9, "frequency_penalty": 0.0, "presence_penalty": 0.0}` |

### Available Models

Popular NVIDIA NIM models:

- `meta/llama-3.1-70b-instruct` - High quality, larger model
- `meta/llama-3.1-8b-instruct` - Faster, smaller model  
- `meta/llama-3.3-70b-instruct` - Latest Llama model
- `mistralai/mistral-large` - Mistral's flagship model
- `nvidia/llama-3.1-nemotron-70b-instruct` - NVIDIA-optimized

See the [NVIDIA NIM catalog](https://catalog.ngc.nvidia.com/) for all available models.

## Features

- ✅ **Optimized Inference** - Leverages NVIDIA's inference runtime
- ✅ **Simple Integration** - Clean setup with standard Strands pattern
- ✅ **Multiple Models** - Support for Llama, Mistral, and NVIDIA-optimized models
- ✅ **Clean Output** - Proper streaming support
- ✅ **Error Handling** - Context window overflow detection

## Troubleshooting

### API Key Issues

Ensure you have a valid NVIDIA API key from the [NVIDIA NGC Catalog](https://catalog.ngc.nvidia.com/). You can obtain an API key by:

1. Creating an NGC account
2. Navigating to the API Keys section
3. Generating a new API key

### Installation Issues

If you encounter installation problems, ensure you have the latest version:

```bash
pip install --upgrade strands-nvidia-nim
```

## References

- [strands-nvidia-nim GitHub Repository](https://github.com/thiago4go/strands-nvidia-nim)
- [NVIDIA NIM Documentation](https://docs.nvidia.com/nim/)
- [NVIDIA NGC Catalog](https://catalog.ngc.nvidia.com/)
