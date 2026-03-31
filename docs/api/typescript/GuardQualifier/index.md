```ts
type GuardQualifier = "grounding_source" | "query" | "guard_content";
```

Defined in: [src/types/messages.ts:713](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/types/messages.ts#L713)

Qualifier for guard content. Specifies how the content should be evaluated by guardrails.

-   `grounding_source` - Content to check for grounding/factuality
-   `query` - User query to evaluate
-   `guard_content` - General content for guardrail evaluation