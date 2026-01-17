# vLLM

{{ community_contribution_banner }}

!!! info "Language Support"
    This provider is only supported in Python.

[strands-vllm](https://github.com/agents-community/strands-vllm) is a [vLLM](https://docs.vllm.ai/) model provider for Strands Agents SDK with Token-In/Token-Out (TITO) support for agentic RL training. It provides integration with vLLM's OpenAI-compatible API, optimized for reinforcement learning workflows with [Agent Lightning](https://blog.vllm.ai/2025/10/22/agent-lightning.html).

**Features:**

- **OpenAI-Compatible API**: Uses vLLM's OpenAI-compatible `/v1/chat/completions` endpoint with streaming
- **TITO Support**: Captures `prompt_token_ids` and `token_ids` directly from vLLM - no retokenization drift
- **Tool Call Validation**: Hook-based validation to reject unknown tools and invalid JSON inputs (RL-friendly error feedback)
- **Agent Lightning Integration**: Automatically adds token IDs to OpenTelemetry spans for RL training data extraction
- **Streaming**: Full streaming support with token ID capture via `VLLMTokenRecorder`

## Installation

Install strands-vllm along with the Strands Agents SDK:

```bash
pip install strands-vllm strands-agents-tools
```

For retokenization drift demos (requires HuggingFace tokenizer):

```bash
pip install "strands-vllm[drift]" strands-agents-tools
```

## Requirements

- vLLM server running with your model (v0.10.2+ for `return_token_ids` support)
- For tool calling: vLLM must be started with tool-calling enabled and appropriate chat template

## Usage

### 1. Start vLLM Server

First, start a vLLM server with your model:

```bash
vllm serve <MODEL_ID> \
    --host 0.0.0.0 \
    --port 8000
```

For tool calling support, add the appropriate flags for your model:

```bash
vllm serve <MODEL_ID> \
    --host 0.0.0.0 \
    --port 8000 \
    --enable-auto-tool-choice \
    --tool-call-parser <PARSER>  # e.g., llama3_json, hermes, etc.
```

See [vLLM tool calling documentation](https://docs.vllm.ai/en/latest/features/tool_calling.html) for supported parsers and chat templates.

### 2. Basic Agent

```python
import os
from strands import Agent
from strands_vllm import VLLMModel, VLLMTokenRecorder

# Configure via environment variables or directly
base_url = os.getenv("VLLM_BASE_URL", "http://localhost:8000/v1")
model_id = os.getenv("VLLM_MODEL_ID", "<YOUR_MODEL_ID>")

model = VLLMModel(
    base_url=base_url,
    model_id=model_id,
    return_token_ids=True,
)

recorder = VLLMTokenRecorder()
agent = Agent(model=model, callback_handler=recorder)

result = agent("What is the capital of France?")
print(result)

# Access TITO data for RL training
print(f"Prompt tokens: {len(recorder.prompt_token_ids or [])}")
print(f"Response tokens: {len(recorder.token_ids or [])}")
```

### 3. Tool Call Validation (Recommended for RL)

vLLM tool parsers can post-process model outputs, potentially creating tool calls for unknown tools. Use `VLLMToolValidationHooks` to validate tool calls before execution:

```python
import os
from strands import Agent
from strands_tools.calculator import calculator
from strands_vllm import VLLMModel, VLLMToolValidationHooks

model = VLLMModel(
    base_url=os.getenv("VLLM_BASE_URL", "http://localhost:8000/v1"),
    model_id=os.getenv("VLLM_MODEL_ID", "<YOUR_MODEL_ID>"),
    return_token_ids=True,
)

# Add validation hook - rejects unknown tools with deterministic error feedback
agent = Agent(
    model=model,
    tools=[calculator],
    hooks=[VLLMToolValidationHooks()],
)

result = agent("Compute 17 * 19 using the calculator tool.")
print(result)
```

The hook validates:

- **Tool name**: Must exist in agent's tool registry
- **Tool input**: If input is a JSON string, must be valid JSON (catches `JSONDecodeError`)

Invalid tool calls receive a deterministic error `toolResult`, providing clean RL signals.

### 4. Agent Lightning Integration

`VLLMTokenRecorder` automatically adds token IDs to OpenTelemetry spans for [Agent Lightning](https://blog.vllm.ai/2025/10/22/agent-lightning.html) compatibility:

```python
import os
from strands import Agent
from strands_vllm import VLLMModel, VLLMTokenRecorder

model = VLLMModel(
    base_url=os.getenv("VLLM_BASE_URL", "http://localhost:8000/v1"),
    model_id=os.getenv("VLLM_MODEL_ID", "<YOUR_MODEL_ID>"),
    return_token_ids=True,
)

# add_to_span=True (default) adds token IDs to OpenTelemetry spans
recorder = VLLMTokenRecorder(add_to_span=True)
agent = Agent(model=model, callback_handler=recorder)

result = agent("Hello!")
```

The following span attributes are set:

| Attribute | Description |
| --------- | ----------- |
| `llm.token_count.prompt` | Token count for the prompt (OpenTelemetry semantic convention) |
| `llm.token_count.completion` | Token count for the completion (OpenTelemetry semantic convention) |
| `llm.hosted_vllm.prompt_token_ids` | Token ID array for the prompt |
| `llm.hosted_vllm.response_token_ids` | Token ID array for the response |

### 5. RL Training with TokenManager

For building RL-ready trajectories with loss masks:

```python
import asyncio
import os
from strands import Agent, tool
from strands_tools.calculator import calculator as _calculator_impl
from strands_vllm import TokenManager, VLLMModel, VLLMTokenRecorder, VLLMToolValidationHooks

@tool
def calculator(expression: str) -> dict:
    return _calculator_impl(expression=expression)

async def main():
    model = VLLMModel(
        base_url=os.getenv("VLLM_BASE_URL", "http://localhost:8000/v1"),
        model_id=os.getenv("VLLM_MODEL_ID", "<YOUR_MODEL_ID>"),
        return_token_ids=True,
    )

    recorder = VLLMTokenRecorder()
    agent = Agent(
        model=model,
        tools=[calculator],
        hooks=[VLLMToolValidationHooks()],
        callback_handler=recorder,
    )

    await agent.invoke_async("What is 25 * 17?")

    # Build RL trajectory with loss mask
    tm = TokenManager()
    for entry in recorder.history:
        if entry.get("prompt_token_ids"):
            tm.add_prompt(entry["prompt_token_ids"])  # loss_mask=0
        if entry.get("token_ids"):
            tm.add_response(entry["token_ids"])       # loss_mask=1

    print(f"Total tokens: {len(tm)}")
    print(f"Prompt tokens: {sum(1 for m in tm.loss_mask if m == 0)}")
    print(f"Response tokens: {sum(1 for m in tm.loss_mask if m == 1)}")
    print(f"Token IDs: {tm.token_ids[:20]}...")  # First 20 tokens
    print(f"Loss mask: {tm.loss_mask[:20]}...")

asyncio.run(main())
```

## Configuration

### Model Configuration

The `VLLMModel` accepts the following parameters:

| Parameter | Description | Example | Required |
| --------- | ----------- | ------- | -------- |
| `base_url` | vLLM server URL | `"http://localhost:8000/v1"` | Yes |
| `model_id` | Model identifier | `"<YOUR_MODEL_ID>"` | Yes |
| `api_key` | API key (usually "EMPTY" for local vLLM) | `"EMPTY"` | No (default: "EMPTY") |
| `return_token_ids` | Request token IDs from vLLM | `True` | No (default: False) |
| `disable_tools` | Remove tools/tool_choice from requests | `True` | No (default: False) |
| `params` | Additional generation parameters | `{"temperature": 0, "max_tokens": 256}` | No |

### VLLMTokenRecorder Configuration

| Parameter | Description | Default |
| --------- | ----------- | ------- |
| `inner` | Inner callback handler to chain | `None` |
| `add_to_span` | Add token IDs to OpenTelemetry spans | `True` |

### VLLMToolValidationHooks

No configuration required. Simply add to agent's hooks:

```python
agent = Agent(model=model, tools=[...], hooks=[VLLMToolValidationHooks()])
```

## Why TITO Matters

In agent RL training, retokenization drift can cause training instability:

1. **Non-unique tokenization**: The word "HAVING" might be tokenized as `H` + `AVING` during generation but `HAV` + `ING` when retokenized
2. **Tool-call serialization**: Tool call JSON may be normalized/reformatted by parsers
3. **Chat template differences**: Different frameworks may use different chat templates

Using vLLM's `return_token_ids` feature captures the exact tokens used during inference, eliminating these issues.

Reference: [No More Retokenization Drift](https://blog.vllm.ai/2025/10/22/agent-lightning.html)

## Troubleshooting

### Connection errors to vLLM server

Ensure your vLLM server is running and accessible:

```bash
# Check if server is responding
curl http://localhost:8000/health
```

### No token IDs captured

Ensure:

1. vLLM version is 0.10.2 or later
2. `return_token_ids=True` is set on `VLLMModel`
3. Your vLLM server supports `return_token_ids` in streaming mode

### Tool calls for unknown tools

If vLLM's tool parser produces tool calls for tools not in your registry, add `VLLMToolValidationHooks` to get deterministic error feedback instead of crashes.

### Model only supports single tool calls

Some models/chat templates only support one tool call per message. If you see `"This model only supports single tool-calls at once!"`, adjust your prompts to request one tool at a time.

## References

* [strands-vllm Repository](https://github.com/agents-community/strands-vllm)
* [vLLM Documentation](https://docs.vllm.ai/)
* [Agent Lightning GitHub](https://github.com/microsoft/agent-lightning) - The absolute trainer to light up AI agents
* [Agent Lightning Blog Post](https://blog.vllm.ai/2025/10/22/agent-lightning.html) - No More Retokenization Drift
* [Strands Agents API](../../api-reference/python/models/model.md)
