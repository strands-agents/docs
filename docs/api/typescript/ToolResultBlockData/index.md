Defined in: [src/types/messages.ts:292](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/messages.ts#L292)

Data for a tool result block.

## Properties

### toolUseId

```ts
toolUseId: string;
```

Defined in: [src/types/messages.ts:296](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/messages.ts#L296)

The ID of the tool use that this result corresponds to.

---

### status

```ts
status: "success" | "error";
```

Defined in: [src/types/messages.ts:301](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/messages.ts#L301)

Status of the tool execution.

---

### content

```ts
content: ToolResultContentData[];
```

Defined in: [src/types/messages.ts:306](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/messages.ts#L306)

The content returned by the tool.

---

### error?

```ts
optional error: Error;
```

Defined in: [src/types/messages.ts:313](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/types/messages.ts#L313)

The original error object when status is ‘error’. Available for inspection by hooks, error handlers, and agent loop. Tools must wrap non-Error thrown values into Error objects.