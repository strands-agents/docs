Defined in: [src/types/agent.ts:41](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/agent.ts#L41)

Options for a single agent invocation.

## Properties

### structuredOutputSchema?

```ts
optional structuredOutputSchema?: ZodType;
```

Defined in: [src/types/agent.ts:45](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/agent.ts#L45)

Zod schema for structured output validation, overriding the constructor-provided schema for this invocation only.

---

### cancelSignal?

```ts
optional cancelSignal?: AbortSignal;
```

Defined in: [src/types/agent.ts:75](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/types/agent.ts#L75)

External AbortSignal for cancelling the agent invocation.

Use this when cancellation is driven by something outside the agent — for example, a client disconnect, a framework-managed request lifecycle, or a declarative timeout. The agent composes this signal with its own internal controller, so both `agent.cancel()` and this signal can trigger cancellation independently.

When the signal fires, the agent stops at the next cancellation checkpoint and returns an AgentResult with `stopReason: 'cancelled'`. See LocalAgent.cancelSignal for how tools can participate in cancellation.

#### Example

```typescript
// Timeout-based cancellation
const result = await agent.invoke('Hello', {
  cancelSignal: AbortSignal.timeout(5000),
})

// Framework-driven cancellation (e.g., client disconnect)
app.post('/chat', async (req, res) => {
  const result = await agent.invoke(req.body.message, {
    cancelSignal: req.signal,
  })
  res.json(result)
})
```