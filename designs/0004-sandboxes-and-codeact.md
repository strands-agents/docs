# Sandbox

**Status**: Accepted

**Date**: 2026-06-03

**Issue**: [sdk-python#1540](https://github.com/strands-agents/sdk-python/issues/1540), [tools#335](https://github.com/strands-agents/tools/issues/335)

## Context

Tools that execute code — shell, a Python REPL, file operations — hardcode *where* that code runs. `python_repl` forks a local process and writes to `Path.cwd()`. `shell` manages its own subprocess. `code_interpreter` talks to a remote sandbox API. Each tool independently reimplements process management, filesystem access, and output capture, and each one bakes in an assumption about its environment.

That coupling causes concrete problems:

- **You cannot move an agent between environments without rewriting tools.** Deploy a working local agent to a sandboxed runtime and tools that assume local filesystem access break. [tools#335](https://github.com/strands-agents/tools/issues/335) documents this: `python_repl`, `journal`, and `workflow` all write to different default locations, and the only fix today is per-tool environment variables (`PYTHON_REPL_PERSISTENCE_DIR`, `STRANDS_WORKFLOW_DIR`, …). Every tool needs its own workaround.
- **There is no way to say "run this same tool, but inside a container."** Swapping the execution environment means swapping tool implementations.
- **Tools don't share an environment.** When an agent writes a file with `shell` and reads it with `python_repl`, the two run in separate contexts — no shared working directory, no shared filesystem. Each tool is an island.

The common thread: *where* code runs is a cross-cutting concern, but it's currently owned by each tool. It should be owned by the agent and provided to tools.

## Decision

Introduce a **Sandbox**: an agent-level execution environment that tools delegate to instead of managing their own. The agent holds one sandbox; every code- or filesystem-touching tool runs through it. This gives tools a shared environment and makes the execution target a configuration choice rather than a code change.

### Where the Sandbox sits

The Sandbox is **agent-level, not tool-level**. A tool-level sandbox (each tool optionally takes one in its constructor) can't guarantee that two tools share the same filesystem, which is the whole point. Putting it on the agent means tools inherit a shared environment for free.

It is also **orthogonal to tool scheduling.** The existing tool executor decides *whether* tools run concurrently or sequentially; the Sandbox decides *where* they run. A tool can run in a container with concurrent scheduling — these compose independently and neither needs to know about the other.

```
        what runs              where it runs
   ┌────────────────────┐   ┌────────────────────┐
   │  Agent + tools     │──▶│      Sandbox        │
   │  (orchestration)   │   │  host │ docker │ ssh │
   └────────────────────┘   └────────────────────┘
```

### What a Sandbox provides

A Sandbox exposes three capabilities, in priority order:

1. **Command execution** — run a shell command, get back exit code, stdout, and stderr.
2. **Code execution** — run a snippet in a language runtime (built on command execution by default).
3. **Filesystem operations** — read, write, and list files.

Execution is **streaming-first**: the primitive yields output as it is produced, and the simple "run and collect" form is a thin wrapper over it. This matters because agent tools routinely run long commands (builds, test suites, installs) where buffering until completion is a bad experience. File I/O is **binary-first** (bytes in, bytes out) with text convenience wrappers, so the abstraction doesn't corrupt non-text content or wedge on encoding.

We deliberately keep the interface **small**: a single execution primitive that everything else is derived from, rather than a wide interface where every backend must implement code execution and every filesystem operation natively. Most environments already have a shell, and file operations are expressible as shell commands (`cat`, `ls`, `cat >`). A new backend becomes useful by implementing essentially one method; backends with native file or code APIs can override the derived methods for performance or correctness. This is the pattern that the broader ecosystem (LangChain DeepAgents, and the Daytona/E2B/Modal/Runloop backends built against it) has converged on, and it keeps the barrier to a new backend low.

### Execution is stateless by default

Each execution is independent: no working directory or environment variable carries over from a previous call. This is a deliberate choice. Tools frequently run concurrently, and shared mutable shell state (`cd`, `export`) across parallel calls is a race condition — tool A's `cd /tmp` silently changes tool B's working directory. Stateless execution is predictable and concurrency-safe. Tools that genuinely need to track state across calls (an interactive shell, say) manage it themselves, as the current `shell` tool already does.

### Backends

The selected design ships three backends that cover the spectrum from "no isolation, zero setup" to "fully isolated":

| Backend | Where it runs | Isolation | Use case |
|---------|---------------|-----------|----------|
| `HostSandbox` | The agent's own process / host | **None** | Local development, and trusted agents whose runtime is *already* the sandbox (a container, a CI job, a Lambda). The default. |
| `DockerSandbox` | A Docker container | Process + filesystem | Running untrusted or model-generated code with a real boundary. |
| `SshSandbox` | A remote host over SSH | Remote machine | Offloading execution to a separate, pre-provisioned environment. |

A key framing: **the default is not really a sandbox.** When no sandbox is configured, the agent runs commands on its own host with full process permissions — `HostSandbox` exists to give tools a uniform path, not to provide a security boundary. This is the right default for two reasons: it preserves today's behavior (no migration needed), and a large class of deployments are *already* sandboxed at the runtime level (the agent runs inside a container or CI job with scoped credentials), so a second in-process boundary would be redundant. Isolation is something you opt **into** by passing `DockerSandbox` or `SshSandbox` — and the design makes that opt-in explicit rather than implying safety that isn't there.

### Agent integration

The agent gains a `sandbox` parameter. Omitted, it defaults to the host backend and existing behavior is unchanged. Passed an explicit sandbox, the agent also auto-registers the execution and file-editing tools that depend on it, so configuring a sandbox is a single decision rather than a sandbox-plus-matching-tools bookkeeping exercise.

Tools reach the sandbox through their tool context — they no longer manage execution themselves; they ask the agent's sandbox to do it. Because the agent always has a sandbox, tools need no fallback logic.

This primitive also gives other parts of the system a place to run work that shouldn't touch the agent's own runtime — for example, offloading large tool results or loading agent skills from the sandbox's filesystem — without each of those features inventing its own execution path.

## Developer Experience

The common case requires no new concepts — the default sandbox is implicit:

```python
from strands import Agent
from strands_tools import shell, file_write

# No sandbox specified: runs on the host, same as today.
agent = Agent(tools=[shell, file_write])
```

Opting into isolation is a one-line change, and the tools come with it:

```python
agent = Agent(sandbox=DockerSandbox(image="python:3.12-slim"))

# shell + file tools are auto-registered against the container.
# A file written in one step is visible to the next — shared environment.
agent("Write a script that fetches today's exchange rates, then run it.")
```

For tool authors, the change is that a tool *delegates* execution instead of owning it — conceptually:

```python
@tool(context=True)
async def shell(command: str, tool_context: ToolContext) -> str:
    result = await tool_context.agent.sandbox.execute(command)
    return result.stdout
```

The same tool now runs locally, in Docker, or over SSH with no change to the tool — only the agent's sandbox configuration differs.

## Alternatives Considered

**Sandbox as a per-tool wrapper instead of an agent-level concept.** Each tool would optionally accept a sandbox. Rejected: it can't guarantee tools share one environment (the shared-filesystem property is the main reason this exists), and it pushes injection boilerplate into every tool.

**A wide, fully-abstract interface** where every backend implements command execution, code execution, and all filesystem operations natively. Rejected in favor of a single derived primitive: it raises the cost of every new backend for little benefit, since most environments are shell-capable and the derived operations are correct for the common case. Backends that *do* have native file/code APIs can still override for performance — we get the low barrier without giving up the optimization.

**Folding execution environment into the tool executor.** The tool executor already exists and handles concurrency. Rejected: scheduling (*whether* tools run in parallel) and environment (*where* they run) are orthogonal; conflating them couples two things that should compose freely.

**Stateful execution by default** (persistent shell, `cd`/`export` carry over). Rejected as the default because it's a race condition under concurrent tool calls. Left to individual tools that need it; a backend may offer an opt-in stateful mode.

**Bundling code-based tool orchestration into this design.** The original proposal also covered a *programmatic tool caller* (the model writes code that calls tools) and a *CodeAct* mode (the agent always responds with code). These are valuable, but they are a layer *on top of* the execution environment, not part of it — and shipping them together would have coupled an unproven paradigm to a foundational primitive. We scoped this design down to the Sandbox so it can land cleanly. Programmatic tool calling and CodeAct become follow-up designs that build on it; see [sdk-python#1540](https://github.com/strands-agents/sdk-python/issues/1540) and [tools#387](https://github.com/strands-agents/tools/pull/387). Notably, running model-generated orchestration code *inside* the sandbox (rather than the host) is exactly the kind of thing this primitive is meant to enable.

## Consequences

**Easier**

- Move an agent between local, container, and remote execution by changing one parameter — no tool rewrites.
- Tools share a filesystem and working environment by default, so multi-tool workflows (write-then-run) just work.
- Untrusted or model-generated code gets a real isolation boundary without special-casing tools.
- New execution backends (a cloud sandbox provider, a custom in-process shell) plug in by implementing one primitive.
- Cross-cutting features (large-result offloading, loading skills from a filesystem) get a sanctioned place to run work off the agent's runtime.

**Harder / costs**

- One more concept for tool authors to learn, and existing tools must be migrated to delegate to the sandbox.
- The default backend provides *no* isolation; the design leans on naming and documentation to make sure nobody mistakes it for a security boundary.
- Remote backends (Docker, SSH) add startup latency and an external dependency (a Docker daemon, a reachable host) that the host backend does not.
- Stateless-by-default means tools needing persistent shell state carry that responsibility themselves.

## Willingness to Implement

Yes — implemented. TypeScript: [sdk-typescript#1011](https://github.com/strands-agents/sdk-typescript/pull/1011) (parent), building on the merged base interface [sdk-typescript#1090](https://github.com/strands-agents/sdk-typescript/pull/1090). Python: [sdk-python#1968](https://github.com/strands-agents/sdk-python/pull/1968).
