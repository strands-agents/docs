"""
Conversation Pruning Example

This example demonstrates how to use the PruningConversationManager to intelligently
manage conversation history by selectively pruning messages while preserving structure.
"""

from strands import Agent
from strands.agent.conversation_manager import PruningConversationManager
from strands.agent.conversation_manager.strategies import LargeToolResultPruningStrategy
from strands.agent.conversation_manager.pruning_conversation_manager import PruningStrategy
from strands.types.content import Message
from strands.models import AnthropicModel
from typing import Optional
import json


def basic_pruning_example():
    """Demonstrate basic conversation pruning with tool result compression."""
    print("=== Basic Pruning Example ===")
    
    # Create a strategy to compress large tool results
    tool_result_strategy = LargeToolResultPruningStrategy(
        max_tool_result_tokens=1000,  # Compress results larger than 1k tokens
        compression_template="[Compressed: {original_size} → {compressed_size} tokens. Status: {status}]"
    )
    
    # Create the pruning conversation manager
    conversation_manager = PruningConversationManager(
        pruning_strategies=[tool_result_strategy],
        preserve_recent_messages=2,      # Keep 2 most recent messages
        preserve_initial_messages=1,     # Keep 1 initial message
        enable_proactive_pruning=True,   # Enable automatic pruning
        pruning_threshold=0.7,           # Prune when 70% of context is used
        context_window_size=10_000       # Small context for demo
    )
    
    # Create agent with pruning manager
    model = AnthropicModel(model_id="claude-3-5-sonnet-20241022")
    agent = Agent(
        model=model,
        conversation_manager=conversation_manager
    )
    
    print(f"Created agent with pruning manager")
    print(f"Preserve recent: {conversation_manager.preserve_recent_messages}")
    print(f"Preserve initial: {conversation_manager.preserve_initial_messages}")
    print(f"Proactive pruning: {conversation_manager.enable_proactive_pruning}")
    print(f"Pruning threshold: {conversation_manager.pruning_threshold}")
    
    return agent


def custom_pruning_strategy_example():
    """Demonstrate creating and using custom pruning strategies."""
    print("\n=== Custom Pruning Strategy Example ===")
    
    class DebugMessagePruningStrategy(PruningStrategy):
        """Custom strategy to remove debug messages."""
        
        def should_prune_message(self, message: Message, context) -> bool:
            """Identify debug messages by content patterns."""
            for content in message.get("content", []):
                if "text" in content:
                    text = content["text"].lower()
                    # Look for debug patterns
                    debug_patterns = ["debug:", "log:", "trace:", "[debug]"]
                    if any(pattern in text for pattern in debug_patterns):
                        return True
            return False
        
        def prune_message(self, message: Message, agent) -> Optional[Message]:
            """Remove debug messages entirely."""
            return None  # Remove the message completely
        
        def get_strategy_name(self) -> str:
            return "DebugMessagePruningStrategy"
    
    class LongMessagePruningStrategy(PruningStrategy):
        """Custom strategy to truncate very long messages."""
        
        def __init__(self, max_length: int = 500):
            self.max_length = max_length
        
        def should_prune_message(self, message: Message, context) -> bool:
            """Prune messages that are too long."""
            return context.get("token_count", 0) > 200  # Rough token estimate
        
        def prune_message(self, message: Message, agent) -> Optional[Message]:
            """Truncate long messages."""
            pruned_message = message.copy()
            
            for content in pruned_message.get("content", []):
                if "text" in content:
                    text = content["text"]
                    if len(text) > self.max_length:
                        content["text"] = text[:self.max_length] + "... [truncated]"
            
            return pruned_message
        
        def get_strategy_name(self) -> str:
            return "LongMessagePruningStrategy"
    
    # Create custom strategies
    debug_strategy = DebugMessagePruningStrategy()
    long_message_strategy = LongMessagePruningStrategy(max_length=300)
    tool_result_strategy = LargeToolResultPruningStrategy(max_tool_result_tokens=500)
    
    # Combine multiple strategies
    conversation_manager = PruningConversationManager(
        pruning_strategies=[debug_strategy, long_message_strategy, tool_result_strategy],
        preserve_recent_messages=3,
        preserve_initial_messages=1,
        enable_proactive_pruning=True,
        pruning_threshold=0.6
    )
    
    model = AnthropicModel(model_id="claude-3-5-sonnet-20241022")
    agent = Agent(
        model=model,
        conversation_manager=conversation_manager
    )
    
    print(f"Created agent with {len(conversation_manager.pruning_strategies)} custom strategies:")
    for strategy in conversation_manager.pruning_strategies:
        print(f"  - {strategy.get_strategy_name()}")
    
    return agent


