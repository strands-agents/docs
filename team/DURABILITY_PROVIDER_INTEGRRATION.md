# Durable Execution Provider Integration

**Status**: Proposed  
**Date**: 2026-03-04  
**Issue**: https://github.com/strands-agents/sdk-python/issues/1369  
**Target Release**: TBD

---

## 1. Context

Durable agents are designed for production workloads that need resilience across failures, long waits, and restarts. Unlike ephemeral agents that lose all progress when a process dies, durable agents persist their state and resume from where they left off.

The Strands SDK currently runs the agent reasoning loop entirely in-process: a `while` loop inside `invoke_async` that alternates between calling the LLM and executing tools. All state lives in memory for the duration of a single call.

```
Today: Single invoke_async call

  User Prompt
      │
      ▼
┌─────────────────────────────────────┐
│         In-Process Loop             │
│                                     │
│  ┌──────┐   ┌──────┐   ┌──────┐     │
│  │ LLM  │──▶│ Tool │──▶│ LLM  │──▶  │  AgentResult
│  └──────┘   └──────┘   └──────┘     │
│                                     │
│  State: agent.messages (in memory)  │
└─────────────────────────────────────┘
         Process dies here?
         → Everything lost
```

This doc covers three providers: [Temporal](https://temporal.io/), [Dapr](https://dapr.io/) and [AWS Lambda Durable Execution](https://docs.aws.amazon.com/lambda/latest/dg/durable-execution-sdk.html).

This doc covers three providers: [Temporal](https://temporal.io/), [Dapr](https://dapr.io/) and [AWS Lambda Durable Execution](https://docs.aws.amazon.com/lambda/latest/dg/durable-execution-sdk.html).

---

## 1. How Durable Providers Orchestrate AI Agents

Before diving into integration, let's go through the shared architecture these providers use and how existing agent frameworks build on them.

Temporal, Dapr, and Lambda Durable all share the same recovery mechanism: record the result of each completed unit, skip it on replay, resume from where execution stopped. The **granularity** of those units is the key.

Each provider names the pieces differently but the model is the same:

| Concept | Temporal | Dapr | Lambda Durable |
|---|---|---|---|
| Orchestrator | Workflow | Workflow | `@durable_execution` handler |
| Checkpointable unit | Activity | Activity | `context.step()` |
| Replay mechanism | Event History | State Store | Cached step results |
| Human-in-the-loop | Signal | Signal / PubSub event | (not yet supported) |

Here is what a 3-step agent loop looks like when the provider can see each step vs. when it cannot:

```
Provider sees each step (native):       Provider sees one black box (wrapper):

  ┌─ LLM call ──── ✅ saved ─┐            ┌─ agent("prompt") ── ? ─┐
  │                           │            │                        │
  ├─ Tool 1  ──── ✅ saved  ─┤            │  LLM call              │
  │                           │            │  Tool 1                │
  ├─ Tool 2  ──── 💥 CRASH   │            │  Tool 2   💥 CRASH     │
  │                           │            │                        │
  │  Resume here ─▶ Tool 2   │            │  Resume ─▶ LLM call    │
  │                           │            │  (start over)          │
  ├─ LLM call ──── ✅ saved ─┤            └────────────────────────┘
  │                           │
  └─ Done
```

The left side is what Temporal AI Agent and Dapr's Durable Agent achieve. The right side is what happens if we wrap the Strands agent loop as a single unit.

### How Those Providers Build Their First-class AI Agent

**Temporal AI Agent** ([temporal-community/temporal-ai-agent](https://github.com/temporal-community/temporal-ai-agent)) puts the agent loop *inside the Workflow*. Each LLM call and each tool call is dispatched as a separate Activity. The Workflow is deterministic — it just decides "call LLM next" or "call tool next." The Activities do the actual I/O. On crash, Temporal replays completed Activities from event history and the loop resumes mid-conversation.

See example code, more to read at [Temporal AI Cookbook](https://docs.temporal.io/ai-cookbook/agentic-loop-tool-call-claude-python).

```python
# Temporal: orchestrator owns the loop, each step is an Activity
@workflow.defn
class AgentWorkflow:
    @workflow.run
    async def run(self, prompt: str):
        messages = [{"role": "user", "content": prompt}]
        while True:
            # Each LLM call = checkpointed Activity
            response = await workflow.execute_activity(
                call_llm, args=[messages], ...
            )
            if not response.tool_calls:
                return response.text

            # Each tool call = checkpointed Activity (uses dynamic activities)
            for tool_call in response.tool_calls:
                result = await workflow.execute_activity(
                    tool_call.name, args=[tool_call.input], ...
                )
                messages.append(tool_result(result))
```

**Dapr Agents** offers both a general agent and `DurableAgent`. `DurableAgent` is workflow-backed, where LLM calls and tool execution use durable activities automatically. The `AgentRunner` handles the workflow lifecycle.

```python
from dapr_agents.workflow.runners import AgentRunner

async def main():
    travel_planner = DurableAgent(
        name="TravelBuddy",
        role="Travel Planner",
        goal="Help users find flights and remember preferences",
        instructions=["Help users find flights and remember preferences"],
        tools=[search_flights],
        memory = AgentMemoryConfig(
            store=ConversationDaprStateMemory(
                store_name="conversationstore",
                session_id="travel-session",
            )
        )
    )

    runner = AgentRunner()

    try:
        itinerary = await runner.run(
            travel_planner,
            payload={"task": "Plan a 3-day trip to Paris"},
        )
        print(itinerary)
    finally:
        runner.shutdown(travel_planner)
```

Highlight the `memory` here. Dapr externalizes conversation state to a pluggable state store keyed by session_id. This is functionally equivalent to our `SessionManager`. After we introduce checkpoint-based snapshot, we will close this gap.

We will discuss AWS Durable in the next section since they all face the same granularity issue.

---

## 2. Level 1: Wrap Whole Agent Invoke (Works Today, No SDK Changes)

### Temporal: Agent as Activity

Wrap `agent("prompt")` as a Temporal Activity. Temporal retries the Activity on failure. The `session_manager` restores conversation history across retries.

```python
from temporalio import activity
from strands import Agent
from strands.session import S3SessionManager


@activity.defn
async def run_agent_activity(session_id: str, prompt: str) -> str:
    agent = Agent(
        model="us.anthropic.claude-sonnet-4-5",
        tools=[migrate_db, send_email],
        session_manager=S3SessionManager(bucket="state", session_id=session_id),
    )
    result = agent(prompt)
    return str(result.message)
```

The Temporal workflow handles this activity.

```python
from temporalio import workflow


@workflow.defn
class AgentWorkflow:
    @workflow.run
    async def run(self, session_id: str, prompt: str) -> str:
        return await workflow.execute_activity(
            run_agent_activity,
            args=[session_id, prompt],
            schedule_to_close_timeout=timedelta(minutes=10),
            retry_policy=RetryPolicy(maximum_attempts=3),
        )
```

Temporal retries the activity if the worker crashes. `S3SessionManager` restores conversation history on each retry. The entire agent loop is one atomic Activity. If the process crashes after tool call 2 but before tool call 3, the whole activity retries.

```
  Activity: run_agent_activity   <-- one black box
  [LLM]─[Tool 1]─[Tool 2]─[CRASH] <-- retry from here leads to re-execution from beginning.
```

Let us skip Dapr general agent for now since it has the same pattern.

### AWS Lambda Durable: Agent as Durable Step

[Diagram and docs](https://docs.aws.amazon.com/lambda/latest/dg/durable-functions.html)

AWS Lambda Durable Function supports wrapping any callable as a `@durable_step`. We can wrap `agent("prompt")` as a single step today with no SDK changes required.

```python
from aws_durable_execution_sdk_python import durable_execution, durable_step, DurableContext
from strands import Agent
from strands.session import S3SessionManager


@durable_step
def run_strands_agent(ctx, prompt: str, session_id: str) -> str:
    agent = Agent(
        model="us.anthropic.claude-sonnet-4-5",
        tools=[migrate_db, send_email],
        session_manager=S3SessionManager(bucket="state", session_id=session_id),
    )
    return str(agent(prompt).message)


@durable_execution
def handler(event: dict, context: DurableContext) -> dict:
    result = context.step(
        run_strands_agent, event["prompt"], event["session_id"]
    )
    return {"result": result}
```

Lambda's 15-minute ceiling no longer applies to the overall execution. Each step can run for up to 15 minutes and the `context.step()` call itself can wait indefinitely. If Lambda crashes after a step completes, AWS replays the handler and injects the cached result so the step does not re-execute.

The fundamental problem is still the same as the Temporal pattern. The entire agent loop is treated as one step. Crash recovery only happens at step boundaries, so if Lambda dies mid-loop, the entire step retries and already-completed tool calls end up re-executing.

```
Lambda Durable sees:

  context.step(run_strands_agent)   <-- one checkpoint
  [LLM]─[Tool 1]─[Tool 2]─[CRASH]  <-- Step retries → Tool 1 and Tool 2 re-execute
```

### Level 1 Summary

| | Temporal | Dapr | AWS Lambda Durable |
|---|---|---|---|
| No SDK changes needed | ✅ | ✅ | ✅ |
| Survives Lambda 15-min ceiling | ✅ (via Activity timeout) | ✅ (via Activity timeout) | ✅ (native) |
| Crash recovery at invocation level | ✅ | ✅ | ✅ |
| Mid-loop crash recovery | ❌ | ❌ | ❌ |
| Non-idempotent tools safe | ❌ | ❌ | ❌ |
| Per-LLM / per-tool checkpointing | ❌ | ❌ | ❌ |
| Step-level visibility | ❌ | ❌ | ❌ |

None solve mid-loop durability.

---

## 3. Level 2: Native Integration (Requires SDK Changes)

Instead of handing our loop to the durable provider, we keep `agent.invoke()` and wrap the individual I/O calls (LLM, tools) with the platform's checkpoint primitive. The user sets up the durable infrastructure (Temporal Worker, Lambda Durable function, etc.) and passes context into our SDK. Our SDK wraps each call so the provider can checkpoint it.

```
Level 1 (wrapper):                     Level 2 (native):

  checkpoint(                             while True:
      agent("prompt")  ← one box             wrappedCallModel()   ← checkpointed
  )                                          wrappedCallTools()   ← checkpointed
                                             if done: break

  Our loop is inside their checkpoint.    Our loop stays ours.
  They can't see individual steps.        They checkpoint each step.
```

### Current Gaps

Two things are needed in our SDK to make this work:

**Gap 1. Event loop async hooks** (easy fix)

`HookRegistry` already ships a fully working `invoke_callbacks_async()` method. The event loop just needs two call sites updated from `invoke_callbacks()` to `await invoke_callbacks_async()`. One-line change per site, no impact on existing sync hooks. After this fix, async checkpoint hooks fire mid-loop, which is what the durability wrappers need.

**Gap 2. No `Durability` abstraction on `Agent`**

`Agent` has no way to wrap its I/O calls with a durable provider's checkpoint primitive today. We need a `durability` parameter that intercepts `callModel` and `callTools` before they execute.

Hooks won't work here. `BeforeModelCallEvent` and `AfterModelCallEvent` are notification-only — the only writable field on `AfterModelCallEvent` is `retry`. The event loop calls `stream_messages` unconditionally after `BeforeModelCallEvent` fires, so there's no way to inject a cached result or skip the actual model call from a hook. `AfterToolCallEvent` does have a writable `result` field, so tools could theoretically be intercepted today, but model calls cannot.

The `Durability` abstraction needs to be wired directly into the event loop's call sites for `stream_messages` and tool execution. Hooks can't get there.

Once both gaps are closed, the proposed solution below becomes possible.

---

## 4. Proposed Solution

Below is the diagram showing how this will look like in Strands Agent. More to read about how Temporal skips completed activities: [Event History](https://docs.temporal.io/workflow-execution/event).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Temporal Worker (your process)                                             │
│                                                                             │
│  ┌─ Workflow (deterministic sandbox) ──────────────────────────────────┐    │
│  │                                                                      │   │
│  │  Strands agent loop (via Durability wiring):                        │   │
│  │                                                                      │   │
│  │    while True:                                                       │   │
│  │                                                                      │   │
│  │      ① durability.wrap_model_call (event loop call site)            │   │
│  │        └─ workflow.execute_activity(call_llm, args=[xxx])  ────┼───┼──► Temporal Server
│  │                                                                      │   │    ┌──────────────┐
│  │        ◄─ LLM response  (replayed from event history on crash ✅)  ─┼───┼──◄ │ Event History│
│  │          Note: hooks cannot do this — BeforeModelCallEvent has no   │   │    │              │
│  │          result injection; stream_messages fires unconditionally.    │   │    │ [call_llm]✅ │
│  │                                                                      │   │    │              │
│  │      ② durability.wrap_tool_call (event loop call site)             │   │    │ [call_tool]✅│
│  │        └─ workflow.execute_activity(call_tool, args=[tool_input]) ──┼───┼──► │ [call_llm] ✅│
│  │                                                                      │   │    │ ...          │
│  │        ◄─ tool result   (replayed from event history on crash ✅)  ─┼───┼──◄ └──────────────┘
│  │                                                                      │   │
│  │      if stop_reason == "end_turn": break                             │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  On crash → Worker restarts → Temporal replays Workflow from event history  │
│             Completed Activities return cached results, skipping re-execution│
│             Loop resumes exactly where it crashed                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### How Users Will Use This

The user owns the Durable Workflow (Temporal or Dapr Workflow, or Lambda Durable handler). They instantiate our Agent inside it, passing a `Durability` object that knows how to wrap functions for that platform. Our event loop runs as normal, but `callModel` and `callTools` are wrapped versions in runtime that checkpoint through the platform.

Let's imagine how a user uses this pattern:

```python
# ─── User's code (they own the Temporal setup) ──────────────────

from temporalio import workflow
from temporalio.client import Client
from strands import Agent
from strands_temporal import TemporalDurability


async def main():
    client = await Client.connect("localhost:7233")
    await client.execute_workflow(
        MyAgentWorkflow.run,
        args=["Plan a trip to Paris"],
        id="trip-planner",
        task_queue="strands-agents",
    )


@workflow.defn
class MyAgentWorkflow:
    """User defines this. They control the Workflow shape."""

    @workflow.run
    async def run(self, prompt: str) -> str:
        # User creates Agent with our durability wrapper.
        # TemporalDurability receives the workflow context so it can
        # call workflow.execute_activity() to wrap I/O calls.
        agent = Agent(
            tools=[search_flights, book_hotel],
            durability=TemporalDurability(model_id="us.anthropic.claude-sonnet-4-5"),  # ← wraps callModel/callTools
        )
        result = await agent.invoke_async(prompt)
        return str(result.message)
```

### The Code We Will Own

```python
# ─── strands-temporal package ────────────────────────────────────

from temporalio import workflow, activity
from strands.agent.durability import Durability


class TemporalDurability(Durability):
    """Wraps I/O calls as Temporal Activities."""

    def __init__(self, model_id: str):
        self.model_id = model_id

    def wrap_model_call(self, call_model_fn):
        """Wrap the raw model call so it runs as a Temporal Activity."""
        # Activities must be pre-registered on the worker at startup.
        # wrap_model_call returns a dispatcher that calls the registered activity by reference.
        model_id = self.model_id
        async def wrapped(messages, system_prompt, tool_specs):
            result = await workflow.execute_activity(
                call_model_activity,  # pre-registered on worker
                args=[model_id, messages, system_prompt, tool_specs],
                start_to_close_timeout=timedelta(minutes=5),
            )
            return result["stop_reason"], result["message"]
        return wrapped

    def wrap_tool_call(self, call_tool_fn):
        """Wrap the raw tool call so it runs as a Temporal Activity."""
        async def wrapped(tool_name, tool_input, tool_use_id):
            return await workflow.execute_activity(
                call_tool_activity,  # pre-registered on worker
                args=[tool_name, tool_input, tool_use_id],
                start_to_close_timeout=timedelta(minutes=10),
            )
        return wrapped
```

### The Durability Class (Core SDK)

```python
# ─── strands/agent/durability.py ─────────────────────────────────

class Durability:
    """Base class. Each provider implements wrap_model_call / wrap_tool_call."""

    def wrap_model_call(self, call_model_fn):
        """Override to wrap the model call with checkpointing."""
        return call_model_fn  # default: no wrapping

    def wrap_tool_call(self, call_tool_fn):
        """Override to wrap the tool call with checkpointing."""
        return call_tool_fn  # default: no wrapping
```

### How Agent Uses It

```python
# ─── Inside Agent / event_loop.py (simplified) ──────────────────

class Agent:
    def __init__(self, tools, durability=None, ...):
        self.durability = durability or Durability()  # no-op default
        ...

    async def invoke_async(self, prompt: str) -> AgentResult:
        # Same loop as today. The only difference:
        # callModel and callTools are wrapped if durability is set.

        wrapped_call_model = self.durability.wrap_model_call(self._call_model)
        wrapped_call_tools = self.durability.wrap_tool_call(self._call_tools)

        messages = [{"role": "user", "content": prompt}]

        while True:
            response = await wrapped_call_model(messages, self.system_prompt, self.tool_specs)

            if not response.tool_calls:
                return AgentResult(message=response.text)

            for tool_call in response.tool_calls:
                tool_result = await wrapped_call_tools(tool_call.name, tool_call.input)
                messages.append({"role": "tool", "content": tool_result})
```

### What Happens on Crash and Replay

```
Step 1: Workflow starts, loop begins
Step 2: wrapped_call_model() → Temporal records ActivityTaskCompleted ✅
Step 3: wrapped_call_tools("search_flights") → Temporal records ActivityTaskCompleted ✅
Step 4: wrapped_call_model() → 💥 Worker crashes mid-Activity

─── Worker restarts, Temporal replays the Workflow ───

Step 1: Workflow starts, loop begins (Workflow code runs from top)
Step 2: wrapped_call_model() → Temporal sees ActivityTaskCompleted in history
                              → returns cached result instantly, NO re-execution
Step 3: wrapped_call_tools() → Temporal sees ActivityTaskCompleted in history
                              → returns cached result instantly, NO re-execution
Step 4: wrapped_call_model() → No history for this → executes the Activity for real
Step 5: continues from here...
```

The same applies to Lambda Durable's `context.step()`. Completed steps return their cached results on replay. But Lambda Durable does not support `async` today ([tracking issue](https://github.com/aws/aws-durable-execution-sdk-python/issues/316)).

So there will be two options:

**Option A: Sync wrapper (works today)**

```python
class LambdaDurability(Durability):
    def __init__(self, context: DurableContext):
        self.context = context

    def wrap_model_call(self, call_model_fn):
        def wrapped(messages, system_prompt, tool_specs):
            return self.context.step(
                lambda _: call_model_fn(messages, system_prompt, tool_specs),
                name=f"call-model-{len(messages)}",
            )
        return wrapped

    def wrap_tool_call(self, call_tool_fn):
        def wrapped(tool_name, tool_input, tool_use_id):
            return self.context.step(
                lambda _: call_tool_fn(tool_name, tool_input, tool_use_id),
                name=f"call-tool-{tool_name}",
            )
        return wrapped
```

```python
# User's Lambda handler
@durable_execution
def handler(event: dict, context: DurableContext):
    agent = Agent(
        tools=[search_flights, book_hotel],
        durability=LambdaDurability(context),
    )
    result = agent(event["prompt"])  # sync call
    return {"result": str(result.message)}
```

**Option B: Wait for async Lambda Durable support**

If Lambda Durable adds `async def` handler / `await context.step()` in the future, the integration becomes identical to the Temporal pattern.

Lambda Durable can only be enabled on new functions. We cannot add durable configuration to an existing function after creation. The migration path is to deploy a new durable-enabled function alongside existing ones. The new function can share the same Lambda Layer; only `aws-durable-execution-sdk-python` and the decorators are added.

### What Each Side Owns

```
┌─────────────────────────────────┐  ┌──────────────────────────────────┐
│        User owns                │  │       We own (Strands SDK)       │
│                                 │  │                                  │
│  • Temporal/Dapr/Lambda setup   │  │  • Agent class                   │
│  • Worker / Workflow definition │  │  • Event loop (invoke_async)     │
│  • Infrastructure (containers,  │  │  • Durability ABC                │
│    task queues, state stores)   │  │  • Model + tool call wrapping    │
│  • Passing durability into      │  │  • Provider packages:            │
│    Agent constructor            │  │    strands-temporal              │
│                                 │  │    strands-dapr                  │
│                                 │  │    strands-aws                   │
└─────────────────────────────────┘  └──────────────────────────────────┘
```

## **Known Gaps & Open Questions**

**1. Model instantiation per activity call**

In the PoC, `call_model_activity` constructs a new `BedrockModel(model_id=model_id)` on every invocation. This is intentional — model objects hold boto3 clients and cannot be serialized across the activity boundary.

The cleaner design your senior proposed is a `TemporalModelProvider` that the user subclasses. The provider knows how to reconstruct the model from serializable config inside the activity, and also knows when it is running inside a workflow (dispatch to activity) vs. outside (call model directly):

```python
class TemporalModelProvider:
    def stream_data(self, ...):
        if in_workflow_process:
            start_activity(...)  # dispatch to Temporal activity
        else:
            model = self.create_model(...)
            model.stream(...)

    def create_model(self, params):
        ...  # subclass implements this


class MyTemporalModelProvider(TemporalModelProvider):
    temperature: float = 0.7

    def create_model(self, serialized):
        from strands.models.bedrock import BedrockModel
        return BedrockModel(temperature=serialized.temperature)

# This DevX is subject to change
agent = Agent(
    model=MyTemporalModelProvider(),
    durability=TemporalDurability(),
)
```

This keeps model config serializable (plain fields on the provider subclass) and lets users bring any model provider, not just Bedrock. The exact interface for `TemporalModelProvider` is a design decision we need to finalize.

**2. `AgentState` is not deterministic across replay**

Tools can write to `agent.state` during execution. On Temporal replay, tool calls return cached results (the tool function does not re-execute), but `agent.state` mutations inside the tool *do* re-execute because they happen in the workflow, not the activity. If a tool's state update depends on something non-deterministic (timestamp, random value, external read), the state after replay may differ from the original run.

This is a correctness risk. Three options are on the table: document it as a constraint (tools that write to `agent.state` must be deterministic), checkpoint `agent.state` as part of the activity result and restore it on replay, or treat `agent.state` as out-of-scope for durable execution in v1. Needs a decision before we ship.

**3. `Human in the loop` is different**
Strands has its own Interrupt / InterruptException mechanism for pausing the agent and waiting for human input. In Temporal, the correct pattern for human-in-the-loop is a Signal.A user who wants human-in-the-loop with Temporal durability can't use Strands' Interrupt, they need to use Temporal Signals directly.

**4. Streaming callbacks are meaningless during replay**
During Temporal replay, the model activity returns a cached result instantly, no stream, no tokens. Any UI or logging built on streaming callbacks will see nothing on replay. This isn't a correctness issue but it's a confusing UX gap worth calling out.

**5. MCP Limitation** 
Temporal agent has a MCP example, after took a closer look, I found that MCP works, but Strands' MCPClient integration pattern doesn't map directly. Strands' MCPClient is designed to be constructed once and passed as a tool to Agent. In a durable context, the MCP connection must live inside the activity worker and be managed there (not constructed in the workflow and passed in).The user can't just do Agent(tools=[my_mcp_client], durability=...) and have it work, because MCPClient holds a live background thread that can't cross the activity boundary.

**6. Effort estimate and comparison with Lambda Durable**

Lambda Durable (Level 1, no SDK changes) can be validated in ~1 week: wrap `agent(prompt)` as a `@durable_step`, confirm crash recovery at the invocation level. The limitation is mid-loop granularity, but it's a real working integration.

Level 2 (native Temporal/Dapr) is significantly more work:

| | Lambda Durable Level 1 | Temporal Level 2                                     |
|---|---|------------------------------------------------------|
| SDK changes needed | None | ~4 (hooks, Durability class, Agent wiring, event loop) |
| New packages | None | `strands-temporal`, `strands-aws`, `strands-dapr`    |
| Mid-loop crash recovery | ❌ | ✅                                                    |
| Estimated effort | ~1 week | ~4 weeks                                             |


---


## Action Items

1. Fix async hooks in `event_loop.py` (easy, two one-line changes)
2. Add `Durability` base class in `strands/agent/durability.py`
3. Add `durability` param to `Agent`, apply wrapping in `invoke_async`
4. Implement `strands-aws` package with `LambdaDurability` (start here)
5. Implement `strands-temporal` package with `TemporalDurability`
6. Implement `strands-dapr` package with `DaprDurability`

## Willingness to Implement

TBD. Start with `strands-aws` (Lambda Durable) since the sync wrapper pattern is simplest to validate.

---
