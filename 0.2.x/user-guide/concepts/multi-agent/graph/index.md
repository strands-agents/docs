# Agent Graphs: Building Multi-Agent Systems

An agent graph is a structured network of interconnected AI agents designed to solve complex problems through coordinated collaboration. Each agent represents a specialized node with specific capabilities, and the connections between agents define explicit communication pathways.

```
graph TD
    A[Research Agent] --> B[Analysis Agent]
    A --> C[Fact-Checking Agent]
    B --> D[Report Agent]
    C --> D
```

Agent graphs provide precise control over information flow, allowing developers to create sophisticated multi-agent systems with predictable behavior patterns and specialized agent roles.

### Components of an Agent Graph

An agent graph consists of three primary components:

#### 1. Nodes (Agents)

Nodes represent individual AI agents with:

- **Identity**: Unique identifier within the graph
- **Role**: Specialized function or purpose
- **System Prompt**: Instructions defining the agent's behavior
- **Tools**: Capabilities available to the agent
- **Message Queue**: Buffer for incoming communications

#### 2. Edges (Connections)

Edges define the communication pathways between agents:

```
- **Direction**: One-way or bidirectional information flow
- **Relationship**: How agents relate to each other (e.g., supervisor/worker)
- **Message Passing**: The mechanism for transferring information

```

#### 3. Topology Patterns

##### Star Topology

A central coordinator with radiating specialists, ideal for centralized workflows like content creation with editorial oversight or customer service with escalation paths.

```
graph TD
    Coordinator[Coordinator]
    Specialist1[Specialist 1]
    Specialist2[Specialist 2]
    Specialist3[Specialist 3]

    Coordinator --> Specialist1
    Coordinator --> Specialist2
    Coordinator --> Specialist3
```

##### Mesh Topology

Fully connected network where all agents can communicate directly with each other, ideal for collaborative problem-solving, debates, and consensus-building.

```
graph TD
    AgentA[Agent A]
    AgentB[Agent B]
    AgentC[Agent C]
    AgentD[Agent D]
    AgentE[Agent E]

    AgentA <--> AgentB
    AgentA <--> AgentC
    AgentB <--> AgentC
    AgentC <--> AgentD
    AgentC <--> AgentE
    AgentD <--> AgentE
```

##### Hierarchical Topology

Tree structure with parent-child relationships, ideal for layered processing, project management with task delegation, and multi-level review processes.

```
graph TD
    Executive[Executive]
    Manager1[Manager 1]
    Manager2[Manager 2]
    Worker1[Worker 1]
    Worker2[Worker 2]
    Worker3[Worker 3]
    Worker4[Worker 4]

    Executive --> Manager1
    Executive --> Manager2
    Manager1 --> Worker1
    Manager1 --> Worker2
    Manager2 --> Worker3
    Manager2 --> Worker4
```

### When to Use Agent Graphs

Agent graphs are ideal for:

1. **Complex Communication Patterns**: Custom topologies and interaction patterns
1. **Persistent Agent State**: Long-running agent networks that maintain context
1. **Specialized Agent Roles**: Different agents with distinct capabilities
1. **Fine-Grained Control**: Precise management of information flow

## Implementing Agent Graphs with Strands

### Hierarchical Agent Graph Example

To illustrate the hierarchical topology pattern discussed above, the following example implements a three-level organizational structure with specialized roles. This hierarchical approach demonstrates one of the key topology patterns for agent graphs, showing how information flows through a tree-like structure with clear parent-child relationships.

```
graph TD
    A((Executive<br>Coordinator)) --> B((Economic<br>Department))
    A --> C((Technical<br>Analyst))
    A --> D((Social<br>Analyst))
    B --> E((Market<br>Research))
    B --> F((Financial<br>Analysis))

    E -.-> B
    F -.-> B
    B -.-> A
    C -.-> A
    D -.-> A
```

#### 1. Level 1 - Executive Coordinator

```
from strands import Agent, tool

# Level 1 - Executive Coordinator
COORDINATOR_SYSTEM_PROMPT = """You are an executive coordinator who oversees complex analyses across multiple domains.
For economic questions, use the economic_department tool.
For technical questions, use the technical_analysis tool.
For social impact questions, use the social_analysis tool.
Synthesize all analyses into comprehensive executive summaries.

Your process should be:
1. Determine which domains are relevant to the query (economic, technical, social)
2. Collect analysis from each relevant domain using the appropriate tools
3. Synthesize the information into a cohesive executive summary
4. Present findings with clear structure and organization

Always consider multiple perspectives and provide balanced, well-rounded assessments.
"""

# Create the coordinator agent with all tools
coordinator = Agent(
    system_prompt=COORDINATOR_SYSTEM_PROMPT,
    tools=[economic_department, technical_analysis, social_analysis],
    callback_handler=None
)

# Process a complex task through the hierarchical agent graph
def process_complex_task(task):
    """Process a complex task through the multi-level hierarchical agent graph"""
    return coordinator(f"Provide a comprehensive analysis of: {task}")

```

#### 2. Level 2 - Mid-level Manager Agent

```
# Level 2 - Mid-level Manager Agent with its own specialized tools
@tool
def economic_department(query: str) -> str:
    """Coordinate economic analysis across market and financial domains."""
    print("📈 Economic Department coordinating analysis...")
    econ_manager = Agent(
        system_prompt="""You are an economic department manager who coordinates specialized economic analyses.
        For market-related questions, use the market_research tool.
        For financial questions, use the financial_analysis tool.
        Synthesize the results into a cohesive economic perspective.

        Important: Make sure to use both tools for comprehensive analysis unless the query is clearly focused on just one area.
        """,
        tools=[market_research, financial_analysis],
        callback_handler=None
    )
    return str(econ_manager(query))

```

