# Strands High Level Features - Deploy

## Where we are

The Strands Agents SDK makes it easy to build an agent in a few lines of code. Once an agent works locally, the next question is always the same: *how do I run this in production?*

Today, deploying a Strands agent to the cloud requires the developer to:

1. Write a service wrapper (Flask, FastAPI, or a framework-specific entrypoint).
2. Package the agent code, its dependencies, and the wrapper into a deployable artifact.
3. Provision cloud infrastructure: IAM roles, compute runtimes, networking, and endpoints.
4. Track what was deployed so subsequent updates go to the same resource.
5. Repeat all of the above each time the agent changes.

Each of these steps involves decisions that have nothing to do with the agent itself. The developer must become an infrastructure engineer before their agent can serve its first request. This friction slows adoption, increases the barrier to entry, and pulls focus away from the agent's actual purpose.

## The gap between "it works locally" and "it works in production"

AWS Bedrock AgentCore provides managed infrastructure for running agents: auto-scaling runtimes, built-in IAM, and a service endpoint. The `bedrock-agentcore-starter-toolkit` Python package wraps AgentCore's APIs and handles the heavy lifting of IAM role creation, code upload, runtime provisioning, and endpoint polling.

Even with the toolkit, a developer still needs to:

- **Learn AgentCore's mental model.** AgentCore introduces its own concepts that developers need to learn.
- **Write a `BedrockAgentCoreApp` entrypoint from scratch.** The toolkit expects a specific entrypoint format: a `BedrockAgentCoreApp` instance with an `@app.entrypoint` decorator. The developer must manually reconstruct their Strands agent inside this file. No bridge exists between the Strands `Agent` class and AgentCore's expected format.
- **Track deployed resources manually.** Each deployment creates IAM roles, runtime IDs, and endpoint ARNs. The developer must track these across create-vs-update cycles to avoid orphaned resources or duplicates. No built-in state management exists.

This is too many concepts, too many files, and too many failure modes for someone who just wants to ship an agent.

## Introducing `deploy` - one call from local to cloud

The end goal is the simplest possible deployment experience — a method on the agent itself:

```python
agent = Agent(name="ac_agent", plugins=[plugins] tools=[my_tool])
agent.deploy()
```

This is the API we want to graduate to. `agent.deploy()` communicates exactly the right intent: *take this agent and put it in the cloud.* It requires no new imports, no separate modules, and no mental context switch.

However, deployment touches cloud infrastructure, source capture, state management, and dependency resolution. The API will evolve as we add targets and learn from real usage. Shipping `agent.deploy()` on day one would lock us into a stable contract before the feature is ready.

For the initial launch, we expose deployment as a standalone function under `strands.experimental`:

```python
from strands import Agent
from strands.experimental.deploy import deploy

agent = Agent(name="ac_agent", tools=[my_tool])
result = deploy(agent)
```

This gives us room to iterate on the function signature, config shape, and result fields while signaling that the API may change. Once the feature stabilizes — validated across project structures, with multiple targets and real-world usage — we promote it to `agent.deploy()` on the Agent class.

Behind that call, the module:

1. Captures the caller's source and strips the `deploy()` call.
2. Appends a `BedrockAgentCoreApp` wrapper to create a deployable entrypoint.
3. Resolves the AWS region from the agent's model config, the boto3 session, or the environment.
4. Merges SDK-required packages (`bedrock-agentcore`, `strands-agents`) with the user's `requirements.txt`.
5. Delegates provisioning to the `bedrock-agentcore-starter-toolkit` `Runtime` class.
6. Saves deployment state to `.strands_deploy/state.json` so subsequent calls update rather than recreate.
7. Cleans up generated artifacts (`_strands_entrypoint.py`, `dependencies.hash`, `dependencies.zip`).

### Why experimental first?

Placing `deploy` under `strands.experimental` rather than directly on the Agent class serves three purposes:

- **API freedom.** The function signature, config shape, and result fields can change without breaking stable SDK consumers.
- **Dependency isolation.** Deployment pulls in `bedrock-agentcore-starter-toolkit` and `boto3`. These should not be required to import `Agent`. The experimental function makes the dependency opt-in:

```python
pip install 'strands-agents[deploy]'
```

- **Graduation criteria.** Moving to `agent.deploy()` becomes a deliberate milestone — one that requires validated source capture, multiple targets, and confidence in the API surface.

## Architecture

### Strategy pattern for deployment targets

