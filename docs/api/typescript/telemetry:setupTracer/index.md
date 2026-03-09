```ts
function setupTracer(config?): BasicTracerProvider;
```

Defined in: [src/telemetry/config.ts:119](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/telemetry/config.ts#L119)

Set up the tracer provider with the given configuration.

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `config` | [`TracerConfig`](/docs/api/typescript/telemetry:TracerConfig/index.md) | Tracer configuration options |

## Returns

`BasicTracerProvider`

The configured tracer provider

## Example

```typescript
import { telemetry } from '\@strands-agents/sdk'

telemetry.setupTracer({ exporters: { otlp: true } })
```