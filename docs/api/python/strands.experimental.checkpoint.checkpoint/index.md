Checkpoint system for durable agent execution.

Checkpoints enable crash-resilient agent workflows by capturing agent state at cycle boundaries in the agent loop. A durability provider (e.g. Temporal) can persist checkpoints and resume from them after failures.

Two checkpoint positions per ReAct cycle:

-   after\_model: model call completed, tools not yet executed.
-   after\_tools: all tools executed, next model call pending.

Per-tool granularity is handled by the ToolExecutor abstraction (e.g. TemporalToolExecutor routes each tool to a separate Temporal activity). The SDK checkpoint operates at cycle boundaries.

User-facing pattern (same as interrupts):

-   Pause via stop\_reason=“checkpoint” on AgentResult
-   State via AgentResult.checkpoint field
-   Resume via checkpointResume content block in next agent() call

V0 Known Limitations:

-   Metrics reset on each resume call. The caller is responsible for aggregating metrics across a durable run. EventLoopMetrics reflects only the current call.
-   OpenAIResponsesModel(stateful=True) is not supported. The server-side response\_id (\_model\_state) is not captured in the snapshot.
-   When position is “after\_tools”, AgentResult.message is the assistant message that requested the tools; tool results are in the snapshot messages.
-   BeforeInvocationEvent and AfterInvocationEvent fire on every resume call, same as interrupts. Hooks counting invocations will see each resume as a separate invocation.
-   Per-tool granularity within a cycle requires a custom ToolExecutor (e.g. TemporalToolExecutor).

## Checkpoint

```python
@dataclass
class Checkpoint()
```

Defined in: [src/strands/experimental/checkpoint/checkpoint.py:46](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/checkpoint/checkpoint.py#L46)

Pause point in the agent loop. Treat as opaque — pass back to resume.

**Attributes**:

-   `position` - What just completed (after\_model or after\_tools).
-   `cycle_index` - Which ReAct loop cycle (0-based).
-   `snapshot` - Serialized agent state as a dict, produced by `Snapshot.to_dict()`. Stored as `dict[str, Any]` (not a `Snapshot` object) because checkpoints must be JSON-serializable for cross-process persistence. The consumer reconstructs via `Snapshot.from_dict()` on resume.
-   `app_data` - Application-level internal state data. The SDK does not read or modify this. Applications can store arbitrary data needed across checkpoint boundaries (e.g. session context, workflow metadata). Separate from `Snapshot.app_data` which captures agent-state-level data managed by the SDK.
-   `schema_version` - Rejects mismatches on resume across schema versions.

#### to\_dict

```python
def to_dict() -> dict[str, Any]
```

Defined in: [src/strands/experimental/checkpoint/checkpoint.py:70](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/checkpoint/checkpoint.py#L70)

Serialize for persistence.

#### from\_dict

```python
@classmethod
def from_dict(cls, data: dict[str, Any]) -> "Checkpoint"
```

Defined in: [src/strands/experimental/checkpoint/checkpoint.py:75](https://github.com/strands-agents/sdk-python/blob/main/src/strands/experimental/checkpoint/checkpoint.py#L75)

Reconstruct from a dict produced by to\_dict().

**Arguments**:

-   `data` - Serialized checkpoint data.

**Raises**:

-   `ValueError` - If schema\_version doesn’t match the current version.