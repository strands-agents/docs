# MCP Integration Beyond Tools

**Status**: Proposed

**Date**: 2026-03-30

**Issue**: https://github.com/strands-agents/sdk-python/issues?q=label%3Aarea-mcp

## Context

Strands currently treats MCP servers as tool providers. The MCP spec (2025-11-25) has grown well beyond tools — it now includes notifications, progress tracking, logging, sampling, cancellation, and more. This document lays out three options for closing that gap, with a recommendation. The goal is to get alignment on direction before implementation begins.

**Versions**: MCP spec 2025-11-25, Strands SDK v1.30.0, MCP Python SDK v1.26.0. All three options have been prototyped and adversarial-tested on branches (linked below).

---

## What Works Today

`MCPClient` is a solid tool provider. It handles tool discovery, execution, pagination, elicitation (form mode), task-augmented calls (polling long-running operations), structured content, output schemas, OpenTelemetry instrumentation, and multiple transports (stdio, SSE, Streamable HTTP). For the "use MCP servers as tools" use case, it works well.

## Gaps

The MCP Python SDK's `ClientSession` — the object that actually talks to MCP servers — accepts six callback parameters. Strands wires two of them (`elicitation_callback` and `message_handler` for error handling). The other four (`sampling_callback`, `logging_callback`, `list_roots_callback`, and `progress_callback` on `call_tool()`) are ignored.

In practice this means:

- **Server logs are silently dropped.** Every MCP server emits log messages (debug, info, warning, error). Strands' default logging callback is a no-op, so these vanish. When something goes wrong with an MCP server, debugging is difficult because server-side messages are invisible.

- **Progress is invisible.** When a tool call takes 30 seconds, the user sees nothing. The MCP SDK supports progress notifications — the server can say "50% done, processing file X" — but Strands never passes a `progress_callback` to `call_tool()`, so these updates are lost.

- **Tool list changes go unnoticed.** Some MCP servers dynamically add or remove tools based on context (e.g., auth state, project type). The server sends `notifications/tools/list_changed`, but Strands' message handler only processes exceptions. The notification falls through silently, and the agent keeps using a stale tool list until restart.

- **Servers can't request LLM completions.** The MCP spec allows servers to ask the client to generate text via `sampling/createMessage`. No production server uses this today, but the pattern is growing — it enables MCP servers that behave as agents rather than just tool providers.

- **Servers can't discover filesystem context.** `list_roots_callback` tells servers what directories the client is working with. Only filesystem and git servers use this, but for those servers, not having roots means they can't scope their operations.

There are also two bugs: `_create_call_tool_coroutine()` doesn't forward the `_meta` field from tool call arguments (breaking progress tokens and custom metadata), and `MCPToolResult` discards the `isError` flag from `CallToolResult` (making it impossible to distinguish application errors from protocol errors).

Beyond the callback gaps, there's no integrated story. MCP events don't connect to the Strands hook system. There's no config file loading (every other MCP client supports this). There's no way to map MCP elicitation to Strands interrupts. If one of five MCP servers fails to start, the entire agent crashes.

---

## The Three Options

All three options have been prototyped with working branches and tests. The core question is: how tightly should MCP integrate with the Strands agent framework?

---

### Option 1: MCP Plugin *(recommended)*

**The idea:** Create an `MCPPlugin` that takes a list of MCPClients, registers their tools, installs a unified message handler that routes MCP notifications into Strands hooks, and optionally auto-wires sampling to the agent's model. It uses the existing Plugin system — `init_agent(agent)` gives it access to the agent's registries — so there are zero changes to the Agent class itself.

**What it looks like to use:**

```python
from strands import Agent
from strands.tools.mcp import MCPClient
from strands.plugins.mcp import MCPPlugin

# Set up your MCP clients as usual
filesystem = MCPClient(transport_callable=fs_transport, prefix="fs")
github = MCPClient(transport_callable=gh_transport, prefix="github")

# Wrap them in the plugin
plugin = MCPPlugin(
    clients=[filesystem, github],
    fail_open=True,        # if github server is down, agent still starts with filesystem
    auto_sampling=True,    # if a server requests an LLM completion, use the agent's model
)

agent = Agent(
    model=my_model,
    tools=[my_local_tool],     # local tools still go in tools=
    plugins=[plugin],          # MCP integration via plugin
)
```

