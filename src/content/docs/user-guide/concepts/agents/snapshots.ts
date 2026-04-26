import { Agent } from '@strands-agents/sdk'
import { takeSnapshot, loadSnapshot, type Snapshot } from '@strands-agents/sdk'

// Take snapshot example
async function takeSnapshotExample() {
  // --8<-- [start:take_snapshot]
  const agent = new Agent({ systemPrompt: 'You are a helpful assistant' })
  await agent.invoke('Hello!')
  agent.appState.set('user_id', 'user-123')

  // Capture a snapshot with the session preset
  const snapshot = takeSnapshot(agent, { preset: 'session' })

  console.log(snapshot.schemaVersion) // "1.0"
  console.log(snapshot.createdAt) // ISO 8601 timestamp
  console.log(Object.keys(snapshot.data)) // messages, state, systemPrompt
  // --8<-- [end:take_snapshot]
}

// Load snapshot example
async function loadSnapshotExample() {
  // --8<-- [start:load_snapshot]
  const agent = new Agent({ systemPrompt: 'You are a helpful assistant' })
  await agent.invoke('Hello!')

  // Take a snapshot
  const snapshot = takeSnapshot(agent, { preset: 'session' })

  // Continue the conversation
  await agent.invoke('Tell me a joke')
  await agent.invoke('Tell me another one')

  // Restore to the earlier state
  loadSnapshot(agent, snapshot)

  // The agent is back to the state after "Hello!"
  console.log(agent.messages.length) // Only the messages from before the jokes
  // --8<-- [end:load_snapshot]
}

// Field selection example
async function fieldSelectionExample() {
  const agent = new Agent()

  // --8<-- [start:field_selection]
  // Capture only messages and state (no preset)
  const messagesOnly = takeSnapshot(agent, { include: ['messages', 'state'] })

  // Session preset minus systemPrompt
  const noPrompt = takeSnapshot(agent, { preset: 'session', exclude: ['systemPrompt'] })
  // --8<-- [end:field_selection]
}

// App data example
async function appDataExample() {
  const agent = new Agent()

  // --8<-- [start:app_data]
  const snapshot = takeSnapshot(agent, {
    preset: 'session',
    appData: {
      snapshotLabel: 'After onboarding',
      workflowStep: 3,
      userDisplayName: 'Alice',
    },
  })

  // Access app data later
  console.log(snapshot.appData.snapshotLabel) // "After onboarding"
  console.log(snapshot.appData.userDisplayName) // "Alice"
  // --8<-- [end:app_data]
}

// Serialization example
async function serializationExample() {
  // --8<-- [start:serialization]
  const agent = new Agent()
  await agent.invoke('Hello!')

  // Take a snapshot
  const snapshot = takeSnapshot(agent, { preset: 'session' })

  // Serialize to JSON string
  const jsonString = JSON.stringify(snapshot)

  // Store to file, database, S3, etc.
  // ...

  // Later, restore from JSON
  const parsed: Snapshot = JSON.parse(jsonString)

  // Load into a new agent
  const newAgent = new Agent()
  loadSnapshot(newAgent, parsed)
  // --8<-- [end:serialization]
}

// Checkpointing example
async function checkpointingExample() {
  // --8<-- [start:checkpointing]
  const agent = new Agent({ systemPrompt: 'You are a research assistant' })

  // Step 1: Gather information
  await agent.invoke('Research the latest trends in AI agents')
  const checkpoint1 = takeSnapshot(agent, { preset: 'session' })

  // Step 2: Analyze (might fail or produce poor results)
  await agent.invoke('Analyze the key themes and summarize')
  const checkpoint2 = takeSnapshot(agent, { preset: 'session' })

  // If step 2 didn't go well, roll back to checkpoint 1
  loadSnapshot(agent, checkpoint1)
  await agent.invoke('Focus specifically on multi-agent systems and summarize')
  // --8<-- [end:checkpointing]
}

// Branching conversations example
async function branchingExample() {
  // --8<-- [start:branching]
  const agent = new Agent({ systemPrompt: 'You are a creative writer' })
  await agent.invoke('Write the opening paragraph of a mystery novel')

  // Save the branch point
  const branchPoint = takeSnapshot(agent, { preset: 'session' })

  // Branch A: noir style
  await agent.invoke('Continue in a noir detective style')
  const noirSnapshot = takeSnapshot(agent, { preset: 'session' })

  // Branch B: go back and try cozy mystery
  loadSnapshot(agent, branchPoint)
  await agent.invoke('Continue in a cozy mystery style')
  const cozySnapshot = takeSnapshot(agent, { preset: 'session' })
  // --8<-- [end:branching]
}
