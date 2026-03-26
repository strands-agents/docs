```ts
type SnapshotTriggerCallback = (params) => boolean;
```

Defined in: [src/session/types.ts:41](https://github.com/strands-agents/sdk-typescript/blob/62c272f819df2f6c572cf6cb79f78da40464fec5/src/session/types.ts#L41)

Callback function to determine when to create immutable snapshots. Called after each agent invocation to decide if a snapshot should be saved.

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `params` | [<code dir="auto">SnapshotTriggerParams</code>](/docs/api/typescript/SnapshotTriggerParams/index.md) | Snapshot trigger parameters |

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