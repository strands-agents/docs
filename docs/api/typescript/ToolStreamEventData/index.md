Defined in: [src/tools/tool.ts:29](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/tools/tool.ts#L29)

Data for a tool stream event.

## Properties

### type

```ts
type: "toolStreamEvent";
```

Defined in: [src/tools/tool.ts:33](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/tools/tool.ts#L33)

Discriminator for tool stream events.

---

### data?

```ts
optional data: unknown;
```

Defined in: [src/tools/tool.ts:39](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/tools/tool.ts#L39)

Caller-provided data for the progress update. Can be any type of data the tool wants to report.