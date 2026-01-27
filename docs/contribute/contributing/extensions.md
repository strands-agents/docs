# Publishing extensions

You've built a tool that calls your company's internal API. Or a model provider for a regional LLM service. Or a session manager that persists to Redis. It works great for your project—now you want to share it with others.

This guide walks you through packaging and publishing your Strands components so other developers can install them with `pip install`.

## Why publish

When you build a useful component, you have two choices: keep it in your project, or publish it as a package.

Publishing makes sense when your component solves a problem others face too. A Slack integration, a database session manager, a provider for a popular LLM service—these help the broader community. Publishing also means you own the package. You control when to release updates, what features to add, and how to prioritize bugs.

Your package can get listed in our [community catalog](../../community/community-packages.md), making it discoverable to developers looking for exactly what you built.

## What you can publish

Strands has several extension points. Each serves a different purpose in the agent lifecycle.

| Component | Purpose | Learn more |
|-----------|---------|------------|
| **Tools** | Add capabilities to agents—call APIs, access databases, interact with services | [Custom tools](../../user-guide/concepts/tools/python-tools.md) |
| **Model providers** | Integrate LLM APIs beyond the built-in providers | [Custom model providers](../../user-guide/concepts/model-providers/custom_model_provider.md) |
| **Hook providers** | React to agent lifecycle events like invocations, tool calls, and model calls | [Hooks](../../user-guide/concepts/agents/hooks.md) |
| **Session managers** | Persist conversations to external storage for resumption or sharing | [Session management](../../user-guide/concepts/agents/session-management.md) |
| **Conversation managers** | Control how message history grows—trim old messages or summarize context | [Conversation management](../../user-guide/concepts/agents/conversation-management.md) |

Tools are the most common extension type. They let agents interact with specific services like Slack, databases, or internal APIs.

## Get started

We provide a Python template that handles the boilerplate: package structure, CI/CD workflows, testing setup, and automatic PyPI publishing on release.

Use [strands-agents/strands-python-extension-template](https://github.com/strands-agents/strands-python-extension-template) to create your repository. Click "Use this template" on GitHub. The template includes skeleton files for all extension types, a setup script that configures your package metadata, and GitHub Actions workflows for testing and publishing.

The template README walks through each step: running the setup script, adding your code, configuring PyPI trusted publishing, and creating releases.

!!! info "TypeScript"
    A TypeScript extension template is coming soon.

## Get discovered

Publishing to PyPI makes your package installable, but developers need to find it first.

First you can add the `strands-agents` topic to your GitHub repository, so developers browsing GitHub can find Strands-related projects. Go to your repo settings, click the gear icon next to "About", and add topics.

Additionally you can submit your package to our [community catalog](../../community/community-packages.md), which lists extensions the community has built. Getting listed puts your package in front of developers actively looking for Strands extensions. 

See the [Get Featured guide](../../community/get-featured.md) for step-by-step instructions on submitting your package.
