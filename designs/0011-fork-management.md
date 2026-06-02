# Managing Forked Dependencies

## Overview

The WASM integration in sdk-typescript depends on modified versions of several upstream repositories:

- **wasmtime** (Rust) — the WASM runtime
- **wasmtime-py** (Python) — Python bindings for wasmtime
- **componentize-js** (JavaScript) — JS component model tooling
- **jco** (JavaScript/Rust) — JS toolchain for WebAssembly Components

This document proposes an approach for housing these forks within the sdk-typescript repo to streamline development and CI/CD.

## Problem

Upstream WASM tooling does not yet support all the features we need for the Python-via-WASM bindings. Certain capabilities (e.g., async streaming) require workarounds that live in forked versions of these dependencies. Today, those forks exist as separate repositories, which creates friction:

- Changes that span sdk-typescript and a fork require coordinating across multiple repos, branches, and PRs.
- CI/CD pipelines must clone and build from multiple sources, adding complexity and fragility to the build.
- Contributors need to discover and set up the correct fork versions manually.
- There is no single place to see the full picture of what's modified and why.

Bringing the forks into sdk-typescript simplifies the development loop: one clone, one set of commits, one CI pipeline.

## Solution

Use **git subtrees** to import each fork's source directly into sdk-typescript.

Subtrees copy a remote repo's file tree into a subdirectory of the host repo. After import, the files are regular tracked content. No special tooling is required beyond the `git subtree` command, which ships with git.

Benefits of this approach:

- **Single clone** — contributors get everything with a standard `git clone`. No extra steps.
- **Atomic commits** — a change to sdk-typescript and a fork workaround land in one commit/PR.
- **Upstream sync** — `git subtree pull` merges new upstream changes; `git subtree push` extracts patches back when ready to upstream.
- **Simpler CI** — one checkout, one pipeline. No submodule initialization, no cross-repo coordination.

The resulting layout:

```
sdk-typescript/
├── strands-ts/              # existing SDK package
├── strands-wasm/            # existing WASM build tooling
├── strands-py-wasm/         # existing Python bindings
├── forks/
│   ├── wasmtime/            # subtree
│   ├── wasmtime-py/         # subtree
│   ├── componentize-js/     # subtree
│   └── jco/                 # subtree
├── package.json             # workspace config
```

## Metrics

sdk-typescript today clones at about 4 MB over the network (8.6 MB total on disk with full history, 408 files). After `npm ci`, disk usage grows to ~591 MB, almost entirely from `node_modules/` (~548 MB). The source code itself is small.

Each fork was measured via shallow clone (`--depth=1`) against the current main branch:

| Fork | Network transfer | Disk | Files | Notes |
|------|-----------------|------|-------|-------|
| wasmtime | 26 MB | 86 MB | 6,700 | Largest: `crates/` 41 MB, `cranelift/` 21 MB, `tests/` 17 MB |
| wasmtime-py | 304 KB | 1 MB | 91 | Negligible |
| componentize-js | 352 KB | 1.5 MB | 265 | Negligible |
| jco | 80 MB | 413 MB | 1,060 | 401 MB is `.wasm` test fixtures; source is ~12 MB |

wasmtime and jco carry significant weight in directories we don't need (test fixtures, docs, benchmarks). Maintaining a **slim branch** in each fork strips these before import:

| Fork | After stripping | Files | Reduction |
|------|----------------|-------|-----------|
| wasmtime (drop tests, docs, benches, examples) | ~60 MB | ~4,000 | ~30% |
| jco (drop test fixtures) | ~12 MB | ~650 | ~97% |
| wasmtime-py | No change needed | 91 | Already tiny |
| componentize-js | No change needed | 265 | Already tiny |

A slim branch is regenerated from main whenever upstream is updated:

```bash
# In the fork repo:
git checkout main
git pull upstream main
git checkout -B slim
git rm -rf tests/ docs/ benches/ examples/
git commit -m "chore: strip non-essential dirs for slim branch"
git push origin slim --force
```

Then pulled into sdk-typescript with `--squash` to collapse upstream history into a single merge commit:

```bash
git subtree add --prefix=forks/wasmtime <fork-url> slim --squash   # initial
git subtree pull --prefix=forks/wasmtime <fork-url> slim --squash  # updates
```

With all four forks imported (slim where applicable, squashed), the projected clone size rises from ~4 MB to roughly 30-35 MB. This is still modest compared to the ~548 MB that `npm ci` adds.

## Usage

### Making Changes to Fork Code

Edit files directly and commit normally:

```bash
vim forks/wasmtime/crates/something/src/lib.rs
git add forks/wasmtime/
git commit -m "fix: workaround for async streaming in wasmtime"
```

### Pulling Upstream Changes

Update the slim branch in the fork repo first (scripted), then pull into sdk-typescript:

```bash
git subtree pull --prefix=forks/wasmtime <fork-url> slim --squash
```

Conflicts with local patches are resolved as a normal merge.

### Pushing Changes Back Upstream

When ready to contribute fixes back:

```bash
git subtree push --prefix=forks/wasmtime <fork-url> my-upstream-pr-branch
```

This extracts only the commits that touched `forks/wasmtime/`, rewrites their paths (strips the prefix), and pushes them to the fork repo. From there, open a PR on the upstream project.

## Alternatives

### Submodules

Each fork lives in its own GitHub repo. sdk-typescript references them at pinned commits via `.gitmodules`. Each submodule is a pointer (SHA) to a specific commit in the fork repo. Contributors must use `git clone --recurse-submodules` or run `git submodule update --init` after cloning.

**Pros:**

- Each fork retains full independence (own history, branches, tags, CI).
- Pinned to exact commits for reproducible builds.
- No increase to sdk-typescript's pack size.
- Natural for upstreaming (fork repos are first-class).

**Cons:**

- Known developer experience pain: forgetting `--recurse-submodules` is common.
- PRs that span sdk-typescript + a fork require coordinating across repos.
- Detached HEAD state inside submodules is confusing.
- Nested submodules (wasmtime has its own) compound complexity.
- CI must be configured to initialize submodules.

### Git LFS

Replace large binary files (e.g., `.wasm` test fixtures) with small pointer files (~130 bytes each). Actual content lives on a separate LFS server and is fetched lazily on checkout. Supported on our GitHub Enterprise plan (5 GB storage, 5 GB/month bandwidth included).

**Pros:**

- Dramatically reduces clone size for repos with large binaries.
- Transparent to most workflows once set up.

**Cons:**

- Only helps with binary files; doesn't reduce file count from source directories (tests, docs, etc.).
- Adds infrastructure dependency (LFS server must be available).
- Some tooling (mirrors, forks, CI runners) doesn't handle LFS transparently.
- Switching files in/out of LFS after the fact is messy.
- Doesn't address the core problem of cross-repo coordination.

## References

- [Git Subtree Documentation](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging#_subtree_merge)
- [Git Submodule Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Git LFS](https://git-lfs.com/)
- [bytecodealliance/wasmtime](https://github.com/bytecodealliance/wasmtime)
- [bytecodealliance/wasmtime-py](https://github.com/bytecodealliance/wasmtime-py)
- [bytecodealliance/ComponentizeJS](https://github.com/bytecodealliance/ComponentizeJS)
- [bytecodealliance/jco](https://github.com/bytecodealliance/jco)
