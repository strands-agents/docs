```ts
type SnapshotTriggerCallback = (params) => boolean;
```

Defined in: [src/session/types.ts:41](https://github.com/strands-agents/sdk-typescript/blob/5acfb01188ff9ffa1d996ca788f15ededa23cd49/src/session/types.ts#L41)

Callback function to determine when to create immutable snapshots. Called after each agent invocation to decide if a snapshot should be saved.

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `params` | [`SnapshotTriggerParams`](/docs/api/typescript/SnapshotTriggerParams/index.md) | Snapshot trigger parameters |

## Returns

`boolean`

true to create a snapshot, false to skip

## Example

```ts
// Snapshot every 10 messages
const trigger: SnapshotTriggerCallback = ({ agentData }) => agentData.messages.length % 10 === 0

// Snapshot when conversation exceeds 20 messages
const trigger: SnapshotTriggerCallback = ({ agentData }) => agentData.messages.length > 20
```