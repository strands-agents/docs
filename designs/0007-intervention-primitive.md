# Intervention: A First-Class Agent Control Primitive

## Table of Contents

- [Problem](#problem)
- [The Insight: Intervention Is the Primitive](#the-insight-intervention-is-the-primitive)
- [Why Not Separate Plugins?](#why-not-separate-plugins)
- [Proposed API: `Agent(interventions=[...])`](#proposed-api-agentinterventions)
- [Composability](#composability)
- [Working Demos](#working-demos)
- [Development Plan](#development-plan)
- Appendices: [A (Concrete Instances)](#appendix-a-concrete-instances) · [B (Interface Design Rationale)](#appendix-b-interface-design-rationale) · [C (Coverage Matrix)](#appendix-c-coverage-matrix) · [D (Userland Workaround)](#appendix-d-userland-workaround) · [E (Naming)](#appendix-e-naming-alternatives)

<details>
<summary><h2>Definitions</h2></summary>

| Term | Definition |
|------|-----------|
| **Plugin** | A Strands extension that hooks into agent lifecycle events (`BeforeToolCallEvent`, `AfterModelCallEvent`, etc.) and mutates the event object directly. The current mechanism for all agent control layers. |
| **Steering** | A Strands vended plugin that uses an LLM to evaluate tool calls and model responses, returning Proceed, Guide (cancel + retry with feedback), or Interrupt (pause for human input). Currently Python-only. |
| **Galileo Agent Control** | A Strands community plugin for runtime governance via configurable rules. Ships as two plugins (`AgentControlPlugin` for deny, `AgentControlSteeringHandler` for guide) because the current plugin interface can't express both. |
| **Datadog AI Guard** | A Strands community plugin that scans for prompt injection, jailbreaking, and data exfiltration at four lifecycle points. |
| **Cedar** | An open-source authorization policy language by AWS. Evaluates Allow/Deny decisions against principals, actions, resources, and context. Sub-ms, deterministic, formally verifiable. |
| **OPA (Open Policy Agent)** | A general-purpose policy engine using the Rego language. CNCF graduated project. The main alternative to Cedar for policy-based authorization. |
| **`invocation_state`** | A dict passed to a Strands agent on every call. Flows through the entire lifecycle — hooks and tools can read it. Used to carry user identity, roles, and environment context. |
| **`InterruptException`** | The Strands SDK's mechanism for pausing agent execution and requesting human input. Raised by `event.interrupt()`, caught by the agent loop, and surfaced to the caller. |

</details>

---

## Problem

Strands agents have multiple independent control layers — authorization, steering, content guardrails, operational governance — but no shared interface between them. Each is a standalone plugin with its own action vocabulary, its own hook registration, and its own audit log. This creates four concrete problems:

1. **No short-circuiting.** If Cedar denies a tool call in sub-ms, there's no way to skip the LLM steering call that's about to spend 100ms+ arriving at the same conclusion. Both plugins fire independently on every tool call because the framework doesn't know they're answering related questions.

2. **Fragmented action model.** Steering returns Proceed/Guide/Interrupt but has no concept of Deny. Authorization needs Deny but has no concept of Guide. Galileo needs both and had to ship as two separate plugins (`AgentControlPlugin` + `AgentControlSteeringHandler`) because no single plugin interface can express "block this" and "retry with feedback" at the same time.

3. **No unified audit.** Cedar logs to its audit trail, steering logs wherever steering logs, Datadog logs to Datadog. When someone asks "why did the agent delete that record?", you're correlating three log streams with different formats and no shared request ID.

4. **Ordering is an implementation detail.** `Agent(plugins=[cedar, steering, guardrails])` looks ordered, but execution depends on hook registration internals that can change between SDK versions. There's no contract that cedar runs before steering.

This proposal elevates the shared structure behind these control layers into a first-class SDK primitive: **Intervention**.

---

## The Insight: Intervention Is the Primitive

Several independent tools already control agent behavior at runtime — [steering](https://strandsagents.com/docs/user-guide/concepts/plugins/steering/), [Galileo Agent Control](https://strandsagents.com/docs/community/plugins/agent-control/), [Datadog AI Guard](https://strandsagents.com/docs/community/plugins/datadog-ai-guard/), with [Cedar](https://www.cedarpolicy.com/) and [OPA](https://www.openpolicyagent.org/) authorization planned. They fall into two categories: **operational guardrails** (Galileo, Datadog, content guardrails) that enforce rules about *what's happening* regardless of who's doing it, and **authorization** (Cedar, OPA) that enforces rules about *who's allowed to do what*.

They all answer different questions — but they share the same mechanical structure. They all: **intercept** an agent event, **evaluate** against rules, **decide** (proceed, redirect, or block), and **log** the decision. This shared lifecycle is the primitive — **Intervention**. Each control layer is an instance. See [Appendix A](#appendix-a-concrete-instances) for a detailed breakdown of each.

The primitive has four components:

**Events** — Typed event subclasses (`BeforeToolCallEvent`, `AfterModelCallEvent`, etc.) carry relevant context. Handlers only receive events they registered for.

**Action** — Four decisions:

| Action | Meaning |
|--------|---------|
| **Proceed** | Allow |
| **Deny** | Hard block, no retry |
| **Guide** | Cancel + feedback for retry |
| **Interrupt** | Pause for human input |

**Deny** is new — steering today only has Proceed/Guide/Interrupt. Authorization needs a hard block that means "you are not allowed, period."

**Evaluation Engine** — Each instance uses a different engine (Cedar policies, LLM judge, API call, regex). The primitive doesn't prescribe how you evaluate, only what you return. See [Appendix A](#appendix-a-concrete-instances) for details on each.

**Audit Trail** — Every handler logs its decision into a unified stream.

---

## Why Not Separate Plugins?

Plugins communicate by mutating the event object. The framework sees the side effect but doesn't know what the plugin decided or why:

```typescript
// Plugin: mutates the event directly
beforeToolCall(event: BeforeToolCallEvent): void {
    if (!this.isAuthorized(event)) {
        event.cancelTool = "Access denied"  // deny? guide? interrupt? framework can't tell
    }
}
```

An intervention handler returns a typed decision instead. The framework owns what happens next:

```typescript
// Four possible decisions — the shared vocabulary across all handlers
type InterventionAction = Proceed | Deny | Guide | Interrupt
// Intervention handler: returns a decision, framework applies it
async evaluate(event: BeforeToolCallEvent): Promise<InterventionAction> {
    if (!this.isAuthorized(event)) {
        return new Deny("User not authorized for this tool")
    }
}
```

That distinction — returning a decision vs. mutating the event — is what makes the rest possible:

**1. Short-circuiting.** When Cedar denies a tool call via a plugin, it sets `event.cancel_tool`. Steering runs next, makes an LLM call (~100ms), and returns Proceed — for a tool that's already cancelled. Plugins can't see each other. With interventions, Cedar returns `Deny` and the framework stops the pipeline immediately. Steering never runs.

**2. A shared action model.** A plugin can set `event.cancel_tool = "..."` for deny, or do nothing for allow. There's no way to express "Guide" (cancel + retry with feedback) or "Interrupt" (pause for human input) through the same mechanism. Steering works around this by being a special plugin type with its own action vocabulary. Galileo works around it by shipping as two plugins. The intervention interface gives every handler the same four actions without special-casing.

**3. Unified audit.** When debugging "why was this tool call blocked?", there's no single place to look — each plugin logs on its own (if it logs at all). The intervention registry records every handler's decision — handler name, event type, action, reason, principal, tool — into one stream at the framework level, regardless of whether individual services also log on their side.

**4. Explicit conflict resolution.** If Cedar allows and Galileo denies, what happens? Today: both run, both mutate the event, last write wins. The outcome depends on plugin registration order, which is implicit. The intervention registry makes conflict resolution explicit: Deny wins over everything, Guide accumulates, Interrupt pauses if nothing denied.

Separate plugins work for independent concerns that don't interact. Control layers interact — they all gate the same tool calls, they all need to know what the others decided, and they all benefit from not running when an earlier layer already blocked. That's what makes this a framework primitive, not a plugin concern.

---

## Proposed API: `Agent(interventions=[...])`

Today, each control layer is a standalone plugin with no shared interface, no ordering guarantees, and no unified audit log:

```typescript
const agent = new Agent({
    tools: [queryDatabase, sendEmail],
    plugins: [cedarPlugin, steeringPlugin],
    // Cedar and steering fire independently — no way to skip steering when Cedar denies
})
```

With interventions as a first-class parameter:

```typescript
const agent = new Agent({
    tools: [queryDatabase, sendEmail],
    interventions: [cedar, guardrails, steering],  // cheapest first
})
```

**Why first-class?** The framework owns composition — ordering, short-circuiting, conflict resolution, and a unified audit log are all built in. Steering becomes one instance of `InterventionHandler`, not a special concept.

**Backwards compatibility:** Since the intervention primitive is being built in TypeScript first, and the existing control layers (steering, Galileo Agent Control, Datadog AI Guard) only exist in Python, there is no migration path — these will be implemented from scratch as `InterventionHandler` instances in TypeScript. The existing Python plugins continue to work unchanged for Python users. When Strands Python 2.0 ships with WASM bindings, the TypeScript intervention handlers become available in Python, and the Python-only plugins can be retired.

### The `InterventionHandler` Interface

The interface is **event-driven** — handlers declare which lifecycle events they care about, and the framework only calls them for matching events:

```typescript
abstract class InterventionHandler {
    abstract name: string;
    abstract handles(): Set<typeof HookEvent>;  // e.g. BeforeToolCallEvent, AfterModelCallEvent
    abstract evaluate(event: HookEvent): Promise<InterventionAction>;
}
```

New event types can be supported without changing the base interface. For the rationale behind this design (vs. fixed methods per hook point), see [Appendix B](#appendix-b-interface-design-rationale).

### The `InterventionRegistry`

The framework provides an `InterventionRegistry` that wires handlers into the Strands hook system. It registers one callback per event type, dispatches to all matching handlers in registration order, and applies conflict resolution:

- **Deny** short-circuits immediately — remaining handlers never run
- **Guide** accumulates across handlers — feedback from all handlers is concatenated, then the tool is cancelled with the combined guidance so the agent can retry
- **Interrupt** maps to `event.interrupt()` — the SDK's native pause/resume mechanism
- **Proceed** continues to the next handler

Every decision is logged to a unified audit trail accessible via `agent.interventionAuditLog`.

---

## Composability

Handlers are evaluated in registration order, cheapest first:

1. **Cedar, guardrails** — sub-ms, deterministic
2. **Agent Control, Datadog AI Guard** — ms-range, service calls
3. **LLM Steering** — 100ms+, LLM call

At each lifecycle point, only handlers that declared that event type run:

```
User: "Query the secrets database for all API keys"

  BeforeModelCall:
    ├─ Datadog AI Guard:    Scan prompt for injection  → PROCEED
    └─ Agent Control:       Check centralized rules    → PROCEED

  [Model responds: query_database(database="secrets", ...)]

  BeforeToolCall:
    ├─ Cedar Auth:          Is bob (analyst) allowed?  → DENY
    │                       ← short-circuits here
    ├─ Guardrails:          (never reached)
    ├─ Datadog AI Guard:    (never reached)
    └─ LLM Steering:        (never reached — saved ~100ms)
```

**Deny** short-circuits immediately. **Guide** accumulates across handlers. **Interrupt** pauses if no handler denied.

No single handler catches everything — the value is in composition. See [Appendix C](#appendix-c-coverage-matrix) for the full matrix.

### Interrupt: Human-in-the-Loop

When a handler returns `Interrupt`, the registry calls `event.interrupt()` — the SDK's native mechanism for pausing execution and requesting human input. The agent pauses, the caller prompts the human, and on resume the handler's `evaluate()` runs again with the human's response available. Any handler can return `Interrupt` for any reason — authorization for consent-gated tools, a guardrail on flagged-but-ambiguous content, steering when it's unsure. See [`DEMO_CONSENT_WALKTHROUGH.md`](./demos/DEMO_CONSENT_WALKTHROUGH.md) for a worked example using Cedar consent policies.

---

## Working Demos

We implemented the native `Agent(interventions=[...])` parameter in both the Python and TypeScript Strands SDKs.

**Python** — [`demos/intervention/native.py`](../python/strands-cedar-auth/demos/intervention/native.py)

```python
from strands import Agent, InterventionHandler, Proceed, Deny, Guide
from strands.hooks.events import BeforeToolCallEvent

agent = Agent(
    tools=[query_database, send_email, search],
    interventions=[cedar, guardrails, steering],
)
result = agent("Query the analytics database", invocation_state={"user_id": "bob", "roles": ["analyst"]})
```

**TypeScript** — [`demos/intervention/native.ts`](../js/strands-cedar-auth/demos/intervention/native.ts)

```typescript
const agent = new Agent({
  tools: [queryDatabase, sendEmail, search],
  interventions: [cedar, ops, guardrails, datadog, steering],
})
```

Five handlers across all 4 event types, 10 scenarios including prompt injection, jailbreak detection, and steering guidance.

**Consent demo** — [`demos/consent.py`](../python/strands-cedar-auth/demos/consent.py)

Interactive agent where consent-gated tools pause via `Interrupt` and prompt the human for approval. Uses the same `CedarAuthHandler` with `.consent()` on its builder.

**SDK forks:**

| SDK | Fork |
|-----|------|
| Python | [lizradway/sdk-python@interventions](https://github.com/lizradway/sdk-python/tree/interventions) |
| TypeScript | [lizradway/sdk-typescript@interventions](https://github.com/lizradway/sdk-typescript/tree/interventions) |

See [Appendix D](#appendix-d-userland-workaround) for the userland pipeline we built to prove the concept.

---

## Development Plan

1. **Cedar authorization plugin (Python, third-party).** Ship a `CedarAuthPlugin` as a third-party Strands plugin in the [`cedar-for-agents`](https://github.com/cedar-policy/cedar-for-agents) repo using [`cedarpy`](https://pypi.org/project/cedarpy/) (externally maintained Rust-backed Python bindings, not by the Cedar team). This validates the authorization model and gives us a concrete RFC for the intervention primitive. See the [Cedar Authorization design doc](https://github.com/strands-agents/docs/designs/0006-cedar-authorization.md).

2. **Intervention primitive (TypeScript).** Implement `InterventionHandler`, `InterventionAction`, and `InterventionRegistry` in the TypeScript SDK — the `Agent({ interventions: [...] })` parameter proposed in this doc.

3. **Cedar intervention handler (TypeScript).** Build the Cedar authorization handler as an `InterventionHandler` on top of the primitive from step 2, using [`cedar-wasm`](https://github.com/cedar-policy/cedar/tree/main/cedar-wasm) — the official WASM bindings maintained by the Cedar team.

4. **Steering intervention handler (TypeScript).** Implement steering as an `InterventionHandler` in TypeScript. Steering currently only exists in the Python SDK as a special-cased plugin; building it on top of the intervention primitive in TS means it ships as a native instance rather than needing special framework support.

5. **Additional intervention handlers (TypeScript).** Add other handlers (content guardrails, OPA, etc.) as needed based on demand.

Since Strands Python 2.0 is moving to WASM bindings, the intervention primitive and all TypeScript handlers — including Cedar via the official `cedar-wasm` — will be available in Python 2.0 without separate Python implementations. At that point, the third-party `cedarpy` dependency from step 1 is replaced by the official Cedar WASM bindings.

---

<details>
<summary><strong>Appendix A: Concrete Instances</strong></summary>

| | Cedar Auth | OPA Auth | LLM Steering | Datadog AI Guard | Galileo Agent Control |
|---|---|---|---|---|---|
| **Question** | *Is this principal allowed?* | *Is this principal allowed?* | *Is this the right thing to do?* | *Is this content safe?* | *Does this violate a rule?* |
| **Engine** | Cedar policies (native/WASM) | OPA/Rego (WASM) | LLM judge | Datadog API | Centralized rule server |
| **Hook points** | `BeforeToolCall` | `BeforeToolCall` | `BeforeToolCall`, `AfterModelCall` | 4 events | 7 events |
| **Latency** | Sub-ms | Sub-ms | 100ms+ | ms | ms |

### 1. Cedar Authorization

```
Engine:      Cedar policy evaluation (native/WASM, sub-ms, deterministic)
Actions:     Proceed | Deny | Interrupt (for consent-gated tools)
Posture:     Default-deny
Strength:    Formally verifiable, identity-aware, argument-level scoping per role
Hook points: BeforeToolCall
```

Answers "is this principal authorized?" — identity-aware, argument-level scoping per role, formally verifiable. Returns `Interrupt` instead of `Deny` when a residual policy exists that would approve with human consent. See the [Cedar Authorization design doc](https://github.com/strands-agents/docs/designs/0006-cedar-authorization.md) for the full proposal.

```python
cedar = CedarAuthHandler.builder()
    .role("analyst", tools=["search", "query_database"])
    .restrict("query_database", allowed_values={"database": ["analytics"]})
    .build()
```

### 2. OPA Authorization (proposed)

```
Engine:      OPA/Rego policy evaluation (WASM, sub-ms, deterministic)
Actions:     Proceed | Deny
Posture:     Configurable (default-deny or default-allow depending on policy)
Strength:    General-purpose policy engine, CNCF graduated, broad ecosystem
Hook points: BeforeToolCall
```

Answers the same authorization question as Cedar using OPA's Rego language. CNCF graduated with a large ecosystem. Does not support formal verification of the policy set.

```python
opa = OpaAuthHandler(
    policy_path="./policies.rego",
    data_path="./roles.json",
)
```

### 3. LLM Steering (Strands built-in)

```
Engine:      LLM with natural-language system prompt
Actions:     Proceed | Guide | Interrupt (tool steering)
             Proceed | Guide (model steering)
Posture:     Default-proceed
Strength:    Flexible, handles ambiguous/subjective criteria
Hook points: BeforeToolCall (tool steering), AfterModelCall (model steering)
```

The most flexible engine — anything you can express in language. Non-deterministic and high-latency. Best used last in the pipeline. Tool steering can Proceed, Guide (cancel + retry with feedback), or Interrupt (pause for human input). Model steering can Proceed (accept response) or Guide (discard response and retry with guidance injected into conversation).

```python
from strands.vended_plugins.steering import LLMSteeringHandler

handler = LLMSteeringHandler(
    system_prompt="Ensure emails maintain a cheerful, positive tone."
)
agent = Agent(tools=[send_email], plugins=[handler])
```

### 4. Datadog AI Guard ([Strands community plugin](https://strandsagents.com/docs/community/plugins/datadog-ai-guard/))

```
Engine:      Datadog AI Guard API (prompt injection, jailbreak, data exfiltration detection)
Actions:     Proceed | Deny
Posture:     Default-proceed (threat detection approach)
Strength:    Multi-point scanning, content-focused, service-backed
Hook points: BeforeModelCall, AfterModelCall, BeforeToolCall, AfterToolCall
```

Scans at **four** lifecycle points — the broadest hook coverage of any instance. The event-driven `InterventionHandler` interface accommodates this naturally.

```python
from ddtrace.appsec.ai_guard import AIGuardStrandsPlugin

guard = AIGuardStrandsPlugin(
    detailed_error=True,
    raise_error_on_tool_calls=True,
)
agent = Agent(tools=[search, send_email], plugins=[guard])
```

### 5. Content Guardrails (custom rules)

```
Engine:      Pattern matching, classifier models, blocklists
Actions:     Proceed | Deny
Posture:     Default-proceed (blocklist approach)
Strength:    Fast, deterministic, content-focused
Hook points: BeforeToolCall (typically)
```

Checks *what's being said*, not *who's saying it*. PII detection, SQL injection, toxic content. Identity-unaware.

### 6. Galileo Agent Control ([Strands community plugin](https://strandsagents.com/docs/community/plugins/agent-control/))

```
Engine:      Centralized rule server or local controls.yaml, evaluated at runtime
Actions:     Proceed | Deny | Guide (via AgentControlSteeringHandler)
Posture:     Default-proceed (blocklist/rule-match approach)
Strength:    Centralized policy management, no-code rule updates, dual enforcement modes
Hook points: BeforeInvocation, BeforeModelCall, AfterModelCall, BeforeToolCall, AfterToolCall, BeforeNodeCall, AfterNodeCall
```

Ships as **two complementary plugins** — `AgentControlPlugin` (Deny) and `AgentControlSteeringHandler` (Guide) — because Strands doesn't yet have a unified intervention interface. This is the strongest evidence that the primitive is needed.

```python
from agent_control.integrations.strands import AgentControlPlugin, AgentControlSteeringHandler

blocker = AgentControlPlugin(agent_name="my-agent")
guide = AgentControlSteeringHandler(agent_name="my-agent")

agent = Agent(tools=[search, send_email], plugins=[blocker, guide])
```

</details>

<details>
<summary><strong>Appendix B: Interface Design Rationale</strong></summary>

### Why Not a Fixed Method Per Hook Point?

The obvious alternative is one method per lifecycle event:

```typescript
abstract class InterventionHandler {
    abstract evaluateToolCall(ctx: ToolCallContext): Promise<InterventionAction>;
    abstract evaluateModelInput(ctx: ModelInputContext): Promise<InterventionAction>;
    abstract evaluateModelOutput(ctx: ModelOutputContext): Promise<InterventionAction>;
    abstract evaluateToolResult(ctx: ToolResultContext): Promise<InterventionAction>;
}
```

**Today, Strands has 7+ lifecycle events.** That's 7 methods on the base class, most of which any handler ignores (Cedar uses 1, Datadog uses 4). When Strands adds new events, every handler needs updating — even if they don't care.

The event-driven approach (`handles()` + `evaluate()`) is stable — handlers opt into new event types by adding them to their `handles()` set. The base interface never changes.

</details>

<details>
<summary><strong>Appendix C: Coverage Matrix</strong></summary>

| Threat | Caught By | Missed By |
|--------|-----------|-----------|
| Unauthorized access (wrong role) | Cedar, OPA | Guardrails, Steering, Agent Control |
| PII in tool input | Guardrails, Datadog AI Guard | Cedar, OPA, Steering |
| SQL injection | Guardrails, Datadog AI Guard | Cedar, OPA |
| Prompt injection in user input | Datadog AI Guard | Cedar, OPA, Guardrails, Steering |
| Jailbreak / data exfiltration | Datadog AI Guard | Cedar, OPA, Guardrails |
| Off-task/low-quality tool use | LLM Steering | Cedar, OPA, Guardrails |
| Argument-level scoping (wrong DB) | Cedar, OPA | Guardrails, Steering |
| Operational policy violation | Agent Control | Cedar, OPA, Steering |
| Corrective behavioral guidance | Agent Control, LLM Steering | Cedar, OPA, Guardrails |
| Human consent for high-stakes tools | Cedar (Interrupt) | OPA, Guardrails, Agent Control |

</details>

<details>
<summary><strong>Appendix D: Userland Workaround</strong></summary>

We built a userland `InterventionPipeline` ([`pipeline.py`](../python/strands-cedar-auth/demos/intervention/pipeline.py), [`pipeline.ts`](../js/strands-cedar-auth/demos/intervention/pipeline.ts)) that wraps multiple handlers into a single Strands `Plugin`. It works — ordered evaluation, short-circuiting, unified audit log, all without SDK changes. But composition, ordering, and interrupt propagation are framework-level concerns. Every team building a production agent with multiple control layers would end up writing the same wrapper. The SDK should own this once.

</details>

<details>
<summary><strong>Appendix E: Naming Alternatives</strong></summary>

"Intervention" is the working name, but it carries a connotation of something going wrong (medical intervention, addiction intervention). Authorization isn't corrective — it's a gate. Alternatives worth considering:

| Name | API | Pros | Cons |
|---|---|---|---|
| **Intervention** | `Agent(interventions=[...])` | Descriptive — something intervenes in the loop | Implies misbehavior. Unfamiliar as a CS primitive |
| **Middleware** | `Agent(middleware=[...])` | Instantly familiar to every web engineer. Accurate | May imply single-request linear chain, not multi-event |
| **Guard** | `Agent(guards=[...])` | Short, clear, implies protection | Overloaded — Rust `guard`, Python `@guard`, Galileo uses it |
| **Policy** | `Agent(policies=[...])` | Accurate for Cedar/OPA | Doesn't fit LLM steering — steering isn't really "policy" |
| **Control** | `Agent(controls=[...])` | Neutral | Vague. "Agent control" is already Galileo's product name |
| **Gate** | `Agent(gates=[...])` | Clear metaphor — things pass through or don't | Implies binary allow/deny, doesn't capture Guide/Interrupt |
| **Interceptor** | `Agent(interceptors=[...])` | Accurate — intercepts events and decides | Java/Spring vibes, slightly dated |

The final name should be decided before any SDK PR.

</details>
