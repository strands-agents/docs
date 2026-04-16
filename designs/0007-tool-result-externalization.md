# Tool Result Externalization

**Status**: Proposed

**Date**: 2026-04-16

**Issue**: [#1296: Large Tool Result Externalization](https://github.com/strands-agents/sdk-python/issues/1296)

**Related**:
- [#1678: Large Content Aliasing](https://github.com/strands-agents/sdk-python/issues/1678)

**Scope**: TypeScript SDK. A parallel Python design will follow.

## Context

When a tool returns a large result (a file dump, API response, database query, or log output), the entire content enters the conversation history as a tool result message. A single oversized result can push context into overflow in one step.

The current `SlidingWindowConversationManager` handles this reactively: after a `ContextWindowOverflowError`, it replaces the result with a generic message:

```typescript
const toolResultTooLargeMessage = 'The tool result was too large!'
```

This has two problems.

1. **Data loss.** The full output is discarded permanently. The agent loses the ability to reference or reason about the content.

2. **Reactive timing.** The replacement only happens after the model has already rejected the request. The oversized result consumes context space, triggers an overflow, wastes a round-trip, and only then gets truncated.

This design proposes intercepting large tool results at execution time, before they enter the conversation. The full output is persisted to disk, and the conversation receives a truncated preview with a reference to the artifact file.

## Decision

We implement tool result externalization as a `Plugin` that hooks `AfterToolCallEvent`. If a tool result exceeds a configurable size threshold, the plugin externalizes the full output and replaces the conversation content according to a configurable strategy.

```typescript
export interface ToolResultExternalizationConfig {
  /**
   * Character count threshold for externalizing tool results.
   * Results larger than this are externalized.
   * @default 10000
   */
  sizeThreshold?: number

  /**
   * Strategy that controls how externalized results are stored and
   * what replaces them in the conversation. Defaults to
   * FileExternalizationStrategy.
   */
  strategy?: ExternalizationStrategy
}

export interface ExternalizationStrategy {
  externalize(content: string, toolName: string): Promise<string> | string
}

export class FileExternalizationStrategy implements ExternalizationStrategy {
  constructor(config?: FileExternalizationStrategyConfig) {}
  externalize(content: string, toolName: string): string { /* ... */ }
}

export interface FileExternalizationStrategyConfig {
  /** Directory to write artifact files to. @default './artifacts' */
  artifactDir?: string
  /** Number of leading characters to keep as a preview. @default 4000 */
  previewSize?: number
}
```

The `ExternalizationStrategy` interface is the extension point. The default `FileExternalizationStrategy` writes to disk and produces a text preview with an artifact path. Future strategies can implement structured aliasing ([#1678](https://github.com/strands-agents/sdk-python/issues/1678)), remote storage, or any other approach without changing the plugin itself.

When a tool result exceeds `sizeThreshold`, the hook passes the content to the strategy. The default strategy:

1. Writes the full result to an artifact file in `artifactDir`.
2. Returns a truncated preview plus a reference to the artifact path.

The replacement content looks like:

```
[Output truncated: 125,432 chars | Full output: artifacts/shell_20250416_143022.log]

<first 4,000 characters as preview>
```

This operates at tool execution time, before the result enters the conversation history. It prevents a single large result from consuming a disproportionate share of the context window. The full output is preserved on disk for debugging, auditing, or later retrieval. If the agent has a file-reading tool, the model can retrieve the full output when the preview is insufficient.

The following diagram shows where externalization fits in the agent loop:

```mermaid
sequenceDiagram
    participant Plugin as ToolResultExternalizationPlugin
    participant Agent
    participant Model
    participant Tool

    Agent->>Model: stream(agent.messages)
    Model-->>Agent: response with toolUse
    Agent->>Tool: execute tool
    Tool-->>Agent: tool result (potentially large)
    Agent->>Plugin: AfterToolCallEvent
    Note over Plugin: if result > sizeThreshold:<br/>persist full output to artifact file<br/>replace content with preview + reference
    Agent->>Agent: append tool result message
    Note over Agent: go to next cycle
```

### SDK Changes Required

**New file: `plugins/tool-result-externalization.ts`.** Contains the `ToolResultExternalizationPlugin` class and its config interface.

Artifact filenames include the tool name and a timestamp for traceability. The artifact directory is created on first write. Cleanup of artifact files is the user's responsibility.

## Developer Experience

```typescript
import { Agent, ToolResultExternalizationPlugin, FileExternalizationStrategy } from '@strands-agents/sdk'

// Default strategy with defaults
const agent = new Agent({
  tools: [dataAnalysis, apiClient, fileProcessor],
  plugins: [
    new ToolResultExternalizationPlugin({
      sizeThreshold: 10_000,
    }),
  ],
})

// Custom artifact directory
const agent = new Agent({
  tools: [dataAnalysis, apiClient, fileProcessor],
  plugins: [
    new ToolResultExternalizationPlugin({
      sizeThreshold: 10_000,
      strategy: new FileExternalizationStrategy({ artifactDir: './my-artifacts' }),
    }),
  ],
})
```

Existing behavior is completely unchanged. Agents without the plugin continue to handle large results reactively.

## Alternatives Considered

### 1. Truncation Without Persistence

The current `SlidingWindowConversationManager` already truncates large results, but discards the full output. Truncation without persistence is simpler (no file system dependency) but loses data permanently. Externalization preserves the full output for debugging and potential retrieval by the agent.

### 2. Configuring Externalization on the Agent or Tool

Instead of a plugin, externalization could be a per-tool config or an agent-level setting. This would be more discoverable but would not compose as cleanly with other plugins. The plugin pattern keeps externalization independent and opt-in.

## Consequences

### What Becomes Easier

Large tool results no longer blow up the context window or get silently discarded. The full output is preserved on disk while the conversation receives a compact preview. Agents with file-reading tools can retrieve the full output on demand.

### What Becomes Harder or Requires Attention

Externalization writes to disk, which introduces a file system dependency. Artifact files accumulate and require cleanup. The preview may not contain the information the model needs, leading to follow-up tool calls to read the artifact. The `sizeThreshold` is character-based, not token-based, which is a rough proxy. Non-text tool results (images, binary data) are not handled by this design.

### Migration

No breaking changes. The plugin is purely additive and opt-in.

## Willingness to Implement

Yes.
