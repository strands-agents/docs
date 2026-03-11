Defined in: [src/types/agent.ts:27](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/agent.ts#L27)

Interface for objects that provide agent state. Allows ToolContext to work with different agent types.

## Properties

### state

```ts
state: AppState;
```

Defined in: [src/types/agent.ts:31](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/agent.ts#L31)

App state storage accessible to tools and application logic.

---

### messages

```ts
messages: Message[];
```

Defined in: [src/types/agent.ts:36](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/types/agent.ts#L36)

The conversation history of messages between user and assistant.