# Contributing to core SDK

The core SDK powers every Strands agent—the agent loop, model integrations, tool execution, and streaming. When you fix a bug or improve performance here, you're helping every developer who uses Strands.

This guide walks you through contributing to sdk-python and sdk-typescript.

## What we accept

We welcome contributions that improve the SDK for everyone.

- Bug fixes with tests that verify the fix
- Performance improvements with benchmarks showing the improvement
- Documentation improvements including docstrings and examples
- Features that align with our [roadmap](https://github.com/orgs/strands-agents/projects/1)
- Small, focused changes that solve a specific problem

## What we don't accept

Some contributions don't fit the core SDK. Understanding this upfront saves you time.

- Large refactors without prior discussion and approval
- Breaking changes without RFC approval
- External tools to the core tools repository — [publish your own](../extensions/publishing.md) instead
- Changes without tests, except documentation

If you're unsure whether your contribution fits, [open a discussion](https://github.com/strands-agents/sdk-python/discussions) first.

## Set up your development environment

Let's get your local environment ready for development.

=== "Python"

    First, we'll clone the repository and set up the virtual environment.

    ```bash
    git clone https://github.com/strands-agents/sdk-python.git
    cd sdk-python
    ```

    We use hatch for Python development. Enter the virtual environment and install pre-commit hooks.

    ```bash
    hatch shell
    pre-commit install -t pre-commit -t commit-msg
    ```

    Now let's verify everything works by running the tests.

    ```bash
    hatch test
    ```

    You can also run linters and formatters.

    ```bash
    hatch fmt --linter      # Check for issues
    hatch fmt --formatter   # Auto-format code
    ```

=== "TypeScript"

    First, we'll clone the repository and install dependencies.

    ```bash
    git clone https://github.com/strands-agents/sdk-typescript.git
    cd sdk-typescript
    npm install
    ```

    Now let's verify everything works.

    ```bash
    npm test
    npm run lint
    npm run format
    ```

## Submit your contribution

Once you've made your changes, here's how to submit them.

1. **Check existing issues** to see if your bug or feature is already tracked
2. **Open an issue first** for non-trivial changes to discuss your approach
3. **Fork and create a branch** with a descriptive name like `fix/session-memory-leak`
4. **Write tests** for your changes
5. **Run formatters** before committing to ensure consistent style
6. **Use conventional commits** like `fix: resolve memory leak in session manager`
7. **Submit a pull request** referencing the issue number
8. **Respond to feedback** — we'll review within 3 days

## Related guides

- [Feature proposals](./feature-proposals.md) — For significant features requiring discussion
- [Design principles](https://github.com/strands-agents/sdk-python/blob/main/CONTRIBUTING.md#development-tenets) — What guides our decisions
