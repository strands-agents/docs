# Code Verification Procedure

When writing or auditing documentation, verify every code example against the actual SDK source. Plausible-but-wrong code erodes developer trust faster than missing documentation.

Use the first tier available in your environment. Fall back only when the preferred tier is unavailable.

## Tier 1: GitHub API (preferred)

```bash
# Python SDK
gh api repos/strands-agents/sdk-python/contents/src/strands/[path]

# TypeScript SDK
gh api repos/strands-agents/sdk-typescript/contents/src/[path]
```

**Key Python modules:**
- `agent/agent.py` — Agent class, constructor signature
- `tools/decorator.py` — @tool decorator
- `hooks/registry.py` — Hook registration
- `types/exceptions.py` — Error classes
- `models/` — Model providers
- `agent/conversation_manager/` — ConversationManager implementations

**Key TypeScript paths:**
- `src/` (root, not `src/strands/`)
- `test/` — Unit tests (good for usage patterns)
- `examples/` — Runnable examples

**What to verify:**
- Import paths resolve to real modules
- Parameter names, types, and defaults match class definitions
- Referenced methods exist on the classes shown
- For pages with both languages: verify each independently

## Tier 2: Local SDK Clones

If `gh` is unavailable, check a local clone of the SDK source. The default location is the `.build/` directory populated by `npm run sdk:clone`:

```
.build/sdk-python/src/strands/[path]
.build/sdk-typescript/src/[path]
```

Contributors who keep their SDK clones elsewhere can override the lookup path by exporting environment variables before running the agent:

```bash
export STRANDS_SDK_PYTHON=/path/to/your/sdk-python
export STRANDS_SDK_TYPESCRIPT=/path/to/your/sdk-typescript
```

When set, prefer `$STRANDS_SDK_PYTHON/src/strands/[path]` and `$STRANDS_SDK_TYPESCRIPT/src/[path]` over the `.build/` defaults. If neither the env var nor the default directory resolves to a real file, fall through to Tier 3.

## Tier 3: Installed Package Introspection

```bash
# Python
python -c "from strands.agent.agent import Agent; help(Agent.__init__)"

# TypeScript (check exports)
node -e "const sdk = require('@strands-agents/sdk'); console.log(Object.keys(sdk))"
```

Useful for spot-checking parameter names and types, but doesn't show internal module structure.

## Tier 4: Flag for Review

When no verification source is available, mark unverified code blocks:

```html
<!-- NEEDS-VERIFICATION: [class/method] against SDK source -->
```

Additionally, list all unverified blocks in the PR description so reviewers know what to check. Do not leave verification comments as the only safeguard on merged pages.
