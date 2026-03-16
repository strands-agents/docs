import { Agent, ConversationManager, NullConversationManager, SlidingWindowConversationManager, type ConversationManagerReduceOptions } from '@strands-agents/sdk'

async function nullConversationManagerAgent() {
  // --8<-- [start:null_conversation_manager]
  const agent = new Agent({
    conversationManager: new NullConversationManager(),
  })
  // --8<-- [end:null_conversation_manager]
}

async function slidingWindowConversationManagerAgent() {
  // --8<-- [start:sliding_window_conversation_manager]
  // Create a conversation manager with custom window size
  const conversationManager = new SlidingWindowConversationManager({
    windowSize: 40, // Maximum number of messages to keep
    shouldTruncateResults: true, // Enable truncating the tool result when a message is too large for the model's context window
  })

  const agent = new Agent({
    conversationManager,
  })
  // --8<-- [end:sliding_window_conversation_manager]
}

// --8<-- [start:custom_conversation_manager]
class Last10MessagesManager extends ConversationManager {
  readonly name = 'my:last-10-messages'

  reduce({ agent }: ConversationManagerReduceOptions): boolean {
    if (agent.messages.length <= 10) return false
    agent.messages.splice(0, agent.messages.length - 10)
    return true
  }
}

const agent = new Agent({
  conversationManager: new Last10MessagesManager(),
})
// --8<-- [end:custom_conversation_manager]
