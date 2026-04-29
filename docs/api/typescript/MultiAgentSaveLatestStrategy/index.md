```ts
type MultiAgentSaveLatestStrategy = "node" | "invocation";
```

Defined in: [src/session/session-manager.ts:51](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/session/session-manager.ts#L51)

Controls when `snapshot_latest` is saved for multi-agent orchestrators.

-   `'node'`: after every node invocation completes (default; enables resume from the last completed node after a crash or restart)
-   `'invocation'`: after every orchestrator invocation completes (lower I/O, but only captures state at orchestrator invocation boundaries)