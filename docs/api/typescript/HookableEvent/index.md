Defined in: [src/hooks/events.ts:70](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/events.ts#L70)

Base class for events that can be subscribed to via the hook system. Only events extending this class are dispatched to [HookRegistry](/docs/api/typescript/HookRegistry/index.md) callbacks. All current events extend this class. [StreamEvent](/docs/api/typescript/StreamEvent/index.md) exists as the base for potential future stream-only events that should not be hookable.

## Extends

-   [<code dir="auto">StreamEvent</code>](/docs/api/typescript/StreamEvent/index.md)

## Extended by

-   [<code dir="auto">InitializedEvent</code>](/docs/api/typescript/InitializedEvent/index.md)
-   [<code dir="auto">BeforeInvocationEvent</code>](/docs/api/typescript/BeforeInvocationEvent/index.md)
-   [<code dir="auto">AfterInvocationEvent</code>](/docs/api/typescript/AfterInvocationEvent/index.md)
-   [<code dir="auto">MessageAddedEvent</code>](/docs/api/typescript/MessageAddedEvent/index.md)
-   [<code dir="auto">BeforeToolCallEvent</code>](/docs/api/typescript/BeforeToolCallEvent/index.md)
-   [<code dir="auto">AfterToolCallEvent</code>](/docs/api/typescript/AfterToolCallEvent/index.md)
-   [<code dir="auto">BeforeModelCallEvent</code>](/docs/api/typescript/BeforeModelCallEvent/index.md)
-   [<code dir="auto">AfterModelCallEvent</code>](/docs/api/typescript/AfterModelCallEvent/index.md)
-   [<code dir="auto">BeforeToolsEvent</code>](/docs/api/typescript/BeforeToolsEvent/index.md)
-   [<code dir="auto">AfterToolsEvent</code>](/docs/api/typescript/AfterToolsEvent/index.md)
-   [<code dir="auto">ContentBlockEvent</code>](/docs/api/typescript/ContentBlockEvent/index.md)
-   [<code dir="auto">ModelMessageEvent</code>](/docs/api/typescript/ModelMessageEvent/index.md)
-   [<code dir="auto">ToolResultEvent</code>](/docs/api/typescript/ToolResultEvent/index.md)
-   [<code dir="auto">ToolStreamUpdateEvent</code>](/docs/api/typescript/ToolStreamUpdateEvent/index.md)
-   [<code dir="auto">AgentResultEvent</code>](/docs/api/typescript/AgentResultEvent/index.md)
-   [<code dir="auto">ModelStreamUpdateEvent</code>](/docs/api/typescript/ModelStreamUpdateEvent/index.md)

## Constructors

### Constructor

```ts
new HookableEvent(): HookableEvent;
```

#### Returns

`HookableEvent`

#### Inherited from

[<code dir="auto">StreamEvent</code>](/docs/api/typescript/StreamEvent/index.md).[<code dir="auto">constructor</code>](/docs/api/typescript/StreamEvent/index.md#constructor)