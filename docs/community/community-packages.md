# Community catalog

The Strands community has built tools and integrations for a variety of use cases. This catalog helps you discover what's available and find packages that solve your specific needs.

Browse by category below to find tools, model providers, session managers, and platform integrations built by the community. You can also browse community projects dynamically at [strands.my](https://strands.my/).

!!! info "Community maintained"
    These packages are maintained by their authors, not the Strands team. Review packages before using them in production. Quality and support may vary.

## Tools

Tools extend your agents with capabilities for specific services and platforms. Each package provides one or more tools you can add to your agents.

| Package | Description |
|---------|-------------|
| [strands-deepgram](./tools/strands-deepgram.md) | Deepgram speech-to-text |
| [strands-hubspot](./tools/strands-hubspot.md) | HubSpot CRM integration |
| [strands-teams](./tools/strands-teams.md) | Microsoft Teams |
| [strands-telegram](./tools/strands-telegram.md) | Telegram bot |
| [strands-telegram-listener](./tools/strands-telegram-listener.md) | Telegram listener |
| [UTCP](./tools/utcp.md) | Universal Tool Calling Protocol |

## Model providers

Model providers add support for additional LLM services beyond the built-in providers. Use these to integrate with specialized or regional LLM platforms.

| Package | Description |
|---------|-------------|
| [Cohere](./model-providers/cohere.md) | Cohere LLM |
| [CLOVA Studio](./model-providers/clova-studio.md) | Naver CLOVA Studio |
| [Fireworks AI](./model-providers/fireworksai.md) | Fireworks AI |
| [Nebius](./model-providers/nebius-token-factory.md) | Nebius Token Factory |

## Session managers

Session managers provide alternative storage backends for conversation history. Use these when you need persistent, scalable, or distributed session storage.

| Package | Description |
|---------|-------------|
| [AgentCore Memory](./session-managers/agentcore-memory.md) | Amazon AgentCore |
| [Valkey](./session-managers/strands-valkey-session-manager.md) | Valkey session manager |

## Integrations

Platform integrations help you connect Strands agents with external services and user interfaces.

| Package | Description |
|---------|-------------|
| [AG-UI](./integrations/ag-ui.md) | AG-UI integration |

---

## Add your package

Built something useful? We'd love to list it here. Publishing your package to the catalog makes it discoverable to thousands of developers.

**Requirements:**

1. **Publish your package to PyPI** — See our [publishing guide](./publishing/publishing.md) for step-by-step instructions
2. **Add the `strands-tool` topic** to your GitHub repository so developers can find you
3. **Submit a request** using our [content addition template](https://github.com/strands-agents/docs/issues/new?template=content_addition.yml) with:
    - Package name and PyPI link
    - Clear description of what it does
    - Usage examples showing basic integration
    - Documentation link (README or dedicated docs)

See our [Get Featured](./get-featured.md) guide for step-by-step instructions on adding your package to the docs.
