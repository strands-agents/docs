[Anthropic](https://docs.anthropic.com/en/home) is an AI safety and research company focused on building reliable, interpretable, and steerable AI systems. Included in their offerings is the Claude AI family of models, which are known for their conversational abilities, careful reasoning, and capacity to follow complex instructions. The Strands Agents SDK implements an Anthropic provider, allowing users to run agents against Claude models directly.

## Installation

Anthropic is configured as an optional dependency in Strands Agents. To install, run:

(( tab "Python" ))
```bash
pip install 'strands-agents[anthropic]' strands-agents-tools
```
(( /tab "Python" ))

(( tab "TypeScript" ))
```bash
npm install @strands-agents/sdk @anthropic-ai/sdk
```
(( /tab "TypeScript" ))

## Usage

After installing dependencies, you can import and initialize the Strands Agents’ Anthropic provider as follows:

(( tab "Python" ))
```python
from strands import Agent
from strands.models.anthropic import AnthropicModel
from strands_tools import calculator

model = AnthropicModel(
    client_args={
        "api_key": "<KEY>",
    },
    # **model_config
    max_tokens=1028,
    model_id="claude-sonnet-4-6",
    params={
        "temperature": 0.7,
    }
)

agent = Agent(model=model, tools=[calculator])
response = agent("What is 2+2")
print(response)
```
(( /tab "Python" ))

(( tab "TypeScript" ))
```typescript
import { Agent } from '@strands-agents/sdk'
import { AnthropicModel } from '@strands-agents/sdk/models/anthropic'

const model = new AnthropicModel({
  apiKey: process.env.ANTHROPIC_API_KEY || '<KEY>',
  modelId: 'claude-sonnet-4-6',
  maxTokens: 1028,
  params: {
    temperature: 0.7,
  },
})

const agent = new Agent({ model })
const response = await agent.invoke('What is 2+2')
console.log(response)
```
(( /tab "TypeScript" ))

## Configuration

### Client Configuration

(( tab "Python" ))
The `client_args` configure the underlying Anthropic client. For a complete list of available arguments, please refer to the [Anthropic Python SDK docs](https://platform.claude.com/docs/en/api/sdks/python).
(( /tab "Python" ))

(( tab "TypeScript" ))
The `clientConfig` configures the underlying Anthropic client. You can also pass a pre-configured `client` instance directly (see [Custom Client](#custom-client)). For a complete list of available options, please refer to the [Anthropic TypeScript SDK docs](https://platform.claude.com/docs/en/api/sdks/typescript).
(( /tab "TypeScript" ))

### Model Configuration

(( tab "Python" ))
The `model_config` configures the underlying model selected for inference. The supported configurations are:

| Parameter | Description | Example | Options |
| --- | --- | --- | --- |
| `max_tokens` | Maximum number of tokens to generate before stopping | `1028` | [reference](https://platform.claude.com/docs/en/api/messages/create#create.max_tokens) |
| `model_id` | ID of a model to use | `claude-sonnet-4-6` | [reference](https://platform.claude.com/docs/en/api/messages/create#create.model) |
| `params` | Additional pass-through parameters | `{"metadata": {"user_id": "u1"}}` | [reference](https://platform.claude.com/docs/en/api/messages/create) |
(( /tab "Python" ))

(( tab "TypeScript" ))
| Parameter | Description | Example | Options |
| --- | --- | --- | --- |
| `modelId` | ID of a model to use | `'claude-sonnet-4-6'` | [reference](https://platform.claude.com/docs/en/api/messages/create#create.model) |
| `maxTokens` | Maximum tokens to generate | `1028` | [reference](https://platform.claude.com/docs/en/api/messages/create#create.max_tokens) |
| `stopSequences` | Sequences that stop generation | `['END']` | [reference](https://platform.claude.com/docs/en/api/messages/create#create.stop_sequences) |
| `params` | Additional pass-through parameters | `{ metadata: { user_id: 'u1' } }` | [reference](https://platform.claude.com/docs/en/api/messages/create) |
(( /tab "TypeScript" ))

## Troubleshooting

(( tab "Python" ))
### Module Not Found

If you encounter the error `ModuleNotFoundError: No module named 'anthropic'`, this means you haven’t installed the `anthropic` dependency in your environment. To fix, run `pip install 'strands-agents[anthropic]'`.
(( /tab "Python" ))

(( tab "TypeScript" ))
### Import Errors

If you encounter import errors for `@anthropic-ai/sdk`, ensure the package is installed: `npm install @anthropic-ai/sdk`.
(( /tab "TypeScript" ))

## Advanced Features

### Custom Client

You can pass a pre-configured Anthropic client directly to `AnthropicModel`. You are responsible for managing the client’s lifecycle.

(( tab "Python" ))
The Python SDK does not currently support passing a pre-configured client. Use `client_args` to configure the client at initialization.
(( /tab "Python" ))

(( tab "TypeScript" ))
```typescript
import Anthropic from '@anthropic-ai/sdk'
import { Agent } from '@strands-agents/sdk'
import { AnthropicModel } from '@strands-agents/sdk/models/anthropic'

const client = new Anthropic({ apiKey: '<KEY>' })

const model = new AnthropicModel({
  client,
  modelId: 'claude-sonnet-4-6',
  maxTokens: 1028,
})

const agent = new Agent({ model })
const response = await agent.invoke('What is 2+2')
console.log(response)
```
(( /tab "TypeScript" ))

### Structured Output

Anthropic models support structured output through tool use. Pass a schema to the agent, and Strands generates a tool from it that the model calls to return validated, type-safe data.

(( tab "Python" ))
Define a Pydantic model and pass it to [`agent.structured_output()`](/docs/api/python/strands.agent.agent#Agent.structured_output):

```python
from pydantic import BaseModel, Field
from strands import Agent
from strands.models.anthropic import AnthropicModel

class MovieReview(BaseModel):
    """Analyze a movie review."""
    title: str = Field(description="Movie title")
    rating: int = Field(description="Rating from 1-10", ge=1, le=10)
    genre: str = Field(description="Primary genre")
    sentiment: str = Field(description="Overall sentiment: positive, negative, or neutral")
    summary: str = Field(description="Brief summary of the review")

model = AnthropicModel(
    client_args={"api_key": "<KEY>"},
    max_tokens=1028,
    model_id="claude-sonnet-4-6",
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
(( /tab "Python" ))

(( tab "TypeScript" ))
Define a Zod schema and pass it as `structuredOutputSchema`. Validated output is on `result.structuredOutput`:

```typescript
import { Agent } from '@strands-agents/sdk'
import { AnthropicModel } from '@strands-agents/sdk/models/anthropic'
import { z } from 'zod'

const MovieReview = z.object({
  title: z.string().describe('Movie title'),
  rating: z.number().min(1).max(10).describe('Rating from 1-10'),
  genre: z.string().describe('Primary genre'),
  sentiment: z.enum(['positive', 'negative', 'neutral']).describe('Overall sentiment'),
  summary: z.string().describe('Brief summary of the review'),
})

const model = new AnthropicModel({
  apiKey: '<KEY>',
  modelId: 'claude-sonnet-4-6',
  maxTokens: 1028,
})

const agent = new Agent({ model, structuredOutputSchema: MovieReview })

const result = await agent.invoke(
  `Just watched "The Matrix" - what an incredible sci-fi masterpiece!
   The groundbreaking visual effects and philosophical themes make this
   a must-watch. Keanu Reeves delivers a solid performance. 9/10!`
)

const review = result.structuredOutput as z.infer<typeof MovieReview>
console.log(`Movie: ${review.title}`)
console.log(`Rating: ${review.rating}/10`)
console.log(`Genre: ${review.genre}`)
console.log(`Sentiment: ${review.sentiment}`)
```
(( /tab "TypeScript" ))

For schema patterns, error handling, and per-invocation overrides, see [Structured Output](/docs/user-guide/concepts/agents/structured-output/index.md).

### Token Counting

Token counting is used by context management strategies to estimate input tokens before each model call.

(( tab "Python" ))
The Anthropic provider can use the native `messages.count_tokens()` API, which provides exact token counts including system prompts, messages, and tool specifications.

You can enable native token counting with:

```python
model = AnthropicModel(
    model_id="claude-sonnet-4-6",
    use_native_token_count=True,
)
```

When disabled (or if the API call fails), falls back to estimation with a character-based heuristic (characters ÷ 4 for text, characters ÷ 2 for JSON).
(( /tab "Python" ))

(( tab "TypeScript" ))
The Anthropic provider can use the native `messages.countTokens()` API, which provides exact token counts including system prompts, messages, and tool specifications.

You can enable native token counting with:

```typescript
const model = new AnthropicModel({
  modelId: 'claude-sonnet-4-6',
  useNativeTokenCount: true,
})
```

When disabled (or if the API call fails), falls back to estimation with a character-based heuristic (characters ÷ 4 for text, characters ÷ 2 for JSON).
(( /tab "TypeScript" ))

## References

-   [Python API](/docs/api/python/strands.models.model)
-   [Anthropic](https://platform.claude.com/docs/en/home)

## Related pages

- [Result Caching](/docs/user-guide/evals-sdk/how-to/result_caching/index.md) (1 shared tag)
- [LiteLLM](/docs/user-guide/concepts/model-providers/litellm/index.md) (1 shared tag)
- [Structured Output](/docs/user-guide/concepts/agents/structured-output/index.md) (1 shared tag)
- [OpenAI](/docs/user-guide/concepts/model-providers/openai/index.md) (1 shared tag)
- [Writer](/docs/user-guide/concepts/model-providers/writer/index.md) (1 shared tag)
- [Amazon Bedrock](/docs/user-guide/concepts/model-providers/amazon-bedrock/index.md) (1 shared tag)
