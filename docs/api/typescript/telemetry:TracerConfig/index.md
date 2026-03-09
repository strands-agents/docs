Defined in: [src/telemetry/config.ts:81](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/telemetry/config.ts#L81)

Configuration options for setting up the tracer.

## Properties

### provider?

```ts
optional provider: BasicTracerProvider;
```

Defined in: [src/telemetry/config.ts:86](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/telemetry/config.ts#L86)

Custom TracerProvider instance. If not provided, NodeTracerProvider is used when available, otherwise BasicTracerProvider.

---

### exporters?

```ts
optional exporters: {
  otlp?: boolean;
  console?: boolean;
};
```

Defined in: [src/telemetry/config.ts:91](https://github.com/strands-agents/sdk-typescript/blob/ae03eab9d140374d9ba28bac0a1ec3dcbb5a1c7a/src/telemetry/config.ts#L91)

Exporter configuration.

#### otlp?

```ts
optional otlp: boolean;
```

Enable OTLP exporter. Uses OTEL\_EXPORTER\_OTLP\_ENDPOINT and OTEL\_EXPORTER\_OTLP\_HEADERS env vars automatically.

#### console?

```ts
optional console: boolean;
```

Enable console exporter for debugging.