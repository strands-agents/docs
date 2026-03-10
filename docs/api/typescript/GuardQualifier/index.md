```ts
type GuardQualifier = "grounding_source" | "query" | "guard_content";
```

Defined in: [src/types/messages.ts:700](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L700)

Qualifier for guard content. Specifies how the content should be evaluated by guardrails.

-   `grounding_source` - Content to check for grounding/factuality
-   `query` - User query to evaluate
-   `guard_content` - General content for guardrail evaluation