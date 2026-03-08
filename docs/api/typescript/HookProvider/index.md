Defined in: [src/hooks/types.ts:52](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/types.ts#L52)

Protocol for objects that provide hook callbacks to an agent. Enables composable extension of agent functionality.

## Example

```typescript
class MyHooks implements HookProvider {
  registerCallbacks(registry: HookRegistry): void {
    registry.addCallback(BeforeInvocationEvent, this.onStart)
    registry.addCallback(AfterInvocationEvent, this.onEnd)
  }

  private onStart = (event: BeforeInvocationEvent): void => {
    console.log('Agent started')
  }

  private onEnd = (event: AfterInvocationEvent): void => {
    console.log('Agent completed')
  }
}
```

## Methods

### registerCallbacks()

```ts
registerCallbacks(registry): void;
```

Defined in: [src/hooks/types.ts:58](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/hooks/types.ts#L58)

Register callback functions for specific event types.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `registry` | `HookRegistry` | The hook registry to register callbacks with |

#### Returns

`void`