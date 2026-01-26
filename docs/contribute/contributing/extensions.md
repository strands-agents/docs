# Building Extensions

Extensions are tools, model providers, hooks, and session managers that extend Strands capabilities. You publish these as your own packages on PyPI.

## Why build an extension

When you build something useful, publishing it as your own package gives you control and visibility.

| Benefit | Description |
|---------|-------------|
| **Ownership** | You control the roadmap, features, and release schedule |
| **Speed** | Release updates immediately without waiting for core SDK releases |
| **Credit** | Your name and contribution are front and center |
| **Discoverability** | Listed in our community catalog for thousands of developers to find |

## Quick start

We provide a GitHub template with everything pre-configured—package structure, CI/CD, testing setup, and publishing workflows.

1. **Use the template** — Go to [strands-agents/strands-template](https://github.com/strands-agents/strands-template) and click "Use this template"
2. **Run setup** — Clone your repo and run `python setup_template.py`
3. **Add your code** — Implement your extension
4. **Publish** — Create a GitHub release to automatically publish to PyPI

## Step-by-step guide

### Prerequisites

- **GitHub account** — For hosting your repository and CI/CD
- **PyPI account** — Create one at [pypi.org/account/register](https://pypi.org/account/register/)

### Create your repository

Go to [strands-agents/strands-template](https://github.com/strands-agents/strands-template) and click "Use this template".

Clone it locally and run the setup script:

```bash
git clone https://github.com/YOUR_USERNAME/your-repo-name
cd your-repo-name
python setup_template.py
```

The script prompts for your package name, author info, and description.

### Implement your extension

The template includes skeleton implementations for all extension types:

| File | Component | Purpose |
|------|-----------|---------|
| `tool.py` | Tool | Add capabilities to agents using the `@tool` decorator |
| `model.py` | Model provider | Integrate custom LLM APIs |
| `hook_provider.py` | Hook provider | React to agent lifecycle events |
| `session_manager.py` | Session manager | Persist conversations across restarts |

**Keep what you need, delete the rest.** Most packages only need one or two components.

For implementation guidance:

- [Creating custom tools](../../user-guide/concepts/tools/custom-tools.md)
- [Custom model providers](../../user-guide/concepts/model-providers/custom_model_provider.md)
- [Hooks](../../user-guide/concepts/agents/hooks.md)
- [Session management](../../user-guide/concepts/agents/session-management.md)

### Test your code

```bash
pip install -e ".[dev]"
hatch run prepare  # Runs format, lint, typecheck, test
```

### Configure PyPI publishing

The template includes a GitHub Actions workflow that publishes to PyPI on release.

To enable it, configure PyPI trusted publishing:

1. Go to [PyPI](https://pypi.org) → Your projects → Publishing
2. Add a new pending publisher with your GitHub repo details
3. Set environment name to `pypi`

### Publish

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Create a tag following [semantic versioning](https://semver.org/) (e.g., `v0.1.0`)
4. Click "Publish release"

GitHub Actions builds and publishes your package. Anyone can now install it:

```bash
pip install strands-yourname
```

## Naming conventions

| Item | Convention | Example |
|------|------------|---------|
| PyPI package | `strands-{name}` | `strands-slack` |
| Python module | `strands_{name}` | `strands_slack` |
| GitHub topic | `strands-agents` | For discoverability |

## Get discovered

After publishing:

1. **Add GitHub topics** — Add `strands-agents` to your repository
2. **Submit to catalog** — Get listed in our [community catalog](../../community/community-packages.md)

→ [Get Featured guide](../../community/get-featured.md)

## Tips for quality extensions

| Principle | How to apply |
|-----------|--------------|
| Clear naming | Use verb-noun pairs like `search_database`, not `query` |
| Detailed docstrings | Include parameter explanations, examples, and edge cases |
| Error handling | Catch specific exceptions and provide actionable messages |
| Type hints | Use type annotations on all parameters and returns |
