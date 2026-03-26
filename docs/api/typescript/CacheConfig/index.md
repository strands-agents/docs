Defined in: [src/models/model.ts:50](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/model.ts#L50)

Configuration for prompt caching.

## Properties

### strategy

```ts
strategy: "auto" | "anthropic";
```

Defined in: [src/models/model.ts:57](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/models/model.ts#L57)

Caching strategy to use.

-   “auto”: Automatically inject cache points at optimal positions based on model ID detection (after tools, after last user message)
-   “anthropic”: Force enable Anthropic-style caching (useful for application inference profiles)