```ts
function setupTracer(config?): NodeTracerProvider;
```

Defined in: [src/telemetry/config.ts:77](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/telemetry/config.ts#L77)

Set up the tracer provider with the given configuration.

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `config` | [`TracerConfig`](/docs/api/typescript/telemetry:TracerConfig/index.md) | Tracer configuration options |

## Returns

`NodeTracerProvider`

The configured NodeTracerProvider

## Example

```typescript
import { telemetry } from '@strands-agents/sdk'

// Simple setup with defaults
const provider = telemetry.setupTracer({
  exporters: { otlp: true }
})

// Custom provider
telemetry.setupTracer({
  provider: new NodeTracerProvider({ resource: myResource }),
  exporters: { otlp: true, console: true }
})
```