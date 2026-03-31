```ts
type HookableEventConstructor<T> = (...args) => T;
```

Defined in: [src/hooks/types.ts:7](https://github.com/strands-agents/sdk-typescript/blob/879129946a9cc414293ea8dcd1b7e768c83327e0/src/hooks/types.ts#L7)

Type for a constructor function that creates HookableEvent instances.

## Type Parameters

| Type Parameter | Default type |
| --- | --- |
| `T` *extends* [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md) | [<code dir="auto">HookableEvent</code>](/docs/api/typescript/HookableEvent/index.md) |

## Parameters

| Parameter | Type |
| --- | --- |
| …`args` | `any`\[\] |

## Returns

`T`