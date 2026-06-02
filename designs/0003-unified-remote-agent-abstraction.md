# Unified Remote Agent Abstraction

**Status**: Proposed

**Date**: 2026-02-10

**Issue**: [Feature] Unified Remote Agent Abstraction: MCP, A2A, and Multi-Agent Patterns

## Context

Strands Agents SDK has three overlapping ways to work with agents, and the gap between them is shrinking fast.

**Model Context Protocol (MCP)** started as a way to expose remote tools and resources. The [2025-11-25 spec](https://modelcontextprotocol.io/specification/2025-11-25) changed that — MCP servers can now do sampling (tool calling via `tools`/`toolChoice`), run durable async [tasks](https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/tasks), and request user input through [elicitation](https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation). They're behaving more like agents than tool providers.

**[Agent2Agent (A2A)](https://google.github.io/A2A/)** is a cross-platform protocol for agent-to-agent communication. A2A agents advertise capabilities via Agent Cards, accept tasks, stream responses, and manage long-running work. This overlaps heavily with MCP's new tasks and sampling features.

**Strands multi-agent patterns** ([Swarm](https://strandsagents.com/latest/user-guide/concepts/multi-agent-patterns/swarm/), [Graph](https://strandsagents.com/latest/user-guide/concepts/multi-agent-patterns/graph/), [Agents as Tools](https://strandsagents.com/latest/user-guide/concepts/multi-agent-patterns/agents-as-tools/)) work well for in-process agents but don't have a clean story for remote agents behind MCP or A2A.

The overlap:

| Capability | MCP (2025-11-25) | A2A | Strands Multi-Agent |
|---|---|---|---|
| Tool discovery | `tools/list` | Agent Card | `Agent(tools=[...])` |
| Tool execution | `tools/call` | Task send | Tool invocation |
| Async/long-running work | Tasks (SEP-1686) | Tasks with streaming | N/A (in-process) |
| Agent-to-agent delegation | Sampling + tools | Native | Swarm handoffs, Agents as Tools |
| Capability negotiation | Capabilities exchange | Agent Card | N/A |
| User interaction | Elicitation (form + URL) | N/A | N/A |
| Streaming | SSE / Streamable HTTP | SSE streaming | Native streaming |

Today, using a remote agent via MCP looks completely different from using one via A2A, and neither looks like using a native Strands agent. Developers have to learn three programming models for what is conceptually the same thing: talking to an agent.

### Existing Infrastructure

Strands already has most of the building blocks for this:

**`AgentBase` protocol** ([`strands/agent/base.py`](https://strandsagents.com/latest/documentation/docs/api-reference/python/agent/base/), line 14) — A `@runtime_checkable` Protocol that defines the minimal contract all agent types must satisfy:

```python
@runtime_checkable
class AgentBase(Protocol):
    """Protocol defining the interface for all agent types in Strands."""

    async def invoke_async(self, prompt: AgentInput = None, **kwargs: Any) -> AgentResult: ...
    def __call__(self, prompt: AgentInput = None, **kwargs: Any) -> AgentResult: ...
    def stream_async(self, prompt: AgentInput = None, **kwargs: Any) -> AsyncIterator[Any]: ...
```

The core `Agent` class implements `AgentBase`. So does anything that wants to behave like an agent in Strands.

**`A2AAgent`** ([`strands/agent/a2a_agent.py`](https://strandsagents.com/latest/documentation/docs/api-reference/python/multiagent/a2a/server/)) — A client wrapper for remote A2A agents that implements `AgentBase`. You point it at a remote A2A endpoint, and it works like any other Strands agent — `__call__`, `invoke_async`, `stream_async` all map to A2A protocol calls under the hood. It discovers the remote agent's capabilities via Agent Card, streams A2A protocol events, and converts responses into `AgentResult`. This is exactly the pattern we want to replicate for MCP.

```python
# A2AAgent already works like this today
from strands.agent.a2a_agent import A2AAgent

coder = A2AAgent("https://code.example.com")
response = coder("Write a Python function to sort a list")  # returns AgentResult
```

**MCP integration** ([`strands/tools/mcp`](https://strandsagents.com/latest/user-guide/concepts/tools/mcp-tools/)) — Connects to MCP servers and exposes their tools to a Strands agent. This treats MCP servers as tool providers, not as agents. With the 2025-11-25 spec adding sampling and tasks, MCP servers can do more than serve tools — but Strands doesn't have a way to talk to them as agents yet.

The gap: Strands has `AgentBase` as the universal agent interface, and `A2AAgent` already proves the pattern works for A2A. What's missing is an equivalent `MCPAgent` that does the same thing for MCP servers — letting you point at a remote MCP server and use it like any other Strands agent.

## Decision

Create `MCPAgent` — a new client-side agent class that implements the existing `AgentBase` protocol, following the same pattern `A2AAgent` already established.

The developer explicitly chooses the protocol (MCP or A2A) at construction time. After that, the agent satisfies `AgentBase` and works like any other Strands agent. The protocol is the transport choice, not a different programming model.

No new base class needed. `AgentBase` already defines the contract:

- `__call__(prompt, **kwargs) -> AgentResult` — synchronous invocation
- `invoke_async(prompt, **kwargs) -> AgentResult` — async invocation
- `stream_async(prompt, **kwargs) -> AsyncIterator[Any]` — streaming

`A2AAgent` already implements these three methods by translating them into A2A wire calls. `MCPAgent` does the same for MCP.

### A2AAgent (Already Implemented)

`A2AAgent` at `strands/agent/a2a_agent.py` is the reference implementation for this pattern. It takes a remote A2A endpoint, discovers the agent's capabilities via Agent Card, and maps A2A protocol concepts to `AgentBase`:

- Agent Card → capability discovery, populates `name` and `description`
- `send_message` → maps to `__call__` / `invoke_async`
- A2A streaming events (`TaskStatusUpdateEvent`, `TaskArtifactUpdateEvent`, `Message`) → maps to `stream_async`
- Response conversion → `AgentResult` via `convert_response_to_agent_result`

Key implementation details worth carrying forward to `MCPAgent`:
- Lazy agent card discovery (fetched on first use, cached after)
- `stream_async` as the core method — `__call__` and `invoke_async` both delegate to it
- Clean separation between protocol events and `AgentResult` conversion
- Configurable client factory for custom HTTP/auth setups

### MCPAgent (New)

`MCPAgent` follows the same pattern as `A2AAgent` but handles MCP-specific setup — capability exchange, transport (stdio/SSE/Streamable HTTP), auth. It maps MCP concepts to `AgentBase`:

- `tools/list` → agent's available tools
- `tools/call` → tool invocation
- Sampling with `tools`/`toolChoice` → agent delegation (the core of agent-style invocation)
- Tasks → async execution with polling
- Elicitation → user interaction passthrough

For MCP servers that only expose tools (no sampling), `MCPAgent` can still function as a tool provider — but calling it as an agent (`__call__`) raises a clear error explaining the server doesn't support sampling.

### Integration with Multi-Agent Patterns

Because both `A2AAgent` and `MCPAgent` implement `AgentBase`, they plug into all existing patterns without changes:

- **Agents as Tools**: `Agent(tools=[mcp_agent, a2a_agent])` — remote agents used as tools
- **Swarm**: `Swarm(agents=[mcp_agent, a2a_agent, local_agent])` — handoffs work across protocols
- **Graph**: Remote agents as graph nodes alongside local agents
- **Workflow**: Remote agents as DAG steps

This works because Swarm, Graph, and Agents as Tools already accept anything that satisfies `AgentBase`. `A2AAgent` already works in these patterns today — `MCPAgent` gets the same treatment for free by implementing the same protocol.

### Capability Handling

Not every remote agent supports every feature. An MCP server might only expose tools (no sampling, no tasks). An A2A agent might not support streaming.

The approach:

- Query capabilities at construction time (MCP capabilities exchange, A2A Agent Card)
- Expose capabilities via a `.capabilities` property (protocol-specific details available for inspection)
- Raise clear errors when a requested capability isn't available
- Fall back to simpler patterns when possible (e.g., tool-only MCP server → treat as tool provider, not full agent)

## Developer Experience

### Basic Usage

```python
from strands import Agent
from strands.agent.mcp_agent import MCPAgent
from strands.agent.a2a_agent import A2AAgent

# MCP agent — new, implements AgentBase
weather = MCPAgent("https://weather.example.com/mcp")

# A2A agent — already exists, implements AgentBase
coder = A2AAgent("https://code.example.com")

# Both work like any native agent — same __call__, invoke_async, stream_async
response = weather("What's the weather in Seattle?")
response = coder("Write a Python function to sort a list")

# isinstance checks work thanks to @runtime_checkable AgentBase
assert isinstance(weather, AgentBase)
assert isinstance(coder, AgentBase)
```

### Agents as Tools

```python
orchestrator = Agent(
    system_prompt="You coordinate between specialized agents.",
    tools=[weather, coder]  # Remote agents used as tools — no special handling
)

response = orchestrator("Check the weather in Seattle and write a haiku about it")
```

### Swarm with Mixed Local and Remote Agents

```python
from strands.multiagent import Swarm

local_agent = Agent(system_prompt="You handle general questions.")

swarm = Swarm(agents=[weather, coder, local_agent])
response = swarm("What's the weather like? Also, write me a sort function.")
```

### Async and Streaming

```python
# Async invocation — same interface as Agent
result = await weather.invoke_async("7-day forecast for Seattle")

# Streaming — same interface as Agent
async for event in coder.stream_async("Write a merge sort implementation"):
    if "data" in event:
        print(event["data"], end="")
```

### Checking Capabilities

```python
weather = MCPAgent("https://weather.example.com/mcp")

if weather.capabilities.supports_tasks:
    # Server supports MCP tasks — could do long-running async work
    pass

if weather.capabilities.supports_sampling:
    # Server supports sampling — full agent-style invocation works
    result = weather("Generate a 7-day forecast")
else:
    # Tool-only server — use tools directly
    result = weather.tools["get_forecast"](location="Seattle")
```

### Error Cases

```python
# MCP server that only exposes tools, no sampling
tools_only = MCPAgent("https://tools.example.com/mcp")

# This works — direct tool access
result = tools_only.tools["calculator"](expression="2+2")

# This raises a clear error — server doesn't support agent-style invocation
try:
    result = tools_only("What is 2+2?")
except UnsupportedCapabilityError as e:
    # "MCPAgent at https://tools.example.com/mcp does not support sampling.
    #  Available capabilities: tools. Use .tools[] for direct tool access."
    print(e)
```

## Alternatives Considered

### New `RemoteAgentBase` abstract base class
An ABC sitting between `AgentBase` and the protocol-specific classes, adding methods like `as_tool()` and a `capabilities` property. Rejected because `AgentBase` already defines the right contract — `A2AAgent` proves this works without an intermediate layer. Protocol-specific capabilities can live on the concrete classes without a shared ABC.

### Single `RemoteAgent` class with auto-detection
A single class that auto-detects the protocol from the URL. Rejected because:
- Protocol detection is fragile and ambiguous
- Developers should know which protocol they're using — it affects auth setup, configuration, and debugging
- Explicit is better than implicit
- `A2AAgent` and `MCPAgent` as separate classes is already clean and intuitive

### Keep MCP and A2A as separate, unrelated integrations
The status quo for MCP. Each protocol has its own API surface, its own patterns, its own docs. Rejected because:
- `A2AAgent` already shows the better path — MCP should follow the same pattern
- Multi-agent patterns can't mix local and remote MCP agents cleanly today
- Developers learn different programming models for what is conceptually the same thing

### Protocol-agnostic wrapper that hides everything
A thick abstraction layer that completely hides MCP and A2A behind a generic interface. Rejected because:
- Protocol-specific configuration (auth, transport) still matters at setup time
- Debugging requires knowing which protocol is in use
- Leaky abstractions are worse than thin ones

## Consequences

**What gets easier:**
- Using remote MCP agents in multi-agent patterns — they become just agents that satisfy `AgentBase`, same as `A2AAgent`
- Switching between MCP and A2A for a given remote service — change the class, keep the rest
- Adding new protocols in the future — implement `AgentBase`, follow the `A2AAgent` pattern
- Teaching developers — one agent concept, multiple transports

**What gets harder:**
- Accessing MCP-specific features that don't map to `AgentBase` (escape hatches needed on `MCPAgent`)
- `MCPAgent` needs maintenance as the MCP spec evolves
- Testing requires mocking at the protocol level

## Open Questions

1. **Tool-only MCP servers**: Should `MCPAgent` for a tool-only server still satisfy `AgentBase`? Or should it raise at construction time if sampling isn't available? Leaning toward: construct successfully, raise on `__call__` if sampling isn't supported, since the tools are still useful.
2. **Capability evolution**: As MCP and A2A specs evolve, how do we version capability checks? The `capabilities` property needs a stable shape that can grow without breaking.
3. **Streaming event shape**: `A2AAgent.stream_async` yields A2A-specific events (`A2AStreamEvent`) before the final `AgentResultEvent`. Should `MCPAgent` follow the same pattern with MCP-specific events, or should both converge on a shared event shape?

## References

- [Strands `AgentBase` Protocol](https://strandsagents.com/latest/documentation/docs/api-reference/python/agent/base/) — `strands/agent/base.py`
- [Strands `Agent` Class](https://strandsagents.com/latest/documentation/docs/api-reference/python/agent/agent/) — `strands/agent/agent.py`
- [Strands `A2AAgent` (Server Adapter)](https://strandsagents.com/latest/documentation/docs/api-reference/python/multiagent/a2a/server/) — `strands/agent/a2a_agent.py`
- [MCP 2025-11-25 Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP 2025-11-25 Changelog](https://modelcontextprotocol.io/specification/2025-11-25/changelog)
- [MCP Tasks Specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/tasks)
- [MCP Sampling Specification](https://modelcontextprotocol.io/specification/2025-11-25/client/sampling)
- [MCP Elicitation Specification](https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation)
- [MCP Tools Specification](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
- [A2A Protocol Specification](https://google.github.io/A2A/)
- [A2A GitHub Repository](https://github.com/google/A2A)
- [Strands Agents SDK — Multi-Agent Patterns](https://strandsagents.com/latest/user-guide/concepts/multi-agent-patterns/)
- [Strands Agents SDK — Swarm](https://strandsagents.com/latest/user-guide/concepts/multi-agent-patterns/swarm/)
- [Strands Agents SDK — Graph](https://strandsagents.com/latest/user-guide/concepts/multi-agent-patterns/graph/)
- [Strands Agents SDK — Agents as Tools](https://strandsagents.com/latest/user-guide/concepts/multi-agent-patterns/agents-as-tools/)
- [Strands Agents SDK — MCP Integration](https://strandsagents.com/latest/user-guide/concepts/tools/mcp-tools/)
- [Strands Agents SDK — A2A Integration](https://strandsagents.com/latest/user-guide/concepts/multi-agent-patterns/a2a/)
- [Strands SDK Python GitHub](https://github.com/strands-agents/sdk-python)

## Willingness to Implement

Yes
