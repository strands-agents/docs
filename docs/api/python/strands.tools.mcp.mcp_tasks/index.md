Task-augmented tool execution configuration for MCP.

This module provides configuration types and defaults for the experimental MCP Tasks feature.

## TasksConfig

```python
class TasksConfig(TypedDict)
```

Defined in: [src/strands/tools/mcp/mcp\_tasks.py:11](https://github.com/strands-agents/sdk-python/blob/main/src/strands/tools/mcp/mcp_tasks.py#L11)

Configuration for MCP Tasks (task-augmented tool execution).

When enabled, supported tool calls use the MCP task workflow: create task -> poll for completion -> get result.

**Warnings**:

This is an experimental feature in the 2025-11-25 MCP specification and both the specification and the Strands Agents implementation of this feature are subject to change.

**Attributes**:

-   `ttl` - Task time-to-live. Defaults to 1 minute.
-   `poll_timeout` - Timeout for polling task completion. Defaults to 5 minutes.