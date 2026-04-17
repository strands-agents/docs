```ts
type ToolChoice =
  | {
  auto: Record<string, never>;
}
  | {
  any: Record<string, never>;
}
  | {
  tool: {
     name: string;
  };
};
```

Defined in: [src/tools/types.ts:62](https://github.com/strands-agents/sdk-typescript/blob/010da7709951578da6245c3411cec933e3c1f082/src/tools/types.ts#L62)

Specifies how the model should choose which tool to use.

-   `{ auto: {} }` - Let the model decide whether to use a tool
-   `{ any: {} }` - Force the model to use one of the available tools
-   `{ tool: { name: 'name' } }` - Force the model to use a specific tool