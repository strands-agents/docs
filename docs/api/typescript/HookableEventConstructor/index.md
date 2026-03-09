```ts
type HookableEventConstructor<T> = (...args) => T;
```

Defined in: [src/hooks/types.ts:8](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/hooks/types.ts#L8)

Type for a constructor function that creates HookableEvent instances.

## Type Parameters

| Type Parameter | Default type |
| --- | --- |
| `T` *extends* [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md) | [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md) |

## Parameters

| Parameter | Type |
| --- | --- |
| …`args` | `any`\[\] |

## Returns

`T`