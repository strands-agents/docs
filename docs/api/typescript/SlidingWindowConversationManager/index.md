Defined in: [src/conversation-manager/sliding-window-conversation-manager.ts:43](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/conversation-manager/sliding-window-conversation-manager.ts#L43)

Implements a sliding window strategy for managing conversation history.

This class handles the logic of maintaining a conversation window that preserves tool usage pairs and avoids invalid window states. When the message count exceeds the window size, it will either truncate large tool results or remove the oldest messages while ensuring tool use/result pairs remain valid.

Registers hooks for:

-   AfterInvocationEvent: Applies sliding window management after each invocation
-   AfterModelCallEvent: Reduces context on overflow errors and requests retry (via super)

## Extends

-   [`ConversationManager`](/docs/api/typescript/ConversationManager/index.md)

## Constructors

### Constructor

```ts
new SlidingWindowConversationManager(config?): SlidingWindowConversationManager;
```

Defined in: [src/conversation-manager/sliding-window-conversation-manager.ts:57](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/conversation-manager/sliding-window-conversation-manager.ts#L57)

Initialize the sliding window conversation manager.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `config?` | [`SlidingWindowConversationManagerConfig`](/docs/api/typescript/SlidingWindowConversationManagerConfig/index.md) | Configuration options for the sliding window manager. |

#### Returns

`SlidingWindowConversationManager`

#### Overrides

[`ConversationManager`](/docs/api/typescript/ConversationManager/index.md).[`constructor`](/docs/api/typescript/ConversationManager/index.md#constructor)

## Properties

### name

```ts
readonly name: "strands:sliding-window-conversation-manager" = 'strands:sliding-window-conversation-manager';
```

Defined in: [src/conversation-manager/sliding-window-conversation-manager.ts:50](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/conversation-manager/sliding-window-conversation-manager.ts#L50)

Unique identifier for this conversation manager.

#### Overrides

[`ConversationManager`](/docs/api/typescript/ConversationManager/index.md).[`name`](/docs/api/typescript/ConversationManager/index.md#name)

## Methods

### initAgent()

```ts
initAgent(agent): void;
```

Defined in: [src/conversation-manager/sliding-window-conversation-manager.ts:72](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/conversation-manager/sliding-window-conversation-manager.ts#L72)

Initialize the plugin by registering hooks with the agent.

Registers:

-   AfterInvocationEvent callback to apply sliding window management
-   AfterModelCallEvent callback to handle context overflow and request retry (via super)

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `agent` | [`LocalAgent`](/docs/api/typescript/LocalAgent/index.md) | The agent to register hooks with |

#### Returns

`void`

#### Overrides

[`ConversationManager`](/docs/api/typescript/ConversationManager/index.md).[`initAgent`](/docs/api/typescript/ConversationManager/index.md#initagent)

---

### reduce()

```ts
reduce(options): boolean;
```

Defined in: [src/conversation-manager/sliding-window-conversation-manager.ts:88](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/conversation-manager/sliding-window-conversation-manager.ts#L88)

Reduce the conversation history in response to a context overflow.

Attempts to truncate large tool results first before falling back to message trimming.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `options` | [`ConversationManagerReduceOptions`](/docs/api/typescript/ConversationManagerReduceOptions/index.md) | The reduction options |

#### Returns

`boolean`

`true` if the history was reduced, `false` otherwise

#### Overrides

[`ConversationManager`](/docs/api/typescript/ConversationManager/index.md).[`reduce`](/docs/api/typescript/ConversationManager/index.md#reduce)