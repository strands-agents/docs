# Extension Best Practices

When you build an extension, you're creating something other developers will rely on. A well-designed extension is easy to understand, predictable in behavior, and helpful when things go wrong.

This guide covers patterns we've seen work well across the Strands ecosystem.

## General principles

These apply to all extension types.

| Principle | Why it matters |
|-----------|----------------|
| Clear naming | Descriptive names help agents understand what tools do |
| Single responsibility | Each tool does one thing well |
| Detailed docstrings | Include parameter explanations and examples |
| Error handling | Clear messages guide users to solutions |
| Type hints | Better IDE support and agent understanding |

---

## Tools

Tools are functions agents can call. The `@tool` decorator handles the integration.

The most important thing is your docstring—it's what the agent reads to understand when and how to use your tool.

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

We recommend studying these examples from the official tools repo.

| Example | What it demonstrates |
|---------|---------------------|
| [sleep](https://github.com/strands-agents/tools/blob/main/src/strands_tools/sleep.py) | Error handling patterns |
| [browser](https://github.com/strands-agents/tools/blob/main/src/strands_tools/browser/__init__.py) | Multiple related tools |

---

## Model providers

Model providers let you integrate new LLMs with Strands. You implement the `Model` interface.

Key requirements for a model provider.

| Requirement | Description |
|-------------|-------------|
| `ModelConfig` pattern | Configuration via a config class |
| `stream` method | Streaming response support |
| `StreamEvent` formatting | Proper event structure |

→ [Custom Model Provider docs](../../user-guide/concepts/model-providers/custom_model_provider.md)

For a real-world example, see [strands-clova](https://github.com/aidendef/strands-clova).

---

## Hooks

Hooks let you inject custom logic at agent lifecycle points. Common use cases include logging, validation, and modifying tool behavior.

| Hook point | When it runs |
|------------|--------------|
| `before_tool_call` | Before a tool executes |
| `after_tool_call` | After a tool completes |
| `on_tool_error` | When a tool raises an exception |

```python
from strands import Agent

def log_tool_calls(tool_name, tool_input):
    print(f"Calling {tool_name} with {tool_input}")
    return tool_input  # Return modified input or original

agent = Agent(
    hooks={
        "before_tool_call": log_tool_calls
    }
)
```

→ [Hooks documentation](../../user-guide/concepts/agents/hooks.md)

---

## Session managers

Session managers handle conversation persistence. By default, Strands keeps history in memory. For production, you'll want to persist sessions to a database.

| Backend | Use case |
|---------|----------|
| Redis | Fast, ephemeral sessions |
| DynamoDB | Serverless, scalable persistence |
| Custom | Your own storage backend |

```python
from strands import Agent
from strands_redis import RedisSessionManager

session = RedisSessionManager(
    host="localhost",
    port=6379,
    session_id="user-123"
)

agent = Agent(session_manager=session)
```

→ [Session Management docs](../../user-guide/concepts/agents/session-management.md)