A core tenet of the Strands SDK is platform independence. Strands agents already use any model provider — Bedrock, OpenAI, Gemini — and the same principle extends to deployment. A developer should deploy the same agent to AgentCore today and to Lambda, ECS, or a non-AWS platform tomorrow without rewriting deployment code. The deploy module cannot be built around a single target. It must support multiple backends behind a stable interface.

The module uses the Strategy pattern to achieve this:

```
deploy()  -->  DeployTarget (ABC)
                    |
                    +-- AgentCoreTarget
                    +-- (future: LambdaTarget, ECSTarget, ...)
```

```python
class DeployTarget(ABC):
    @abstractmethod
    def validate(self, config: DeployConfig) -> None: ...

    @abstractmethod
    def deploy(self, agent: Agent, config: DeployConfig,
               state_manager: StateManager) -> DeployResult: ...

    @abstractmethod
    def destroy(self, name: str, state_manager: StateManager,
                region: str | None = None) -> None: ...
```

Each target owns its full lifecycle: validation, provisioning, updating, and teardown. The `deploy()` function selects the target, constructs a `DeployConfig`, and delegates.

### AgentCore target

`AgentCoreTarget` is the first concrete target. Rather than calling AWS APIs directly, it delegates to the `bedrock-agentcore-starter-toolkit` `Runtime` class:

```
AgentCoreTarget.deploy()
    |
    +-- generate_agentcore_entrypoint(agent)  # _packaging.py
    +-- Runtime().configure(...)               # starter toolkit
    +-- Runtime().launch()                     # starter toolkit
    +-- StateManager.save(...)                 # _state.py
```

This delegation is deliberate. The starter toolkit handles IAM role creation, S3 upload, runtime polling, and endpoint management. Reimplementing that logic would be fragile and would drift as AgentCore evolves. By delegating, the deploy module stays thin and benefits from toolkit improvements automatically.

### Entrypoint generation via source capture

A Strands agent carries tools, plugins, hooks, and custom model configurations — arbitrary Python objects that cannot be reliably serialized. The deploy module sidesteps this by copying the caller's actual source file and transforming it into a valid AgentCore entrypoint.

The process works in three steps:

1. **Find the caller.** `_find_caller_info()` walks the call stack to locate the source file that called `deploy()`, and identifies the variable name holding the agent object.
2. **Strip the deploy call.** An AST transformer (`_DeployStripper`) removes the `deploy()` import and call, any code after it, and any `if __name__ == '__main__'` block. It also converts relative imports to absolute so the code works as a standalone script.
3. **Append the AgentCore wrapper.** A small template is appended that wraps the agent in a `BedrockAgentCoreApp` entrypoint.

Given this caller source:

```python
from strands import Agent
from strands.experimental import deploy
from my_tools import calculator, search

agent = Agent(
    name="ac_agent",
    system_prompt="You are a helpful assistant.",
    tools=[calculator, search],
)
result = deploy(agent)
```

The generated entrypoint becomes:

```python
"""Auto-generated Strands Agent entrypoint for AgentCore."""
import sys
import os

_here = os.path.dirname(__file__)
sys.path.insert(0, _here)

from strands import Agent
from my_tools import calculator, search

agent = Agent(
    system_prompt='You are a helpful assistant.',
    tools=[calculator, search],
    name="ac_agent"
)

# --- AgentCore wrapper (auto-generated by strands deploy) ---
from bedrock_agentcore import BedrockAgentCoreApp

app = BedrockAgentCoreApp()

@app.entrypoint
def invoke(payload):
    prompt = payload.get("prompt", "Hello!")
    result = agent(prompt)
    return {"result": str(result), "stop_reason": result.stop_reason}

if __name__ == "__main__":
    app.run()
```

This approach preserves the full agent definition — tools, plugins, hooks, and all constructor parameters. The entire working directory is packaged into the deployment zip alongside the entrypoint, so local imports (like `my_tools`) resolve correctly.

If the caller's source file cannot be found (e.g., when called from a REPL or `<stdin>`), the module raises a `DeployPackagingException`.

### State management

Deployments are stateful. Creating an AgentCore runtime produces ARNs and IDs that must persist so the next `deploy()` call updates rather than duplicates.

State lives in `.strands_deploy/state.json` in the working directory:

