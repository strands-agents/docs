# AWS Neuron

{{ community_contribution_banner }}

!!! info "Language Support"
    This provider is only supported in Python.

[strands-neuron](https://pypi.org/project/strands-neuron/) is a vLLM on [AWS Neuron](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/vllm/index.html) model provider for Strands Agents SDK. It connects to vLLM servers running on [AWS AI Chips](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium.html) (Trainium and Inferentia) via an OpenAI-compatible API, enabling high-performance LLM inference on AWS Neuron hardware.

**Features:**

- **OpenAI-Compatible API**: Works with any OpenAI-compatible vLLM server
- **Full Streaming Support**: Async generators for real-time token streaming
- **Tool/Function Calling**: Native support for function calling and tool use
- **Structured Output**: Generate structured data via tool calls
- **Neuron-Optimized**: Designed for AWS Neuron hardware acceleration
- **Flexible Configuration**: Extensive configuration options for model behavior

!!! warning "Parallel Tool Calling Support"
    Tool calling support depends on the underlying model:

    - **Llama 3.1 models**: Only support single tool calls at once
    - **Llama 4 models**: Support parallel tool calls
    - **Other models with parallel support**: Granite 3.1, xLAM, Pythonic parser models

    If you encounter `"This model only supports single tool-calls at once!"`, this is a model limitation, not a configuration issue. Workarounds: use a model that supports parallel tool calls (Llama 4, Granite 3.1, xLAM), design agents to use one tool at a time, or use `structured_output()` which only requires a single tool call.

## Installation

Install strands-neuron along with the Strands Agents SDK:

```bash
pip install strands-neuron strands-agents strands-agents-tools
```

## Requirements

- AWS EC2 instance with Neuron hardware (inf2, trn1, trn2, or trn3)
- AWS Neuron Deep Learning AMI (DLAMI) for Ubuntu 22.04
- Running vLLM Neuron server accessible via HTTP

## Usage

### 1. Start the vLLM Neuron Server

Set up and start your vLLM Neuron server on your AWS Neuron instance. The server should expose an OpenAI-compatible endpoint (default: `http://localhost:8080/v1`).

For tool calling support, start vLLM with the appropriate flags:

```bash
vllm serve <MODEL_ID> \
    --host 0.0.0.0 \
    --port 8080 \
    --enable-auto-tool-choice \
    --tool-call-parser <PARSER>  # e.g., llama3_json, mistral, etc.
```

### 2. Basic Agent

```python
from strands import Agent
from strands_neuron import NeuronModel

model = NeuronModel(
    config={
        "model_id": "mistralai/Mistral-7B-Instruct-v0.3",
        "base_url": "http://localhost:8080/v1",
        "api_key": "EMPTY",  # Not required for local servers
        # "support_tool_choice_auto": True,  # Set if vLLM has --enable-auto-tool-choice
    }
)

agent = Agent(
    system_prompt="You are a helpful assistant.",
    model=model,
)

response = agent("What is machine learning?")
print(response)
```

### 3. Streaming

```python
import asyncio
from strands_neuron import NeuronModel

async def main():
    model = NeuronModel(
        config={
            "model_id": "mistralai/Mistral-7B-Instruct-v0.3",
            "base_url": "http://localhost:8080/v1",
            "api_key": "EMPTY",
        }
    )

    messages = [{"role": "user", "content": [{"text": "Explain Python"}]}]

    async for event in model.stream(messages, system_prompt="You are a coding assistant."):
        if "contentBlockDelta" in event:
            delta = event["contentBlockDelta"].get("delta", {})
            if "text" in delta:
                print(delta["text"], end="", flush=True)

asyncio.run(main())
```

## Configuration

### Model Configuration

The `NeuronModel` accepts a `config` dictionary with the following parameters:

| Parameter | Description | Example | Required |
| --------- | ----------- | ------- | -------- |
| `model_id` | Model identifier | `"mistralai/Mistral-7B-Instruct-v0.3"` | Yes |
| `base_url` | Base URL for the OpenAI-compatible API | `"http://localhost:8080/v1"` | No (default: `"http://localhost:8080/v1"`) |
| `api_key` | API key for authentication | `"EMPTY"` | No (default: `"EMPTY"`) |
| `support_tool_choice_auto` | Set `True` if vLLM has `--enable-auto-tool-choice` and `--tool-call-parser` flags | `True` | No (default: `False`) |
| `temperature` | Sampling temperature (0.0 to 2.0) | `0.7` | No |
| `top_p` | Nucleus sampling parameter | `0.9` | No |
| `max_completion_tokens` | Maximum tokens to generate | `1000` | No |
| `stop` | Sequences that stop generation | `["\n\n"]` | No |
| `frequency_penalty` | Penalize tokens based on frequency (-2.0 to 2.0) | `0.0` | No |
| `presence_penalty` | Penalize tokens based on presence (-2.0 to 2.0) | `0.0` | No |
| `additional_args` | Additional arguments passed to the API request | `{}` | No |

### Example Configuration

```python
model = NeuronModel(
    config={
        "model_id": "mistralai/Mistral-7B-Instruct-v0.3",
        "base_url": "http://localhost:8080/v1",
        "api_key": "EMPTY",
        "temperature": 0.7,
        "top_p": 0.9,
        "max_completion_tokens": 1000,
        "support_tool_choice_auto": True,
    }
)
```

## Troubleshooting

### Connection errors to vLLM server

Ensure your vLLM Neuron server is running and accessible:

```bash
curl http://localhost:8080/health
```

### Model only supports single tool calls

If you see `"This model only supports single tool-calls at once!"`, this is a model-level constraint. Switch to a model that supports parallel tool calls (Llama 4, Granite 3.1, xLAM), or use `structured_output()` for single-tool workflows.

### Tool calling not working

Ensure the vLLM server was started with `--enable-auto-tool-choice` and `--tool-call-parser` flags, and set `"support_tool_choice_auto": True` in the model config.

## References

* [strands-neuron on PyPI](https://pypi.org/project/strands-neuron/)
* [AWS Neuron Documentation](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/)
* [NxD Inference vLLM Integration](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/vllm/index.html)
* [Strands Agents API](../../api-reference/python/models/model.md)
