Built something useful for Strands Agents? Getting featured in our docs helps other developers discover your work and gives your package visibility across the community.

## What We’re Looking For

We feature **reusable packages** that extend Strands Agents capabilities:

-   **Model Providers** — integrations with LLM services (OpenAI-compatible endpoints, custom APIs, etc.)
-   **Tools** — packaged tools that solve common problems (API integrations, utilities, etc.)
-   **Session Managers** — custom session/memory implementations
-   **Plugins** — extend or modify agent behavior during lifecycle events
-   **Integrations** — protocol implementations, framework bridges, etc.

We’re not looking for example agents or one-off projects — the focus is on packages published to PyPI that others can `pip install` or `npm install` and use in their own agents. See [Community Packages](/docs/community/community-packages/index.md) for guidance on creating and publishing your package.

Starting from scratch?

The [extension template](https://github.com/strands-agents/extension-template-python) gives you a ready-made project structure with testing, linting, and PyPI publishing already set up.

## Quick Steps

1.  **Create a PR** to [strands-agents/docs](https://github.com/strands-agents/docs)
2.  **Add your doc file** in the appropriate `community/` subdirectory
3.  **Include the required frontmatter** so your page appears in the [community catalog](/docs/community/community-packages/index.md)
4.  **Update `src/config/navigation.yml`** to include your new page in the nav

## Directory Structure

Place your documentation in the right spot:

| Type | Directory | Example |
| --- | --- | --- |
| Model Providers | `community/model-providers/` | `cohere.mdx` |
| Tools | `community/tools/` | `strands-deepgram.mdx` |
| Session Managers | `community/session-managers/` | `agentcore-memory.mdx` |
| Plugins | `community/plugins/` | `my-plugin.mdx` |
| Integrations | `community/integrations/` | `ag-ui.mdx` |

## Document Layout

Your Strands docs page should be a **concise overview** — not a copy of your GitHub README. Keep it focused on getting users started quickly. Save the deep dives, advanced configurations, and detailed API docs for your project’s own documentation.

Follow this structure (see existing docs for reference):

```markdown
# Package Name

Brief intro explaining what your package does and why it's useful.

## Installation

pip install your-package

## Usage

Working code example showing basic usage with Strands Agent.

## Configuration

Environment variables, client options, or model parameters.

## Troubleshooting (optional)

Common issues and how to fix them.

## References

Links to your repo, PyPI, official docs, etc.
```

### Frontmatter

Every community page needs frontmatter with catalog fields so it appears in the [community catalog](/docs/community/community-packages/index.md). Without `community: true`, `integrationType`, `description`, and `languages`, your page won’t show up in the catalog tables.

Here’s the full frontmatter for a **Tool** (adapt `integrationType` for your package type — `tool`, `model-provider`, `session-manager`, `plugin`, or `integration`):

```yaml
---
title: your-package-name
community: true
integrationType: tool
description: Short description of what the tool does
languages: Python
sidebar:
  label: "display-name"
project:
  pypi: https://pypi.org/project/your-package/
  github: https://github.com/your-org/your-repo
  maintainer: your-github-username
service:
  name: Service Name
  link: https://service-website.com/
---
```

| Field | Required | Notes |
| --- | --- | --- |
| `community` | ✅ | Must be `true` |
| `integrationType` | ✅ | `tool`, `model-provider`, `session-manager`, `plugin`, or `integration` |
| `description` | ✅ | Shown in the catalog table |
| `languages` | ✅ | `Python`, `TypeScript`, or omit for both |
| `project` | Recommended | PyPI/npm link, GitHub repo, maintainer |
| `service` | Optional | External service metadata |

## Update navigation.yml

Add your page to `src/config/navigation.yml` under the Community section:

```yaml
- label: Community
  items:
    - label: Model Providers
      items:
        - label: Your Provider
          link: community/model-providers/your-provider
    - label: Tools
      items:
        - label: your-tool
          link: community/tools/your-tool
```

## Examples to Follow

Look at existing community pages for reference:

-   **Tool**: [strands-deepgram.mdx](https://github.com/strands-agents/docs/blob/main/src/content/docs/community/tools/strands-deepgram.mdx)
-   **Model Provider**: [nvidia-nim.mdx](https://github.com/strands-agents/docs/blob/main/src/content/docs/community/model-providers/nvidia-nim.mdx)
-   **Session Manager**: [agentcore-memory.mdx](https://github.com/strands-agents/docs/blob/main/src/content/docs/community/session-managers/agentcore-memory.mdx)
-   **Integration**: [ag-ui.mdx](https://github.com/strands-agents/docs/blob/main/src/content/docs/community/integrations/ag-ui.mdx)

## Questions?

Open an issue at [strands-agents/docs](https://github.com/strands-agents/docs/issues) — we’re happy to help!