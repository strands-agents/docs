Defined in: [src/models/model.ts:52](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/models/model.ts#L52)

Configuration for prompt caching.

## Properties

### strategy

```ts
strategy: "auto" | "anthropic";
```

Defined in: [src/models/model.ts:59](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/models/model.ts#L59)

Caching strategy to use.

-   “auto”: Automatically inject cache points at optimal positions based on model ID detection (after tools, after last user message)
-   “anthropic”: Force enable Anthropic-style caching (useful for application inference profiles)