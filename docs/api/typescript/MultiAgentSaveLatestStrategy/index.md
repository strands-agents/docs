```ts
type MultiAgentSaveLatestStrategy = "node" | "invocation";
```

Defined in: [src/session/session-manager.ts:51](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/session/session-manager.ts#L51)

Controls when `snapshot_latest` is saved for multi-agent orchestrators.

-   `'node'`: after every node invocation completes (default; enables resume from the last completed node after a crash or restart)
-   `'invocation'`: after every orchestrator invocation completes (lower I/O, but only captures state at orchestrator invocation boundaries)