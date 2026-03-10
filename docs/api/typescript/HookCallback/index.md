```ts
type HookCallback<T> = (event) => void | Promise<void>;
```

Defined in: [src/hooks/types.ts:21](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/hooks/types.ts#L21)

Type for callback functions that handle hookable events. Callbacks can be synchronous or asynchronous.

## Type Parameters

| Type Parameter |
| --- |
| `T` *extends* [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md) |

## Parameters

| Parameter | Type |
| --- | --- |
| `event` | `T` |

## Returns

`void` | `Promise`<`void`\>

## Example

```typescript
const callback: HookCallback<BeforeInvocationEvent> = (event) => {
  console.log('Agent invocation started')
}
```