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

This repository contains the documentation for the Strands Agents SDK, a simple yet powerful framework for building and running AI agents. The documentation is built using [MkDocs](https://www.mkdocs.org/) and provides guides, examples, and API references.

The official documentation is available online at: https://strandsagents.com.

## Local Development

### Prerequisites

- Python 3.10+, node 20+

### Setup and Installation

```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate

pip install .

# Install node dependencies
npm install
```

### Building and Previewing

To generate the static site:

```bash
mkdocs build
```

This will create the site in the `site` directory.

To run a local development server:

```bash
mkdocs serve
```

This will start a server at http://127.0.0.1:8000/ for previewing the documentation.

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

