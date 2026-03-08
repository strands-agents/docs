Defined in: [src/telemetry/config.ts:30](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/telemetry/config.ts#L30)

Configuration options for setting up the tracer.

## Properties

### provider?

```ts
optional provider: NodeTracerProvider;
```

Defined in: [src/telemetry/config.ts:35](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/telemetry/config.ts#L35)

Custom NodeTracerProvider instance. If not provided, one will be created with default configuration.

---

### exporters?

```ts
optional exporters: {
  otlp?: boolean;
  console?: boolean;
};
```

Defined in: [src/telemetry/config.ts:40](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/telemetry/config.ts#L40)

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