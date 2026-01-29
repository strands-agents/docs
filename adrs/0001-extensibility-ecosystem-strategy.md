# Strands Agents: Extensibility & Ecosystem Strategy

> This document is a part of community/contributor management series. See [Strands Agents: Contributor Experience Analysis](./contributor-story.md), [Strands Agents: Community Health Strategy & Playbook](./community-health.md), [Strands Agents: Extensibility & Ecosystem Strategy](./extensibility.md), and [Strands Agents: Task Backlog [Community & Ecosystem]](./task-backlog.md)

## Introduction

This document defines our strategy for growing the Strands ecosystem—tools, integrations, and extensions built by the community. It builds on the [Contributor Story Analysis](./contributor-story.md) which identified tool publishing friction as a major problem, and the [Community Health Strategy](./community-health.md) which established our overall open source goals.

**The problem:** The diversity of extensions is one of the most critical factors when choosing an agentic SDK. If we have tools for your use case vs a competitor where you need to write everything, the choice is clear. But today:
- Our tools repo has 94% external PRs that we're not accepting
- Publishing your own package requires hours of setup
- Even after publishing, there's no way for users to discover your tool

**The goal:** Make it easy for developers to extend Strands and for users to discover those extensions—without taking on maintenance burden we can't sustain.

---

## Part 1: Extension Points in Strands

Before discussing strategy, let's be clear about what can be extended. Every idea here (templates, catalog, etc) applies to all extension types.

**Tools** are the most common extension point. A tool is a function the agent can call—search the web, query a database, send an email. Tools are where most community interest lies.

**Model Providers** let you connect Strands to different LLMs. We support Bedrock, Anthropic, OpenAI, Ollama, and others. Community members might want to add providers for other services.

**Hook Providers** allow custom logic at various points in the agent lifecycle—before/after tool calls, on errors, etc. These are useful for logging, monitoring, or custom behaviors.

**Session Managers** handle conversation state persistence. The default is in-memory, but you might want Redis, DynamoDB, or something else.

For this document, we'll focus primarily on tools since that's where the demand is. The same patterns apply to other extension types.

---

## Part 2: Current State

### The Tools Repository Problem

The tools repo tells a clear story:
- **94% of open PRs are from contributors**
- **Oldest open PR is 190+ days old**
- **Only 40.5% of issues get a maintainer response**

Contributors want to add tools. We're not accepting them. The PRs sit open for months, contributors get frustrated, and our metrics look terrible.

**Why we don't accept external tools:**

We had a CVE for a MongoDB tool that a community member submitted. The team doesn't have enough expertise to fully understand and test it. We can't take security responsibility for code we can't verify.

This isn't about gatekeeping—it's about honesty. We can't maintain tools for services we don't use, APIs we don't have keys for, and domains we don't understand.

### The Publishing Friction Problem

The alternative we offer—publish your own package—requires:
1. Create a GitHub repository
2. Set up a PyPI account
3. Configure GitHub Actions for CI/CD
4. Set up package structure (pyproject.toml, src layout)
5. Write documentation
6. Configure secrets for publishing

For a 20-line tool, this is absurd. The overhead kills contribution.

### The Discoverability Problem

Even if someone publishes a tool, **no one can find it**. There's no catalog, no registry, no search. A developer looking for a Slack tool has no way to know one exists unless they happen to find it on PyPI or GitHub.

This is the worst outcome: we've pushed contribution outside our repos, but we haven't solved the discovery problem that made being in our repos valuable in the first place.

---

## Part 3: Strategy Options

We considered several approaches before landing on our recommendation.

### Option A: "Bring Your Code, We Vend It" (Rejected)

The idea: create a repo where people dump their code, we publish whatever passes CI.

**Pros:**
- Lowest friction for contributors
- Tools get the "strands" stamp
- Easy distribution via strands-tools package

**Cons:**
- AppSec and leadership will push back—we'd be publishing code we haven't reviewed
- Even with explicit disclaimers ("we take no responsibility"), this requires leadership buy-in
- We become responsible for security issues in code we don't understand
- Maintenance burden scales with contributions
- One bad tool damages the whole package's reputation

**Decision:** Rejected. The security and maintenance risks are too high, and getting leadership approval would be difficult.

### Option B: GitHub Template + Self-Publish

The idea: provide a template repository with everything pre-configured. Contributors clone it, add their code, configure secrets, and publish to their own PyPI namespace.

**Pros:**
- Dramatically reduces publishing friction
- We don't maintain the code—authors do
- Clear ownership and responsibility
- Authors can iterate at their own pace

**Cons:**
- Tools don't get "strands" branding
- Requires solving discoverability separately
- Some friction remains (PyPI account, secrets)

**Decision:** This is our primary approach.

### Option C: Tiered Approach (Recommended)

This is the recommended approach. We need a set of tools we provide—this is critical for people to get started and test their use cases.

**Why a separate tools repo?** Dependency management. Each tool is essentially another client/dependency. Keeping them separate from the core SDK keeps the SDK lean.

**Tier 1 - Core:** We maintain, we test, we support. Tools critical for getting started with the SDK. Lives in `strands-agents/tools`.

**Tier 2 - Partner:** Third parties maintain, we highlight in catalog with a "Partner" label. For major integrations (AWS services, popular APIs).

**Tier 3 - Community:** Catalog listing only. We display their README as-is (similar to strands.my). We don't maintain or endorse, just make discoverable.

**Pros:**
- Allows us to highlight important integrations
- Clear expectations at each tier
- Scales with ecosystem growth

**Cons:**
- More complex to manage
- Tier 2 requires partnership agreements

