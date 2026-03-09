Defined in: [src/models/streaming.ts:83](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/models/streaming.ts#L83)

Data for a content block start event.

## Properties

### type

```ts
type: "modelContentBlockStartEvent";
```

Defined in: [src/models/streaming.ts:87](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/models/streaming.ts#L87)

Discriminator for content block start events.

---

### start?

```ts
optional start: ToolUseStart;
```

Defined in: [src/models/streaming.ts:93](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/models/streaming.ts#L93)

Information about the content block being started. Only present for tool use blocks.