```json
{
  "version": "1",
  "deployments": {
    "my-agent": {
      "target": "agentcore",
      "region": "us-west-2",
      "agent_runtime_id": "rt-abc123",
      "agent_runtime_arn": "arn:aws:bedrock-agentcore:...",
      "last_deployed": "2026-03-25T10:30:00+00:00",
      "created_at": "2026-03-25T10:00:00+00:00"
    }
  }
}
```

The `StateManager` uses atomic writes (temporary file + `os.replace`) to prevent corruption. Multiple named deployments can coexist in a single state file.

### Exception hierarchy

All deployment errors inherit from `DeployException`:

```
DeployException
    +-- DeployTargetException   # Target-specific failures (AWS API errors)
    +-- DeployPackagingException # Code packaging failures
    +-- DeployStateException     # State file read/write failures
```

Callers can catch the base class broadly or handle specific failure modes.

## Module structure

```
src/strands/experimental/deploy/
    __init__.py        # deploy(), DeployConfig, DeployResult
    _base.py           # DeployTarget ABC
    _agentcore.py      # AgentCoreTarget implementation
    _constants.py      # Python version mapping, packaging excludes
    _packaging.py      # Entrypoint generation, code zipping
    _state.py          # StateManager, DeployState TypedDict
    _exceptions.py     # Exception hierarchy
```

All internal modules are prefixed with `_` to signal they are private. The public API is the `deploy()` function and the dataclasses exported from `__init__.py`.

## Configuration

### `DeployConfig`

```python
@dataclass
class DeployConfig:
    target: Literal["agentcore"]
    name: str
    region: str | None = None
    description: str | None = None
    environment_variables: dict[str, str] = field(default_factory=dict)
```

### `DeployResult`

```python
@dataclass
class DeployResult:
    target: str
    name: str
    region: str
    created: bool = True
    agent_runtime_id: str | None = None
    agent_runtime_arn: str | None = None
    agent_runtime_endpoint_arn: str | None = None
    role_arn: str | None = None
```

### Region resolution

Region is resolved in priority order:
1. Explicit `region` parameter
2. Agent model's config (`model.config["region"]`)
3. boto3 session default region
4. `AWS_REGION` environment variable
5. Fallback to `us-east-1`

### Name sanitization

If no explicit name is provided, the agent's name is sanitized: lowercased, non-alphanumeric characters replaced with underscores, stripped, and truncated to 40 characters.

## Experimental status

The module lives under `strands.experimental` for three reasons:

1. **Source capture has edge cases.** The AST-based approach works well for straightforward scripts, but complex project layouts — editable installs, custom `PYTHONPATH`, deeply nested packages — may require additional `sys.path` handling that has not yet been validated.
2. **Single target.** Only AgentCore is implemented. The target abstraction needs validation against a second backend.
3. **API surface.** The function signature, config shape, and result fields may change as we learn from real usage.

Graduating to `agent.deploy()` on the Agent class requires validating source capture across diverse project structures, adding a second deployment target, and gaining confidence in the API surface through real-world usage.

## FAQ

### Why not just use the AgentCore CLI directly?

Programmatic deployment from Python offers advantages the CLI cannot:

- **No learning curve.** Developers already know Python. `deploy(agent)` is self-explanatory — no CLI flags, config files, or authentication flows to learn.
- **Rapid experimentation and sharing.** Tweak a prompt, swap a tool, redeploy — without leaving the script. The feedback loop between "change the agent" and "test it live" shrinks to seconds. Share a live endpoint with teammates by sharing an ARN.
- **Pipeline integration.** Deployment becomes a line of Python in a CI job, an eval harness, or a test suite:

```python
agent = Agent(name="my_agent", tools=[my_tool])
results = run_evals(agent)
if results.passed:
    deploy(agent)
```

- **No boilerplate.** The CLI still requires a `BedrockAgentCoreApp` entrypoint, managed requirements, and explicit configuration. `deploy()` handles all of that.
- **Familiar paradigm.** Python developers expect this pattern from Airflow, Prefect, and MLflow — infrastructure managed programmatically alongside the code it runs.

### Does this compromise Strands' platform agnosticism?

No. The `DeployTarget` abstraction keeps deployment platform-agnostic. AgentCore is the first target, but the interface supports any backend — Lambda, ECS, Kubernetes, or non-AWS platforms. Each target is a separate implementation behind the same `deploy()` function, and users can always specify `target=` explicitly.

Strands favors making deployment easy, not a particular cloud provider.

### Why not ship `agent.deploy()` on the Agent class from day one?

