```ts
type GuardQualifier = "grounding_source" | "query" | "guard_content";
```

Defined in: [src/types/messages.ts:746](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/types/messages.ts#L746)

Qualifier for guard content. Specifies how the content should be evaluated by guardrails.

-   `grounding_source` - Content to check for grounding/factuality
-   `query` - User query to evaluate
-   `guard_content` - General content for guardrail evaluation