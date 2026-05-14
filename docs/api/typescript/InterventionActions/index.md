```ts
const InterventionActions: {
  proceed: (reason?) => Proceed;
  deny: (reason) => Deny;
  guide: (feedback, reason?) => Guide;
  interrupt: (prompt, reason?) => Interrupt;
  transform: (apply, reason?) => Transform;
};
```

Defined in: [src/interventions/index.ts:3](https://github.com/strands-agents/sdk-typescript/blob/13a12727f03fa603a6fe1163a9e2a97bd32f1e8c/strands-ts/src/interventions/index.ts#L3)

## Type Declaration

| Name | Type | Defined in |
| --- | --- | --- |
| `proceed()` | (`reason?`) => `Proceed` | [src/interventions/index.ts:3](https://github.com/strands-agents/sdk-typescript/blob/13a12727f03fa603a6fe1163a9e2a97bd32f1e8c/strands-ts/src/interventions/index.ts#L3) |
| `deny()` | (`reason`) => `Deny` | [src/interventions/index.ts:3](https://github.com/strands-agents/sdk-typescript/blob/13a12727f03fa603a6fe1163a9e2a97bd32f1e8c/strands-ts/src/interventions/index.ts#L3) |
| `guide()` | (`feedback`, `reason?`) => `Guide` | [src/interventions/index.ts:3](https://github.com/strands-agents/sdk-typescript/blob/13a12727f03fa603a6fe1163a9e2a97bd32f1e8c/strands-ts/src/interventions/index.ts#L3) |
| `interrupt()` | (`prompt`, `reason?`) => `Interrupt` | [src/interventions/index.ts:3](https://github.com/strands-agents/sdk-typescript/blob/13a12727f03fa603a6fe1163a9e2a97bd32f1e8c/strands-ts/src/interventions/index.ts#L3) |
| `transform()` | (`apply`, `reason?`) => `Transform` | [src/interventions/index.ts:3](https://github.com/strands-agents/sdk-typescript/blob/13a12727f03fa603a6fe1163a9e2a97bd32f1e8c/strands-ts/src/interventions/index.ts#L3) |