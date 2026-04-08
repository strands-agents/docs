Defined in: [src/models/streaming.ts:85](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/models/streaming.ts#L85)

Data for a content block start event.

## Properties

### type

```ts
type: "modelContentBlockStartEvent";
```

Defined in: [src/models/streaming.ts:89](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/models/streaming.ts#L89)

Discriminator for content block start events.

---

### start?

```ts
optional start?: ToolUseStart;
```

Defined in: [src/models/streaming.ts:95](https://github.com/strands-agents/sdk-typescript/blob/afb3912898c4484cef17005cbe425002b1bfe648/src/models/streaming.ts#L95)

Information about the content block being started. Only present for tool use blocks.