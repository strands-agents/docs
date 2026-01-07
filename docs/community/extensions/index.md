# Extensions and ecosystem

Developers building agents often need integrations with external services—databases, APIs, messaging platforms. Writing these integrations from scratch takes time away from building your actual application. And once you've built something useful, sharing it with others requires navigating package publishing, CI/CD setup, and documentation.

Strands addresses this through an extensible architecture and community ecosystem. You can extend Strands with custom tools, model providers, hooks, and session managers. And we provide templates and infrastructure to make publishing your extensions as simple as possible.

## The tiered ecosystem

We organize extensions into three tiers based on who maintains them and what level of support you can expect.

### Tier 1: Core

Core extensions live in official Strands repositories like [strands-agents/tools](https://github.com/strands-agents/tools). The Strands team maintains, tests, and supports these packages. They're battle-tested and safe to use in production.

We accept bug fixes and improvements to existing core tools. However, we don't accept new external tools to core repositories—see below for why.

### Tier 2: Partner (coming soon)

Partner extensions are high-quality integrations with major services, maintained by service providers or trusted partners. We highlight these in our documentation with a "Partner" label. If you maintain a service and want to provide an official Strands integration, [start a discussion](https://github.com/strands-agents/sdk-python/discussions) to explore partnership.

### Tier 3: Community

Community extensions are published and maintained by individual developers like you. Anyone can publish a community package—we provide templates to make it easy, and list packages in our [community catalog](../community-packages.md) for discoverability.

This is where most contributions belong. You maintain full ownership and control over your package.

## Why we don't accept external tools

You might wonder why we don't just accept community tools directly into the core repository. We've thought carefully about this, and here's our reasoning.

**Security responsibility.** When we publish code under the `strands-agents` organization, we take responsibility for its security. We need to audit the code, understand every API it integrates with, and respond to security issues promptly. We can't do this for tools that integrate with services we don't use. A recent CVE in a community-contributed tool illustrated this risk.

**Maintenance burden.** Core packages require ongoing maintenance—testing against API changes, updating for SDK changes, fixing bugs, reviewing improvements. With a small team, we can't maintain tools for hundreds of services. You know your use case better than we do, and you can iterate faster.

**Quality expectations.** Mixing core and community code in one repository makes it hard to set expectations. Users don't know which tools are battle-tested and which are experimental. The tiered approach makes this clear.

## The better path

Publishing your own package gives you ownership, speed, credit, and discoverability. You control releases and updates. You don't wait for maintainer reviews. Your name is on the package. And we list you in our community catalog.

We provide templates and infrastructure to make publishing as easy as possible.

→ [How to publish your extension](./publishing.md)
