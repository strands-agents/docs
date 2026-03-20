export const features = [
  {
    title: "Any Model Provider",
    description: "Bedrock, OpenAI, Anthropic, Ollama, LiteLLM. Swap providers with a single line. Your agent code doesn't change.",
    code: `from strands.models.openai import OpenAIModel

agent = Agent(model=OpenAIModel(
    model_id="gpt-4o"
))`,
  },
  {
    title: "Tools from Any Function",
    description: "Turn any function into an agent tool with @tool. The docstring becomes the LLM's tool description. No schema files, no registration boilerplate.",
    code: `@tool
def search_db(query: str) -> list:
    """Search the product database."""
    return db.search(query)`,
  },
  {
    title: "Native MCP Support",
    description: "Connect to any MCP server. Use thousands of community tools without writing integration code.",
    code: `from strands.tools.mcp import MCPClient
from mcp import stdio_client, StdioServerParameters

mcp = MCPClient(lambda: stdio_client(
    StdioServerParameters(
        command="uvx",
        args=["my-mcp-server"],
    )
))`,
  },
  {
    title: "Multi-Agent Systems",
    description: "Compose agents with graphs, swarms, workflows, or simple agent-as-tool patterns. Built-in A2A protocol support for distributed systems.",
    code: `@tool
def research(query: str) -> str:
    """Research a topic thoroughly."""
    agent = Agent(tools=[search_web])
    return str(agent(query))

writer = Agent(tools=[research])
writer("Write a post about AI agents")`,
  },
  {
    title: "Conversation Memory",
    description: "Sliding window, summarization, and session persistence out of the box. Manage context across long conversations without manual token counting.",
    code: `from strands.agent.conversation_manager import (
    SlidingWindowConversationManager,
)

agent = Agent(
    conversation_manager=SlidingWindowConversationManager(
        window_size=5
    ),
)`,
  },
  {
    title: "Built-in Observability",
    description: "OpenTelemetry traces, metrics, and logs with no extra instrumentation. See every tool call, model invocation, and token count.",
    code: `from strands import Agent

agent = Agent(trace_attributes={
    "service": "my-app",
    "env": "production",
})`,
  },
]
