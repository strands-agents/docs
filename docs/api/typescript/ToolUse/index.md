Defined in: [src/tools/types.ts:36](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/tools/types.ts#L36)

Represents a tool usage request from the model. The model generates this when it wants to use a tool.

## Properties

### name

```ts
name: string;
```

Defined in: [src/tools/types.ts:40](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/tools/types.ts#L40)

The name of the tool to execute.

---

### toolUseId

```ts
toolUseId: string;
```

Defined in: [src/tools/types.ts:46](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/tools/types.ts#L46)

Unique identifier for this tool use instance. Used to match tool results back to their requests.

---

### input

```ts
input: JSONValue;
```

Defined in: [src/tools/types.ts:52](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/tools/types.ts#L52)

The input parameters for the tool. Must be JSON-serializable.