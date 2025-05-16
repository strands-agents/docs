## Strands Agents Documentation

<div align="center">
  <h3>
    Documentation for Strand Agents SDK - a lightweight, code-first framework for building production-ready AI agents
  </h3>

  <a href="https://cuddly-sniffle-lrmk2y7.pages.github.io/">Documentation</a>
  ◆ <a href="https://github.com/strands-agents/sdk-python">SDK</a>
  ◆ <a href="https://github.com/strands-agents/tools">Tools</a>
  ◆ <a href="https://github.com/strands-agents/agent-builder">Agent Builder</a>
</div>

## Overview

This repository contains the documentation for the Strands Agents SDK, a simple yet powerful framework for building and running AI agents. The documentation is built using [MkDocs](https://www.mkdocs.org/) and provides guides, examples, and API references.

The official documentation is available online at: https://cuddly-sniffle-lrmk2y7.pages.github.io.

## Local Development

### Prerequisites

- Python 3.10+

### Setup and Installation

```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate

pip install -r requirements.txt
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

## Related Repositories

- [Strands Agents SDK](https://github.com/strands-agents/sdk-python) - The core SDK for building AI agents
- [Strands Tools](https://github.com/strands-agents/tools) - Pre-built tools for Strands Agents
- [Strands Agent Builder](https://github.com/strands-agents/agent-build) - Command-line interface for building Strands Agents

## Contributing

We welcome contributions to improve the documentation! Please see our [Contributing Guide](https://github.com/strands-agents/docs/blob/main/CONTRIBUTING.md) for more details.

## Security

See [CONTRIBUTING.md](https://github.com/strands-agents/sdk-python/blob/main/CONTRIBUTING.md#security-issue-notifications) for more information on reporting security issues.

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Preview Status

Strands Agents and its documentation is currently in public preview. During this period:
- APIs may change as we refine the SDK
- We welcome feedback and contributions
