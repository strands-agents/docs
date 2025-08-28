# Baseten

[Baseten](https://baseten.co) is an AI inference provider that supports open-source, fine-tuned, and custom models of all modalities. The Strands Agents SDK can be used to run against powered by any OpenAI-compatible LLM hosted on Baseten.

Baseten offers two options for LLM inference, both of which are compatible with the Strands Agents SDK:

- **Model APIs**: Access to pre-deployed models like DeepSeek and Llama
- **Dedicated Deployments**: Custom model deployments with dedicated infrastructure

## Installation

Baseten is configured as an optional dependency in Strands Agents. To install, run:

```bash
pip install 'strands-agents[baseten]'
```

## Configuration

### API Key

You'll need a Baseten API key to use the service. Set it as an environment variable:

```bash
export BASETEN_API_KEY="your-api-key-here"
```

### Model APIs

Model APIs provide access to popular models through a common API endpoint. The SDK automatically uses the correct base URL for Model APIs:

```python
from strands.models.baseten import BasetenModel

# DeepSeek R1 model
model = BasetenModel(
    model_id="deepseek-ai/DeepSeek-R1-0528",
    client_args={
        "api_key": os.getenv("BASETEN_API_KEY"),
    },
)

# DeepSeek V3 model
model = BasetenModel(
    model_id="deepseek-ai/DeepSeek-V3-0324",
    client_args={
        "api_key": os.getenv("BASETEN_API_KEY"),
    },
)

# Llama 4 Maverick model
model = BasetenModel(
    model_id="meta-llama/Llama-4-Maverick-17B-128E-Instruct",
    client_args={
        "api_key": os.getenv("BASETEN_API_KEY"),
    },
)

# Llama 4 Scout model
model = BasetenModel(
    model_id="meta-llama/Llama-4-Scout-17B-16E-Instruct",
    client_args={
        "api_key": os.getenv("BASETEN_API_KEY"),
    },
)
```

Check the Baseten documentation for a [complete list of Model APIs](https://docs.baseten.co/development/model-apis/overview).

### Dedicated Deployments

Dedicated deployments provide custom model hosting with dedicated infrastructure. You'll need to specify the custom base URL:

```python
from strands.models.baseten import BasetenModel

# Replace with your model URL
base_url = "https://model-abcd1234.api.baseten.co/environments/production/sync/v1"

model = BasetenModel(
    model_id="",
    base_url=base_url,
    client_args={
        "api_key": os.getenv("BASETEN_API_KEY"),
    },
)
```

### Model Parameters

You can configure model parameters using the `params` argument:

```python
model = BasetenModel(
    model_id="deepseek-ai/DeepSeek-V3-0324",
    client_args={"api_key": os.getenv("BASETEN_API_KEY")},
    params={
        "max_tokens": 1000,
        "temperature": 0.7
    },
)
```

## Usage

After installing `strands-agents[baseten]`, you can import and initialize the Strands Agents' Baseten provider as follows:

### Basic Usage

```python
from strands import Agent
from strands.models.baseten import BasetenModel

# Initialize model
model = BasetenModel(
    model_id="deepseek-ai/DeepSeek-V3-0324",
    client_args={"api_key": os.getenv("BASETEN_API_KEY")},
)

# Create agent
agent = Agent(model=model)

# Chat with the model
response = agent("Hello! How are you?")
print(response)
```

### Async Usage

The BasetenModel supports async operations:

```python
import asyncio
from strands.models.baseten import BasetenModel

async def chat_with_model():
    model = BasetenModel(
        model_id="deepseek-ai/DeepSeek-V3-0324",
        client_args={"api_key": os.getenv("BASETEN_API_KEY")},
    )
    
    messages = [{"role": "user", "content": [{"text": "Hello!"}]}]
    
    async for event in model.stream(messages):
        print(event)

# Run the async function
asyncio.run(chat_with_model())
```

### Structured Output

You can get structured output using Pydantic models:

```python
from pydantic import BaseModel
from strands.models.baseten import BasetenModel

class MathResult(BaseModel):
    answer: int
    explanation: str

model = BasetenModel(
    model_id="deepseek-ai/DeepSeek-V3-0324",
    client_args={"api_key": os.getenv("BASETEN_API_KEY")},
)

messages = [{"role": "user", "content": [{"text": "What is 5 + 3?"}]}]

async for result in model.structured_output(MathResult, messages):
    print(f"Answer: {result['output'].answer}")
    print(f"Explanation: {result['output'].explanation}")
```

### With Tools

Baseten models support tool use for function calling:

```python
from strands.models.baseten import BasetenModel

model = BasetenModel(
    model_id="deepseek-ai/DeepSeek-V3-0324",
    client_args={"api_key": os.getenv("BASETEN_API_KEY")},
)

tool_specs = [
    {
        "name": "calculator",
        "description": "A simple calculator",
        "inputSchema": {
            "json": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string"}
                },
                "required": ["expression"]
            }
        }
    }
]

messages = [{"role": "user", "content": [{"text": "Calculate 2 + 2"}]}]

async for event in model.stream(messages, tool_specs=tool_specs):
    print(event)
```

### Configuration Management

You can update model configuration at runtime:

```python
model = BasetenModel(
    model_id="deepseek-ai/DeepSeek-V3-0324",
    client_args={"api_key": os.getenv("BASETEN_API_KEY")},
    params={"max_tokens": 100}
)

# Update configuration
model.update_config(params={"max_tokens": 200, "temperature": 0.8})

# Get current configuration
config = model.get_config()
print(config)
```

## References

* [Baseten Documentation](https://docs.baseten.co/)
* [Strands SDK Documentation](https://docs.strands.ai/)
