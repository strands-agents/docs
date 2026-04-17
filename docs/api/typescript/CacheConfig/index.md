Defined in: [src/models/model.ts:51](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/model.ts#L51)

Configuration for prompt caching.

## Properties

### strategy

```ts
strategy: "auto" | "anthropic";
```

Defined in: [src/models/model.ts:58](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/models/model.ts#L58)

Caching strategy to use.

-   “auto”: Automatically inject cache points at optimal positions based on model ID detection (after tools, after last user message)
-   “anthropic”: Force enable Anthropic-style caching (useful for application inference profiles)