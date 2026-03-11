```ts
type HookableEventConstructor<T> = (...args) => T;
```

Defined in: [src/hooks/types.ts:8](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/types.ts#L8)

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