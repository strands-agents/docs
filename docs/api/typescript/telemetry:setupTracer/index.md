```ts
function setupTracer(config?): BasicTracerProvider;
```

Defined in: [src/telemetry/config.ts:119](https://github.com/strands-agents/sdk-typescript/blob/5fc30c8099b8e6735d70c6ae2160f7c0dd7b23c7/src/telemetry/config.ts#L119)

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