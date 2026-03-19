# Sandboxes and code execution

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

The Sandbox ABC lives in the SDK (`strands-agents/sdk-python`). Concrete implementations (`LocalSandbox`, `DockerSandbox`, `AgentCoreSandbox`) also live in the SDK as vended sandbox providers, similar to how the SDK already vends tools and plugins. Third-party sandbox providers can be published as separate packages.

There are two viable interface patterns from the ecosystem (see [Appendix B](#appendix-b-prior-art) for full survey). We present both and recommend Option A.

##### Option A: Minimal `execute()` (recommended)

A single abstract method with convenience methods built on top. The base class derives filesystem operations by running shell commands through `execute()`.

LangChain DeepAgents is an example of this pattern — Daytona, Modal, E2B, and Runloop all implement a single `execute()` method against this interface.

```python
from abc import ABC, abstractmethod
from collections.abc import AsyncGenerator
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
    ) -> AsyncGenerator[str | ExecutionResult, None]:
        """Execute a shell command, streaming output.

        Yields stdout/stderr lines as they arrive. The final yield
        is an ExecutionResult with the exit code and complete output.

        This matches Strands' existing async tool streaming pattern
        where tools yield intermediate results via AsyncGenerator.
        """
        ...

    # --- Convenience methods built on execute() ---

    async def execute_code(
        self,
        code: str,
        language: str = "python",
        timeout: int | None = None,
    ) -> AsyncGenerator[str | ExecutionResult, None]:
        """Execute code in the sandbox. Override for native code execution."""
        escaped = code.replace("'", "'\\''")
        async for chunk in self.execute(f"{language} -c '{escaped}'", timeout=timeout):
            yield chunk

    async def read_file(self, path: str) -> str:
        """Read a file from the sandbox filesystem. Override for native file I/O."""
        result = await self._execute_to_result(f"cat '{path}'")
        if result.exit_code != 0:
            raise FileNotFoundError(result.stderr)
        return result.stdout

    async def write_file(self, path: str, content: str) -> None:
        """Write a file to the sandbox filesystem. Override for native file I/O."""
        result = await self._execute_to_result(
            f"cat > '{path}' << 'STRANDS_EOF'\n{content}\nSTRANDS_EOF"
        )
        if result.exit_code != 0:
            raise IOError(result.stderr)

    async def list_files(self, path: str = ".") -> list[str]:
        """List files in a sandbox directory. Override for native listing."""
        result = await self._execute_to_result(f"ls -1 '{path}'")
        if result.exit_code != 0:
            raise FileNotFoundError(result.stderr)
        return [f for f in result.stdout.strip().split("\n") if f]

    async def _execute_to_result(self, command: str, timeout: int | None = None) -> ExecutionResult:
        """Helper: consume the execute() stream and return the final ExecutionResult."""
        result = None
        async for chunk in self.execute(command, timeout=timeout):
            if isinstance(chunk, ExecutionResult):
                result = chunk
        if result is None:
            raise RuntimeError("execute() did not yield an ExecutionResult")
        return result

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

The streaming interface matches Strands' existing async tool pattern where tools `yield` intermediate results via `AsyncGenerator`. Tools that use the sandbox can forward these yields to provide real-time output to the user. Tools that do not need streaming can use the `_execute_to_result()` helper to consume the stream and get a final `ExecutionResult`.

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

Inside a tool, the Sandbox is accessed via [`ToolContext`](https://strandsagents.com/docs/user-guide/concepts/tools/custom-tools/index.md). Tools can stream sandbox output using Strands' existing async generator pattern:

```python
from strands import tool, ToolContext
from strands.sandbox import ExecutionResult


@tool(context=True)
async def shell(command: str, tool_context: ToolContext) -> str:
    """Execute a shell command with streaming output."""
    result = None
    async for chunk in tool_context.agent.sandbox.execute(command):
        if isinstance(chunk, str):
            yield chunk  # Stream output to the user
        elif isinstance(chunk, ExecutionResult):
            result = chunk
    return result.stdout
```

Because the agent always has a sandbox (defaulting to `LocalSandbox`), tools do not need fallback logic. They always delegate to the sandbox.

#### State management

The sandbox must decide whether state (working directory, environment variables) persists between `execute()` calls.

We recommend stateless by default: each `execute()` call is independent. This avoids concurrency issues when multiple tools call the sandbox in parallel (tool A does `cd /tmp`, tool B does `cd /home` — with shared state, the last one wins and both are confused). Stateless execution is predictable and matches the LangChain DeepAgents model.

This means `cd`, `export`, and other state-modifying commands do not persist between calls. Tools that need state persistence (for example, a shell tool that tracks `cd` across calls) can manage it themselves, as the current `shell` tool already does via `CommandContext`.

Each sandbox implementation handles this differently:

- `LocalSandbox` — spawns a fresh subprocess per `execute()` call. Stateless by default.
- `DockerSandbox` — each `docker exec` gets its own process. Filesystem changes persist (shared container), but cwd and env do not carry across calls.
- `AgentCoreSandbox` — session state persists natively via the AgentCore API.

Sandbox implementations may optionally offer a stateful mode (for example, `LocalSandbox` could use a persistent shell process for tools that opt in), but the default behavior and the abstract interface make no persistence promise.

#### Tool proxy

When code runs inside a sandbox (for example, the programmatic tool caller or CodeAct executing model-generated code in Docker), that code needs to call agent tools. But agent tools are Python objects in the host process — they cannot be serialized into a remote sandbox. The tool proxy solves this by bridging tool calls from the sandbox back to the host.

We considered three approaches:

| Approach | How it works | Pros | Cons |
|----------|-------------|------|------|
| Host-process execution | Orchestration code runs locally, tools are local functions | Simple, no IPC | Orchestration code is unsandboxed |
| Serialize tools as source code | Generate Python source for each tool, send to sandbox (smolagents approach) | Tools run fully in sandbox | Only works for self-contained tools. Strands tools have closures over the agent, access `ToolContext`, make API calls — they cannot be serialized as source |
| Callback proxy | Sandbox code calls tools via HTTP back to the host | Full sandbox isolation, works with any tool | Requires proxy server, network latency per tool call |

We recommend the callback proxy approach, implemented incrementally:

1. Phase 1 (P0/P1): orchestration code runs in the host process. Tools are local async functions. This is simple and works today.
2. Phase 2 (P2): add a tool proxy server. Orchestration code runs fully inside the sandbox. Tool calls are proxied back to the host via HTTP.

The tool proxy works as follows:

1. Before executing code in the sandbox, the host starts a lightweight HTTP server
2. For each agent tool, a stub function is generated as Python source code. The stub makes an HTTP POST to the proxy server with the tool name and arguments
3. The generated stubs are prepended to the model's code and sent to `sandbox.execute_code()`
4. When the sandbox code calls a tool stub, the HTTP request reaches the host proxy
5. The host proxy dispatches to `agent.tool.X()`, which executes the tool (using the sandbox for its own execution)
6. The result is returned as the HTTP response, and sandbox code continues

```
┌─────────────────────────────────────────────────────────┐
│  Sandbox (Docker, AgentCore, etc.)                      │
│                                                         │
│  # Generated stub (prepended to model's code)           │
│  async def calculator(expression: str) -> str:          │
│      resp = await httpx.post(                           │
│          "http://host:9999/tool/calculator",             │
│          json={"expression": expression}                │
│      )                                                  │
│      return resp.json()["result"]                       │
│                                                         │
│  # Model's code                                         │
│  result = await calculator(expression="2 + 2")          │
│  print(result)                                          │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP POST /tool/calculator
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Host process                                           │
│                                                         │
│  Tool Proxy Server (port 9999)                          │
│  ├── POST /tool/calculator                              │
│  │   → agent.tool.calculator(expression="2 + 2")        │
│  │   → returns {"result": "4"}                          │
│  └── POST /tool/shell                                   │
│      → agent.tool.shell(command="ls")                   │
│      → (shell tool uses sandbox.execute() internally)   │
└─────────────────────────────────────────────────────────┘
```

The proxy server is managed by the sandbox or the tool that needs it (programmatic tool caller, CodeAct). It starts before code execution and stops after. The `Sandbox` interface does not change — the proxy is a layer on top.

Considerations:

- The proxy server must be reachable from the sandbox. For `DockerSandbox`, this means host networking or `host.docker.internal`. For `AgentCoreSandbox`, the sandbox must allow outbound HTTP.
- `httpx` (or equivalent) must be available inside the sandbox for the stubs to work.
- Each tool call adds network round-trip latency. For tools that are themselves fast (like `calculator`), this overhead is noticeable. For tools that do I/O (like `http_request` or `shell`), it is negligible.
- The proxy should authenticate requests (for example, a short-lived token) to prevent unauthorized tool calls from other processes.


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
3. The tool executes this code in the host process with tool wrappers injected (Phase 1), or inside the sandbox via the tool proxy (Phase 2)
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

The programmatic tool caller does not run its code in the sandbox. It runs the model's orchestration code in the host process, injecting tool wrappers as async functions that call `agent.tool.X()`. Those tools in turn use the sandbox. The sandbox is used by the individual tools, not by the orchestration layer.

It:

1. Introspects the agent's tool registry to find available tools
2. Creates async wrapper functions for each tool
3. Injects these wrappers into the local execution namespace
4. Runs the model's code in-process via `exec()`
5. Captures `print()` output as the tool result

```python
class ProgrammaticToolCaller:
    """Tool that executes code calling other tools."""

    def __init__(self, allowed_tools: list[str] | None = None):
        self.allowed_tools = allowed_tools

    async def execute(self, code: str, agent: Agent) -> str:
        # Build namespace with tool wrappers that call agent.tool.X()
        namespace = self._build_tool_namespace(agent)

        # Execute in host process — tools use the sandbox internally
        exec(compile(code, "<programmatic_tool_caller>", "exec"), namespace)
        return namespace.get("__output__", "")
```

This means programmatic tool calling works with any sandbox — the orchestration code does not need to know or care what sandbox is configured.

The initial implementation runs orchestration code in the host process. Once the tool proxy is available (see [Tool proxy](#tool-proxy) in Layer 1), the programmatic tool caller can be upgraded to run code fully inside the sandbox.

### Layer 3: CodeAct plugin

CodeAct is a higher-level paradigm where the agent always responds with code instead of JSON tool calls. It is implemented as a hook using the existing agent lifecycle, not a modification to the agent loop.

#### The CodeAct paradigm

In standard tool calling, the model outputs structured JSON to invoke tools one at a time. In CodeAct (from the [Apple ML Research paper](https://machinelearning.apple.com/research/codeact)), the model outputs executable code that calls tools as functions. This has several advantages:

- Loops, conditionals, and data transformations are native (no multi-turn back-and-forth)
- Intermediate results stay in code variables, not the context window
- The model can self-correct by catching exceptions and retrying in the next turn
- Token usage drops dramatically (up to 98.7% reduction reported)

HuggingFace's [smolagents](https://huggingface.co/docs/smolagents/en/index) implements this as `CodeAgent` — a separate agent class that generates Python code instead of JSON tool calls.

#### How it works in Strands

CodeAct maps naturally to Strands' hook system. The [`AfterInvocationEvent.resume`](https://strandsagents.com/docs/user-guide/concepts/agents/hooks/index.md) property triggers a follow-up agent invocation with new input, which is exactly the CodeAct observation loop: model generates code → execute → feed results back as next observation → model generates more code.

The plugin registers hooks on the agent:

1. `BeforeInvocationEvent` — modifies the system prompt to instruct the model to respond with Python code, and injects tool function signatures into the prompt
2. `AfterInvocationEvent` — parses code from the model's response, executes it in a persistent namespace with tools available as callable functions, and sets `event.resume` with the execution result (stdout, errors) as the next observation
3. The loop terminates when the model calls `final_answer()` in its code or responds without a code block

```python
from strands import Agent
from strands.hooks import AfterInvocationEvent, BeforeInvocationEvent


class CodeActPlugin:
    """Implements CodeAct via agent hooks."""

    def __init__(self, agent: Agent):
        self.agent = agent
        self.namespace = {"__builtins__": __builtins__}

        # Inject tool wrappers into the execution namespace
        self._inject_tools()

        # Register hooks
        agent.hooks.add_callback(BeforeInvocationEvent, self._setup_prompt)
        agent.hooks.add_callback(AfterInvocationEvent, self._execute_and_resume)

    def _inject_tools(self):
        """Make agent tools callable as Python functions in the namespace."""
        for tool_name in self.agent.tool_registry.registry:
            self.namespace[tool_name] = self._make_tool_wrapper(tool_name)

        def final_answer(result):
            self.namespace["__final_answer__"] = result

        self.namespace["final_answer"] = final_answer

    async def _setup_prompt(self, event: BeforeInvocationEvent):
        """Instruct the model to respond with Python code."""
        # Prepend CodeAct instructions to system prompt
        ...

    async def _execute_and_resume(self, event: AfterInvocationEvent):
        """Parse code from response, execute, resume with results."""
        code = self._parse_code(event.result.message)
        if not code:
            return  # No code block — model is done

        if "__final_answer__" in self.namespace:
            return  # Model called final_answer() — done

        try:
            # exec() does not support top-level await, so we wrap in an async main
            wrapped = f"async def __codeact_main__():\n" + "\n".join(
                f"    {line}" for line in code.splitlines()
            )
            exec(compile(wrapped, "<codeact>", "exec"), self.namespace)
            await self.namespace["__codeact_main__"]()
            output = self.namespace.get("__stdout__", "")
        except Exception as e:
            output = f"Error: {e}"

        # Feed execution result back as next observation
        event.resume = f"Execution result:\n{output}"
```

Usage:

```python
from strands import Agent
from strands_tools import shell, http_request, calculator

agent = Agent(tools=[shell, http_request, calculator])

# Apply CodeAct — the agent now responds with code
codeact = CodeActPlugin(agent)

result = agent("Fetch the top 10 HN stories and save them to a file")
```

The model's response would be natural language with a code block. The CodeAct plugin parses the code block, executes it, and feeds the result back via `resume`.

Key properties of this approach:

- Works within the existing agent loop — no custom loop needed
- The model outputs natural language reasoning alongside code (matching the paper)
- State persists across turns via the shared `namespace` dict
- Errors feed back as observations, enabling self-correction
- `final_answer()` terminates the loop
- `resume` handles the observation cycle natively

Note: the initial implementation runs code in the host process with tools as local functions. Once the tool proxy is available (see [Tool proxy](#tool-proxy) in Layer 1), CodeAct can run code fully inside the sandbox.

#### Difference from programmatic tool caller

| Aspect | Programmatic tool caller | CodeAct |
|--------|------------------------|---------|
| Scope | One tool among many | Replaces the agent's interaction mode |
| Model choice | Model decides when to use it | Always active |
| Tool calling | Standard JSON tool calls | Code blocks in natural language response |
| State | Stateless per call | Persistent namespace across turns |
| Self-correction | Not built in | Native via error feedback loop |
| Integration | Drop-in tool | Hook-based plugin |
| Sandbox isolation | Phase 1: host process. Phase 2: full sandbox via tool proxy | Phase 1: host process. Phase 2: full sandbox via tool proxy |
| Use case | Optimization for batch operations | Full paradigm shift |

The programmatic tool caller is a tool the model can optionally use within standard tool calling. CodeAct changes how the agent interacts entirely — the model always writes code, and the hook system handles execution and feedback.


## API surface

### SDK changes (`strands-agents/sdk-python`)

The Sandbox ABC and `ExecutionResult` dataclass are added to the SDK. The `Agent` class accepts an optional `sandbox` parameter that defaults to `LocalSandbox`.

```python
from strands import Agent
from strands.sandbox import Sandbox, LocalSandbox, ExecutionResult
from strands.sandbox.docker import DockerSandbox

# Default: LocalSandbox (backwards compatible, same behavior as today)
agent = Agent(tools=[shell])

# Explicit sandbox
agent = Agent(tools=[shell], sandbox=DockerSandbox(image="python:3.12-slim"))
```

Tools access the sandbox via [`ToolContext`](https://strandsagents.com/docs/user-guide/concepts/tools/custom-tools/index.md). No changes to the tool interface are required.

```python
from strands import tool, ToolContext
from strands.sandbox import ExecutionResult


@tool(context=True)
async def my_tool(tool_context: ToolContext) -> str:
    async for chunk in tool_context.agent.sandbox.execute("ls -la"):
        if isinstance(chunk, ExecutionResult):
            return chunk.stdout
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
  // The only required method — yields output lines, final yield is ExecutionResult
  execute(command: string, timeout?: number): AsyncGenerator<string | ExecutionResult>;

  // Convenience methods (default implementations built on execute())
  executeCode?(code: string, language?: string, timeout?: number): AsyncGenerator<string | ExecutionResult>;
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

1. **Namespace injection for programmatic tool calling.** The programmatic tool caller and CodeAct need tool wrapper functions in the code execution namespace. Phase 1 runs orchestration code in the host process with tools as local functions. Phase 2 uses the tool proxy to run code fully inside the sandbox. See [Tool proxy](#tool-proxy) for the full design and alternatives considered.

2. **Stateful sandbox mode.** The default is stateless (see [State management](#state-management)). Some use cases may benefit from a stateful mode where `cd` and `export` persist across calls. Should this be a constructor flag on sandbox implementations, a separate `StatefulSandbox` subclass, or left entirely to individual tools?

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
- [ ] Tool proxy: implement proxy server, stub generation, and integrate with programmatic tool caller and CodeAct
- [ ] Mirror `Sandbox` interface in `sdk-typescript`
- [ ] Implement `LocalSandbox` and `DockerSandbox` for TypeScript

## Alternatives considered

### Sandbox as a tool wrapper instead of SDK concept

We considered making Sandbox a tool-level concern — each tool would optionally accept a Sandbox in its constructor. This avoids SDK changes but means every tool must independently handle Sandbox injection, and there is no guarantee that tools share the same Sandbox instance.

Rejected because the shared-environment property (tools operating in the same filesystem) requires the Sandbox to be agent-level, not tool-level.

### CodeAct as a new agent class

smolagents implements CodeAct as a separate `CodeAgent` class. We considered adding `CodeActAgent` to the SDK alongside `Agent`.

Rejected because it duplicates the agent loop and creates a maintenance burden. The hook-based approach using `AfterInvocationEvent.resume` implements the CodeAct observation loop within the existing agent lifecycle, composing with other agent features (hooks, conversation management, streaming) without reimplementation.

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

<details>
<summary>Appendix A: Sandbox implementation sketches</summary>

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

</details>

---

<details>
<summary>Appendix B: Prior art</summary>

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

</details>

---

<details>
<summary>Appendix C: Research on open questions</summary>

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

</details>
