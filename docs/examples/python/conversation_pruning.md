# Conversation Pruning

This guide demonstrates how to use the `PruningConversationManager` to selectively manage conversation history through intelligent pruning strategies.

## Overview

The `PruningConversationManager` provides a flexible approach to conversation management that:

- **Preserves Structure**: Unlike summarization, pruning maintains the conversation's message structure
- **Uses Strategies**: Employs pluggable strategies to determine what and how to prune
- **Selective Preservation**: Keeps important messages (initial and recent) while pruning middle content
- **Proactive Management**: Can automatically prune when approaching token limits
- **Context-Aware**: Makes intelligent decisions based on message content and context

## Basic Usage

### Simple Tool Result Pruning

The most common use case is compressing large tool results that can consume significant context space:

```python
from strands import Agent
from strands.agent.conversation_manager import PruningConversationManager
from strands.agent.conversation_manager.strategies import LargeToolResultPruningStrategy

# Create a strategy to compress large tool results
tool_result_strategy = LargeToolResultPruningStrategy(
    max_tool_result_tokens=10_000,  # Compress results larger than 10k tokens
    compression_template="[Tool result compressed: {original_size} → {compressed_size} tokens. Status: {status}]"
)

# Create the pruning manager
conversation_manager = PruningConversationManager(
    pruning_strategies=[tool_result_strategy],
    preserve_recent_messages=3,      # Keep 3 most recent messages
    preserve_initial_messages=1,     # Keep 1 initial message
    enable_proactive_pruning=True,   # Enable automatic pruning
    pruning_threshold=0.8,           # Prune when 80% of context is used
    context_window_size=100_000      # 100k token context window
)

agent = Agent(
    conversation_manager=conversation_manager
)

# The agent will now automatically compress large tool results
# and proactively prune when the conversation grows too large
```

### Multiple Pruning Strategies

You can combine multiple strategies for comprehensive pruning:

```python
from strands import Agent
from strands.agent.conversation_manager import PruningConversationManager
from strands.agent.conversation_manager.strategies import LargeToolResultPruningStrategy

# Strategy 1: Compress large tool results
tool_result_strategy = LargeToolResultPruningStrategy(
    max_tool_result_tokens=5_000
)

# You can create custom strategies by implementing the PruningStrategy interface
class OldMessagePruningStrategy:
    """Custom strategy to remove very old messages."""
    
    def should_prune_message(self, message, context):
        # Prune messages that are more than 20 messages old
        return context["message_index"] < context["total_messages"] - 20
    
    def prune_message(self, message, agent):
        # Remove the message entirely
        return None
    
    def get_strategy_name(self):
        return "OldMessagePruningStrategy"

old_message_strategy = OldMessagePruningStrategy()

# Combine strategies
conversation_manager = PruningConversationManager(
    pruning_strategies=[tool_result_strategy, old_message_strategy],
    preserve_recent_messages=5,
    preserve_initial_messages=2
)

agent = Agent(conversation_manager=conversation_manager)
```

## Advanced Configuration

### Fine-Tuning Preservation Settings

Control exactly which messages are preserved during pruning:

```python
conversation_manager = PruningConversationManager(
    pruning_strategies=[LargeToolResultPruningStrategy()],
    preserve_initial_messages=3,     # Keep first 3 messages (system prompt, initial exchange)
    preserve_recent_messages=5,      # Keep last 5 messages (recent context)
    enable_proactive_pruning=True,
    pruning_threshold=0.6,           # More aggressive - prune at 60% capacity
    context_window_size=150_000
)
```

### Reactive vs Proactive Pruning

```python
# Reactive only - prune only when context window is exceeded
reactive_manager = PruningConversationManager(
    pruning_strategies=[LargeToolResultPruningStrategy()],
    enable_proactive_pruning=False   # Disable proactive pruning
)

# Proactive - prune before hitting limits
proactive_manager = PruningConversationManager(
    pruning_strategies=[LargeToolResultPruningStrategy()],
    enable_proactive_pruning=True,
    pruning_threshold=0.7,           # Prune when 70% full
    context_window_size=200_000
)
```

