```ts
type AgentStreamEvent =
  | ModelStreamUpdateEvent
  | ContentBlockEvent
  | ModelMessageEvent
  | ToolStreamUpdateEvent
  | ToolResultEvent
  | BeforeInvocationEvent
  | AfterInvocationEvent
  | BeforeModelCallEvent
  | AfterModelCallEvent
  | BeforeToolsEvent
  | AfterToolsEvent
  | BeforeToolCallEvent
  | AfterToolCallEvent
  | MessageAddedEvent
  | AgentResultEvent;
```

Defined in: [src/types/agent.ts:334](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/agent.ts#L334)

Union type representing all possible streaming events from an agent. This includes model events, tool events, and agent-specific lifecycle events.

This is a discriminated union where each event has a unique type field, allowing for type-safe event handling using switch statements.

Every member extends [HookableEvent](/docs/api/typescript/HookableEvent/index.md) (which extends [StreamEvent](/docs/api/typescript/StreamEvent/index.md)), making all events both streamable and subscribable via hook callbacks. Raw data objects from lower layers (model, tools) should be wrapped in a StreamEvent subclass at the agent boundary rather than added directly.