**Decision:** This is our target state. Start with Template + Catalog (Option B) to unblock contributors now, then build toward tiered approach.

---

## Part 4: Template Implementation

We need to provide scaffolding so contributors can publish extensions without hours of setup.

### Recommendation: Template CLI

CLI tool that generates projects from parameters:

```bash
uvx strands-create tool --name slack --author "Your Name"
```

**Pros:** Best DX, handles naming automatically, no cleanup  
**Cons:** Need to build and maintain CLI

**Existing work:** Tool template already exists at [mkmeral/strands-tool-template](https://github.com/mkmeral/strands-tool-template). CLI can use this as the underlying template for tools.

**Rollout:**
1. Phase 1: CLI generates tool projects (covers 90% of demand)
2. Phase 2: Add model providers, hook providers, session managers
3. Phase 3: Interactive mode, optional features

### Naming Convention

- Package: `strands-tool-{name}`
- Import: `strands_tool_{name}`
- GitHub topic: `strands-tool` (for catalog discovery)

---

## Part 5: Tools Catalog Strategy

The template solves publishing friction. The catalog solves discoverability.

### What It Is

A page on strandsagents.com listing community tools. Users can browse, search, and find tools for their use cases.

### Implementation Phases

We have a parallel workstream to migrate our website to Astro/Starlight (see CMS Migration), which will enable dynamic content loading. We don't want to block discoverability on that migration.

**Phase 1: Manual Catalog (Now - Stop-gap)**

Manually populate a static list while CMS migration is in progress.

Actions:
1. Search GitHub for repos with strands-tool topic or naming convention
2. Search PyPI for strands- packages
3. Curate results into a static markdown page in current MkDocs docs
4. Link from docs navigation

Optional: Link to strands.my as an additional discovery option (community-built dashboard that auto-discovers strands- packages from PyPI).

**Phase 2: Dynamic Catalog (Post-CMS Migration)**

Once Astro/Starlight is live, leverage its remote content capabilities to:
- Query GitHub API for repos with strands-tool topic
- Query PyPI API for strands-* packages
- Auto-generate catalog entries
- Add tier labels (Core/Partner/Community)

TODO: have some curation

### Catalog Information

For each tool, show:
- Name and description
- Author/maintainer
- GitHub repo link
- PyPI/npm link
- Install command
- Category/tags
- Tier label (Core/Partner/Community)

---

## Part 6: Communication and Migration

We need to clearly communicate the new path and update existing guidance.

### Contributor Guidance

We need a unified contributor guide in docs. For extensibility specifically:

- How to use the template
- How to get listed in the catalog
- What we DO accept in core tools repo (bug fixes to existing tools, documentation)

### Tools Repository Updates

**README.md** - Add prominent notice:

> **Note:** We don't accept external tools to this repository. To publish your own tool, use our [GitHub template](link) and publish to PyPI. Your tool can be listed in our [community catalog](link).

**CONTRIBUTING.md** - Update to explain:
- Why we don't accept external tools (security, maintenance)
- How to use the template
- How to get listed in the catalog
- What we DO accept (bug fixes to existing tools, documentation)

### Existing PRs

For the 34 open PRs from contributors in tools:
1. Post a comment explaining the new path
2. Link to the template
3. Offer to help them migrate their code
4. Close PRs after reasonable time (2 weeks?)

### Website Updates

- Add "Ecosystem" or "Community Tools" section to docs
- Link from main navigation
- Include in "Getting Started" guides

---

## Part 7: Implementation Roadmap

| Phase | Goal | Tasks |
|-------|------|-------|
| **1: CLI** | Reduce publishing friction | Build `strands-create` CLI with tool template, Publish to PyPI, Write documentation for CLI usage, Test end-to-end flow |
| **2: Communication** | Redirect contributors to new path | Update tools repo README and CONTRIBUTING.md, Comment on open external PRs with new path, Close stale PRs with explanation |
| **3: Basic Catalog** | Solve discoverability | Create static catalog page on docs site, Add initial tools, Document how to request catalog listing |
| **4: Dynamic Catalog** | Scale discoverability | Define GitHub topic convention (`strands-tool`), Build GitHub API integration, Add search/filter functionality |
| **5: Ecosystem Growth** | Grow the flywheel | Promote community tools in docs, Highlight tools in release notes, Evaluate need for tiered approach |

---

## Part 8: Contributor Guide

We need a unified contributor guide in docs that explains how to develop and publish extensions. The guide should cover both Python and TypeScript (TypeScript SDK is experimental but growing).

**For Tool Contributors (Python):**
1. Run `strands-create tool --name yourname --author "Your Name"`
2. Add your tool code
3. Push to GitHub
4. Add `PYPI_API_TOKEN` to repo secrets
5. Create a GitHub release → automatically publishes to PyPI
6. Add `strands-tool` topic to your repo for catalog visibility

**For Tool Contributors (TypeScript):**
- Similar flow with npm instead of PyPI
- CLI support TBD (TypeScript SDK is experimental)

**For Other Extension Types:**
- Model providers: `strands-create model-provider --name yourname`
- Hook providers: `strands-create hook-provider --name yourname`
- Session managers: `strands-create session-manager --name yourname`

The guide should link to:
- The `strands-create` CLI (PyPI)
- The community catalog
- Example implementations
- Strands SDK documentation for extension interfaces

---

## Open Questions

1. **Partner tier:** How do we identify and label partners? Probably a "Partner" label in the catalog for major integration providers (Slack, databases, etc.).

---

## TODO:

- open source the docs, and refer there
- check GH wiki pages
