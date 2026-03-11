Defined in: [src/hooks/registry.ts:45](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/registry.ts#L45)

Implementation of the hook registry for managing hook callbacks. Maintains mappings between event types and callback functions.

## Implements

-   `HookRegistry`

## Constructors

### Constructor

```ts
new HookRegistry(): HookRegistryImplementation;
```

Defined in: [src/hooks/registry.ts:49](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/registry.ts#L49)

#### Returns

`HookRegistryImplementation`

## Methods

### addCallback()

```ts
addCallback<T>(eventType, callback): HookCleanup;
```

Defined in: [src/hooks/registry.ts:61](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/registry.ts#L61)

Register a callback function for a specific event type.

#### Type Parameters

| Type Parameter |
| --- |
| `T` *extends* [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md) |

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `eventType` | [`HookableEventConstructor`](/docs/api/typescript/HookableEventConstructor/index.md)<`T`\> | The event class constructor to register the callback for |
| `callback` | [`HookCallback`](/docs/api/typescript/HookCallback/index.md)<`T`\> | The callback function to invoke when the event occurs |

#### Returns

`HookCleanup`

Cleanup function that removes the callback when invoked

#### Implementation of

```ts
HookRegistry.addCallback
```

---

### addHook()

```ts
addHook(provider): void;
```

Defined in: [src/hooks/registry.ts:82](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/registry.ts#L82)

Register all callbacks from a hook provider.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `provider` | [`HookProvider`](/docs/api/typescript/HookProvider/index.md) | The hook provider to register |

#### Returns

`void`

#### Implementation of

```ts
HookRegistry.addHook
```

---

### addAllHooks()

```ts
addAllHooks(providers): void;
```

Defined in: [src/hooks/registry.ts:101](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/registry.ts#L101)

Register all callbacks from multiple hook providers.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `providers` | [`HookProvider`](/docs/api/typescript/HookProvider/index.md)\[\] | Array of hook providers to register |

#### Returns

`void`

---

### removeHook()

```ts
removeHook(provider): void;
```

Defined in: [src/hooks/registry.ts:112](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/registry.ts#L112)

Remove all callbacks registered by a hook provider.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `provider` | [`HookProvider`](/docs/api/typescript/HookProvider/index.md) | The hook provider to remove |

#### Returns

`void`

#### Implementation of

```ts
HookRegistry.removeHook
```

---

### invokeCallbacks()

```ts
invokeCallbacks<T>(event): Promise<T>;
```

Defined in: [src/hooks/registry.ts:130](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/hooks/registry.ts#L130)

Invoke all registered callbacks for the given event. Awaits each callback, supporting both sync and async.

#### Type Parameters

| Type Parameter |
| --- |
| `T` *extends* [`HookableEvent`](/docs/api/typescript/HookableEvent/index.md) |

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `event` | `T` | The event to invoke callbacks for |

#### Returns

`Promise`<`T`\>

The event after all callbacks have been invoked