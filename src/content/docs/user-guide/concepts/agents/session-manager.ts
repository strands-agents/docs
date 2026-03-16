import { Agent, SessionManager, FileStorage, S3Storage } from '@strands-agents/sdk'
import type { SnapshotStorage, SnapshotLocation, Snapshot, SnapshotManifest } from '@strands-agents/sdk'
import { S3Client } from '@aws-sdk/client-s3'

// =====================
// Basic Usage
// =====================

async function basicFileStorageExample() {
  // --8<-- [start:basic_file_storage]
  const session = new SessionManager({
    sessionId: 'test-session',
    storage: { snapshot: new FileStorage('./sessions') },
  })

  const agent = new Agent({ sessionManager: session })

  // Use the agent - all messages and state are automatically persisted
  await agent.invoke('Hello!') // This conversation is persisted
  // --8<-- [end:basic_file_storage]
}

async function sessionAsPluginExample() {
  // --8<-- [start:session_as_plugin]
  const session = new SessionManager({
    sessionId: 'test-session',
    storage: { snapshot: new FileStorage('./sessions') },
  })

  // Equivalent to passing via sessionManager field
  const agent = new Agent({ plugins: [session] })
  await agent.invoke('Hello!')
  // --8<-- [end:session_as_plugin]
}

// =====================
// FileStorage
// =====================

async function fileStorageExample() {
  // --8<-- [start:file_storage]
  const session = new SessionManager({
    sessionId: 'user-123',
    storage: { snapshot: new FileStorage('./sessions') },
  })

  const agent = new Agent({ sessionManager: session })
  await agent.invoke("Hello, I'm a new user!")
  // --8<-- [end:file_storage]
}

// =====================
// S3Storage
// =====================

async function s3StorageExample() {
  // --8<-- [start:s3_storage]
  const session = new SessionManager({
    sessionId: 'user-456',
    storage: {
      snapshot: new S3Storage({
        bucket: 'my-agent-sessions',
        prefix: 'production',           // Optional key prefix
        s3Client: new S3Client({        // Optional pre-configured client
          region: 'us-west-2',
        }),
        // Alternatively, use region directly (cannot be combined with s3Client):
        // region: 'us-west-2',
      }),
    },
  })

  const agent = new Agent({ sessionManager: session })
  await agent.invoke('Tell me about AWS S3')
  // --8<-- [end:s3_storage]
}

// =====================
// SaveLatestStrategy
// =====================

async function saveLatestStrategyExample() {
  // --8<-- [start:save_latest_strategy]
  const session = new SessionManager({
    sessionId: 'my-session',
    storage: { snapshot: new FileStorage('./sessions') },
    saveLatestOn: 'invocation', // default — also: 'message' | 'trigger'
  })
  // --8<-- [end:save_latest_strategy]
}

// =====================
// Immutable Snapshots
// =====================

async function snapshotTriggerExample() {
  // --8<-- [start:snapshot_trigger]
  const session = new SessionManager({
    sessionId: 'my-session',
    storage: { snapshot: new FileStorage('./sessions') },
    // Create an immutable snapshot after every 4 messages
    snapshotTrigger: ({ agentData }) => agentData.messages.length % 4 === 0,
  })

  const agent = new Agent({ sessionManager: session })
  await agent.invoke('First message')   // 2 messages — no snapshot
  await agent.invoke('Second message')  // 4 messages — immutable snapshot created
  // --8<-- [end:snapshot_trigger]
}

// =====================
// List and Restore Snapshots
// =====================

async function listAndRestoreExample() {
  // --8<-- [start:list_and_restore]
  const storage = new FileStorage('./sessions')
  const location = { sessionId: 'my-session', scope: 'agent' as const, scopeId: 'default' }

  // List all immutable snapshot IDs (chronological order)
  const snapshotIds = await storage.listSnapshotIds({ location })

  // Paginate: get the next 10 snapshots after a cursor
  const page2 = await storage.listSnapshotIds({
    location,
    limit: 10,
    startAfter: snapshotIds.at(-1),
  })

  // Restore agent to a specific checkpoint
  const session = new SessionManager({ sessionId: 'my-session', storage: { snapshot: storage } })
  const agent = new Agent({ sessionManager: session })
  await agent.initialize()
  await session.restoreSnapshot({ target: agent, snapshotId: snapshotIds[0]! })
  // --8<-- [end:list_and_restore]
}

// =====================
// Custom Storage
// =====================

async function customStorageExample() {
  // --8<-- [start:custom_storage]
  // Implement the SnapshotStorage interface to use any backend (e.g. DynamoDB)
  class DynamoDBStorage implements SnapshotStorage {
    private tableName = 'agent-sessions'

    private key(location: SnapshotLocation, snapshotId: string) {
      return `${location.sessionId}/${location.scope}/${location.scopeId}/${snapshotId}`
    }

    async saveSnapshot({ location, snapshotId, snapshot }: {
      location: SnapshotLocation; snapshotId: string; isLatest: boolean; snapshot: Snapshot
    }) {
      await dynamoDB.put({ TableName: this.tableName, Item: { pk: this.key(location, snapshotId), data: snapshot } })
    }

    async loadSnapshot({ location, snapshotId }: {
      location: SnapshotLocation; snapshotId?: string
    }) {
      const result = await dynamoDB.get({
        TableName: this.tableName,
        Key: { pk: this.key(location, snapshotId ?? 'latest') },
      })
      return (result.Item?.data as Snapshot) ?? null
    }

    async listSnapshotIds({ location, limit, startAfter }: {
      location: SnapshotLocation; limit?: number; startAfter?: string
    }) {
      // Query items by session prefix, sorted by UUID v7 snapshot IDs
      const prefix = `${location.sessionId}/${location.scope}/${location.scopeId}/`
      const results = await dynamoDB.query(/* query by prefix, paginate with startAfter */)
      return results.map((r: { snapshotId: string }) => r.snapshotId)
    }

    async deleteSession({ sessionId }: { sessionId: string }) {
      // Delete all items with the session prefix
      await dynamoDB.batchDelete(/* items matching sessionId prefix */)
    }

    async loadManifest({ location }: { location: SnapshotLocation }) {
      const result = await dynamoDB.get({
        TableName: this.tableName,
        Key: { pk: `${location.sessionId}/manifest` },
      })
      return result.Item?.data as SnapshotManifest
    }

    async saveManifest({ location, manifest }: {
      location: SnapshotLocation; manifest: SnapshotManifest
    }) {
      await dynamoDB.put({ TableName: this.tableName, Item: { pk: `${location.sessionId}/manifest`, data: manifest } })
    }
  }

  const agent = new Agent({
    sessionManager: new SessionManager({
      sessionId: 'user-789',
      storage: { snapshot: new DynamoDBStorage() },
    }),
  })
  // --8<-- [end:custom_storage]
}

// =====================
// Delete Session
// =====================

async function deleteSessionExample() {
  // --8<-- [start:delete_session]
  const session = new SessionManager({
    sessionId: 'my-session',
    storage: { snapshot: new FileStorage('./sessions') },
  })

  // Remove all snapshots and manifests for this session
  await session.deleteSession()
  // --8<-- [end:delete_session]
}
