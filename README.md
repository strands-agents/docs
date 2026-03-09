<div align="center">
  <div>
    <a href="https://strandsagents.com">
      <img src="https://strandsagents.com/latest/assets/logo-github.svg" alt="Strands Agents" width="55px" height="105px">
    </a>
  </div>

  <h1>
    Strands Agents Documentation
  </h1>

  <h2>
    A model-driven approach to building AI agents in just a few lines of code.
  </h2>

  <div align="center">
    <a href="https://github.com/strands-agents/docs/graphs/commit-activity"><img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/strands-agents/docs"/></a>
    <a href="https://github.com/strands-agents/docs/issues"><img alt="GitHub open issues" src="https://img.shields.io/github/issues/strands-agents/docs"/></a>
    <a href="https://github.com/strands-agents/docs/pulls"><img alt="GitHub open pull requests" src="https://img.shields.io/github/issues-pr/strands-agents/docs"/></a>
    <a href="https://github.com/strands-agents/docs/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/strands-agents/docs"/></a>
  </div>
  
  <p>
    <a href="https://strandsagents.com/">Documentation</a>
    ◆ <a href="https://github.com/strands-agents/samples">Samples</a>
    ◆ <a href="https://github.com/strands-agents/sdk-python">Python SDK</a>
    ◆ <a href="https://github.com/strands-agents/tools">Tools</a>
    ◆ <a href="https://github.com/strands-agents/agent-builder">Agent Builder</a>
    ◆ <a href="https://github.com/strands-agents/mcp-server">MCP Server</a>
  </p>
</div>

This repository contains the documentation for the Strands Agents SDK, a simple yet powerful framework for building and running AI agents. The documentation is built using [Astro](https://astro.build/) with the [Starlight](https://starlight.astro.build/) theme and provides guides, examples, and API references.

The official documentation is available online at: https://strandsagents.com.

## Local Development

### Prerequisites

- Python 3.10+
- Node.js 20+, npm

### Setup and Installation

```bash
npm install
```

### Building and Previewing

Generate the static site:

```bash
npm run build
```

Run a local development server at http://localhost:4321/:

```bash
npm run dev
```

### Writing Documentation

Documentation lives in `docs/` as Markdown files. The site structure is driven by `src/config/navigation.yml` (navigation) and rendered by Astro at build time.

- Pages are written in standard Markdown — no Astro-specific syntax needed for content edits
- Use `<Tabs>` / `<Tab label="...">` for language-switching code blocks (auto-imported, no import needed)
- Use `--8<-- "path/to/file.ts:snippet_name"` to include code snippets from external files
- Link to other pages using relative file paths (e.g. `../tools/index.md`) — they resolve automatically
- Link to API reference pages using the `@api` shorthand: `[@api/python/strands.agent.agent](#AgentResult)`

For a full reference on customizations, components, and the migration status, see [Site Architecture](SITE-ARCHITECTURE.md).

## Contributing ❤️

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details on:
- Reporting bugs & features
- Development setup
- Contributing via Pull Requests
- Code of Conduct
- Reporting of security issues

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

