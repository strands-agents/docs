Defined in: [src/tools/tool.ts:58](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/tools/tool.ts#L58)

Event yielded during tool execution to report streaming progress. Tools can yield zero or more of these events before returning the final ToolResult.

## Example

```typescript
const streamEvent = new ToolStreamEvent({
  data: 'Processing step 1...'
})

// Or with structured data
const streamEvent = new ToolStreamEvent({
  data: { progress: 50, message: 'Halfway complete' }
})
```

## Implements

-   [`ToolStreamEventData`](/docs/api/typescript/ToolStreamEventData/index.md)

## Properties

### type

```ts
readonly type: "toolStreamEvent";
```

Defined in: [src/tools/tool.ts:62](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/tools/tool.ts#L62)

Discriminator for tool stream events.

#### Implementation of

```ts
ToolStreamEventData.type
```

---

### data?

```ts
readonly optional data: unknown;
```

Defined in: [src/tools/tool.ts:68](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/tools/tool.ts#L68)

Caller-provided data for the progress update. Can be any type of data the tool wants to report.

#### Implementation of

```ts
ToolStreamEventData.data
```