The end goal is `agent.deploy()`. But deployment touches source capture, cloud infrastructure, state management, and dependency resolution — the API will evolve as we add targets and learn from usage.

Deployment starts as an experimental function: `from strands.experimental.deploy import deploy` followed by `deploy(agent)`. This lets us iterate without locking the stable Agent class into a premature contract. Once validated across project structures and with multiple targets, we promote it to `agent.deploy()`.

### What happens if I call `deploy()` twice?

The second call updates the existing deployment rather than creating a duplicate. State is tracked in `.strands_deploy/state.json`, which maps deployment names to their cloud resource IDs. If state exists for the given name, the deploy module passes the existing resource identifiers to the toolkit so it performs an update instead of a create.

### What gets packaged in the deployment?

The entire working directory (minus excluded paths like `.git`, `__pycache__`, `.venv`, etc.) is zipped and uploaded. The caller's source file is transformed into an AgentCore entrypoint, with the `deploy()` call stripped and a wrapper appended. This means all local Python files — tool definitions, utility modules, config files — are available to the deployed agent.

## Alternative approach: `DeployableAgent` wrapper in extensions

An alternative to placing deploy in `strands.experimental` within the core SDK is to ship it as a `DeployableAgent` wrapper class in the `strands-agents-extensions` package. This keeps cloud infrastructure concerns entirely out of the core SDK while preserving a clean, agent-centric API.

### Motivation

The core SDK's identity is platform-agnostic agent building. Deployment pulls in `boto3`, `bedrock-agentcore-starter-toolkit`, IAM role management, and state tracking — none of which are relevant to building or running an agent locally. Placing deploy in the core SDK (even under `experimental`) means:

- Cloud-specific dependencies live in a package whose purpose is provider neutrality.
- The `strands-agents` package grows an optional extra (`[deploy]`) for functionality that isn't core to agents.
- The graduation path to `agent.deploy()` permanently couples deployment to the Agent class.

The extensions package (`strands-agents-extensions`) already exists to house optional, provider-specific, or opinionated functionality. It already depends on `strands-agents>=1.32.0` and uses optional extras for heavy dependencies (`[budget]` requires `litellm`, etc.). Deploy fits this pattern naturally.

### Design: wrapper implementing `AgentBase`

Rather than subclassing `Agent` (which would tightly couple to its constructor) or using a standalone function (which loses the `agent.deploy()` ergonomics), `DeployableAgent` is a **wrapper** that implements the SDK's `AgentBase` protocol and transparently delegates to the inner agent:

```python
from strands import Agent, AgentBase, AgentResult
from strands_agents_extensions.agents import DeployableAgent

agent = Agent(name="my_agent", tools=[my_tool], system_prompt="You are helpful.")
deployable = DeployableAgent(agent)

# Deploy and destroy are first-class methods
result = deployable.deploy(target="agentcore", region="us-west-2")
deployable.destroy()

# Use it like a normal agent — invocation, properties, everything works
response = deployable("What's 2+2?")
print(deployable.name)        # → "my_agent"
print(deployable.tool_names)  # → ["my_tool"]
```

### Implementation sketch

```python
class DeployableAgent(AgentBase):
    """Wraps an Agent with deploy/destroy lifecycle methods."""

    def __init__(self, agent: Agent, *, state_dir: str | Path | None = None):
        self._agent = agent
        self._state_manager = StateManager(state_dir or Path.cwd() / ".strands_deploy")

    # ── AgentBase protocol (explicit, type-safe) ──────────────

    def __call__(self, prompt, **kwargs) -> AgentResult:
        return self._agent(prompt, **kwargs)

    async def invoke_async(self, prompt, **kwargs) -> AgentResult:
        return await self._agent.invoke_async(prompt, **kwargs)

    async def stream_async(self, prompt, **kwargs):
        async for event in self._agent.stream_async(prompt, **kwargs):
            yield event

    # ── Transparent proxy for everything else ─────────────────

    def __getattr__(self, name):
        return getattr(self._agent, name)

    # ── Deployment lifecycle ──────────────────────────────────

    def deploy(self, *, target: str = "agentcore", region: str | None = None,
               environment_variables: dict[str, str] | None = None) -> DeployResult:
        deploy_target = self._resolve_target(target)
        config = DeployConfig(
            name=self._agent.name, target=target, region=region,
            environment_variables=environment_variables or {},
        )
        return deploy_target.deploy(self._agent, config, self._state_manager)

    def destroy(self, *, region: str | None = None) -> None:
        deploy_target = self._resolve_target(...)
        deploy_target.destroy(self._agent.name, self._state_manager, region=region)
```