Or from a config file (standard format used by Claude Desktop, Cursor, VS Code):

```python
plugin = MCPPlugin.from_config("mcp.json", fail_open=True)
agent = Agent(model=my_model, plugins=[plugin])
```

The plugin does the following during `init_agent()`:
1. Iterates over each MCPClient and registers it as a tool provider with the agent's `ToolRegistry` (same behavior as `tools=[mcp_client]` today)
2. Replaces each client's message handler with a unified handler that catches `ServerNotification` objects and dispatches them as typed Strands hook events (`MCPLogEvent`, `MCPProgressEvent`, `MCPToolsChangedEvent`, etc.)
3. If `auto_sampling=True`, installs a `sampling_callback` on each client that routes sampling requests to the agent's model
4. Installs a default `logging_callback` that routes MCP server logs to Python's `logging` module
5. Installs a default `list_roots_callback` that exposes the current working directory

Users who want to react to MCP events subscribe via the hook system they already know:

```python
from strands.plugins import Plugin, hook
from strands.plugins.mcp import MCPProgressEvent

class ProgressTracker(Plugin):
    name = "progress-tracker"

    @hook
    def on_progress(self, event: MCPProgressEvent):
        print(f"[{event.server_name}] {event.progress}/{event.total}: {event.message}")

agent = Agent(plugins=[MCPPlugin(clients=[...]), ProgressTracker()])
```

**Pros:**

- *Low coupling:* The Agent class doesn't change at all. The plugin interacts with the agent through the existing `init_agent()` → `tool_registry` / `hooks` interface. If you never use `MCPPlugin`, nothing is different.
- *Good developer experience:* One plugin wraps all MCP clients. `fail_open`, `auto_sampling`, and `from_config()` handle the common cases. Hook subscription uses the same API as tool/model events. Existing `tools=[mcp_client]` code keeps working — the plugin is additive.
- *Maintainability:* When the MCP spec adds a new notification type, we add a new `case` branch in the unified message handler and a new event dataclass. No MCPClient constructor changes, no Agent changes. The marginal cost of supporting new MCP features is near-zero.
- *Effort:* Medium. The MCPEvent hierarchy is ~50 lines (dataclasses). The plugin is ~150 lines. Config loading is ~150 lines. Tests are ~200 lines. Total: ~500-600 lines of new code, all additive.
- *Shippability:* Could ship as a separate package (`strands-mcp-plugin`) for faster iteration, or in `strands.plugins.mcp` inside the SDK for discoverability.
- *Evolution path:* Naturally evolves into Option 3 (first-class citizen) by moving plugin logic into the Agent itself and adding `mcp_clients=`. The hook events and patterns stay the same.

**Cons:**

- The plugin replaces each MCPClient's `_handle_error_message` directly — effectively monkey-patching a private method. This works but isn't a clean public API. We should consider adding a proper `set_message_handler()` method to MCPClient.
- The `auto_sampling` parameter exists in the prototype but isn't fully wired (the callback skeleton is there, but the "create a sub-agent with server-provided tools" path needs more work). Should either be fully wired or removed before shipping to avoid confusing users.
- No explicit `shutdown()` or `cleanup_agent()` lifecycle method. The plugin relies on MCPClient's `ToolProvider` consumer tracking for cleanup. For long-lived agents, a more explicit teardown may be needed.

**Prototype results:** 244 tests passing. 2 bugs found and fixed (double `init_agent` causing duplicate tool registration, `null` mcpServers in config causing crash).

---

### Option 2: Wire Through (pass callbacks to MCPClient)

**The idea:** The simplest possible approach. Add the four missing callback parameters to `MCPClient.__init__()`, pass them through to `ClientSession`, and let users handle everything themselves. No hook integration, no auto-wiring, no plugin.

**What it looks like to use:**