## Custom Pruning Strategies

Create your own pruning strategies by implementing the `PruningStrategy` interface:

```python
from strands.agent.conversation_manager.pruning_conversation_manager import PruningStrategy
from strands.types.content import Message
from typing import Optional

class TokenBasedPruningStrategy(PruningStrategy):
    """Prune messages based on token count."""
    
    def __init__(self, max_message_tokens: int = 1000):
        self.max_message_tokens = max_message_tokens
    
    def should_prune_message(self, message: Message, context) -> bool:
        """Prune messages that exceed the token limit."""
        return context["token_count"] > self.max_message_tokens
    
    def prune_message(self, message: Message, agent) -> Optional[Message]:
        """Truncate the message content."""
        pruned_message = message.copy()
        
        for content in pruned_message.get("content", []):
            if "text" in content:
                text = content["text"]
                if len(text) > 500:  # Truncate long text
                    content["text"] = text[:500] + "... [truncated]"
        
        return pruned_message
    
    def get_strategy_name(self) -> str:
        return "TokenBasedPruningStrategy"

# Use the custom strategy
custom_strategy = TokenBasedPruningStrategy(max_message_tokens=2000)
conversation_manager = PruningConversationManager(
    pruning_strategies=[custom_strategy]
)
```

### Content-Aware Pruning Strategy

Create strategies that understand message content:

```python
class DebugMessagePruningStrategy(PruningStrategy):
    """Remove debug and logging messages to save context space."""
    
    def should_prune_message(self, message: Message, context) -> bool:
        """Identify debug messages by content patterns."""
        for content in message.get("content", []):
            if "text" in content:
                text = content["text"].lower()
                # Look for debug patterns
                debug_patterns = ["debug:", "log:", "trace:", "verbose:"]
                if any(pattern in text for pattern in debug_patterns):
                    return True
        return False
    
    def prune_message(self, message: Message, agent) -> Optional[Message]:
        """Remove debug messages entirely."""
        return None  # Remove the message completely
    
    def get_strategy_name(self) -> str:
        return "DebugMessagePruningStrategy"
```

## Tool Result Compression

The `LargeToolResultPruningStrategy` provides sophisticated compression for tool results:

```python
# Detailed configuration for tool result compression
tool_strategy = LargeToolResultPruningStrategy(
    max_tool_result_tokens=25_000,   # Compress results larger than 25k tokens
    compression_template=(
        "[COMPRESSED] Original: {original_size} tokens → Compressed: {compressed_size} tokens\n"
        "Status: {status}\n"
        "--- Compressed Content Below ---"
    ),
    enable_llm_compression=False     # Use simple compression (LLM compression not yet implemented)
)

conversation_manager = PruningConversationManager(
    pruning_strategies=[tool_strategy],
    preserve_recent_messages=4,
    preserve_initial_messages=2
)
```

### Understanding Tool Result Compression

The strategy compresses tool results by:

1. **Text Truncation**: Long text content is truncated with indicators
2. **JSON Summarization**: Large JSON objects are replaced with metadata and samples
3. **Metadata Preservation**: Tool status and IDs are always preserved
4. **Compression Notes**: Clear indicators show what was compressed

Example of compressed output:
```
[Tool result compressed: 15000 tokens → 500 tokens. Status: success]
{
  "_compressed": true,
  "_n_original_keys": 150,
  "_size": 15000,
  "_type": "dict",
  "sample_key_1": "sample_value_1",
  "sample_key_2": "sample_value_2"
}
```

## Monitoring and Debugging

### Tracking Pruning Activity

```python
# Access pruning statistics
print(f"Messages removed: {conversation_manager.removed_message_count}")

# Get current state for debugging
state = conversation_manager.get_state()
print(f"Manager state: {state}")
```

### Logging Pruning Decisions

Enable logging to see pruning decisions:

```python
import logging

# Enable debug logging for pruning
logging.getLogger("strands.agent.conversation_manager.pruning_conversation_manager").setLevel(logging.DEBUG)
logging.getLogger("strands.agent.conversation_manager.strategies.tool_result_pruning").setLevel(logging.DEBUG)

# Now you'll see detailed logs about pruning decisions
```