**How delegation works:**

- `AgentBase` is a Protocol in the SDK with `__call__`, `invoke_async`, and `stream_async`. Implementing it explicitly gives type checkers and IDE autocomplete full visibility into the core agent operations.
- `__getattr__` is only invoked when normal attribute lookup fails, so `deploy()` and `destroy()` resolve directly on the wrapper, while `.name`, `.tools`, `.tool_names`, `.system_prompt`, `.cancel()`, `.add_hook()`, etc. transparently delegate to the inner agent with zero boilerplate.
- Dunder methods like `__call__` bypass `__getattr__` in Python's data model, which is why the three protocol methods are explicitly delegated.

**Note:** `isinstance(deployable, Agent)` returns `False`, but `isinstance(deployable, AgentBase)` returns `True`. Code that accepts agents generically should check `AgentBase`, not `Agent`.

### Where it lives in extensions

```
src/strands_agents_extensions/
    agents/
        __init__.py            # DeployableAgent
        _deploy/
            __init__.py        # deploy(), DeployConfig, DeployResult
            _base.py           # DeployTarget ABC
            _agentcore.py      # AgentCoreTarget implementation
            _constants.py      # Python version mapping, packaging excludes
            _packaging.py      # Entrypoint generation, code zipping
            _state.py          # StateManager, DeployState TypedDict
            _exceptions.py     # Exception hierarchy
    plugins/
        ...                    # existing plugins
    session_managers/
        ...                    # existing session managers
```

Installation via optional extra:

```bash
pip install 'strands-agents-extensions[deploy]'
```

This adds `bedrock-agentcore-starter-toolkit` and `boto3` as dependencies only when the deploy extra is requested, matching the existing pattern (`[budget]` pulls in `litellm`, `[dynamodb]` pulls in `boto3`, etc.).

### Trade-offs vs. the `strands.experimental` approach

| Dimension | `strands.experimental.deploy` (core SDK) | `DeployableAgent` wrapper (extensions) |
|---|---|---|
| **Core SDK purity** | Deploy code and cloud deps live in the agent SDK | Core SDK stays focused on agent building |
| **API ergonomics** | `deploy(agent)` standalone function | `deployable.deploy()` method on wrapper |
| **Graduation path** | Promote to `agent.deploy()` on Agent class | Wrapper is the permanent home — no graduation needed |
| **Dependency isolation** | `pip install 'strands-agents[deploy]'` | `pip install 'strands-agents-extensions[deploy]'` |
| **Works with existing agents** | Yes (standalone function takes any Agent) | Yes (wrapper takes any Agent) |
| **`isinstance` compatibility** | Agent is still Agent | `isinstance(x, AgentBase)` works, `isinstance(x, Agent)` does not |
| **Pattern consistency** | New pattern for core SDK (experimental module) | New pattern for extensions (wrapper class), but extensions already has diverse patterns |
| **Iteration freedom** | `experimental` signals instability | Extensions package is already alpha; no special signaling needed |

### Why wrapper over subclass

A subclass (`class DeployableAgent(Agent)`) was considered but the wrapper is preferred because:

- **Works with any existing Agent.** Users can wrap agents from factory functions, config loaders (`config_to_agent`), or third-party code without changing how the agent was constructed.
- **Decoupled from Agent internals.** The wrapper depends on `AgentBase` (a stable protocol), not on Agent's constructor signature. If Agent adds or changes constructor parameters, the wrapper is unaffected.
- **Consistent with composition-over-inheritance.** The extensions library uses composition throughout (plugins hook into agents, session managers are injected). A wrapper follows this philosophy.

## Follow-up items

- **Complex project layouts.** Validate and improve source capture for editable installs, custom `PYTHONPATH`, and deeply nested package hierarchies where `sys.path` manipulation may not suffice.
- **Automatic dependency detection.** Extract dependencies from `pyproject.toml` rather than requiring a separate `requirements.txt`.
- **`destroy()` as public API.** Expose teardown through the top-level module, not just the target class.
- **CLI integration.** Add a `strands deploy` CLI command for deployment outside Python scripts.
- **Multi-target validation.** Implement a second target (Lambda, ECS, or similar) to stress-test the `DeployTarget` abstraction.