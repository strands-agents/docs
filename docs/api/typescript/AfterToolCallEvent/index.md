Defined in: [src/hooks/events.ts:223](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L223)

Event triggered after a tool execution completes. Fired after tool execution finishes, whether successful or failed. Uses reverse callback ordering for proper cleanup semantics.

## Extends

-   [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new AfterToolCallEvent(data): AfterToolCallEvent;
```

Defined in: [src/hooks/events.ts:241](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L241)

#### Parameters

| Parameter | Type |
| --- | --- |
| `data` | { `agent`: [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md); `toolUse`: { `name`: `string`; `toolUseId`: `string`; `input`: [<code dir="auto">JSONValue</code>](/docs/api/typescript/JSONValue/index.md); }; `tool`: [<code dir="auto">Tool</code>](/docs/api/typescript/Tool/index.md); `result`: [<code dir="auto">ToolResultBlock</code>](/docs/api/typescript/ToolResultBlock/index.md); `error?`: `Error`; } |
| `data.agent` | [<code dir="auto">LocalAgent</code>](/docs/api/typescript/LocalAgent/index.md) |
| `data.toolUse` | { `name`: `string`; `toolUseId`: `string`; `input`: [<code dir="auto">JSONValue</code>](/docs/api/typescript/JSONValue/index.md); } |
| `data.toolUse.name` | `string` |
| `data.toolUse.toolUseId` | `string` |
| `data.toolUse.input` | [<code dir="auto">JSONValue</code>](/docs/api/typescript/JSONValue/index.md) |
| `data.tool` | [<code dir="auto">Tool</code>](/docs/api/typescript/Tool/index.md) |
| `data.result` | [<code dir="auto">ToolResultBlock</code>](/docs/api/typescript/ToolResultBlock/index.md) |
| `data.error?` | `Error` |

#### Returns

`AfterToolCallEvent`

#### Overrides

[<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/HookableEvent/index.md#constructor)

## Properties

### type

```ts
readonly type: "afterToolCallEvent";
```

Defined in: [src/hooks/events.ts:224](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L224)

---

### agent

```ts
readonly agent: LocalAgent;
```

Defined in: [src/hooks/events.ts:225](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L225)

---

### toolUse

```ts
readonly toolUse: {
  name: string;
  toolUseId: string;
  input: JSONValue;
};
```

Defined in: [src/hooks/events.ts:226](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L226)

#### name

```ts
name: string;
```

#### toolUseId

```ts
toolUseId: string;
```

#### input

```ts
input: JSONValue;
```

---

### tool

```ts
readonly tool: Tool;
```

Defined in: [src/hooks/events.ts:231](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L231)

---

### result

```ts
readonly result: ToolResultBlock;
```

Defined in: [src/hooks/events.ts:232](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L232)

---

### error?

```ts
readonly optional error?: Error;
```

Defined in: [src/hooks/events.ts:233](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L233)

---

### retry?

```ts
optional retry?: boolean;
```

Defined in: [src/hooks/events.ts:239](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L239)

Optional flag that can be set by hook callbacks to request a retry of the tool call. When set to true, the agent will re-execute the tool.

## Methods

### toJSON()

```ts
toJSON(): Pick<AfterToolCallEvent, "toolUse" | "type" | "result"> & {
  error?: {
     message?: string;
  };
};
```

Defined in: [src/hooks/events.ts:267](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L267)

Serializes for wire transport, excluding the agent reference, tool instance, and mutable retry flag. Converts Error to an extensible object for safe wire serialization. Called automatically by JSON.stringify().

#### Returns

`Pick`<`AfterToolCallEvent`, `"toolUse"` | `"type"` | `"result"`\> & { `error?`: { `message?`: `string`; }; }