## Best Practices

### 1. Choose Appropriate Thresholds

```python
# For long-running conversations with large tool results
conversation_manager = PruningConversationManager(
    pruning_strategies=[LargeToolResultPruningStrategy(max_tool_result_tokens=10_000)],
    pruning_threshold=0.6,           # Prune early to avoid context overflow
    preserve_recent_messages=5,      # Keep enough recent context
    preserve_initial_messages=2      # Preserve system setup
)
```

### 2. Preserve Critical Messages

```python
# For conversations where initial setup is crucial
conversation_manager = PruningConversationManager(
    pruning_strategies=[LargeToolResultPruningStrategy()],
    preserve_initial_messages=5,     # Keep more initial context
    preserve_recent_messages=3,      # Standard recent context
    pruning_threshold=0.8            # Less aggressive pruning
)
```

### 3. Combine with Other Managers

You can switch between different conversation managers based on use case:

```python
from strands.agent.conversation_manager import SummarizingConversationManager

# Use pruning for tool-heavy conversations
pruning_manager = PruningConversationManager(
    pruning_strategies=[LargeToolResultPruningStrategy()]
)

# Use summarizing for text-heavy conversations  
summarizing_manager = SummarizingConversationManager()

# Switch based on conversation characteristics
if has_many_tool_results:
    agent.conversation_manager = pruning_manager
else:
    agent.conversation_manager = summarizing_manager
```

## Common Use Cases

### 1. API Integration Agents

For agents that make many API calls with large responses:

```python
api_strategy = LargeToolResultPruningStrategy(
    max_tool_result_tokens=5_000,    # API responses can be large
    compression_template="[API Response compressed: {original_size} → {compressed_size} tokens]"
)

conversation_manager = PruningConversationManager(
    pruning_strategies=[api_strategy],
    preserve_recent_messages=4,      # Keep recent API context
    pruning_threshold=0.7
)
```

### 2. Data Analysis Agents

For agents processing large datasets:

```python
data_strategy = LargeToolResultPruningStrategy(
    max_tool_result_tokens=15_000,   # Data outputs can be very large
)

conversation_manager = PruningConversationManager(
    pruning_strategies=[data_strategy],
    preserve_initial_messages=3,     # Keep data setup context
    preserve_recent_messages=5,      # Keep recent analysis
    pruning_threshold=0.6            # Aggressive pruning for large data
)
```

### 3. Code Generation Agents

For agents that generate and execute code:

```python
# Custom strategy for code execution results
class CodeExecutionPruningStrategy(PruningStrategy):
    def should_prune_message(self, message, context):
        # Prune large code execution outputs
        if context["has_tool_result"]:
            for content in message.get("content", []):
                if "toolResult" in content:
                    # Check if it's a code execution result
                    tool_result = content["toolResult"]
                    if "code_execution" in str(tool_result).lower():
                        return context["token_count"] > 2000
        return False
    
    def prune_message(self, message, agent):
        # Compress code execution results
        pruned_message = message.copy()
        for content in pruned_message.get("content", []):
            if "toolResult" in content:
                result = content["toolResult"]
                if result.get("content"):
                    # Keep only first and last few lines of output
                    for result_content in result["content"]:
                        if "text" in result_content:
                            lines = result_content["text"].split('\n')
                            if len(lines) > 20:
                                compressed = (
                                    '\n'.join(lines[:5]) + 
                                    f'\n... [{len(lines)-10} lines omitted] ...\n' +
                                    '\n'.join(lines[-5:])
                                )
                                result_content["text"] = compressed
        return pruned_message
    
    def get_strategy_name(self):
        return "CodeExecutionPruningStrategy"

code_strategy = CodeExecutionPruningStrategy()
conversation_manager = PruningConversationManager(
    pruning_strategies=[code_strategy],
    preserve_recent_messages=3
)
```

This comprehensive guide shows how to effectively use conversation pruning to manage context while preserving important information and conversation structure.