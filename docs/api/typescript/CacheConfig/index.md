Defined in: [src/models/model.ts:52](https://github.com/strands-agents/sdk-typescript/blob/714aa5fa654cfa8ea39cf6fea0813dd27b2f39e9/strands-ts/src/models/model.ts#L52)

Configuration for prompt caching.

## Properties

### strategy

```ts
strategy: "auto" | "anthropic";
```

Defined in: [src/models/model.ts:59](https://github.com/strands-agents/sdk-typescript/blob/714aa5fa654cfa8ea39cf6fea0813dd27b2f39e9/strands-ts/src/models/model.ts#L59)

Caching strategy to use.

-   “auto”: Automatically inject cache points at optimal positions based on model ID detection (after tools, after last user message)
-   “anthropic”: Force enable Anthropic-style caching (useful for application inference profiles)