The [Vercel AI SDK](https://sdk.vercel.ai/) is a TypeScript toolkit for building AI-powered applications. It defines a [Language Model Specification](https://github.com/vercel/ai/tree/main/packages/provider/src/language-model/v3) that standardizes how applications interact with LLMs across providers. The Strands Agents SDK includes a `VercelModel` adapter that wraps any Language Model Specification v3 (`LanguageModelV3`) provider for use as a Strands model provider.

This means you can bring models from the entire Vercel AI SDK ecosystem - including `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/amazon-bedrock`, `@ai-sdk/google`, and [many more](https://sdk.vercel.ai/docs/foundations/providers-and-models) - directly into Strands agents.

## Installation

Install the Strands SDK along with the Vercel AI SDK provider package for the model you want to use:

```bash
# OpenAI
npm install @strands-agents/sdk @ai-sdk/openai

# Amazon Bedrock
npm install @strands-agents/sdk @ai-sdk/amazon-bedrock

# Anthropic
npm install @strands-agents/sdk @ai-sdk/anthropic

# Google Generative AI
npm install @strands-agents/sdk @ai-sdk/google
```

The `@ai-sdk/provider` package (which defines the `LanguageModelV3` interface) is listed as an optional peer dependency of `@strands-agents/sdk` and will be installed automatically with any `@ai-sdk/*` provider.

## Usage

Create a `LanguageModelV3` instance from any Vercel provider and wrap it with `VercelModel`:

### OpenAI

```typescript
import { Agent } from '@strands-agents/sdk'
import { VercelModel } from '@strands-agents/sdk/models/vercel'
import { openai } from '@ai-sdk/openai'

const agent = new Agent({
  model: new VercelModel({ provider: openai('gpt-4o') }),
})

const result = await agent.invoke('Hello!')
console.log(result)
```

### Amazon Bedrock

```typescript
import { Agent } from '@strands-agents/sdk'
import { VercelModel } from '@strands-agents/sdk/models/vercel'
import { bedrock } from '@ai-sdk/amazon-bedrock'

const agent = new Agent({
  model: new VercelModel({ provider: bedrock('us.anthropic.claude-sonnet-4-20250514-v1:0') }),
})

const result = await agent.invoke('Hello!')
console.log(result)
```

### Anthropic

```typescript
import { Agent } from '@strands-agents/sdk'
import { VercelModel } from '@strands-agents/sdk/models/vercel'
import { anthropic } from '@ai-sdk/anthropic'

const agent = new Agent({
  model: new VercelModel({ provider: anthropic('claude-sonnet-4-20250514') }),
})

const result = await agent.invoke('Hello!')
console.log(result)
```

### Google Generative AI

```typescript
import { Agent } from '@strands-agents/sdk'
import { VercelModel } from '@strands-agents/sdk/models/vercel'
import { google } from '@ai-sdk/google'

const agent = new Agent({
  model: new VercelModel({ provider: google('gemini-2.5-flash') }),
})

const result = await agent.invoke('Hello!')
console.log(result)
```

## Configuration

`VercelModel` accepts configuration directly alongside the `provider` option. These include all [LanguageModelV3CallOptions](https://github.com/vercel/ai/tree/main/packages/provider/src/language-model/v3) settings (temperature, topP, topK, penalties, stop sequences, seed, etc.) plus the base Strands model config fields.

```typescript
const model = new VercelModel({
  provider: openai('gpt-4o'),
  maxTokens: 1000,
  temperature: 0.7,
  topP: 0.9,
})

const agent = new Agent({ model })
const result = await agent.invoke('Write a short poem')
console.log(result)
```

| Parameter | Description | Example |
| --- | --- | --- |
| `modelId` | Override the model ID (defaults to the provider’s model ID) | `'gpt-4o'` |
| `maxTokens` | Maximum tokens to generate | `1000` |
| `temperature` | Controls randomness | `0.7` |
| `topP` | Nucleus sampling | `0.9` |
| `topK` | Top-k sampling | `40` |
| `presencePenalty` | Encourages new topics | `0.5` |
| `frequencyPenalty` | Reduces repetition | `0.5` |
| `stopSequences` | Custom stop sequences | `['END']` |
| `seed` | Deterministic generation | `42` |

When new fields are added to the Language Model Specification, they become available in the config automatically.

## Streaming

The adapter supports streaming text, reasoning content, and tool use:

```typescript
const agent = new Agent({
  model: new VercelModel({ provider: openai('gpt-4o') }),
})

for await (const event of agent.stream('Tell me a story')) {
  if (event.type === 'modelContentBlockDeltaEvent' && event.delta.type === 'textDelta') {
    process.stdout.write(event.delta.text)
  }
}
```

## Supported features

The `VercelModel` adapter handles:

-   Streaming text, reasoning, and tool use (both incremental and complete tool call events)
-   Message formatting: text, images, documents, video, tool use/results, and reasoning blocks
-   Tool specification and tool choice mapping
-   Usage and token tracking including cache read/write tokens
-   Error classification: maps provider errors to `ModelThrottledError`, `ContextWindowOverflowError`, and `ModelError`

## Compatible providers

Any package that implements the `LanguageModelV3` interface works with `VercelModel`. This includes all [official Vercel AI SDK providers](https://sdk.vercel.ai/docs/foundations/providers-and-models) and community providers:

| Provider | Package |
| --- | --- |
| OpenAI | `@ai-sdk/openai` |
| Amazon Bedrock | `@ai-sdk/amazon-bedrock` |
| Anthropic | `@ai-sdk/anthropic` |
| Google Generative AI | `@ai-sdk/google` |
| Google Vertex | `@ai-sdk/google-vertex` |
| Azure OpenAI | `@ai-sdk/azure` |
| Mistral | `@ai-sdk/mistral` |
| Cohere | `@ai-sdk/cohere` |
| xAI Grok | `@ai-sdk/xai` |
| DeepSeek | `@ai-sdk/deepseek` |
| Groq | `@ai-sdk/groq` |

See the [Vercel AI SDK providers page](https://sdk.vercel.ai/docs/foundations/providers-and-models) for the full list.

## Troubleshooting

### Missing peer dependency

If you see warnings about `@ai-sdk/provider`, install it explicitly:

```bash
npm install @ai-sdk/provider
```

### Authentication errors

Authentication is handled by the underlying Vercel provider package. Refer to the specific provider’s documentation for credential setup - for example, `@ai-sdk/openai` reads `OPENAI_API_KEY` from the environment, and `@ai-sdk/amazon-bedrock` uses the standard AWS credential chain.

## References

-   [Vercel AI SDK](https://sdk.vercel.ai/)
-   [Language Model Specification v3](https://github.com/vercel/ai/tree/main/packages/provider/src/language-model/v3)
-   [Vercel AI SDK Providers](https://sdk.vercel.ai/docs/foundations/providers-and-models)