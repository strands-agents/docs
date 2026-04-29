Defined in: [src/conversation-manager/null-conversation-manager.ts:17](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/conversation-manager/null-conversation-manager.ts#L17)

A no-op conversation manager that does not modify the conversation history.

Does not register any proactive hooks. Overflow errors will not be retried since `reduce` always returns `false`.

## Extends

-   [`ConversationManager`](/docs/api/typescript/ConversationManager/index.md)

## Constructors

### Constructor

```ts
new NullConversationManager(): NullConversationManager;
```

#### Returns

`NullConversationManager`

#### Inherited from

[`ConversationManager`](/docs/api/typescript/ConversationManager/index.md).[`constructor`](/docs/api/typescript/ConversationManager/index.md#constructor)

## Properties

### name

```ts
readonly name: "strands:null-conversation-manager" = 'strands:null-conversation-manager';
```

Defined in: [src/conversation-manager/null-conversation-manager.ts:21](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/conversation-manager/null-conversation-manager.ts#L21)

Unique identifier for this conversation manager.

#### Overrides

[`ConversationManager`](/docs/api/typescript/ConversationManager/index.md).[`name`](/docs/api/typescript/ConversationManager/index.md#name)

## Methods

### initAgent()

```ts
initAgent(agent): void;
```

Defined in: [src/conversation-manager/conversation-manager.ts:100](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/conversation-manager/conversation-manager.ts#L100)

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

[`ConversationManager`](/docs/api/typescript/ConversationManager/index.md).[`initAgent`](/docs/api/typescript/ConversationManager/index.md#initagent)

---

### reduce()

```ts
reduce(_args): boolean;
```

Defined in: [src/conversation-manager/null-conversation-manager.ts:28](https://github.com/strands-agents/sdk-typescript/blob/3d7e0c60ad33bbd13d6e3f5d06afcc7699a85638/strands-ts/src/conversation-manager/null-conversation-manager.ts#L28)

No-op reduction — never modifies the conversation history.

#### Parameters

| Parameter | Type |
| --- | --- |
| `_args` | [`ConversationManagerReduceOptions`](/docs/api/typescript/ConversationManagerReduceOptions/index.md) |

#### Returns

`boolean`

`false` always

#### Overrides

[`ConversationManager`](/docs/api/typescript/ConversationManager/index.md).[`reduce`](/docs/api/typescript/ConversationManager/index.md#reduce)