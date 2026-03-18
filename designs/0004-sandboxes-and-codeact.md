# Sandboxes, programmatic tool calling, and CodeAct

## Overview

Strands tools that execute code (shell, python_repl, file operations) hardcode their execution environment. This design introduces a Sandbox abstraction that decouples tool logic from where code runs, a programmatic tool calling tool that orchestrates tools via code, and a CodeAct plugin that replaces standard tool calling with code-based orchestration. Together, these enable tool reuse across environments (local, Docker, AgentCore) and unlock higher-level agent paradigms.

## Problem statement

### Tools are coupled to their execution environment

Today, each tool that runs code manages its own execution. `python_repl` creates a PTY and forks a process. `shell` does the same with its own `CommandExecutor`. `code_interpreter` talks to AgentCore's sandbox API. Each tool reimplements filesystem access, process management, and output capture independently.

This coupling creates real problems.

When you deploy an agent to AgentCore Runtime, tools that assume local filesystem access break immediately. Issue [#335](https://github.com/strands-agents/tools/issues/335) documents this: `python_repl` writes to `Path.cwd()`, `journal` writes to the home directory, `workflow` writes to `~/.strands/workflows`. The only writable directory in Runtime is `/tmp`. Users work around this by setting environment variables per tool (`PYTHON_REPL_PERSISTENCE_DIR=/tmp/workflows/repl`, `STRANDS_WORKFLOW_DIR=/tmp/workflows`), but every tool needs its own workaround.

There is no way to say "use the same shell tool but run it inside a Docker container." You cannot take a working local agent and deploy it to a sandboxed environment without rewriting tool configurations or swapping tool implementations entirely.

### No shared execution environment across tools

When an agent uses `shell` to create a file and then `python_repl` to read it, these tools operate in separate execution contexts. There is no shared filesystem, no shared working directory, no shared environment variables. Each tool is an island.

A comment on issue #335 captures this well:

> Should we have a `STRANDS_WORKING_DIR` env variable and config or equivalent, so that all tools can get a common directory to write these files to, that isn't the current working directory?

The answer is yes, but the solution needs to go deeper than an environment variable. Tools need a shared execution environment.

### Code-based tool orchestration is ad hoc

Research shows that having agents write code to call tools (instead of making individual JSON tool calls) can reduce token usage by up to 98.7% and improve accuracy. Anthropic's [advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use) and HuggingFace's [smolagents](https://huggingface.co/docs/smolagents/en/index) both demonstrate this.

Issue [#1540](https://github.com/strands-agents/sdk-python/issues/1540) requests this for Strands. PR [#387](https://github.com/strands-agents/tools/pull/387) (`programmatic_tool_caller`) is a first implementation, but it defines its own `Executor` class independently of any shared abstraction. There is no standard way for code-execution tools to share an environment or for higher-level paradigms like CodeAct to build on a common foundation.

## Proposed design

The design has three layers, each building on the one below.

```
┌─────────────────────────────────────────────────┐
│  CodeAct Plugin                                 │
│  Wraps an agent, replaces tools with itself,    │
│  forces code-based orchestration                │
├─────────────────────────────────────────────────┤
│  Tooling                                        │
│  Updated tools + programmatic tool caller       │
│  All tools delegate to the Sandbox              │
├─────────────────────────────────────────────────┤
│  Sandbox                                        │
│  Abstract interface for code execution           │
│  Local │ Docker │ AgentCore │ Custom            │
└─────────────────────────────────────────────────┘
```

### Layer 1: Sandbox

A Sandbox is an execution environment that provides code execution, command execution, and filesystem operations. It is the "where" — completely independent of the SDK's `ToolExecutor` (which controls scheduling: concurrent versus sequential).

Tools that need to run code or access a filesystem receive a Sandbox instead of managing their own execution.


#### Interface

The Sandbox ABC lives in the SDK (`strands-agents/sdk-python`). Concrete implementations live in the tools package (`strands-agents/tools`) or as third-party packages.

There are two viable interface patterns from the ecosystem (see [Appendix B](#appendix-b-prior-art) for full survey). We present both and recommend Option A.

##### Option A: Minimal `execute()` (recommended)

A single abstract method with convenience methods built on top. The base class derives filesystem operations by running shell commands through `execute()`.

LangChain DeepAgents is an example of this pattern — Daytona, Modal, E2B, and Runloop all implement a single `execute()` method against this interface.

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class ExecutionResult:
    """Result of code or command execution."""

    exit_code: int
    stdout: str
    stderr: str


class Sandbox(ABC):
    """Abstract execution environment for agent tools.

    A Sandbox provides the runtime context where tools execute code,
    run commands, and interact with a filesystem. Multiple tools
    share the same Sandbox instance, giving them a common working
    directory, environment variables, and filesystem.

    Implementations only need to provide execute(). All other methods
    are built on top of it. Implementations may override convenience
    methods with native versions for better performance (for example,
    DockerSandbox can use docker cp instead of shell-based file ops).
    """

    @abstractmethod
    async def execute(
        self,
        command: str,
        timeout: int | None = None,
    ) -> ExecutionResult:
        """Execute a shell command. The only method implementations must provide."""
        ...

    # --- Convenience methods built on execute() ---

    async def execute_code(
        self,
        code: str,
        language: str = "python",
        timeout: int | None = None,
    ) -> ExecutionResult:
        """Execute code in the sandbox. Override for native code execution."""
        # Default: pipe code to interpreter via shell
        escaped = code.replace("'", "'\\''")
        return await self.execute(f"{language} -c '{escaped}'", timeout=timeout)

    async def read_file(self, path: str) -> str:
        """Read a file from the sandbox filesystem. Override for native file I/O."""
        result = await self.execute(f"cat '{path}'")
        if result.exit_code != 0:
            raise FileNotFoundError(result.stderr)
        return result.stdout

    async def write_file(self, path: str, content: str) -> None:
        """Write a file to the sandbox filesystem. Override for native file I/O."""
        result = await self.execute(f"cat > '{path}' << 'STRANDS_EOF'\n{content}\nSTRANDS_EOF")
        if result.exit_code != 0:
            raise IOError(result.stderr)

    async def list_files(self, path: str = ".") -> list[str]:
        """List files in a sandbox directory. Override for native listing."""
        result = await self.execute(f"ls -1 '{path}'")
        if result.exit_code != 0:
            raise FileNotFoundError(result.stderr)
        return [f for f in result.stdout.strip().split("\n") if f]

    # --- Lifecycle ---

    async def start(self) -> None:
        """Initialize the sandbox. Called once before first use."""
        pass

    async def stop(self) -> None:
        """Clean up sandbox resources."""
        pass

    async def __aenter__(self) -> "Sandbox":
        await self.start()
        return self

    async def __aexit__(self, *args) -> None:
        await self.stop()
```

New sandbox providers implement one method. The base class handles everything else. Providers that have native filesystem or code execution APIs (for example, AgentCore's `invoke("executeCode", ...)` or Docker's `docker cp`) override the convenience methods for better performance, encoding safety, and binary file support.

##### Option B: Multi-method ABC

Every method is abstract. Implementations must provide all of them.

E2B and Daytona are examples of this pattern, exposing separate modules or methods for commands, code, and filesystem. Our existing `CodeInterpreter` ABC in `strands_tools/code_interpreter/code_interpreter.py` also follows this pattern.

```python
class Sandbox(ABC):
    """Every method is abstract. Implementations must provide all of them."""

    @abstractmethod
    async def execute_command(self, command: str, timeout: int | None = None) -> ExecutionResult: ...

    @abstractmethod
    async def execute_code(self, code: str, language: str = "python", timeout: int | None = None) -> ExecutionResult: ...

    @abstractmethod
    async def read_file(self, path: str) -> str: ...

    @abstractmethod
    async def write_file(self, path: str, content: str) -> None: ...

    @abstractmethod
    async def list_files(self, path: str = ".") -> list[str]: ...

    async def start(self) -> None: ...
    async def stop(self) -> None: ...
```

##### Comparison

| Aspect | Option A (minimal `execute()`) | Option B (multi-method ABC) |
|--------|-------------------------------|----------------------------|
| Methods to implement | 1 required, 4 optional overrides | 5 required |
| New provider effort | Minimal — one method gets you a working sandbox | Higher — must implement all filesystem ops |
| Filesystem quality | Shell-based by default (encoding/binary issues) | Native by default (provider controls quality) |
| Third-party adoption | Lower barrier, more providers | Higher barrier, fewer providers |
| Type safety | Weaker for file ops (everything is strings through shell) | Stronger (dedicated method signatures) |

##### Recommendation

We recommend Option A. The LangChain DeepAgents ecosystem validates this pattern — four major sandbox providers (Daytona, Modal, E2B, Runloop) all implement a single `execute()` method successfully. The key insight is that filesystem operations are just shell commands (`cat`, `ls`, `echo >`), and most sandboxes already have a shell. Providers that need better file handling (binary files, encoding) override the convenience methods.

This also matches how tools actually use sandboxes. `shell` only needs `execute()`. `python_repl` only needs `execute_code()`. `file_read` only needs `read_file()`. By making the base class handle the wiring, we avoid forcing every provider to implement methods they may not natively support.

#### Implementations

The following table summarizes the planned Sandbox implementations. See [Appendix A](#appendix-a-sandbox-implementation-sketches) for code examples.

| Sandbox | Where it runs | Isolation | Latency | Use case |
|---------|--------------|-----------|---------|----------|
| `LocalSandbox` | Host process | None | Minimal | Development, trusted agents. Default when no sandbox is configured. |
| `DockerSandbox` | Docker container | Process + filesystem | ~1s startup | Production, untrusted code |
| `AgentCoreSandbox` | AWS Bedrock AgentCore | Full cloud isolation | ~800ms startup | AWS-deployed agents |

The `Sandbox` ABC is designed for extensibility. Third-party providers (for example, [E2B](https://e2b.dev), [Daytona](https://www.daytona.io), or custom in-process virtual shells) can implement the interface to plug into the same ecosystem.

#### How tools use a Sandbox

Tools access the sandbox through `tool_context.agent.sandbox`. The `Agent` class gains a new `sandbox` attribute as part of this design. It defaults to `LocalSandbox` when no sandbox is explicitly configured, so all tools are backwards compatible without any conditional fallback logic.

```python
from strands import Agent
from strands_tools import shell, python_repl, file_write

# No sandbox specified — defaults to LocalSandbox
agent = Agent(tools=[shell, python_repl, file_write])

# Explicit sandbox — all tools share it
agent = Agent(
    tools=[shell, python_repl, file_write],
    sandbox=DockerSandbox(image="python:3.12-slim"),
)

# The agent creates a file with shell, reads it with python_repl
# Both operate in the same sandbox
agent("Create a file called data.csv with some sample data, then analyze it with Python")
```

Inside a tool, the Sandbox is accessed via [`ToolContext`](https://strandsagents.com/docs/user-guide/concepts/tools/custom-tools/index.md):

```python
from strands import tool, ToolContext


@tool(context=True)
async def shell(command: str, tool_context: ToolContext) -> str:
    """Execute a shell command."""
    result = await tool_context.agent.sandbox.execute(command)
    return result.stdout
```

Because the agent always has a sandbox (defaulting to `LocalSandbox`), tools do not need fallback logic. They always delegate to the sandbox.


### Layer 2: Tooling

This layer covers the tools that use the Sandbox. It includes updating existing tools (`shell`, `python_repl`, `file_read`, `file_write`, `editor`) to delegate to the sandbox, and adding the `programmatic_tool_caller` — a new tool that lets the model write code to orchestrate other tools.

#### Updating existing tools

Existing tools are updated to use `tool_context.agent.sandbox` instead of managing their own execution. The [`ToolContext`](https://strandsagents.com/docs/user-guide/concepts/tools/custom-tools/index.md) provides access to the agent and its sandbox via the `@tool(context=True)` decorator. See the shell example in [How tools use a Sandbox](#how-tools-use-a-sandbox) above.

This replaces the current approach where each tool manages its own PTY, subprocess, and filesystem logic.

#### New `python` tool

A new sandbox-based `python` tool delegates to `sandbox.execute_code()`. Unlike the existing `python_repl` (which maintains a persistent namespace via `dill` serialization and supports interactive PTY), the `python` tool is stateless — each invocation runs in a fresh interpreter. This is simpler, works across all sandbox types, and is the recommended default. The existing `python_repl` tool remains available for use cases that need stateful execution.

#### Programmatic tool caller

The programmatic tool caller is a new tool that lets the model write code to orchestrate other tools. It lives in `strands-agents/tools` and builds on the Sandbox for its code execution.

This is the approach from PR [#387](https://github.com/strands-agents/tools/pull/387) and aligns with Anthropic's [advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use) programmatic tool calling feature.

#### How it works

1. The model receives `programmatic_tool_caller` as one of its available tools
2. When the model wants to orchestrate multiple tools, it writes Python code that calls them as async functions
3. The tool executes this code in the agent's configured Sandbox
4. Only `print()` output enters the agent's context window — intermediate tool results stay in the code execution context

```python
from strands import Agent
from strands_tools import programmatic_tool_caller, shell, calculator

agent = Agent(
    tools=[programmatic_tool_caller, shell, calculator],
    sandbox=LocalSandbox(),
)

# The model can choose to use programmatic_tool_caller when it helps
result = agent("Calculate the squares of numbers 1-100 and sum them")
```

The model might respond with a `programmatic_tool_caller` invocation containing:

```python
total = 0
for i in range(1, 101):
    square = await calculator(expression=f"{i} ** 2")
    total += int(square)
print(f"Sum of squares: {total}")
```

This executes as a single tool call instead of 100 separate round-trips. The intermediate `calculator` results never enter the context window.

#### Relationship to Sandbox

The programmatic tool caller uses the Sandbox for code execution but adds tool-bridging logic on top. It:

1. Introspects the agent's tool registry to find available tools
2. Creates async wrapper functions for each tool
3. Injects these wrappers into the code execution namespace
4. Executes the model's code in the Sandbox
5. Captures `print()` output as the tool result

```python
class ProgrammaticToolCaller:
    """Tool that executes code calling other tools."""

    def __init__(self, allowed_tools: list[str] | None = None):
        self.allowed_tools = allowed_tools

    async def execute(self, code: str, agent: Agent, sandbox: Sandbox) -> str:
        # Build namespace with tool wrappers
        namespace = self._build_tool_namespace(agent)

        # Execute in sandbox with tool namespace available
        result = await sandbox.execute_code(code, namespace=namespace)
        return result.stdout
```

The key insight: the programmatic tool caller does not need its own `Executor` class (as PR #387 currently defines). It uses whatever Sandbox the agent is configured with. This means programmatic tool calling works in Docker, AgentCore, or locally — with no changes to the tool itself.

### Layer 3: CodeAct plugin

CodeAct is a higher-level paradigm where the agent always responds with code instead of JSON tool calls. It is a plugin that wraps an agent, not a modification to the SDK's agent loop.

#### The CodeAct paradigm

In standard tool calling, the model outputs structured JSON to invoke tools one at a time. In CodeAct (from the [Apple ML Research paper](https://machinelearning.apple.com/research/codeact)), the model outputs executable code that calls tools as functions. This has several advantages:

- Loops, conditionals, and data transformations are native (no multi-turn back-and-forth)
- Intermediate results stay in code variables, not the context window
- The model can self-correct by catching exceptions and retrying
- Token usage drops dramatically (up to 98.7% reduction reported)

HuggingFace's [smolagents](https://huggingface.co/docs/smolagents/en/index) implements this as `CodeAgent` — a separate agent class that generates Python code instead of JSON tool calls.

#### How it works in Strands

Rather than creating a separate agent class, CodeAct is a plugin that transforms an existing agent. It:

1. Takes an agent with its configured tools
2. Removes all tools from the agent
3. Registers itself as the only tool (or modifies the system prompt to force code output)
4. Exposes the original tools as callable Python functions inside the Sandbox
5. All model responses go through code execution

```python
from strands import Agent
from strands_tools import shell, python_repl, http_request, calculator
from strands_tools.plugins import CodeActPlugin

# Create a normal agent
agent = Agent(
    tools=[shell, python_repl, http_request, calculator],
    sandbox=DockerSandbox(image="python:3.12-slim"),
)

# Wrap it with CodeAct — the agent now always uses code to call tools
codeact_agent = CodeActPlugin(agent)

# The model writes Python code that calls shell(), http_request(), etc.
result = codeact_agent("Fetch the top 10 HN stories and save them to a file")
```

The model's response would look something like:

```python
import json

# Fetch stories
response = await http_request(url="https://hacker-news.firebaseio.com/v0/topstories.json")
story_ids = json.loads(response)[:10]

stories = []
for sid in story_ids:
    story = await http_request(url=f"https://hacker-news.firebaseio.com/v0/item/{sid}.json")
    stories.append(json.loads(story))

# Format and save
output = "\n".join(f"- {s['title']} ({s.get('url', 'no url')})" for s in stories)
await shell(command=f"echo '{output}' > top_stories.txt")

print(f"Saved {len(stories)} stories to top_stories.txt")
```

#### Plugin architecture

```python
class CodeActPlugin:
    """Wraps an agent to use code-based tool orchestration."""

    def __init__(self, agent: Agent):
        self.agent = agent
        self.original_tools = list(agent.tool_registry.registry.values())

        # Replace all tools with the codeact tool
        self._setup()

    def _setup(self):
        # Remove original tools from agent
        # Register codeact as the only tool
        # Modify system prompt to instruct code generation
        ...

    def _build_codeact_tool(self) -> AgentTool:
        """Create a tool that executes code with original tools available."""
        ...

    def __call__(self, prompt: str, **kwargs) -> Any:
        return self.agent(prompt, **kwargs)
```

#### Difference from programmatic tool caller

| Aspect | Programmatic tool caller | CodeAct plugin |
|--------|------------------------|----------------|
| Scope | One tool among many | Replaces all tools |
| Model choice | Model decides when to use it | Always active |
| Tool calling | Standard JSON + code option | Code only |
| Integration | Drop-in tool | Agent wrapper/plugin |
| Use case | Optimization for batch operations | Full paradigm shift |

The programmatic tool caller is a tool the model can optionally use. CodeAct is a mode where the model always writes code. Both use the Sandbox for execution.


## API surface

### SDK changes (`strands-agents/sdk-python`)

The Sandbox ABC and `ExecutionResult` dataclass are added to the SDK. The `Agent` class accepts an optional `sandbox` parameter that defaults to `LocalSandbox`.

```python
from strands import Agent
from strands.sandbox import Sandbox, LocalSandbox, DockerSandbox, ExecutionResult

# Default: LocalSandbox (backwards compatible, same behavior as today)
agent = Agent(tools=[shell])

# Explicit sandbox
agent = Agent(tools=[shell], sandbox=DockerSandbox(image="python:3.12-slim"))
```

Tools access the sandbox via [`ToolContext`](https://strandsagents.com/docs/user-guide/concepts/tools/custom-tools/index.md). No changes to the tool interface are required.

```python
from strands import tool, ToolContext


@tool(context=True)
async def my_tool(tool_context: ToolContext) -> str:
    result = await tool_context.agent.sandbox.execute("ls -la")
    return result.stdout
```

### Tools changes (`strands-agents/tools`)

Existing tools (`shell`, `python_repl`, `file_read`, `file_write`, `editor`) are updated to use `tool_context.agent.sandbox`. Since the agent always provides a sandbox (defaulting to `LocalSandbox`), tools do not need conditional fallback logic.

A new sandbox-based `python` tool will be added that delegates to `sandbox.execute_code()`. The existing `python_repl` tool (with stateful REPL, PTY, and `dill` persistence) will be kept for use cases that need it.

New tools (`programmatic_tool_caller`) use the sandbox the same way.

### TypeScript SDK

The Sandbox interface should be mirrored in `sdk-typescript`. The interface is simple enough that implementations can differ by language while maintaining the same mental model.

```typescript
interface ExecutionResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

interface Sandbox {
  // The only required method
  execute(command: string, timeout?: number): Promise<ExecutionResult>;

  // Convenience methods (default implementations built on execute())
  executeCode?(code: string, language?: string, timeout?: number): Promise<ExecutionResult>;
  readFile?(path: string): Promise<string>;
  writeFile?(path: string, content: string): Promise<void>;
  listFiles?(path?: string): Promise<string[]>;

  // Lifecycle
  start?(): Promise<void>;
  stop?(): Promise<void>;
}
```

## Migration and backwards compatibility

The default `LocalSandbox` preserves existing behavior. No user action is required.

- `Agent` defaults to `LocalSandbox` when no `sandbox` parameter is provided
- `LocalSandbox` wraps the same subprocess/filesystem behavior tools use today
- Tools access the sandbox via `tool_context.agent.sandbox` — no conditional logic needed
- The `CodeInterpreter` ABC in `strands_tools` can be refactored to implement `Sandbox`, making `AgentCoreCodeInterpreter` both a `CodeInterpreter` and a `Sandbox`

Migration path for existing tools:

1. Update tools to use `tool_context.agent.sandbox` instead of managing their own execution
2. Deprecate tool-specific environment variables (`PYTHON_REPL_PERSISTENCE_DIR`, etc.) in favor of Sandbox configuration
3. Eventually remove direct execution code from tools, making Sandbox the only path

## Open questions

1. **Namespace injection for programmatic tool calling.** The `programmatic_tool_caller` needs to inject tool wrapper functions into the code execution namespace so the model's code can call `await calculator(expression="2+2")`. The current `Sandbox.execute_code()` signature has no mechanism for this.

   We recommend that the programmatic tool caller runs orchestration code in the host process, not in the sandbox. The tool wrappers it injects are normal async functions that call `agent.tool.X()`, which in turn uses the sandbox. The sandbox is used by the individual tools, not by the orchestration code. This matches how smolagents works — the CodeAgent runs code locally with tools as callable functions in the namespace. No changes to the Sandbox interface are needed.

   Alternatives considered:
   - Adding a `globals` parameter to `execute_code()` — works for local/in-process sandboxes but tool wrappers are async closures over the agent and cannot be serialized to remote sandboxes.
   - Code generation with a preamble that defines tool wrappers as IPC calls — works with remote sandboxes but adds complexity and latency per tool call.

2. **Working directory persistence across commands.** The current `shell` tool tracks `cd` across invocations via `CommandContext`. A naive subprocess-per-command sandbox loses directory state between calls.

   We recommend that the abstract `Sandbox` interface makes no persistence promise — it is an implementation concern. Each implementation handles it appropriately:
   - `LocalSandbox` uses a persistent shell process (matching the approach in [devtools PR #39](https://github.com/strands-agents/devtools/pull/39)). Commands are sent to a long-running shell via stdin, so `cd`, `export`, and other state-modifying commands persist naturally.
   - `DockerSandbox` gets this for free — `docker exec` on a running container inherits the container's state.
   - `AgentCoreSandbox` maintains session state natively via the AgentCore API.

   Alternatives considered:
   - Tracking `cwd` and `env` as instance state in the base class, prepending `cd {cwd} &&` to each command — fragile because parsing `cd` from arbitrary shell commands is unreliable.
   - Documenting statelessness as a feature — breaks tools that depend on `cd` persistence.

3. **Parallel tool execution.** Strands' `ConcurrentToolExecutor` runs multiple tool calls in parallel. If two tools both call `sandbox.execute()` concurrently on a persistent-shell-based sandbox, the interleaved stdin/stdout is a race condition. `DockerSandbox` and `AgentCoreSandbox` are naturally concurrent-safe (each `execute()` gets its own process or API call).

   We recommend that the `Sandbox` interface makes no concurrency guarantees. Implementations document their behavior. `LocalSandbox` can handle this by spawning subprocesses that inherit the persistent shell's tracked state (cwd, env) rather than sharing the shell process for all calls.

4. **Interactive mode.** Both `shell` and `python_repl` today support interactive PTY mode for real-time user input. This does not map cleanly to remote sandboxes (Docker, AgentCore). Our inclination is to keep interactive mode as a `LocalSandbox` concern and not complicate the abstract interface. This is not a blocker for the initial implementation and can be revisited later.

5. **Naming.** This document uses "Sandbox" throughout. We recommend this name but want to surface alternatives for discussion.

   | Name | Pros | Cons |
   |------|------|------|
   | `Sandbox` (recommended) | Clear mental model, aligns with E2B/Daytona/LangChain ecosystem terminology, implies containment | Implies isolation that `LocalSandbox` does not provide |
   | `Runtime` | Neutral, accurate | Conflicts with "Python runtime", "AgentCore Runtime" |
   | `Environment` | Intuitive | Extremely overloaded in programming (env vars, virtual envs, deployment envs) |
   | `ExecutionBackend` | Precise, no ambiguity | Verbose, feels enterprise-y |
   | `Workspace` | Implies shared filesystem | Too narrow (does not convey code execution) |
   | `Shell` | Familiar | Too narrow (does not cover code execution, file ops) |

## Tasks

### P0

- [ ] Define `Sandbox` ABC and `ExecutionResult` in `sdk-python`
- [ ] Implement `LocalSandbox`
- [ ] Add `sandbox` parameter to `Agent` (default: `LocalSandbox`)
- [ ] Update `shell` tool to use `tool_context.agent.sandbox`
- [ ] Update `file_read` and `file_write` tools to use sandbox
- [ ] Add sandbox-based `python` tool (stateless, delegates to `sandbox.execute_code()`)
- [ ] Keep existing `python_repl` tool for stateful REPL use cases

### P1

- [ ] Implement `DockerSandbox`
- [ ] Refactor `AgentCoreCodeInterpreter` to implement `Sandbox` (`AgentCoreSandbox`)
- [ ] Update remaining tools (`editor`, `journal`, `workflow`) to use sandbox
- [ ] Implement `programmatic_tool_caller` using sandbox (refactor from PR #387)
- [ ] Deprecate tool-specific environment variables (`PYTHON_REPL_PERSISTENCE_DIR`, `STRANDS_WORKFLOW_DIR`, etc.)

### P2

- [ ] Implement `CodeActPlugin`
- [ ] Add Anthropic advanced tool use support (tool search tool, tool use examples)
- [ ] Mirror `Sandbox` interface in `sdk-typescript`
- [ ] Implement `LocalSandbox` and `DockerSandbox` for TypeScript

## Alternatives considered

### Sandbox as a tool wrapper instead of SDK concept

We considered making Sandbox a tool-level concern — each tool would optionally accept a Sandbox in its constructor. This avoids SDK changes but means every tool must independently handle Sandbox injection, and there is no guarantee that tools share the same Sandbox instance.

Rejected because the shared-environment property (tools operating in the same filesystem) requires the Sandbox to be agent-level, not tool-level.

### CodeAct as a new agent class

smolagents implements CodeAct as a separate `CodeAgent` class. We considered adding `CodeActAgent` to the SDK alongside `Agent`.

Rejected because it duplicates the agent loop and creates a maintenance burden. A plugin that wraps an existing agent is simpler and composes with other agent features (hooks, conversation management, streaming) without reimplementation.

### Extending ToolExecutor for Sandbox

We considered adding Sandbox capabilities to the existing `ToolExecutor` hierarchy (which handles concurrent versus sequential execution).

Rejected because these are orthogonal concerns. `ToolExecutor` controls scheduling. Sandbox controls environment. A tool can run in a Docker Sandbox with concurrent scheduling — these should compose independently.

## References

- [Issue #335: Tools break in AgentCore Runtime](https://github.com/strands-agents/tools/issues/335)
- [Issue #1540: Code-based tool execution](https://github.com/strands-agents/sdk-python/issues/1540)
- [Issue #1349: Anthropic advanced tool use](https://github.com/strands-agents/sdk-python/issues/1349)
- [PR #387: Programmatic tool caller](https://github.com/strands-agents/tools/pull/387)
- [PR #39: Shell tool (devtools)](https://github.com/strands-agents/devtools/pull/39)
- [Anthropic: Advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use)
- [HuggingFace: smolagents](https://huggingface.co/docs/smolagents/en/index)
- [Apple ML Research: CodeAct](https://machinelearning.apple.com/research/codeact)
- [E2B: Code Interpreter SDK](https://e2b.dev)
- [Daytona: AI Sandbox SDK](https://www.daytona.io)
- [LangChain DeepAgents: Sandbox backends](https://docs.langchain.com/oss/python/deepagents/sandboxes)
- [OpenHands: Runtime architecture](https://docs.openhands.dev/openhands/usage/architecture/runtime)
- [Google ADK: GKE Code Executor](https://google.github.io/adk-docs/integrations/gke-code-executor/)
- [Anthropic: Sandbox Runtime](https://github.com/anthropic-experimental/sandbox-runtime)

---

## Appendix A: Sandbox implementation sketches

### LocalSandbox

Wraps the current behavior of `shell` and `python_repl` behind the Sandbox interface. Uses subprocess for command execution and the local filesystem directly. Overrides `read_file` and `write_file` with native filesystem calls for encoding safety.

```python
import asyncio
import os

from strands.sandbox import Sandbox, ExecutionResult


class LocalSandbox(Sandbox):
    """Execute code and commands on the local host."""

    def __init__(self, working_dir: str | None = None):
        self.working_dir = working_dir or os.getcwd()

    async def execute(self, command: str, timeout: int | None = None) -> ExecutionResult:
        proc = await asyncio.create_subprocess_shell(
            command,
            cwd=self.working_dir,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=timeout)
        return ExecutionResult(
            exit_code=proc.returncode or 0,
            stdout=stdout.decode(),
            stderr=stderr.decode(),
        )

    # Override for native file I/O (avoids shell escaping issues)
    async def read_file(self, path: str) -> str:
        full_path = os.path.join(self.working_dir, path)
        with open(full_path) as f:
            return f.read()

    async def write_file(self, path: str, content: str) -> None:
        full_path = os.path.join(self.working_dir, path)
        with open(full_path, "w") as f:
            f.write(content)
```

### DockerSandbox

Runs commands inside a Docker container. The container is created on `start()` and destroyed on `stop()`. Files are shared via volume mounts or `docker cp`.

```python
class DockerSandbox(Sandbox):
    """Execute code and commands in a Docker container."""

    def __init__(
        self,
        image: str = "python:3.12-slim",
        volumes: dict[str, str] | None = None,
        environment: dict[str, str] | None = None,
    ):
        self.image = image
        self.volumes = volumes or {}
        self.environment = environment or {}
        self._container_id: str | None = None

    async def start(self) -> None:
        # docker create + docker start
        ...

    async def execute(self, command: str, timeout: int | None = None) -> ExecutionResult:
        # docker exec self._container_id sh -c {command}
        ...

    async def stop(self) -> None:
        # docker rm -f self._container_id
        ...
```

### AgentCoreSandbox

Wraps the existing `AgentCoreCodeInterpreter` behind the Sandbox interface. This is largely a refactor of the current implementation in `strands_tools/code_interpreter/agent_core_code_interpreter.py`.

```python
from strands.sandbox import Sandbox, ExecutionResult


class AgentCoreSandbox(Sandbox):
    """Execute code and commands in AWS Bedrock AgentCore."""

    def __init__(self, region: str | None = None, session_name: str | None = None):
        self.region = region
        self.session_name = session_name
        self._client = None

    async def start(self) -> None:
        self._client = BedrockAgentCoreCodeInterpreterClient(region=self.region)
        self._client.start(identifier="aws.codeinterpreter.v1", name=self.session_name)

    async def execute(self, command: str, timeout: int | None = None) -> ExecutionResult:
        response = self._client.invoke("executeCommand", {"command": command})
        # Parse response stream into ExecutionResult
        ...

    # Override: AgentCore has a native code execution API
    async def execute_code(self, code: str, language: str = "python", timeout: int | None = None) -> ExecutionResult:
        response = self._client.invoke("executeCode", {
            "code": code,
            "language": language,
        })
        # Parse response stream into ExecutionResult
        ...

    # Override: AgentCore has native file APIs
    async def read_file(self, path: str) -> str:
        response = self._client.invoke("readFiles", {"paths": [path]})
        ...

    async def write_file(self, path: str, content: str) -> None:
        response = self._client.invoke("writeFiles", {"content": [{"path": path, "text": content}]})
        ...
```

---

## Appendix B: Prior art

A survey of sandbox interfaces across the AI agent ecosystem. This informed the interface design in [Layer 1](#layer-1-sandbox).

### E2B (e2b.dev)

Cloud-based sandboxes running in Firecracker microVMs. The most widely adopted sandbox SDK in the agent ecosystem.

Interface uses module-based grouping on the sandbox object:

```python
from e2b_code_interpreter import Sandbox

sandbox = Sandbox()

# Shell commands via sandbox.commands
result = sandbox.commands.run("echo hello")  # → stdout, stderr, exit_code

# Code execution as a top-level method
execution = sandbox.run_code("x = 1 + 1; print(x)")  # → text, logs

# Filesystem via sandbox.files
sandbox.files.write("/tmp/data.txt", "content")
content = sandbox.files.read("/tmp/data.txt")
files = sandbox.files.list("/")
```

Key design choices:
- `commands`, `files`, and `pty` are separate readonly modules
- Code execution (`run_code`) is a top-level method, not under `commands`
- Sandboxes are stateful — variables persist across `run_code` calls
- Supports connecting to existing sandboxes by ID

### Daytona (daytona.io)

Container-based sandboxes with sub-90ms creation time. Similar to E2B but uses `process` and `fs` sub-objects.

```python
from daytona import Daytona, CreateSandboxParams

daytona = Daytona()
sandbox = daytona.create(CreateSandboxParams(language="python"))

# Code execution (language-aware)
response = sandbox.process.code_run('print("hello")')  # → result, exit_code, stderr

# Shell commands
response = sandbox.process.exec("ls -la", cwd="/home", timeout=10)  # → result, exit_code

# Filesystem
sandbox.fs.upload_file(b"data", "/tmp/file.txt")
files = sandbox.fs.list("/workspace")
```

Key design choices:
- Separates `code_run` (language-aware) from `exec` (shell)
- Filesystem uses `upload_file` (bytes) rather than `write` (string)
- Sandbox creation accepts language parameter

### LangChain DeepAgents

Abstract backend interface that multiple providers implement. The most relevant prior art for our design because it defines a minimal contract.

Core insight: implement only `execute()`, get everything else for free.

```python
class BaseSandbox(BackendProtocol):
    def execute(
        self,
        command: str,
        timeout: int = 120,
        max_output_bytes: int = 100000,
        env: dict | None = None,
        inherit_env: bool = False,
    ) -> dict:
        """Run a shell command. Returns {stdout, stderr, returncode, duration}."""
        ...

    # Built on top of execute() by the base class:
    # ls_info(path) → List[FileInfo]
    # read(file_path, offset, limit) → str
    # write(file_path, content) → WriteResult
    # edit(file_path, old, new) → EditResult
    # glob_info(pattern) → List[FileInfo]
    # grep_raw(pattern, path) → List[GrepMatch]
```

Daytona, Modal, E2B, and Runloop all implement this single `execute()` method. The base class builds `ls`, `read`, `write`, `edit`, `glob`, and `grep` on top by running shell commands through `execute()`.

Key design choices:
- Single abstract method minimizes provider implementation effort
- Filesystem ops are derived from shell commands (for example, `read` runs `cat`)
- Tradeoff: shell-based file ops have encoding and binary limitations
- Providers can override derived methods with native implementations

### OpenHands (formerly OpenDevin)

Docker-based runtime with an action/observation pattern. More complex than a sandbox interface — it is a full agent runtime.

```
Architecture:
  Host (backend) ←→ REST API ←→ Docker container (ActionExecutor)

Actions:
  CmdRunAction      → runs shell commands
  IPythonRunCellAction → runs Python code cells
  FileReadAction     → reads files
  FileWriteAction    → writes files
```

Key design choices:
- Action/observation dispatch pattern (extensible but complex)
- Communication via REST API between host and container
- `ActionExecutor` inside the container handles all action types
- Supports custom Docker images with pre-installed dependencies
- Daytona also provides an alternative runtime backend for OpenHands

### Google ADK (Agent Development Kit)

GKE-based with two execution modes:

```python
executor = GkeCodeExecutor(
    namespace="agent-sandbox-system",
    executor_type="sandbox",       # or "job" for ephemeral
    sandbox_template="python-sandbox-template",
)
result = executor.execute_code(ctx, CodeExecutionInput(code="print('Hello')"))
```

Key design choices:
- Single `execute_code` method (very narrow interface)
- "Sandbox" mode uses pre-warmed instances for low latency
- "Job" mode creates ephemeral Kubernetes jobs with gVisor isolation
- Agent Engine variant auto-creates persistent sandboxes for multi-step tasks

### Anthropic Sandbox Runtime (SRT)

Not a sandbox SDK in the traditional sense. Focuses on policy and permissions rather than execution interface.

```python
config = {
    "filesystem": {
        "allowWrite": [".", "/tmp"],
        "denyRead": ["~/.ssh"],
    },
    "network": {
        "allowedDomains": ["anthropic.com"],
    },
}
```

Key design choices:
- Security wrapper around local execution, not a remote sandbox
- Config-driven: declares what the sandbox can do, not how you call it
- Filesystem allow/deny lists for reads and writes
- Network traffic routed through proxy with domain filtering
- Used by Claude Code for autonomous execution in cloud VMs

### Summary of patterns

| Project | Interface style | Abstract methods | Filesystem approach | Isolation |
|---------|----------------|-----------------|-------------------|-----------|
| E2B | Module-based (`commands`, `files`, `pty`) | Multiple | Native API | Firecracker microVM |
| Daytona | Sub-object (`process`, `fs`) | Multiple | Native API | Container |
| LangChain DeepAgents | Single `execute()` | 1 | Shell-derived | Provider-dependent |
| OpenHands | Action/observation dispatch | Multiple action types | Action-based | Docker |
| Google ADK | Single `execute_code()` | 1 | Not exposed | GKE/gVisor |
| Anthropic SRT | Config-driven policy | N/A (wraps local) | Allow/deny lists | Process-level |

The ecosystem converges on two patterns: (1) a single execution primitive with derived operations (LangChain, Google ADK), or (2) separate modules for commands, code, and files (E2B, Daytona). Our recommended Option A follows pattern 1, with the ability to override derived methods following pattern 2 where native APIs exist.

---

## Appendix C: Research on open questions

### Namespace injection approaches in the ecosystem

The programmatic tool caller needs to make tools callable as Python functions inside the execution context. Different frameworks handle this differently.

smolagents' `CodeAgent` runs code in the host process with tools pre-loaded as global functions. Tools are registered at initialization (`tools=[WebSearchTool()]`) and become directly callable in the generated code (for example, `web_search("query")`). The execution happens in a sandboxed executor (E2B, Docker, Modal), but the tool namespace is injected before execution. smolagents supports `additional_authorized_imports` to allow specific imports in the sandbox.

E2B and Daytona handle this at the environment level — custom Docker images or VM snapshots pre-populate `globals()` with functions before agent code runs. This works for static tool sets but not for dynamic tool registries.

LangChain uses `@tool` decorated wrappers with runtime state injection (`ToolRuntime`). Tools access context via `runtime.state`, not via global namespace injection. The execution itself is not sandboxed by LangChain — it pairs with external executors.

The key insight: for dynamic tool sets (where tools are registered at agent creation time, not baked into an image), in-process execution with namespace injection is the only practical approach. Remote sandboxes cannot receive arbitrary Python closures. This is why we recommend the programmatic tool caller runs orchestration code locally.

### Working directory persistence approaches

The current `shell` tool in `strands_tools` uses `CommandContext` to track the working directory. The devtools shell ([PR #39](https://github.com/strands-agents/devtools/pull/39)) takes a different approach: a persistent subprocess-based shell where `cd` and `export` persist naturally because commands are sent to the same shell process.

E2B supports full sandbox persistence via `sandbox.pause()` and `sandbox.connect()` — the entire environment (filesystem, working directory, env vars) survives across sessions. Daytona provides persistent sandboxes by design, maintaining state between runs without rebuilding.

Docker `exec` on a running container naturally preserves filesystem state. However, each `docker exec` starts a new shell process, so `cd` in one exec does not affect the next. To persist `cd`, you either track it externally or use a persistent shell inside the container.

For `LocalSandbox`, a persistent shell process is the right approach. It matches Unix expectations and avoids fragile command parsing. The implementation would keep a long-running `/bin/sh` process, send commands via stdin, and read output from stdout/stderr.

### Parallel execution and sandbox concurrency

Strands' `ConcurrentToolExecutor` runs tool calls in parallel via `asyncio.create_task`. This creates a concurrency concern for sandboxes that maintain shared state.

Docker handles this naturally — each `docker exec` gets its own process inside the container. Multiple concurrent execs do not interfere with each other (though they share the filesystem, so concurrent file writes can conflict).

E2B and Daytona handle concurrent API calls independently — each call gets its own execution context within the sandbox.

The challenge is `LocalSandbox` with a persistent shell. If two tools send commands to the same shell process simultaneously, stdout/stderr from both commands interleave unpredictably. Solutions:

1. Serialize with a lock — simple but negates concurrency benefits.
2. Spawn subprocesses per call that inherit tracked state — each `execute()` creates a fresh subprocess with `cwd=self._tracked_cwd` and `env=self._tracked_env`, while the persistent shell is only used for state-tracking commands. This preserves concurrency while maintaining state.
3. Pool of shell processes — more complex, diminishing returns.

Option 2 is the recommended approach for `LocalSandbox`.