def simulate_conversation_with_pruning(agent: Agent):
    """Simulate a conversation that will trigger pruning."""
    print("\n=== Simulating Conversation with Pruning ===")
    
    # Simulate adding messages that would trigger pruning
    # Note: In a real scenario, these would come from actual agent interactions
    
    # Add initial message
    initial_message = {
        "role": "user",
        "content": [{"text": "Hello, I need help with data analysis."}]
    }
    agent.messages.append(initial_message)
    
    # Add some regular messages
    messages_to_add = [
        {"role": "assistant", "content": [{"text": "I'd be happy to help with data analysis!"}]},
        {"role": "user", "content": [{"text": "Debug: Starting analysis process..."}]},  # Should be pruned
        {"role": "assistant", "content": [{"text": "Let me analyze your data step by step."}]},
        {"role": "user", "content": [{"text": "This is a very long message that contains a lot of detailed information about the data analysis requirements and specifications that might need to be truncated to save context space in the conversation history management system."}]},  # Should be truncated
        {"role": "assistant", "content": [{"text": "I understand your requirements."}]},
        {"role": "user", "content": [{"text": "Log: Processing data batch 1 of 100..."}]},  # Should be pruned
        {"role": "assistant", "content": [{"text": "Recent response 1"}]},  # Should be preserved
        {"role": "user", "content": [{"text": "Recent message 2"}]},  # Should be preserved
    ]
    
    for msg in messages_to_add:
        agent.messages.append(msg)
    
    print(f"Added {len(messages_to_add) + 1} messages to conversation")
    print(f"Total messages before pruning: {len(agent.messages)}")
    
    # Manually trigger pruning (normally this happens automatically)
    original_count = len(agent.messages)
    try:
        agent.conversation_manager.reduce_context(agent)
        print(f"Pruning completed successfully")
        print(f"Messages after pruning: {len(agent.messages)}")
        print(f"Messages removed: {agent.conversation_manager.removed_message_count}")
        
        # Show remaining messages
        print("\nRemaining messages:")
        for i, msg in enumerate(agent.messages):
            role = msg["role"]
            content_preview = str(msg["content"])[:100] + "..." if len(str(msg["content"])) > 100 else str(msg["content"])
            print(f"  {i+1}. [{role}] {content_preview}")
            
    except Exception as e:
        print(f"Pruning failed: {e}")


def demonstrate_proactive_pruning():
    """Demonstrate proactive pruning based on token thresholds."""
    print("\n=== Proactive Pruning Demonstration ===")
    
    # Create a manager with very low threshold for demo
    conversation_manager = PruningConversationManager(
        pruning_strategies=[LargeToolResultPruningStrategy(max_tool_result_tokens=100)],
        preserve_recent_messages=2,
        preserve_initial_messages=1,
        enable_proactive_pruning=True,
        pruning_threshold=0.3,  # Very low threshold for demo
        context_window_size=1000  # Very small context window for demo
    )
    
    model = AnthropicModel(model_id="claude-3-5-sonnet-20241022")
    agent = Agent(
        model=model,
        conversation_manager=conversation_manager
    )
    
    # Add messages that will exceed the threshold
    large_messages = [
        {"role": "user", "content": [{"text": "Initial message for context."}]},
        {"role": "assistant", "content": [{"text": "This is a large message with lots of content that will help demonstrate the proactive pruning functionality when the conversation grows beyond the configured threshold limits."}]},
        {"role": "user", "content": [{"text": "Another large message with substantial content that adds to the token count and helps trigger the proactive pruning mechanism built into the conversation manager."}]},
        {"role": "assistant", "content": [{"text": "Yet another substantial response that contributes to the growing conversation history and token usage."}]},
        {"role": "user", "content": [{"text": "Recent message 1"}]},  # Should be preserved
        {"role": "assistant", "content": [{"text": "Recent message 2"}]},  # Should be preserved
    ]
    
    for msg in large_messages:
        agent.messages.append(msg)
    
    print(f"Added {len(large_messages)} messages")
    print(f"Checking if proactive pruning should trigger...")
    
    # Check if proactive pruning would be triggered
    should_prune = agent.conversation_manager._should_prune_proactively(agent)
    print(f"Should prune proactively: {should_prune}")
    
    if should_prune:
        print("Triggering proactive pruning...")
        agent.conversation_manager.apply_management(agent)
        print(f"Messages after proactive pruning: {len(agent.messages)}")
    else:
        print("Proactive pruning threshold not reached")


