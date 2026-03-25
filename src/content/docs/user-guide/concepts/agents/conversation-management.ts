import { Agent, ConversationManager, AfterInvocationEvent, NullConversationManager, SlidingWindowConversationManager, SummarizationConversationManager, BedrockModel } from '@strands-agents/sdk'
import type { LocalAgent, ConversationManagerReduceOptions } from '@strands-agents/sdk'

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

// --8<-- [start:custom_conversation_manager_proactive]
class MyManager extends ConversationManager {
  readonly name = 'my:manager'
  private readonly _maxMessages = 5

  reduce({ agent }: ConversationManagerReduceOptions): boolean {
    return this._trim(agent.messages)
  }

  override initAgent(agent: LocalAgent): void {
    super.initAgent(agent) // preserves overflow recovery
    agent.addHook(AfterInvocationEvent, (event) => {
      this._trim(event.agent.messages)
    })
  }

  private _trim(messages: LocalAgent['messages']): boolean {
    if (messages.length <= this._maxMessages) return false
    messages.splice(0, messages.length - this._maxMessages)
    return true
  }
}
// --8<-- [end:custom_conversation_manager_proactive]

async function summarizationBasic() {
  // --8<-- [start:summarization_conversation_manager_basic]
  const model = new BedrockModel({
    modelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
  })

  const agent = new Agent({
    conversationManager: new SummarizationConversationManager({ model }),
  })
  // --8<-- [end:summarization_conversation_manager_basic]
}

async function summarizationCustom() {
  // --8<-- [start:summarization_conversation_manager_custom]
  const model = new BedrockModel({
    modelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
  })

  const conversationManager = new SummarizationConversationManager({
    model,
    summaryRatio: 0.3, // Summarize 30% of messages when context reduction is needed
    preserveRecentMessages: 10, // Always keep 10 most recent messages
  })

  const agent = new Agent({
    conversationManager,
  })
  // --8<-- [end:summarization_conversation_manager_custom]
}

async function summarizationSystemPrompt() {
  // --8<-- [start:summarization_conversation_manager_system_prompt]
  const model = new BedrockModel({
    modelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
  })

  // Custom system prompt for technical conversations
  const customSystemPrompt = `You are summarizing a technical conversation. Create a concise bullet-point summary that:
- Focuses on code changes, architectural decisions, and technical solutions
- Preserves specific function names, file paths, and configuration details
- Omits conversational elements and focuses on actionable information
- Uses technical terminology appropriate for software development

Format as bullet points without conversational language.`

  const conversationManager = new SummarizationConversationManager({
    model,
    summarizationSystemPrompt: customSystemPrompt,
  })

  const agent = new Agent({
    conversationManager,
  })
  // --8<-- [end:summarization_conversation_manager_system_prompt]
}
