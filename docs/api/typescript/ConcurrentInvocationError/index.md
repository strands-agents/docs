Defined in: [src/errors.ts:102](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/errors.ts#L102)

Error thrown when attempting to invoke an agent that is already processing an invocation.

This error indicates that invoke() or stream() was called while the agent is already executing. Agents can only process one invocation at a time to prevent state corruption.

## Extends

-   `Error`

## Constructors

### Constructor

```ts
new ConcurrentInvocationError(message): ConcurrentInvocationError;
```

Defined in: [src/errors.ts:108](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/errors.ts#L108)

Creates a new ConcurrentInvocationError.

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `message` | `string` | Error message describing the concurrent invocation attempt |

#### Returns

`ConcurrentInvocationError`

#### Overrides

```ts
Error.constructor
```