```python
from strands.tools.mcp import MCPClient

async def my_logging(params):
    logger.info(f"[MCP] {params.level}: {params.data}")

async def my_progress(progress, total, message):
    print(f"{progress}/{total}: {message}")

async def my_sampling(context, params):
    # user calls their own LLM here
    return CreateMessageResult(role="assistant", content=..., model="...")

client = MCPClient(
    transport_callable=my_transport,
    sampling_callback=my_sampling,
    logging_callback=my_logging,
    progress_callback=my_progress,
    list_roots_callback=my_roots,
)

agent = Agent(tools=[client])  # same as today, no hook integration
```

**Pros:**

- *Minimal coupling:* Nothing changes about how MCPClient or Agent work. We're adding optional constructor parameters and forwarding them.
- *Explicit and transparent:* You can see exactly what each callback does. No magic. Power users get fine-grained control.
- *Low effort:* Wiring four callbacks is ~40 lines of actual code changes in MCPClient. Adding sensible defaults is ~15 more lines.

**Cons:**

- It doesn't compose. A user who wants logging, progress, and tool refresh must write three separate callbacks that don't know about each other. Five MCP servers × four callbacks = up to twenty callback wirings, none of which integrate with the Strands hook system.
- Every user reinvents the same patterns. "Route MCP logs to Python logging" is a ~15-line function everyone will write. "Refresh tool cache when tools change" is another ~20-line function everyone will write.
- The marginal cost per MCP feature is low but constant — each new spec feature means a new `MCPClient.__init__` parameter and documentation.

**Recommendation:** Ship the wire-through callbacks as part of any option — they're small, useful, and serve as an escape hatch for users who need direct control or want to bypass the plugin.

**Prototype results:** 260 tests passing. 1 bug found and fixed (sentinel pattern needed to distinguish "user passed `None`" from "user didn't pass anything" for the logging callback).

---

### Option 3: Full Integration (first-class `mcp_clients` on Agent)

**The idea:** Add a new `mcp_clients` parameter to `Agent.__init__()` alongside `tools=`, `hooks=`, and `plugins=`. Create an `MCPRegistry` (parallel to `ToolRegistry` and `HookRegistry`) that manages the collection of MCPClients. The Agent itself discovers server capabilities during init and wires everything — tools, notifications, sampling, logging, roots.

**What it looks like to use:**

```python
from strands import Agent
from strands.tools.mcp import MCPClient

agent = Agent(
    model=my_model,
    mcp_clients=[client_a, client_b],  # first-class parameter
    tools=[local_tool],
)
# That's it. Everything is auto-wired.
# Tools → ToolRegistry
# Notifications → HookRegistry (MCPLogEvent, MCPProgressEvent, etc.)
# Sampling → agent's model
# Logging → Python logging
# Roots → cwd
```

**Pros:**

- *Best developer experience:* Zero boilerplate. Pass MCPClients to the agent and everything works. The agent "knows" about its MCP servers natively, which opens doors for future patterns (health checks, reconnection, server listing).
- *Intentional coupling:* MCP becomes a first-class concept in the Agent, just like tools and hooks. This is the right choice if MCP is a permanent, central part of how agents interact with external systems.

**Cons:**

- Requires changes to `Agent.__init__()` — adding a parameter, import paths, and initialization logic. This is a higher-risk change that affects every user, even those who don't use MCP.
- Needs more design work around lifecycle (when do MCP sessions start/stop?), multi-agent sharing (can two agents share an MCPClient?), and backward compatibility (what about existing `tools=[mcp_client]` code?).
- Premature — we don't yet know how many users will adopt deeper MCP integration. Starting with a plugin lets us validate patterns before committing to an Agent-level API.
- Higher effort: MCPRegistry is ~200 lines, Agent changes ~50 lines touching core code, migration/backward-compat ~50 lines, heavier testing.

**Prototype results:** 114 tests passing. 1 bug found and fixed (config format detection heuristic failed on ambiguous configs).

---

## Comparison

