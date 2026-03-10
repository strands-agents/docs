Defined in: [src/tools/function-tool.ts:51](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/tools/function-tool.ts#L51)

Configuration options for creating a FunctionTool.

## Properties

### name

```ts
name: string;
```

Defined in: [src/tools/function-tool.ts:53](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/tools/function-tool.ts#L53)

The unique name of the tool

---

### description

```ts
description: string;
```

Defined in: [src/tools/function-tool.ts:55](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/tools/function-tool.ts#L55)

Human-readable description of the tool’s purpose

---

### inputSchema?

```ts
optional inputSchema: JSONSchema7;
```

Defined in: [src/tools/function-tool.ts:57](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/tools/function-tool.ts#L57)

JSON Schema defining the expected input structure. If omitted, defaults to an empty object schema.

---

### callback

```ts
callback: FunctionToolCallback;
```

Defined in: [src/tools/function-tool.ts:59](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/tools/function-tool.ts#L59)

Function that implements the tool logic