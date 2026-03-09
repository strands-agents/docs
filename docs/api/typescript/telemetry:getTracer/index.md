```ts
function getTracer(): Tracer;
```

Defined in: [src/telemetry/config.ts:74](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/telemetry/config.ts#L74)

Get an OpenTelemetry Tracer instance.

Wraps the OTel trace API to provide a consistent tracer scoped to the configured service name.

## Returns

`Tracer`

An OTel Tracer instance from the global tracer provider

## Example

```typescript
import { telemetry } from '@strands-agents/sdk'

// Set up telemetry first (or register your own NodeTracerProvider)
telemetry.setupTracer({ exporters: { otlp: true } })

// Get a tracer and create custom spans
const tracer = telemetry.getTracer()
const span = tracer.startSpan('my-custom-operation')
span.setAttribute('custom.key', 'value')

// ........

span.end()
```