| | Plugin (recommended) | Wire Through | Full Integration |
|---|---|---|---|
| **Changes to Agent core** | None | None | Yes — new `mcp_clients` param |
| **Coupling** | Low (Plugin interface only) | Minimal (callback params) | High (MCP in Agent init) |
| **Adding new MCP features** | New event dataclass + case branch | New constructor param per feature | New event + case branch |
| **User boilerplate** | `plugins=[MCPPlugin(...)]` | Callback per feature, per client | Zero |
| **Hook integration** | Yes, via plugin | No | Yes, native |
| **Elicitation → interrupts** | Via plugin | Manual callback | Auto |
| **Sampling → agent model** | `auto_sampling=True` | Manual callback | Auto |
| **Config file support** | `MCPPlugin.from_config()` | Separate utility function | Built into MCPRegistry |
| **Fail-open** | `fail_open=True` param | Manual try/except | Built into Agent |
| **Can ship separately** | Yes (separate package ok) | N/A (MCPClient changes) | No (Agent changes) |
| **Composable with plugins** | Yes | No | Yes |
| **Risk** | Low — additive, no core changes | Very low — small diff | Medium — touches Agent |
| **Effort** | ~500-600 lines | ~200 lines | ~800+ lines |
| **Evolution path** | Can become Full Integration | Stays as escape hatch | Final state |

---

## Patterns That Apply to Any Option

These patterns make MCP feel like a natural part of the framework rather than just plumbing. They can be built on top of any option but are easiest with Options 1 or 3 because of hook integration.

### Elicitation as Interrupts

MCP elicitation (server asks user a question) maps directly to Strands interrupts (agent pauses to ask caller a question). Form-mode elicitation becomes a form interrupt. URL-mode elicitation (for OAuth, payments) becomes a URL interrupt. The caller doesn't need to know the interrupt came from MCP — they handle it the same way they handle any interrupt:

```python
result = agent("deploy to production")

if result.stop_reason == "interrupt":
    for interrupt in result.interrupts:
        if interrupt.data["type"] == "mcp_elicitation":
            user_input = show_form(interrupt.data["schema"])
            responses.append({"interruptResponse": {
                "interruptId": interrupt.id,
                "response": user_input,
            }})
    result = agent(responses)  # resume where we left off
```

For autonomous agents, provide a policy that auto-declines elicitation (no human in the loop). For interactive UIs, this works naturally — they already handle interrupts.

### Sampling Wired to the Agent's Model

When a server requests `sampling/createMessage`, the agent uses its own model to generate the response. The 2025-11-25 spec added `tools` and `toolChoice` to sampling requests — when the server provides tools, we can create a sub-agent with those tools. This is a differentiator: other MCP clients just pass through to a raw API. Strands can provide a full agent-powered response with hooks and observability.

### Strands Agent as MCP Server (Future)

The reverse direction: expose a Strands agent as an MCP server. Claude Desktop, Cursor, VS Code could use your agent. Agent tools become MCP tools. Agent invocations become MCP tasks (long-running, with progress). This is a separate project but builds on the same patterns — MCPEvent hierarchy, task lifecycle, progress hooks.

---

## Tasks

Strands has a working task-augmented execution implementation (`mcp_tasks.py` + `mcp_client.py`). Tasks allow tool calls to run asynchronously — the server returns a task handle, and the client polls until the result is ready. This is essential for long-running operations (multi-minute code generation, data processing, deployments).

### What We Have

- **Opt-in via `TasksConfig`**: Pass `TasksConfig()` to `MCPClient` constructor to enable
- **Server capability detection**: Caches `tasks.requests.tools.call` during `session.initialize()`
- **Tool-level negotiation**: Reads `execution.taskSupport` per tool (`required`, `optional`, `forbidden`)
- **Full lifecycle**: `call_tool_as_task` → `poll_task` → `get_task_result` with timeout protection
- **Configurable TTL + poll timeout**: Defaults to 1min TTL, 5min poll timeout
- **Unit + integration tests**: Both sync and async paths covered, including edge cases (timeout, empty poll, retrieval failure)

### Gaps vs. MCP Spec (2025-11-25)

