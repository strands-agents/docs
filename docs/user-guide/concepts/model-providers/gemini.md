# Gemini

[Google Gemini](https://ai.google.dev/api) is Google's family of multimodal large language models designed for advanced reasoning, code generation, and creative tasks. The Strands Agents SDK implements a Gemini provider, allowing you to run agents against the Gemini models available through Google's AI API.

## Installation

Gemini is configured as an optional dependency in Strands Agents.

=== "Python"

    ```bash
    pip install 'strands-agents[gemini]' strands-agents-tools
    ```

=== "TypeScript"

    ```bash
    npm install @strands-agents/sdk @google/genai
    ```

## Usage

After installing dependencies, you can import and initialize the Strands Agents' Gemini provider as follows:

=== "Python"

    ```python
    from strands import Agent
    from strands.models.gemini import GeminiModel
    from strands_tools import calculator

    model = GeminiModel(
        client_args={
            "api_key": "<KEY>",
        },
        # **model_config
        model_id="gemini-2.5-flash",
        params={
            # some sample model parameters
            "temperature": 0.7,
            "max_output_tokens": 2048,
            "top_p": 0.9,
            "top_k": 40
        }
    )

    agent = Agent(model=model, tools=[calculator])
    response = agent("What is 2+2")
    print(response)
    ```

=== "TypeScript"

    ```typescript
    import { Agent } from '@strands-agents/sdk'
    import { GeminiModel } from '@strands-agents/sdk/gemini'

    const model = new GeminiModel({
      apiKey: '<KEY>',
      modelId: 'gemini-2.5-flash',
      params: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.9,
        topK: 40,
      },
    })

    const agent = new Agent({ model })
    const response = await agent.invoke('What is 2+2')
    console.log(response)
    ```

## Configuration

### Client Configuration

=== "Python"

    The `client_args` configure the underlying Google GenAI client. For a complete list of available arguments, please refer to the [Google GenAI documentation](https://googleapis.github.io/python-genai/).

=== "TypeScript"

    The `clientConfig` configures the underlying Google GenAI client. You can also pass a pre-configured `client` instance directly. For a complete list of available options, please refer to the [@google/genai documentation](https://github.com/googleapis/js-genai).

### Model Configuration

=== "Python"

    The `model_config` configures the underlying model selected for inference. The supported configurations are:

    |  Parameter | Description | Example | Options |
    |------------|-------------|---------|---------|
    | `model_id` | ID of a Gemini model to use | `"gemini-2.5-flash"` | [Available models](#available-models) |
    | `params` | Model specific parameters | `{"temperature": 0.7, "maxOutputTokens": 2048}` | [Parameter reference](#model-parameters) |

=== "TypeScript"

    |  Parameter | Description | Example | Options |
    |------------|-------------|---------|---------|
    | `modelId` | ID of a Gemini model to use | `'gemini-2.5-flash'` | [Available models](#available-models) |
    | `params` | Model specific parameters | `{ temperature: 0.7, maxOutputTokens: 2048 }` | [Parameter reference](#model-parameters) |
    | `apiKey` | Gemini API key (falls back to `GEMINI_API_KEY` env var) | `'your-api-key'` | |

### Model Parameters

For a complete list of supported parameters, see the [Gemini API documentation](https://ai.google.dev/api/generate-content#generationconfig).

**Common Parameters:**
| Parameter | Description | Type |
|-----------|-------------|------|
| `temperature` | Controls randomness in responses | `float` |
| `max_output_tokens` / `maxOutputTokens` | Maximum tokens to generate | `int` |
| `top_p` / `topP` | Nucleus sampling parameter | `float` |
| `top_k` / `topK` | Top-k sampling parameter | `int` |
| `candidate_count` | Number of response candidates | `int` |
| `stop_sequences` | Custom stopping sequences | `list[str]` / `string[]` |

**Example:**

=== "Python"

    ```python
    params = {
        "temperature": 0.8,
        "max_output_tokens": 4096,
        "top_p": 0.95,
        "top_k": 40,
        "candidate_count": 1,
        "stop_sequences": ['STOP!']
    }
    ```

=== "TypeScript"

    ```typescript
    const params = {
      temperature: 0.8,
      maxOutputTokens: 4096,
      topP: 0.95,
      topK: 40,
      candidateCount: 1,
      stopSequences: ['STOP!'],
    }
    ```

### Available Models

For a complete list of supported models, see the [Gemini API documentation](https://ai.google.dev/gemini-api/docs/models).

**Popular Models:**

- `gemini-2.5-pro` - Most advanced model for complex reasoning and thinking
- `gemini-2.5-flash` - Best balance of performance and cost
- `gemini-2.5-flash-lite` - Most cost-efficient option
- `gemini-2.0-flash` - Next-gen features with improved speed
- `gemini-2.0-flash-lite` - Cost-optimized version of 2.0

## Troubleshooting

### Module Not Found

=== "Python"

    If you encounter the error `ModuleNotFoundError: No module named 'google.genai'`, this means the `google-genai` dependency hasn't been properly installed in your environment. To fix this, run `pip install 'strands-agents[gemini]'`.

=== "TypeScript"

    If you encounter import errors for `@google/genai`, ensure the package is installed: `npm install @google/genai`.

### API Key Issues

Make sure your Google AI API key is properly set via `client_args` (Python) or `apiKey` (TypeScript), or as the `GOOGLE_API_KEY` / `GEMINI_API_KEY` environment variable. You can obtain an API key from the [Google AI Studio](https://aistudio.google.com/app/apikey).

### Rate Limiting and Safety Issues

The Gemini provider handles several types of errors automatically:

- **Safety/Content Policy**: When content is blocked due to safety concerns, the model will return a safety message
- **Rate Limiting**: When quota limits are exceeded, a `ModelThrottledException` is raised
- **Server Errors**: Temporary server issues are handled with appropriate error messages

=== "Python"

    ```python
    from strands.types.exceptions import ModelThrottledException

    try:
        response = agent("Your query here")
    except ModelThrottledException as e:
        print(f"Rate limit exceeded: {e}")
        # Implement backoff strategy
    ```

=== "TypeScript"

    ```typescript
    try {
      const response = await agent.invoke('Your query here')
    } catch (error) {
      console.error('Error:', error)
      // Implement backoff strategy
    }
    ```

## Advanced Features

### Structured Output

Gemini models support structured output through their native JSON schema capabilities. When you use [`Agent.structured_output()`](../../../api-reference/python/agent/agent.md#strands.agent.agent.Agent.structured_output), the Strands SDK automatically converts your Pydantic models to Gemini's JSON schema format.

=== "Python"

    ```python
    from pydantic import BaseModel, Field
    from strands import Agent
    from strands.models.gemini import GeminiModel

    class MovieReview(BaseModel):
        """Analyze a movie review."""
        title: str = Field(description="Movie title")
        rating: int = Field(description="Rating from 1-10", ge=1, le=10)
        genre: str = Field(description="Primary genre")
        sentiment: str = Field(description="Overall sentiment: positive, negative, or neutral")
        summary: str = Field(description="Brief summary of the review")

    model = GeminiModel(
        client_args={"api_key": "<KEY>"},
        model_id="gemini-2.5-flash",
        params={
            "temperature": 0.3,
            "max_output_tokens": 1024,
            "top_p": 0.85
        }
    )

    agent = Agent(model=model)

    result = agent.structured_output(
        MovieReview,
        """
        Just watched "The Matrix" - what an incredible sci-fi masterpiece!
        The groundbreaking visual effects and philosophical themes make this
        a must-watch. Keanu Reeves delivers a solid performance. 9/10!
        """
    )

    print(f"Movie: {result.title}")
    print(f"Rating: {result.rating}/10")
    print(f"Genre: {result.genre}")
    print(f"Sentiment: {result.sentiment}")
    ```

{{ ts_not_supported_code("Structured output is not yet supported for Gemini in the TypeScript SDK") }}

### Custom client

Users can pass their own custom Gemini client to the GeminiModel for Strands Agents to use directly. Users are responsible for handling the lifecycle (e.g., closing) of the client.

=== "Python"

    ```python
    from google import genai
    from strands import Agent
    from strands.models.gemini import GeminiModel
    from strands_tools import calculator

    client = genai.Client(api_key="<KEY>")

    model = GeminiModel(
        client=client,
        # **model_config
        model_id="gemini-2.5-flash",
        params={
            # some sample model parameters
            "temperature": 0.7,
            "max_output_tokens": 2048,
            "top_p": 0.9,
            "top_k": 40
        }
    )

    agent = Agent(model=model, tools=[calculator])
    response = agent("What is 2+2")
    print(response)
    ```

=== "TypeScript"

    ```typescript
    import { GoogleGenAI } from '@google/genai'
    import { Agent } from '@strands-agents/sdk'
    import { GeminiModel } from '@strands-agents/sdk/gemini'

    const client = new GoogleGenAI({ apiKey: '<KEY>' })

    const model = new GeminiModel({
      client,
      modelId: 'gemini-2.5-flash',
      params: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.9,
        topK: 40,
      },
    })

    const agent = new Agent({ model })
    const response = await agent.invoke('What is 2+2')
    console.log(response)
    ```

### Multimodal Capabilities

Gemini models support text, image, and document inputs, making them ideal for multimodal applications:

```python
from strands import Agent
from strands.models.gemini import GeminiModel

model = GeminiModel(
    client_args={"api_key": "<KEY>"},
    model_id="gemini-2.5-flash",
    params={
        "temperature": 0.5,
        "max_output_tokens": 2048,
        "top_p": 0.9
    }
)

agent = Agent(model=model)

# Process image with text
response = agent([
    {
        "role": "user",
        "content": [
            {"text": "What do you see in this image?"},
            {"image": {"format": "png", "source": {"bytes": image_bytes}}}
        ]
    }
])
```

The implementation also supports document inputs:

```python
response = agent([
    {
        "role": "user", 
        "content": [
            {"text": "Summarize this document"},
            {"document": {"format": "pdf", "source": {"bytes": document_bytes}}}
        ]
    }
])
```

**Supported formats:**

- **Images**: PNG, JPEG, GIF, WebP (automatically detected via MIME type)
- **Documents**: PDF and other binary formats (automatically detected via MIME type)

## References

- [API](../../../api-reference/python/models/model.md)
- [Google Gemini](https://ai.google.dev/api)
- [Google GenAI SDK documentation](https://googleapis.github.io/python-genai/)
- [Google AI Studio](https://aistudio.google.com/)