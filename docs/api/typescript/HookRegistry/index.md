Defined in: [src/hooks/registry.ts:30](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/hooks/registry.ts#L30)

Implementation of the hook registry for managing hook callbacks. Maintains mappings between event types and callback functions.

## Implements

-   `HookRegistry`

## Constructors

### Constructor

```ts
new HookRegistry(): HookRegistryImplementation;
```

Defined in: [src/hooks/registry.ts:33](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/hooks/registry.ts#L33)

#### Returns

`HookRegistryImplementation`

## Methods

### addCallback()

```ts
addCallback<T>(eventType, callback): HookCleanup;
```

Defined in: [src/hooks/registry.ts:44](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/hooks/registry.ts#L44)

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

### invokeCallbacks()

```ts
invokeCallbacks<T>(event): Promise<T>;
```

Defined in: [src/hooks/registry.ts:67](https://github.com/strands-agents/sdk-typescript/blob/0b08622ecec603e2b4c89b6437d0f688a35f1d4c/src/hooks/registry.ts#L67)

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