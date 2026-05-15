# Long-Term Memory

**Status**: Proposed

**Date**: 2026-05-14

**Issue**: TBD

**Scope**: TypeScript SDK

## Context

Strands agents today are stateless across sessions. Every conversation starts from zero: the agent can't recall user preferences, past decisions, or accumulated knowledge. When information leaves the context window, it's gone unless the developer builds custom persistence. The SDK provides session management (persisting conversation state) and context management (handling context window size within a session), but neither addresses cross-session knowledge. An agent that assists a user daily should be able to remember what it learned yesterday without replaying the full history. Prototyping a memory-enabled agent today requires wiring up a vector store, writing extraction logic, managing tool registration, and handling multi-tenancy. This should be supported natively.

This design proposes a `MemoryManager` primitive that owns long-term knowledge: persisting facts to configurable backends, recalling them via tools or system prompt injection, and optionally extracting them from conversations. The primitive solves three distinct problems:

1. **Knowledge Retrieval**: how the agent searches and surfaces stored knowledge at the right time
2. **Knowledge Ingestion**: how knowledge enters the system (triggers, writes, deduplication)
3. **Fact Extraction**: how conversation messages become structured knowledge entries (for backends that don't handle extraction server-side)

## Decision

### Architecture

`MemoryManager` is the component that gives agents persistent knowledge across sessions. It handles storing facts, recalling them when relevant, and optionally extracting them from conversations.

It is exposed as a top-level `memoryManager` parameter on `AgentConfig`, following the pattern of `contextManager` and `sessionManager`:

```typescript
new Agent({
  model,
  memoryManager: new MemoryManager({ ... }),
})
```

Under the hood, MemoryManager integrates with the agent lifecycle via hooks: registering tools at initialization, injecting knowledge before model calls, and ingesting new facts after each turn.

**Stores.** A store is a backend that holds and retrieves knowledge (a vector database, a managed service like Amazon Bedrock Knowledge Bases or AgentCore Memory, or any implementation of the store interface). MemoryManager orchestrates one or more stores, each scoped by a namespace:

```typescript
memoryManager: new MemoryManager({
  stores: [
    { store: userStore, namespace: 'user-123' },
    { store: teamStore, namespace: 'team-marketing' },
    { store: orgStore,  namespace: 'org-acme' },
  ],
})
```

Multi-store support avoids pushing multi-tenancy complexity onto the developer. A single agent can query personal, team, and organization knowledge simultaneously, with namespace isolation keeping them separate.

**Read-only vs. mutable stores.** Two interfaces: `KnowledgeStore` (search-only) and `MutableKnowledgeStore` (search + write + delete). This distinction makes multi-tenant patterns natural: team or org stores that are pre-populated externally are read-only, while a user's personal store is mutable and accepts new facts during conversation. Mutability is determined by whether the store has an ingestion configuration (see Knowledge Ingestion below).

**Shipped backends.**

| Backend | Package | Use case |
|---------|---------|----------|
| `InMemoryKnowledgeStore` | `@strands-agents/sdk` | Testing, prototyping |
| `FileKnowledgeStore` | `@strands-agents/sdk` | Local development |
| `BedrockKnowledgeBaseStore` | `@strands-agents/sdk` | Production (managed, zero-infra) |
| `AgentCoreKnowledgeStore` | `@strands-agents/memory-agentcore` | AgentCore managed memory |

The three in-SDK backends cover the prototyping → local dev → production progression without adding dependencies. Bedrock KB is the managed zero-infra option. Third-party managed memory services like AgentCore carry client dependencies and are opt-in via separate packages so the SDK stays lean.

---

### Knowledge Retrieval

The agent needs stored knowledge at the right moment, but retrieving it has a cost (latency, tokens, relevance noise). MemoryManager provides two retrieval mechanisms that offer different trade-offs between precision and reliability. Both can be used together.

#### Active Recall

Active recall lets the agent decide when memory is relevant. Instead of retrieving knowledge every turn, the agent searches on demand, only when it judges that stored knowledge would help.

This works by registering a `search_memory` tool that the agent can call like any other tool. The trade-off: active recall depends on the model recognizing when to search. If the model doesn't think to look, relevant memories stay hidden.

```typescript
const agent = new Agent({
  model,
  memoryManager: new MemoryManager({
    stores: [{ store, namespace: 'user-123' }],
    tools: true, // Agent gets search_memory tool.
  }),
})
```

When multiple stores are configured, results are interleaved by rank using store config order as the priority signal. Scores are not compared across stores because different backends produce incomparable scales. If a store fails, partial results from other stores are still returned.

#### Context Injection

Context injection guarantees that relevant knowledge is always present, at the cost of paying for retrieval every turn. This is useful when baseline context is more important than token efficiency, or when the model can't reliably judge when to search.

Enabled via `injection: true`. Each turn, MemoryManager searches stores using the last substantive user message as the query, formats results into a `<strands-memory>` block, and appends it to the system prompt. The block is stripped and re-injected fresh every turn so memories never accumulate in the prompt and each turn gets a fresh set based on the current query. The token budget and formatting are configurable via `maxTokens`, `format`, and `query` functions.

```typescript
const agent = new Agent({
  model,
  memoryManager: new MemoryManager({
    stores: [{ store, namespace: 'user-123' }],
    injection: true, // searches every turn, injects into system prompt
  }),
})
```

---

### Knowledge Ingestion

Knowledge can enter the system in two ways: the agent explicitly writes it (via a `store_memory` tool registered by MemoryManager), or MemoryManager automatically extracts it from conversation messages using an extractor (a component that distills messages into discrete facts via a model call).

MemoryManager uses triggers to control when these writes happen. A trigger is a named event that causes MemoryManager to process recent messages and write to the store. Four built-in triggers cover most use cases:

| Trigger | When | Cost |
|---------|---------------|---------------|
| `tool` | Agent calls `store_memory` | Nothing extra (agent provides content directly) |
| `perTurn` | After every agent invocation | High (model call per turn if an extractor is configured) |
| `onEviction` | Messages are evicted from the context window | Medium (only fires on eviction events) |
| `scheduled` | Every N turns (configurable via `interval`) | Controllable |

All writes are async and non-blocking. This means a fact stored in one turn may not be searchable immediately in the next (eventual consistency).

**Deduplication.** MemoryManager tracks a per-store high-water mark: a pointer to the last message that was already processed. Each trigger only processes messages beyond that mark, preventing duplicate writes. Tool-related content blocks (`toolUse`, `toolResult`) are filtered out by default before processing, since they rarely contain user-relevant knowledge.

**Custom triggers.** For cases the built-in triggers don't cover, the store interface is public and can be called directly from any lifecycle hook.

**Deletion and corrections.** `MutableKnowledgeStore.delete()` is exposed for programmatic use (compliance, cleanup), but no `delete_memory` tool is registered for the agent. Exposing deletion to the agent risks accidental data loss with no undo path. Instead, corrections are handled by storing updated facts. Newer entries take precedence via recency weighting in search results.

---

### Fact Extraction

When messages are ingested, they need to become searchable knowledge entries. Some managed backends (e.g. AgentCore Memory) handle this transformation server-side, accepting raw messages and producing structured entries internally. For self-managed backends that store only what they're given, MemoryManager can extract discrete facts from conversation messages before writing them.

Extraction is optional. It is only needed when two conditions are true: the backend doesn't handle extraction server-side, and you want MemoryManager to distill conversations into facts automatically rather than relying on the agent to provide facts via the `tool` trigger.

Each store can have its own extractor, because different stores benefit from different extraction styles. A preferences store might want pure facts ("user prefers dark mode") while a decisions store wants richer context with reasoning. `ModelExtractor` is the built-in implementation: it calls a language model to extract facts, defaulting to the agent's own model but configurable with an explicit cheaper model to reduce cost.

When no extractor is configured, messages are serialized as plain text and passed directly to the store's `add()` method. This is the correct setup for managed backends that handle extraction internally.

## Developer Experience

### Minimal: prototyping

```typescript
import { Agent, MemoryManager, InMemoryKnowledgeStore } from '@strands-agents/sdk'

const agent = new Agent({
  model,
  memoryManager: new MemoryManager({
    stores: [{ store: new InMemoryKnowledgeStore(), namespace: 'user-123', ingestion: { trigger: 'tool' } }],
  }),
})
// Agent now has search_memory and store_memory tools. Zero infrastructure.
```

### Production: Bedrock Knowledge Bases

```typescript
import { Agent, MemoryManager, BedrockKnowledgeBaseStore, ModelExtractor } from '@strands-agents/sdk'

const agent = new Agent({
  model,
  memoryManager: new MemoryManager({
    stores: [{
      store: new BedrockKnowledgeBaseStore({ knowledgeBaseId: 'KB123', dataSourceId: 'DS456' }),
      namespace: 'user-123',
      ingestion: { trigger: ['tool', 'perTurn'], extractor: new ModelExtractor({ model }) },
    }],
  }),
})
```

### Multi-tenant: personal + team + org

```typescript
const agent = new Agent({
  model,
  memoryManager: new MemoryManager({
    stores: [
      // Personal: learns from conversation
      { store: userKB, namespace: 'user-123', ingestion: { trigger: ['tool', 'perTurn'], extractor } },
      // Team: read-only, pre-populated
      { store: teamKB, namespace: 'team-marketing' },
      // Org: read-only, shared
      { store: orgKB, namespace: 'org-acme' },
    ],
  }),
})
// search_memory queries all three, merges by store priority
// store_memory writes only to stores with 'tool' trigger
```

### With context injection

```typescript
const agent = new Agent({
  model,
  memoryManager: new MemoryManager({
    stores: [{ store, namespace: 'user-123', ingestion: { trigger: 'tool' } }],
    injection: true,  // default XML format, 2000 token budget
  }),
})
```

## Alternatives Considered

### 1. Memory as a top-level Agent parameter (no MemoryManager class)

```typescript
new Agent({ memory: { stores: [...], injection: {...} } })
```

**Why rejected:** A config object doesn't provide methods (`search`, `add`, `flush`) that power users need for programmatic access. The class also owns the ingestion queue lifecycle.

### 2. Single store (no multi-store orchestration)

**Why rejected:** Forces multi-tenant patterns onto the developer. Multi-store is a customer ask for production agents.

### 3. Single `KnowledgeStore` interface with optional write methods

**Why rejected:** Optional methods push type safety to runtime. The interface split makes read-only vs mutable an explicit compile-time guarantee.


## Consequences

### What Becomes Easier

- Cross-session knowledge becomes a single parameter. No custom persistence, no manual tool registration, no vector store wiring.
- Multi-tenancy is built in via multi-store + namespacing.
- Progressive complexity: `InMemoryKnowledgeStore` (prototyping) to `BedrockKnowledgeBaseStore` (production) is changing one import.

### What Becomes Harder or Requires Attention

- **Eventual consistency**: writes are async; a fact may not be searchable in the next turn.
- **Extraction cost**: `perTurn` triggers a model call every turn. We need sensible defaults and good documentation for users to navigate this.
- **Active recall and context injection depends on model judgment**: the model must know when to search. Context injection guarantees baseline context at the cost of always paying for retrieval. We need to evaluate and baseline tool descriptions.

### Migration

No breaking changes. `memoryManager` is a new optional parameter on `AgentConfig`.

## Willingness to Implement

Yes.

---

<details>
<summary><b>Appendix A: Core Interfaces</b></summary>

### Knowledge Entry

```typescript
interface KnowledgeEntry {
  id: string
  content: string
  score?: number
  metadata?: Record<string, JSONValue>
}
```

### Store Interfaces

```typescript
// Read-only: for managed or pre-populated backends
interface KnowledgeStore {
  search(namespace: string, query: string, limit?: number): Promise<KnowledgeEntry[]>
}

// Read+write: for self-managed backends
interface MutableKnowledgeStore extends KnowledgeStore {
  add(namespace: string, content: string, metadata?: Record<string, JSONValue>): Promise<string>
  delete(namespace: string, id: string): Promise<void>
}
```

### Ingestion Pipeline

```typescript
type IngestionTrigger = 'tool' | 'perTurn' | 'onEviction' | 'scheduled'

type ContentBlockType = 'text' | 'toolUse' | 'toolResult' | 'reasoning' | 'cachePoint' | 'guardContent' | 'image' | 'video' | 'document' | 'citations'

interface MessageFilter {
  exclude: ContentBlockType[]
}

interface IngestionConfig {
  trigger: IngestionTrigger | IngestionTrigger[]
  extractor?: Extractor       // optional: if omitted, messages serialized as text
  interval?: number           // for 'scheduled': every N turns
  filter?: MessageFilter      // default: { exclude: ['toolUse', 'toolResult'] }
}

interface Extractor {
  extract(messages: MessageData[]): Promise<{ content: string; metadata?: Record<string, JSONValue> }[]>
}
```

### MemoryManager Config

```typescript
interface MemoryManagerConfig {
  stores: StoreConfig[]
  tools?: boolean | ToolsConfig   // default: true (registers search_memory, store_memory)
  injection?: boolean | InjectionConfig  // default: false (opt-in passive recall)
}

interface ToolConfig {
  name?: string
  description?: string
}

interface ToolsConfig {
  search?: boolean | ToolConfig
  store?: boolean | ToolConfig
}

type StoreConfig = ReadOnlyStoreConfig | WritableStoreConfig

interface ReadOnlyStoreConfig {
  store: KnowledgeStore
  namespace: string
  limit?: number              // max results from this store (default: 10)
}

interface WritableStoreConfig {
  store: MutableKnowledgeStore
  namespace: string
  limit?: number              // max results from this store (default: 10)
  ingestion: IngestionConfig  // required: determines when writes happen
}

interface InjectionConfig {
  format?: (entries: KnowledgeEntry[]) => string  // default: XML block format
  maxTokens?: number          // budget for injected content (default: 2000)
  query?: (messages: MessageData[]) => string     // default: last substantive user message
}
```

**`tools` resolution:**
- `true` (default): registers both `search_memory` and `store_memory`
- `false`: no tools registered (use with injection-only)
- `{ search: true, store: false }`: search only, no agent-driven writes
- `{ search: { name: 'recall' } }`: rename tool to avoid conflicts
- `{ store: { description: '...' } }`: customize tool description

**`injection` resolution:**
- `false` (default): no injection
- `true`: injection enabled with default XML format and 2000 token budget
- `{ maxTokens: 4000 }`: injection with custom budget
- `{ format: customFn }`: injection with custom format (escape hatch)

</details>

---

<details>
<summary><b>Appendix B: Implementation Details</b></summary>

### Context injection lifecycle

When injection is enabled, MemoryManager hooks into `BeforeInvocationEvent` (once per turn). The lifecycle:

1. **Strip**: Remove previous `<strands-memory>` block from system prompt
2. **Retrieve**: Use last substantive user message (>10 chars) as search query
3. **Format**: Render results as XML, respecting `maxTokens` budget
4. **Inject**: Append block to end of system prompt

If no substantive message exists or retrieval returns zero results, injection is skipped for that turn. The block is never persisted in conversation history.

### `store_memory` tool behavior

Accepts `{ entries: string[] }` (batch). Writes fan out to all stores with `'tool'` in their trigger array. Writes are async and non-blocking.

### Message filter details

`filter: { exclude: ContentBlockType[] }` strips content block types before they reach the extractor or serializer. Filter applies first. Messages that become empty after filtering are dropped entirely. Default: `exclude: ['toolUse', 'toolResult']`.

Extractors receive only unprocessed messages (tracked via per-store high-water mark).

### `strands_source` metadata

Every write is tagged to indicate content type:
- `'tool'`: agent explicitly called `store_memory`
- `'extraction'`: extractor processed messages into facts
- `'raw'`: messages serialized directly (no extractor)

### Custom triggers

```typescript
const myStore = new BedrockKnowledgeBaseStore({ ... })

agent.addHook(AfterToolCallEvent, async (event) => {
  if (event.tool.name === 'important_api') {
    await myStore.add('user-123', `API result: ${summarize(event.result)}`)
  }
})
```

</details>
