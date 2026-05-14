```ts
type StopReason =
  | "cancelled"
  | "contentFiltered"
  | "endTurn"
  | "guardrailIntervened"
  | "interrupt"
  | "maxTokens"
  | "stopSequence"
  | "toolUse"
  | "modelContextWindowExceeded"
  | string & {
};
```

Defined in: [src/types/messages.ts:646](https://github.com/strands-agents/sdk-typescript/blob/13a12727f03fa603a6fe1163a9e2a97bd32f1e8c/strands-ts/src/types/messages.ts#L646)

Reason why the model stopped generating content.

-   `cancelled` - Agent invocation was cancelled via `agent.cancel()`
-   `contentFiltered` - Content was filtered by safety mechanisms
-   `endTurn` - Natural end of the model’s turn
-   `guardrailIntervened` - A guardrail policy stopped generation
-   `interrupt` - Agent execution was interrupted for human input
-   `maxTokens` - Maximum token limit was reached
-   `stopSequence` - A stop sequence was encountered
-   `toolUse` - Model wants to use a tool
-   `modelContextWindowExceeded` - Input exceeded the model’s context window