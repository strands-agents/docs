```ts
function configureLogging(customLogger): void;
```

Defined in: [src/logging/logger.ts:44](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/logging/logger.ts#L44)

Configures the global logger.

Allows users to inject their own logger implementation (e.g., Pino, Winston) to control logging behavior, levels, and formatting.

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `customLogger` | [<code dir="auto">Logger</code>](/docs/api/typescript/Logger/index.md) | The logger implementation to use |

## Returns

`void`

## Example

```typescript
import pino from 'pino'
import { configureLogging } from '@strands-agents/sdk'

const logger = pino({ level: 'debug' })
configureLogging(logger)
```