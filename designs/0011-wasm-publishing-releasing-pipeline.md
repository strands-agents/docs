# Publish and Release Strategy

## Overview

Today, the TypeScript SDK (`@strands-agents/sdk`) and the Python SDK (`strands-agents`) live in separate repositories. Each has its own independent release pipeline: a maintainer creates a git tag, publishes a GitHub Release, and CI builds and publishes the package to its respective registry (npm or PyPI).

With the monorepo effort, both language SDKs will be consolidated into a single repository. The repository will produce two user-facing packages from one codebase, which creates a natural need for a coordinated publish pipeline:

| Package | Registry | Consumers |
|---------|----------|-----------|
| `@strands-agents/sdk` | npm | JS/TS developers using the SDK directly |
| `strands-agents` | PyPI | Python developers using the SDK via WASM |

As part of the WASM effort, the TypeScript SDK becomes the canonical agent runtime and the single source of truth for all agent logic. The Python 2.0 SDK will not reimplement the runtime; instead, it provides a thin host that loads and executes the TS runtime (compiled to a WASM component) using wasmtime-py. Future language SDKs (Rust, Java, Go) follow the same pattern, resulting in one implementation shared across all languages.

### Key Concepts

- **WIT** is a language-neutral interface definition that lives in `wit/`. It defines the contract between the WASM component (guest) and the language host. The guest implements the interface, and the host calls into it.
- **WASM Component** is the TypeScript SDK compiled into a self-contained binary (`strands-agent.wasm`). It is never published to a registry as a standalone package because it has no consumer on its own. It only has value when loaded by a language host, so it is embedded directly inside the host's package (e.g., inside the Python wheel).
- **Language Host** is the language-specific code that loads the `.wasm` binary, implements host-side WIT imports (tool dispatch, logging, storage), and exposes an idiomatic developer API.

### Repository Layout

```
sdk-typescript/
├── strands-ts/              TypeScript SDK source
├── strands-wasm/            WASM component build (internal, not published)
├── strands-py/              Python host + SDK surface
├── wit/                     WIT contract (shared interface definition)
└── .github/workflows/
    └── publish-on-release.yml   Single workflow triggered by GitHub Release
```

---

## Versioning

The monorepo must coordinate releases across multiple packages going to different registries.

### Option 1: Lockstep Versioning (Recommended)

A single `v*` tag publishes all packages at the same version:

| Tag | Publishes |
|-----|-----------|
| `v1.2.3` | `@strands-agents/sdk@1.2.3` on npm AND `strands-agents==1.2.3` on PyPI |

**Why this is recommended:** The Python wheel physically contains the TypeScript runtime compiled at that commit. The coupling is inherent:

```
TS change → rebuild .wasm → rebuild wheel → new PyPI release
```

Every TypeScript change forces a Python release. Independent versioning would add coordination overhead without reflecting reality, since the packages are always in sync because one physically contains the other. Users can rely on npm `1.2.3` and PyPI `1.2.3` being the same runtime.

**Cost:** A Python-host-only fix still bumps the npm version. In practice this is harmless because the npm package content remains unchanged.

### Option 2: Per-Package Tags

Each package gets its own tag prefix and versions independently:

| Tag | Publishes |
|-----|-----------|
| `ts/v1.2.3` | `@strands-agents/sdk@1.2.3` on npm |
| `py/v2.0.0` | `strands-agents==2.0.0` on PyPI |

**When this makes sense:** If the packages begin to evolve at significantly different cadences, or if publishing all packages on every release becomes costly (e.g., many languages with slow publish pipelines).

**Cost:** Users must maintain a compatibility mapping between npm and PyPI versions. Releases require deciding which packages need a tag. A TypeScript change that Python users need still requires both tags, which adds a decision step without reducing work.


---

## Publish Workflow

This section describes the workflow for the lockstep versioning strategy (Option 1).

A new single workflow (`publish-on-release.yml`) replaces the existing separate `npm-publish-on-release.yml` and `pypi-publish-on-release.yml`. It is triggered by a GitHub Release, builds the WASM component once, and fans out to publish each package independently.

### Trigger

```yaml
on:
  release:
    types: [published]
```

Version extraction: `${GITHUB_REF#refs/tags/v}` (e.g., `v1.2.3` → `1.2.3`).

### Job Structure

```
release published (v1.2.3)
    │
    ├──→ call-ts-check (existing ts-check.yml)
    ├──→ call-ts-test (existing ts-test.yml)
    ├──→ call-py-check (existing py-check.yml)
    │
    └──→ build-wasm (needs: call-ts-check, call-ts-test)
              │
              ├──→ publish-npm (needs: build-wasm)
              │
              └──→ publish-pypi (needs: build-wasm, call-py-check)
```

The workflow first runs validation by calling the existing reusable workflows (`ts-check.yml`, `ts-test.yml`, `py-check.yml`) in parallel. Once those pass, `build-wasm` compiles the TypeScript SDK into a WASM component and uploads it as a GitHub Actions artifact. The two publish jobs then run in parallel:

**build-wasm** builds strands-ts, then builds strands-wasm, and uploads the resulting `.wasm` binary as a workflow artifact. This job serves as the gate: if TypeScript checks or tests fail, it never runs, and neither publish job can proceed.

**publish-npm** stamps the version from the release tag, builds strands-ts, and publishes `@strands-agents/sdk` to npm via OIDC-based provenance. It rebuilds strands-ts locally because `npm publish` requires the compiled `dist/` directory on disk.

**publish-pypi** downloads the `.wasm` artifact produced by `build-wasm`, builds a Python wheel using `hatch build` (a build hook copies the `.wasm` into the package), and publishes `strands-agents` to PyPI via OIDC-based trusted publishing. This job uses Python only and does not require Node.js.

---

## Extending to New Languages

Each new language SDK (Rust, Java, Go, .NET, etc.) follows the same pattern: implement a host using that language's WASM runtime, embed the `.wasm` binary in that ecosystem's package format, and publish to that ecosystem's registry.

To add a new language to the publish pipeline:

- Add a `strands-{lang}/` directory with the host implementation.
- Add a `publish-{lang}` job to `publish-on-release.yml` that depends on `build-wasm`.
- The job downloads the pre-built `.wasm` artifact, packages it, and publishes without requiring Node.js.

The `.wasm` is built once by `build-wasm` and shared across all language publish jobs. Adding a new language requires no changes to existing packages or workflows.

---

## Appendix

### Size Considerations

- The npm tarball for `@strands-agents/sdk` is approximately 1.1 MB compressed (6.5 MB unpacked).
- The `.wasm` binary is approximately 42 MB.
- The PyPI wheel for `strands-agents` will be approximately 42 MB since it embeds the `.wasm`. The default PyPI upload limit is 100 MB, which is sufficient. If size grows, a limit increase can be requested.

If the `.wasm` binary size becomes a concern, `wasm-opt` can be used to reduce it.

### Local Development

These are the commands a developer runs locally to build and test each part of the system during development.

**Full build:**

```bash
npm ci                               # install dependencies
npm run build                        # build TS SDK
npm run build -w strands-wasm        # build WASM component
cd strands-py && hatch build         # build Python wheel (hook copies .wasm)
```

**TS-only iteration:**

```bash
npm run build
npm run test
```

**Python SDK iteration:**

```bash
npm run build                        # rebuild TS
npm run build -w strands-wasm        # rebuild WASM
cd strands-py && pip install -e .    # editable install (hook copies .wasm)
```
