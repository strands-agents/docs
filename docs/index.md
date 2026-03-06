(( tab "Python" ))
[Strands Agents](https://github.com/strands-agents/sdk-python/blob/main) is a simple-to-use, code-first framework for building agents.

First, install the Strands Agents SDK:

```bash
pip install strands-agents
```
(( /tab "Python" ))

(( tab "TypeScript" ))
[Strands Agents](https://github.com/strands-agents/sdk-typescript/blob/main) is a simple-to-use, code-first framework for building agents.

First, install the Strands Agents SDK:

```bash
npm install @strands-agents/sdk
```
(( /tab "TypeScript" ))

Then create your first agent:

(( tab "Python" ))
Create a file called `agent.py`:

```python
from strands import Agent

# Create an agent with default settings
agent = Agent()

# Ask the agent a question
agent("Tell me about agentic AI")
```
(( /tab "Python" ))

(( tab "TypeScript" ))
Create a file called `agent.ts`:

```typescript
// Create a basic agent
import { Agent } from '@strands-agents/sdk'

// Create an agent with default settings
const agent = new Agent();

// Ask the agent a question
const response = await agent.invoke("Tell me about agentic AI");
console.log(response.lastMessage);
```
(( /tab "TypeScript" ))

Now run the agent:

(( tab "Python" ))
```bash
python -u agent.py
```
(( /tab "Python" ))

(( tab "TypeScript" ))
```bash
npx tsx agent.ts
```
(( /tab "TypeScript" ))

That’s it!

> **Note**: To run this example hello world agent you will need to set up credentials for our model provider and enable model access. The default model provider is [Amazon Bedrock](/docs/user-guide/concepts/model-providers/amazon-bedrock/index.md) and the default model is Claude 4 Sonnet inference model from the region of your credentials. For example, if you set the region to `us-east-1` then the default model id will be: `us.anthropic.claude-sonnet-4-20250514-v1:0`.

> For the default Amazon Bedrock model provider, see the Boto3 documentation for [Python](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html) or [TypeScript](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials.html) to set up AWS credentials. Typically for development, AWS credentials are defined in `AWS_` prefixed environment variables or configured with `aws configure`. You will also need to enable Claude 4 Sonnet model access in Amazon Bedrock, following the [AWS documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access-modify.html) to enable access.

> Different model providers can be configured for agents by following the [quickstart guide](/docs/user-guide/quickstart/index.md#model-providers).

> See [Bedrock troubleshooting](/docs/user-guide/concepts/model-providers/amazon-bedrock/index.md#troubleshooting) if you encounter any issues.

## Features

Strands Agents is lightweight and production-ready, supporting many model providers and deployment targets.

Key features include:

-   **Lightweight and gets out of your way**: A simple agent loop that just works and is fully customizable.
-   **Production ready**: Full observability, tracing, and deployment options for running agents at scale.
-   **Model, provider, and deployment agnostic**: Strands supports many different models from many different providers.
-   **Community-driven tools**: Get started quickly with a powerful set of community-contributed tools for a broad set of capabilities.
-   **Multi-agent and autonomous agents**: Apply advanced techniques to your AI systems like agent teams and agents that improve themselves over time.
-   **Conversational, non-conversational, streaming, and non-streaming**: Supports all types of agents for various workloads.
-   **Safety and security as a priority**: Run agents responsibly while protecting data.

## Next Steps

Ready to learn more? Check out these resources:

-   [Quickstart](/docs/user-guide/quickstart/index.md) - A more detailed introduction to Strands Agents
-   [Examples](/docs/examples/index.md) - Examples for many use cases, types of agents, multi-agent systems, autonomous agents, and more
-   [Community Supported Tools](/docs/user-guide/concepts/tools/community-tools-package/index.md) - The [`strands-agents-tools`](https://github.com/strands-agents/tools) package is a community-driven project that provides a powerful set of tools for your agents to use
-   [Strands Agent Builder](https://github.com/strands-agents/agent-builder) - Use the accompanying [`strands-agents-builder`](https://github.com/strands-agents/agent-builder) agent builder to harness the power of LLMs to generate your own tools and agents

Join Our Community

Learn how to contribute to our [Python](https://github.com/strands-agents/sdk-python/blob/main/CONTRIBUTING.md) or [TypeScript](https://github.com/strands-agents/sdk-typescript/blob/main/CONTRIBUTING.md) SDKs, or join our community discussions to shape the future of Strands Agents ❤️.