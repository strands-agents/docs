Defined in: [src/models/streaming.ts:296](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/streaming.ts#L296)

Information about input content redaction. Does not include redactedContent since the original input is already available in the messages array from BeforeModelCallEvent.

## Properties

### replaceContent

```ts
replaceContent: string;
```

Defined in: [src/models/streaming.ts:300](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/models/streaming.ts#L300)

The content to replace the redacted input with.