#### 3. Level 3 - Specialized Analysis Agents

```
# Level 3 - Specialized Analysis Agents
@tool
def market_research(query: str) -> str:
    """Analyze market trends and consumer behavior."""
    print("🔍 Market Research Specialist analyzing...")
    market_agent = Agent(
        system_prompt="You are a market research specialist who analyzes consumer trends, market segments, and purchasing behaviors. Provide detailed insights on market conditions, consumer preferences, and emerging trends.",
        callback_handler=None
    )
    return str(market_agent(query))

@tool
def financial_analysis(query: str) -> str:
    """Analyze financial aspects and economic implications."""
    print("💹 Financial Analyst processing...")
    financial_agent = Agent(
        system_prompt="You are a financial analyst who specializes in economic forecasting, cost-benefit analysis, and financial modeling. Provide insights on financial viability, economic impacts, and budgetary considerations.",
        callback_handler=None
    )
    return str(financial_agent(query))

@tool
def technical_analysis(query: str) -> str:
    """Analyze technical feasibility and implementation challenges."""
    print("⚙️ Technical Analyst evaluating...")
    tech_agent = Agent(
        system_prompt="You are a technology analyst who evaluates technical feasibility, implementation challenges, and emerging technologies. Provide detailed assessments of technical aspects, implementation requirements, and potential technological hurdles.",
        callback_handler=None
    )
    return str(tech_agent(query))

@tool
def social_analysis(query: str) -> str:
    """Analyze social impacts and behavioral implications."""
    print("👥 Social Impact Analyst investigating...")
    social_agent = Agent(
        system_prompt="You are a social impact analyst who focuses on how changes affect communities, behaviors, and social structures. Provide insights on social implications, behavioral changes, and community impacts.",
        callback_handler=None
    )
    return str(social_agent(query))

```

This implementation demonstrates a hierarchical agent graph architecture where:

1. **Multi-Level Hierarchy**: Three distinct levels form a clear organizational structure:

   - Level 1: Executive Coordinator oversees the entire analysis process
   - Level 2: Department Manager (Economic Department) coordinates its own team of specialists
   - Level 3: Specialist Analysts provide domain-specific expertise

1. **Tool-Based Communication**: Agents communicate through the tool mechanism, where higher-level agents invoke lower-level agents as tools, creating a structured information flow path.

1. **Nested Delegation**: The Executive Coordinator delegates to both the Economic Department and individual specialists. The Economic Department further delegates to its own specialists, demonstrating nested responsibility.

1. **Specialized Domains**: Each branch focuses on different domains (economic, technical, social), with the Economic Department having its own sub-specialties (market research and financial analysis).

1. **Information Synthesis**: Each level aggregates and synthesizes information from lower levels before passing it upward, adding value at each stage of the hierarchy.

## Using the Agent Graph Tool

Strands Agents SDK provides a built-in `agent_graph` tool that simplifies multi-agent system implementation. The full implementation can be found in the [Strands Tools repository](https://github.com/strands-agents/tools/blob/main/src/strands_tools/agent_graph.py).

### Creating and Using Agent Graphs

```
from strands import Agent
from strands_tools import agent_graph

# Create an agent with agent_graph capability
agent = Agent(tools=[agent_graph])

# Create a research team with a star topology
result = agent.tool.agent_graph(
    action="create",
    graph_id="research_team",
    topology={
        "type": "star",
        "nodes": [
            {
                "id": "coordinator",
                "role": "team_lead",
                "system_prompt": "You are a research team leader coordinating specialists."
            },
            {
                "id": "data_analyst",
                "role": "analyst",
                "system_prompt": "You are a data analyst specializing in statistical analysis."
            },
            {
                "id": "domain_expert",
                "role": "expert",
                "system_prompt": "You are a domain expert with deep subject knowledge."
            }
        ],
        "edges": [
            {"from": "coordinator", "to": "data_analyst"},
            {"from": "coordinator", "to": "domain_expert"},
            {"from": "data_analyst", "to": "coordinator"},
            {"from": "domain_expert", "to": "coordinator"}
        ]
    }
)

# Send a task to the coordinator
agent.tool.agent_graph(
    action="message",
    graph_id="research_team",
    message={
        "target": "coordinator",
        "content": "Analyze the impact of remote work on productivity."
    }
)

```

### Key Actions

The agent_graph tool supports five primary actions:

1. **create**: Build a new agent network with the specified topology
1. **message**: Send information to a specific agent in the network
1. **status**: Check the current state of an agent network
1. **list**: View all active agent networks
1. **stop**: Terminate an agent network when it's no longer needed

## Conclusion

Agent graphs provide a structured approach to building multi-agent systems with precise control over information flow and agent interactions. By organizing agents into topologies like star, mesh, or hierarchical patterns, developers can create sophisticated systems tailored to specific tasks. The Strands Agents SDK supports both custom implementations through tool-based communication and simplified creation via the agent_graph tool. Whether implementing specialized hierarchies with nested delegation or dynamic networks with persistent state, agent graphs enable complex problem-solving through coordinated collaboration of specialized AI agents working within well-defined communication pathways.
