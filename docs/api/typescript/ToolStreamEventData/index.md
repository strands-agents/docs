Defined in: [src/tools/tool.ts:29](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/tools/tool.ts#L29)

Data for a tool stream event.

## Properties

### type

```ts
type: "toolStreamEvent";
```

Defined in: [src/tools/tool.ts:33](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/tools/tool.ts#L33)

Discriminator for tool stream events.

---

### data?

```ts
optional data: unknown;
```

Defined in: [src/tools/tool.ts:39](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/tools/tool.ts#L39)

Caller-provided data for the progress update. Can be any type of data the tool wants to report.