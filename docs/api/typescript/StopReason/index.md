```ts
type StopReason =
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

Defined in: [src/types/messages.ts:600](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/types/messages.ts#L600)

Reason why the model stopped generating content.

-   `contentFiltered` - Content was filtered by safety mechanisms
-   `endTurn` - Natural end of the model’s turn
-   `guardrailIntervened` - A guardrail policy stopped generation
-   `maxTokens` - Maximum token limit was reached
-   `stopSequence` - A stop sequence was encountered
-   `toolUse` - Model wants to use a tool
-   `modelContextWindowExceeded` - Input exceeded the model’s context window