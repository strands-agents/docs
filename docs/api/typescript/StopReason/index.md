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

Defined in: [src/types/messages.ts:600](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/types/messages.ts#L600)

Reason why the model stopped generating content.

-   `contentFiltered` - Content was filtered by safety mechanisms
-   `endTurn` - Natural end of the model’s turn
-   `guardrailIntervened` - A guardrail policy stopped generation
-   `maxTokens` - Maximum token limit was reached
-   `stopSequence` - A stop sequence was encountered
-   `toolUse` - Model wants to use a tool
-   `modelContextWindowExceeded` - Input exceeded the model’s context window