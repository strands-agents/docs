# Extensions and ecosystem

Developers building agents often need integrations with external services—databases, APIs, messaging platforms. Writing these integrations from scratch takes time away from building your actual application. And once you've built something useful, sharing it with others requires navigating package publishing, CI/CD setup, and documentation.

Strands addresses this through an extensible architecture and community ecosystem. You can extend Strands with custom tools, model providers, hooks, and session managers. And we provide templates and infrastructure to make publishing your extensions as simple as possible.

This page explains how the Strands ecosystem works, why we organize it into tiers, and how you can contribute your own extensions.

## The tiered ecosystem

We organize extensions into three tiers based on who maintains them and what level of support you can expect. Understanding these tiers helps you make informed decisions about which packages to use and where your contributions belong.

### Tier 1: Core

Core extensions live in official Strands repositories like [strands-agents/tools](https://github.com/strands-agents/tools). The Strands team maintains, tests, and supports these packages. They're battle-tested and safe to use in production.

**Characteristics:**

- Maintained by the Strands core team
- Comprehensive test coverage and CI/CD
- Security patches and updates guaranteed
- Breaking changes follow semantic versioning
- Full integration with SDK features

**Examples:** `strands_tools` package (calculator, file_read, shell, etc.)

We accept bug fixes and improvements to existing core tools through pull requests. However, we don't accept new external tools to core repositories—see the section below for why.

### Tier 2: Partner (coming soon)

Partner extensions are high-quality integrations with major services, maintained by service providers or trusted partners. We highlight these in our documentation with a "Partner" label. If you maintain a service and want to provide an official Strands integration, [start a discussion](https://github.com/strands-agents/sdk-python/discussions) to explore partnership.

**Characteristics:**

- Maintained by service providers or approved partners
- Meet quality and documentation standards
- Listed in docs with "Partner" designation
- Subject to periodic review

**Process for partnership:**

1. Build a high-quality integration with comprehensive docs and tests
2. Publish to PyPI with established maintenance track record
3. Start a discussion to propose partnership
4. Work with us to meet partner standards
5. Get featured in docs with partner designation

### Tier 3: Community

Community extensions are published and maintained by individual developers like you. Anyone can publish a community package—we provide templates to make it easy, and list packages in our [community catalog](../community-packages.md) for discoverability.

**Characteristics:**

- Maintained by community members
- Variable quality and support levels
- Full ownership and control by author
- Fast iteration and updates
- Listed in community catalog

**This is where most contributions belong.** You maintain full ownership and control over your package, iterate at your own pace, and get full credit for your work.

To get started, see [Publishing Extensions](./publishing.md).

## Why we don't accept external tools

You might wonder why we don't just accept community tools directly into the core repository. We've thought carefully about this, and here's our reasoning.

**Security responsibility.** When we publish code under the `strands-agents` organization, we take responsibility for its security. We need to audit the code, understand every API it integrates with, and respond to security issues promptly. We can't do this for tools that integrate with services we don't use or understand deeply. A recent CVE in a community-contributed tool illustrated this risk—we couldn't assess the severity or fix it quickly because we lacked expertise with that service.

**Maintenance burden.** Core packages require ongoing maintenance—testing against API changes, updating for SDK changes, fixing bugs, reviewing improvements. With a small team, we can't maintain tools for hundreds of services. You know your use case and the service you're integrating better than we do, and you can iterate faster when you control the package.

**Quality expectations.** Mixing core and community code in one repository makes it hard to set clear expectations. Users don't know which tools are battle-tested and which are experimental. The tiered approach makes quality expectations transparent—core means Strands-maintained, community means author-maintained.

**Dependency management.** External tools often require service-specific dependencies. Adding these to the core package increases installation size and complexity for everyone, even users who don't need those integrations.

**Iteration speed.** External tool updates require core SDK releases. When you own the package, you can release updates immediately when the service's API changes.

## The better path

Publishing your own package gives you ownership, speed, credit, and discoverability. You control releases and updates. You don't wait for maintainer reviews. Your name is on the package. And we list you in our community catalog.

**Benefits of publishing your own extension:**

| Benefit | Description |
|---------|-------------|
| **Ownership** | You control the roadmap, features, and release schedule |
| **Speed** | Release updates immediately without waiting for core SDK releases |
| **Credit** | Your name and contribution are front and center |
| **Learning** | Gain experience with package publishing and maintenance |
| **Discoverability** | Listed in our community catalog for thousands of developers to find |
| **Flexibility** | Experiment and iterate without core SDK constraints |

We provide templates and infrastructure to make publishing as easy as possible. The [strands-tool-template](https://github.com/strands-agents/strands-tool-template) includes pre-configured CI/CD, testing setup, and packaging configuration—you just add your tool code.

→ [How to publish your extension](./publishing.md)
