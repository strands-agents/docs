# Get started

The Strands Agents SDK empowers developers to quickly build, manage, evaluate and deploy AI-powered agents. These quick start guides get you set up and running a simple agent in less than 20 minutes.

## Language Support

Strands Agents SDK is available in both Python and TypeScript. The Python SDK is mature and production-ready with comprehensive feature coverage. The TypeScript SDK is experimental and focuses on core agent functionality.

### Feature Availability Matrix

The table below shows feature availability across both SDKs. Python is the primary SDK with complete feature coverage, while TypeScript provides essential agent capabilities with ongoing development.

| Feature Category | Feature | Python | TypeScript | Notes |
|------------------|---------|--------|------------|-------|
| **Core Agent** | Basic agent creation | ✅ | ✅ | |
| | Agent invocation | ✅ | ✅ | |
| | Streaming responses | ✅ | ✅ | |
| | Agent state management | ✅ | ✅ | |
| | Structured output | ✅ | ❌ | TypeScript support planned |
| **Model Providers** | Amazon Bedrock | ✅ | ✅ | |
| | OpenAI | ✅ | ✅ | |
| | Anthropic | ✅ | ❌ | |
| | Google Gemini | ✅ | ❌ | |
| | LiteLLM | ✅ | ❌ | |
| | Ollama | ✅ | ❌ | |
| | Mistral | ✅ | ❌ | |
| | Llama API | ✅ | ❌ | |
| | SageMaker | ✅ | ❌ | |
| | Writer | ✅ | ❌ | |
| | Custom providers | ✅ | ❌ | |
| **Tools & Extensions** | Custom function tools | ✅ | ✅ | |
| | MCP (Model Context Protocol) | ✅ | ✅ | |
| | Built-in vended tools | Community package | 4 built-in tools | bash, file_editor, http_request, notebook |
| | Tool executors (sequential/concurrent) | ✅ | ❌ | |
| | Hot tool reloading | ✅ | ❌ | |
| | Automatic tool loading | ✅ | ❌ | |
| **Conversation Management** | Null conversation manager | ✅ | ✅ | |
| | Sliding window manager | ✅ | ✅ | |
| | Summarizing conversation manager | ✅ | ❌ | |
| **Multi-Agent Patterns** | Agent swarm | ✅ | ❌ | |
| | Agent workflows | ✅ | ❌ | |
| | Agent graphs | ✅ | ❌ | |
| | Agent-to-agent communication | ✅ | ❌ | |
| | Agents as tools | ✅ | ❌ | |
| **Session Management** | File session manager | ✅ | ❌ | |
| | S3 session manager | ✅ | ❌ | |
| | Repository session manager | ✅ | ❌ | |
| | Custom session managers | ✅ | ❌ | |
| **Observability** | OpenTelemetry traces | ✅ | ❌ | |
| | Metrics collection | ✅ | ❌ | |
| | Custom telemetry | ✅ | ❌ | |
| **Hooks & Lifecycle** | Agent lifecycle hooks | ✅ | ✅ | |
| | Custom hook providers | ✅ | ✅ | |
| | Multi-agent hooks | ✅ | ❌ | Experimental in Python |
| **Experimental Features** | Bidirectional streaming | ✅ | ❌ | Real-time voice/audio agents |
| | Agent steering | ✅ | ❌ | Dynamic behavior modification |
| | Agent configuration | ✅ | ❌ | Runtime configuration management |
| **Interrupts & Control** | Agent interrupts | ✅ | ❌ | Graceful stopping and resumption |
| | Context overflow handling | ✅ | ❌ | |
| **Development Tools** | Debug logging | ✅ | ✅ | |
| | Agent builder | ✅ | ❌ | AI-powered agent generation |
| | Community tools package | ✅ | ❌ | 30+ production-ready tools |

!!! tip "Choosing the Right SDK"
    **Choose Python if you need:**
    
    - Production deployments with full observability
    - Multi-agent orchestration patterns
    - Session management and persistence
    - Comprehensive model provider support
    - The complete ecosystem of tools and extensions
    
    **Choose TypeScript if you need:**
    
    - Browser-based agent applications
    - Node.js/Deno/Bun runtime environments  
    - Simple agent workflows with core functionality
    - Integration with existing TypeScript codebases

### SDK Development Status

**Python SDK:** Stable and production-ready. Receives regular updates with new features, model providers, and community contributions.

**TypeScript SDK:** Experimental with active development. Breaking changes are expected as the API stabilizes. The roadmap includes expanding model provider support, adding multi-agent patterns, and implementing session management.

## :material-language-python: **Python Quickstart**

Create your first Python Strands agent with full feature access!

[**→ Start with Python**](python.md)

---

## :material-language-typescript: **TypeScript Quickstart**

!!! info "Experimental SDK"
    The TypeScript SDK is experimental with limited feature coverage compared to Python.

Create your first TypeScript Strands agent!

[**→ Start with TypeScript**](typescript.md)
