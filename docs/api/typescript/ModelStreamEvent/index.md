```ts
type ModelStreamEvent =
  | ModelMessageStartEventData
  | ModelContentBlockStartEventData
  | ModelContentBlockDeltaEventData
  | ModelContentBlockStopEventData
  | ModelMessageStopEventData
  | ModelMetadataEventData
  | ModelRedactionEventData;
```

Defined in: [src/models/streaming.ts:19](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/models/streaming.ts#L19)

Union type representing all possible streaming events from a model provider. This is a discriminated union where each event has a unique type field.

This allows for type-safe event handling using switch statements.