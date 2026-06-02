# Design Doc: Low-Level Snapshot API

**Status**: Proposed

**Date**: 2026-01-28

**Issue**: https://github.com/strands-agents/sdk-python/issues/1138

## Motivation

Today, developers who want to manually snapshot and restore agent state can *almost* do so by saving and loading these properties directly:

- `Agent.messages` — the conversation history
- `Agent.state` — custom application state
- `Agent._interrupt_state` — internal state for interrupt handling
- Conversation manager internal state — state held by the conversation manager (e.g., sliding window position)

However, this approach is fragile: it requires knowledge of internal implementation details, and the set of properties may change between versions. This proposal introduces a stable, convenient API to accomplish the same thing without relying on internals.

**This API does not change agent behavior** — it simply provides a clean way to serialize and restore the existing state that already exists on the agent.

## Context

Developers need a way to preserve and restore the exact state of an agent at a specific point in time. The existing SessionManagement doesn't address this:

- SessionManager works in the background, incrementally recording messages rather than full state. This means it's not possible to restore to arbitrary points in time.
- After a message is saved, there is no way to modify it and have it recorded in session-management, preventing more advance context-management strategies while being able to pause & restore agents.
- There is no way to proactively trigger session-management (e.g., after modifying `agent.messages` or `agent.state` directly)

## Decision

Add a low-level, explicit snapshot API as an alternative to automatic session-management. This enables preserving the exact state of an agent at a specific point and restoring it later — useful for evaluation frameworks, custom session management, and checkpoint/restore workflows.

### API Changes

```python
class Snapshot(TypedDict):
    type: str              # the type of data stored (e.g., "agent")
    state: dict[str, Any]  # opaque; do not modify — format subject to change
    metadata: dict         # user-provided data to be stored with the snapshot

class Agent:
    def save_snapshot(self, metadata: dict | None = None) -> Snapshot:
        """Capture the current agent state as a snapshot."""
        ...

    def load_snapshot(self, snapshot: Snapshot) -> None:
        """Restore agent state from a snapshot."""
        ...
```

### Behavior

Snapshots capture **agent state** (data), not **runtime behavior** (code):

- **Agent State** — Data persisted as part of session-management: conversation messages, context, and other JSON-serializable data. This is what snapshots save and restore.
- **Runtime Behavior** — Configuration that defines how the agent operates: model, tools, ConversationManager, etc. These are *not* included in snapshots and must be set separately when creating or restoring an agent.

The intent is that anything stored or restored by session-management would be stored in a snapshot — so this proposal is *not* documenting or changing what is persisted, but rather providing an explicit way to do what session-management does automatically.

### Contract

- **`metadata`** — Application-owned. Strands does not read, modify, or manage this field. Use it to store checkpoint labels, timestamps, or any application-specific data without the need for a separate/standalone object/datastore.
- **`type` and `state`** — Strands-owned. These fields are managed internally and should be treated as opaque. The format of `state` is subject to change; do not modify or depend on its structure.
- **Serialization** — Strands guarantees that `type` and `state` will only contain JSON-serializable values.

### Future Concerns

- Snapshotting for MultiAgent constructs - Snapshot is designed in a way that the snapshot could be reused for multi-agent with a similar api
- Providing a storage API for snapshot CRUD operations (save to disk, database, etc.)
- Providing APIs to customize serialization formats

## Developer Experience

### Evaluations via Rewind and Replay

```python
agent = Agent(tools=[tool1, tool2])
snapshot = agent.save_snapshot()

result1 = agent("What is the weather?")

# ...

agent2 = Agent(tools=[tool3, tool4])
agent2.load_snapshot(snapshot)
result2 = agent2("What is the weather?")
# ... 
# Human/manual evaluation if one outcome was better than the other
# ...
```

### Advanced Context Management

```python
agent = Agent(conversation_manager=CompactingConversationManager())
snapshot = agent.save_snapshot(metadata={"checkpoint": "before_long_task"})

# ... later ...
later_agent = Agent(conversation_manager=CompactingConversationManager())
later_agent.load_snapshot(snapshot)
```

### Persisting Snapshots

```python
import json

agent = Agent(tools=[tool1, tool2])
agent("Remember that my favorite color is orange.")

# Save to file
snapshot = agent.save_snapshot(metadata={"user_id": "123"})
with open("snapshot.json", "w") as f:
    json.dump(snapshot, f)

# Later, restore from file
with open("snapshot.json", "r") as f:
    snapshot: Snapshot = json.load(f)

agent = Agent(tools=[tool1, tool2])
agent.load_snapshot(snapshot)
agent("What is my favorite color?")  # "Your favorite color is orange."
```

### Edge cases

Restoring runtime behavior (e.g., tools) is explicitly not supported:

```python
agent1 = Agent(tools=[tool1, tool2])
snapshot = agent1.save_snapshot()
agent_no = Agent(snapshot)  # tools are NOT restored
```

## Up for Debate

### What state should be included in a snapshot?

The current proposal includes:

- **messages** — conversation history
- **interrupt state** — internal state for paused/resumed interrupts
- **agent state** — custom application state (`agent.state`)
- **conversation manager state** — internal state of the conversation manager (but not the conversation manager itself)

This draws a distinction between "evolving state" (data that changes as the agent runs) and "agent definition" (configuration that defines what the agent *is*):

| Evolving State (snapshotted) | Agent Definition (not snapshotted) |
|------------------------------|-----------------------------------|
| messages | system_prompt |
| interrupt state | tools |
| agent state | model |
| conversation manager state | conversation_manager |

Further justification: these three properties are also what SessionManagement persists today, so this API aligns with existing behavior.

**Open question:** Is this the right boundary? Are there other properties that should be considered "evolving state"?

## Consequences

**Easier:**
- Building evaluation frameworks with rewind/replay capabilities
- Implementing custom session management strategies
- Creating checkpoints during long-running agent tasks
- Cloning agents (load the same snapshot into multiple agent instances)
- Resetting agents to a known state (we do this manually for Graphs)

**More difficult:**
- N/A — this is an additive API

## Willingness to Implement

Yes
