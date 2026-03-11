Defined in: [src/types/messages.ts:287](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/types/messages.ts#L287)

Data for a tool result block.

## Properties

### toolUseId

```ts
toolUseId: string;
```

Defined in: [src/types/messages.ts:291](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/types/messages.ts#L291)

The ID of the tool use that this result corresponds to.

---

### status

```ts
status: "success" | "error";
```

Defined in: [src/types/messages.ts:296](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/types/messages.ts#L296)

Status of the tool execution.

---

### content

```ts
content: ToolResultContentData[];
```

Defined in: [src/types/messages.ts:301](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/types/messages.ts#L301)

The content returned by the tool.

---

### error?

```ts
optional error: Error;
```

Defined in: [src/types/messages.ts:308](https://github.com/strands-agents/sdk-typescript/blob/ebf2f50116a427879e504e71bce440eaf44ad282/src/types/messages.ts#L308)

The original error object when status is ‘error’. Available for inspection by hooks, error handlers, and agent loop. Tools must wrap non-Error thrown values into Error objects.