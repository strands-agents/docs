Defined in: [src/hooks/events.ts:61](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/events.ts#L61)

Base class for all events yielded by `agent.stream()`. Carries no hookability — subclasses that should be hookable extend [HookableEvent](/docs/api/typescript/HookableEvent/index.md) instead.

## Extended by

-   [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new StreamEvent(): StreamEvent;
```

#### Returns

`StreamEvent`