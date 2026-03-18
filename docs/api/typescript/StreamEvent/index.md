Defined in: [src/hooks/events.ts:61](https://github.com/strands-agents/sdk-typescript/blob/19734c452665364ca10a2b019380f7f051c5ec23/src/hooks/events.ts#L61)

Base class for all events yielded by `agent.stream()`. Carries no hookability — subclasses that should be hookable extend [HookableEvent](/docs/api/typescript/HookableEvent/index.md) instead.

## Extended by

-   [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md)

## Constructors

### Constructor

```ts
new StreamEvent(): StreamEvent;
```

#### Returns

`StreamEvent`