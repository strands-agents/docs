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

Model APIs provide access to popular models through a common API endpoint:

```python
from strands.models.baseten import BasetenModel

# DeepSeek R1 model
model = BasetenModel(
    model_id="deepseek-ai/DeepSeek-R1-0528",
    client_args={
        "api_key": "your-api-key",
    },
)

# DeepSeek V3 model
model = BasetenModel(
    model_id="deepseek-ai/DeepSeek-V3-0324",
    client_args={
        "api_key": "your-api-key",
    },
)

# Llama 4 Maverick model
model = BasetenModel(
    model_id="meta-llama/Llama-4-Maverick-17B-128E-Instruct",
    client_args={
        "api_key": "your-api-key",
    },
)

# Llama 4 Scout model
model = BasetenModel(
    model_id="meta-llama/Llama-4-Scout-17B-16E-Instruct",
    client_args={
        "api_key": "your-api-key",
    },
)
```

**Available Model APIs:**

* `deepseek-ai/DeepSeek-R1-0528`: DeepSeek R1 0528 model
* `deepseek-ai/DeepSeek-V3-0324`: DeepSeek V3 0324 model
* `meta-llama/Llama-4-Maverick-17B-128E-Instruct`: Llama 4 Maverick 17B model
* `meta-llama/Llama-4-Scout-17B-16E-Instruct`: Llama 4 Scout 17B model

### Dedicated Deployments

Dedicated deployments provide custom model hosting with dedicated infrastructure:

```python
from strands.models.baseten import BasetenModel

deployment_id = "dq4kr413"  # Your deployment ID
environment = "production"   # Environment (default: "production")
base_url = f"https://model-{deployment_id}.api.baseten.co/environments/{environment}/sync/v1"

model = BasetenModel(
    model_id=deployment_id,
    base_url=base_url,
    environment=environment,
    client_args={
        "api_key": "your-api-key",
    },
)
```

**Environment Options:**

* `production`: Production environment (default)
* `staging`: Staging environment
* `development`: Development environment

## Usage

After installing `strands-agents[baseten]`, you can import and initialize the Strands Agents' Baseten provider as follows:

```python
from strands import Agent
from strands.models.baseten import BasetenModel

# Initialize model
model = BasetenModel(
    model_id="deepseek-ai/DeepSeek-V3-0324",
    client_args={"api_key": "your-api-key"},
)

# Create agent
agent = Agent(model=model)

# Chat with the model
response = agent("Hello! How are you?")
print(response)
```

Baseten models 


## References

* [Baseten Documentation](https://docs.baseten.co/)
* [Strands SDK Documentation](https://docs.strands.ai/)


