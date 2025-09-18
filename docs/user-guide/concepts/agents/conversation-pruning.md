# Conversation Pruning

Conversation pruning is an intelligent approach to managing conversation history that selectively compresses, truncates, or removes messages while preserving the overall conversation structure and flow. Unlike summarization which collapses multiple messages into a single summary, pruning maintains the message-by-message structure while reducing the total context size.

## Core Concepts

### What is Pruning?

Pruning operates on individual messages within a conversation, applying different strategies to reduce their size or remove them entirely. The key characteristics of pruning are:

- **Selective Processing**: Only certain messages are modified based on configurable criteria
- **Structure Preservation**: The conversation maintains its original message sequence and roles
- **Strategy-Based**: Uses pluggable strategies to determine what and how to prune
- **Context-Aware**: Makes decisions based on message content, position, and metadata

### Pruning vs. Other Approaches

| Approach | Structure | Content | Use Case |
|----------|-----------|---------|----------|
| **Sliding Window** | Removes oldest messages | Preserves recent messages exactly | Simple, predictable context management |
| **Summarization** | Collapses multiple messages into summaries | Condenses information | Preserving historical context in condensed form |
| **Pruning** | Maintains message structure | Selectively modifies individual messages | Fine-grained control over specific content types |

### When to Use Pruning

Pruning is particularly effective when:

- **Tool Results are Large**: API responses, data analysis outputs, or file contents consume significant context
- **Selective Preservation is Needed**: Some messages are more important than others
- **Structure Matters**: The conversation flow and message sequence must be maintained
- **Content-Specific Management**: Different types of content need different handling strategies

## Architecture

### PruningConversationManager

The `PruningConversationManager` is the central component that orchestrates the pruning process:

```python
from strands.agent.conversation_manager import PruningConversationManager

manager = PruningConversationManager(
    pruning_strategies=[...],        # List of strategies to apply
    preserve_initial_messages=1,     # Messages to never prune from start
    preserve_recent_messages=2,      # Messages to never prune from end
    enable_proactive_pruning=True,   # Prune before hitting limits
    pruning_threshold=0.7,           # When to trigger proactive pruning
    context_window_size=200_000      # Total context window size
)
```

### Pruning Strategies

Strategies implement the `PruningStrategy` interface and define:

1. **`should_prune_message()`**: Determines if a message should be pruned
2. **`prune_message()`**: Performs the actual pruning operation
3. **`get_strategy_name()`**: Returns a human-readable strategy name

```python
from strands.agent.conversation_manager.pruning_conversation_manager import PruningStrategy

class CustomPruningStrategy(PruningStrategy):
    def should_prune_message(self, message, context):
        # Decision logic here
        return True  # or False
    
    def prune_message(self, message, agent):
        # Pruning logic here
        return modified_message  # or None to remove
    
    def get_strategy_name(self):
        return "CustomPruningStrategy"
```

### Message Context

The `MessageContext` provides rich information for pruning decisions:

```python
{
    "token_count": 1500,           # Estimated tokens in message
    "has_tool_use": False,         # Contains tool use content
    "has_tool_result": True,       # Contains tool result content
    "message_index": 5,            # Position in conversation
    "total_messages": 10           # Total messages in conversation
}
```

## Pruning Process

### 1. Context Analysis

The `PruningContext` analyzes the entire conversation to provide:

- Token count estimates for each message
- Content type detection (tool use, tool results, text)
- Message positioning and relationships
- Overall conversation statistics

### 2. Message Evaluation

For each message in the prunable range (excluding preserved initial and recent messages):

1. **Strategy Consultation**: Each strategy evaluates if the message should be pruned
2. **Pruning Decision**: If any strategy indicates pruning, the message is processed
3. **Pruning Execution**: The first matching strategy performs the pruning operation

### 3. Preservation Rules

Messages are automatically preserved based on position:

- **Initial Messages**: First N messages (system prompts, conversation setup)
- **Recent Messages**: Last N messages (current context, recent exchanges)
- **Prunable Range**: Middle messages that can be modified or removed

```
[Initial Messages] [Prunable Messages] [Recent Messages]
     Preserved         Can be Pruned       Preserved
```

### 4. Validation and Application

After pruning:

1. **Effectiveness Check**: Validates that pruning actually reduced context size
2. **Message Update**: Applies the pruned messages to the agent's conversation
3. **Statistics Update**: Tracks removed message counts for session management

## Built-in Strategies

### LargeToolResultPruningStrategy

The `LargeToolResultPruningStrategy` compresses large tool results while preserving essential information:

**Features:**
- **Token-based Thresholds**: Configurable size limits for tool results
- **Content-aware Compression**: Different handling for text, JSON, and binary content
- **Metadata Preservation**: Maintains tool IDs, status, and execution context
- **Compression Indicators**: Clear markers showing what was compressed

**Configuration:**
```python
from strands.agent.conversation_manager.strategies import LargeToolResultPruningStrategy

strategy = LargeToolResultPruningStrategy(
    max_tool_result_tokens=50_000,   # Size threshold
    compression_template="[Compressed: {original_size} → {compressed_size} tokens]",
    enable_llm_compression=False     # Future feature
)
```

**Compression Techniques:**

1. **Text Truncation**: Long text content is truncated with clear indicators
2. **JSON Summarization**: Large JSON objects become metadata with samples
3. **Binary Handling**: Document and image content size estimation

Example compressed output:
```json
{
  "toolUseId": "abc123",
  "status": "success",
  "content": [
    {
      "text": "[Compressed: 15000 → 500 tokens]"
    },
    {
      "json": {
        "_compressed": true,
        "_n_original_keys": 150,
        "_size": 15000,
        "_type": "dict",
        "sample_key": "sample_value"
      }
    }
  ]
}
```

