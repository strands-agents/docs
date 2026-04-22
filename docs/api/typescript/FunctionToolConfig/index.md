Defined in: [src/tools/function-tool.ts:59](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/tools/function-tool.ts#L59)

Configuration options for creating a FunctionTool.

## Properties

### name

```ts
name: string;
```

Defined in: [src/tools/function-tool.ts:61](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/tools/function-tool.ts#L61)

The unique name of the tool

---

### description

```ts
description: string;
```

Defined in: [src/tools/function-tool.ts:63](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/tools/function-tool.ts#L63)

Human-readable description of the tool’s purpose

---

### inputSchema?

```ts
optional inputSchema?: JSONSchema7;
```

Defined in: [src/tools/function-tool.ts:65](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/tools/function-tool.ts#L65)

JSON Schema defining the expected input structure. If omitted, defaults to an empty object schema.

---

### callback

```ts
callback: FunctionToolCallback;
```

Defined in: [src/tools/function-tool.ts:67](https://github.com/strands-agents/sdk-typescript/blob/d33272f723f486a08f23e9d53a53e458e8b0a113/strands-ts/src/tools/function-tool.ts#L67)

Function that implements the tool logic