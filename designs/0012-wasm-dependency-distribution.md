# WASM Dependency Distribution

## Overview

The WASM integration in sdk-typescript depends on forked versions of:

- **wasmtime** (Rust) — the WASM runtime, built as part of wasmtime-py wheels
- **wasmtime-py** (Python) — Python bindings that load and execute the WASM component
- **componentize-js** (JavaScript) — compiles bundled JS into a WASM component
- **jco** (JavaScript/Rust) — generates TypeScript types from WIT and transpiles WASM for testing

These forks contain workarounds for features not yet available upstream (e.g., async streaming). This document proposes how to distribute these forks and how developers interact with them locally.

## Problem

The forks need to be consumable by both sdk-typescript's build process and end users of strands-py-wasm. Today, this is handled ad hoc (e.g., `@chaynabors/componentize-js` published manually to npm). There's no unified approach for:

- Publishing fork artifacts reliably.
- Testing fork changes against sdk-typescript before shipping.
- Giving developers a fast local iteration loop when modifying forks.
- Keeping sdk-typescript's repo and CI simple.

## Solution

Publish fork artifacts to **npm** and **PyPI** under the `@strands-agents` scope. Use a dedicated fork repo with CI that tests against sdk-typescript before publishing. Use **git submodules** in sdk-typescript as an optional local development convenience.

### Distribution

Fork artifacts are published to public package registries:

| Fork | Registry | Package name | Notes |
|------|----------|--------------|-------|
| componentize-js | npm | `@strands-agents/componentize-js` | JS package |
| jco | npm | `@strands-agents/jco` | JS package |
| wasmtime + wasmtime-py | PyPI | `strands-agents-wasmtime` | wasmtime Rust source compiled into wasmtime-py wheels |

sdk-typescript consumes them as normal dependencies:

```json
// strands-wasm/package.json
{
  "devDependencies": {
    "@strands-agents/componentize-js": "^0.19.3",
    "@strands-agents/jco": "^1.16.1"
  }
}
```

```toml
# strands-py-wasm/pyproject.toml
dependencies = [
    "strands-agents-wasmtime>=37.0.0,<38.0.0",
]
```

### Fork Repo Structure

A single repo contains all fork source and CI. Each upstream dependency is imported via **git subtree**, enabling periodic sync with upstream while keeping everything in one place:

```
strands-agents/wasm-deps/
├── wasmtime/                 # subtree from bytecodealliance/wasmtime
├── wasmtime-py/              # subtree from bytecodealliance/wasmtime-py
├── componentize-js/          # subtree from bytecodealliance/ComponentizeJS
├── jco/                      # subtree from bytecodealliance/jco
└── .github/workflows/
    ├── test.yml              # test against sdk-typescript on PR
    └── publish.yml           # build and publish on release tag
```

Day-to-day, developers just edit files and commit normally. The subtree commands are only used for syncing with upstream:

```bash
# Pull latest upstream changes into a specific dependency:
git subtree pull --prefix=wasmtime https://github.com/bytecodealliance/wasmtime.git main --squash

# Push a fix back upstream (when ready to contribute):
git subtree push --prefix=wasmtime https://github.com/bytecodealliance/wasmtime.git fix/async-streaming
```

### CI Pipeline (Fork Repo)

On push/PR, the fork repo's CI validates changes against sdk-typescript:

```yaml
# test.yml
- run: npm run build                           # build fork artifacts
- run: git clone https://github.com/strands-agents/sdk-typescript.git /tmp/sdk-ts
- run: cd /tmp/sdk-ts && npm ci
- run: cd /tmp/sdk-ts && npm link ${{ github.workspace }}/componentize-js
- run: cd /tmp/sdk-ts && npm test              # validate compatibility
```

On release tag, publish:

```yaml
# publish.yml
- run: npm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

sdk-typescript's own CI has no awareness of forks. It runs `npm ci`, which pulls published packages from the registry.

### Local Development (Submodules)

Submodules give developers a consistent local checkout of the fork source for fast iteration:

```
sdk-typescript/
├── strands-ts/
├── strands-wasm/
├── strands-py-wasm/
├── forks/                        # submodules (optional)
│   ├── wasmtime/                # → github.com/strands-agents/wasmtime
│   ├── wasmtime-py/             # → github.com/strands-agents/wasmtime-py
│   ├── componentize-js/         # → github.com/strands-agents/componentize-js
│   └── jco/                     # → github.com/strands-agents/jco
```

Submodules are optional. Contributors who don't work on the WASM layer never initialize them:

```bash
# Normal contributor:
git clone git@github.com:strands-agents/sdk-typescript.git
npm ci       # pulls published packages from registry
npm test     # works fine

# WASM developer:
git clone --recurse-submodules git@github.com:strands-agents/sdk-typescript.git
npm ci
npm run dev:link-forks    # overrides registry packages with local submodule source
```

The `dev:link-forks` script in the root `package.json`:

```json
{
  "scripts": {
    "dev:link-forks": "npm link ./forks/componentize-js ./forks/jco"
  }
}
```

This creates symlinks in `node_modules` pointing at the submodule directories instead of the published registry versions.

## Usage

### Normal Development (No Fork Changes)

No special steps. `npm ci` and `pip install` pull from registries as usual.

### Modifying Fork Code Locally

```bash
# Initialize submodules (one time)
git submodule update --init

# Get on a feature branch in the fork
cd forks/componentize-js
git checkout -b fix/async-streaming

# Make changes and rebuild
vim src/something.ts
npm run build

# Link into sdk-typescript
cd ../..
npm run dev:link-forks

# Test
cd strands-wasm && node build.js
```

For Python (wasmtime-py):

```bash
cd forks/wasmtime-py
pip install -e .

# Now strands-py-wasm uses the local wasmtime-py
# Changes to Python files are reflected immediately
```

### Publishing Fork Changes

```bash
# Push the feature branch in the fork submodule
cd forks/componentize-js
git push origin fix/async-streaming

# Open a PR in the wasm-deps repo
# Fork repo CI runs:
#   1. Builds package
#   2. Tests against sdk-typescript
#   3. Publishes to npm on merge/tag

# After merge, update submodule pointer in sdk-typescript
cd ../..
git add forks/componentize-js
git commit -m "chore: bump componentize-js submodule"

# Bump version in package.json (or let Dependabot handle it)
```

### Unlinking (Back to Published Packages)

```bash
npm ci    # reinstalls everything from registry, links are gone
```

## References

- [npm link documentation](https://docs.npmjs.com/cli/v10/commands/npm-link)
- [pip editable installs](https://pip.pypa.io/en/stable/topics/local-project-installs/#editable-installs)
- [Git Submodule Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [GitHub Packages](https://docs.github.com/en/packages)
- [npm publishing](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [bytecodealliance/wasmtime-py](https://github.com/bytecodealliance/wasmtime-py)
- [bytecodealliance/ComponentizeJS](https://github.com/bytecodealliance/ComponentizeJS)
- [bytecodealliance/jco](https://github.com/bytecodealliance/jco)
