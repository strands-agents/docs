```ts
type SaveLatestStrategy = "message" | "invocation" | "trigger";
```

Defined in: [src/session/session-manager.ts:41](https://github.com/strands-agents/sdk-typescript/blob/714aa5fa654cfa8ea39cf6fea0813dd27b2f39e9/strands-ts/src/session/session-manager.ts#L41)

Controls when `snapshot_latest` is saved automatically for agents.

There are two kinds of snapshots:

-   **`snapshot_latest`**: A single mutable snapshot that is overwritten on each save. Used to resume the most recent conversation state (e.g. after a crash or restart). Always reflects the last saved point in time.
-   **Immutable snapshots**: Append-only snapshots with unique IDs (UUID v7), created only when `snapshotTrigger` fires. Used for checkpointing — you can restore to any prior state, not just the latest.

`SaveLatestStrategy` controls how frequently `snapshot_latest` is updated:

-   `'invocation'`: after every agent invocation completes (default; balances durability and I/O)
-   `'message'`: after every message added and after model calls with guardrail redactions (most durable, highest I/O)
-   `'trigger'`: only when a `snapshotTrigger` fires (or manually via `saveSnapshot`)