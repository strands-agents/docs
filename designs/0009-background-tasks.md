# Background Tasks: Async Dispatch for Strands Agents

**Status:** Proposed
**Date:** 2026-04-27
**Author:** Gautam Sirdeshmukh
**Scope:** TypeScript SDK. Python SDK parity to follow.

---

**Contents:** [Problem](#problem) · [Proposal](#proposal) · [Unlocks](#unlocks) · [Design Alternatives](#design-alternatives) · [Extension to Agent Harness](#extension-to-agent-harness) · [Appendix A: Conversation Trace](#appendix-a-conversation-trace) · [Appendix B: Prior Art](#appendix-b-prior-art) · [Appendix C: Landscape](#appendix-c-landscape) · [Appendix D: Background Tasks vs Graph vs Swarm vs CTE](#appendix-d-background-tasks-vs-graph-vs-swarm-vs-cte) · [Appendix E: Toward Interactive Background Agents](#appendix-e-toward-interactive-background-agents)

---

## Problem

Strands is built around the core concept of giving the agent capabilities but letting the model decide how to use them. That philosophy, however, does not extend to execution. The agent loop is synchronous: each cycle, the model calls tools, then waits, unable to reason or make follow-up calls until every result in that round returns.

*The model can decide what to do, but not when. New work always waits for old work to finish, even when the two are unrelated.*

### The agent is blocked while tools are running

A 30-second API call means the agent idles for 30 seconds. A 15-minute MCP tool running a deep research pipeline blocks the agent for the full 15 minutes — whether or not the result is needed before moving on. The agent has no way to make progress on anything else while it waits.

### The model has no control over concurrency

Every concurrency option in Strands requires developer configuration. If the model determines mid-reasoning that two tasks are independent, it has no way to dispatch them and keep reasoning while they run. ConcurrentToolExecutor helps — it drops latency from sum(tools) to max(tools) — but the developer decides what runs concurrently, not the model, and the agent still blocks until the batch completes.

### Unrelated tasks block each other

If task A finishes in 2 seconds and task B takes 30, the model cannot act on A's result until B also completes — even if A and B have nothing to do with each other. A completed result should be actionable the moment it arrives.

---

## Proposal

Background Tasks give the model control over *when* work runs, not just *what*. A single `background()` tool lets the model dispatch work, keep reasoning, and react to results as they arrive:

| Action | Example | Description |
|--------|---------|-------------|
| dispatch | `background({ action: "dispatch", tool: "search_web", args: { query: "..." } })` | Dispatch work, receive a task ID immediately |
| get | `background({ action: "get", taskId: "..." })` | Check task status (polling is never required — results are injected automatically) |
| cancel | `background({ action: "cancel", taskId: "..." })` | Cancel a running task |

Anything the model can already call can be dispatched as a background task:

| Target | Example |
|--------|---------|
| Tool | `background({ action: "dispatch", tool: "search_web", args: { query: "..." } })` |
| Agent-as-tool | `background({ ..., tool: "research_agent", args: { input: "..." } })` |
| MCP tool | `background({ ..., tool: "mcp_tool_name", args: { ... } })` |
| Graph / Swarm | `background({ ..., tool: "pipeline", args: { input: "..." } })` |
| Remote agent (A2A) | `background({ ..., tool: "remote_agent", args: { input: "..." } })` |
| Dynamic agent (use_agent) | `background({ ..., tool: "use_agent", args: { prompt: "...", tools: [...] } })` |
| Any callable | `background({ ..., tool: "x", args: { ... } })` |

The model keeps reasoning and dispatching more work as needed. As results come in, they are delivered as tagged messages appended to the conversation, not as `tool_result` blocks. The dispatch returns a task ID as a normal `tool_result` (satisfying the provider API's synchronous pairing requirement), and the actual result arrives later as a separate message tagged with the originating tool and task ID. The model sees them at the start of its next turn. The tool definition instructs the model to continue working without fabricating results for dispatched tasks.

Background results are subject to the same context window limits and compaction behavior as any other conversation content. Proactive strategies — structured output on sub-agents to reduce result size, batching closely-completing results into a single injection, or queuing results when the context is near capacity — can mitigate this further.

This is the entire model-facing interface. No changes to the agent loop. No system prompt augmentation required. See Design Alternatives for [result delivery](#result-delivery-strategy) and [tool shape](#separate-tools-instead-of-one) alternatives.

---

## Unlocks

### The model is never idle

Work runs in the background while the model keeps reasoning. A coordinator dispatches 4 researcher agents and immediately moves on to structuring its report outline; when results arrive, they slot into a framework the model has already prepared.

### The model drives its own concurrency

The model can parallelize work at runtime without the need for a ConcurrentToolExecutor, Graph, or any developer-configured infrastructure. Given "research these 5 topics," it dispatches all 5 at once and they begin executing concurrently.

### Results are actionable the moment they arrive

Each completed task flows back to the model independently — a fast result is no longer held up by a slow one. The model can incorporate early results, cancel tasks that are no longer needed, and dispatch follow-up work without waiting for the full batch.

### Anything callable can become an async background process

Tools, agents, MCP tools, Graph pipelines, Swarms, remote A2A agents... if the model can call it, it can background it. No special wrappers, no separate APIs. One mechanism for everything.

---

## Design Alternatives

### Config-based (`backgroundTools`)

The developer declares which tools run in the background at construction time. The model calls tools normally — the SDK intercepts calls to background-listed tools and handles them asynchronously:

```typescript
// Developer configuration
const agent = new Agent({
  tools: [quickLookup],
  backgroundTools: [searchWeb, analyzeData],
})

// Model calls searchWeb as usual — the SDK backgrounds it automatically
```

| Pros | Cons |
|------|------|
| Developer controls which tools are safe to background (stateful tools, side effects) | Developer decides what's backgroundable, not the model — no per-conversation flexibility |
| No additional tool in the model's schema | A tool is always background or always foreground — can't adapt at runtime |
| Model can't misuse it — only pre-approved tools run in the background | Two tool lists to maintain; overlap between them creates ambiguity |
| Simpler model behavior — fewer failure modes (no hallucinated results, no polling loops) | Requires system prompt augmentation so the model understands async results |
| | Conflicts with the core Strands principle of letting the model drive decisions |

### Per-tool config

Instead of a meta-tool or a separate list, the background property lives on each tool definition. The model still calls tools normally — the SDK checks the per-tool config and backgrounds the call automatically.

```typescript
const agent = new Agent({
  tools: [
    quickLookup,
    { tool: searchWeb, background: true },
    { tool: analyzeData, background: true },
  ],
})
```

| Pros | Cons |
|------|------|
| Single source of truth — each tool's config in one place, no duplicate lists | Introduces a wrapper object into the tools array that every consumer must handle |
| Extensible — the wrapper could carry other per-tool options (TTL, priority) | Developer decides, model can't adapt at runtime |
| No overlap ambiguity — a tool can't appear in both lists | Changes the shape of the tools array, which is currently a flat list across the SDK |
| Could default to `false` and let developers opt in per-tool | The model still has no say in what gets backgrounded |

### Separate tools instead of one

Instead of a single `background()` tool with an `action` parameter, the interface could be split into three dedicated tools: `background()` for dispatch, `getTask()` for status, and `cancelTask()` for cancellation.

| Pros | Cons |
|------|------|
| Each tool has a focused schema — simpler for the model per-call | Three tools in the registry instead of one |
| Matches the MCP Tasks protocol shape (`tasks/get`, `tasks/cancel`) | Model must discover and learn three tools instead of one |
| No `action` parameter to misuse | More surface area to maintain |

Either shape works. We propose the single-tool approach because it keeps the registry minimal and the model only needs to learn one tool name.

### Result delivery strategy

The proposal delivers results as tagged messages in the conversation. Other frameworks take different approaches:

| Strategy | Pros | Cons |
|----------|------|------|
| Tagged message injection (this proposal) | No history mutation; simple to implement; model sees results at clean turn boundaries | Model must learn from tool definition that results arrive as messages, not `tool_result` blocks |
| Retroactive `tool_result` (Mastra) | Natural for the model — standard tool pairing, no new patterns to learn | Mutates conversation history after the model has already reasoned past that point; if compaction removes the original `tool_use`, the retroactive result has nothing to pair with; provider validation risks |
| Explicit polling (LangChain) | Zero hallucination risk — model actively retrieves results | Token overhead from repeated status checks; wasted model calls when results aren't ready |
| Status + auto-notification (Claude Agent SDK) | Clear "async_launched" signal reduces hallucination; model can poll or wait | More complex — requires both notification infrastructure and polling tools |

### Model-unaware async

The following is not an alternative to Background Tasks but a complementary approach for a different use case.

The model calls a tool normally. Behind the scenes, the framework intercepts the result, releases the agent process, and waits for the external work to complete. The agent is re-invoked when ready, and the result is injected as if the tool ran synchronously. The model never knows anything was async.

This is the approach taken by the [Strands Durability Plugin (SARK)](https://sark-docs.beta.harmony.a2z.com/sdo-strands-durability-plugin/developer-guide/async-execution). SARK's interrupt-based session release is more applicable to the durable task phase than to the ephemeral mechanism proposed here.

| Pros | Cons |
|------|------|
| Zero model complexity — no new tools, no async semantics to learn | Model cannot dispatch multiple tasks concurrently |
| Releases compute during long waits — no idle GPU/container | Model cannot reason about partial results as they arrive |
| No risk of hallucinated results or polling loops | Only suited for single long-running tasks, not parallel workloads |
| Works with any existing tool without modification | Requires platform-level re-invocation infrastructure |

**This approach is complementary, not competing.** `background()` keeps the model productive while multiple tasks run. Model-unaware async releases compute when the model has nothing else to do. In a managed deployment, both compose: the model dispatches background tasks, and the platform releases compute while waiting for results.

---

## Extension to Agent Harness

Background Tasks as proposed are ephemeral: in-process, tracked in memory, scoped to the agent's lifetime. If the agent process dies, the tasks die with it. This is acceptable for interactive sessions and short-lived agentic workflows, but does not scale for long-running production tasks. 

The path from ephemeral to *durable* requires three things: isolated execution (so tasks outlive the agent process), persistent state (so the agent can resume), and an external task store (so task metadata survives). This is what an agent harness provides.

### Ephemeral background tasks

The base-level mechanism. Tracked in memory, scoped to the agent's lifetime, no infrastructure required. Ships as part of this proposal.

### Durable background tasks

The model calls the same `background()` tool. What changes is the infrastructure underneath. Tasks run outside the agent process and survive process death. The agent can resume from where it left off, and task metadata persists across sessions.

Durable background tasks enable fire-and-forget: the agent can dispatch work, exit, and pick up results on its next invocation. They also open the door to ambient, long-running processes — background agents that persist across sessions, react to events, and operate alongside the main agent over extended timeframes.

Two efforts already in progress provide the foundation: the Sandbox abstraction (PR #681) provides isolated execution environments, and the checkpointing mechanism (PR #2190) enables agent state persistence and resumption.

The durable interface maps directly to the MCP Tasks protocol:

| MCP Tasks | Durable background tasks |
|-----------|--------------------------|
| Task-augmented request → `CreateTaskResult` | `background({ action: "dispatch", ... }) → taskId` |
| `tasks/get(taskId)` → status | `background({ action: "get", taskId: "..." })` |
| `tasks/result(taskId)` → output | Result auto-injected into conversation |
| `tasks/cancel(taskId)` | `background({ action: "cancel", taskId: "..." })` |
| States: `working`, `completed`, `failed`, `cancelled` | Same |

### Recommended order of implementation

Ephemeral background tasks deliver the core value — model-driven parallelism, background tools, background agents — with no infrastructure dependencies. Durable background tasks are the natural next step, layering on top as the Sandbox and checkpointing work matures.

For the path from background agents to full interactive agents, see [Appendix E](#appendix-e-toward-interactive-background-agents).

| Capability | Ephemeral | Durable |
|------------|-----------|---------|
| No infrastructure required | ✓ | ✗ |
| Tasks run while agent works | ✓ | ✓ |
| Agent can check on tasks | ✓ | ✓ |
| Results injected automatically | ✓ | ✓ |
| Tasks survive crashes | ✗ | ✓ |
| Fire-and-forget | ✗ | ✓ |
| Tasks visible across sessions | ✗ | ✓ |
| MCP Tasks protocol compatibility | ✗ | ✓ |

---

## Appendix A: Conversation Trace

A mixed turn — the model calls one foreground tool and dispatches one background task in the same turn.

```
Turn 1:
  [user]       "Search for agentic AI trends and calculate our current metrics"

Turn 2:
  [assistant]  tool_use: background({ action: "dispatch", tool: "search_web",
                                      args: { query: "agentic AI trends" } })
               tool_use: calculateMetrics({ quarter: "Q2" })

  [tool_result] background → { taskId: "t-1", status: "working" }
  [tool_result] calculateMetrics → "Revenue: $4.2M, Growth: 18%"

Turn 3:
  [assistant]  "Metrics show $4.2M revenue with 18% growth. Search results
               are on the way — I'll incorporate them when they arrive."

  ← search_web completes →

  [message]    { tool: "search_web", taskId: "t-1", status: "completed",
                 result: "1. Multi-agent orchestration gaining traction..." }

Turn 4:
  [assistant]  "The search results are in. Based on both the metrics and
               the trends, here's my analysis..."
```

The model reasons about the foreground result immediately (Turn 3), then incorporates the background result when it arrives (Turn 4). The tagged message lets the model correlate the result to its original dispatch.

---

## Appendix B: Prior Art

Several implementations validate the core pattern of async dispatch for Strands agents:

**[async-agentic-tools](https://github.com/mikegc-aws/async-agentic-tools)** (mikegc-aws) — ~320 lines of Python. A `@tool_async` decorator wraps any Strands tool, dispatches it to a thread pool, and returns a task ID immediately. An `AsyncAgent` wrapper handles result delivery via callbacks. Proves the pattern works today with minimal code, though the developer decides which tools are async (decorator-based), not the model.

**[containerized-strands-agents](https://mkmeral.github.io/containerized-strands-agents/)** (mkmeral) — An MCP server that dispatches agents into Docker containers. Uses a task-based lifecycle (`send_message → taskId`, status polling, cancellation) that mirrors the MCP Tasks protocol pattern. Validates the durable dispatch model and the protocol alignment described in this proposal.

---

## Appendix C: Landscape

How other agent frameworks handle async and concurrent execution, as of April 2026. Ordered from least to most capable in background dispatch.

| Capability | CrewAI | AutoGen | Google ADK | OpenAI Agents SDK | LangChain (Deep Agents) | Mastra | Claude Agent SDK | Strands (this proposal) |
|---|---|---|---|---|---|---|---|---|
| Model dispatches tasks and keeps reasoning | No | No | No | No | Yes (subagents) | Yes | Yes | Yes |
| Results delivered incrementally as tasks complete | No | No | No | No | Yes (on-demand fetch) | Yes | Yes (auto + polling) | Yes (auto) |
| Parallel tool execution within a turn (model blocked) | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes (ConcurrentToolExecutor) |
| Any callable can be backgrounded through one mechanism | — | — | — | — | Subagents only | Tools + agents-as-tools | Subagents + Bash + Monitor (separate mechanisms) | Yes |
| Model can inspect/cancel background tasks | No | No | No | No | Yes (check + cancel + update) | No | Yes (TaskOutput + TaskStop) | Yes |

Background dispatch is an emerging capability. LangChain's Async Deep Agents, Mastra, and the Claude Agent SDK each offer forms of it, but scoped to specific target types or through separate mechanisms per target. Strands' `background()` is the only proposal where a single tool handles async dispatch for any callable — tools, agents, MCP, Graph, Swarm, and A2A.

Mastra shipped background tools on April 15, 2026, using per-tool config with LLM override (`_background` field in tool args) and result injection via `addToolResult()`. The Claude Agent SDK supports background subagents (`background: true` on `AgentDefinition`), background Bash commands, and a Monitor tool — each through its own mechanism. LangChain's `AsyncSubAgentMiddleware` provides `launch_async_subagent`, `check_async_subagent`, `cancel_async_subagent`, and notably `update_async_subagent` for mid-flight steering — a capability not yet proposed for Strands.

---

## Appendix D: Background Tasks vs Graph vs Swarm vs CTE

Background Tasks, Graph, Swarm, and ConcurrentToolExecutor all enable concurrent work, but they solve different problems and operate at different levels.

| | Background Tasks | ConcurrentToolExecutor | Graph | Swarm |
|---|---|---|---|---|
| **Who decides what runs in parallel** | The model | The developer | The developer | N/A — sequential by design |
| **Model blocked while tasks execute** | No | Yes — waits for all tools in the batch | Yes — waits for each layer to complete | Yes — each agent runs to completion before handoff |
| **Topology** | Emergent — model dispatches based on context | Flat — all tools in a turn run together | Fixed DAG defined by the developer | Sequential — model hands off to one agent at a time |
| **Orchestration overhead** | Model called as results arrive (batching possible) | None | None | Model call at each handoff |
| **Advantage over Background Tasks** | — | Zero overhead — no extra model calls | Fastest option for fixed pipelines | Model picks the right specialist per step |
| **Limitation vs Background Tasks** | — | Model can't react until entire batch completes | Pipeline can't adapt at runtime | No concurrent execution — strictly sequential |

These mechanisms are not mutually exclusive — they get stronger in combination. A Graph pipeline dispatched as a background task gets both: the Graph engine's throughput internally, and non-blocking execution externally.

---

## Appendix E: Toward Interactive Background Agents

This proposal covers dispatch and result delivery: the model backgrounds a task, the task runs, the result comes back. This is sufficient for tools, pipelines, and agent-as-tool invocations where the work is self-contained.

Full interactive background agents — ongoing message passing between the coordinator and a running agent, mid-flight steering ("focus on European markets instead"), persistent agent sessions that survive across invocations — are a natural extension but out of scope for this proposal. LangChain's `update_async_subagent` demonstrates this pattern. The `background()` mechanism provides the foundation; interactive communication is a separate layer on top.
