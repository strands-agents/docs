Defined in: [src/tools/tool.ts:40](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/tools/tool.ts#L40)

Data for a tool stream event.

## Properties

### type

```ts
type: "toolStreamEvent";
```

Defined in: [src/tools/tool.ts:44](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/tools/tool.ts#L44)

Discriminator for tool stream events.

---

### data?

```ts
optional data?: unknown;
```

Defined in: [src/tools/tool.ts:50](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/tools/tool.ts#L50)

Caller-provided data for the progress update. Can be any type of data the tool wants to report.