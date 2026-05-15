# Design: Long-Term Memory (L2 Knowledge Primitive)

**Status**: Proposed

**Date**: 2026-05-14

**Issue**: TBD

- [1. Problem Statement](#1-problem-statement)
- [2. The Three-Tier Model](#2-the-three-tier-model)
- [3. Key Decisions](#3-key-decisions)
- [4. Developer Experience](#4-developer-experience)
- [5. Relationship to Context Management](#5-relationship-to-context-management)
- [6. Anticipated Questions](#6-anticipated-questions)
- Appendix A: Core Interfaces
- Appendix B: Storage Backends
- Appendix C: Alternatives Considered

---

## 1. Problem Statement

Agents today are stateless across sessions. Every conversation starts from zero — the agent can't recall user preferences, past decisions, or accumulated knowledge. When messages are evicted from the context window, that information is gone unless the developer builds custom persistence.

The SDK provides session management (persisting the conversation state) and context management (handling pressure within a session), but neither addresses the cross-session knowledge problem. An agent that assists a user daily should remember what it learned yesterday without replaying the full history.

This is the [simple at any scale](https://github.com/strands-agents/docs/blob/main/team/TENETS.md) gap: prototyping a memory-enabled agent today requires wiring up a vector store, writing extraction logic, managing tool registration, and handling multi-tenancy. It should be one parameter.

---

## 2. The Three-Tier Model

Context management maps to a three-tier cache hierarchy. This design covers **L2 only**.

| Tier | What it is | Lifecycle | Owner |
|------|-----------|-----------|-------|
| **L0** | Context window — what the model sees | Per-request | `agent.messages` |
| **L1** | Session history — evicted messages | Per-session | `contextManager` ([Context Management Presets](https://github.com/strands-agents/docs/pull/831)) |
| **L2** | Long-term knowledge — facts, preferences, learned behavior | Cross-session | **`memoryManager` (this design)** |

L0 ↔ L1 is owned by `contextManager`. L2 is a separate primitive that reads from conversations (current or evicted) and writes to persistent knowledge stores that outlive any single session.

---

## 3. Key Decisions

### 3.1 MemoryManager is a Plugin, not a standalone class

**Decision:** `MemoryManager` implements `Plugin` and integrates with the agent lifecycle via hooks.

**Why:** Memory needs to react to agent lifecycle events — ingesting after each turn, injecting before model calls, registering tools at initialization. The plugin system already provides these hooks. A standalone class would need its own parallel lifecycle management or require the developer to manually wire callbacks.

**Trade-off:** Coupling to the plugin interface means MemoryManager can't be used outside of an Agent. This is acceptable — L2 memory is inherently agent-scoped (it needs conversations to learn from and a model to serve).

### 3.2 Multi-store architecture with namespacing

**Decision:** MemoryManager orchestrates multiple stores, each with its own namespace. A single agent can query personal, team, and organization knowledge simultaneously.

```typescript
memoryManager: new MemoryManager({
  stores: [
    { store: userStore, namespace: 'user-123' },
    { store: teamStore, namespace: 'team-marketing' },
    { store: orgStore,  namespace: 'org-acme' },
  ],
})
```

**Why:** Real-world agents serve users who exist within organizational hierarchies. A support agent should know the user's preferences (personal store), the team's procedures (team store), and the company's policies (org store). Forcing a single store pushes multi-tenancy complexity onto the developer.

**Trade-off:** Merged search across stores adds latency (parallel queries). For single-store use cases, this is unnecessary overhead — but the overhead is minimal (one store = one query, no merge).

**Merge strategy:** Results are interleaved by rank, with store config order as priority. The first result from each store (in config order), then the second from each, and so on. Scores are not compared across stores — different backends produce incomparable score scales. Store position in the config array is the explicit priority signal.

### 3.3 Ingestion config determines writability — no explicit flag

**Decision:** A store is writable if and only if it has an `ingestion` config. Stores without `ingestion` are search-only. This is enforced at the type level — `ingestion` is only available on `WritableStoreConfig` which requires `MutableKnowledgeStore`.

**Why:** An explicit `readOnly: true` flag would be redundant — if there's no ingestion config, there's nothing to write and no trigger to write it. The absence of config *is* the signal. This keeps configuration minimal and makes multi-tenant patterns natural: team/org stores that are pre-populated externally simply omit `ingestion`.

**Trade-off:** Less explicit than a flag. A developer reading the config must understand the convention. We mitigate this with documentation and the tool behavior: `store_memory` only targets stores with `'tool'` in their trigger — if none exist, the tool isn't registered.

**`store_memory` behavior:** The tool accepts a batch of strings (`{ entries: string[] }`), allowing the agent to store multiple facts in a single call. Writes fan out to **all** stores with `'tool'` in their trigger array (not just the first). Writes are async and non-blocking.

### 3.4 Read-only vs mutable store interfaces (interface split)

**Decision:** Two interfaces — `KnowledgeStore` (search-only) and `MutableKnowledgeStore` (search + write + delete). Stores implement whichever matches their capability.

**Why:** Avoiding optional methods at the interface level. A managed knowledge base that's externally populated (e.g., a pre-built Bedrock KB with company documentation) genuinely cannot accept writes — it shouldn't implement a `store()` method that throws. The split makes the type system reflect reality.

**Trade-off:** Two interfaces instead of one. We considered a single interface with optional `store`/`delete`, but that pushes runtime errors ("this store doesn't support writes") into what should be compile-time guarantees.

### 3.5 Active recall by default, passive injection opt-in

**Decision:** By default, MemoryManager registers `search_memory` and `store_memory` tools (active recall). Injection into the system prompt (passive recall) is disabled by default and opt-in via `injection: true`.

**Why:** Active recall lets the agent decide when memory is relevant — it searches when it needs context, not every turn. This is cheaper (no retrieval cost on irrelevant turns) and gives the agent control. Passive injection is useful for always-personalized agents (support bots, assistants) but adds retrieval latency and token cost to every model call.

**Trade-off:** Tool-based recall depends on the model knowing when to search. If the model doesn't call `search_memory` when it should, relevant context is missed. Injection guarantees baseline context at the cost of always paying for retrieval.

Only tools that have backing stores are registered. If no store has `'tool'` in its trigger, `store_memory` is not registered — `tools: true` means "register whatever tools are applicable," not "register all tools unconditionally."

### 3.5.1 Injection lifecycle

When injection is enabled, MemoryManager hooks into `BeforeInvocationEvent` (once per turn, not per model call) to manage injected content. The lifecycle is **strip → retrieve → format → inject**, executed fresh every turn.

**How it works:**

1. **Strip** — Remove the previous injection block from the system prompt (if present). Injected content is wrapped in a `<strands-memory>` sentinel so it can be identified and removed cleanly without colliding with user content.
2. **Retrieve** — Determine the search query (default: last substantive user message, walking backward, skipping messages under 10 characters). If no substantive message is found, skip injection for this turn entirely.
3. **Format** — Render results into an XML block, respecting the `maxTokens` budget. If retrieval returns zero results, skip injection (no empty block).
4. **Inject** — Append the formatted block to the end of the system prompt.

```
Turn N:
  BeforeInvocationEvent fires (once per invocation)
  → strip <strands-memory>...</strands-memory> from system prompt (from turn N-1)
  → find last substantive user message as query (skip if none found)
  → search stores, interleaving results by store priority + rank
  → if results empty, done (no block injected)
  → format results as XML, respecting maxTokens budget
  → append <strands-memory>...</strands-memory> to end of system prompt
  → model sees fresh, relevant memories
```

**Why strip and re-inject every turn:**
- Memories are query-dependent. The relevant memories for turn 5 may differ from turn 4.
- Prevents accumulation — injected content never grows unbounded across turns.
- Keeps the injected block ephemeral — it's never persisted in conversation history, only present in the model's view for that single call.

**Default format (XML):**

```xml
<strands-memory>
- user prefers dark mode
- last project was a React app for inventory management
- user is senior engineer, 10 years experience
</strands-memory>
```

The `<strands-memory>` sentinel is namespaced to avoid collisions with user-authored system prompt content. It provides clear boundary markers for the model and enables reliable stripping.

**Query selection** is configurable via `injection.query`:

```typescript
injection: { query: (messages) => customQueryLogic(messages) }
```

The default walks backward through messages to find the last `role: 'user'` message with > 10 characters. If nothing qualifies, injection is skipped for that turn (no retrieval, no block).

### 3.6 All writes are async and non-blocking

**Decision:** Store writes (ingestion) never block the agent loop. Writes are queued internally and flushed in the background.

**Why:** Memory ingestion is not on the critical path of a conversation. The user is waiting for the agent's response, not for a fact to be persisted. Bedrock Knowledge Bases reinforce this — `IngestKnowledgeBaseDocuments` returns HTTP 202 (accepted, not completed). Blocking on writes would add latency to every turn for no user-visible benefit.

**Trade-off:** A fact stored in one turn may not be searchable in the immediately following turn (eventual consistency). For most use cases this is acceptable — the information is still in L0 during the current session. Cross-session, it will have been indexed by the next conversation.

### 3.7 Extraction is per-store and optional

**Decision:** Each store has its own extractor (or none). The extractor transforms conversation messages into knowledge entries before ingestion. Extractor is optional on **all** triggers, not just `'tool'`.

**Why:** Different stores may need different extraction strategies. A personal preferences store wants terse facts ("user prefers dark mode"). A decisions store wants richer context ("chose React over Vue because of team expertise, 2026-05-14"). A store with `'tool'` trigger needs no extractor — the agent provides content directly.

**When no extractor is configured:** Messages are serialized to text (role-prefixed lines) and passed to `store()` as the content string. This supports managed service backends (e.g., AgentCore) that handle extraction server-side.

**`strands_source` metadata tag:** Every write is tagged to indicate content type:
- `'tool'` — agent explicitly called `store_memory`
- `'extraction'` — extractor processed messages into facts
- `'raw'` — messages serialized directly (no extractor)

**Trade-off:** Multiple extractors mean multiple model calls if several stores have `perTurn` triggers with extractors. We mitigate by making `'tool'` the cheapest trigger (no extraction cost) and `'scheduled'` a cost-controlled alternative to `'perTurn'`.

**Extractor input:** Extractors always receive only **unprocessed messages** — messages since the store's last extraction, not the full history. This is tracked via a per-store high-water mark (message index or turn ID).

### 3.8 Message filter on ingestion

**Decision:** `IngestionConfig` has a `filter: { exclude: ContentBlockType[] }` that strips specific content block types from messages before they reach the extractor or serializer.

**Why:** Tool machinery (toolUse, toolResult blocks) is typically noise for memory extraction — it's the conversation substance that matters, not the function calls. Filtering at the block level keeps the ingestion pipeline focused on semantically meaningful content.

**Default:** `exclude: ['toolUse', 'toolResult']` — strip tool blocks, keep text and other content. Override with `filter: { exclude: [] }` to forward everything.

**Lifecycle:** Filter always applies first — before extractor (if present) OR before serialization (if no extractor). Messages that become empty after filtering (all blocks excluded) are dropped entirely.

### 3.9 Deduplication via high-water mark

**Decision:** MemoryManager tracks a per-store high-water mark of processed messages. When any trigger fires, only messages beyond the mark are passed to the extractor. This prevents duplicate extraction when triggers overlap (e.g., `['perTurn', 'onEviction']` on the same store).

**Why:** Without deduplication, a store with both `perTurn` and `onEviction` triggers would extract the same messages twice — once per turn, and again when those messages are evicted. The high-water mark ensures each message is extracted at most once per store.

**Fail-safe direction:** If tracking state is lost (process restart, corruption), the worst case is a duplicate extraction — not data loss. Duplicates are acceptable; missed facts are not.

### 3.10 ModelExtractor defaults to cheapest model in same provider family

**Decision:** `ModelExtractor` detects the agent's model provider at init time and defaults to the cheapest model in that family. User can override with an explicit model.

**Why:** Extraction is a structured task — "given these messages, output a list of facts." It doesn't need the same capability as the agent's primary model. Defaulting to the agent's model would burn expensive tokens (e.g., Opus) on a task Haiku handles fine. Matching the provider avoids credential mismatches.

**Provider defaults:**
- `BedrockModel` → Claude Haiku via Bedrock
- `AnthropicModel` → Claude Haiku via Anthropic API
- `OpenAIModel` → gpt-4o-mini via OpenAI
- `GoogleModel` → Gemini Flash via Google

**Override:**
```typescript
extractor: new ModelExtractor({ model: new BedrockModel({ modelId: 'us.anthropic.claude-sonnet-4-6-20250514-v1:0' }) })
```

### 3.11 Delete is programmatic only — no agent tool

**Decision:** `MutableKnowledgeStore.delete()` is exposed for developers (compliance, cleanup, admin scripts) but no `delete_memory` tool is registered for the agent.

**Why:** Deletion is dangerous for an agent to perform autonomously. An agent that aggressively deletes old facts could lose valuable context. Corrections are better handled by storing updated facts — the newer entry naturally takes precedence via recency in search results.

### 3.12 Partial results on store failure

**Decision:** If a store's search fails, return partial results from stores that succeeded. Log the failure for observability. The model doesn't see the error.

**Why:** The model can't fix infrastructure failures — surfacing them adds noise. Partial results are better than no results. If all stores fail, the tool returns an empty array (same as "no results found").

### 3.13 `memoryManager` is a top-level Agent parameter only

**Decision:** `memoryManager` is a named parameter on `AgentConfig`. Passing MemoryManager via `plugins: [...]` throws with a helpful error.

**Why:** One clear path. `memoryManager` follows the pattern of `conversationManager` and `contextManager` — named constructor parameters for first-class agent capabilities. It's implemented as a plugin internally, but that's an implementation detail. Two paths to register the same thing creates ambiguity.

### 3.14 Custom triggers via direct store access

**Decision:** No custom trigger mechanism on MemoryManager. Users who need custom triggers hook directly into the store's `store()` method from their own hooks.

**Why:** The named triggers (`tool`, `perTurn`, `onEviction`, `scheduled`) cover 80% of use cases. For anything custom, the store interface is already public — the user holds a reference and can call `store.store()` from any hook. No new API surface needed. This is the low-level escape hatch alongside the high-level named triggers.

```typescript
const myStore = new BedrockKnowledgeBaseStore({ ... })

agent.addHook(AfterToolCallEvent, async (event) => {
  if (event.tool.name === 'important_api') {
    await myStore.store('user-123', `API result: ${summarize(event.result)}`)
  }
})
```

### 3.15 Namespace is a plain string

**Decision:** Namespace is an opaque string, not a structured type (no `{ userId, teamId, orgId }` hierarchy).

**Why:** Multi-tenancy patterns vary wildly. Some apps have users, some have workspaces, some have hierarchies. A structured namespace type would either be too narrow (missing someone's pattern) or too broad (everything optional, no guidance). A plain string with documented conventions (`"user-{id}"`, `"team-{id}"`) is maximally flexible.

**Trade-off:** No type safety on namespace values. Typos won't be caught at compile time. This is the same trade-off as route strings in web frameworks — acceptable given the flexibility benefit.

### 3.16 `search_memory` tool accepts optional `limit` parameter

**Decision:** The `search_memory` tool input schema includes an optional `limit` parameter so the model can control how many results it receives.

```typescript
// search_memory tool input
{ query: string, limit?: number }  // default: 10
```

**Why:** Per-store limits cap each store's contribution. The tool-level limit lets the model request fewer results when it only needs a quick check. No global limit on MemoryManager — limits belong on the query, not the orchestrator.

---

## 4. Developer Experience

### Minimal — prototyping

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

### Production — Bedrock Knowledge Bases

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

### Multi-tenant — personal + team + org

```typescript
const agent = new Agent({
  model,
  memoryManager: new MemoryManager({
    stores: [
      // Personal — learns from conversation
      { store: userKB, namespace: 'user-123', ingestion: { trigger: ['tool', 'perTurn'], extractor } },
      // Team — read-only, pre-populated
      { store: teamKB, namespace: 'team-marketing' },
      // Org — read-only, shared
      { store: orgKB, namespace: 'org-acme' },
    ],
  }),
})
// search_memory queries all three, merges by relevance score
// store_memory writes only to stores with 'tool' trigger
```

### With passive injection

```typescript
const agent = new Agent({
  model,
  memoryManager: new MemoryManager({
    stores: [{ store, namespace: 'user-123', ingestion: { trigger: 'tool' } }],
    injection: true,  // enables injection with default XML format and 2000 token budget
  }),
})
// Memories auto-injected into system prompt each turn + tools for on-demand search

// With custom budget:
injection: { maxTokens: 4000 }

// Power user — custom format function (escape hatch):
injection: { format: (entries) => myCustomFormat(entries), maxTokens: 2000 }
```

---

## 5. Relationship to Context Management

```typescript
new Agent({
  contextManager: "auto",       // Owns L0 ↔ L1 (within-session)
  memoryManager: new MemoryManager({ ... }),  // Owns L2 (cross-session)
})
```

The two primitives are independent — each is configured separately, each can exist without the other. The integration point is **eviction**: when `contextManager` evicts messages from L0 to L1, that's an opportunity for `memoryManager` to extract knowledge before it becomes harder to access.

### Integration via `OnEvictionEvent`

`contextManager` introduces an `OnEvictionEvent` hook that fires when messages are evicted from L0 to L1. MemoryManager subscribes to this event and routes the evicted messages to stores with `'onEviction'` in their trigger array.

```typescript
// contextManager fires:
hookRegistry.emit(new OnEvictionEvent({ messages: evictedMessages }))

// MemoryManager subscribes in initAgent():
hookRegistry.on(OnEvictionEvent, (event) => {
  this.onEviction(event.messages)
})
```

This keeps the two primitives decoupled — `contextManager` doesn't know about memory, it just announces eviction. MemoryManager listens if configured. If no `memoryManager` is present, the event fires with no subscribers and no cost.

---

## 6. Anticipated Questions

**Q: Should `search_memory` also search L1 (transcript)?**

No. L1 is within-session history owned by `contextManager`. If the agent needs to browse evicted messages from the current session, that's `contextManager`'s `searchHistory` tool (agentic mode). `search_memory` is cross-session knowledge — facts extracted and persisted beyond any single conversation. Mixing the two would blur the L1/L2 boundary.

**Q: Is a model call every turn (`perTurn` extraction) acceptable?**

It's the most complete strategy but the most expensive. The default for shipped examples should be `'tool'` (zero extraction cost — agent decides what to remember). `'perTurn'` is for high-value use cases where missing a fact is worse than the cost. `'scheduled'` (every N turns) is the middle ground.

**Q: What about Bedrock KB ingestion latency?**

Bedrock KB ingestion is async — content may not be immediately searchable after `store_memory`. This is acceptable because: (1) the stored fact is still in L0 for the current session, and (2) cross-session recall (where the latency matters) has a natural gap between conversations. We should document this clearly.

**Q: Why ship BedrockKnowledgeBaseStore in the SDK rather than as a separate package?**

It's the production-grade managed option that requires zero infrastructure setup from the user (no self-hosted vector DB). Aligns with "simple at any scale" — the path from `InMemoryKnowledgeStore` (prototyping) to `BedrockKnowledgeBaseStore` (production) should be changing one import, not adding a package.

**Q: How does AgentCore Memory fit?**

AgentCore ships as a separate package (`@strands-agents/memory-agentcore`) that implements `MutableKnowledgeStore`. It plugs into MemoryManager like any other store. No special integration needed — MemoryManager's injection, tools, and ingestion pipeline work with any store that implements the interface.

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
// Read-only — for managed or pre-populated backends
interface KnowledgeStore {
  search(namespace: string, query: string, limit?: number): Promise<KnowledgeEntry[]>
}

// Read+write — for self-managed backends
interface MutableKnowledgeStore extends KnowledgeStore {
  store(namespace: string, content: string, metadata?: Record<string, JSONValue>): Promise<string>
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
  extractor?: Extractor       // optional — if omitted, messages serialized as text
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
  tools?: boolean | ToolsConfig   // default: true — registers search_memory, store_memory
  injection?: boolean | InjectionConfig  // default: false — opt-in passive recall
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
  ingestion: IngestionConfig  // required — determines when writes happen
}

interface InjectionConfig {
  format?: (entries: KnowledgeEntry[]) => string  // default: XML block format
  maxTokens?: number          // budget for injected content (default: 2000)
  query?: (messages: MessageData[]) => string     // default: last substantive user message
}
```

**`tools` resolution:**
- `true` (default) — registers both `search_memory` and `store_memory`
- `false` — no tools registered (use with injection-only)
- `{ search: true, store: false }` — search only, no agent-driven writes
- `{ search: { name: 'recall' } }` — rename tool to avoid conflicts
- `{ store: { description: '...' } }` — customize tool description

**Default tool descriptions:**
- `search_memory`: "Search long-term memory for facts, preferences, or context from previous conversations. Use when you need background about the user or topic that may have been discussed before."
- `store_memory`: "Store facts, preferences, or decisions that should be remembered across conversations. Use when the user shares something worth recalling later."

**`injection` resolution:**
- `false` (default) — no injection
- `true` — injection enabled with default XML format and 2000 token budget
- `{ maxTokens: 4000 }` — injection with custom budget
- `{ format: customFn }` — injection with custom format (escape hatch)

### Ingestion Triggers

| Trigger | When | Input | Cost |
|---------|------|-------|------|
| `tool` | Agent calls `store_memory` | Agent-provided content | None (no extraction) |
| `perTurn` | After every invocation | New messages from this turn | High (model call per turn) |
| `onEviction` | Messages evicted from L0 | Evicted messages | Medium (only on eviction) |
| `scheduled` | Every N turns | Unprocessed messages | Controllable |

</details>

---

<details>
<summary><b>Appendix B: Storage Backends</b></summary>

### Shipped in SDK

| Backend | Use case | Dependencies |
|---------|----------|-------------|
| `InMemoryKnowledgeStore` | Testing, prototyping | None |
| `FileKnowledgeStore` | Local development | None (node:fs) |
| `BedrockKnowledgeBaseStore` | Production | `@aws-sdk/client-bedrock-agent-runtime`, `@aws-sdk/client-bedrock-agent` |

### Why Bedrock Knowledge Bases for the built-in production path

- **Managed embeddings** — zero config, no model selection needed
- **Async writes** — `IngestKnowledgeBaseDocuments` returns HTTP 202, aligns with non-blocking design
- **Search** — Retrieve API with metadata filtering, reranking, guardrails
- **Delete** — `DeleteKnowledgeBaseDocuments` API for compliance/cleanup

### External packages (community / future)

| Package | Backend |
|---------|---------|
| `@strands-agents/memory-agentcore` | AgentCore Memory |
| `@strands-agents/memory-pinecone` | Pinecone |
| `@strands-agents/memory-postgres` | pgvector |
| `@strands-agents/memory-opensearch` | OpenSearch (BM25 + vector) |

</details>

---

<details>
<summary><b>Appendix C: Alternatives Considered</b></summary>

### Memory as a top-level Agent parameter (no MemoryManager class)

```typescript
new Agent({
  memory: { stores: [...], injection: {...} },
})
```

**Why rejected:** A config object doesn't provide methods (`search`, `store`, `flush`) that power users need for programmatic access. The class also owns the ingestion queue lifecycle.

### Single store (no multi-store orchestration)

```typescript
new Agent({
  memoryManager: new MemoryManager({ store: myStore, namespace: 'user-123' }),
})
```

**Why rejected:** Forces multi-tenant patterns onto the developer. A support agent that needs personal + team + org knowledge would need three separate MemoryManagers or a custom wrapper. Multi-store is the 80% case for production agents.

### Explicit `readOnly` flag instead of ingestion-determines-writability

```typescript
{ store: teamKB, namespace: 'team-marketing', readOnly: true }
```

**Why rejected:** Redundant signal. If there's no ingestion config, there's nothing to trigger writes. Two signals for one decision creates confusion about which wins when they conflict.

### Single `KnowledgeStore` interface with optional write methods

```typescript
interface KnowledgeStore {
  search(...): Promise<KnowledgeEntry[]>
  store?(...): Promise<string>
  delete?(...): Promise<void>
}
```

**Why rejected:** Optional methods push type safety to runtime. A developer implementing a read-only store for a managed KB would need to either leave methods unimplemented (confusing) or implement them as no-ops/throws (surprising). The interface split makes the contract explicit.

### Injection enabled by default

**Why rejected:** Adds retrieval latency and token cost to every model call. Most conversations don't need memory context on every turn. Active recall (tools) is cheaper and gives the agent control. Users who want always-on personalization opt in.

### Injection `format` as a required function (no default format)

```typescript
injection: {
  format: (entries) => `<memory>\n${entries.map(e => `- ${e.content}`).join('\n')}\n</memory>`,
  maxTokens: 2000,
}
```

**Why rejected:** Forces every user to write a formatting function even though 90% want the same XML-tagged block. The simple path (`injection: true`) should work without ceremony. Power users who need custom rendering can provide a `format` function as an escape hatch.

### Global extractor instead of per-store

```typescript
new MemoryManager({
  extractor: new ModelExtractor(),  // applies to all stores
  stores: [...],
})
```

**Why rejected:** Different stores often want different extraction granularity. A preferences store wants terse facts; a decisions store wants richer context. Per-store extractors allow this without a routing layer.

</details>
