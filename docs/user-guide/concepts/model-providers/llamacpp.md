# llama.cpp

[llama.cpp](https://github.com/ggml-org/llama.cpp) is a high-performance C++ inference engine for running large language models locally. Strands provides native support for llama.cpp servers, enabling you to run quantized models efficiently on resource-constrained hardware including edge devices.

The [`LlamaCppModel`](../../../api-reference/models.md#strands.models.llamacpp) class in Strands enables seamless integration with llama.cpp's OpenAI-compatible API, supporting:

- Text generation with advanced sampling parameters
- Multimodal capabilities (audio and images)
- Tool/function calling
- Grammar-constrained generation
- Native JSON schema validation
- Streaming responses
- Prompt caching for performance

## Getting Started

### Prerequisites

First install the python client into your python environment:
```bash
pip install strands-agents strands-agents-tools
```

Note: llama.cpp support is included in the base Strands package and requires no additional dependencies.

### Model Selection

llama.cpp supports any GGUF-format quantized model. Popular options include:
- **Llama 3**: Meta's latest foundation models
- **Qwen2.5**: Alibaba's multilingual models with multimodal variants
- **Mistral**: High-performance open models
- **Phi**: Microsoft's efficient small models

You can find GGUF models on [Hugging Face](https://huggingface.co/models?search=gguf). 

#### Quantization Formats

Choose the right quantization for your needs:
- **Q4_K_M**: Best balance of quality and size (recommended for most users)
- **Q5_K_M**: Higher quality, slightly larger
- **Q8_0**: Near-original quality, much larger
- **Q3_K_S**: Smaller size, reduced quality (for edge devices)

Next, you'll need to install and setup a llama.cpp server.

#### Option 1: Native Installation

1. Build llama.cpp from source:
   ```bash
   git clone https://github.com/ggml-org/llama.cpp
   cd llama.cpp
   make
   ```

2. Download a quantized model using Hugging Face CLI:
   ```bash
   # Install Hugging Face CLI if needed
   pip install huggingface-hub
   
   # Create models directory
   mkdir -p models && cd models
   
   # Example: Download Qwen2.5 7B quantized model
   huggingface-cli download ggml-org/Qwen2.5-7B-GGUF \
     Qwen2.5-7B-Q4_K_M.gguf --local-dir .
   
   # For multimodal models, also download the projector
   huggingface-cli download ggml-org/Qwen2.5-Omni-7B-GGUF \
     mmproj-Qwen2.5-Omni-7B-Q8_0.gguf --local-dir .
   
   cd ..
   ```

3. Start the llama.cpp server:
   ```bash
   # Basic text model
   ./llama-server -m models/Qwen2.5-7B-Q4_K_M.gguf \
     --host 0.0.0.0 --port 8080 -c 8192 --jinja
   
   # Multimodal model (with vision/audio support)
   ./llama-server -m models/Qwen2.5-Omni-7B-Q4_K_M.gguf \
     --mmproj models/mmproj-Qwen2.5-Omni-7B-Q8_0.gguf \
     --host 0.0.0.0 --port 8080 -c 8192 -ngl 50 --jinja
   ```

#### Option 2: Docker Installation

1. Pull the llama.cpp Docker image:
   ```bash
   docker pull ghcr.io/ggml-org/llama.cpp:server
   ```

2. Run the llama.cpp container with a model:
   ```bash
   docker run -d -v /path/to/models:/models -p 8080:8080 \
     ghcr.io/ggml-org/llama.cpp:server \
     -m /models/model.gguf --host 0.0.0.0 --port 8080
   ```

3. Verify the server is running:
   ```bash
   curl http://localhost:8080/health
   ```

## Basic Usage

Here's how to create an agent using a llama.cpp model:

```python
from strands import Agent
from strands.models.llamacpp import LlamaCppModel

# Create a llama.cpp model instance
llamacpp_model = LlamaCppModel(
    base_url="http://localhost:8080",  # llama.cpp server address
    model_id="default"                  # Model identifier (usually "default")
)

# Create an agent using the llama.cpp model
agent = Agent(model=llamacpp_model)

# Use the agent
agent("Tell me about Strands agents.") # Prints model output to stdout by default
```

## Configuration Options

The [`LlamaCppModel`](../../../api-reference/models.md#strands.models.llamacpp) supports extensive [configuration parameters](../../../api-reference/models.md#strands.models.llamacpp.LlamaCppModel.LlamaCppConfig):

### Standard Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `base_url` | The address of the llama.cpp server | "http://localhost:8080" |
| `model_id` | The model identifier | "default" |
| `temperature` | Controls randomness (0.0-2.0) | None |
| `max_tokens` | Maximum number of tokens to generate | None |
| `top_p` | Nucleus sampling parameter | None |
| `frequency_penalty` | Frequency penalty (-2.0 to 2.0) | None |
| `presence_penalty` | Presence penalty (-2.0 to 2.0) | None |
| `stop` | List of stop sequences | None |
| `seed` | Random seed for reproducibility | None |

### llama.cpp-Specific Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `repeat_penalty` | Penalize repeat tokens (1.0 = no penalty) | None |
| `top_k` | Top-k sampling (0 = disabled) | None |
| `min_p` | Min-p sampling threshold (0.0-1.0) | None |
| `typical_p` | Typical-p sampling (0.0-1.0) | None |
| `tfs_z` | Tail-free sampling parameter | None |
| `mirostat` | Mirostat sampling mode (0, 1, or 2) | None |
| `mirostat_lr` | Mirostat learning rate | None |
| `mirostat_ent` | Mirostat target entropy | None |
| `grammar` | GBNF grammar for constrained generation | None |
| `json_schema` | JSON schema for structured output | None |
| `cache_prompt` | Cache prompt for faster generation | None |

### Example with Configuration

```python
from strands import Agent
from strands.models.llamacpp import LlamaCppModel

# Create a configured llama.cpp model
llamacpp_model = LlamaCppModel(
    base_url="http://localhost:8080",
    model_id="default",
    params={
        "temperature": 0.7,
        "max_tokens": 500,
        "repeat_penalty": 1.1,
        "top_k": 40,
        "cache_prompt": True
    }
)

# Create an agent with the configured model
agent = Agent(model=llamacpp_model)

# Use the agent
response = agent("Write a short story about an AI assistant.")
```

## Advanced Features

### Grammar-Constrained Generation

llama.cpp supports GBNF grammar constraints to ensure output follows specific patterns:

```python
from strands import Agent
from strands.models.llamacpp import LlamaCppModel

# Create model with grammar constraint
llamacpp_model = LlamaCppModel(
    base_url="http://localhost:8080",
    params={
        "grammar": '''
            root ::= answer
            answer ::= "yes" | "no" | "maybe"
        '''
    }
)

agent = Agent(model=llamacpp_model)

# Response will be constrained to "yes", "no", or "maybe"
response = agent("Is the Earth flat?")
```

### Advanced Sampling Parameters

llama.cpp offers sophisticated sampling control for fine-tuning output quality. Here are recommended configurations for different use cases:

```python
# High Quality (Slower, more accurate)
high_quality_model = LlamaCppModel(
    base_url="http://localhost:8080",
    params={
        "temperature": 0.3,
        "top_k": 10,
        "repeat_penalty": 1.2,
        "max_tokens": 500
    }
)

# Balanced Performance (Good quality, reasonable speed) 
balanced_model = LlamaCppModel(
    base_url="http://localhost:8080",
    params={
        "temperature": 0.7,
        "top_k": 40,
        "min_p": 0.05,
        "cache_prompt": True
    }
)

# Creative Writing (More varied output)
creative_model = LlamaCppModel(
    base_url="http://localhost:8080",
    params={
        "temperature": 0.9,
        "top_p": 0.95,
        "typical_p": 0.95,
        "repeat_penalty": 1.1,
        "mirostat": 2,
        "mirostat_ent": 5.0
    }
)

# Speed Optimized (Fastest inference)
speed_model = LlamaCppModel(
    base_url="http://localhost:8080",
    params={
        "temperature": 0.8,
        "top_k": 20,
        "cache_prompt": True,
        "n_probs": 0  # Disable probability computation
    }
)
```

### Updating Configuration at Runtime

You can update the model configuration during runtime:

```python
# Create the model with initial configuration
llamacpp_model = LlamaCppModel(
    base_url="http://localhost:8080",
    params={"temperature": 0.7}
)

# Update configuration later
llamacpp_model.update_config(
    params={
        "temperature": 0.9,
        "top_k": 50
    }
)
```

### Structured Output

llama.cpp supports structured output through native JSON schema validation. When you use [`Agent.structured_output()`](../../../api-reference/agent.md#strands.agent.agent.Agent.structured_output), the model constrains its output to match your schema:

```python
from pydantic import BaseModel, Field
from strands import Agent
from strands.models.llamacpp import LlamaCppModel

class BookAnalysis(BaseModel):
    """Analyze a book's key information."""
    title: str = Field(description="The book's title")
    author: str = Field(description="The book's author")
    genre: str = Field(description="Primary genre or category")
    summary: str = Field(description="Brief summary of the book")
    rating: int = Field(description="Rating from 1-10", ge=1, le=10)

llamacpp_model = LlamaCppModel(
    base_url="http://localhost:8080"
)

agent = Agent(model=llamacpp_model)

result = agent.structured_output(
    BookAnalysis,
    """
    Analyze this book: "The Hitchhiker's Guide to the Galaxy" by Douglas Adams.
    It's a science fiction comedy about Arthur Dent's adventures through space
    after Earth is destroyed. It's widely considered a classic of humorous sci-fi.
    """
)

print(f"Title: {result.title}")
print(f"Author: {result.author}")
print(f"Genre: {result.genre}")
print(f"Rating: {result.rating}")
```

### Multimodal Support

For models that support multimodal input (e.g., Qwen2.5-Omni), llama.cpp can process audio and images. The SDK automatically handles the formatting for multimodal content:

```python
# Audio processing example with Qwen2.5-Omni
audio_message = {
    "role": "user",
    "content": [
        {
            "type": "audio",
            "audio": {
                "data": base64_encoded_audio,  # Base64 encoded audio
                "format": "wav"
            }
        },
        {
            "type": "text",
            "text": "Please transcribe what was said and identify the language."
        }
    ]
}

# Image analysis example
from PIL import Image
import io
import base64

# Load and encode image
img = Image.open("example.png")
img_bytes = io.BytesIO()
img.save(img_bytes, format='PNG')
img_base64 = base64.b64encode(img_bytes.getvalue()).decode()

image_message = {
    "role": "user", 
    "content": [
        {
            "type": "image",
            "image": {
                "data": img_base64,
                "format": "png"
            }
        },
        {
            "type": "text",
            "text": "Describe this image in detail."
        }
    ]
}

response = agent([image_message])
```

Note: Multimodal support requires:
1. A multimodal model (e.g., Qwen2.5-Omni)
2. The multimodal projector file (mmproj)
3. Starting the server with `--mmproj` flag

## Tool Support

llama.cpp models with function calling support can use tools through Strands' tool system:

```python
from strands import Agent
from strands.models.llamacpp import LlamaCppModel
from strands_tools import calculator, current_time

# Create a llama.cpp model
llamacpp_model = LlamaCppModel(
    base_url="http://localhost:8080"
)

# Create an agent with tools
agent = Agent(
    model=llamacpp_model,
    tools=[calculator, current_time]
)

# Use the agent with tools
response = agent("What's the square root of 144 plus the current time?")
```

## Performance Optimization

### Prompt Caching

Enable prompt caching for faster subsequent queries:

```python
llamacpp_model = LlamaCppModel(
    base_url="http://localhost:8080",
    params={"cache_prompt": True}
)
```

### Server Optimization

Optimize the llama.cpp server for your hardware:

```bash
# GPU acceleration (NVIDIA) - offload layers to GPU
./llama-server -m model.gguf --host 0.0.0.0 --port 8080 -ngl 50

# Full recommended configuration
./llama-server -m model.gguf \
  --host 0.0.0.0 \
  --port 8080 \
  -c 8192 \          # Larger context window
  -ngl 50 \          # GPU layers (adjust based on VRAM)
  --jinja \          # Enable Jinja templating
  --batch-size 512   # Optimize batch processing
```

Key optimization flags:
- `-ngl`: Number of layers to offload to GPU (0-100, adjust based on VRAM)
- `-c`: Context size (default 512, increase for longer conversations)
- `--jinja`: Required for proper chat template processing
- `--parallel`: Number of parallel slots for concurrent requests
- `--batch-size`: Batch size for prompt processing

## Related Resources

- [llama.cpp Documentation](https://github.com/ggml-org/llama.cpp)
- [llama.cpp Server Documentation](https://github.com/ggml-org/llama.cpp/tree/master/tools/server)
- [GGUF Model Format](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md)
- [Hugging Face GGUF Models](https://huggingface.co/models?search=gguf)