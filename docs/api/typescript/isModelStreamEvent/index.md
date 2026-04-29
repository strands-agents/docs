```ts
function isModelStreamEvent(event): event is ModelStreamEvent;
```

Defined in: [src/models/streaming.ts:44](https://github.com/strands-agents/sdk-typescript/blob/b6077a7faf47f8e21e56113b26460dd279fd2aef/strands-ts/src/models/streaming.ts#L44)

Type guard to check if an event with a type discriminator is a ModelStreamEvent.

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `event` | { `type`: `string`; } | The event to check |
| `event.type` | `string` | \- |

## Returns

`event is ModelStreamEvent`

true if the event is a ModelStreamEvent