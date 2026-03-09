Defined in: [src/types/agent.ts:26](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/types/agent.ts#L26)

Interface for objects that provide agent state. Allows ToolContext to work with different agent types.

## Properties

### state

```ts
state: AppState;
```

Defined in: [src/types/agent.ts:30](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/types/agent.ts#L30)

App state storage accessible to tools and application logic.

---

### messages

```ts
messages: Message[];
```

Defined in: [src/types/agent.ts:35](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/types/agent.ts#L35)

The conversation history of messages between user and assistant.