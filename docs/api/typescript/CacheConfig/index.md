Defined in: [src/models/model.ts:50](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/models/model.ts#L50)

Configuration for prompt caching.

## Properties

### strategy

```ts
strategy: "auto" | "anthropic";
```

Defined in: [src/models/model.ts:57](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/models/model.ts#L57)

Caching strategy to use.

-   “auto”: Automatically inject cache points at optimal positions based on model ID detection (after tools, after last user message)
-   “anthropic”: Force enable Anthropic-style caching (useful for application inference profiles)