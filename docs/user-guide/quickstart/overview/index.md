The Strands Agents SDK empowers developers to quickly build, manage, evaluate and deploy AI-powered agents. These quick start guides get you set up and running a simple agent in less than 20 minutes.

[Python Quickstart](../python/index.md) Create your first Python Strands agent with full feature access!

[TypeScript Quickstart (Experimental)](../typescript/index.md) Create your first TypeScript Strands agent!

---

## Language support

Strands Agents SDK is available in both Python and TypeScript. The Python SDK is mature and production-ready with comprehensive feature coverage. The TypeScript SDK is experimental and focuses on core agent functionality.

### Feature availability

The table below compares feature availability between the Python and TypeScript SDKs.

| Category | Feature | Python | TypeScript |
| --- | --- | --- | --- |
| **Core** | Agent creation and invocation | ✅ | ✅ |
|  | Streaming responses | ✅ | ✅ |
|  | Structured output | ✅ | ❌ |
| **Model providers** | Amazon Bedrock | ✅ | ✅ |
|  | OpenAI | ✅ | ✅ |
|  | Anthropic | ✅ | ❌ |
|  | Ollama | ✅ | ❌ |
|  | LiteLLM | ✅ | ❌ |
|  | Custom providers | ✅ | ✅ |
| **Tools** | Custom function tools | ✅ | ✅ |
|  | MCP (Model Context Protocol) | ✅ | ✅ |
|  | Built-in tools | 30+ via community package | 4 built-in |
| **Conversation** | Null manager | ✅ | ✅ |
|  | Sliding window manager | ✅ | ✅ |
|  | Summarizing manager | ✅ | ❌ |
| **Hooks** | Lifecycle hooks | ✅ | ✅ |
|  | Custom hook providers | ✅ | ✅ |
| **Multi-agent** | Swarms | ✅ | ✅ |
|  | Graphs | ✅ | ✅ |
|  | Workflows | ✅ | ✅ |
|  | Agents as tools | ✅ | ✅ |
|  | Agent-to-Agent (A2A) | ✅ | ✅ |
| **Session management** | File, S3, repository managers | ✅ | ❌ |
| **Observability** | OpenTelemetry integration | ✅ | ❌ |
| **Experimental** | Bidirectional streaming | ✅ | ❌ |
|  | Agent steering | ✅ | ❌ |