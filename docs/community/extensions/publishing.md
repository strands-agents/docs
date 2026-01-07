# Publishing extensions

You've built a useful tool or integration for Strands. Now you want to share it with others. This guide walks you through publishing your extension to PyPI so anyone can install it with `pip install`.

We'll use our GitHub template to handle the boilerplate—package structure, CI/CD, testing setup—so you can focus on your code.

## Before you start

You'll need a GitHub account and a PyPI account. If you don't have a PyPI account, create one at [pypi.org/account/register](https://pypi.org/account/register/).

## Create your package

We provide GitHub templates with everything pre-configured. Let's start by creating your repository.

### Step 1: Use the template

=== "Python"

    Go to [github.com/strands-agents/strands-tool-template](https://github.com/strands-agents/strands-tool-template) and click "Use this template" to create your repository.

    Name it following the convention `strands-tool-{name}`, for example `strands-tool-slack` or `strands-tool-postgres`.

=== "TypeScript"

    TypeScript templates are coming soon. For now, you can use the Python template as a reference for structure and CI/CD configuration.

### Step 2: Clone and customize

Clone your new repository and open it in your editor.

```bash
git clone https://github.com/YOUR_USERNAME/strands-tool-example.git
cd strands-tool-example
```

The template includes placeholder code showing the structure. Let's look at the key files.

### Step 3: Add your tool code

Open `src/strands_tool_example/your_tool.py` and replace the placeholder with your implementation.

```python
from strands import tool

@tool
def search_database(query: str, limit: int = 10) -> list[dict]:
    """
    Search the database for matching records.
    
    Args:
        query: Search query string
        limit: Maximum results to return
        
    Returns:
        List of matching records
    """
    # Your implementation here
    return results
```

Update the package name in `pyproject.toml` to match your tool name. Change `strands-tool-example` to `strands-tool-yourname`.

### Step 4: Write tests

Add tests in the `tests/` directory. The template includes pytest configuration and example tests to get you started.

```bash
# Run tests locally
hatch test
```

## Configure publishing

Now we'll set up automatic publishing to PyPI when you create a release.

### Step 1: Create a PyPI API token

Go to [pypi.org/manage/account/token](https://pypi.org/manage/account/token/) and create a new API token. Give it a descriptive name like "strands-tool-example GitHub Actions".

### Step 2: Add the secret to GitHub

In your GitHub repository, go to Settings → Secrets and variables → Actions. Click "New repository secret" and add:

- Name: `PYPI_API_TOKEN`
- Value: Your PyPI token (starts with `pypi-`)

The template's GitHub Actions workflow will use this token to publish automatically.

## Publish your package

With everything configured, publishing is simple.

### Step 1: Create a release

Go to your repository on GitHub and click "Releases" → "Create a new release".

Create a new tag following semantic versioning, like `v0.1.0`. Add release notes describing what your tool does.

### Step 2: Watch it publish

GitHub Actions automatically builds and publishes your package to PyPI. Check the Actions tab to see the workflow run.

Once complete, anyone can install your tool:

```bash
pip install strands-tool-yourname
```

And that's it! Your tool is now available to the entire Strands community 🥳

## Get discovered

To help others find your tool, add the `strands-tool` topic to your GitHub repository. Go to your repository's main page, click the gear icon next to "About", and add `strands-tool` to the topics.

You can also submit your tool to be featured in our [community catalog](../community-packages.md). Create an issue in the [docs repository](https://github.com/strands-agents/docs/issues/new?template=content_addition.yml) with your package name, description, and usage examples.

## Next steps

- [Extension best practices](./best-practices.md) — Guidelines for building high-quality extensions
- [Community catalog](../community-packages.md) — See what others have built
