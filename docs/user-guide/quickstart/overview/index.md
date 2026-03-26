The Strands Agents SDK empowers developers to quickly build, manage, evaluate and deploy AI-powered agents. These quick start guides get you set up and running a simple agent in less than 20 minutes.

<div class="sl-link-card astro-mf7fz2mj"> <span class="sl-flex stack astro-mf7fz2mj"> <a href="../python/" class="astro-mf7fz2mj"> <span class="title astro-mf7fz2mj">Python Quickstart</span> </a> <span class="description astro-mf7fz2mj">Create your first Python Strands agent with full feature access!</span> </span> <svg aria-hidden="true" class="icon rtl:flip astro-mf7fz2mj astro-c6vsoqas" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="--sl-icon-size: 1.333em;"><path d="M17.92 11.62a1.001 1.001 0 0 0-.21-.33l-5-5a1.003 1.003 0 1 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1.002 1.002 0 0 0 .325 1.639 1 1 0 0 0 1.095-.219l5-5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76Z"/></svg> </div><div class="sl-link-card astro-mf7fz2mj"> <span class="sl-flex stack astro-mf7fz2mj"> <a href="../typescript/" class="astro-mf7fz2mj"> <span class="title astro-mf7fz2mj">TypeScript Quickstart</span> </a> <span class="description astro-mf7fz2mj">Create your first TypeScript Strands agent!</span> </span> <svg aria-hidden="true" class="icon rtl:flip astro-mf7fz2mj astro-c6vsoqas" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="--sl-icon-size: 1.333em;"><path d="M17.92 11.62a1.001 1.001 0 0 0-.21-.33l-5-5a1.003 1.003 0 1 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1.002 1.002 0 0 0 .325 1.639 1 1 0 0 0 1.095-.219l5-5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76Z"/></svg> </div>

---

## Language support

Strands Agents SDK is available in both Python and TypeScript.

### Feature availability

The table below compares feature availability between the Python and TypeScript SDKs.

| Category | Feature | Python | TypeScript |
| --- | --- | --- | --- |
| **Core** | [Agent creation and invocation](/docs/user-guide/concepts/agents/agent-loop/index.md) | ✅ | ✅ |
|  | [Streaming responses](/docs/user-guide/concepts/streaming/index.md) | ✅ | ✅ |
|  | [Structured output](/docs/user-guide/concepts/agents/structured-output/index.md) | ✅ | ✅ |
| **Model providers** | [Amazon Bedrock](/docs/user-guide/concepts/model-providers/amazon-bedrock/index.md) | ✅ | ✅ |
|  | [OpenAI](/docs/user-guide/concepts/model-providers/openai/index.md) | ✅ | ✅ |
|  | [Anthropic](/docs/user-guide/concepts/model-providers/anthropic/index.md) | ✅ | ✅ |
|  | [Google](/docs/user-guide/concepts/model-providers/google/index.md) | ✅ | ✅ |
|  | [Ollama](/docs/user-guide/concepts/model-providers/ollama/index.md) | ✅ | ❌ |
|  | [LiteLLM](/docs/user-guide/concepts/model-providers/litellm/index.md) | ✅ | ❌ |
|  | [Custom providers](/docs/user-guide/concepts/model-providers/custom_model_provider/index.md) | ✅ | ✅ |
|  | [Additional providers](/docs/user-guide/concepts/model-providers/index.md) | 5+ | 1+ |
| **Tools** | [Custom function tools](/docs/user-guide/concepts/tools/custom-tools/index.md) | ✅ | ✅ |
|  | [MCP (Model Context Protocol)](/docs/user-guide/concepts/tools/mcp-tools/index.md) | ✅ | ✅ |
|  | [Built-in tools](/docs/user-guide/concepts/tools/community-tools-package/index.md) | 30+ via community package | 4 built-in |
| **Conversation** | [Null manager](/docs/user-guide/concepts/agents/conversation-management/index.md) | ✅ | ✅ |
|  | [Sliding window manager](/docs/user-guide/concepts/agents/conversation-management/index.md) | ✅ | ✅ |
|  | [Summarizing manager](/docs/user-guide/concepts/agents/conversation-management/index.md) | ✅ | ❌ |
| **Hooks** | [Lifecycle hooks](/docs/user-guide/concepts/agents/hooks/index.md) | ✅ | ✅ |
|  | [Custom hook providers](/docs/user-guide/concepts/agents/hooks/index.md) | ✅ | ✅ |
| **Multi-agent** | [Swarms](/docs/user-guide/concepts/multi-agent/swarm/index.md) | ✅ | ✅ |
|  | [Graphs](/docs/user-guide/concepts/multi-agent/graph/index.md) | ✅ | ✅ |
|  | [Workflows](/docs/user-guide/concepts/multi-agent/workflow/index.md) | ✅ | ✅ |
|  | [Agents as tools](/docs/user-guide/concepts/multi-agent/agents-as-tools/index.md) | ✅ | ✅ |
|  | [Agent-to-Agent (A2A)](/docs/user-guide/concepts/multi-agent/agent-to-agent/index.md) | ✅ | ✅ |
| **Session management** | [File, S3, repository managers](/docs/user-guide/concepts/agents/session-management/index.md) | ✅ | ✅ |
| **Observability** | [OpenTelemetry integration](/docs/user-guide/observability-evaluation/observability/index.md) | ✅ | ✅ |
| **Experimental** | [Bidirectional streaming](/docs/user-guide/concepts/bidirectional-streaming/quickstart/index.md) | ✅ | ❌ |
|  | [Agent steering](/docs/user-guide/concepts/plugins/steering/index.md) | ✅ | ❌ |