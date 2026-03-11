Defined in: [src/tools/tool.ts:12](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/tools/tool.ts#L12)

Context provided to tool implementations during execution. Contains framework-level state and information from the agent invocation.

## Properties

### toolUse

```ts
toolUse: ToolUse;
```

Defined in: [src/tools/tool.ts:17](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/tools/tool.ts#L17)

The tool use request that triggered this tool execution. Contains the tool name, toolUseId, and input parameters.

---

### agent

```ts
agent: AgentData;
```

Defined in: [src/tools/tool.ts:23](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/tools/tool.ts#L23)

The agent instance that is executing this tool. Provides access to agent state and other agent-level information.