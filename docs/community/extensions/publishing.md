# Publishing extensions

You've built a useful tool or integration for Strands. Now you want to share it with others so they can benefit from your work. This guide walks you through publishing your extension to PyPI so anyone can install it with `pip install`.

We'll use our GitHub template to handle the boilerplate—package structure, CI/CD, testing setup, dependency management—so you can focus on your tool code. By the end, you'll have a published package and know how to release updates.

## Before you start

You'll need a GitHub account and a PyPI account. Publishing to PyPI makes your package installable via `pip` and discoverable through PyPI search.

**Prerequisites:**

- **GitHub account** — For hosting your repository and CI/CD
- **PyPI account** — Create one at [pypi.org/account/register](https://pypi.org/account/register/)
- **Your tool code** — A working Strands tool or integration you want to share

If you don't have a PyPI account yet, creating one takes just a minute and is completely free.

## Create your package

We provide GitHub templates with everything pre-configured. Let's start by creating your repository from the template.

### Step 1: Use the template

The template repository includes all the packaging boilerplate you need—no need to figure out `setup.py`, CI/CD workflows, or testing configuration.

=== "Python"

    Go to [github.com/strands-agents/strands-tool-template](https://github.com/strands-agents/strands-tool-template) and click "Use this template" to create your repository.

    Name it following the convention `strands-tool-{name}`, for example:
    
    - `strands-tool-slack` for a Slack integration
    - `strands-tool-postgres` for PostgreSQL tools
    - `strands-tool-weather` for weather APIs

    This naming convention helps developers discover your package and understand what it does at a glance.

=== "TypeScript"

    TypeScript templates are coming soon. For now, you can use the Python template as a reference for structure and CI/CD configuration.

### Step 2: Clone and customize

Clone your new repository and open it in your editor. We'll customize it with your tool code and package details.

```bash
git clone https://github.com/YOUR_USERNAME/strands-tool-example.git
cd strands-tool-example
```

The template includes placeholder code showing the structure. Take a moment to explore the key files:

- `src/strands_tool_example/` — Your tool code goes here
- `tests/` — Test files for your tools
- `pyproject.toml` — Package configuration and dependencies
- `.github/workflows/` — CI/CD automation for testing and publishing
- `README.md` — Package documentation

### Step 3: Add your tool code

Open `src/strands_tool_example/your_tool.py` and replace the placeholder with your implementation. Use the `@tool` decorator to define your tools.

```python
from strands import tool

@tool
def search_database(query: str, limit: int = 10) -> list[dict]:
    """
    Search the database for matching records.
    
    Use this tool when you need to find records based on a search query.
    The search is case-insensitive and supports fuzzy matching.
    
    Args:
        query: Search query string
        limit: Maximum results to return (default: 10)
        
    Returns:
        List of matching records with id, name, and metadata
        
    Example:
        >>> search_database("customer orders", limit=5)
        [{"id": 1, "name": "Order #123", ...}, ...]
    """
    # Your implementation here
    results = perform_database_search(query, limit)
    return results
```

**Writing good docstrings is critical**—the docstring is what the AI agent reads to understand when and how to use your tool. Include clear descriptions, parameter explanations, and examples.

Update the package name in `pyproject.toml` to match your tool name. Change all instances of `strands-tool-example` and `strands_tool_example` to your chosen name.

### Step 4: Write tests

Add tests in the `tests/` directory. The template includes pytest configuration and example tests to get you started. Good tests give users confidence in your package and help you catch bugs before they ship.

```python
# tests/test_your_tool.py
from strands_tool_yourname import search_database

def test_search_database_basic():
    """Test basic search functionality."""
    results = search_database("test query", limit=5)
    
    assert isinstance(results, list)
    assert len(results) <= 5
    
def test_search_database_empty():
    """Test search with no results."""
    results = search_database("nonexistent query")
    
    assert results == []
```

Run tests locally to verify everything works.

```bash
# Set up development environment
hatch shell

# Run tests
hatch test

# Run with coverage
hatch test -c
```

The template's CI/CD will automatically run these tests on every pull request and before publishing.

## Configure publishing

Now we'll set up automatic publishing to PyPI when you create a release. The template handles the mechanics—you just need to provide credentials.

### Step 1: Create a PyPI API token

PyPI uses API tokens for secure authentication. These tokens are safer than passwords because you can scope them to specific packages and revoke them if needed.

Go to [pypi.org/manage/account/token](https://pypi.org/manage/account/token/) and create a new API token. Give it a descriptive name like "strands-tool-example GitHub Actions" so you can identify it later.

**Important:** Copy the token immediately—PyPI only shows it once. It starts with `pypi-`.

### Step 2: Add the secret to GitHub

In your GitHub repository, go to Settings → Secrets and variables → Actions. Click "New repository secret" and add:

- **Name:** `PYPI_API_TOKEN`
- **Value:** Your PyPI token (the full string starting with `pypi-`)

The template's GitHub Actions workflow is already configured to use this secret. It will automatically build and publish your package to PyPI whenever you create a release.

## Publish your package

With everything configured, publishing is simple. Creating a GitHub release triggers automatic publishing to PyPI.

### Step 1: Create a release

Go to your repository on GitHub and click "Releases" → "Create a new release".

**Create a new tag** following [semantic versioning](https://semver.org/):

- `v0.1.0` for your first release
- `v0.2.0` for new features
- `v0.1.1` for bug fixes
- `v1.0.0` when you're ready for production

**Add release notes** describing what your tool does and any changes in this version. Good release notes help users understand what they're getting.

**Example release notes:**

```markdown
## Features

- Added search_database tool for PostgreSQL integration
- Support for fuzzy search and pagination
- Configurable connection pooling

## Installation

pip install strands-tool-postgres

## Usage

from strands import Agent
from strands_tool_postgres import search_database

agent = Agent(tools=[search_database])
agent("Find all customers from last week")
```

### Step 2: Watch it publish

GitHub Actions automatically builds and publishes your package to PyPI. You can watch the progress in the Actions tab of your repository.

Once complete (usually 1-2 minutes), anyone can install your tool:

```bash
pip install strands-tool-yourname
```

And that's it! Your tool is now available to the entire Strands community 🥳

## Get discovered

To help others find your tool, take these steps to increase visibility.

### Add GitHub topics

Add the `strands-tool` topic to your GitHub repository. Go to your repository's main page, click the gear icon next to "About", and add `strands-tool` to the topics list. This makes your tool discoverable through GitHub topic searches.

### Submit to the community catalog

Submit your tool to be featured in our [community catalog](../community-packages.md). Create an issue in the [docs repository](https://github.com/strands-agents/docs/issues/new?template=content_addition.yml) with:

- Package name and PyPI link
- Clear description of what it does
- Usage examples showing basic integration
- Link to documentation

We review submissions within 3 days. Well-documented packages with tests get priority for listing.

### Write good documentation

Your `README.md` is the first thing users see. Make it count.

**Essential sections:**

- **Installation** — Simple pip install command
- **Quick start** — Minimal example showing basic usage
- **Features** — What your tool can do
- **Configuration** — Any required setup or credentials
- **Examples** — Real-world usage scenarios
- **Contributing** — How others can help improve your tool

## Next steps

- [Extension best practices](./best-practices.md) — Guidelines for building high-quality extensions
- [Community catalog](../community-packages.md) — See what others have built
