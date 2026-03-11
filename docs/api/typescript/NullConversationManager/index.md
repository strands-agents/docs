Defined in: [src/conversation-manager/null-conversation-manager.ts:16](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/conversation-manager/null-conversation-manager.ts#L16)

A no-op conversation manager that does not modify the conversation history. Implements HookProvider but registers zero hooks.

## Implements

-   [`HookProvider`](/docs/api/typescript/HookProvider/index.md)

## Constructors

### Constructor

```ts
new NullConversationManager(): NullConversationManager;
```

#### Returns

`NullConversationManager`

## Methods

### registerCallbacks()

```ts
registerCallbacks(_registry): void;
```

Defined in: [src/conversation-manager/null-conversation-manager.ts:23](https://github.com/strands-agents/sdk-typescript/blob/84a619a6ec3bc07ad7e98e552a65b06801e9e91d/src/conversation-manager/null-conversation-manager.ts#L23)

Registers callbacks with the hook registry. This implementation registers no hooks, providing a complete no-op behavior.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `_registry` | `HookRegistry` | The hook registry to register callbacks with (unused) |

#### Returns

`void`

#### Implementation of

[`HookProvider`](/docs/api/typescript/HookProvider/index.md).[`registerCallbacks`](/docs/api/typescript/HookProvider/index.md#registercallbacks)