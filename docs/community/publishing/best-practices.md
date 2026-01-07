# Component best practices

When you build a component, you're creating something other developers will rely on. A well-designed component is easy to understand, predictable in behavior, and helpful when things go wrong.

This guide covers patterns we've seen work well across the Strands ecosystem. Following these practices helps your component integrate smoothly, makes it easier for others to contribute, and reduces support burden.

## General principles

These principles apply to all component types. They're the foundation of quality components.

| Principle | Why it matters | How to apply |
|-----------|----------------|--------------|
| Clear naming | Descriptive names help agents and developers understand what tools do | Use verb-noun pairs like `search_database`, not ambiguous names like `query` |
| Single responsibility | Each tool does one thing well | Split complex operations into multiple focused tools |
| Detailed docstrings | Agents rely on docstrings to understand when and how to use tools | Include parameter explanations, examples, and edge cases |
| Error handling | Clear messages guide users to solutions | Catch specific exceptions and provide actionable error messages |
| Type hints | Better IDE support and agent understanding | Use type annotations on all parameters and returns |

**Additional guidance:**

- **Make defaults sensible** — Choose default values that work for 80% of use cases
- **Document requirements** — Specify API keys, credentials, or dependencies upfront
- **Version your API carefully** — Breaking changes require major version bumps
- **Test edge cases** — Cover error conditions, empty inputs, and boundary values

## Tools

Tools are functions agents can call to perform actions or retrieve information. The `@tool` decorator handles integration with the agent system.

**The most important thing is your docstring**—it's what the agent reads to understand when and how to use your tool. A well-written docstring dramatically improves tool usage accuracy.

=== "Python"

    ```python
    from strands import tool

    @tool
    def search_database(query: str, limit: int = 10) -> list[dict]:
        """
        Search the database for matching records.
        
        Args:
            query: Search query string
            limit: Maximum results to return (default: 10)
            
        Returns:
            List of matching records
            
        Example:
            >>> search_database("customer orders", limit=5)
            [{"id": 1, "name": "Order #123"}, ...]
        """
        # Implementation
        return results
    ```

=== "TypeScript"

    ```typescript
    import { tool } from "@strands-agents/sdk";

    const searchDatabase = tool({
      name: "search_database",
      description: "Search the database for matching records",
      parameters: {
        query: { type: "string", description: "Search query string" },
        limit: { type: "number", description: "Maximum results (default: 10)" }
      },
      handler: async ({ query, limit = 10 }) => {
        // Implementation
        return results;
      }
    });
    ```

We recommend studying these examples from the official tools repo. They demonstrate patterns you can apply to your own tools.

| Example | What it demonstrates | Key takeaway |
|---------|---------------------|--------------|
| [sleep](https://github.com/strands-agents/tools/blob/main/src/strands_tools/sleep.py) | Error handling patterns | How to validate inputs and provide helpful error messages |
| [browser](https://github.com/strands-agents/tools/blob/main/src/strands_tools/browser/__init__.py) | Multiple related tools | Organizing related functionality into tool collections |

## Model providers

Model providers let you integrate new LLMs with Strands. You implement the `Model` interface to wrap your model's API and translate between its format and Strands' standard format.

**Key requirements for a model provider:**

| Requirement | Description | Why it matters |
|-------------|-------------|----------------|
| `ModelConfig` pattern | Configuration via a config class | Consistent configuration across all model providers |
| `stream` method | Streaming response support | Users expect real-time responses |
| `StreamEvent` formatting | Proper event structure | Ensures compatibility with Strands event loop |
| Error handling | Translate provider errors to Strands exceptions | Consistent error experience across providers |
| Type annotations | Full typing for all methods | Better IDE support and error catching |

**Implementation guide:**

1. **Create a config class** extending `ModelConfig`
2. **Implement the `Model` interface** with `generate()` and `stream()` methods
3. **Handle streaming properly** by yielding `StreamEvent` objects
4. **Test with real API calls** to verify behavior
5. **Document configuration options** including required credentials

For detailed implementation guidance, see [Custom Model Provider documentation](../../user-guide/concepts/model-providers/custom_model_provider.md).

For a real-world example, study [strands-clova](https://github.com/aidendef/strands-clova)—it shows how to properly implement the interface and handle edge cases.

## Hooks

Hooks let you inject custom logic at agent lifecycle points. Common use cases include logging tool calls, validating inputs, modifying behavior, and collecting metrics.

**Available hook points:**

| Hook point | When it runs | Common uses |
|------------|--------------|-------------|
| `before_tool_call` | Before a tool executes | Logging, validation, input transformation |
| `after_tool_call` | After a tool completes | Logging results, metrics collection |
| `on_tool_error` | When a tool raises an exception | Error tracking, retry logic, fallbacks |

**Implementation example:**

```python
from strands import Agent

def log_tool_calls(tool_name, tool_input):
    """Log tool calls for debugging and auditing."""
    print(f"Calling {tool_name} with {tool_input}")
    
    # You can modify the input here
    # Return the (possibly modified) input
    return tool_input

def handle_tool_errors(tool_name, error):
    """Handle tool errors with custom logic."""
    print(f"Tool {tool_name} failed: {error}")
    
    # You can implement retry logic or fallbacks here
    # Raise to propagate the error, return a value to recover
    raise error

agent = Agent(
    hooks={
        "before_tool_call": log_tool_calls,
        "on_tool_error": handle_tool_errors
    }
)
```

For complete documentation, see [Hooks documentation](../../user-guide/concepts/agents/hooks.md).

## Session managers

Session managers handle conversation persistence. By default, Strands keeps conversation history in memory, which works for development but doesn't persist across restarts. For production, you'll want to persist sessions to a database or cache.

**When to build a custom session manager:**

| Use case | Backend | Why |
|----------|---------|-----|
| Fast, ephemeral sessions | Redis, Memcached | Low latency for short-lived conversations |
| Serverless, scalable persistence | DynamoDB, Firestore | Automatic scaling and pay-per-use |
| Custom storage | Your database | Integration with existing infrastructure |
| Compliance requirements | Encrypted storage | Meet regulatory requirements |

**Implementation requirements:**

1. **Implement the `SessionManager` interface** with `load()`, `save()`, and `delete()` methods
2. **Handle serialization** — Convert conversation history to/from storage format
3. **Manage session IDs** — Generate unique, stable identifiers
4. **Handle errors gracefully** — Fall back to empty history on corruption
5. **Consider performance** — Use connection pooling and caching where appropriate

**Example implementation:**

```python
from strands import Agent
from strands_redis import RedisSessionManager

# Use a custom Redis session manager
session = RedisSessionManager(
    host="localhost",
    port=6379,
    session_id="user-123",
    ttl=3600  # 1 hour expiration
)

agent = Agent(session_manager=session)
```

For more details, see [Session Management documentation](../../user-guide/concepts/agents/session-management.md).
