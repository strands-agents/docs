# MLX (Apple Silicon)

{{ community_contribution_banner }}

!!! info "Language Support"
    This provider is only supported in Python.

!!! warning "Platform Requirement"
    MLX is designed specifically for Apple Silicon (M1/M2/M3/M4 chips) and CUDA environments. Requires Python ≤3.13 on macOS or Linux.

[MLX](https://github.com/ml-explore/mlx) is Apple's machine learning framework optimized for Apple Silicon. The `strands-mlx` provider enables local inference, LoRA fine-tuning, and vision capabilities on Apple Silicon devices with support for mlx-community quantized models.

## Installation

To use MLX models with Strands Agents on Apple Silicon:

```bash
# Create virtual environment with Python 3.13
uv venv --python 3.13 && source .venv/bin/activate

# Install dependencies
uv pip install strands-mlx strands-agents-tools
```

Or with pip:

```bash
pip install strands-mlx strands-agents-tools
```

## Quick Start

### Basic Text Inference

```python
from strands import Agent
from strands_mlx import MLXModel
from strands_tools import calculator

model = MLXModel(model_id="mlx-community/Qwen3-1.7B-4bit")
agent = Agent(model=model, tools=[calculator])

agent("What is 29 * 42?")
```

### Vision Models

```python
from strands import Agent
from strands_mlx import MLXVisionModel

model = MLXVisionModel(model_id="mlx-community/Qwen2-VL-2B-Instruct-4bit")
agent = Agent(model=model)

agent("Describe: <image>photo.jpg</image>")
agent("Transcribe: <audio>speech.wav</audio>")
agent("What happens: <video>clip.mp4</video>")
```

## Training Your Own Models

The `strands-mlx` provider includes a complete LoRA training pipeline that enables continuous learning. Agents can collect their own training data and fine-tune themselves into domain experts.

### Architecture

The training cycle follows these steps:

1. **Collect Training Data**: Agent conversations are automatically saved to JSONL
2. **Split Dataset**: Divide data into train/validation/test sets
3. **Train with LoRA**: Fine-tune using the collected data
4. **Use Trained Model**: Deploy the domain expert agent

### Step 1: Collect Training Data

```python
from strands import Agent
from strands_tools import calculator
from strands_mlx import MLXModel, MLXSessionManager, dataset_splitter, mlx_trainer

agent = Agent(
    model=MLXModel(model_id="mlx-community/Qwen3-1.7B-4bit"),
    session_manager=MLXSessionManager(session_id="my_training", storage_dir="./dataset"),
    tools=[calculator, dataset_splitter, mlx_trainer],
)

# Have conversations - auto-saved to JSONL
agent("Teach me about quantum computing")
agent("Calculate 15 * 7")

# Saved to: ./dataset/my_training.jsonl
```

### Step 2: Split Dataset

```python
agent.tool.dataset_splitter(
    input_path="./dataset/my_training.jsonl"
)
# Creates train.jsonl, valid.jsonl, test.jsonl (80/10/10 split)
```

### Step 3: Train with LoRA

```python
agent.tool.mlx_trainer(
    action="train",
    config={
        "model": "mlx-community/Qwen3-1.7B-4bit",
        "data": "./dataset/my_training",
        "adapter_path": "./adapter",
        "iters": 200,
        "learning_rate": 1e-5,
        "batch_size": 1
    }
)
```

### Step 4: Use Trained Model

```python
from strands import Agent
from strands_mlx import MLXModel

trained = MLXModel("mlx-community/Qwen3-1.7B-4bit", adapter_path="./adapter")
agent = Agent(model=trained)

agent("Explain quantum computing")  # Uses trained knowledge!
```

### Advanced Training with YAML Config

Create a `lora_config.yaml`:

```yaml
model: mlx-community/Qwen3-1.7B-4bit
data: ./training_data
iters: 1000
learning_rate: 1e-5
lora_parameters:
  rank: 8
  scale: 16.0
lr_schedule:
  name: cosine_decay
  warmup: 100
optimizer: adamw
```

Use the config:

```python
agent.tool.mlx_trainer(action="train", config="./lora_config.yaml")
```

## Available Tools

The `strands-mlx` provider includes specialized tools for training and model management:

| Tool | Purpose |
|------|---------|
| `mlx_trainer` | Background LoRA training |
| `dataset_splitter` | Split JSONL → train/valid/test |
| `validate_training_data` | Check format & token counts |
| `mlx_invoke` | Runtime model switching |
| `mlx_vision_invoke` | Vision as a tool |

## Features

- ✅ **Local Inference** - Run models entirely on-device with no cloud dependency
- ✅ **Apple Silicon Optimization** - Leverages unified memory architecture
- ✅ **Quantized Models** - 4-bit quantization for reduced memory usage
- ✅ **LoRA Fine-tuning** - Customize models with your own data
- ✅ **Vision Support** - Image, audio, and video understanding
- ✅ **Training Pipeline** - Built-in support for model training with MLXSessionManager
- ✅ **Dynamic Model Loading** - Switch models without restarting
- ✅ **Low Latency** - Fast inference on Apple Silicon

## Troubleshooting

### `MLX not supported on this platform`

MLX only works on Apple Silicon (M1/M2/M3/M4). Verify your chip:

```bash
sysctl -n machdep.cpu.brand_string
```

Look for "Apple M1", "Apple M2", "Apple M3", or "Apple M4" in the output.

### Out of Memory Errors

If you encounter memory issues during training or inference:

```python
# Reduce memory usage
config = {
    "grad_checkpoint": True,
    "batch_size": 1,
    "max_seq_length": 1024
}
```

Also consider:

1. Use smaller models (1-3B parameters)
2. Reduce `max_tokens` parameter
3. Close other applications
4. Ensure you're using 4-bit quantized models (`-4bit` suffix)

### Model Degradation After Training

If your fine-tuned model performs worse than the base model:

```python
config = {
    "iters": 200,        # Lower iterations for small datasets
    "learning_rate": 1e-5  # Conservative learning rate
}
```

Monitor training loss and validation metrics to detect overfitting early.

### Slow Inference

Ensure you're using quantized models (`-4bit` suffix) and have sufficient RAM available. Monitor memory usage:

```bash
# Check memory pressure
memory_pressure

# Monitor activity (press Cmd+Space, type "Activity Monitor")
```

## References

- [strands-mlx GitHub Repository](https://github.com/cagataycali/strands-mlx)
- [MLX Framework](https://github.com/ml-explore/mlx)
- [MLX Community Models](https://huggingface.co/mlx-community)
- [Apple MLX Documentation](https://ml-explore.github.io/mlx/)
