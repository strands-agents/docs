export const features = [
  // Give it tools
  {
    title: "Tools from Any Function",
    description: "Turn any function into an agent tool with @tool. The docstring becomes the LLM's tool description. No schema files, no registration boilerplate.",
    code: `# Any function becomes a tool
@tool
def search_db(query: str) -> list:
    """Search the product database."""
    return db.search(query)`,
  },
  {
    title: "Native MCP Support",
    description: "Connect to any MCP server. Use thousands of community tools without writing integration code.",
    code: `# Connect to any MCP server
from strands.tools.mcp import MCPClient
from mcp import stdio_client, StdioServerParameters

mcp = MCPClient(lambda: stdio_client(
    StdioServerParameters(
        command="uvx",
        args=["my-mcp-server"],
    )
))`,
  },
  // Let it scale
  {
    title: "Multi-Agent Systems",
    description: "Compose agents with graphs, swarms, workflows, or simple agent-as-tool patterns. Built-in A2A protocol support for distributed systems.",
    code: `# Agents as tools for other agents
@tool
def research(query: str) -> str:
    """Research a topic thoroughly."""
    agent = Agent(tools=[search_web])
    return str(agent(query))

writer = Agent(tools=[research])
writer("Write a post about AI agents")`,
  },
  {
    title: "Agent Skills",
    description: "Load modular instructions on demand. Skills activate when needed instead of bloating the system prompt. Define them as files or code, attach via plugin.",
    code: `# Load skills on demand
from strands.vended_plugins.skills import (
    AgentSkills, Skill,
)

plugin = AgentSkills(skills=[
    "./skills/pdf-processing",
    "./skills/data-analysis",
])

agent = Agent(plugins=[plugin])`,
  },
  // Give it context
  {
    title: "Conversation Memory",
    description: "Sliding window, summarization, and session persistence out of the box. Manage context across long conversations without manual token counting.",
    code: `# Manage context automatically
from strands.agent.conversation_manager import (
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
    code: `# Traces with zero config
from strands import Agent

agent = Agent(trace_attributes={
    "service": "my-app",
    "env": "production",
})`,
  },
  // Keep it honest
  {
    title: "Approve Before It Acts",
    description: "Require human approval before sensitive tool calls. The agent pauses mid-task, waits for a response, then continues or cancels. No external workflow engine needed.",
    code: `# Pause for approval before sending
from strands.hooks import BeforeToolCallEvent

def require_approval(event: BeforeToolCallEvent):
    if event.tool_use["name"] == "send_email":
        event.interrupt(
            "email_approval",
            reason="Approve this email?"
        )

agent = Agent(tools=[send_email])
agent.add_hook(require_approval)`,
  },
  {
    title: "Evaluation SDK",
    description: "Test your agent against scenarios before shipping. Define cases, pick evaluators, run experiments. Measure accuracy, tool selection, and output quality.",
    code: `# Test agent behavior at scale
from strands_evals import Case, Experiment
from strands_evals.evaluators import OutputEvaluator

cases = [
    Case(name="accuracy",
         input="What is 2+2?",
         expected_output="4"),
]

experiment = Experiment(
    cases=cases,
    evaluators=[OutputEvaluator()],
)
reports = experiment.run_evaluations(my_agent)`,
  },
]
