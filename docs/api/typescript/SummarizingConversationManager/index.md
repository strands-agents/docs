Defined in: [src/conversation-manager/summarizing-conversation-manager.ts:80](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/conversation-manager/summarizing-conversation-manager.ts#L80)

Implements a summarization strategy for managing conversation history.

When a [ContextWindowOverflowError](/docs/api/typescript/ContextWindowOverflowError/index.md) occurs, this manager summarizes the oldest messages using a model call and replaces them with a single summary message, preserving context that would otherwise be lost.

## Extends

-   [<code dir="auto">ConversationManager</code>](/docs/api/typescript/ConversationManager/index.md)

## Constructors

### Constructor

```ts
new SummarizingConversationManager(config?): SummarizingConversationManager;
```

Defined in: [src/conversation-manager/summarizing-conversation-manager.ts:88](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/conversation-manager/summarizing-conversation-manager.ts#L88)

#### Parameters

| Parameter | Type |
| --- | --- |
| `config?` | [<code dir="auto">SummarizingConversationManagerConfig</code>](/docs/api/typescript/SummarizingConversationManagerConfig/index.md) |

#### Returns

`SummarizingConversationManager`

#### Overrides

[<code dir="auto">ConversationManager</code>](/docs/api/typescript/ConversationManager/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/ConversationManager/index.md#constructor)

## Properties

### name

```ts
readonly name: "strands:summarizing-conversation-manager" = 'strands:summarizing-conversation-manager';
```

Defined in: [src/conversation-manager/summarizing-conversation-manager.ts:81](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/conversation-manager/summarizing-conversation-manager.ts#L81)

A stable string identifier for this conversation manager.

#### Overrides

[<code dir="auto">ConversationManager</code>](/docs/api/typescript/ConversationManager/index.md).[<code dir="auto">name</code>](/docs/api/typescript/ConversationManager/index.md#name)

## Methods

### initAgent()

```ts
initAgent(agent): void;
```

Defined in: [src/conversation-manager/conversation-manager.ts:100](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/conversation-manager/conversation-manager.ts#L100)

Initialize the conversation manager with the agent instance.

Registers overflow recovery: when a [ContextWindowOverflowError](/docs/api/typescript/ContextWindowOverflowError/index.md) occurs, calls [ConversationManager.reduce](/docs/api/typescript/ConversationManager/index.md#reduce) and retries the model call if reduction succeeded. If `reduce` returns `false`, the error propagates out of the agent loop uncaught.

Subclasses that need proactive management MUST call `super.initAgent(agent)` to preserve this overflow recovery behavior.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `agent` | `LocalAgent` | The agent to register hooks with |

#### Returns

`void`

#### Inherited from

[<code dir="auto">ConversationManager</code>](/docs/api/typescript/ConversationManager/index.md).[<code dir="auto">initAgent</code>](/docs/api/typescript/ConversationManager/index.md#initagent)

---

### reduce()

```ts
reduce(options): Promise<boolean>;
```

Defined in: [src/conversation-manager/summarizing-conversation-manager.ts:103](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/conversation-manager/summarizing-conversation-manager.ts#L103)

Reduce the conversation history by summarizing older messages.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `options` | [<code dir="auto">ConversationManagerReduceOptions</code>](/docs/api/typescript/ConversationManagerReduceOptions/index.md) | The reduction options |

#### Returns

`Promise`<`boolean`\>

`true` if the history was reduced, `false` otherwise

#### Overrides

[<code dir="auto">ConversationManager</code>](/docs/api/typescript/ConversationManager/index.md).[<code dir="auto">reduce</code>](/docs/api/typescript/ConversationManager/index.md#reduce)