Defined in: [src/tools/tool.ts:12](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/tools/tool.ts#L12)

Context provided to tool implementations during execution. Contains framework-level state and information from the agent invocation.

## Properties

### toolUse

```ts
toolUse: ToolUse;
```

Defined in: [src/tools/tool.ts:17](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/tools/tool.ts#L17)

The tool use request that triggered this tool execution. Contains the tool name, toolUseId, and input parameters.

---

### agent

```ts
agent: LocalAgent;
```

Defined in: [src/tools/tool.ts:23](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/tools/tool.ts#L23)

The agent instance that is executing this tool. Provides access to agent state, conversation history, and cancellation state.

---

### invocationState

```ts
invocationState: InvocationState;
```

Defined in: [src/tools/tool.ts:34](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/tools/tool.ts#L34)

Per-invocation state shared across hooks and tools for the current agent invocation. Mutable — read and write freely; changes are visible to subsequent hooks, tools, and on [AgentResult.invocationState](/docs/api/typescript/AgentResult/index.md#invocationstate).

Distinct from `agent.appState`: `invocationState` is ephemeral and accepts arbitrary values, while `appState` is durable, JSON-serializable, and deep-copied on read/write.