## Proactive vs. Reactive Pruning

### Reactive Pruning

Triggered when the context window is exceeded:

- **Event-Driven**: Responds to context overflow exceptions
- **Emergency Response**: Applied when limits are already reached
- **Aggressive**: May need to remove more content to fit within limits

### Proactive Pruning

Triggered before reaching context limits:

- **Threshold-Based**: Activates when context usage exceeds configured percentage
- **Preventive**: Avoids context overflow situations
- **Gradual**: Can apply lighter pruning since limits aren't yet reached

```python
# Configure proactive pruning
manager = PruningConversationManager(
    pruning_strategies=[...],
    enable_proactive_pruning=True,
    pruning_threshold=0.7,           # Prune at 70% capacity
    context_window_size=200_000      # Total context size
)
```

## Custom Strategy Development

### Strategy Interface

Implement the three required methods:

```python
from strands.agent.conversation_manager.pruning_conversation_manager import PruningStrategy
from strands.types.content import Message
from typing import Optional

class MyCustomStrategy(PruningStrategy):
    def should_prune_message(self, message: Message, context) -> bool:
        """
        Determine if this message should be pruned.
        
        Args:
            message: The message to evaluate
            context: MessageContext with metadata
            
        Returns:
            True if the message should be pruned
        """
        # Your decision logic here
        return context["token_count"] > 1000
    
    def prune_message(self, message: Message, agent) -> Optional[Message]:
        """
        Perform the pruning operation.
        
        Args:
            message: The message to prune
            agent: Agent instance for context
            
        Returns:
            Modified message, or None to remove entirely
        """
        # Your pruning logic here
        return modified_message
    
    def get_strategy_name(self) -> str:
        """Return a descriptive name for this strategy."""
        return "MyCustomStrategy"
```

### Common Patterns

**Content-Based Pruning:**
```python
def should_prune_message(self, message, context):
    for content in message.get("content", []):
        if "text" in content:
            text = content["text"].lower()
            if "debug" in text or "verbose" in text:
                return True
    return False
```

**Position-Based Pruning:**
```python
def should_prune_message(self, message, context):
    # Prune messages in the middle third of conversation
    total = context["total_messages"]
    index = context["message_index"]
    return total // 3 <= index <= 2 * total // 3
```

**Size-Based Pruning:**
```python
def should_prune_message(self, message, context):
    return context["token_count"] > self.max_tokens
```

**Role-Based Pruning:**
```python
def should_prune_message(self, message, context):
    # Only prune assistant messages, preserve user messages
    return message.get("role") == "assistant"
```

### Pruning Operations

**Message Removal:**
```python
def prune_message(self, message, agent):
    return None  # Remove message entirely
```

**Content Truncation:**
```python
def prune_message(self, message, agent):
    pruned = message.copy()
    for content in pruned.get("content", []):
        if "text" in content and len(content["text"]) > 500:
            content["text"] = content["text"][:500] + "... [truncated]"
    return pruned
```

**Content Replacement:**
```python
def prune_message(self, message, agent):
    return {
        "role": message["role"],
        "content": [{"text": "[Message compressed due to size]"}]
    }
```

## Best Practices

### Strategy Selection

1. **Start Simple**: Begin with built-in strategies like `LargeToolResultPruningStrategy`
2. **Combine Strategies**: Use multiple strategies for comprehensive pruning
3. **Test Thoroughly**: Validate that pruning preserves essential information
4. **Monitor Impact**: Track pruning effectiveness and conversation quality

### Configuration Guidelines

**Preservation Settings:**
- **Initial Messages**: Include system prompts and conversation setup (1-3 messages)
- **Recent Messages**: Maintain current context and recent exchanges (2-5 messages)
- **Balance**: Ensure enough messages remain for coherent conversation

**Threshold Settings:**
- **Conservative**: 0.8-0.9 for critical applications
- **Balanced**: 0.6-0.7 for general use
- **Aggressive**: 0.4-0.5 for resource-constrained environments

**Strategy Parameters:**
- **Tool Results**: Start with 10k-50k token limits
- **Text Content**: Consider 1k-5k character limits
- **Custom Logic**: Align with your specific use case requirements

### Error Handling

```python
try:
    conversation_manager.reduce_context(agent)
except ContextWindowOverflowException:
    # Fallback to more aggressive pruning
    fallback_manager = PruningConversationManager(
        pruning_strategies=[...],
        preserve_recent_messages=1,  # More aggressive
        pruning_threshold=0.5
    )
    fallback_manager.reduce_context(agent)
```

### Monitoring and Debugging

Enable logging to understand pruning decisions:

```python
import logging

# Enable pruning logs
logging.getLogger("strands.agent.conversation_manager.pruning_conversation_manager").setLevel(logging.DEBUG)
logging.getLogger("strands.agent.conversation_manager.strategies").setLevel(logging.DEBUG)

# Monitor pruning statistics
print(f"Messages removed: {manager.removed_message_count}")
print(f"Manager state: {manager.get_state()}")
```

## Integration with Session Management

Pruning integrates seamlessly with [Session Management](./session-management.md):

- **Removed Message Tracking**: The `removed_message_count` helps session loading
- **State Persistence**: Pruning statistics are saved and restored with sessions
- **Efficient Loading**: Sessions can skip loading messages that were pruned

```python
# Pruning state is automatically managed
state = agent.get_session_state()
# ... save state ...

# Restore with pruning state
new_agent = Agent(conversation_manager=PruningConversationManager(...))
new_agent.restore_session_state(state)
```

This comprehensive approach to conversation pruning provides fine-grained control over context management while maintaining conversation coherence and structure.