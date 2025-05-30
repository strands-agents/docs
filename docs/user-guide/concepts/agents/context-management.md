# Context Management

In the Strands Agents SDK, context refers to the conversation history that provides the foundation for the agent's understanding and reasoning. This includes:

- User messages
- Agent responses
- Tool usage and results
- System prompts

As conversations grow, managing this context becomes increasingly important for several reasons:

1. **Token Limits**: Language models have fixed context windows (maximum tokens they can process)
2. **Performance**: Larger contexts require more processing time and resources
3. **Relevance**: Older messages may become less relevant to the current conversation
4. **Coherence**: Maintaining logical flow and preserving important information

## Conversation Managers

The SDK provides a flexible system for context management through the [`ConversationManager`](../../../api-reference/agent.md#strands.agent.conversation_manager.conversation_manager.ConversationManager) interface. This allows you to implement different strategies for managing conversation history. There are two key methods to implement:

1. [`apply_management`](../../../api-reference/agent.md#strands.agent.conversation_manager.conversation_manager.ConversationManager.apply_management): This method is called after each event loop cycle completes to manage the conversation history. It's responsible for applying your management strategy to the messages array, which may have been modified with tool results and assistant responses. The agent runs this method automatically after processing each user input and generating a response.

2. [`reduce_context`](../../../api-reference/agent.md#strands.agent.conversation_manager.conversation_manager.ConversationManager.reduce_context): This method is called when the model's context window is exceeded (typically due to token limits). It implements the specific strategy for reducing the window size when necessary. The agent calls this method when it encounters a context window overflow exception, giving your implementation a chance to trim the conversation history before retrying.

To manage conversations, you can either leverage one of Strands's provided managers or build your own manager that matches your requirements.

#### NullConversationManager

The [`NullConversationManager`](../../../api-reference/agent.md#strands.agent.conversation_manager.null_conversation_manager.NullConversationManager) is a simple implementation that does not modify the conversation history. It's useful for:

- Short conversations that won't exceed context limits
- Debugging purposes
- Cases where you want to manage context manually

```python
from strands import Agent
from strands.agent.conversation_manager import NullConversationManager

agent = Agent(
    conversation_manager=NullConversationManager()
)
```

#### SlidingWindowConversationManager

The [`SlidingWindowConversationManager`](../../../api-reference/agent.md#strands.agent.conversation_manager.sliding_window_conversation_manager.SlidingWindowConversationManager) implements a sliding window strategy that maintains a fixed number of recent messages. This is the default conversation manager used by the Agent class.

```python
from strands import Agent
from strands.agent.conversation_manager import SlidingWindowConversationManager

# Create a conversation manager with custom window size
conversation_manager = SlidingWindowConversationManager(
    window_size=20,  # Maximum number of messages to keep
)

agent = Agent(
    conversation_manager=conversation_manager
)
```

Key features of the `SlidingWindowConversationManager`:

- **Maintains Window Size**: Automatically removes messages from the window if the number of messages exceeds the limit.
- **Dangling Message Cleanup**: Removes incomplete message sequences to maintain valid conversation state.
- **Overflow Trimming**: In the case of a context window overflow, it will trim the oldest messages from history until the request fits in the models context window.

#### SummarizingConversationManager

The [`SummarizingConversationManager`](../../../api-reference/agent.md#strands.agent.conversation_manager.summarizing_conversation_manager.SummarizingConversationManager) extends the sliding window approach with optional summarization of older messages. Instead of simply discarding old context, it can summarize older messages to preserve important information while staying within context limits.

```python
from strands import Agent
from strands.agent.conversation_manager import SummarizingConversationManager
from strands.models import AnthropicModel

# Create a model for generating summaries
summarizing_model = AnthropicModel(
    model_id="claude-opus-4-20250514",
    max_tokens=500,  # Maximum tokens the model can generate in response
    params={
        "temperature": 0.3  # Lower temperature for more consistent summaries
    },
)

# Create the summarizing conversation manager
conversation_manager = SummarizingConversationManager(
    window_size=6,  # Maximum number of messages to keep in history
    enable_summarization=True,  # Enable the feature
    summarization_model=summarizing_model,  # Use Anthropic model for summaries
    summary_ratio=0.5,  # Summarize 50% of oldest messages
    preserve_recent_messages=3,  # Always keep 3 most recent messages
)

agent = Agent(
    conversation_manager=conversation_manager
)
```

Key features of the `SummarizingConversationManager`:

- **Intelligent Summarization**: Summarizes older context instead of discarding it, preserving important information.
- **Configurable Strategy**: Control how much of the conversation to summarize and how many recent messages to preserve.
- **Fallback Behavior**: Falls back to sliding window behavior if summarization is disabled or fails.
- **Flexible Model Support**: Use any model for generating summaries, allowing for cost optimization.
