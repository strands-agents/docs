```ts
type HookCallback<T> = (event) => void | Promise<void>;
```

Defined in: [src/hooks/types.ts:20](https://github.com/strands-agents/sdk-typescript/blob/9ec24fe83310636ff1de9ec11dc1fea9ef62c4ad/src/hooks/types.ts#L20)

Type for callback functions that handle hookable events. Callbacks can be synchronous or asynchronous.

## Type Parameters

| Type Parameter |
| --- |
| `T` *extends* [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md) |

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