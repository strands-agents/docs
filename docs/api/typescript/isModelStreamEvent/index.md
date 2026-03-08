```ts
function isModelStreamEvent(event): event is ModelStreamEvent;
```

Defined in: [src/models/streaming.ts:42](https://github.com/strands-agents/sdk-typescript/blob/53bf6e624a0ca259936e3d9700717a8795995845/src/models/streaming.ts#L42)

Type guard to check if an event with a type discriminator is a ModelStreamEvent.

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `event` | { `type`: `string`; } | The event to check |
| `event.type` | `string` | \- |

## Returns

`event is ModelStreamEvent`

true if the event is a ModelStreamEvent