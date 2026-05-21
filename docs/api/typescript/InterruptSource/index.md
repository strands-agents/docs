```ts
type InterruptSource = "tool" | "hook" | "multiagent-hook";
```

Defined in: [src/interrupt.ts:23](https://github.com/strands-agents/sdk-typescript/blob/4dd13ca32f73cd4603a1d468e3e5f60292a88334/strands-ts/src/interrupt.ts#L23)

Origin of an interrupt:

-   `'tool'` — raised by a tool callback via `ToolContext.interrupt()`.
-   `'hook'` — raised by an agent-level hook (e.g. `BeforeToolCallEvent.interrupt()`).
-   `'multiagent-hook'` — raised by a multi-agent hook (e.g. `BeforeNodeCallEvent.interrupt()`).