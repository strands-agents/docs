```ts
type StopReason =
  | "cancelled"
  | "contentFiltered"
  | "endTurn"
  | "guardrailIntervened"
  | "maxTokens"
  | "stopSequence"
  | "toolUse"
  | "modelContextWindowExceeded"
  | string & {
};
```

Defined in: [src/types/messages.ts:645](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/types/messages.ts#L645)

Reason why the model stopped generating content.

-   `cancelled` - Agent invocation was cancelled via `agent.cancel()`
-   `contentFiltered` - Content was filtered by safety mechanisms
-   `endTurn` - Natural end of the model’s turn
-   `guardrailIntervened` - A guardrail policy stopped generation
-   `maxTokens` - Maximum token limit was reached
-   `stopSequence` - A stop sequence was encountered
-   `toolUse` - Model wants to use a tool
-   `modelContextWindowExceeded` - Input exceeded the model’s context window