| Feature | MCP Spec | Strands Status |
|---|---|---|
| `tasks/get` (polling) | Explicit polling endpoint | ✅ Implemented |
| `tasks/result` | Retrieve final result | ✅ Implemented |
| `tasks/list` | List all active tasks | ❌ Not implemented |
| `tasks/cancel` | Cancel a running task | ❌ Not implemented |
| `notifications/tasks/status` | Push notifications for status changes | ❌ Not handled |
| `input_required` status | Task pauses waiting for user input | ❌ Not handled |
| Client-side tasks | Server creates tasks for sampling/elicitation requests | ❌ Not implemented |
| `pollInterval` respect | Server hints how often to poll | ❌ We poll as fast as the SDK yields |

### Priorities

**P1 (extend soon):**
- Handle `input_required` status — this is the bridge between tasks and elicitation (human-in-the-loop workflows)
- Respect `pollInterval` from server responses — reduces unnecessary polling overhead
- `tasks/list` — useful for observability and debugging
- `tasks/cancel` — needed for long-running tools, but not blocking anyone today

**P2 (when ready):**
- `notifications/tasks/status` — push-based status reduces polling, better UX
- Client-side task capabilities — exposing sampling/elicitation as tasks to servers

The current implementation is solid for the happy path. The main risk is that as MCP servers start using `input_required`, our client won't handle it gracefully.

---

## Configuration & Auth

### Config Sugars

The `mcpServers` JSON config format we support today handles the basics (`command`, `args`, `url`, `headers`). A few small additions would improve the developer experience:

- **Pass-through environment keys**: Let users specify env var names to forward from the host environment, instead of hardcoding values. Example: `"env": {"passthrough": ["AWS_PROFILE", "DATABASE_URL"]}` forwards those vars from the host into the stdio subprocess without exposing secrets in config files.
- **Transport defaults**: Auto-detect SSE vs. Streamable HTTP from the URL instead of requiring users to know the difference.
- **Server health/readiness**: Optional startup health check with timeout, so the agent gets a clear error rather than a hang when a server is unreachable.

### Auth

For HTTP-based transports, the MCP Python SDK already provides full OAuth 2.1 support (`OAuthClientProvider`) with PKCE, token refresh, and dynamic client registration. For stdio, servers inherit credentials from the environment.

Today, users configure auth in their transport callable — this works but requires writing Python code. Adding config-level auth would reduce boilerplate:

```json
{
  "mcpServers": {
    "enterprise-server": {
      "url": "https://my-server.com/mcp",
      "auth": {
        "type": "bearer",
        "token_env": "MY_SERVER_TOKEN"
      }
    }
  }
}
```

This is a DX improvement, not a security architecture change. The MCP SDK handles token rotation and refresh. We just need to surface the config knobs so users don't have to write custom transport callables for common patterns.

**Priority:** P1 for env passthrough (most requested), P2 for OAuth config sugar.

---

## Immediate Improvements (Ship Regardless of Option)

These are independent of which option we choose. Bug fixes, developer experience papercuts, and easy wins.

**P0 (ship immediately):**
- Fix `_meta` forwarding — 2 lines, unblocks progress tokens and custom metadata
- Fix `isError` preservation — 5 lines, proper error handling
- Default logging callback — 15 lines, route server logs to Python logging instead of dropping them
- Config file loading (`load_mcp_servers()`) — 150 lines, standard `mcpServers` JSON format that every other MCP client supports

**P1 (ship soon):**
- Graceful startup failures (`fail_open`) — 30 lines, one broken server shouldn't crash the agent
- Progress callback passthrough — 20 lines, pass `progress_callback` to `call_tool()`
- Cancellation — medium effort, `notifications/cancelled` for tool calls, `tasks/cancel` for tasks

**P2 (ship when ready):**
- ToolRetryStrategy plugin — 60 lines, follows `ModelRetryStrategy` pattern, works for all tools
- Roots passthrough — 15 lines, expose cwd to filesystem/git servers
- OAuth config — high effort, surface auth params for enterprise MCP servers

---

## What Customers Are Asking For

Based on issues in sdk-python with the `area-mcp` label:

