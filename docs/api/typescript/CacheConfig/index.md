Defined in: [src/models/model.ts:49](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/model.ts#L49)

Configuration for prompt caching.

## Properties

### strategy

```ts
strategy: "auto" | "anthropic";
```

Defined in: [src/models/model.ts:56](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/models/model.ts#L56)

Caching strategy to use.

-   “auto”: Automatically inject cache points at optimal positions based on model ID detection (after tools, after last user message)
-   “anthropic”: Force enable Anthropic-style caching (useful for application inference profiles)