Defined in: [src/conversation-manager/conversation-manager.ts:64](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/conversation-manager/conversation-manager.ts#L64)

Abstract base class for conversation history management strategies.

The primary responsibility of a ConversationManager is overflow recovery: when the model returns a [ContextWindowOverflowError](/docs/api/typescript/ContextWindowOverflowError/index.md), [ConversationManager.reduce](#reduce) is called and MUST reduce the history enough for the next model call to succeed. If `reduce` returns `false` (no reduction performed), the error propagates out of the agent loop uncaught. This makes `reduce` a critical operation — implementations must be able to make meaningful progress when called with `error` set.

Optionally, a manager can also do proactive management (e.g. trimming after every invocation to stay within a window) by overriding `initAgent`, calling `super.initAgent(agent)` to preserve overflow recovery, then registering additional hooks.

## Example

```typescript
class Last10MessagesManager extends ConversationManager {
  readonly name = 'my:last-10-messages'

  reduce({ agent }: ReduceOptions): boolean {
    if (agent.messages.length <= 10) return false
    agent.messages.splice(0, agent.messages.length - 10)
    return true
  }
}
```

## Extended by

-   [`NullConversationManager`](/docs/api/typescript/NullConversationManager/index.md)
-   [`SlidingWindowConversationManager`](/docs/api/typescript/SlidingWindowConversationManager/index.md)
-   [`SummarizingConversationManager`](/docs/api/typescript/SummarizingConversationManager/index.md)

## Implements

-   [`Plugin`](/docs/api/typescript/Plugin/index.md)

## Constructors

### Constructor

```ts
new ConversationManager(): ConversationManager;
```

#### Returns

`ConversationManager`

## Properties

### name

```ts
abstract readonly name: string;
```

Defined in: [src/conversation-manager/conversation-manager.ts:68](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/conversation-manager/conversation-manager.ts#L68)

A stable string identifier for this conversation manager.

#### Implementation of

[`Plugin`](/docs/api/typescript/Plugin/index.md).[`name`](/docs/api/typescript/Plugin/index.md#name)

## Methods

### reduce()

```ts
abstract reduce(options): boolean | Promise<boolean>;
```

Defined in: [src/conversation-manager/conversation-manager.ts:86](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/conversation-manager/conversation-manager.ts#L86)

Reduce the conversation history.

Called automatically when a [ContextWindowOverflowError](/docs/api/typescript/ContextWindowOverflowError/index.md) occurs (with `error` set).

This is a critical call: the implementation MUST remove enough history for the next model call to succeed. Returning `false` means no reduction was possible, and the [ContextWindowOverflowError](/docs/api/typescript/ContextWindowOverflowError/index.md) will propagate out of the agent loop.

Implementations should mutate `agent.messages` in place and return `true` if any reduction was performed, `false` otherwise.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `options` | [`ConversationManagerReduceOptions`](/docs/api/typescript/ConversationManagerReduceOptions/index.md) | The reduction options |

#### Returns

`boolean` | `Promise`<`boolean`\>

`true` if the history was reduced, `false` otherwise. May return a `Promise` for implementations that need async I/O (e.g. model calls).

---

### initAgent()

```ts
initAgent(agent): void;
```

Defined in: [src/conversation-manager/conversation-manager.ts:100](https://github.com/strands-agents/sdk-typescript/blob/e168b50d42e78b142b537bae45eced396d5f272b/strands-ts/src/conversation-manager/conversation-manager.ts#L100)

Initialize the conversation manager with the agent instance.

Registers overflow recovery: when a [ContextWindowOverflowError](/docs/api/typescript/ContextWindowOverflowError/index.md) occurs, calls [ConversationManager.reduce](#reduce) and retries the model call if reduction succeeded. If `reduce` returns `false`, the error propagates out of the agent loop uncaught.

Subclasses that need proactive management MUST call `super.initAgent(agent)` to preserve this overflow recovery behavior.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `agent` | `LocalAgent` | The agent to register hooks with |

#### Returns

`void`

#### Implementation of

[`Plugin`](/docs/api/typescript/Plugin/index.md).[`initAgent`](/docs/api/typescript/Plugin/index.md#initagent)