The **most discussed** MCP topic (by far) is developer experience: config file loading and managing multiple MCP servers (issues 198, 482 — combined 8 reactions, 19 comments). Everyone who uses more than one MCP server reinvents config parsing. This is the highest-impact quick win.

The second theme is **resilience**: graceful startup failures (issue 1481) and configurable retry (issue 675). Both are marked "ready for contribution." These are practical, operational concerns — not protocol features.

**Sampling and prompts/resources** have some interest (issues 151, 765 — 14 combined reactions) but importantly: zero production MCP servers currently use sampling. The popular servers (filesystem, git, fetch, all 40+ AWS servers) use only tools. Sampling is forward-looking, not blocking anyone today.

**MCPAgent abstraction** (issue 1667) was filed by a maintainer, has zero community reactions, and depends on sampling adoption. Recommend deferring.

The **bugs** (issues 1916, 1670) are active and affect real users. Ship fixes immediately.

---

## Recommendation

1. **Ship the P0 improvements now** — bug fixes, logging default, config loader. These are useful with or without any integration option and address the most common DX complaints.

2. **Build Option 1 (MCPPlugin)** as the primary integration approach. It gives us hook integration, auto-wiring, fail-open, config loading, and composability without touching Agent core. It's the right risk/reward tradeoff given current adoption levels.

3. **Include Option 2 (wire-through callbacks) as escape hatches** inside MCPClient. Power users who want raw control or have unusual requirements can bypass the plugin.

4. **Revisit Option 3 (first-class)** once we have adoption data on the plugin. If most users end up using MCPPlugin, promoting it to a native Agent parameter is straightforward.

---

## Prototype Branches and Notebooks

All three options have been implemented and adversarial-tested:

| Option | Branch | Tests | Bugs Found/Fixed | DevX Notebook |
|--------|--------|-------|-------------------|---------------|
| Plugin | `mcp/option-c-plugin` | 244 pass | 2 found, 2 fixed | [notebook](https://gist.github.com/agent-of-mkmeral/724513721c0625bfef8569eb48150895) |
| Wire Through | `mcp/option-b-pass-through` | 260 pass | 1 found, 1 fixed | [notebook](https://gist.github.com/agent-of-mkmeral/a109acc9e128568a1f2fff14e89d389f) |
| Full Integration | `mcp/option-a-first-class` | 114 pass | 1 found, 1 fixed | [notebook](https://gist.github.com/agent-of-mkmeral/fb3c15dc0030ed2a3188ff74782e1579) |

PRs with full diffs: https://github.com/agent-of-mkmeral/sdk-python/pulls

---

## Open Questions

1. **Plugin location** — Should MCPPlugin live inside the SDK (`strands.plugins.mcp`) or as a separate package? Inside = better discoverability, separate = faster iteration.

2. **Message handler API** — The plugin monkey-patches `_handle_error_message`. Should we add a public `set_message_handler()` on MCPClient?

3. **Elicitation-as-interrupts timing** — The elicitation callback fires during tool execution (not before). The current interrupt mechanism lives on `BeforeToolCallEvent`. Bridging these needs design work. Worth doing now or deferring?

4. **OAuth** — How much should Strands handle? The MCP SDK manages transport-level auth. Do we just surface config (token endpoints, client IDs, scopes) or do we need flow management?

6. **`model-immediate-response` / task completion triggering the agent** — The MCP spec defines `io.modelcontextprotocol/model-immediate-response`, where a task completes and the result should return control to the model. This is architecturally complex: we can invoke the agent from task completion callbacks, but where does the output go? The current agent loop expects synchronous tool results. Wiring async task completion back into the agent loop requires either a message queue, a callback-to-coroutine bridge, or a fundamentally different execution model. Worth exploring but significant plumbing — treat as a future concern.

7. **Agent-as-MCP-Server** — Is this in-scope for the SDK or a separate project?

---

## Willingness to Implement

Yes — all three options are already prototyped. The recommended path (Option 1 + Option 2 escape hatches + P0 fixes) is ready for implementation based on team feedback.
