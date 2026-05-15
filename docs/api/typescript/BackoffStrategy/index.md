Defined in: [src/retry/backoff-strategy.ts:28](https://github.com/strands-agents/sdk-typescript/blob/6a95bb5c4ffe0bb4e9969eefa8ccc38ba19193b6/strands-ts/src/retry/backoff-strategy.ts#L28)

Computes the delay before the next retry attempt.

## Methods

### nextDelay()

```ts
nextDelay(ctx): number;
```

Defined in: [src/retry/backoff-strategy.ts:35](https://github.com/strands-agents/sdk-typescript/blob/6a95bb5c4ffe0bb4e9969eefa8ccc38ba19193b6/strands-ts/src/retry/backoff-strategy.ts#L35)

Returns the delay in milliseconds before the next attempt.

Must be a non-negative finite number. Implementations should treat `ctx.attempt < 1` as a programmer error.

#### Parameters

| Parameter | Type |
| --- | --- |
| `ctx` | [`BackoffContext`](/docs/api/typescript/BackoffContext/index.md) |

#### Returns

`number`