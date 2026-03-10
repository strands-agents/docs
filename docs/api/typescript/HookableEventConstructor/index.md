```ts
type HookableEventConstructor<T> = (...args) => T;
```

Defined in: [src/hooks/types.ts:8](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/hooks/types.ts#L8)

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