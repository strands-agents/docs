```ts
type GuardQualifier = "grounding_source" | "query" | "guard_content";
```

Defined in: [src/types/messages.ts:748](https://github.com/strands-agents/sdk-typescript/blob/13a12727f03fa603a6fe1163a9e2a97bd32f1e8c/strands-ts/src/types/messages.ts#L748)

Qualifier for guard content. Specifies how the content should be evaluated by guardrails.

-   `grounding_source` - Content to check for grounding/factuality
-   `query` - User query to evaluate
-   `guard_content` - General content for guardrail evaluation