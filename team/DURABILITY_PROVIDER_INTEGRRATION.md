# Durable Execution Provider Integration

**Status**: Proposed  
**Date**: 2026-03-01  
**Issue**: https://github.com/strands-agents/sdk-python/issues/1369  
**Target Release**: 2.0

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

This doc covers two providers: [Temporal](https://temporal.io/), [Dapr](https://dapr.io/) and [AWS Lambda Durable Execution](https://docs.aws.amazon.com/lambda/latest/dg/durable-execution-sdk.html).

### 1. How Durable Providers Orchestrate AI Agents

Before diving into integration, Let's go through the shared architecture these providers use and how existing agent frameworks build on them.


Temporal, Dapr, and Lambda Durable all share the same recovery mechanism: record the result of each completed unit, skip it on replay, resume from where execution stopped. Then the granularity is the key.
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
  │                          │            │                        │
  ├─ Tool 1  ──── ✅ saved  ─┤            │  LLM call              │
  │                          │            │  Tool 1                │
  ├─ Tool 2  ──── 💥 CRASH   │            │  Tool 2   💥 CRASH     │
  │                          │            │                        │
  │  Resume here ─▶ Tool 2   │            │  Resume ─▶ LLM call    │
  │                          │           │  (start over)          │
  ├─ LLM call ──── ✅ saved ─┤            └────────────────────────┘
  │                          │
  └─ Done                     
  
```
The left side is what Temporal AI Agent and Dapr's Durable Agent achieve. The right side is what happens if we wrap the Strands agent loop as a single unit.

### 2. How Those Providers Build Their First-class AI agent


**Temporal AI Agent** [temporal-community/temporal-ai-agent](https://github.com/temporal-community/temporal-ai-agent) puts the agent loop *inside the Workflow*. Each LLM call and each tool call is dispatched as a separate Activity. The Workflow is deterministic — it just decides "call LLM next" or "call tool next." The Activities do the actual I/O. On crash, Temporal replays completed Activities from event history and the loop resumes mid-conversation.

See example code, more to read (docs)[https://docs.temporal.io/ai-cookbook/agentic-loop-tool-call-claude-python]

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
**Dapr Agents** They offer both general agent and `DurableAgent` is workflow-backed, LLM call and tool execution uses a durable activity automatically, and the `AgentRunner` handles the workflow lifecycle.

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

Highlight the `memory` here, Dapr externalizes conversation state to a pluggable state store keyed by session_id. This is functionally equivalent to our SessionManager, after we introduce checkpoint-based snapshot, we will close this gap. 

We will discuss AWS Durable in next section since they all face the same granularity issue.

## 2. How We Can Integrate Them into Our SDK Today: Wrapper Pattern

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

---

### AWS Lambda Durable: Agent as Durable Step [Diagram and docs](https://docs.aws.amazon.com/lambda/latest/dg/durable-functions.html)

AWS Lambda Durable Functions (launched December 2025) supports wrapping any callable as a `@durable_step`. You can wrap `agent("prompt")` as a single step today with no SDK changes required.

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

### Integrating with an Existing Lambda Layer

[Lambda Durable](https://github.com/aws/aws-durable-execution-sdk-python) can only be enabled on new functions. The migration path is to add the SDK to the existing Layer build and deploy a new function that references that Layer.

Existing functions are untouched. The new durable function shares the same Layer. The only additions needed are `aws_durable_execution_sdk_python` in `requirements.txt` and the `@durable_execution` / `@durable_step` decorators in the new handler.

---

### Pattern Comparison

| | Temporal | Dapr | AWS Lambda Durable |
|---|---|---|---|
| No SDK changes needed | ✅ | ✅ | ✅ |
| Survives Lambda 15-min ceiling | ✅ (via Activity timeout) | ✅ (via Activity timeout) | ✅ (native) |
| Crash recovery at invocation level | ✅ | ✅ | ✅ |
| Mid-loop crash recovery | ❌ | ❌ | ❌ |
| Non-idempotent tools safe | ❌ | ❌ | ❌ |
| Per-LLM / per-tool checkpointing | ❌ | ❌ | ❌ |
| Step-level visibility | ❌ | ❌ | ❌ |

Both current patterns solve the execution ceiling problem. Neither solves mid-loop durability.

---

## 2. Gap If We Want Native Integration

The key takeaway is both providers need the handler to own the loop. They cannot checkpoint what they cannot see. If the agent loop is hidden inside our SDK, these platforms have no way to hook into individual steps.

**Temporal needs:** Each LLM call and each tool call as a separate Activity. Temporal records each Activity result permanently. On crash, completed Activities are replayed from history and the loop resumes at the step that was interrupted.

**Lambda Durable needs:** Each LLM call and each tool call wrapped in its own `context.step()`. AWS records each step result. On Lambda interruption, completed steps are skipped and the loop resumes at the step that was interrupted.

Both require the handler to control the loop:

```
What both need:                       What the current SDK gives:

  while True:                           context.step(
    llm  = checkpoint(call_llm)             agent("prompt")   ← one black box
    tool = checkpoint(call_tool)        )
    if done: break
```

The current SDK owns the loop inside `invoke_async`. There is no mechanism for external code to inject a checkpoint between iterations. The event loop cannot call back into the durable platform between steps.

This is the single root cause of all current integration limitations, and it surfaces as three gaps:

**Gap 1. Event loop does not use `invoke_callbacks_async` at step fire points**

`HookRegistry` already ships a fully working `invoke_callbacks_async()` method. The gap is that `event_loop.py` does not yet call it at `AfterToolCallEvent` and `AfterModelCallEvent`. Those two call sites still use the sync `invoke_callbacks()`, which raises a `RuntimeError` at runtime if an async callback is registered. Until those call sites are updated, there is no way to write an async checkpoint hook that actually fires mid-loop.

**Gap 2. No serializable agent configuration**

When a Temporal worker or a Lambda Durable handler replays the loop on a new process, it needs to reconstruct the agent from scratch each iteration. The current stateful agent accumulates `self.messages` and cannot be reconstructed from configuration alone. This will be addressed by the stateless agent proposal (@Patrick).

**Gap 3. No `DurableBackend` abstraction on `Agent`**

There is no way to tell `Agent` to dispatch its loop to an external platform. A `durable_backend` parameter and an async dispatch method are needed to make the integration work.

---

## 3. Proposed Solution

The solution opens the event loop so that durable platforms can observe and checkpoint each step, without changing the existing `agent("prompt")` call signature.

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Agent (2.0)                      │
│                                                     │
│  agent("prompt")         → AgentResult  (unchanged) │
│  agent.dispatch_async()  → ExecutionHandle  (new)   │
│                                                     │
│  durable_backend: DurableBackend | None             │
└─────────────────┬───────────────────────────────────┘
                  │
       ┌──────────┴───────────┐
       │                      │
  backend = None         backend set
       │                      │
  in-process loop        dispatch to platform
  (unchanged)            → block → AgentResult
                         or
                         → ExecutionHandle (non-blocking)
                              │
              ┌───────────────┴──────────────┐
              │                              │
        TemporalBackend            LambdaDurableBackend
```

### Core SDK Changes

**1. Wire `invoke_callbacks_async` into the event loop at step fire points.**

`HookRegistry.invoke_callbacks_async()` already exists and already handles both sync and async callbacks correctly. The only change needed is in `event_loop.py`: replace the two `invoke_callbacks()` call sites at `AfterToolCallEvent` and `AfterModelCallEvent` with `await invoke_callbacks_async()`. This is a one-line change per call site and has no impact on existing sync-only hooks.

```python
# strands/hooks/registry.py
class HookRegistry:
    async def invoke_callbacks_async(self, event: HookEvent) -> None:
        for callback in self._callbacks.get(type(event), []):
            await callback(event)
```

**2. `AgentSpec`:** A frozen, JSON-safe dataclass (`model_id`, `tool_names`, `tool_schemas`, `system_prompt`, etc.) built via `Agent._build_spec()` at dispatch time. This is the only thing that crosses the process boundary to a remote worker or Lambda handler, never a live `Agent` object.

```python
@dataclass(frozen=True)
class AgentSpec:
    model_id: str
    system_prompt: str
    tool_names: list[str]
    tool_schemas: dict[str, dict]
    session_id: str
```

**3. `DurableBackend` + `ExecutionHandle`:** Two ABCs in a new `strands.agent.backends` module. `DurableBackend.dispatch(spec, prompt)` returns an `ExecutionHandle`. The actual implementations live in `strands-temporal` and `strands-aws` as separate packages, so the core SDK has no runtime dependency on either.

```python
# strands/agent/backends.py
class ExecutionHandle(ABC):
    async def result(self) -> AgentResult: ...

class DurableBackend(ABC):
    async def dispatch(self, spec: AgentSpec, prompt: str) -> ExecutionHandle: ...
```

**4. `durable_backend` on `Agent`:** A single optional constructor parameter (default `None`). When set, `invoke_async` delegates to the backend and still returns `AgentResult` as before. A new `dispatch_async()` method returns an `ExecutionHandle` for callers that want non-blocking control.

```python
agent = Agent(tools=[...], durable_backend=LambdaDurableBackend())

# Blocking — same call signature as today
result = await agent.invoke_async("prompt")

# Non-blocking — get a handle and await later
handle = await agent.dispatch_async("prompt")
result = await handle.result()
```


Both `strands-temporal` and `strands-aws` share the same goal: checkpoint after every LLM call and every tool call so a crash at any point resumes from the last completed step rather than from the beginning. The mechanism differs per platform (Temporal uses `@activity.defn`, Lambda Durable uses `context.step()`) but the contract is identical. Each agent loop iteration is two checkpointed units: one for the LLM call, one for the tool call. On replay, completed units are skipped and the loop continues from where it stopped.

### Proposal

| Gap | Fix | Who |
|---|---|---|
| Event loop calls sync `invoke_callbacks` at step fire points | Replace two call sites in `event_loop.py` with `await invoke_callbacks_async()` | Core SDK |
| No serializable config | `AgentSpec` frozen dataclass | Core SDK |
| No extension point on `Agent` | `durable_backend` param + `dispatch_async()` | Core SDK |
| No remote tool resolution | `ToolRegistry.resolve(name)` + `all_registered()` | Core SDK |
| No Temporal worker | `StrandsWorkflow`, `create_strands_worker()` | `strands-temporal` package |
| No Lambda Durable handler | `@durable_execution` handler + `@durable_step` wrappers | `strands-aws` package |


---

## Action Items

1. Aws Durable Lambda as entry point
2. Update event_loop.py to call invoke_callbacks_async()
3. Add AgentSpec frozen dataclass ( Proposed by @Patrick)
4. Add durable_backend param and dispatch_async() to Agent
5. Implement provider packages


## Willingness to Implement

TBD. Maybe start AWS durable first. 

---