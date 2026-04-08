Defined in: [src/models/streaming.ts:296](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/models/streaming.ts#L296)

Information about input content redaction. Does not include redactedContent since the original input is already available in the messages array from BeforeModelCallEvent.

## Properties

### replaceContent

```ts
replaceContent: string;
```

Defined in: [src/models/streaming.ts:300](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/models/streaming.ts#L300)

The content to replace the redacted input with.