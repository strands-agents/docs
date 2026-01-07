# Publishing your component

Developers building agents often need integrations with external services—databases, APIs, messaging platforms. Writing these integrations from scratch takes time away from building your actual application. And once you've built something useful, sharing it with others requires navigating package publishing, CI/CD setup, and documentation.

Strands makes this simple. You can extend Strands with custom tools, model providers, hooks, and session managers. And we provide templates and infrastructure to make publishing your components as easy as possible.

This guide shows you how to publish your own tool, model provider, or other component, making it available to the entire Strands community.

## Why publish your own component

When you build something useful, publishing it as your own package gives you control and visibility.

**Benefits of publishing your own component:**

| Benefit | Description |
|---------|-------------|
| **Ownership** | You control the roadmap, features, and release schedule |
| **Speed** | Release updates immediately without waiting for core SDK releases |
| **Credit** | Your name and contribution are front and center |
| **Learning** | Gain experience with package publishing and maintenance |
| **Discoverability** | Listed in our community catalog for thousands of developers to find |
| **Flexibility** | Experiment and iterate without core SDK constraints |

We provide templates and infrastructure to make publishing straightforward. The [strands-tool-template](https://github.com/strands-agents/strands-tool-template) includes pre-configured CI/CD, testing setup, and packaging configuration—you just add your component code.

→ [How to publish your component](./publishing.md)

## Understanding the ecosystem

The Strands ecosystem has three tiers based on who maintains packages and what level of support you can expect.

**Core packages** live in official Strands repositories like [strands-agents/tools](https://github.com/strands-agents/tools). The Strands team maintains, tests, and supports these packages. We accept bug fixes and improvements to existing core tools, but new tools and integrations should be published as community packages.

**Partner packages** (coming soon) are high-quality integrations maintained by service providers or trusted partners. If you maintain a service and want to provide an official Strands integration, [start a discussion](https://github.com/strands-agents/sdk-python/discussions) to explore partnership.

**Community packages** are published and maintained by developers like you. Anyone can publish a community package. This is where most contributions belong—you maintain full ownership and control, iterate at your own pace, and get full credit for your work.

## Why we don't accept new tools to core

You might wonder why we don't accept community tools directly into the core repository. Here's our reasoning:

**Security responsibility.** When we publish code under the `strands-agents` organization, we take responsibility for its security. We need to audit the code, understand every API it integrates with, and respond to security issues promptly. We can't do this for tools that integrate with services we don't use or understand deeply.

**Maintenance burden.** Core packages require ongoing maintenance—testing against API changes, updating for SDK changes, fixing bugs, reviewing improvements. With a small team, we can't maintain tools for hundreds of services. You know your use case better and can iterate faster when you control the package.

**Quality expectations.** Mixing core and community code makes it hard to set clear expectations. The tiered approach makes it transparent—core means Strands-maintained, community means author-maintained.

Publishing your own package gives you ownership, speed, and credit. You control releases, don't wait for reviews, and your name is on the package.
