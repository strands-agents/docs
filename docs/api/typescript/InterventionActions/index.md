```ts
const InterventionActions: {
  proceed: (options?) => Proceed;
  deny: (reason) => Deny;
  guide: (feedback, options?) => Guide;
  confirm: (prompt, options?) => Confirm;
  transform: (apply, options?) => Transform;
};
```

Defined in: [src/interventions/index.ts:3](https://github.com/strands-agents/sdk-typescript/blob/6a95bb5c4ffe0bb4e9969eefa8ccc38ba19193b6/strands-ts/src/interventions/index.ts#L3)

## Type Declaration

| Name | Type | Defined in |
| --- | --- | --- |
| `proceed()` | (`options?`) => `Proceed` | [src/interventions/index.ts:3](https://github.com/strands-agents/sdk-typescript/blob/6a95bb5c4ffe0bb4e9969eefa8ccc38ba19193b6/strands-ts/src/interventions/index.ts#L3) |
| `deny()` | (`reason`) => `Deny` | [src/interventions/index.ts:3](https://github.com/strands-agents/sdk-typescript/blob/6a95bb5c4ffe0bb4e9969eefa8ccc38ba19193b6/strands-ts/src/interventions/index.ts#L3) |
| `guide()` | (`feedback`, `options?`) => `Guide` | [src/interventions/index.ts:3](https://github.com/strands-agents/sdk-typescript/blob/6a95bb5c4ffe0bb4e9969eefa8ccc38ba19193b6/strands-ts/src/interventions/index.ts#L3) |
| `confirm()` | (`prompt`, `options?`) => `Confirm` | [src/interventions/index.ts:3](https://github.com/strands-agents/sdk-typescript/blob/6a95bb5c4ffe0bb4e9969eefa8ccc38ba19193b6/strands-ts/src/interventions/index.ts#L3) |
| `transform()` | (`apply`, `options?`) => `Transform` | [src/interventions/index.ts:3](https://github.com/strands-agents/sdk-typescript/blob/6a95bb5c4ffe0bb4e9969eefa8ccc38ba19193b6/strands-ts/src/interventions/index.ts#L3) |