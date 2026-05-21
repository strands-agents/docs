Defined in: [src/types/agent.ts:77](https://github.com/strands-agents/sdk-typescript/blob/4dd13ca32f73cd4603a1d468e3e5f60292a88334/strands-ts/src/types/agent.ts#L77)

Options for a single agent invocation.

## Properties

### structuredOutputSchema?

```ts
optional structuredOutputSchema?: ZodType;
```

Defined in: [src/types/agent.ts:81](https://github.com/strands-agents/sdk-typescript/blob/4dd13ca32f73cd4603a1d468e3e5f60292a88334/strands-ts/src/types/agent.ts#L81)

Zod schema for structured output validation, overriding the constructor-provided schema for this invocation only.

---

### invocationState?

```ts
optional invocationState?: InvocationState;
```

Defined in: [src/types/agent.ts:90](https://github.com/strands-agents/sdk-typescript/blob/4dd13ca32f73cd4603a1d468e3e5f60292a88334/strands-ts/src/types/agent.ts#L90)

Per-invocation state. Passed to lifecycle hook events and tools, and returned on [AgentResult.invocationState](/docs/api/typescript/AgentResult/index.md#invocationstate). Mutable — hooks and tools may read and write. See [InvocationState](/docs/api/typescript/InvocationState/index.md) for details.

Defaults to an empty object when omitted.

---

### cancelSignal?

```ts
optional cancelSignal?: AbortSignal;
```

Defined in: [src/types/agent.ts:120](https://github.com/strands-agents/sdk-typescript/blob/4dd13ca32f73cd4603a1d468e3e5f60292a88334/strands-ts/src/types/agent.ts#L120)

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