def demonstrate_tool_result_compression():
    """Demonstrate tool result compression functionality."""
    print("\n=== Tool Result Compression Demonstration ===")
    
    # Create a strategy specifically for tool result compression
    tool_strategy = LargeToolResultPruningStrategy(
        max_tool_result_tokens=200,  # Low threshold for demo
        compression_template="[COMPRESSED TOOL RESULT] Original: {original_size} tokens → Compressed: {compressed_size} tokens | Status: {status}"
    )
    
    conversation_manager = PruningConversationManager(
        pruning_strategies=[tool_strategy],
        preserve_recent_messages=2,
        preserve_initial_messages=1
    )
    
    model = AnthropicModel(model_id="claude-3-5-sonnet-20241022")
    agent = Agent(
        model=model,
        conversation_manager=conversation_manager
    )
    
    # Create a message with a large tool result
    large_tool_result = {
        "role": "user",
        "content": [{
            "toolResult": {
                "toolUseId": "test-123",
                "status": "success",
                "content": [{
                    "text": "This is a very large tool result that contains extensive data analysis output with detailed statistics, multiple data points, comprehensive analysis results, and verbose logging information that would normally consume significant context space in the conversation history." * 5
                }, {
                    "json": {
                        "data": [{"id": i, "value": f"item_{i}", "details": f"detailed_info_{i}"} for i in range(50)],
                        "metadata": {"total_items": 50, "processing_time": "2.5s", "status": "completed"},
                        "summary": {"key_findings": ["finding_1", "finding_2", "finding_3"], "recommendations": ["rec_1", "rec_2"]}
                    }
                }]
            }
        }]
    }
    
    # Add messages including the large tool result
    messages = [
        {"role": "user", "content": [{"text": "Please analyze this data."}]},
        {"role": "assistant", "content": [{"toolUse": {"toolUseId": "test-123", "name": "analyze_data", "input": {}}}]},
        large_tool_result,  # This should be compressed
        {"role": "assistant", "content": [{"text": "Recent response"}]},
        {"role": "user", "content": [{"text": "Recent user message"}]}
    ]
    
    for msg in messages:
        agent.messages.append(msg)
    
    print(f"Added {len(messages)} messages including large tool result")
    print("Original tool result size:", len(str(large_tool_result)))
    
    # Trigger pruning to compress the tool result
    try:
        agent.conversation_manager.reduce_context(agent)
        print("Tool result compression completed")
        
        # Find and display the compressed tool result
        for i, msg in enumerate(agent.messages):
            for content in msg.get("content", []):
                if "toolResult" in content:
                    print(f"\nCompressed tool result in message {i+1}:")
                    tool_result = content["toolResult"]
                    for result_content in tool_result.get("content", []):
                        if "text" in result_content:
                            print(f"  Text: {result_content['text'][:200]}...")
                        elif "json" in result_content:
                            print(f"  JSON: {str(result_content['json'])[:200]}...")
                    
    except Exception as e:
        print(f"Tool result compression failed: {e}")


def main():
    """Run all pruning examples."""
    print("Conversation Pruning Examples")
    print("=" * 50)
    
    try:
        # Basic pruning example
        agent1 = basic_pruning_example()
        
        # Custom strategies example
        agent2 = custom_pruning_strategy_example()
        
        # Simulate conversation with pruning
        simulate_conversation_with_pruning(agent2)
        
        # Demonstrate proactive pruning
        demonstrate_proactive_pruning()
        
        # Demonstrate tool result compression
        demonstrate_tool_result_compression()
        
        print("\n" + "=" * 50)
        print("All pruning examples completed successfully!")
        
    except Exception as e:
        print(f"Error running examples: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()