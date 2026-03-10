Defined in: [src/conversation-manager/sliding-window-conversation-manager.ts:43](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/conversation-manager/sliding-window-conversation-manager.ts#L43)

Implements a sliding window strategy for managing conversation history.

This class handles the logic of maintaining a conversation window that preserves tool usage pairs and avoids invalid window states. When the message count exceeds the window size, it will either truncate large tool results or remove the oldest messages while ensuring tool use/result pairs remain valid.

As a HookProvider, it registers callbacks for:

-   AfterInvocationEvent: Applies sliding window management after each invocation
-   AfterModelCallEvent: Reduces context on overflow errors and requests retry

## Implements

-   [`HookProvider`](/docs/api/typescript/HookProvider/index.md)

## Constructors

### Constructor

```ts
new SlidingWindowConversationManager(config?): SlidingWindowConversationManager;
```

Defined in: [src/conversation-manager/sliding-window-conversation-manager.ts:52](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/conversation-manager/sliding-window-conversation-manager.ts#L52)

Initialize the sliding window conversation manager.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `config?` | [`SlidingWindowConversationManagerConfig`](/docs/api/typescript/SlidingWindowConversationManagerConfig/index.md) | Configuration options for the sliding window manager. |

#### Returns

`SlidingWindowConversationManager`

## Methods

### registerCallbacks()

```ts
registerCallbacks(registry): void;
```

Defined in: [src/conversation-manager/sliding-window-conversation-manager.ts:66](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/conversation-manager/sliding-window-conversation-manager.ts#L66)

Registers callbacks with the hook registry.

Registers:

-   AfterInvocationEvent callback to apply sliding window management
-   AfterModelCallEvent callback to handle context overflow and request retry

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `registry` | `HookRegistry` | The hook registry to register callbacks with |

#### Returns

`void`

#### Implementation of

[`HookProvider`](/docs/api/typescript/HookProvider/index.md).[`registerCallbacks`](/docs/api/typescript/HookProvider/index.md#registercallbacks)