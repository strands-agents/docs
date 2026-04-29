```ts
type ToolExecutorStrategy = "sequential" | "concurrent";
```

Defined in: [src/agent/agent.ts:99](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/agent/agent.ts#L99)

Strategy for executing tool calls that the model emits in a single assistant turn.

-   `'sequential'` (default) — runs tool calls one at a time
-   `'concurrent'` — runs all tool calls from a single turn in parallel. Per-tool event order (`BeforeToolCallEvent` → `ToolStreamUpdateEvent*` → `AfterToolCallEvent` → `ToolResultEvent`) is preserved, while cross-tool events may interleave.

Cancellation works identically in both modes: [Agent.cancel](/docs/api/typescript/Agent/index.md#cancel) flips [Agent.cancelSignal](/docs/api/typescript/Agent/index.md#cancelsignal) and tools must observe it cooperatively to stop early. In concurrent mode, prompt batch-wide cancellation requires every in-flight tool to honor the signal.